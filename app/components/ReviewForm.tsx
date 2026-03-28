"use client"

import { FormEvent, useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"

type TestimonialsTranslation = {
  formTitle: string
  formName: string
  formMessage: string
  formRating: string
  submit: string
  submitting: string
  leaveReview: string
  cancel: string
  pendingToast: string
}

type ReviewFormState = {
  name: string
  message: string
  rating: number
  website: string
}

type ReviewFormProps = {
  t: TestimonialsTranslation
}

const MAX_REVIEW_WORDS = 200

const countWords = (value: string): number => {
  const trimmed = value.trim()
  if (!trimmed) {
    return 0
  }

  return trimmed.split(/\s+/).length
}

export default function ReviewForm({ t }: ReviewFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [form, setForm] = useState<ReviewFormState>({
    name: "",
    message: "",
    rating: 5,
    website: "",
  })

  const messageWordCount = countWords(form.message)
  const isOverWordLimit = messageWordCount > MAX_REVIEW_WORDS

  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!modalRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handlePointerDown)
    return () => document.removeEventListener("mousedown", handlePointerDown)
  }, [isOpen])

  useEffect(() => {
    if (!showSuccessToast) {
      return
    }

    const timer = window.setTimeout(() => {
      setShowSuccessToast(false)
    }, 3500)

    return () => window.clearTimeout(timer)
  }, [showSuccessToast])

  const closeModal = () => {
    setIsOpen(false)
    setErrorMessage("")
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage("")

    if (isOverWordLimit) {
      setErrorMessage(`Please keep your review within ${MAX_REVIEW_WORDS} words.`)
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          message: form.message,
          rating: form.rating,
          website: form.website,
        }),
      })

      const json = await response.json()
      if (!response.ok) {
        throw new Error(json?.error || "Failed to submit review")
      }

      setForm({ name: "", message: "", rating: 5, website: "" })
      setIsOpen(false)
      setShowSuccessToast(true)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to submit review")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="max-w-3xl mx-auto flex justify-center">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="px-10 py-4 text-white font-black rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 relative overflow-hidden flex items-center gap-3 group"
          style={{
            background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 60%, #c026d3 100%)",
            boxShadow: "0 0 20px rgba(99,102,241,0.5), inset 0 1px 0 rgba(255,255,255,0.15)",
            border: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          <span
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
            style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))" }}
          />
          <span
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-md -z-10"
            style={{ background: "linear-gradient(135deg, #2563eb, #c026d3)" }}
          />
          <span className="relative z-10 tracking-wide">{t.leaveReview}</span>
        </button>
      </div>

      <AnimatePresence>
        {showSuccessToast ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed right-4 top-4 z-70 rounded-2xl bg-green-600 text-white px-4 py-3 shadow-xl"
          >
            {t.pendingToast}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start md:items-center justify-center p-3 md:p-4 overflow-y-auto"
          >
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-3xl my-3 max-h-[92vh] overflow-y-auto p-8 bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-4xl"
            >
              <div className="flex justify-end mb-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  aria-label={t.cancel}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6">{t.formTitle}</h3>

              {errorMessage ? (
                <p className="mb-6 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-4 py-3 font-semibold">
                  {errorMessage}
                </p>
              ) : null}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="sr-only" aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input
                    id="website"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.website}
                    onChange={(event) => setForm((prev) => ({ ...prev, website: event.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-500 dark:text-gray-400">{t.formName}</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                    className="w-full px-5 py-3 bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-500 dark:text-gray-400">{t.formMessage}</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
                    className="w-full px-5 py-3 bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                  />
                  <p className={`text-xs font-semibold ${isOverWordLimit ? "text-red-600 dark:text-red-400" : "text-gray-500"}`}>
                    {messageWordCount}/{MAX_REVIEW_WORDS} words
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-500 dark:text-gray-400">{t.formRating}</label>
                  <select
                    value={form.rating}
                    onChange={(event) => setForm((prev) => ({ ...prev, rating: Number(event.target.value) }))}
                    className="w-full px-5 py-3 bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    <option value={5}>5</option>
                    <option value={4}>4</option>
                    <option value={3}>3</option>
                    <option value={2}>2</option>
                    <option value={1}>1</option>
                  </select>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 py-4 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white font-black rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || isOverWordLimit}
                    className="flex-1 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? t.submitting : t.submit}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
