"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useLanguage } from "./LanguageProvider"
import ReviewCard from "./ReviewCard"
import ReviewForm from "./ReviewForm"

type Review = {
  id: string
  name: string
  message: string
  rating: number
  admin_response: string | null
  status: "pending" | "approved"
  created_at: string
}

type ReviewFormState = {
  formTitle: string
  formName: string
  formMessage: string
  formRating: string
  submit: string
  submitting: string
  leaveReview: string
  cancel: string
  pendingToast: string
  maxWordsError: string
  wordsLabel: string
  honeypotWebsite: string
}

type ReviewCardTranslations = {
  responseLabel: string
  readMore: string
  showLess: string
}

export default function Testimonials() {
  const { t } = useLanguage()
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoadingReviews, setIsLoadingReviews] = useState(true)

  const reviewCardT: ReviewCardTranslations = {
    responseLabel: t.testimonials.responseLabel,
    readMore: t.testimonials.readMore,
    showLess: t.testimonials.showLess,
  }

  const reviewFormT: ReviewFormState = {
    formTitle: t.testimonials.formTitle,
    formName: t.testimonials.formName,
    formMessage: t.testimonials.formMessage,
    formRating: t.testimonials.formRating,
    submit: t.testimonials.submit,
    submitting: t.testimonials.submitting,
    leaveReview: t.testimonials.leaveReview,
    cancel: t.testimonials.cancel,
    pendingToast: t.testimonials.pendingToast,
    maxWordsError: t.testimonials.maxWordsError,
    wordsLabel: t.testimonials.wordsLabel,
    honeypotWebsite: t.testimonials.honeypotWebsite,
  }

  const fetchApprovedReviews = async () => {
    setIsLoadingReviews(true)
    try {
      const response = await fetch("/api/reviews", { cache: "no-store" })
      const json = await response.json()

      if (!response.ok) {
        throw new Error(json?.error || "Failed to load reviews")
      }

      setReviews((json?.data ?? []) as Review[])
    } catch {
      setReviews([])
    } finally {
      setIsLoadingReviews(false)
    }
  }

  useEffect(() => {
    void fetchApprovedReviews()
  }, [])

  return (
    <section className="py-24 bg-white dark:bg-gray-950 relative overflow-hidden">
      {/* SOFT GRADIENT BACKGROUND */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6"
          >
            {t.testimonials.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 dark:text-gray-400"
          >
            {t.testimonials.subtitle}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {isLoadingReviews ? (
            <div className="md:col-span-3 text-center text-gray-500">{t.testimonials.loadingReviews}</div>
          ) : reviews.length === 0 ? (
            <div className="md:col-span-3 text-center text-gray-500">{t.testimonials.noApprovedReviews}</div>
          ) : (
            reviews.map((item, index) => (
              <ReviewCard
                key={item.id}
                review={item}
                index={index}
                t={reviewCardT}
              />
            ))
          )}
        </div>

        <ReviewForm t={reviewFormT} />
      </div>
    </section>
  )
}
