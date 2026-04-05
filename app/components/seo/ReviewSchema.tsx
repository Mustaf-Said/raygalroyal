import JsonLd from "./JsonLd"

type ReviewSchemaProps = {
  url: string
  name: string
  description: string
  reviewBody: string
  datePublished: string
  authorName: string
  publisherName: string
  publisherLogo: string
  image: string
  itemReviewedName: string
  ratingValue: number
  bestRating?: number
  worstRating?: number
  id?: string
}

export default function ReviewSchema({
  url,
  name,
  description,
  reviewBody,
  datePublished,
  authorName,
  publisherName,
  publisherLogo,
  image,
  itemReviewedName,
  ratingValue,
  bestRating = 5,
  worstRating = 1,
  id,
}: ReviewSchemaProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Review",
    name,
    description,
    url,
    datePublished,
    author: {
      "@type": "Organization",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: publisherName,
      logo: {
        "@type": "ImageObject",
        url: publisherLogo,
      },
    },
    reviewBody,
    reviewRating: {
      "@type": "Rating",
      ratingValue,
      bestRating,
      worstRating,
    },
    itemReviewed: {
      "@type": "Product",
      name: itemReviewedName,
      image,
      description,
      brand: {
        "@type": "Brand",
        name: itemReviewedName,
      },
    },
  }

  return <JsonLd id={id} data={data} />
}
