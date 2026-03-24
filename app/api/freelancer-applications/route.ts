import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { requireAdminFromRequest } from "@/lib/adminAuth"
import type { Database } from "@/lib/database.types"

type FreelancerApplicationInsert =
  Database["public"]["Tables"]["freelancer_applications"]["Insert"]

type FreelancerApplicationBody = {
  name?: string
  email?: string
  role?: string
  message?: string
  linkedin_url?: string
  image_name?: string | null
  image_data_url?: string | null
}

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

const IMAGE_DATA_URL_REGEX = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/
const DEFAULT_APPLICATION_IMAGE_URL = "https://cdn.creativefabrica.com/2021/12/25/Freelancer-avatar-icon-Graphics-22319749-2-580x387.jpg"

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

const uploadApplicationImage = async (imageDataUrl: string, imageName: string) => {
  const match = imageDataUrl.match(IMAGE_DATA_URL_REGEX)
  if (!match) {
    throw new Error("Invalid image data")
  }

  const [, mimeType, base64Data] = match
  const bucketName = await ensureFreelancerBucket()
  const cleanFileName = sanitizeFileName(imageName || "avatar") || "avatar"
  const filePath = `applications/${crypto.randomUUID()}-${cleanFileName}`

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
  const adminCheck = await requireAdminFromRequest(req)
  if (!adminCheck.ok) {
    return adminCheck.response
  }

  try {
    const { data, error } = await supabase
      .from("freelancer_applications")
      .select("id, name, email, role, message, linkedin_url, image_url, status, created_at")
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data: data ?? [] })
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch freelancer applications" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as FreelancerApplicationBody

    if (
      !isNonEmptyString(body.name) ||
      !isNonEmptyString(body.email) ||
      !isNonEmptyString(body.role) ||
      !isNonEmptyString(body.message) ||
      !isNonEmptyString(body.linkedin_url)
    ) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, role, message, linkedin_url" },
        { status: 400 }
      )
    }

    const email = body.email.trim().toLowerCase()
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 })
    }

    const { data: existingFreelancer, error: existingFreelancerError } = await supabase
      .from("freelancers")
      .select("id")
      .eq("email", email)
      .limit(1)
      .maybeSingle()

    if (existingFreelancerError) {
      return NextResponse.json({ error: existingFreelancerError.message }, { status: 500 })
    }

    if (existingFreelancer) {
      return NextResponse.json(
        { error: "This email already exists. Use another email." },
        { status: 409 }
      )
    }

    const { data: existingApplication, error: existingApplicationError } = await supabase
      .from("freelancer_applications")
      .select("id, status")
      .eq("email", email)
      .in("status", ["pending", "approved"])
      .limit(1)
      .maybeSingle()

    if (existingApplicationError) {
      return NextResponse.json({ error: existingApplicationError.message }, { status: 500 })
    }

    if (existingApplication) {
      return NextResponse.json(
        { error: "This email already exists. Use another email." },
        { status: 409 }
      )
    }

    let imageUrl: string | null = DEFAULT_APPLICATION_IMAGE_URL
    if (isNonEmptyString(body.image_data_url)) {
      imageUrl = await uploadApplicationImage(body.image_data_url, body.image_name ?? "avatar")
    }

    const payload: FreelancerApplicationInsert = {
      name: body.name.trim(),
      email,
      role: body.role.trim(),
      message: body.message.trim(),
      linkedin_url: body.linkedin_url.trim(),
      image_url: imageUrl,
      status: "pending",
    }

    const { data, error } = await supabase
      .from("freelancer_applications")
      .insert(payload)
      .select("id, name, email, role, message, linkedin_url, image_url, status, created_at")
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: "Failed to submit freelancer application" },
      { status: 500 }
    )
  }
}
