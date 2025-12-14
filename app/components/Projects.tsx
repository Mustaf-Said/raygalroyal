import Link from "next/link"

type ProjectsProps = {
  t: Record<string, string>
}

const PROJECTS = [
  {
    title: "Multilingual Portfolio",
    description: "Next.js portfolio with i18n, RTL support and modern UI.",
    tech: ["Next.js", "TypeScript", "Tailwind"],
    live: "https://example.com",
    code: "https://github.com/yourname/project1",
  },
  {
    title: "React Dashboard",
    description: "Admin dashboard built with React and API integration.",
    tech: ["React", "API", "CSS"],
    live: "https://example.com",
    code: "https://github.com/yourname/project2",
  },
  {
    title: "Fullstack App",
    description: "Fullstack app using Node.js, Express and MongoDB.",
    tech: ["Node.js", "Express", "MongoDB"],
    live: "https://example.com",
    code: "https://github.com/yourname/project3",
  },
]

export default function Projects({ t }: ProjectsProps) {
  return (
    <section id="projects" className="max-w-6xl mx-auto px-6 py-20">
      {/* TITLE */}
      <h2 className="text-3xl md:text-4xl font-bold text-center">
        {t.projects_title}
      </h2>

      {/* SUBTITLE */}
      <p className="mt-4 text-center text-gray-600 dark:text-gray-300">
        {t.projects_sub}
      </p>

      {/* GRID */}
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {PROJECTS.map((project) => (
          <div
            key={project.title}
            className="rounded-2xl border bg-white dark:bg-zinc-800 shadow-sm hover:shadow-lg transition"
          >
            <div className="p-6">
              <h3 className="text-xl font-semibold">
                {project.title}
              </h3>

              <p className="mt-2 text-gray-600 dark:text-gray-300">
                {project.description}
              </p>

              {/* TECH */}
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-zinc-700"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* LINKS */}
              <div className="mt-6 flex gap-4">
                <Link
                  href={project.live}
                  target="_blank"
                  className="text-blue-600 hover:underline"
                >
                  {t.project_live}
                </Link>
                <Link
                  href={project.code}
                  target="_blank"
                  className="text-blue-600 hover:underline"
                >
                  {t.project_code}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
