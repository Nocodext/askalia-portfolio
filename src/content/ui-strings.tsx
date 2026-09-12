import type { ReactNode } from "react";

export type UIStrings = {
  nav: {
    caseStudies: string;
    cartography: string;
    method: string;
    sideBusiness: string;
    recommendations: string;
    contact: string;
    altLangHref: string;
    altLangLabel: string;
    startProject: string;
  };
  hero: {
    titleExplainer: ReactNode;
    intro: ReactNode;
    seeCaseStudies: string;
    statCaseStudies: string;
    statSideProjects: string;
    traits: string;
    currentlyLabel: string;
    currentSoignant: string;
    currentlyLaunchingPrefix: string;
    juryLabel: string;
    jurySchools: string;
    ciiTitle: string;
    ciiLabel: string;
    intlTitle: string;
    intlLabel: string;
  };
  matrixAxes: {
    roles: string;
    functional: string;
    sectors: string;
    technical: string;
    ethical: string;
  };
  caseCard: {
    glossaryAria: string;
    glossaryHeading: string;
    interventionFields: string;
    expand: string;
    collapse: string;
    viewPhotos: string;
    backToGallery: string;
    positioningLabel: string;
    prevCase: string;
    nextCase: string;
    functionalWork: string;
    technicalWork: string;
    challengesLabel: string;
    viewLiveDemo: string;
    seeDemo: string;
    seeBlog: string;
    seeTestimonial: string;
  };
  caseToc: { ariaLabel: string };
  work: {
    sectionLabel: string;
    disabledHeading: string;
    missionsSuffix: string;
    sideProjectSuffix: string;
    searchPlaceholder: string;
    searchAria: string;
    searchClearAria: string;
    searchNoResults: string;
    sideProjectLabel: string;
    searchMatchLabels: Record<
      | "need"
      | "ecosystem"
      | "highlights"
      | "stack"
      | "tags"
      | "matrix"
      | "glossary"
      | "scope"
      | "challenges"
      | "pitch"
      | "bullets"
      | "business"
      | "llms",
      string
    >;
  };
  overview: {
    sectionLabel: string;
    heading: (n: number) => ReactNode;
    description: string;
  };
  process: {
    sectionLabel: string;
    heading: string;
    intro: string;
  };
  sideBusiness: {
    sectionLabel: string;
    intro: string;
    productSuffix: string;
    stackLabel: string;
    llmsUsed: string;
  };
  recommendations: {
    sectionLabel: string;
    heading: string;
    seeLinkedCase: string;
    ctaText: string;
    ctaAction: string;
  };
  contact: {
    sectionLabel: string;
    heading: string;
    body: string;
    emailPlaceholder: string;
    copiedToClipboard: string;
    cvLabel: string;
  };
};

export const uiStringsFr: UIStrings = {
  nav: {
    caseStudies: "Cas clients",
    cartography: "Cartographie",
    method: "Méthode",
    sideBusiness: "Side-business",
    recommendations: "Recommandations",
    contact: "Contact",
    altLangHref: "/en",
    altLangLabel: "EN",
    startProject: "Démarrer un projet",
  },
  hero: {
    titleExplainer: (
      <>
        À la croisée du produit et de la technique.
        <br />
        <br />
        Mon parcours est celui d’un ingénieur très autodidacte et impliqué, qui s’est
        progressivement rapproché du produit. J’aime partir d’un problème concret, aller voir
        comment il se manifeste réellement sur le terrain, et faire évoluer la solution à mesure
        qu’on apprend - sans perdre de vue ce qu’il faudra construire derrière. Ce que l’on imagine
        et ce qui fonctionne réellement ne sont pas toujours la même chose.
      </>
    ),
    intro: (
      <>
        Généraliste par choix, transverse par tempérament - hospitalier, presse numérique,
        RH/emploi, e-learning, smart-city, laboratoire, énergie & courtage, bureau d'études Bâtiment
        numérique, photographie, patrimoine, Recherche, business, courtage, veille concurrencielle,
        IA, ...
        <br />
        J'aime les défis, notamment ceux qu'on croit impossibles et je vais chercher le besoin réel
        derrière le besoin exprimé.
        <br />
        Conseiller et facilitateur de la transformation numérique & IA des entreprises, nettement
        tourné vers les TPE/PME/ETI de secteurs traditionnels, du cadrage à la mise en production,
        puis à la transmission aux équipes qui la portent.
      </>
    ),
    seeCaseStudies: "Voir les cas clients",
    statCaseStudies: "cas clients présentés",
    statSideProjects: "produits solopreneur",
    traits: "Adaptatif | Inventif | Polyvalent | Proactif | Engagé",
    currentlyLabel: "En ce moment",
    currentSoignant:
      "Architecture d'une plateforme hospitalière d'information Soignant · Patient · Familles",
    currentlyLaunchingPrefix: "lancement de ",
    juryLabel: "Jury expert technique",
    jurySchools: "Oreegami (école du digital) · Ynov (ingénierie logicielle)",
    ciiTitle:
      "Crédit Impôt Innovation, agrément délivré par l'État français, valable jusqu'en 2028",
    ciiLabel: "Agrément CII → 2028",
    intlTitle: "Équipes anglophones (ex. stagiaire international), portée internationale",
    intlLabel: "Anglais courant",
  },
  matrixAxes: {
    roles: "Rôles",
    functional: "Fonctionnel",
    sectors: "Sectoriel",
    technical: "Technologique",
    ethical: "Éthique",
  },
  caseCard: {
    glossaryAria: "Glossaire",
    glossaryHeading: "Glossaire",
    interventionFields: "Champs d'intervention",
    expand: "Voir le détail",
    collapse: "Réduire",
    viewPhotos: "La galerie",
    backToGallery: "Retour à la galerie",
    positioningLabel: "Écosystème",
    prevCase: "Cas précédent",
    nextCase: "Cas suivant",
    functionalWork: "Travaux fonctionnels",
    technicalWork: "Travaux techniques",
    challengesLabel: "Enjeux & solutions",
    viewLiveDemo: "Voir en action",
    seeDemo: "Voir la demo",
    seeBlog: "Journal de bord",
    seeTestimonial: "Voir le témoignage",
  },
  caseToc: { ariaLabel: "Sommaire des cas clients" },
  work: {
    sectionLabel: "[02] - Cas clients",
    disabledHeading: "Des défis qu'on disait impossibles, livrés en production.",
    missionsSuffix: "missions",
    sideProjectSuffix: "(side-business)",
    searchPlaceholder: "Rechercher un cas client (secteur, stack, rôle...)",
    searchAria: "Rechercher parmi les cas clients",
    searchClearAria: "Effacer la recherche",
    searchNoResults: "Aucun cas client ne correspond à cette recherche.",
    sideProjectLabel: "Side-business",
    searchMatchLabels: {
      need: "Besoin",
      ecosystem: "Écosystème",
      highlights: "Points clés",
      stack: "Stack",
      tags: "Tags",
      matrix: "Matrice",
      glossary: "Glossaire",
      scope: "Périmètre",
      challenges: "Défis",
      pitch: "Pitch",
      bullets: "Détails",
      business: "Traction",
      llms: "LLM",
    },
  },
  overview: {
    sectionLabel: "[03] - Cartographie",
    heading: (n) => <>Ce que couvrent les {n} missions, en un coup d'œil.</>,
    description:
      "Synthèse des secteurs, compétences techniques et produit, et rôles endossés, à partir des matrices d'intervention de chaque cas client.",
  },
  process: {
    sectionLabel: "[04] - Méthode",
    heading: "Un plan lisible qui devient un système en marche.",
    intro:
      "Ne pas confondre ce que l'on imagine avec ce qui fonctionne réellement : une solution ne se conçoit pas entièrement à distance, dans un bureau d'études - le terrain apporte sa propre vérité, et il faut savoir l'écouter.",
  },
  sideBusiness: {
    sectionLabel: "[06] - Side-business",
    intro:
      "Quatre produits menés en solopreneur, de l'idée à la production : des extensions navigateur qui apportent aux power users les fonctionnalités d'interface qu'aucune de ces plateformes ne propose nativement.",
    productSuffix: "/ produit",
    stackLabel: "Stack",
    llmsUsed: "LLMs utilisés",
  },
  recommendations: {
    sectionLabel: "[05] - Recommandations",
    heading: "Ce qu'en disent celles et ceux qui ont travaillé avec moi.",
    seeLinkedCase: "Voir le cas client",
    ctaText: "Soyez le prochain à avoir envie de me recommander",
    ctaAction: "Me contacter",
  },
  contact: {
    sectionLabel: "[07] - Contact",
    heading: "Parlons du problème avant la solution.",
    body: "Une mission engagée à la fois. Décrivez le contexte et les contraintes : je vois au-delà du besoin exprimé pour capter ce qu'il recouvre vraiment, et ce que la technologie peut réellement débloquer - souvent plus que ce qu'on imagine. J'étudie la faisabilité, je cadre, je m'imprègne du métier et du fonctionnel, puis je porte l'architecture et les itérations de livraison - jusqu'à l'impact recherché : usage, facilitation, création de valeur.",
    emailPlaceholder: "Afficher l'email",
    copiedToClipboard: "Copié",
    cvLabel: "Télécharger le CV",
  },
};

export const uiStringsEn: UIStrings = {
  nav: {
    caseStudies: "Case Studies",
    cartography: "Overview",
    method: "Method",
    sideBusiness: "Side Projects",
    recommendations: "Recommendations",
    contact: "Contact",
    altLangHref: "/",
    altLangLabel: "FR",
    startProject: "Start a Project",
  },
  hero: {
    titleExplainer: (
      <>
        At the crossroads of product and engineering.
        <br />
        <br />
        My path is that of a highly self-taught, hands-on engineer who gradually moved toward
        product. I like starting from a concrete problem, going to see how it actually plays out in
        the field, and evolving the solution as we learn - without losing sight of what will need to
        be built behind it. What we imagine and what actually works aren't always the same thing.
      </>
    ),
    intro: (
      <>
        A generalist by choice, cross-functional by temperament - healthcare, digital publishing,
        e-learning, smart cities, laboratories, energy, engineering firms, photography, wealth
        management, research, brokerage, AI, and more.
        <br />
        I go looking for the real need behind the one that gets asked for - especially on problems
        everyone assumes are impossible.
        <br />I help traditional-industry companies through digital & AI transformation, from
        scoping to production, then hand it off cleanly to the teams who'll own it.
      </>
    ),
    seeCaseStudies: "See the case studies",
    statCaseStudies: "case studies featured",
    statSideProjects: "solo-built products",
    traits: "Adaptive | Inventive | Versatile | Proactive | Committed",
    currentlyLabel: "Currently",
    currentSoignant: "Architecting a hospital Care Team · Patient · Family information platform",
    currentlyLaunchingPrefix: "launching ",
    juryLabel: "Technical expert jury",
    jurySchools: "Oreegami (digital school) · Ynov (software engineering)",
    ciiTitle:
      "Crédit Impôt Innovation - France's state-approved R&D tax credit accreditation, valid through 2028",
    ciiLabel: "CII Tax Credit → 2028",
    intlTitle:
      "Comfortable working with English-speaking, international teams (e.g. an international intern)",
    intlLabel: "International teams",
  },
  matrixAxes: {
    roles: "Roles",
    functional: "Functional",
    sectors: "Sector",
    technical: "Technology",
    ethical: "Ethics",
  },
  caseCard: {
    glossaryAria: "Glossary",
    glossaryHeading: "Glossary",
    interventionFields: "Areas of intervention",
    expand: "See details",
    collapse: "Collapse",
    viewPhotos: "View visuals",
    backToGallery: "Back to gallery",
    positioningLabel: "Ecosystem",
    prevCase: "Previous case",
    nextCase: "Next case",
    functionalWork: "Functional work",
    technicalWork: "Technical work",
    challengesLabel: "Challenges & solutions",
    viewLiveDemo: "See it in action",
    seeDemo: "See the demo",
    seeBlog: "Build log",
    seeTestimonial: "See the testimonial",
  },
  caseToc: { ariaLabel: "Case studies table of contents" },
  work: {
    sectionLabel: "[01] - Case Studies",
    disabledHeading: "Challenges everyone said were impossible, shipped to production.",
    missionsSuffix: "missions",
    sideProjectSuffix: "(side project)",
    searchPlaceholder: "Search case studies (sector, stack, role...)",
    searchAria: "Search case studies",
    searchClearAria: "Clear search",
    searchNoResults: "No case study matches this search.",
    sideProjectLabel: "Side project",
    searchMatchLabels: {
      need: "Need",
      ecosystem: "Ecosystem",
      highlights: "Highlights",
      stack: "Stack",
      tags: "Tags",
      matrix: "Matrix",
      glossary: "Glossary",
      scope: "Scope",
      challenges: "Challenges",
      pitch: "Pitch",
      bullets: "Details",
      business: "Traction",
      llms: "LLM",
    },
  },
  overview: {
    sectionLabel: "[02] - Overview",
    heading: (n) => <>What the {n} missions cover, at a glance.</>,
    description:
      "A synthesis of sectors, technical and product skills, and roles held, drawn from each case study's intervention matrix.",
  },
  process: {
    sectionLabel: "[03] - Method",
    heading: "A clear plan that becomes a working system.",
    intro:
      "Not confusing what we imagine with what actually works: a solution can't be fully designed at a distance, from a design office - the field carries its own truth, and you have to know how to listen to it.",
  },
  sideBusiness: {
    sectionLabel: "[05] - Side Projects",
    intro:
      "Four products built solo, from idea to production: browser extensions that give power users the interface features none of these platforms ever shipped natively.",
    productSuffix: "/ product",
    stackLabel: "Stack",
    llmsUsed: "LLMs used",
  },
  recommendations: {
    sectionLabel: "[04] - Recommendations",
    heading: "What people who've worked with me have to say.",
    seeLinkedCase: "See the case study",
    ctaText: "Be the next person who feels like recommending me",
    ctaAction: "Get in touch",
  },
  contact: {
    sectionLabel: "[06] - Contact",
    heading: "Let's talk about the problem before the solution.",
    body: "One committed engagement at a time. Describe the context and the constraints: I look past the stated need to find what it's really about, and what technology can actually unlock - usually more than people expect. I study feasibility, scope the work, get immersed in the business and its workflows, then own the architecture and delivery iterations - through to the outcome that matters: adoption, ease of use, real value created.",
    emailPlaceholder: "Reveal email",
    copiedToClipboard: "Copied",
    cvLabel: "Download CV",
  },
};
