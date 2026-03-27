import Hero from "./components/Hero"
import Testimonials from "./components/Testimonials"
import Guarantee from "./components/Guarantee"
import PaymentIntegration from "./components/PaymentIntegration"
import Link from "next/link"


export default function RootPage() {
  return (

    <>
      <Hero />
      <Link href="/services">
        services
      </Link>
      <Link href="/projects">
        projects
      </Link>
      <Testimonials />
      <Guarantee />
      <Link href="/team">
        team
      </Link>
      <Link href="/pricing">
        pricing
      </Link>
      <PaymentIntegration />
      <Link href="/faq">
        faq
      </Link>
      <Link href="/contact">
        contact
      </Link>
    </>
  )
}
