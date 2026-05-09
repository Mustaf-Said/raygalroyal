type JsonLdProps = {
  data: Record<string, unknown> | Array<Record<string, unknown>>
  id?: string
}

function safeJsonLd(data: JsonLdProps["data"]) {
  return JSON.stringify(data).replace(/<\//g, "<\\/")
}

export default function JsonLd({ data, id }: JsonLdProps) {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }}
    />
  )
}
