"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import ReviewCard from "./ReviewCard"

type Review = {
  id: string
  name: string
  message: string
  rating: number
  admin_response: string | null
}

type Props = {
  reviews: Review[]
  t: { responseLabel: string; readMore: string; showLess: string }
}

const VISIBLE = 3

export default function ReviewsCarousel({ reviews, t }: Props) {
  const [current, setCurrent] = useState(0)
  const maxIndex = reviews.length - VISIBLE

  const visible = reviews.slice(current, current + VISIBLE)

  return (
    <div>
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {visible.map((review, i) => (
            <ReviewCard key={review.id} review={review} index={i} t={t} />
          ))}
        </motion.div>
      </AnimatePresence>

      {reviews.length > VISIBLE && (
        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            disabled={current === 0}
            className="px-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-xl disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            ←
          </button>

          {Array.from({ length: maxIndex + 1 }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === current
                ? "bg-gray-900 dark:bg-white scale-125"
                : "bg-gray-300 dark:bg-gray-500"
                }`}
            />
          ))}
          <button
            onClick={() => setCurrent((c) => Math.min(maxIndex, c + 1))}
            disabled={current === maxIndex}
            className="px-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-xl disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            →
          </button>
        </div>
      )}
    </div>
  )
}