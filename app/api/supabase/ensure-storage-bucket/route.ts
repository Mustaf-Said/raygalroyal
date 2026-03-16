import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const BUCKET_NAME = "project-files"

export async function POST() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      {
        ok: false,
        skipped: true,
        message: "Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL",
      },
      { status: 200 }
    )
  }

  const admin = createClient(supabaseUrl, serviceRoleKey)

  try {
    const { data: buckets, error: listError } = await admin.storage.listBuckets()
    if (listError) {
      return NextResponse.json({ ok: false, error: listError.message }, { status: 500 })
    }

    const exists = buckets.some((bucket) => bucket.name === BUCKET_NAME)
    if (exists) {
      return NextResponse.json({ ok: true, exists: true }, { status: 200 })
    }

    const { error: createError } = await admin.storage.createBucket(BUCKET_NAME, {
      public: false,
      fileSizeLimit: "20MB",
      allowedMimeTypes: [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/zip",
        "application/x-zip-compressed",
        "image/png",
        "image/jpg",
        "image/jpeg",
      ],
    })

    if (createError) {
      return NextResponse.json({ ok: false, error: createError.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true, created: true, bucket: BUCKET_NAME }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
