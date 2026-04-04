export async function createZohoMailbox(emailAddress: string) {
  const token = process.env.ZOHO_API_TOKEN
  const orgId = process.env.ZOHO_ORG_ID

  if (!token || !orgId || process.env.MOCK_INFRA_PROVISIONING === "true") {
    return {
      mailboxId: `mock-zoho-${Date.now()}`,
      status: "active" as const,
    }
  }

  const response = await fetch(`https://mail.zoho.com/api/organization/${orgId}/accounts`, {
    method: "POST",
    headers: {
      Authorization: `Zoho-oauthtoken ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      primaryEmailAddress: emailAddress,
      displayName: emailAddress.split("@")[0],
      password: process.env.ZOHO_DEFAULT_MAILBOX_PASSWORD,
    }),
  })

  const json = (await response.json()) as { data?: { accountId?: string } }

  if (!response.ok) {
    throw new Error("Failed to create Zoho mailbox")
  }

  return {
    mailboxId: json.data?.accountId || `zoho-${Date.now()}`,
    status: "active" as const,
  }
}
