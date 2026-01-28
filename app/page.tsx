import Hero from "@/app/components/Hero"
import Skills from "./components/Skills"
import Projects from "./components/Projects"
import Services from "./components/Services"
import Contact from "./components/Contact"
import Footer from "./components/Footer"

export default function RootPage() {
  return (
    <>
      <Hero />
      <Skills />
      <Projects />
      <Services />
      <Contact />
      <Footer />
    </>
  )
}
