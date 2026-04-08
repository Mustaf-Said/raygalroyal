type AdminAuthPayload = {
  accessToken: string
  userId?: string
}

export const ADMIN_ACCESS_TOKEN_KEY = "adminAccessToken"
export const ADMIN_USER_ID_KEY = "adminUserId"

const isBrowser = () => typeof window !== "undefined"

export function setAdminAuth(payload: AdminAuthPayload) {
  if (!isBrowser()) {
    return
  }

  window.localStorage.setItem(ADMIN_ACCESS_TOKEN_KEY, payload.accessToken)
  if (payload.userId) {
    window.localStorage.setItem(ADMIN_USER_ID_KEY, payload.userId)
  }
}

export function getAdminAccessToken() {
  if (!isBrowser()) {
    return null
  }

  return window.localStorage.getItem(ADMIN_ACCESS_TOKEN_KEY)
}

export function getAdminUserId() {
  if (!isBrowser()) {
    return null
  }

  return window.localStorage.getItem(ADMIN_USER_ID_KEY)
}

export function clearAdminAuth() {
  if (!isBrowser()) {
    return
  }

  window.localStorage.removeItem(ADMIN_ACCESS_TOKEN_KEY)
  window.localStorage.removeItem(ADMIN_USER_ID_KEY)
}

export function getAdminAuthHeaders(): Record<string, string> {
  const token = getAdminAccessToken()
  if (!token) {
    return {}
  }

  return { Authorization: `Bearer ${token}` }
}
