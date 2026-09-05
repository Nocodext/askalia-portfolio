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
  needObjective?: string;
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
  photos?: { src: string; alt: string }[];
  challenges?: { constraint: string; response: string }[];
  flagship?: boolean;
  hidden?: boolean;
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
    title:
      "Plateforme hospitalière : continuité informationnelle Soignant · Familles · Patient en Réanimation DAR-B",
    need: `Cette plateforme web et mobile connecte les familles de patients hospitalisés à l'équipe soignante : synchronisation automatique
  avec les systèmes hospitaliers dès l'admission, transmissions et alertes en temps réel vers les
  proches, sans ressaisie côté soignant. Complétion infos médicales par les proches.`,
    needObjective:
      "Objectif : réduire la charge de communication du personnel tout en gardant les familles informées et rassurées pendant le séjour.",
    highlights: [],
    highlightGroups: {
      functional: [
        "Démarche UX/UI conduite en co-création avec les agents hospitaliers.",
        "Modélisation des flux hospitaliers de réanimation : admissions, suivis, sorties, transferts, règles métier, déclenchements et automatisations.",
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
        "Interopérabilité SI-H CHU Montpellier, Direction du Numérique en Santé, DPI ; interop d'État avec l'Agence du Numérique en Santé et le DMP.",
        "Implémentation des exigences HDS niveaux 4 à 6.",
        "Ingestion des flux d'évènements Patient HL7/FHIR à partir de la source Logiciel de gestion-patient (PAM) fourni par la DSI, via adaptateurs SFTP et MLLP/MLLPS — les 2 protocoles standards d'échange de données de l'industrie.",
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
      "RGPD",
      "HDS 4-6",
      "ANSSI",
      "PSSI-S",
      "Agence Numérique en Santé",
      "Direction Numérique en Santé",
      "Dossier Patient (DPI)",
      "Patient administation",
      "EA : routage data",
      "Dépôt SFTP",
      "Clés SSH & homes Unix",
      "Dossier médical",
      "cybersécurité",
      "résilience",
      "Live updates",
      "Cloud Act",
      "Secret médical",
      "Coordination partenaires",
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
        def: "Patient Administration Management — gestion administrative des patients (identités, admissions, mouvements).",
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
    id: "veille-tarifaire",
    index: "01",
    sector: "E-commerce · Pièces détachées automobile",
    title: "Veille concurrentielle tarifaire temps réel — pièces détachées automobile",
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
    hashtags: ["dialogue DSI", "temps réel", "cybersécurité", "scalabilité", "homologation de flux"],
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
    scope: { label: "Réalisé", body: "Tout." },
  },
  {
    id: "channel-manager",
    index: "04",
    sector: "SaaS · Channel manager",
    title: "Hub d'opportunités commerciales entre CRM partenaires",
    need: "SaaS métier channel manager : un hub qui transforme les CRM de partenaires commerciaux en une base commune d'opportunités, sans échange manuel de fichiers clients — plus de 50 000 fiches entreprises enrichies croisées sur 3 CRM différents.",
    logos: ["/logos/crm/salesforce.svg", "/logos/crm/hubspot.svg", "/logos/crm/pipedrive.svg"],
    photos: [
      { src: "/case-photos/channel-manager/01.webp", alt: "Capture du hub de gestion d'opportunités" },
      { src: "/case-photos/channel-manager/02.webp", alt: "Capture du hub de gestion d'opportunités" },
      { src: "/case-photos/channel-manager/03.webp", alt: "Capture du hub de gestion d'opportunités" },
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
      body: "Tout — faisabilité, conception & angles morts, backend, tests et cas limites, frontend, architecture code + NoCode, prod.",
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
    photos: [
      {
        src: "/schemas/cad-web-aws-architecture.png",
        alt: "Schéma d'architecture AWS : Lambda, API Gateway, DocumentDB, EC2, SQS, SES, EventBridge, Glacier — pipeline BIM (ingestion, stockage, archivage)",
      },
    ],
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
    photos: [
      { src: "/case-photos/ats-youtubers/01.webp", alt: "Vue Kanban du recrutement par statut de candidature" },
      { src: "/case-photos/ats-youtubers/02.webp", alt: "Maquette Figma du dashboard des offres" },
      { src: "/case-photos/ats-youtubers/03.webp", alt: "Deeplink WhatsApp depuis le support client" },
      { src: "/case-photos/ats-youtubers/04.webp", alt: "Tableau de bord de recrutement en production" },
      { src: "/case-photos/ats-youtubers/05.webp", alt: "Personnalisation d'une offre (emoji, couleur)" },
      { src: "/case-photos/ats-youtubers/06.webp", alt: "Maquette Figma du détail d'une offre" },
      { src: "/case-photos/ats-youtubers/07.webp", alt: "Modales de confirmation (suppression, notification, refus, clôture)" },
      { src: "/case-photos/ats-youtubers/08.webp", alt: "Maquette Figma du détail d'un candidat" },
      { src: "/case-photos/ats-youtubers/09.webp", alt: "Formulaire de création et de publication d'une offre" },
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
];

export type BulletWithLogo = { before: string; logo: string; after: string };
export type Bullet = string | BulletWithLogo;

export type SideProject = {
  id: string;
  name: string;
  index: string;
  pitch: string;
  url?: string;
  bullets: Bullet[];
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
    url: "https://nocodext.studio/bubble",
    bullets: [
      "Solopreneur : maquettages, dev frontend / backend / extensions Chrome.",
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
    url: "https://nocodext.studio/linkedin",
    bullets: [
      "Sneak-peek d'un profil candidat en mode incognito garanti et sans ban.",
      "UX/UI et interaction design du parcours de tri et d'export des répondants.",
      "Stratégie de positionnement et de ciblage RH en cours de construction.",
      "Réalisation intégrale, de l'idée à la production.",
      "Agents de dev, MCP et skills.",
    ],
    stack: ["Même stack que Nocodext for Bubble"],
    logos: ["/logos/side/linkedin.svg"],
    business: "2 leads RH prêts à bêta-tester.",
  },
  {
    id: "pinnpm",
    index: "03",
    name: "pin'npm",
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
    stack: ["Même stack que Nocodext for Bubble"],
    logos: ["/logos/side/pinnpm.png"],
    business: "De l'idée à la prod.",
  },
  {
    id: "airtable",
    index: "04",
    name: "Airtable explorer",
    pitch:
      "Les couleurs du dashboard Airtable ont disparu sur décision interne. L'extension signe leur retour — et rend le dashboard réellement navigable.",
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
