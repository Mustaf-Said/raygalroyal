"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Quote, Star } from "lucide-react"

type TestimonialsTranslation = {
  responseLabel: string
  readMore: string
  showLess: string
}

type ReviewCardProps = {
  review: {
    id: string
    name: string
    message: string
    rating: number
    admin_response: string | null
  }
  index: number
  t: TestimonialsTranslation
}

const RATING_VALUES = [1, 2, 3, 4, 5]
const MESSAGE_COLLAPSE_LENGTH = 120

export default function ReviewCard({ review, index, t }: ReviewCardProps) {
  const [expanded, setExpanded] = useState(false)
  const shouldShowToggle = review.message.length > MESSAGE_COLLAPSE_LENGTH
  const showAdminResponse = Boolean(review.admin_response) && (!shouldShowToggle || expanded)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="p-8 bg-gray-50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-100 dark:border-gray-800 rounded-4xl relative group hover:bg-white dark:hover:bg-gray-900 transition-all duration-300"
    >
      <div className="flex gap-1 mb-6">
        {RATING_VALUES.map((ratingValue) => (
          <Star
            key={ratingValue}
            className={`w-4 h-4 ${ratingValue <= review.rating ? "fill-yellow-400 text-yellow-400" : "fill-transparent text-gray-300"}`}
          />
        ))}
      </div>

      <Quote className="absolute top-8 right-8 w-12 h-12 text-blue-600/10 group-hover:text-blue-600/20 transition-colors pointer-events-none" />

      <p
        className={`text-lg text-gray-700 dark:text-gray-300 mb-3 leading-relaxed italic ${expanded ? "" : "line-clamp-3"} relative z-10`}
        style={
          expanded
            ? undefined
            : {
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }
        }
      >
        &quot;{review.message}&quot;
      </p>

      {shouldShowToggle ? (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="mb-8 text-sm font-bold text-blue-600 dark:text-blue-400 hover:opacity-80 transition-opacity relative z-10"
        >
          {expanded ? t.showLess : t.readMore}
        </button>
      ) : (
        <div className="mb-8" />
      )}

      {showAdminResponse ? (
        <div className="mb-8 border-t border-gray-200 dark:border-gray-800 pt-6">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">{t.responseLabel}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{review.admin_response}</p>
        </div>
      ) : null}

      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 60%, #c026d3 100%)",
            boxShadow: "0 0 16px rgba(99,102,241,0.5), inset 0 1px 0 rgba(255,255,255,0.15)",
            border: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          <span
            className="absolute inset-0 rounded-full"
            style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.03))" }}
          />
          <span className="relative z-10">{review.name[0]?.toUpperCase() ?? "R"}</span>
        </div>
        <div>
          <div className="font-bold text-gray-900 dark:text-white">{review.name}</div>
          <div className="text-sm text-gray-500">{review.rating}/5</div>
        </div>
      </div>
    </motion.div>
  )
}
