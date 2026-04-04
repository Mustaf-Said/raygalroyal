export async function issueSslCertificate(domain: string) {
  if (process.env.MOCK_INFRA_PROVISIONING === "true") {
    return {
      certificateId: `mock-ssl-${Date.now()}`,
      status: "issued" as const,
      issuedAt: new Date().toISOString(),
    }
  }

  // In production, invoke your ACME worker/certbot runner here.
  // This API route records request intent and returns the expected state.
  return {
    certificateId: `ssl-${domain}-${Date.now()}`,
    status: "pending" as const,
    issuedAt: null,
  }
}
