import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const BUCKET_NAME = "project-files"

const sanitizeFileName = (fileName: string) =>
  fileName
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9._-]/g, "")
    .slice(-120)

export async function POST(req: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      { error: "Server storage configuration is missing" },
      { status: 500 }
    )
  }

  const formData = await req.formData()
  const file = formData.get("file")

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file in form data" }, { status: 400 })
  }

  const safeName = sanitizeFileName(file.name || "upload.bin") || "upload.bin"
  const filePath = `orders/${crypto.randomUUID()}-${safeName}`
  const fileBuffer = Buffer.from(await file.arrayBuffer())

  const admin = createClient(supabaseUrl, serviceRoleKey)
  const { error } = await admin.storage.from(BUCKET_NAME).upload(filePath, fileBuffer, {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const { data } = admin.storage.from(BUCKET_NAME).getPublicUrl(filePath)

  return NextResponse.json({
    filePath,
    fileUrl: data.publicUrl || null,
  })
}
