type FreelancerAuthPayload = {
  accessToken: string
  userId?: string
}

export const FREELANCER_ACCESS_TOKEN_KEY = "freelancerAccessToken"
export const FREELANCER_USER_ID_KEY = "freelancerUserId"

const isBrowser = () => typeof window !== "undefined"

export function setFreelancerAuth(payload: FreelancerAuthPayload) {
  if (!isBrowser()) {
    return
  }

  window.localStorage.setItem(FREELANCER_ACCESS_TOKEN_KEY, payload.accessToken)
  if (payload.userId) {
    window.localStorage.setItem(FREELANCER_USER_ID_KEY, payload.userId)
  }
}

export function getFreelancerAccessToken() {
  if (!isBrowser()) {
    return null
  }

  return window.localStorage.getItem(FREELANCER_ACCESS_TOKEN_KEY)
}

export function getFreelancerUserId() {
  if (!isBrowser()) {
    return null
  }

  return window.localStorage.getItem(FREELANCER_USER_ID_KEY)
}

export function clearFreelancerAuth() {
  if (!isBrowser()) {
    return
  }

  window.localStorage.removeItem(FREELANCER_ACCESS_TOKEN_KEY)
  window.localStorage.removeItem(FREELANCER_USER_ID_KEY)
}

export function getFreelancerAuthHeaders(): Record<string, string> {
  const token = getFreelancerAccessToken()
  if (!token) {
    return {}
  }

  return { Authorization: `Bearer ${token}` }
}
