import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/database.types"
import { requireUserFromRequest } from "@/lib/requestAuth"

type UpdateBody = {
  name?: string
  role?: string
  bio?: string
  phone?: string
  github?: string
  profile_image?: string
}

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const IMAGE_DATA_URL_REGEX = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0

const sanitizeFileName = (fileName: string) =>
  fileName
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9._-]/g, "")
    .slice(-80)

const ensureFreelancerBucket = async () => {
  const bucketName = "freelancers"
  const { data: bucket, error: bucketError } = await supabase.storage.getBucket(bucketName)

  if (!bucketError && bucket) {
    return bucketName
  }

  const { error: createError } = await supabase.storage.createBucket(bucketName, {
    public: true,
    fileSizeLimit: 5 * 1024 * 1024,
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"],
  })

  if (createError && !createError.message.toLowerCase().includes("already")) {
    throw new Error(createError.message)
  }

  return bucketName
}

const uploadProfileImage = async (imageDataUrl: string, imageName: string) => {
  const match = imageDataUrl.match(IMAGE_DATA_URL_REGEX)
  if (!match) {
    throw new Error("Invalid profile image data")
  }

  const [, mimeType, base64Data] = match
  const bucketName = await ensureFreelancerBucket()
  const cleanFileName = sanitizeFileName(imageName || "profile") || "profile"
  const filePath = `profiles/${crypto.randomUUID()}-${cleanFileName}`

  const fileBuffer = Buffer.from(base64Data, "base64")

  const { error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(filePath, fileBuffer, {
      contentType: mimeType,
      upsert: false,
    })

  if (uploadError) {
    throw new Error(uploadError.message)
  }

  const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath)
  return data.publicUrl
}

export async function GET(req: NextRequest) {
  const auth = await requireUserFromRequest(req)
  if (!auth.ok) {
    return auth.response
  }

  const { data, error } = await supabase
    .from("freelancers")
    .select("id, user_id, name, role, bio, profile_image, phone, github, status, email")
    .eq("user_id", auth.user.id)
    .limit(1)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!data) {
    return NextResponse.json({ error: "Freelancer profile not found" }, { status: 404 })
  }

  return NextResponse.json({ data })
}

export async function PATCH(req: NextRequest) {
  const auth = await requireUserFromRequest(req)
  if (!auth.ok) {
    return auth.response
  }

  try {
    const body = (await req.json()) as UpdateBody

    const updatePayload: Database["public"]["Tables"]["freelancers"]["Update"] = {}

    if (isNonEmptyString(body.name)) {
      updatePayload.name = body.name.trim()
    }

    if (isNonEmptyString(body.role)) {
      updatePayload.role = body.role.trim()
      updatePayload.title_en = body.role.trim()
    }

    if (isNonEmptyString(body.bio)) {
      updatePayload.bio = body.bio.trim()
      updatePayload.message = body.bio.trim()
      updatePayload.bio_en = body.bio.trim()
    }

    if (isNonEmptyString(body.phone)) {
      updatePayload.phone = body.phone.trim()
    }

    if (isNonEmptyString(body.github)) {
      updatePayload.github = body.github.trim()
      updatePayload.linkedin_url = body.github.trim()
    }

    if (isNonEmptyString(body.profile_image)) {
      let profileImageValue = body.profile_image.trim()
      if (profileImageValue.startsWith("data:image/")) {
        profileImageValue = await uploadProfileImage(profileImageValue, `profile-${auth.user.id}`)
      }

      updatePayload.profile_image = profileImageValue
      updatePayload.image_url = profileImageValue
    }

    if (Object.keys(updatePayload).length === 0) {
      return NextResponse.json({ error: "No update fields provided" }, { status: 400 })
    }

    const { error } = await supabase
      .from("freelancers")
      .update(updatePayload)
      .eq("user_id", auth.user.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to update freelancer profile" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireUserFromRequest(req)
  if (!auth.ok) {
    return auth.response
  }

  const { error: deleteProfileError } = await supabase
    .from("freelancers")
    .delete()
    .eq("user_id", auth.user.id)

  if (deleteProfileError) {
    return NextResponse.json({ error: deleteProfileError.message }, { status: 500 })
  }

  const { error: deleteAuthError } = await supabase.auth.admin.deleteUser(auth.user.id)
  if (deleteAuthError) {
    return NextResponse.json({ error: deleteAuthError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
