import {
  FaGithub,
  FaLinkedin,
  FaWhatsapp,
  FaEnvelope,
  FaFacebook,
  FaTwitter
} from "react-icons/fa"

type FooterProps = {
  t: Record<string, string>
}

export default function Footer({ t }: FooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">

          {/* CONTACT */}
          <div>
            <h3 className="text-lg font-bold mb-4">
              {t.footer_contact}
            </h3>

            <div className="flex items-center gap-3 text-gray-400 mb-3">
              <FaEnvelope />
              <a
                href="mailto:youremail@example.com"
                className="hover:text-white"
                aria-label="Email"
              >
                raygal99@hotmail.com
              </a>
            </div>

            <div className="flex items-center gap-3 text-gray-400">
              <FaWhatsapp />
              <a
                href="https://wa.me/46700000000"
                target="_blank"
                className="hover:text-white"
                aria-label="WhatsApp"
              >
                WhatsApp
              </a>
            </div>
          </div>

          {/* SOCIAL MEDIA */}
          <div>
            <h3 className="text-lg font-bold mb-4">
              {t.footer_follow}
            </h3>

            <div className="flex gap-4 text-2xl text-gray-400">
              <a
                href="https://github.com/Mustaf-Said/Mustaf-Said/blob/master/README.md"
                target="_blank"
                className="hover:text-white"
                aria-label="Github"
              >
                <FaGithub />
              </a>

              <a
                href="https://www.linkedin.com/in/mustafa-said-b6b164198/"
                target="_blank"
                className="hover:text-white"
                aria-label="LinkedIn"
              >
                <FaLinkedin />
              </a>

              <a href="https://www.facebook.com/mustfa99"
                target="_blank"
                className="hover:text-white"
                aria-label="FaceBook"
              >
                <FaFacebook />
              </a>
              <a href="https://x.com/MR4273083817955"
                target="_blank"
                className="hover:text-white"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="text-lg font-bold mb-4">
              {t.footer_links}
            </h3>

            <ul className="text-gray-400 space-y-2">
              <li>
                <a href="#skills" className="hover:text-white">
                  Skills
                </a>
              </li>
              <li>
                <a href="#projects" className="hover:text-white">
                  Projects
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white">
                  Services
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="border-t border-gray-700 pt-6 text-center text-gray-400">
          © {year} Mustafa Ibrahim.
        </div>
      </div>
    </footer>
  )
}
