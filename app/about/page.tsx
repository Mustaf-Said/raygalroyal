export default function AboutPage() {
  return (
    <section className="min-h-[90vh] flex flex-col items-center">
      <div className="max-w-5xl mx-auto px-6 pt-24 pb-9 text-left">
        <h1 className="text-4xl md:text-5xl font-bold mb-10 text-center">
          About Me
        </h1>

        <div className="space-y-6 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          <p>I am a Frontend Developer based in Sweden with a strong passion for building modern, responsive, and user-focused web applications.</p>
          <p>I have completed my professional studies in Frontend Development in Borås, Sweden, where I built a solid foundation in HTML5, CSS, Scss, Tailwind, JavaScript, TypeScript, React & Nextjs.</p>
          <p>Over the past two years, I have gained hands-on experience building websites and web applications using React, Next.js, Tailwind CSS, and API integrations.</p>
          <p>I enjoy transforming complex ideas into simple, elegant, and functional digital solutions, with a strong focus on performance and user experience.</p>
        </div>
      </div>
    </section>
  )
}
