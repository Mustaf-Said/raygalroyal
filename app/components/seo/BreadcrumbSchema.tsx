import JsonLd from "./JsonLd"

type BreadcrumbItem = {
  name: string
  item: string
}

type BreadcrumbSchemaProps = {
  items: BreadcrumbItem[]
  id?: string
}

export default function BreadcrumbSchema({ items, id }: BreadcrumbSchemaProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.name,
      item: entry.item,
    })),
  }

  return <JsonLd id={id} data={data} />
}
