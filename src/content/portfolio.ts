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

export type CaseStudy = {
  id: string;
  index: string;
  sector: string;
  title: string;
  need: string;
  highlights: Highlight[];
  stackSoftware: string[];
  stackHardware?: string[];
  hashtags: string[];
  matrix: InterventionMatrix;
  duration?: string;
  glossary?: GlossaryEntry[];
  logos?: string[];
  scope?: string;
  flagship?: boolean;
};

export const profile = {
  firstName: "Joris",
  lastName: "GROUILLET",
  initials: "JG",
  role: "Product Architect",
  tagline: "Product clarity. Technical fluency.",
  location: "France / Europe",
  emailUser: "hello",
  emailDomain: "askalia.net",
  sideBusinessBrand: "nocodext.studio",
};

export const cases: CaseStudy[] = [
  {
    id: "reanimation",
    index: "00",
    sector: "Santé · Hôpital / Réanimation",
    title: "Plateforme d'information Soignant · Patient · Familles",
    need: "Logiciel hospitalier faisant le lien informationnel entre soignants, patients en réanimation et familles.",
    highlights: [
      "Modélisation des flux hospitaliers de réanimation : admissions, suivis, sorties, transferts, règles métier, déclenchements et automatisations.",
      "Migration d'une app legacy PHP/CMS vers une architecture NestJS hospitalière : hexagonale, event-driven, synchronisation IHE / PAM / HL7.",
      "Migration MySQL legacy vers PostgreSQL : triggers, pg_cron, PostgREST, pg_net, partitioning, pooling, ségrégation de schémas.",
      "Transmission d'informations médicales et paramédicales, alerting familles / soignants et follow-up d'actions.",
      "Interopérabilité SI-H CHU Montpellier, Direction du Numérique en Santé, DPI ; interop d'État avec l'Agence du Numérique en Santé et le DMP.",
      "Implémentation des exigences HDS niveaux 4 à 6.",
      {
        text: "Ingestion des flux d'évènements Patient HL7/FHIR à partir de la source Logiciel de gestion-patient (PAM) fourni par la DSI.",
        objective:
          "Objectif : le logiciel reflète à tout moment la réalité opérationnelle quotidienne du service hospitalier.",
        detail: [
          "Adaptateurs SFTP et MLLP/MLLPS implémentés — les 2 protocoles standards d'échange de données de l'industrie.",
          "Import d'un pool de soignants paramédicaux via Excel pour aligner le logiciel avec la réalité du staffing en vigueur.",
          "Intégration du dispositif de connexion soignant, type DPI (Dossier Patient Informatisé).",
        ],
      },
      "Architecture résiliente par nœuds, Docker Compose LAN design, CLI d'ops interne.",
      "Portail Famille & Soignant : e-CPS, OTP, 2FA, Citrix & RPA.",
      "App mobile React Native pensée pour les familles : magic link, OTP, certificats mTLS, app links WhatsApp, notifications SMS.",
      "Admin de démo vibecodée pour autonomiser l'équipe Sales.",
      "Knowledge base via Claude / MCP / Notion / Mermaid / Structurizr, diagrammes de flux, logigrammes et schémas d'architecture sur Whimsical.",
      "Documentation DSI/RSSI : flux de données, ADR, registre de consignations, réglementaire, HDS, RGPD/DPO, cybersécurité, DMZ.",
      "Tech lead & mentorat d'une petite équipe + stagiaire anglophone.",
      "Gouvernance de la donnée : dépôts kSuite pour les partenaires, accès internes ajustés, clés SSH, coffre-fort en ligne, password manager.",
      "Montage d'un code-knowledge-graph LLM comme mémoire vivante de la codebase.",
    ],
    stackSoftware: [
      "NestJS",
      "PostgreSQL",
      "Redis",
      "HL7 / FHIR",
      "IHE · PAM",
      "React Native",
      "HDS 4-6",
      "Docker",
      "Infomaniak kSuite",
    ],
    hashtags: [
      "hospitalier",
      "souveraineté",
      "RGPD",
      "cybersécurité",
      "résilience",
      "temps réel",
      "Cloud Act",
    ],
    matrix: {
      roles: ["Tech lead", "Architecte", "Mentor", "Développeur mobile"],
      functional: [
        "Admissions & suivi patient",
        "Alerting familles / soignants",
        "Portail famille & soignant",
      ],
      sectors: ["Hôpital / Réanimation", "CHU", "Santé publique"],
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
        def: "Progiciel d'Accueil et de Mouvements — gestion administrative des patients (identités, admissions, mouvements).",
      },
      {
        term: "HL7",
        def: "Health Level 7 — famille de standards d'échange de données de santé entre systèmes hospitaliers.",
      },
      {
        term: "MLLP",
        def: "Minimal Lower Layer Protocol — protocole de transport historique des messages HL7 sur le réseau hospitalier.",
      },
      {
        term: "FHIR",
        def: "Fast Healthcare Interoperability Resources — standard HL7 moderne basé sur des API REST/JSON.",
      },
      {
        term: "DPI",
        def: "Dossier Patient Informatisé — dossier médical numérique centralisant les données du patient.",
      },
      {
        term: "SFTP",
        def: "SSH File Transfer Protocol — protocole de transfert de fichiers sécurisé par SSH.",
      },
      {
        term: "EAI",
        def: "Enterprise Application Integration — middleware d'intégration entre les systèmes d'un SI hospitalier.",
      },
    ],
    flagship: true,
  },
  {
    id: "channel-manager",
    index: "01",
    sector: "SaaS · Channel manager",
    title: "Un hub d'opportunités commerciales entre CRM partenaires",
    need: "SaaS métier channel manager : un hub qui transforme les CRM de partenaires commerciaux en une base commune d'opportunités, sans échange manuel de fichiers clients — plus de 50 000 fiches entreprises enrichies croisées sur 3 CRM différents.",
    logos: ["/logos/crm/salesforce.svg", "/logos/crm/hubspot.svg", "/logos/crm/pipedrive.svg"],
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
    hashtags: ["RGPD", "scalabilité", "résilience"],
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
    scope:
      "Réalisé : tout — faisabilité, conception & angles morts, backend, tests et cas limites, frontend, architecture code + NoCode, prod.",
  },
  {
    id: "ocr-labo",
    index: "02",
    sector: "SaaS · Laboratoire d'analyses",
    title: "Dématérialisation OCR des demandes d'analyses",
    need: "Dématérialiser les demandes faites auprès d'un laboratoire d'analyses environnementales via OCR, pour passer du papier au numérique.",
    highlights: [
      "Chaîne : scan interne → OCR → JSON structuré vers lambda Pipedrive (puis N8N) → RPA de saisie dans le SIL via Citrix.",
      "Panorama et comparatif de performance des offres OCR Cloud sur de la sémantique de biologie.",
      "Drive sécurisé et PDF anonymisés pour le RGPD (brûlure binaire).",
      "N8N self-hosted sur VPS o2switch, RPA Playwright headless via CDP pour piloter le logiciel desktop SIL.",
      "Gestion de la phase de transition : étude, propositions, dossier de conception, implémentation, feedbacks, hosting, shipping, documentation et formation.",
    ],
    stackSoftware: ["OCR Cloud", "N8N", "Playwright · CDP", "Citrix", "Pipedrive", "RGPD"],
    hashtags: ["RGPD", "anonymisation"],
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
    scope: "Réalisé : tout.",
  },
  {
    id: "patrimoine",
    index: "03",
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
    hashtags: ["souveraineté", "RGPD"],
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
    id: "stt-ehpad",
    index: "04",
    sector: "IA · EHPAD / Santé",
    title: "Etablissements pour seniors : comptes-rendus médicaux par speech-to-text",
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
    id: "energie",
    index: "05",
    sector: "Énergie · Courtage",
    title: "Courtier énergies : Homologation API réseau Enedis & indices de marché",
    need: "Collecter les consommations de compteurs électriques et scraper les indices de prix électricité, carbone et gaz pour estimer le meilleur moment d'émettre un devis.",
    highlights: [
      "Homologation d'une API XML/SOAP sur le webservice SGE d'Enedis, avec gestion de certificats TLS.",
      "Diplomatie avec le service support Enedis et suivi client.",
      "14 endpoints et 54 tests unitaires sur Make.com.",
      "Bascule vers N8N pour intégrer scripts JS et agents IA : scraping des indices + traitement de la donnée Enedis.",
    ],
    stackSoftware: ["SOAP / XML", "TLS", "Make.com", "N8N", "Weweb"],
    hashtags: ["temps réel", "cybersécurité", "scalabilité"],
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
    id: "cad-web",
    index: "06",
    sector: "Éditeur logiciel · Architecture 3D",
    title:
      "Bureau d'études BIM : portabilité d'un logiciel Architecture 3D sous Windows vers SaaS web",
    need: "Éditeur de logiciel desktop C++ 3D pour architectes : prototyper la portabilité vers une version web en SaaS.",
    highlights: [
      "Étude de faisabilité d'une infrastructure cloud hybride Windows + Linux, feuille de route, chiffrage et spécifications.",
      "Gestion des quotas disque, permissions et partages ; plans de souscription.",
      "Upload de fichiers très volumineux sans FTP.",
      "Conversion de fichiers AutoCAD vers un format d'exploitation BJSON sous Windows IoT.",
      "Montage d'un web studio WebGL 2D/3D avec web workers et mise à jour scalable des fichiers de travail édités.",
    ],
    stackSoftware: [
      "AWS (Lambda, EC2, S3, SQS, SNS, Cognito, Glacier)",
      "MongoDB",
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
    scope: "Rôle : architecte polyvalent.",
  },
  {
    id: "smur",
    index: "07",
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
    id: "ats-youtubers",
    index: "08",
    sector: "RH Tech · Économie des créateurs",
    title: "Plateforme ATS pour créateurs YouTube",
    need: "Plateforme communautaire : créer un ATS qui fait matcher les compétences professionnelles d'internautes via des communautés YouTube sectorisées.",
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
    scope: "Retombées business : réseau d'affaires OnlyFans et MyM.",
  },
  {
    id: "sftp-photographe",
    index: "09",
    sector: "Photographie événementielle · Post-production Cloud",
    title: "Pipeline FTP temps réel pour post-production photo événementielle",
    need: "Photographie événementielle outdoor : upload massif et post-production Cloud en temps réel des shootings, directement depuis l'appareil photo sur réseau mobile.",
    highlights: [
      "Serveur FTP applicatif temps réel et résilient sur réseaux mobiles, avec réception massive directe depuis l'appareil photo en 5G.",
      "Pipeline de post-production déclenché à la réception : preview albums, formats optimisés pour diffusion réseaux sociaux, watermark de protection.",
      "Intégration d'un lien de paiement Stripe pour la vente des albums.",
      "Interface no-code poussée au-delà de ses limites natives pour la rendre réactive.",
      "Sourcing d'un hébergeur Cloud acceptant le FTP — contrainte imposée par le firmware de l'appareil photo professionnel.",
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
];

export type SideProject = {
  id: string;
  name: string;
  index: string;
  pitch: string;
  bullets: string[];
  stack: string[];
  llms?: string[];
  logos?: string[];
  business: string;
};

export const sideProjects: SideProject[] = [
  {
    id: "nocodext",
    index: "01",
    name: "Nocodext for Bubble",
    pitch:
      "Outillage en extensions Chrome pour les agences NoCode Bubble : découvrabilité d'une app reprise et QA continue pour livrer du professionnel — totalement absent en natif dans Bubble.",
    bullets: [
      "Solopreneur : maquettages, dev frontend / backend / extensions Chrome.",
      "Pivot du ciblage vers le B2B (agences web) : hypothèses de valeur, itérations de pricing et repositionnement produit.",
      "Feedback communautaire, stratégie de pricing, positionnement produit & features.",
      "Analyse de la cible, veille concurrentielle, design thinking, UX/UI.",
      "Travaux avancés en UX, UI, Interaction Design.",
      "Agents de dev, MCP et skills dans la boucle de production.",
    ],
    stack: [
      "Supabase (OTP, edge functions, triggers, RBAC)",
      "Stripe",
      "React",
      "shadcn/ui",
      "Tailwind",
      "Plasmo",
      "Brevo",
      "GCP",
      "Sentry",
      "PostHog",
    ],
    llms: ["Claude", "ChatGPT", "Perplexity", "Gemini"],
    logos: ["/logos/side/bubble.svg"],
    business: "2 leads prêts à bêta-tester. Reciblage marché B2B : agences web.",
  },
  {
    id: "breejd",
    index: "02",
    name: "Breejd",
    pitch:
      "Après un job post LinkedIn : récupérer en masse, trier et exporter les répondants vers fichier plat, outil bureautique cloud ou ATS.",
    bullets: [
      "Sneak-peek d'un profil candidat en mode incognito garanti et sans ban.",
      "UX/UI et interaction design du parcours de tri et d'export des répondants.",
      "Stratégie de positionnement et de ciblage RH en cours de construction.",
      "Réalisation intégrale, de l'idée à la production.",
    ],
    stack: ["Même stack que Nocodext"],
    logos: ["/logos/side/linkedin.svg"],
    business: "2 leads RH prêts à bêta-tester.",
  },
  {
    id: "pinnpm",
    index: "03",
    name: "pin'npm",
    pitch:
      "NPMjs.com ne permet pas de bookmarker des librairies, même connecté. pin'npm répertorie et enrichit les packages directement in-page.",
    bullets: [
      "Bookmark de librairies NPM dans un side panel.",
      "Infos centralisées in-page : sécurité, CVE, vulnérabilités, maintenabilité.",
      "Moteur de suggestions : les équipes qui utilisent cette lib complètent aussi avec celle-ci.",
      "Intégration de packages bookmarkés directement dans le projet local via VS Code.",
      "UX/UI et interaction design du side panel et de l'intégration in-page.",
    ],
    stack: ["Même stack que Nocodext"],
    logos: ["/logos/side/pinnpm.png"],
    business: "De l'idée à la prod.",
  },
  {
    id: "airtable",
    index: "04",
    name: "Airtable explorer",
    pitch:
      "Les couleurs du dashboard Airtable ont disparu sur décision interne. L'extension signe leur retour — et rend le dashboard réellement navigable.",
    bullets: [
      "Atteindre les colonnes sans scroller quand il y en a beaucoup (par liste, par voix).",
      "Bookmark de colonnes, auto most-popular.",
      "Export Excel, là où le natif ne propose que le CSV.",
      "Coloration et iconification des tables, groupement des onglets par catégorie fonctionnelle.",
      "Masquer des tables aux membres à rôle limité sans licence Collaborateur payante.",
      "UX/UI et interaction design de la navigation et de la coloration de l'interface native Airtable.",
    ],
    stack: ["JS vanilla legacy"],
    logos: ["/logos/side/airtable.svg"],
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
    body: "Event-driven, hexagonal, interopérabilité normée (HL7/FHIR, SOAP, API CRM), souveraineté et conformité HDS / RGPD by design.",
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

export type PortfolioContent = {
  profile: typeof profile;
  cases: CaseStudy[];
  sideProjects: SideProject[];
  capabilities: Capability[];
  overview: OverviewCategory[];
};

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
    ],
  },
  {
    key: "product",
    label: "Compétences produit",
    color: "violet",
    description: "Types de valeur produit livrée, missions clients et side-business inclus.",
    buckets: [
      { label: "Stratégie produit & positionnement", caseIds: ["nocodext", "breejd"] },
      {
        label: "Product Design (UX/UI/Interaction)",
        caseIds: ["nocodext", "patrimoine", "breejd", "pinnpm", "airtable", "ats-youtubers"],
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
    ],
  },
];
