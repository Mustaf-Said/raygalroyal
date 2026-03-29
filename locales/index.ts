import en from "./en"
import so from "./so"
import ar from "./ar"

export const translations = { en, so, ar } as const

export type Language = "en" | "so" | "ar"

type DeepStringify<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
  ? readonly DeepStringify<U>[]
  : T extends object
  ? { [K in keyof T]: DeepStringify<T[K]> }
  : T

export type TranslationStrings = DeepStringify<typeof en>
