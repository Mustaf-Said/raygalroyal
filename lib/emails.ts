import { translations, Language } from "@/app/components/translations"

const RESEND_API_KEY = process.env.RESEND_API_KEY

export async function sendOrderConfirmationEmail({
  email,
  orderId,
  plan,
  amount,
  currency = "USD",
  language = "en",
}: {
  email: string
  orderId: string
  plan: string
  amount: string | number
  currency?: string
  language?: string
}) {
  if (!RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is not set. Email not sent.")
    return
  }

  const lang = (language === "so" ? "so" : "en") as Language
  const t = translations[lang].emails

  const currencySymbol = currency === "SEK" ? "SEK" : "$"

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h1 style="color: #2563eb;">Raygal Royal</h1>
      <p>${t.greeting}</p>
      <p>${t.thankYou}</p>
      <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2 style="margin-top: 0; font-size: 18px;">${t.orderDetails}</h2>
        <p><strong>${t.orderId}:</strong> ${orderId}</p>
        <p><strong>${t.plan}:</strong> ${plan}</p>
        <p><strong>${t.amount}:</strong> ${currency === "USD" ? "$" : ""}${amount} ${currency !== "USD" ? currency : ""}</p>
      </div>
      <p>${t.nextSteps}</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="color: #6b7280; font-size: 14px;">${t.footer}</p>
    </div>
  `

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Raygal Royal <orders@raygalroyal.com>", // Replace with your verified domain
        to: [email],
        subject: t.subject,
        html: html,
      }),
    })

    if (!res.ok) {
      const error = await res.json()
      console.error("Failed to send email via Resend:", error)
    } else {
      console.log(`✅ Confirmation email sent to ${email} (${language})`)
    }
  } catch (error) {
    console.error("Error sending email:", error)
  }
}
