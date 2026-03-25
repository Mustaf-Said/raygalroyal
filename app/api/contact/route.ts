export async function POST(req: Request) {
  try {
    const resendApiKey = process.env.RESEND_API_KEY
    const { name, email, message } = await req.json()

    if (!name || !email || !message) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!resendApiKey) {
      return Response.json(
        {
          error:
            "Email service is not configured: missing RESEND_API_KEY in .env.local. Add it, then restart the dev server.",
        },
        { status: 500 }
      )
    }

    const toEmail = "raygal99@gmail.com"
    const fallbackFromEmail = "Raygal Royal <onboarding@resend.dev>"
    const configuredFromEmail = process.env.CONTACT_FROM_EMAIL?.trim()
    const fromEmail = configuredFromEmail || fallbackFromEmail
    const hasAtSign = fromEmail.includes("@")

    if (!hasAtSign) {
      return Response.json(
        {
          error: "CONTACT_FROM_EMAIL is invalid. Use a valid email or formatted sender, then restart the dev server.",
        },
        { status: 500 }
      )
    }

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <h2 style="margin-bottom: 12px;">New Contact Form Message</h2>
        <p style="margin: 0 0 8px;"><strong>Name:</strong> ${String(name)}</p>
        <p style="margin: 0 0 8px;"><strong>Email:</strong> ${String(email)}</p>
        <p style="margin: 16px 0 8px;"><strong>Message:</strong></p>
        <div style="padding: 12px; background: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb; white-space: pre-wrap;">${String(message)}</div>
      </div>
    `

    const fromCandidates = configuredFromEmail
      ? [configuredFromEmail, fallbackFromEmail]
      : [fallbackFromEmail]

    for (const from of fromCandidates) {
      const resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from,
          to: [toEmail],
          reply_to: String(email),
          subject: `New contact form message from ${String(name)}`,
          html,
        }),
      })

      if (resendResponse.ok) {
        return Response.json({ success: true })
      }

      const errorBody = await resendResponse.text()
      const normalizedError = errorBody.toLowerCase()
      const canRetryWithFallback =
        fromCandidates.length > 1 &&
        from === configuredFromEmail &&
        normalizedError.includes("domain is not verified")

      if (canRetryWithFallback) {
        console.warn("Custom sender domain is not verified, retrying with onboarding sender.")
        continue
      }

      console.error("Resend contact email error:", errorBody)
      return Response.json({ error: "Failed to send email" }, { status: 502 })
    }
  } catch (error) {
    console.error("Contact route error:", error)
    return Response.json({ error: "Unexpected server error" }, { status: 500 })
  }
}
