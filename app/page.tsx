import Hero from "./components/Hero"
import Services from "./components/Services"
import Projects from "./components/Projects"
import Testimonials from "./components/Testimonials"
import Guarantee from "./components/Guarantee"
import Team from "./components/Team"
import Pricing from "./components/Pricing"
import PaymentIntegration from "./components/PaymentIntegration"
import FAQ from "./components/FAQ"
import Contact from "./components/Contact"

export default function RootPage() {
  return (

    <>
      <Hero />
      <Services />
      <Projects />
      <Testimonials />
      <Guarantee />
      <Team />
      <Pricing />
      <PaymentIntegration />
      <FAQ />
      <Contact />
    </>
  )
}
