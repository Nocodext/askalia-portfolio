export type InterventionMatrix = {
  roles: string[];
  functional: string[];
  sectors: string[];
  technical: string[];
  ethical: string[];
};

export type HighlightDetail = {
  text: string;
  objective?: string;
  detail?: string[];
};

export type Highlight = string | HighlightDetail;

export type GlossaryEntry = { term: string; def: string };

export type GalleryPhoto = { src: string; alt: string };
export type GalleryVideo = { youtubeId: string; title: string };
export type GalleryItem = GalleryPhoto | GalleryVideo;

export type CaseStudy = {
  id: string;
  index: string;
  sector: string;
  title: string;
  need: string;
  needObjective?: string;
  /** Known market ecosystem - used sparingly, only where genuinely
   * recognizable, accurate references exist. Not every case needs one. */
  ecosystem?: { name: string; logo?: string }[];
  /** Small illustrative image shown inline next to the need callout - for
   * a single, at-a-glance visual (e.g. platforms covered). Distinct from
   * `photos`, which opens in the full gallery dialog on click. */
  calloutImage?: string;
  highlights: Highlight[];
  highlightGroups?: { functional: Highlight[]; technical: Highlight[] };
  stackSoftware: string[];
  stackHardware?: string[];
  hashtags: string[];
  matrix: InterventionMatrix;
  duration?: string;
  glossary?: GlossaryEntry[];
  logos?: string[];
  scope?: { label: string; body: string };
  photos?: GalleryItem[];
  challenges?: { constraint: string; response: string }[];
  flagship?: boolean;
  hidden?: boolean;
  /** Live product demo: a short looping video teaser, plus links out to the
   * full interactive demo and its build-log blog. Both hrefs are outside
   * this app's own router (separate deploy / static file), so they're
   * rendered as plain <a> tags, not TanStack <Link>. */
  liveDemo?: { previewVideo: string; demoHref: string; blogHref: string };
};

function highlightText(h: Highlight): string {
  return typeof h === "string" ? h : [h.text, h.objective, ...(h.detail ?? [])].join(" ");
}

export type CaseSearchCategory =
  | "title"
  | "sector"
  | "need"
  | "ecosystem"
  | "highlights"
  | "stack"
  | "tags"
  | "matrix"
  | "glossary"
  | "scope"
  | "challenges";

// One entry per raw source string (not merged into a per-category blob),
// so the UI can point back at exactly which value a query matched - e.g.
// showing "Stack: DocumentDB" rather than just "Stack" when the hit came
// from that one stackSoftware entry among several.
export type CaseSearchField = { category: CaseSearchCategory; value: string };

// The case search box matches against this instead of the rendered DOM -
// a lot of a case's content (glossary, matrix, challenges, the full
// highlight groups) never renders in the collapsed card, only inside the
// popup, so a DOM/text search would silently miss it.
export function caseSearchFields(item: CaseStudy): CaseSearchField[] {
  const fields: CaseSearchField[] = [];
  const push = (category: CaseSearchCategory, ...values: (string | undefined)[]) => {
    for (const value of values) {
      if (value) fields.push({ category, value });
    }
  };

  push("title", item.title);
  push("sector", item.sector);
  push("need", item.need, item.needObjective, item.duration);
  push("ecosystem", ...(item.ecosystem?.map((e) => e.name) ?? []));
  push(
    "highlights",
    ...item.highlights.map(highlightText),
    ...(item.highlightGroups?.functional.map(highlightText) ?? []),
    ...(item.highlightGroups?.technical.map(highlightText) ?? []),
  );
  push("stack", ...item.stackSoftware, ...(item.stackHardware ?? []));
  push("tags", ...item.hashtags);
  push(
    "matrix",
    ...item.matrix.roles,
    ...item.matrix.functional,
    ...item.matrix.sectors,
    ...item.matrix.technical,
    ...item.matrix.ethical,
  );
  push("glossary", ...(item.glossary?.flatMap((g) => [g.term, g.def]) ?? []));
  push("scope", item.scope?.label, item.scope?.body);
  push("challenges", ...(item.challenges?.flatMap((c) => [c.constraint, c.response]) ?? []));

  return fields;
}

export function caseSearchText(item: CaseStudy): string {
  return caseSearchFields(item)
    .map((f) => f.value)
    .join(" \n ")
    .toLowerCase();
}

export const profile = {
  firstName: "Joris",
  lastName: "GROUILLET",
  initials: "JG",
  role: "Product & Technical Architect",
  tagline: "Product clarity. Technical fluency.",
  location: "France / Europe",
  emailUser: "hello",
  emailDomain: "askalia.net",
  sideBusinessBrand: "nocodext.studio",
  linkedinUrl: "https://www.linkedin.com/in/jorisgrouillet/",
};

export const cases: CaseStudy[] = [
  {
    id: "reanimation",
    index: "00",
    sector: "Santé · Hôpital / Soins critiques",
    title:
      "Plateforme hospitalière : continuité informationnelle Soignant · Familles · Patients en soins critiques",
    need: `Cette plateforme web et mobile connecte les familles de patients hospitalisés à l'équipe soignante : synchronisation automatique
  avec les systèmes hospitaliers dès l'admission, transmissions et alertes en temps réel vers les
  proches, sans ressaisie côté soignant. Complétion infos médicales par les proches.`,
    needObjective:
      "Objectif : réduire la charge de communication du personnel tout en gardant les familles informées et rassurées pendant le séjour.",
    highlights: [],
    highlightGroups: {
      functional: [
        "Premier profil technique de la structure : responsabilité pleine et entière des choix d'architecture, en autonomie totale.",
        "Démarche UX/UI conduite en co-création avec les agents hospitaliers.",
        "Modélisation des flux hospitaliers de soins critiques : admissions, suivis, sorties, transferts, règles métier, déclenchements et automatisations.",
        "Transmission d'informations médicales et paramédicales, alerting familles / soignants et follow-up d'actions.",
        "Import d'un pool de soignants paramédicaux via Excel pour aligner le logiciel avec la réalité du staffing en vigueur.",
        "Portail Famille & Soignant : e-CPS, OTP, 2FA, Citrix & RPA.",
        "App mobile React Native pensée pour les familles : magic link, OTP, certificats mTLS, app links WhatsApp, notifications SMS.",
        "Admin de démo vibecodée pour autonomiser l'équipe Sales.",
        "Intégration du dispositif de connexion soignant, type DPI (Dossier Patient Informatisé).",
        "Documentation DSI/RSSI : flux de données, ADR, registre de consignations, réglementaire, HDS, RGPD/DPO, cybersécurité, DMZ.",
        "Tech lead & mentorat d'une petite équipe + stagiaire anglophone.",
        "Gouvernance de la donnée : dépôts kSuite pour les partenaires, accès internes ajustés, clés SSH, coffre-fort en ligne, password manager.",
      ],
      technical: [
        "Migration d'une app legacy PHP/CMS vers une architecture NestJS hospitalière : hexagonale, event-driven, synchronisation IHE / PAM / HL7.",
        "Migration MySQL legacy vers PostgreSQL : triggers, pg_cron, PostgREST, pg_net, partitioning, pooling, ségrégation de schémas.",
        "Interopérabilité SI-H d'un centre hospitalier, Direction du Numérique en Santé, DPI ; interop d'État avec l'Agence du Numérique en Santé et le DMP.",
        "Implémentation des exigences HDS niveaux 4 à 6.",
        "Ingestion des flux d'évènements Patient HL7/FHIR à partir de la source Logiciel de gestion-patient (PAM) fourni par la DSI, via adaptateurs SFTP et MLLP/MLLPS - les 2 protocoles standards d'échange de données de l'industrie.",
        "Architecture résiliente par nœuds, Docker Compose LAN design.",
        "Knowledge base via Claude / MCP / Notion / Mermaid / Structurizr, diagrammes de flux, logigrammes et schémas d'architecture sur Whimsical.",
        "Montage d'un code-knowledge-graph LLM comme mémoire vivante de la codebase.",
        "Agents de dev, MCP et skills.",
        "Création d'une CLI facilitant la IT Experience équipe interne et partenaires.",
      ],
    },
    stackSoftware: [
      "NestJS",
      "PostgreSQL",
      "Redis",
      "HL7 / FHIR",
      "IHE · PAM",
      "React Native",
      "Docker compose & LAN",
      "Infomaniak kSuite",
      "Let's Encrypt",
      "Brevo",
      "Whimsical",
      "Notion",
      "Linear",
    ],
    hashtags: [
      "hospitalier",
      "souveraineté",
      "HDS 4-6",
      "RGPD",
      "cybersécurité",
      "résilience",
      "Secret médical",
      "Cloud Act",
      "Dossier Patient (DPI)",
    ],
    matrix: {
      roles: ["Tech Lead", "Architecte", "Mentor", "Développeur mobile"],
      functional: [
        "Admissions & suivi patient",
        "Alerting familles / soignants",
        "Portail famille & soignant",
      ],
      sectors: ["Hôpital / Soins critiques", "CHU", "Santé publique"],
      technical: [
        "Event-driven",
        "Architecture hexagonale",
        "Base de données relationnelle",
        "Mobile natif",
        "Conteneurisation",
      ],
      ethical: ["HDS niveaux 4-6", "RGPD / DPO", "Souveraineté de la donnée"],
    },
    duration: "1 an",
    glossary: [
      {
        term: "PAM",
        def: "Patient Administration Management - gestion administrative des patients (identités, admissions, mouvements).",
      },
      {
        term: "HL7",
        def: "Health Level 7 - famille de standards d'échange de données de santé entre systèmes hospitaliers.",
      },
      {
        term: "MLLP",
        def: "Minimal Lower Layer Protocol - protocole de transport historique des messages HL7 sur le réseau hospitalier.",
      },
      {
        term: "FHIR",
        def: "Fast Healthcare Interoperability Resources - standard HL7 moderne basé sur des API REST/JSON.",
      },
      {
        term: "DPI",
        def: "Dossier Patient Informatisé - dossier médical numérique centralisant les données du patient.",
      },
      {
        term: "SFTP",
        def: "SSH File Transfer Protocol - protocole de transfert de fichiers sécurisé par SSH.",
      },
      {
        term: "EAI",
        def: "Enterprise Application Integration - middleware d'intégration entre les systèmes d'un SI hospitalier.",
      },
    ],
    flagship: true,
  },
  {
    id: "veille-tarifaire",
    index: "01",
    sector: "E-commerce · Pièces détachées automobile",
    title: "Veille concurrentielle tarifaire temps réel - pièces détachées automobile",
    need: "Plateforme de veille concurrentielle temps réel pour un e-commerçant leader de pièces détachées automobile : surveillance des prix pratiqués par la concurrence, moyennes par référence, appariement de références par proximité heuristique, et détection des stocks avérés ou présumés chez les 10 principaux concurrents européens ciblés.",
    needObjective:
      "Objectif : dresser un état des lieux pour la prise de décision en stratégie de pricing et prévision des stocks.",
    highlights: [
      "Orchestration d'une armée de scrapers de sites web pour couvrir les 10 principaux concurrents européens.",
      "Étude et contournement des systèmes anti-bots.",
      "Description et enregistrement des scénarios-types de scraping par site concurrent.",
      "Extraction, filtrage, nettoyage et structuration de la donnée collectée.",
      "Dénormalisation de la donnée pour import dans l'outil de Business Intelligence.",
    ],
    stackSoftware: [
      "Web scraping",
      "Bright Data",
      "Contournement anti-bot",
      "Pipeline ETL",
      "Business Intelligence",
    ],
    hashtags: ["scraping", "veille concurrentielle", "pricing", "anti-bot"],
    matrix: {
      roles: ["Architecte", "Data engineer"],
      functional: ["Veille concurrentielle", "Aide à la décision pricing", "Prévision des stocks"],
      sectors: ["E-commerce", "Automobile / pièces détachées"],
      technical: [
        "Web scraping à grande échelle",
        "Contournement anti-bot",
        "Pipeline ETL",
        "Business Intelligence",
      ],
      ethical: ["Scraping raisonné (rate-limiting) et vérification KYC des sources ciblées"],
    },
  },
  {
    id: "energie",
    index: "02",
    sector: "Énergie · Courtage",
    title: "Courtier énergies : Homologation API réseau Enedis & indices de marché",
    need: "Collecter les consommations de compteurs électriques et scraper les indices de prix électricité, carbone et gaz pour estimer le meilleur moment d'émettre un devis.",
    ecosystem: [{ name: "HOHapp" }, { name: "MedesIE" }],
    logos: ["/logos/enedis.svg"],
    photos: [
      { src: "/case-photos/energie/01.webp", alt: "Capture de la plateforme de courtage énergie" },
      { src: "/case-photos/energie/02.webp", alt: "Capture de la plateforme de courtage énergie" },
      { src: "/case-photos/energie/03.webp", alt: "Capture de la plateforme de courtage énergie" },
      { src: "/case-photos/energie/04.webp", alt: "Capture de la plateforme de courtage énergie" },
    ],
    highlights: [
      "Homologation d'une API XML/SOAP sur le webservice SGE d'Enedis, avec gestion de certificats TLS.",
      "14 endpoints et 54 tests unitaires sur Make.com.",
      "Bascule vers N8N pour intégrer scripts JS et agents IA : scraping des indices + traitement de la donnée Enedis.",
    ],
    challenges: [
      {
        constraint:
          "DSI Enedis aux délais de réponse variables, propres à une grande organisation d'un secteur régulé.",
        response:
          "Diplomatie, patience et persévérance dans le suivi pour faire avancer le dossier au bon rythme.",
      },
    ],
    stackSoftware: ["SOAP / XML", "TLS", "Make.com", "N8N", "Weweb"],
    hashtags: [
      "dialogue DSI",
      "temps réel",
      "cybersécurité",
      "scalabilité",
      "homologation de flux",
    ],
    matrix: {
      roles: ["Architecte intégration", "Relation support Enedis"],
      functional: [
        "Collecte de compteurs",
        "Scraping d'indices de marché",
        "Aide à la décision devis",
      ],
      sectors: ["Énergie", "Courtage"],
      technical: ["Web services SOAP/XML", "Automatisation no-code", "Agents IA"],
      ethical: ["Certificats TLS & sécurité des accès"],
    },
    duration: "4 mois",
  },
  {
    id: "ocr-labo",
    index: "03",
    sector: "SaaS · Laboratoire d'analyses",
    title: "Dématérialisation OCR des demandes d'analyses biologiques",
    need: "Dématérialiser les demandes faites auprès d'un laboratoire d'analyses environnementales via OCR, pour passer du papier au numérique.",
    ecosystem: [{ name: "Winlabo" }],
    photos: [
      {
        src: "/case-photos/ocr-bio/bon-prelevement-scan-brut.png",
        alt: "Bon de prélèvement papier scanné, avant traitement OCR (informations client et labo caviardées)",
      },
      {
        src: "/case-photos/ocr-bio/bon-prelevement-champs-detectes.png",
        alt: "Le même bon avec les champs détectés par l'OCR mis en surbrillance par catégorie (flacon, heure, lieu de prélèvement, analyses demandées)",
      },
      {
        src: "/case-photos/ocr-bio/ocr-detection-endoscopes.png",
        alt: "Détection OCR sur un bon de prélèvement pour endoscopes : texte reconnu et polygone de détection",
      },
    ],
    highlights: [],
    highlightGroups: {
      functional: [
        "Chaîne : scan interne → OCR → JSON structuré vers lambda Pipedrive (puis N8N) → RPA de saisie dans le SIL via Citrix.",
        "Gestion de la phase de transition : étude, propositions, dossier de conception, implémentation, feedbacks, hosting, shipping, documentation et formation.",
      ],
      technical: [
        "Panorama et comparatif de performance des offres OCR Cloud pré-entrainées en sémantique et ontologies sur la biologie.",
        "Drive sécurisé et PDF anonymisés pour le RGPD (brûlage binaire Python).",
        "N8N self-hosted sur VPS o2switch, RPA Playwright headless via CDP pour piloter le logiciel desktop SIL.",
      ],
    },
    stackSoftware: ["OCR Cloud", "N8N", "Playwright · CDP", "Citrix", "Pipedrive", "RGPD"],
    hashtags: ["RGPD", "anonymisation", "cloud", "souveraineté", "PME", "Labo"],
    matrix: {
      roles: ["Architecte", "Chef de projet transition"],
      functional: ["Dématérialisation OCR", "RPA de saisie SIL", "Formation utilisateurs"],
      sectors: ["Laboratoire d'analyses", "Environnement"],
      technical: [
        "Vision par ordinateur (OCR)",
        "Automatisation de workflows",
        "RPA (automatisation robotisée)",
        "Hébergement self-hosted",
      ],
      ethical: ["RGPD", "Anonymisation des PDF"],
    },
    duration: "3 mois",
    scope: {
      label: "Réalisé",
      body: "Tout - comparatif OCR Cloud, entrainement IA, faisabilité, conception & angles morts, plan, hébergement, backend, rédaction PDF (anonymisation)  frontend, architecture code + NoCode, prod.",
    },
  },
  {
    id: "channel-manager",
    index: "04",
    sector: "SaaS · Channel manager",
    title: "Hub d'opportunités commerciales entre CRM partenaires",
    need: "SaaS métier channel manager : un hub qui transforme les CRM de partenaires commerciaux en une base commune d'opportunités, sans échange manuel de fichiers clients - plus de 50 000 fiches entreprises enrichies croisées sur 3 CRM différents.",
    ecosystem: [{ name: "Reveal" }],
    logos: ["/logos/crm/salesforce.svg", "/logos/crm/hubspot.svg", "/logos/crm/pipedrive.svg"],
    photos: [
      {
        src: "/case-photos/channel-manager/03.webp",
        alt: "Schéma d'architecture globale : Bubble, Vercel, Fly.io, CRMs",
      },
      {
        src: "/case-photos/channel-manager/schema-1-sync-customer-partner.png",
        alt: "Schéma fonctionnel : première synchronisation client / partenaire",
      },
      {
        src: "/case-photos/channel-manager/schema-2-webhook-created.png",
        alt: "Schéma fonctionnel : webhook de création d'entreprise",
      },
      {
        src: "/case-photos/channel-manager/schema-3-webhook-updated.png",
        alt: "Schéma fonctionnel : webhook de mise à jour d'entreprise",
      },
    ],
    highlights: [
      "Interopérabilité API Salesforce, Pipedrive et HubSpot : 3 API hétérogènes, 3 politiques de rate limiting.",
      "Mix code / NoCode et compromis d'hébergement de données entre Bubble et PostgreSQL (RGPD).",
      "Business process : implémentation + documentation en flowcharts.",
      "Arbitrage architecture monolithe NestJS vs serverless stateless (Edge Functions Vercel).",
      "Jobs asynchrones en MQ Redis, retries, rotation de tokens OAuth multiclients, résilience et reprise Redis.",
      "Supervision de freelances, points et gestion client, mise en production.",
    ],
    stackSoftware: [
      "NestJS",
      "Bubble",
      "Redis MQ",
      "Vercel Edge",
      "OAuth",
      "Salesforce · Pipedrive · HubSpot",
    ],
    hashtags: ["RGPD", "scalabilité", "résilience", "sales-ops"],
    matrix: {
      roles: ["Architecte", "Lead dev", "Supervision de freelances"],
      functional: ["Enrichissement CRM croisé", "Business process", "Rate limiting multi-API"],
      sectors: ["SaaS B2B", "Channel management"],
      technical: [
        "Architecture serverless",
        "Files d'attente asynchrones",
        "Authentification déléguée",
        "APIs REST hétérogènes",
      ],
      ethical: ["RGPD", "Choix d'hébergement des données"],
    },
    duration: "3 ans",
    scope: {
      label: "Réalisé",
      body: "Tout - faisabilité, conception & angles morts, backend, tests et cas limites, frontend, architecture code + NoCode, prod.",
    },
  },
  {
    id: "patrimoine",
    index: "05",
    sector: "Progiciel interne · Gestion de patrimoine",
    title: "CRM + ERP - cabinet gestion patrimoine",
    need: "Progiciel interne : gérer le funnel de suivi client, la validation multiniveaux et l'arbre de permissions entre CRM et ERP d'un cabinet de gestion de patrimoine.",
    highlights: [
      "Phase de cadrage Product Design (UX/UI) en amont, pour aligner le progiciel sur les attentes métier.",
      "Développement d'un CRM + ERP sous Bubble.",
      "Dépôt de fichiers sécurisé et souverain (kSuite Drive) et dépôt de pièces légales via un SaaS FR agréé.",
      "Sensibilisation de l'agence web aux risques liés au RGPD.",
      "Déplacement des business workflows vers Pipedream.",
      "Boucle de feedbacks et formation des équipes.",
    ],
    stackSoftware: ["Bubble", "Pipedream", "kSuite Drive", "RGPD", "RBAC"],
    hashtags: ["souveraineté", "RGPD", "Documents confidentialité", "Secret professionnel"],
    matrix: {
      roles: ["Product Builder", "Conseil RGPD"],
      functional: [
        "Cadrage UX/UI",
        "CRM + ERP",
        "Arbre de permissions multiniveaux",
        "Formation des équipes",
      ],
      sectors: ["Gestion de patrimoine", "Finance"],
      technical: ["No-code", "iPaaS (automatisation)", "RBAC (contrôle d'accès)"],
      ethical: ["RGPD", "Souveraineté (kSuite Drive)"],
    },
    duration: "1 an",
  },
  {
    id: "cad-web",
    index: "06",
    sector: "Éditeur logiciel · Architecture 3D",
    title:
      "Bureau d'études BIM : portabilité d'un logiciel Architecture 3D sous Windows vers SaaS web",
    need: "Éditeur de logiciel desktop C++ 3D pour architectes : prototyper la portabilité vers une version web en SaaS.",
    ecosystem: [{ name: "Revit" }, { name: "ArchiCAD" }],
    photos: [
      {
        src: "/case-photos/cad-web/cad-web-aws-architecture.png",
        alt: "Schéma d'architecture AWS : Lambda, API Gateway, DocumentDB, EC2, SQS, SES, EventBridge, Glacier - pipeline BIM (ingestion, stockage, archivage)",
      },
    ],
    liveDemo: {
      previewVideo: "/case-photos/cad-web/demo-preview.mp4",
      demoHref: "/cad-web/demo-archi/studio/tour-helios-594a0176-2777-4ae3-a475-359332f8337f",
      blogHref: "/cad-web/blog/",
    },
    highlights: [
      "Étude de faisabilité d'une infrastructure cloud hybride Windows + Linux, feuille de route, chiffrage et spécifications.",
      "Gestion des quotas disque, permissions et partages ; plans de souscription.",
      "Upload de fichiers très volumineux sans FTP.",
      "Conversion de fichiers AutoCAD vers un format d'exploitation BJSON sous Windows IoT.",
      "Montage d'un web studio WebGL 2D/3D avec web workers et mise à jour scalable des fichiers de travail édités.",
    ],
    stackSoftware: [
      "AWS (Lambda, EC2, S3, SQS, SNS, Cognito, Glacier)",
      "DocumentDB",
      "WebGL",
      "React",
      "Node.js",
      "Stripe",
    ],
    hashtags: ["scalabilité", "Cloud Act"],
    matrix: {
      roles: ["Architecte polyvalent"],
      functional: [
        "Portabilité desktop → SaaS web",
        "Gestion quotas & plans de souscription",
        "Studio WebGL",
      ],
      sectors: ["Édition logicielle", "Architecture 3D", "Bâtiment Numérique (BIM)"],
      technical: [
        "Cloud public",
        "Base de données NoSQL",
        "Rendu 3D temps réel",
        "Stack JS full-stack",
      ],
      ethical: ["Scalabilité de l'infrastructure cloud", "Exposition Cloud Act (AWS)"],
    },
    duration: "6 mois",
  },
  {
    id: "stt-ehpad",
    index: "07",
    sector: "IA · EHPAD / Santé",
    title: "Résidences médicalisées pour seniors : comptes-rendus médicaux par speech-to-text",
    need: "Permettre aux médecins et paramédicaux en EHPAD de produire comptes-rendus et notes vocales à caractère médical via speech-to-text, puis de les historiser pour le suivi et la transmission.",
    highlights: [
      "Encadrement de la donnée HDS et souveraineté des données.",
      "Interopérabilité API avec les logiciels DUI des EHPAD.",
      "Étude des modèles de coûts d'inférence IA et préconisations hardware + software : edge AI, Kyutai, Whisper (OpenAI), Apple M-series CoreML.",
      "Transcription temps réel streamée, avec contraintes de voix variées, pollution sonore et accents étrangers.",
      "Participation à des conférences IA.",
      "Étude complète, propositions, estimations, spécifications, PoC et prototypes via agentic coding.",
    ],
    stackSoftware: ["Whisper", "Kyutai", "Apple M-series CoreML", "iPadOS", "HDS", "DUI API"],
    stackHardware: ["iPad", "NPU"],
    hashtags: ["hospitalier", "souveraineté", "AI Act", "Cloud Act"],
    matrix: {
      roles: ["Étude & PoC", "Conseil hardware / software"],
      functional: [
        "Speech-to-text médical",
        "Historisation des comptes-rendus",
        "Interopérabilité DUI",
      ],
      sectors: ["EHPAD", "Santé"],
      technical: ["Edge AI", "Reconnaissance vocale (ASR)", "Inférence embarquée (NPU)"],
      ethical: ["HDS", "Souveraineté des données"],
    },
    duration: "5 jours",
  },
  {
    id: "ats-youtubers",
    index: "08",
    sector: "RH Tech · Économie des créateurs",
    title: "Plateforme ATS pour créateurs YouTube",
    need: "Plateforme communautaire : créer un ATS qui fait matcher les compétences professionnelles d'internautes via des communautés YouTube sectorisées.",
    ecosystem: [{ name: "YT.Careers" }, { name: "JobSaaS" }],
    photos: [
      {
        src: "/case-photos/ats-youtubers/01.webp",
        alt: "Vue Kanban du recrutement par statut de candidature",
      },
      { src: "/case-photos/ats-youtubers/02.webp", alt: "Maquette Figma du dashboard des offres" },
      {
        src: "/case-photos/ats-youtubers/03.webp",
        alt: "Deeplink WhatsApp depuis le support client",
      },
      {
        src: "/case-photos/ats-youtubers/04.webp",
        alt: "Tableau de bord de recrutement en production",
      },
      {
        src: "/case-photos/ats-youtubers/05.webp",
        alt: "Personnalisation d'une offre (emoji, couleur)",
      },
      { src: "/case-photos/ats-youtubers/06.webp", alt: "Maquette Figma du détail d'une offre" },
      {
        src: "/case-photos/ats-youtubers/07.webp",
        alt: "Modales de confirmation (suppression, notification, refus, clôture)",
      },
      { src: "/case-photos/ats-youtubers/08.webp", alt: "Maquette Figma du détail d'un candidat" },
      {
        src: "/case-photos/ats-youtubers/09.webp",
        alt: "Formulaire de création et de publication d'une offre",
      },
    ],
    highlights: [
      "Intégration d'un design Figma complexe en no-code, avec un fort sens du détail visuel.",
      "Gestion du tunnel ATS complet, de la candidature à la qualification, avec une logique UI poussée selon le profil du candidat.",
      "Emailing en masse via Brevo, avec configuration delivery complète (DKIM, DMARC, SPF) pour la délivrabilité.",
      "Deeplinking WhatsApp Web pour fluidifier le contact candidat.",
      "Création d'un bot WhatsApp de préqualification des candidats.",
      "Gestion de la volumétrie et de la montée en charge sur Bubble.",
    ],
    stackSoftware: ["Bubble", "WhatsApp Business", "Brevo"],
    hashtags: ["NoCode", "workflows"],
    matrix: {
      roles: ["Product Builder"],
      functional: [
        "Tunnel de candidature ATS",
        "Emailing & delivery à grande échelle",
        "Préqualification automatisée (bot WhatsApp)",
      ],
      sectors: ["RH Tech", "Économie des créateurs"],
      technical: [
        "No-code",
        "Automatisation emailing",
        "Bot conversationnel",
        "Deeplinking mobile",
      ],
      ethical: ["RGPD (données candidats)", "Délivrabilité & anti-spam (SPF/DKIM/DMARC)"],
    },
    duration: "1 mois",
    scope: { label: "Retombées business", body: "Réseau d'affaires OnlyFans et MyM." },
  },
  {
    id: "sftp-photographe",
    index: "09",
    sector: "Photographie événementielle · Post-production Cloud",
    title: "Pipeline FTP temps réel pour post-production photo événementielle",
    need: "Photographie événementielle outdoor : upload massif et post-production Cloud en temps réel des shootings, directement depuis l'appareil photo sur réseau mobile.",
    ecosystem: [{ name: "Facely" }],
    highlights: [
      "Serveur FTP applicatif temps réel et résilient sur réseaux mobiles, avec réception massive directe depuis l'appareil photo en 5G.",
      "Pipeline de post-production déclenché à la réception : preview albums, formats optimisés pour diffusion réseaux sociaux, watermark de protection.",
      "Intégration d'un lien de paiement Stripe pour la vente des albums.",
      "Interface no-code poussée au-delà de ses limites natives pour la rendre réactive.",
      "Sourcing d'un hébergeur Cloud acceptant le FTP - contrainte imposée par le firmware de l'appareil photo professionnel.",
    ],
    stackSoftware: [
      "Unix",
      "inotify-tools",
      "vsftpd",
      "Scaleway",
      "Webhooks",
      "N8N",
      "Bubble",
      "Stripe",
    ],
    stackHardware: ["Appareil photo 5G"],
    hashtags: ["temps réel", "résilience"],
    matrix: {
      roles: ["Architecte polyvalent"],
      functional: [
        "Réception media temps réel",
        "Post-production automatisée",
        "Vente d'albums (paiement Stripe)",
      ],
      sectors: ["Photographie événementielle", "Médias & post-production"],
      technical: [
        "Protocole de transfert de fichiers (FTP)",
        "Pipeline événementiel (inotify)",
        "Automatisation no-code",
        "Résilience réseau mobile",
      ],
      ethical: ["Protection des droits d'auteur (watermark)"],
    },
    duration: "1 mois",
  },
  {
    id: "smur",
    index: "10",
    sector: "Urgences · SMUR",
    title: "Réseau temps réel de transport médicalisé",
    need: "Désengorger le centre d'appel du SMUR en diffusant les demandes de trajet hôpital ↔ domicile médicalisé auprès d'un réseau de VTC et d'ambulanciers équipés.",
    highlights: [
      "App mobile où chaque ambulancier signale en temps réel sa disponibilité, sa position, son équipement et ses habilitations.",
      "Transfert de demande entre ambulanciers.",
      "Backend temps réel et une partie du frontend QML / JS signals.",
    ],
    stackSoftware: ["Qt for Mobile", "QtQuick / QML", "MeteorJS", "Scalingo"],
    hashtags: ["hospitalier", "temps réel", "résilience"],
    matrix: {
      roles: ["Lead backend", "Développeur frontend QML"],
      functional: ["Dispatch temps réel", "Transfert de demandes entre ambulanciers"],
      sectors: ["Urgences", "Transport médicalisé"],
      technical: ["Mobile natif C++", "Full-stack réactif temps réel", "PaaS hébergement"],
      ethical: ["Fiabilité en contexte d'urgence médicale"],
    },
    duration: "3 mois",
  },
  {
    id: "multidiffusion-france-travail",
    index: "11",
    sector: "RH Tech · Multidiffusion d'offres d'emploi",
    title: "Intégration France Travail au hub de multidiffusion d'offres d'emploi",
    need: "Startup de multidiffusion d'annonces d'emploi connectant ses clients aux plateformes incontournables du secteur (Hellowork, Indeed, APEC, France Travail...) : ajouter le service de diffusion auprès de France Travail au catalogue d'intégrations.",
    ecosystem: [
      { name: "Indeed" },
      { name: "HelloWork" },
      { name: "HireSweet" },
      { name: "Gojob" },
    ],
    photos: [
      {
        src: "/case-photos/multidiffusion-france-travail/schema-1-contrat-flux.png",
        alt: "Schéma du contrat de flux entre le hub et le microservice France Travail",
      },
    ],
    highlights: [
      "Définition des frontières de responsabilité entre le hub de multidiffusion et le microservice France Travail.",
      "Collaboration étroite avec le responsable infrastructure & DevOps.",
      "Contrat de flux entre le hub interne d'annonces et le microservice dédié à la diffusion",
      "Mise en conformité avec les spécifications de la DSI de France Travail et leur processus d'homologation.",
      "Spécification et implémentation du microservice.",
    ],
    challenges: [
      {
        constraint: "Erreurs de validation XML silencieuses, faux négatifs, erreurs non standard.",
        response:
          "Construction d'un transformateur JSON → XML normé SIRH (XSD), pour fiabiliser des échanges jusque-là fragiles.",
      },
      {
        constraint:
          "Rate-limit de l'API à gérer par batch, sur une infrastructure aux évolutions fréquentes et comportements parfois erratiques.",
        response:
          "Microservice NestJS isolé, déployé en CI/CD Kubernetes, avec stratégies de mock et de relance.",
      },
      {
        constraint: "DSI externe, avec ses propres processus et son propre rythme.",
        response:
          "Dialogue fluide et pédagogie pour maintenir l'avancement au rythme d'une grande organisation.",
      },
      {
        constraint: "Critères d'acceptance des tests d'homologation à interpréter au fil de l'eau.",
        response: "Persévérance et rigueur jusqu'à validation complète.",
      },
    ],
    stackSoftware: [
      "Bubble",
      "NestJS",
      "HR-XML",
      "SOAP",
      "ArgoCD",
      "Kubernetes",
      "Docker",
      "Certificat TLS client",
    ],
    hashtags: ["dialogue DSI", "intégration API", "CI/CD", "micro service"],
    matrix: {
      roles: ["Architecte d'intégration", "Développeur backend"],
      functional: [
        "Multidiffusion d'offres d'emploi",
        "Intégration France Travail",
        "Conformité DSI / homologation",
      ],
      sectors: ["RH Tech", "Emploi"],
      technical: [
        "Microservices (NestJS)",
        "Intégration XML/SOAP normée",
        "CI/CD Kubernetes",
        "Transformation JSON → XML (XSD)",
      ],
      ethical: [
        "Sécurisation des échanges (certificat TLS)",
        "Conformité au processus d'homologation France Travail",
      ],
    },
    hidden: false,
  },
  {
    id: "discovery-hub",
    index: "12",
    sector: "SaaS · Product Management",
    title: "Plateforme de Product Discovery : décloisonner équipes internes et partenaires",
    need: "SaaS qui structure la discovery produit et réduit les silos entre les pôles mobilisés pour livrer les features (ingénierie, UX, qualité, finance, communication, marketing) et les partenaires à l'écoute des releases et des remontées de feedback.",
    needObjective:
      "Objectif : donner à toutes les parties prenantes, internes et externes, une vue partagée et à jour de l'avancement produit, sans ressaisie ni fichier volant entre les outils métier.",
    ecosystem: [{ name: "Productboard" }],
    highlights: [],
    highlightGroups: {
      functional: [
        "Premier profil technique de la structure : responsabilité pleine et entière des choix d'architecture, en autonomie totale.",
        "Intégrations Intercom, HubSpot, GitHub/GitLab, Trello, JIRA et Figma pour centraliser discovery, tickets, specs et feedback client dans un flux unique.",
        "Dashboard réactif partagé entre pôles (ingénierie, UX, qualité, finance, communication, marketing) et partenaires abonnés aux releases.",
        "Synchronisation bidirectionnelle : une mise à jour faite dans un outil (JIRA, Trello...) se répercute partout, sans ressaisie manuelle.",
        "Fusion de contacts multi-SaaS pour dédupliquer les identités partenaires à travers les systèmes connectés.",
      ],
      technical: [
        "Webhooks entrants/sortants par intégration, orchestrés via RxJS pour gérer les flux d'évènements asynchrones.",
        "Flows OAuth2 dédiés par fournisseur pour l'authentification déléguée sur chaque API tierce.",
        "Notifications batch asynchrones multicanal (email, SMS, SSE), avec gestion de la réputation de domaine et maîtrise des coûts d'envoi.",
        "Modélisation des données via Prisma sur une architecture NestJS.",
      ],
    },
    stackSoftware: [
      "NestJS",
      "RxJS",
      "Prisma",
      "OAuth2",
      "React",
      "Webhooks",
      "graphQL",
      "Intercom · HubSpot · GitHub/GitLab · Trello · JIRA · Figma",
    ],
    hashtags: [
      "product-management",
      "discovery",
      "intégrations",
      "webhooks",
      "notifications multicanal",
      "réputation de domaine",
    ],
    matrix: {
      roles: ["Tech Lead", "Architecte"],
      functional: [
        "Product Discovery structurée",
        "Décloisonnement inter-pôles",
        "Diffusion des releases partenaires",
      ],
      sectors: ["SaaS B2B", "Product Management"],
      technical: [
        "Intégrations API multiples",
        "Évènements asynchrones (webhooks)",
        "Authentification déléguée (OAuth2)",
        "Notifications multicanal",
      ],
      ethical: ["Réputation de domaine & délivrabilité", "Maîtrise des coûts d'envoi"],
    },
    duration: "1 an et demi",
  },
  {
    id: "assistant-redaction",
    index: "13",
    sector: "Traduction · Rédaction · Presse · Légal",
    title: "Assistant de rédaction Edge AI multilingue pour rédacteurs professionnels",
    need: "Assistant de rédaction temps réel qui, selon le contexte métier du client, détecte les formulations incorrectes dans des portions de texte multilingues et suggère des termes plus appropriés selon le registre, la terminologie, l'ontologie, l'étymologie, les idiomes et les formules consacrées.",
    needObjective:
      "Objectif : fiabiliser la justesse terminologique et stylistique des rédacteurs professionnels, sans jamais faire sortir le texte de leur poste de travail.",
    ecosystem: [{ name: "Grammarly" }, { name: "MerciApp" }, { name: "TextMaster" }],
    calloutImage: "/case-photos/assistant-redaction/panneau.png",
    photos: [
      {
        src: "/case-photos/assistant-redaction/panneau.png",
        alt: "Panneau illustrant les plateformes couvertes par l'extension : Gmail, LinkedIn, Office 365",
      },
      {
        src: "/case-photos/assistant-redaction/gmail-suggestions.png",
        alt: "Moteur intégré à la fenêtre de rédaction dans Gmail : à gauche un terme avec faute d'usage, à droite un terme raccourci proscrit",
      },
      {
        youtubeId: "oE84p5Rf_-w",
        title: "Chrome ext. correction linguistique dans un post LinkedIn",
      },
      {
        youtubeId: "zH_-1HwT9Ns",
        title: "Chrome ext. correction linguistique dans un commentaire LinkedIn",
      },
      {
        src: "/case-photos/assistant-redaction/textarea-generique.png",
        alt: "Moteur intégré à une zone de saisie HTML standard, sur un exemple de texte du domaine des sites de rencontre",
      },
      {
        src: "/case-photos/assistant-redaction/dashboard-glossaires.png",
        alt: "Dashboard web back-office de gestion des glossaires métier, multilingue",
      },
      {
        src: "/case-photos/assistant-redaction/panneau-compte-extension.png",
        alt: "Panneau de compte utilisateur dans l'extension : glossaire actif, statut de synchronisation, sites couverts",
      },
    ],
    highlights: [],
    highlightGroups: {
      functional: [
        "Prototype entier de l'extension Chrome : expérimentation terrain, retours utilisateurs, itérations.",
        "Compatible avec les principales suites bureautiques et éditeurs de texte : Microsoft Word, Outlook, PowerPoint, LibreOffice, OnlyOffice, Google Docs, LinkedIn.",
        "Suggestions de reformulation contextualisées : registre, terminologie métier, ontologie, étymologie, idiomes, formules consacrées.",
        "Injection de glossaires métier pour adapter les suggestions à chaque vertical client.",
      ],
      technical: [
        "Edge AI embarqué dans l'extension : aucun envoi de texte à un serveur pour analyse, conformité RGPD et souveraineté totale.",
        "Intégration d'un moteur NLP compatible full Edge AI, une contrainte rare côté outillage open source à l'époque du projet.",
        "Surcouche HTML de surlignage calée au pixel près sur le texte natif (police, taille, interlignage), sans jamais l'altérer.",
        "Serveur API self-hosted pour la gestion des glossaires et la mise à jour du moteur.",
      ],
    },
    challenges: [
      {
        constraint:
          "Garantir qu'aucun texte du client ne quitte jamais son poste de travail, alors que très peu de solutions capables de fonctionner entièrement en local existaient à l'époque.",
        response:
          "Un assistant qui fonctionne intégralement en local, sans aucun envoi de texte vers un serveur externe.",
      },
      {
        constraint:
          "Offrir une correction en temps réel sans jamais ralentir ni alourdir l'usage quotidien du navigateur.",
        response:
          "Calculs déportés dans un web worker pour ne jamais bloquer l'interface : une extension qui reste fluide, quel que soit le volume de texte analysé.",
      },
      {
        constraint:
          "Faire apparaître la suggestion exactement à l'endroit de l'erreur dans le texte, quels que soient le logiciel et la mise en forme utilisés.",
        response:
          "Un surlignage aligné pixel-perfect sur le terme concerné, quel que soit l'outil de rédaction.",
      },
      {
        constraint:
          "Proposer des suggestions à la fois pertinentes et subtiles, sur un nombre suffisant de métiers et de secteurs.",
        response:
          "Enrichissement itératif des glossaires vertical par vertical, au fil des retours terrain, en priorisant les usages les plus fréquents.",
      },
      {
        constraint:
          "Google Docs ne s'expose pas comme une page web classique : son éditeur tourne dans un canvas HTML verrouillé, invisible aux extensions standards.",
        response:
          "Contournement via l'API cloud propriétaire de Google Workspace, seule voie disponible pour interagir avec ce type d'éditeur.",
      },
      {
        constraint:
          "Certaines applications ciblées sont purement desktop, sans DOM ni page web à observer.",
        response:
          "Étude d'un portage du moteur piloté par RPA - une première approche testée avec Power Automate for desktop, de Microsoft.",
      },
    ],
    stackSoftware: [
      "Extension Chrome, Brave, Firefox, Edge",
      "Edge AI",
      "NLP embarqué",
      "API self-hosted",
      "Glossaires métier",
      "Web workers",
    ],
    hashtags: ["edge-ai", "souveraineté", "RGPD", "NLP", "extension navigateur", "traduction"],
    matrix: {
      roles: ["Architecte", "Développeur produit"],
      functional: [
        "Assistant de rédaction temps réel",
        "Suggestions contextualisées multilingues",
        "Couverture multi-verticales métier",
      ],
      sectors: ["Traduction", "Rédaction / Presse", "Légal"],
      technical: [
        "Edge AI embarqué",
        "NLP on-device",
        "Extension navigateur",
        "Overlay HTML pixel-perfect",
      ],
      ethical: ["RGPD", "Souveraineté des données", "Zéro envoi serveur du texte traité"],
    },
  },
];

export type BulletWithLogo = {
  before: string;
  logo: string;
  after: string;
  alt?: string;
  // For a logo that stands in for the entire name (no surrounding text) -
  // bumps it past the shared inline-logo size when the wordmark itself
  // needs to carry more visual weight as the headline.
  large?: boolean;
  // Per-logo vertical nudge (CSS margin-top) for marks whose glyph sits
  // off-center within their own image box, throwing off items-center
  // alignment against the text next to them.
  offsetY?: string;
};
export type Bullet = string | BulletWithLogo;

// Plain-text fallback for contexts (tooltips, aria labels, the SkillRing
// hub) that can't render an inline logo image.
export function sideProjectNameText(name: string | BulletWithLogo): string {
  return typeof name === "string" ? name : `${name.before}${name.alt ?? ""}${name.after}`;
}

export type SideProject = {
  id: string;
  name: string | BulletWithLogo;
  index: string;
  pitch: string;
  url?: string;
  bullets: Bullet[];
  // Extra text+logo appended into the name pill (e.g. "... for [LinkedIn
  // logo]").
  headerRight?: BulletWithLogo;
  business: string;
};

// Shared across all four nocode products (Airtable explorer is migrating
// onto it too) - shown once under the section headline instead of
// repeated on every card.
export const sideProjectsStack: string[] = [
  "Supabase (OTP, magic-link, MCP, edge functions, triggers, RBAC, ...)",
  "Stripe",
  "React",
  "shadcn/ui",
  "Tailwind",
  "Plasmo",
  "Brevo",
  "Sentry",
  "PostHog",
];

export type LlmEntry = { name: string; logo: string };

export const sideProjectsLlms: LlmEntry[] = [
  { name: "Claude", logo: "/logos/llm/claude.svg" },
  { name: "ChatGPT", logo: "/logos/llm/openai.svg" },
  { name: "Perplexity", logo: "/logos/llm/perplexity.svg" },
  { name: "Gemini", logo: "/logos/llm/gemini.svg" },
];

export type SideProjectSearchCategory = "name" | "pitch" | "bullets" | "stack" | "llms" | "business";
export type SideProjectSearchField = { category: SideProjectSearchCategory; value: string };

// Mirrors caseSearchFields: the case search box also matches nocodext
// side-business products, so a query like "supabase" (only ever shown
// once, in the shared stack block) still surfaces every product built on
// it - `stack`/`llms` are passed in because they're rendered once for the
// whole section rather than stored per product.
export function sideProjectSearchFields(
  p: SideProject,
  stack: string[],
  llms: LlmEntry[],
): SideProjectSearchField[] {
  const fields: SideProjectSearchField[] = [];
  const push = (category: SideProjectSearchCategory, ...values: (string | undefined)[]) => {
    for (const value of values) if (value) fields.push({ category, value });
  };

  push("name", sideProjectNameText(p.name));
  push("pitch", p.pitch);
  push("bullets", ...p.bullets.map(sideProjectNameText));
  push("business", p.business);
  push("stack", ...stack);
  push("llms", ...llms.map((l) => l.name));

  return fields;
}

export const sideProjects: SideProject[] = [
  {
    id: "nocodext",
    index: "01",
    name: { before: "", logo: "/logos/nocodext.png", after: "", alt: "Nocodext" },
    headerRight: { before: "for ", logo: "/logos/side/bubble.svg", after: "", alt: "Bubble" },
    pitch:
      "Outillage en extensions Chrome pour les agences NoCode Bubble : découvrabilité d'une app reprise et QA continue pour livrer du professionnel - totalement absent en natif dans Bubble.",
    url: "https://nocodext.studio/bubble",
    bullets: [
      "Maquettages, dev frontend / backend / edge backend runtime",
      "Pivot du ciblage vers le B2B (agences web) : hypothèses de valeur, itérations de pricing et repositionnement produit.",
      {
        before: "Intégration ",
        logo: "/logos/side/stripe.svg",
        after: " pour la gestion des abonnements et paiements récurrents.",
      },
      "Feedback communautaire, stratégie de pricing, positionnement produit & features.",
      "Analyse de la cible, veille concurrentielle, design thinking, UX/UI.",
      "Travaux avancés en UX, UI, Interaction Design.",
      "Agents de dev, MCP et skills.",
    ],
    business: "2 leads prêts à bêta-tester. Reciblage marché B2B : agences web.",
  },
  {
    id: "breedj",
    index: "02",
    name: { before: "", logo: "/logos/side/breedj.png", after: "", alt: "Breedj", large: true },
    headerRight: {
      before: "for ",
      logo: "/logos/side/linkedin-icon.svg",
      after: "",
      alt: "LinkedIn",
    },
    pitch:
      "Après un job post LinkedIn : récupérer en masse, trier et exporter les répondants vers fichier plat, outil bureautique cloud ou ATS.",
    url: "https://nocodext.studio/linkedin",
    bullets: [
      "Sneak-peek d'un profil candidat en mode incognito garanti et sans ban.",
      "UX/UI et interaction design du parcours de tri et d'export des répondants.",
      "Stratégie de positionnement et de ciblage RH en cours de construction.",
      "Réalisation intégrale, de l'idée à la production.",
      "Agents de dev, MCP et skills.",
    ],
    business: "2 leads RH prêts à bêta-tester.",
  },
  {
    id: "pinnpm",
    index: "03",
    name: { before: "", logo: "/logos/side/pinnpm.png", after: "", alt: "pin'npm" },
    pitch:
      "NPMjs.com ne permet pas de bookmarker des librairies, même connecté. pin'npm répertorie et enrichit les packages directement in-page.",
    url: "https://nocodext.studio/pinnpm",
    bullets: [
      "Bookmark de librairies NPM dans un side panel.",
      "Infos centralisées in-page : sécurité, CVE, vulnérabilités, maintenabilité.",
      "Moteur de suggestions : les équipes qui utilisent cette lib complètent aussi avec celle-ci.",
      "Intégration de packages bookmarkés directement dans le projet local via VS Code.",
      "UX/UI et interaction design du side panel et de l'intégration in-page.",
      "Agents de dev, MCP et skills.",
    ],
    business: "De l'idée à la prod.",
  },
  {
    id: "airtable",
    index: "04",
    name: {
      before: "",
      logo: "/logos/side/airtable.svg",
      after: " explorer",
      alt: "Airtable",
      offsetY: "-5px",
    },
    pitch:
      "Les couleurs du dashboard Airtable ont disparu sur décision interne. L'extension signe leur retour - et rend le dashboard réellement navigable.",
    url: "https://nocodext.studio/airtable",
    bullets: [
      "Atteindre les colonnes sans scroller quand il y en a beaucoup (par liste, par voix).",
      "Bookmark de colonnes, auto most-popular.",
      "Export Excel, là où le natif ne propose que le CSV.",
      "Coloration et iconification des tables, groupement des onglets par catégorie fonctionnelle.",
      "Masquer des tables aux membres à rôle limité sans licence Collaborateur payante.",
      "UX/UI et interaction design de la navigation et de la coloration de l'interface native Airtable.",
      "Agents de dev, MCP et skills.",
    ],
    business: "1 lead prêt à bêta-tester.",
  },
];

export const capabilities = [
  {
    key: "01",
    title: "Cadrer",
    body: "Modéliser le métier, les flux et les angles morts. Étude de faisabilité, ADR, chiffrage et feuille de route avant la première ligne de code.",
    accent: "text-cyan",
  },
  {
    key: "02",
    title: "Architecturer",
    body: "Event-driven, hexagonal, Domain-Driven Design : interopérabilité API normée, souveraineté et conformité RGPD by design.",
    accent: "text-violet",
  },
  {
    key: "03",
    title: "Livrer & transmettre",
    body: "Implémentation code, NoCode, agentic (IA), co-conception, mise en production, documentation, formation des équipes",
    accent: "text-amber",
  },
];

export type OverviewBucket = { label: string; caseIds: string[] };
export type OverviewCategory = {
  key: string;
  label: string;
  color: "cyan" | "violet" | "amber" | "blue";
  description: string;
  buckets: OverviewBucket[];
};

export type Capability = { key: string; title: string; body: string; accent: string };

export type Recommendation = {
  /** Stable anchor id, used to scroll/highlight from a linked case study. */
  id: string;
  name: string;
  linkedinUrl: string;
  photo: string;
  role: string;
  /** Short, localized relationship, e.g. "Client". */
  relationship: string;
  /** Original-language quote (this file is French). The English edition
   * (portfolio.en.ts) carries its own translated copy. */
  quote: string;
  verified?: boolean;
  linkedCaseId?: string;
};

export type PortfolioContent = {
  profile: typeof profile;
  cases: CaseStudy[];
  sideProjects: SideProject[];
  sideProjectsStack: string[];
  sideProjectsLlms: LlmEntry[];
  capabilities: Capability[];
  overview: OverviewCategory[];
  recommendations: Recommendation[];
};

export const recommendations: Recommendation[] = [
  {
    id: "rec-william-jezequel",
    name: "William Jezequel",
    linkedinUrl: "https://www.linkedin.com/in/williamjezequel/",
    photo: "/recommendations/william-jezequel.png",
    role: "Photographe le plus rapide de l'Ouest - Entreprises, événements, portraits",
    relationship: "Client",
    quote:
      "J'ai eu l'occasion de travailler avec Joris pour mon application Pixilive. La mission consistait à monter un serveur FTP sur un serveur privé et à le connecter avec Bubble. C'est une feature qui était en suspens depuis plusieurs années, car je ne trouvais personne capable de résoudre mon problème. J'ai particulièrement apprécié sa capacité à vulgariser les concepts techniques ce qui a rendu notre collaboration fluide et agréable. Joris ne se contente pas d'exécuter des tâches ; il est force de proposition et sait apporter des solutions innovantes en pensant les problèmes sous un nouvel angle. Je le recommande vivement à quiconque recherche un développeur compétent et créatif pour son projet.",
    linkedCaseId: "sftp-photographe",
  },
  {
    id: "rec-guillaume-illien",
    name: "Guillaume Illien",
    linkedinUrl: "https://www.linkedin.com/in/illien/fr/",
    photo: "/recommendations/guillaume-illien.png",
    role: "Technical Team Lead - Full-Stack B2B Architecture Specialist",
    relationship: "Client",
    quote:
      "Je suis ravi de recommander Joris, avec qui j'ai eu le plaisir de collaborer sur un prototype d'extension Chrome au cours de l'année écoulée. Son expertise en JavaScript et sa capacité à naviguer dans les complexités du développement d'extensions Chrome ont été un atout majeur pour notre équipe. Il a non seulement apporté son expertise technique, mais a également fait preuve d'une grande passion pour le développement et l'innovation.",
    verified: true,
    linkedCaseId: "assistant-redaction",
  },
  {
    id: "rec-florent-de-lecluse",
    name: "Florent de Lecluse",
    linkedinUrl: "https://www.linkedin.com/in/florent-delecluse/",
    photo: "/recommendations/florent-de-lecluse.png",
    role: "Logiciel métier sur-mesure pour PME techniques",
    relationship: "Interlocuteur direct",
    quote:
      "J'ai eu l'occasion de travailler avec Joris pendant 2 ans en tant que Directeur Technique de la startup Zetoolbox. Son expertise technique de développeur senior associée à ses compétences no-code nous ont permis de gérer des projets de développement d'applications et automatisations très complexes. Ouvert aux feedbacks, soucieux du travail bien fait et toujours à la recherche d'une solution performante, c'est un réel plaisir de pouvoir travailler avec Joris.",
    verified: true,
    linkedCaseId: "patrimoine",
  },
  {
    id: "rec-denis-ovtchinnikov",
    name: "Denis Ovtchinnikov",
    linkedinUrl: "https://www.linkedin.com/in/denis-o-61ba9619/",
    photo: "/recommendations/denis-ovtchinnikov.png",
    role: "DevOps Architect · CIO",
    relationship: "Interlocuteur direct",
    quote:
      "It was a real pleasure to work with Joris. His deep expertise in full stack environment was a real help for our projects. I recommend him as a real expert in this area.",
  },
  {
    id: "rec-issam-wakidi",
    name: "Issam Wakidi",
    linkedinUrl: "https://www.linkedin.com/in/issamwakidi/fr/",
    photo: "/recommendations/issam-wakidi.png",
    role: "Program Director - AI Strategy & Transformation",
    relationship: "Interlocuteur direct",
    quote:
      "Joris est un développeur avec des connaissances et compétences transversales : ce qui fait sa force c'est sa capacité d'adaptation par rapport à différentes stacks technos et outils, ainsi que sa compréhension rapide de différents contextes métier. Joris peut participer proactivement aux projets avec des suggestions pertinentes aux niveaux technique et fonctionnel, et plus généralement au niveau business.",
    verified: true,
    linkedCaseId: "smur",
  },
  {
    id: "rec-alexandre-alzounies",
    name: "Alexandre Alzounies",
    linkedinUrl: "https://www.linkedin.com/in/alexandrealzounies/",
    photo: "/recommendations/alexandre-alzounies.png",
    role: "Directeur technique",
    relationship: "Interlocuteur direct",
    quote: "Je recommande sans hésiter Joris !",
  },
  {
    id: "rec-benedicte-laurent",
    name: "Bénédicte Laurent",
    linkedinUrl: "https://www.linkedin.com/in/benedictelaurent/",
    photo: "/recommendations/benedicte-laurent.png",
    role: "Stratégie de marque - naming, identité, business coaching",
    relationship: "Prestataire pour Bénédicte",
    quote:
      "Joris a su comprendre et répondre les problématiques abordées au sein de Namae Concept. Nous devons jongler avec différentes compétences linguistiques et informatiques qui nécessite de travailler avec des personnes curieuses, autonomes, et forces de propositions, autant en termes de techno. qu'en termes de satisfaction user.",
  },
];

export const overview: OverviewCategory[] = [
  {
    key: "sectors",
    label: "Secteurs couverts",
    color: "amber",
    description: "Domaines des missions, regroupés par famille métier.",
    buckets: [
      { label: "Santé & médical", caseIds: ["reanimation", "stt-ehpad", "smur"] },
      { label: "SaaS & outils métier", caseIds: ["channel-manager", "patrimoine"] },
      { label: "Laboratoire & environnement", caseIds: ["ocr-labo"] },
      { label: "Énergie", caseIds: ["energie"] },
      { label: "Bureau d'étude & Bâtiment numérique", caseIds: ["cad-web"] },
      { label: "RH Tech & économie des créateurs", caseIds: ["ats-youtubers"] },
      { label: "Photographie & médias", caseIds: ["sftp-photographe"] },
      { label: "E-commerce & automobile", caseIds: ["veille-tarifaire"] },
    ],
  },
  {
    key: "technical",
    label: "Compétences technologiques",
    color: "blue",
    description: "Familles technologiques mobilisées.",
    buckets: [
      {
        label: "Data & infrastructure",
        caseIds: [
          "reanimation",
          "channel-manager",
          "ocr-labo",
          "cad-web",
          "smur",
          "sftp-photographe",
        ],
      },
      {
        label: "Architecture & backend",
        caseIds: ["reanimation", "channel-manager", "patrimoine", "energie", "cad-web"],
      },
      {
        label: "Automatisation & intégration",
        caseIds: ["ocr-labo", "patrimoine", "energie", "ats-youtubers", "sftp-photographe"],
      },
      { label: "Frontend & mobile", caseIds: ["reanimation", "cad-web", "smur"] },
      {
        label: "No-code & Low-Code",
        caseIds: ["patrimoine", "ats-youtubers", "sftp-photographe"],
      },
      { label: "IA & edge computing", caseIds: ["ocr-labo", "stt-ehpad"] },
      {
        label: "Web scraping & Business Intelligence",
        caseIds: ["veille-tarifaire"],
      },
    ],
  },
  {
    key: "product",
    label: "Compétences produit",
    color: "violet",
    description: "Types de valeur produit livrée, missions clients et side-business inclus.",
    buckets: [
      { label: "Stratégie produit & positionnement", caseIds: ["nocodext", "breedj"] },
      {
        label: "Product Design (UX/UI/Interaction)",
        caseIds: ["nocodext", "patrimoine", "breedj", "pinnpm", "airtable", "ats-youtubers"],
      },
      {
        label: "Automatisation & intégration métier",
        caseIds: [
          "channel-manager",
          "ocr-labo",
          "stt-ehpad",
          "energie",
          "ats-youtubers",
          "sftp-photographe",
          "veille-tarifaire",
        ],
      },
      { label: "Alerting & dispatch temps réel", caseIds: ["reanimation", "smur"] },
      { label: "Gestion, permissions & formation", caseIds: ["patrimoine", "ocr-labo"] },
      { label: "IA & portabilité produit", caseIds: ["stt-ehpad", "cad-web"] },
    ],
  },
  {
    key: "roles",
    label: "Rôles endossés",
    color: "cyan",
    description: "Casquettes portées sur les missions.",
    buckets: [
      {
        label: "Architecte",
        caseIds: [
          "reanimation",
          "channel-manager",
          "ocr-labo",
          "energie",
          "cad-web",
          "sftp-photographe",
          "veille-tarifaire",
        ],
      },
      {
        label: "Product / Conseil",
        caseIds: ["patrimoine", "stt-ehpad", "energie", "ats-youtubers"],
      },
      { label: "Tech lead / Dev lead", caseIds: ["reanimation", "channel-manager", "smur"] },
      {
        label: "Mentorat",
        caseIds: ["reanimation", "ocr-labo", "channel-manager"],
      },
      { label: "Développeur frontend / mobile", caseIds: ["smur", "reanimation"] },
      { label: "Data engineer", caseIds: ["veille-tarifaire"] },
    ],
  },
];
