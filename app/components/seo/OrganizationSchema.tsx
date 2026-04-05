import JsonLd from "./JsonLd"

type OrganizationSchemaProps = {
  name: string
  url: string
  logo: string
  sameAs: string[]
}

export default function OrganizationSchema({
  name,
  url,
  logo,
  sameAs,
}: OrganizationSchemaProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    logo,
    sameAs,
  }

  return <JsonLd id="organization-schema" data={data} />
}
