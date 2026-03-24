import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const LEGACY_DEFAULT_AVATAR_SRC = "/default-avatar.png"
const DEFAULT_AVATAR_SRC = "https://cdn.creativefabrica.com/2021/12/25/Freelancer-avatar-icon-Graphics-22319749-2-580x387.jpg"
const ALLOWED_IMAGE_HOSTS = new Set([
  "vycmyarjrpkooiysfkgj.supabase.co",
  "cdn.creativefabrica.com",
])

function getConfiguredSupabaseHost(): string | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl) {
    return null
  }

  try {
    return new URL(supabaseUrl).hostname
  } catch {
    return null
  }
}

export function getSafeAvatarSrc(imageUrl: string | null | undefined): string {
  const rawValue = imageUrl?.trim()
  if (!rawValue) {
    return DEFAULT_AVATAR_SRC
  }

  if (rawValue === LEGACY_DEFAULT_AVATAR_SRC) {
    return DEFAULT_AVATAR_SRC
  }

  if (rawValue.startsWith("/")) {
    return rawValue
  }

  let parsedUrl: URL
  try {
    parsedUrl = new URL(rawValue)
  } catch {
    return DEFAULT_AVATAR_SRC
  }

  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
    return DEFAULT_AVATAR_SRC
  }

  const configuredSupabaseHost = getConfiguredSupabaseHost()
  if (configuredSupabaseHost) {
    ALLOWED_IMAGE_HOSTS.add(configuredSupabaseHost)
  }

  return ALLOWED_IMAGE_HOSTS.has(parsedUrl.hostname) ? rawValue : DEFAULT_AVATAR_SRC
}
