import Link from "next/link"

type ContactProps = {
  t: Record<string, string>
}

export default function Contact({ t }: ContactProps) {
  return (
    <section
      id="contact"
      className="max-w-5xl mx-auto px-6 py-24 text-center"
    >
      {/* TITLE */}
      <h2 className="text-3xl md:text-4xl font-bold">
        {t.contact_title}
      </h2>

      {/* SUBTITLE */}
      <p className="mt-4 text-gray-600 dark:text-gray-300">
        {t.contact_sub}
      </p>

      {/* CTA */}
      <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
        <a
          href="mailto:raygal99@hotmailcom"
          className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
        >
          {t.contact_email}
        </a>

        <a
          href="https://wa.me/46722889588"
          target="_blank"
          className="px-6 py-3 rounded-xl border font-medium hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
        >
          {t.contact_whatsapp}
        </a>
      </div>

      {/* SOCIAL LINKS */}
      <div className="mt-10 flex justify-center gap-6 text-lg">
        <Link
          href="https://github.com/Mustaf-Said/Mustaf-Said/blob/master/README.md"
          target="_blank"
          className="hover:underline"
        >
          {t.contact_github}
        </Link>

        <Link
          href="https://www.linkedin.com/in/mustafa-said-b6b164198/"
          target="_blank"
          className="hover:underline"
        >
          {t.contact_linkedin}
        </Link>
      </div>
    </section>
  )
}
