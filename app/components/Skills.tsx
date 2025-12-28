type SkillsProps = {
  t: Record<string, string>
}

const SKILLS = [
  "HTML5",
  "CSS / SCSS",
  "Tailwind CSS",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Express",
  "MongoDB",
  "Git",
  "Figma / Canva"
]

export default function Skills({ t }: SkillsProps) {
  return (
    <section
      id="skills"
      className="max-w-screen mx-auto px-6 py-20 bg-gray-400 "
    >
      {/* TITLE */}
      <h2 className="text-3xl md:text-4xl font-bold text-center">
        {t.skills_title}
      </h2>

      {/* SUBTITLE */}
      <p className="mt-4 text-center text-gray-600">
        {t.skills_sub}
      </p>

      {/* GRID */}
      <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 ">
        {SKILLS.map((skill) => (
          <div
            key={skill}
            className="flex items-center justify-center
              rounded-xl bg-gray-100 
              py-4 font-medium shadow-2xl
               hover:-translate-y-1
              transition hover:text-white hover:bg-gray-400 cursor-pointer"
          >
            {skill}
          </div>
        ))}
      </div>
    </section>
  )
}
