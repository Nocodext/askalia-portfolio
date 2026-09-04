import type { ReactNode } from "react";

export type UIStrings = {
  nav: {
    caseStudies: string;
    cartography: string;
    method: string;
    sideBusiness: string;
    contact: string;
    altLangHref: string;
    altLangLabel: string;
    startProject: string;
  };
  hero: {
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
  };
  caseToc: { ariaLabel: string };
  work: {
    sectionLabel: string;
    disabledHeading: string;
    missionsSuffix: string;
    sideProjectSuffix: string;
  };
  overview: {
    sectionLabel: string;
    heading: (n: number) => ReactNode;
    description: string;
  };
  process: {
    sectionLabel: string;
    heading: string;
  };
  sideBusiness: {
    sectionLabel: string;
    intro: string;
    productSuffix: string;
    llmsUsed: string;
  };
  contact: {
    sectionLabel: string;
    heading: string;
    body: string;
    emailPlaceholder: string;
    copiedToClipboard: string;
  };
};

export const uiStringsFr: UIStrings = {
  nav: {
    caseStudies: "Cas clients",
    cartography: "Cartographie",
    method: "Méthode",
    sideBusiness: "Side-business",
    contact: "Contact",
    altLangHref: "/en",
    altLangLabel: "EN",
    startProject: "Démarrer un projet",
  },
  hero: {
    intro: (
      <>
        Généraliste par choix, transverse par tempérament — hospitalier, presse numérique,
        e-learning, smart-city, laboratoire, énergie, bureau d'études, photographie, patrimoine,
        BTP, Bâtiment numérique (BIM), Recherche, business, courtage, veille concurrencielle, IA,
        ...
        <br />
        J'aime les défis, notamment ceux qu'on croit impossibles et je vais chercher le besoin réel
        derrière le besoin exprimé.
        <br />
        Conseiller et facilitateur de la transformation numérique & IA des entreprises de secteurs
        traditionnels, du cadrage à la mise en production, puis à la transmission aux équipes qui la
        portent.
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
  },
  caseToc: { ariaLabel: "Sommaire des cas clients" },
  work: {
    sectionLabel: "[01] — Cas clients",
    disabledHeading: "Des défis qu'on disait impossibles, livrés en production.",
    missionsSuffix: "missions",
    sideProjectSuffix: "(side-business)",
  },
  overview: {
    sectionLabel: "[02] — Cartographie",
    heading: (n) => (
      <>
        Ce que couvrent les {n} missions, <br />
        en un coup d'œil.
      </>
    ),
    description:
      "Synthèse des secteurs, compétences techniques et produit, et rôles endossés, à partir des matrices d'intervention de chaque cas client.",
  },
  process: {
    sectionLabel: "[03] — Méthode",
    heading: "Un plan lisible qui devient un système en marche.",
  },
  sideBusiness: {
    sectionLabel: "[04] — Side-business",
    intro:
      "Quatre produits menés en solopreneur, de l'idée à la production : extensions navigateur et outillage qui comblent les manques des plateformes que les équipes utilisent tous les jours.",
    productSuffix: "/ produit",
    llmsUsed: "LLMs utilisés",
  },
  contact: {
    sectionLabel: "[05] — Contact",
    heading: "Parlons du problème avant la solution.",
    body: "Une mission engagée à la fois. Décrivez le contexte et les contraintes : je vois au-delà du besoin exprimé pour capter ce qu'il recouvre vraiment, et ce que la technologie peut réellement débloquer — souvent plus que ce qu'on imagine. J'étudie la faisabilité, je cadre, je m'imprègne du métier et du fonctionnel, puis je porte l'architecture et les itérations de livraison — jusqu'à l'impact recherché : usage, facilitation, création de valeur.",
    emailPlaceholder: "Afficher l'email",
    copiedToClipboard: "Copié",
  },
};

export const uiStringsEn: UIStrings = {
  nav: {
    caseStudies: "Case Studies",
    cartography: "Overview",
    method: "Method",
    sideBusiness: "Side Projects",
    contact: "Contact",
    altLangHref: "/",
    altLangLabel: "FR",
    startProject: "Start a Project",
  },
  hero: {
    intro: (
      <>
        A generalist by choice, cross-functional by temperament — healthcare, digital publishing,
        e-learning, smart cities, laboratories, energy, engineering firms, photography, wealth
        management, research, brokerage, AI, and more.
        <br />
        I go looking for the real need behind the one that gets asked for — especially on problems
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
      "Crédit Impôt Innovation — France's state-approved R&D tax credit accreditation, valid through 2028",
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
  },
  caseToc: { ariaLabel: "Case studies table of contents" },
  work: {
    sectionLabel: "[01] — Case Studies",
    disabledHeading: "Challenges everyone said were impossible, shipped to production.",
    missionsSuffix: "missions",
    sideProjectSuffix: "(side project)",
  },
  overview: {
    sectionLabel: "[02] — Overview",
    heading: (n) => <>What the {n} missions cover, at a glance.</>,
    description:
      "A synthesis of sectors, technical and product skills, and roles held, drawn from each case study's intervention matrix.",
  },
  process: {
    sectionLabel: "[03] — Method",
    heading: "A clear plan that becomes a working system.",
  },
  sideBusiness: {
    sectionLabel: "[04] — Side Projects",
    intro:
      "Four products built solo, from idea to production: browser extensions and tooling that fill the gaps in the platforms teams use every day.",
    productSuffix: "/ product",
    llmsUsed: "LLMs used",
  },
  contact: {
    sectionLabel: "[05] — Contact",
    heading: "Let's talk about the problem before the solution.",
    body: "One committed engagement at a time. Describe the context and the constraints: I look past the stated need to find what it's really about, and what technology can actually unlock — usually more than people expect. I study feasibility, scope the work, get immersed in the business and its workflows, then own the architecture and delivery iterations — through to the outcome that matters: adoption, ease of use, real value created.",
    emailPlaceholder: "Reveal email",
    copiedToClipboard: "Copied",
  },
};
