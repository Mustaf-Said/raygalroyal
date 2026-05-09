import { sendResendEmail } from "@/lib/emails"

type AdminNotificationType = "review" | "freelancer_application" | "freelancer_message"

type NotificationCopy = {
  subject: string
  message: string
  followUp: string
  adminPath: string
}

const NOTIFICATIONS: Record<AdminNotificationType, NotificationCopy> = {
  review: {
    subject: "New Customer Review Submitted",
    message: "A customer submitted a new review that needs approval.",
    followUp: "Open the admin panel to review it.",
    adminPath: "/admin/reviews",
  },
  freelancer_application: {
    subject: "New Freelancer Application",
    message: "A freelancer has submitted an application that needs approval.",
    followUp: "Open the admin panel to review it.",
    adminPath: "/admin/freelancers",
  },
  freelancer_message: {
    subject: "New Freelancer Message",
    message: "A freelancer sent a new message.",
    followUp: "Please open the admin dashboard to read and reply.",
    adminPath: "/admin/freelancers",
  },
}

const getAdminEmails = () => {
  const configured = process.env.ADMIN_EMAILS ?? ""
  const matches = configured.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) ?? []
  return Array.from(new Set(matches.map((email) => email.toLowerCase())))
}

const buildNotificationHtml = (copy: NotificationCopy, adminUrl: string) => `
  <div style="font-family: Arial, Helvetica, sans-serif; max-width: 640px; margin: 0 auto; padding: 24px; background: #ffffff; color: #111827; border: 1px solid #e5e7eb; border-radius: 16px;">
    <h1 style="margin: 0 0 16px; font-size: 24px; line-height: 1.2; color: #111827;">Raygal Royal Admin Alert</h1>
    <p style="margin: 0 0 12px; font-size: 16px; line-height: 1.6; color: #374151;">${copy.message}</p>
    <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #374151;">${copy.followUp}</p>
    <p style="margin: 0 0 24px;">
      <a href="${adminUrl}" style="display: inline-block; background: #2563eb; color: #ffffff; text-decoration: none; font-weight: 700; padding: 12px 20px; border-radius: 9999px;">Open Admin Panel</a>
    </p>
    <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #6b7280;">
      Admin page: <a href="${adminUrl}" style="color: #2563eb;">${adminUrl}</a>
    </p>
  </div>
`

export async function sendAdminNotification({ type }: { type: AdminNotificationType }) {
  const recipients = getAdminEmails()
  if (recipients.length === 0) {
    console.warn("ADMIN_EMAILS is not configured. Admin notification not sent.")
    return
  }

  const copy = NOTIFICATIONS[type]
  const baseUrl = process.env.APP_URL?.trim() || "http://localhost:3000"
  const adminUrl = new URL(copy.adminPath, baseUrl).toString()
  const html = buildNotificationHtml(copy, adminUrl)

  for (const recipient of recipients) {
    const result = await sendResendEmail({
      to: recipient,
      subject: copy.subject,
      html,
    })

    if (!result.ok) {
      console.error(`Failed to send admin notification (${type}) to ${recipient}:`, result.errorBody)
      continue
    }

    console.log(`Admin notification (${type}) sent to ${recipient}`)
  }
}
