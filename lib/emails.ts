import { translations, type Language } from "@/locales"

const RESEND_API_KEY = process.env.RESEND_API_KEY
export const RESEND_FALLBACK_FROM = "Raygal Royal <onboarding@resend.dev>"

const isDomainNotVerifiedError = (errorText: string) => {
  const normalized = errorText.toLowerCase()
  return normalized.includes("domain is not verified")
}

const isTestingRecipientRestrictionError = (errorText: string) => {
  const normalized = errorText.toLowerCase()
  return (
    normalized.includes("you can only send testing emails") ||
    normalized.includes("verify a domain")
  )
}

export type SendResendEmailResult =
  | { ok: true }
  | { ok: false; errorBody: string; testingRecipientBlocked: boolean }

export async function sendResendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}): Promise<SendResendEmailResult> {
  if (!RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is not set. Email not sent.")
    return { ok: false, errorBody: "RESEND_API_KEY is not set. Email not sent.", testingRecipientBlocked: false }
  }

  const configuredFromEmail = process.env.CONTACT_FROM_EMAIL?.trim()
  const fromCandidates = configuredFromEmail
    ? [configuredFromEmail, RESEND_FALLBACK_FROM]
    : [RESEND_FALLBACK_FROM]

  for (let index = 0; index < fromCandidates.length; index += 1) {
    const from = fromCandidates[index]
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        html,
      }),
    })

    if (res.ok) {
      return { ok: true }
    }

    const errorBody = await res.text()
    const testingRecipientBlocked = isTestingRecipientRestrictionError(errorBody)

    if (isDomainNotVerifiedError(errorBody) && index < fromCandidates.length - 1) {
      console.warn("Resend sender domain is not verified, retrying with onboarding sender.")
      continue
    }

    return {
      ok: false,
      errorBody,
      testingRecipientBlocked,
    }
  }

  return {
    ok: false,
    errorBody: "Resend email could not be sent.",
    testingRecipientBlocked: false,
  }
}

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
  const lang = (language === "so" ? "so" : "en") as Language
  const t = translations[lang].emails

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

  const fallbackTestRecipient =
    process.env.RESEND_TEST_EMAIL?.trim() || process.env.CONTACT_RECEIVER_EMAIL?.trim()

  const recipientCandidates = [email]

  if (
    fallbackTestRecipient &&
    fallbackTestRecipient.toLowerCase() !== email.toLowerCase()
  ) {
    recipientCandidates.push(fallbackTestRecipient)
  }

  for (const recipient of recipientCandidates) {
    const result = await sendResendEmail({
      to: recipient,
      subject: t.subject,
      html,
    })

    if (result.ok) {
      if (recipient !== email) {
        console.warn(
          `Order confirmation could not be sent to ${email} in current Resend mode. Sent to fallback inbox ${recipient} instead.`
        )
      } else {
        console.log(`✅ Confirmation email sent to ${email} (${language})`)
      }
      return
    }

    if (result.testingRecipientBlocked && recipient === email && recipientCandidates.length > 1) {
      console.warn(
        "Resend account is in testing mode for this recipient. Retrying with fallback test recipient."
      )
      continue
    }

    if (result.testingRecipientBlocked && recipient === email) {
      console.warn(
        "Order confirmation email was blocked by Resend testing-mode recipient restrictions. Verify a domain in Resend to send to customer emails."
      )
      return
    }

    console.error("Failed to send email via Resend:", result.errorBody)
    return
  }
}

export async function sendDomainOrderConfirmationEmail({
  email,
  orderId,
  domain,
  amount,
  currency = "USD",
  language = "en",
}: {
  email: string
  orderId: string
  domain: string
  amount: string | number
  currency?: string
  language?: string
}) {
  const localizedLanguage = language === "so" ? "so" : language === "ar" ? "ar" : "en"

  await sendOrderConfirmationEmail({
    email,
    orderId,
    plan: `Domain: ${domain}`,
    amount,
    currency,
    language: localizedLanguage,
  })
}
