export const translations = {
  en: {
    nav: {
      home: "Home",
      about: "About",
      contact: "Contact",
    },
    toggle: {
      label: "Toggle language",
      en: "EN",
      so: "SO",
    },
    hero: {
      title: "Front-End Developer — React & Next.js",
      description:
        "I build fast, modern and user-friendly websites focused on clean UI and high performance.",
      hire: "Hire Me",
      viewProjects: "View Projects",
      techLabel: "Technical Skills",
    },
    skills: {
      title: "Technical Skills",
      subtitle: "Technologies and tools I use to build modern web applications",
    },
    projects: {
      title: "Projects",
      subtitle: "Some of the projects I have built using modern web technologies",
      liveDemo: "Live Demo",
      items: {
        multilingual: {
          title: "Multilingual Portfolio",
          description: "Next.js portfolio with i18n, RTL support and modern UI.",
        },
        dashboard: {
          title: "React Dashboard",
          description: "Admin dashboard built with React and API integration.",
        },
        fullstack: {
          title: "Fullstack App",
          description: "Fullstack app using Node.js, Express and MongoDB.",
        },
      },
    },
    services: {
      title: "Services",
      subtitle: "What I can help you build",
      items: {
        frontend: {
          title: "Frontend Development",
          desc: "Modern, responsive and accessible user interfaces using React and Next.js.",
        },
        fullstack: {
          title: "Full Website Development",
          desc: "Complete websites from idea to deployment, including frontend and backend.",
        },
        api: {
          title: "API & Integration",
          desc: "Integration of APIs, backend services and databases.",
        },
      },
    },
    contact: {
      title: "Contact",
      subtitle: "Let's work together. Send me a message.",
      email: "Email",
      whatsapp: "WhatsApp",
    },
    footer: {
      contact: "Contact",
      follow: "Follow me",
      quickLinks: "Quick links",
      skills: "Skills",
      projects: "Projects",
      services: "Services",
      contactLink: "Contact",
    },
    about: {
      title: "About Me",
      paragraphs: [
        "I am a Frontend Developer based in Sweden with a strong passion for building modern, responsive, and user-focused web applications.",
        "I have completed my professional studies in Frontend Development in Boras, Sweden, where I built a solid foundation in HTML5, CSS, SCSS, Tailwind, JavaScript, TypeScript, React and Next.js.",
        "Over the past two years, I have gained hands-on experience building websites and web applications using React, Next.js, Tailwind CSS, and API integrations.",
        "I enjoy transforming complex ideas into simple, elegant, and functional digital solutions, with a strong focus on performance and user experience.",
      ],
    },
  },
  so: {
    nav: {
      home: "Bogga Hore",
      about: "Ku Saabsan",
      contact: "Nala Soo Xiriir",
    },
    toggle: {
      label: "Beddel luqadda",
      en: "EN",
      so: "SO",
    },
    hero: {
      title: "Horumariye Front-End — React & Next.js",
      description:
        "Waxaan dhisaa mareegaha degdeg ah, casri ah, oo sahlan in la isticmaalo, anigoo diirada saaraya UI nadiif ah iyo waxqabad sare.",
      hire: "I Shaqaaleysi",
      viewProjects: "Eeg Mashaariicda",
      techLabel: "Xirfadaha Farsamo",
    },
    skills: {
      title: "Xirfadaha Farsamo",
      subtitle: "Tignoolajiyada iyo qalabka aan u adeegsado dhisida web apps casri ah",
    },
    projects: {
      title: "Mashaariic",
      subtitle:
        "Qaar ka mid ah mashaariicda aan ku dhisay tignoolajiyada web-ka casriga ah",
      liveDemo: "Daawo Muuqaal",
      items: {
        multilingual: {
          title: "Portfolio Luuqado Badan",
          description: "Portfolio Next.js ah oo leh i18n, taageero RTL, iyo UI casri ah.",
        },
        dashboard: {
          title: "Dashboard React",
          description: "Dashboard maamul oo lagu dhisay React iyo isku-darka API.",
        },
        fullstack: {
          title: "App Fullstack",
          description: "App fullstack ah oo leh Node.js, Express iyo MongoDB.",
        },
      },
    },
    services: {
      title: "Adeegyada",
      subtitle: "Waxa aan kaa caawin karo inaad dhisto",
      items: {
        frontend: {
          title: "Horumarinta Frontend",
          desc: "UI casri ah, la jaanqaadaya qalabka, oo la heli karo, iyadoo la adeegsanayo React iyo Next.js.",
        },
        fullstack: {
          title: "Dhismaha Websayt Buuxa",
          desc: "Websayt dhamaystiran laga bilaabo fikrad ilaa daabacaad, oo ay ku jiraan frontend iyo backend.",
        },
        api: {
          title: "API & Isku-darka",
          desc: "Isku-darka API-yada, adeegyada backend, iyo kaydka xogta.",
        },
      },
    },
    contact: {
      title: "Xiriir",
      subtitle: "Aan wada shaqeyno. Ii soo dir fariin.",
      email: "Iimeyl",
      whatsapp: "WhatsApp",
    },
    footer: {
      contact: "Xiriir",
      follow: "I Raac",
      quickLinks: "Xiriirro Degdeg ah",
      skills: "Xirfadaha",
      projects: "Mashaariic",
      services: "Adeegyada",
      contactLink: "Xiriir",
    },
    about: {
      title: "Aniga Igu Saabsan",
      paragraphs: [
        "Waxaan ahay Horumariye Frontend oo ku sugan Sweden, waxaanan leeyahay xiise weyn oo aan ku dhiso web apps casri ah, u jawaaba qalabka, oo diirada saaraya isticmaalaha.",
        "Waxaan dhameeyay waxbarashadayda xirfadeed ee Horumarinta Frontend ee Boras, Sweden, halkaas oo aan ka dhistay aasaas adag oo ku saabsan HTML5, CSS, SCSS, Tailwind, JavaScript, TypeScript, React iyo Next.js.",
        "Labadii sano ee la soo dhaafay, waxaan helay khibrad toos ah oo aan ku dhisay websaytyo iyo web apps anigoo adeegsanaya React, Next.js, Tailwind CSS, iyo isku-darka API.",
        "Waxaan ku raaxaystaa inaan fikradaha adag u beddelo xalal dijitaal ah oo fudud, qurux badan, kana shaqeeya si fiican, anigoo si gaar ah diirada u saaraya waxqabadka iyo waayo-aragnimada isticmaalaha.",
      ],
    },
  },
} as const

export type Language = keyof typeof translations
export type TranslationStrings = (typeof translations)["en"]
