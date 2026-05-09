import Hero from "./components/Hero"
import Services from "./components/Services"
import Testimonials from "./components/Testimonials"
import Guarantee from "./components/Guarantee"
import PaymentIntegration from "./components/DoneProjects"
import Projects from "./components/Projects"
import Team from "./components/Team"
import Pricing from "./components/Pricing"
import Contact from "./components/Contact"
import FAQ from "./components/FAQ"


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
