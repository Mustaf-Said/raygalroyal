import JsonLd from "./JsonLd"

type ArticleSchemaProps = {
  url: string
  headline: string
  description: string
  image: string
  datePublished: string
  dateModified?: string
  authorName: string
  publisherName: string
  publisherLogo: string
  type?: "Article" | "BlogPosting" | "NewsArticle" | "Review"
  id?: string
}

export default function ArticleSchema({
  url,
  headline,
  description,
  image,
  datePublished,
  dateModified,
  authorName,
  publisherName,
  publisherLogo,
  type = "Article",
  id,
}: ArticleSchemaProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": type,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    headline,
    description,
    image: [image],
    datePublished,
    dateModified: dateModified ?? datePublished,
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
  }

  return <JsonLd id={id} data={data} />
}
