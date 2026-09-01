export type CaseStudy = {
  id: string;
  index: string;
  sector: string;
  title: string;
  need: string;
  highlights: string[];
  stack: string[];
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
  email: "hello@nocodext.studio",
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
      "Implémentation des exigences HDS niveaux 4 à 6, ingestion des flux HL7/FHIR (DPI & EAI).",
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
    stack: ["NestJS", "PostgreSQL", "HL7 / FHIR", "IHE · PAM", "React Native", "HDS 4-6", "Docker"],
    flagship: true,
  },
  {
    id: "channel-manager",
    index: "01",
    sector: "SaaS · Channel manager",
    title: "Enrichissement croisé de 50k+ fiches sur 3 CRM",
    need: "SaaS métier channel manager : enrichissement croisé de plus de 50 000 fiches entreprises sur 3 CRM différents entre N partenaires commerciaux.",
    highlights: [
      "Interopérabilité API Salesforce, Pipedrive et HubSpot : 3 API hétérogènes, 3 politiques de rate limiting.",
      "Mix code / NoCode et compromis d'hébergement de données entre Bubble et PostgreSQL (RGPD).",
      "Business process : implémentation + documentation en flowcharts.",
      "Arbitrage architecture monolithe NestJS vs serverless stateless (Edge Functions Vercel).",
      "Jobs asynchrones en MQ Redis, retries, rotation de tokens OAuth multiclients, résilience et reprise Redis.",
      "Supervision de freelances, points et gestion client, mise en production.",
    ],
    stack: ["NestJS", "Bubble", "Redis MQ", "Vercel Edge", "OAuth", "Salesforce · Pipedrive · HubSpot"],
    scope: "Réalisé : tout — faisabilité, conception & angles morts, backend, tests et cas limites, frontend, architecture code + NoCode, prod.",
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
    stack: ["OCR Cloud", "N8N", "Playwright · CDP", "Citrix", "Pipedrive", "RGPD"],
    scope: "Réalisé : tout.",
  },
  {
    id: "patrimoine",
    index: "03",
    sector: "Progiciel interne · Gestion de patrimoine",
    title: "CRM + ERP et arbre de permissions multiniveaux",
    need: "Progiciel interne : gérer le funnel de suivi client, la validation multiniveaux et l'arbre de permissions entre CRM et ERP d'un cabinet de gestion de patrimoine.",
    highlights: [
      "Développement d'un CRM + ERP sous Bubble.",
      "Dépôt de fichiers sécurisé et souverain (kSuite Drive) et dépôt de pièces légales via un SaaS FR agréé.",
      "Sensibilisation de l'agence web aux risques liés au RGPD.",
      "Déplacement des business workflows vers Pipedream.",
      "Boucle de feedbacks et formation des équipes.",
    ],
    stack: ["Bubble", "Pipedream", "kSuite Drive", "RGPD", "RBAC"],
  },
  {
    id: "stt-ehpad",
    index: "04",
    sector: "IA · EHPAD / Santé",
    title: "Comptes-rendus médicaux par speech-to-text",
    need: "Permettre aux médecins et paramédicaux en EHPAD de produire comptes-rendus et notes vocales à caractère médical via speech-to-text, puis de les historiser pour le suivi et la transmission.",
    highlights: [
      "Encadrement de la donnée HDS et souveraineté des données.",
      "Interopérabilité API avec les logiciels DUI des EHPAD.",
      "Étude des modèles de coûts d'inférence IA et préconisations hardware + software : edge AI, Kyutai, Whisper (OpenAI) via NPU Apple M / CoreML.",
      "Transcription temps réel streamée, avec contraintes de voix variées, pollution sonore et accents étrangers.",
      "Participation à des conférences IA.",
      "Étude complète, propositions, estimations, spécifications, PoC et prototypes via agentic coding.",
    ],
    stack: ["Whisper", "Kyutai", "CoreML / NPU", "Edge AI", "HDS", "DUI API"],
  },
  {
    id: "energie",
    index: "05",
    sector: "Énergie · Courtage",
    title: "Homologation SGE Enedis & indices de marché",
    need: "Collecter les consommations de compteurs électriques et scraper les indices de prix électricité, carbone et gaz pour estimer le meilleur moment d'émettre un devis.",
    highlights: [
      "Homologation d'une API XML/SOAP sur le webservice SGE d'Enedis, avec gestion de certificats TLS.",
      "Diplomatie avec le service support Enedis et suivi client.",
      "14 endpoints et 54 tests unitaires sur Make.com.",
      "Bascule vers N8N pour intégrer scripts JS et agents IA : scraping des indices + traitement de la donnée Enedis.",
      "Mission de 6 mois.",
    ],
    stack: ["SOAP / XML", "TLS", "Make.com", "N8N", "Agents IA"],
  },
  {
    id: "cad-web",
    index: "06",
    sector: "Éditeur logiciel · Architecture 3D",
    title: "Portabilité d'un logiciel desktop C++ 3D vers le SaaS web",
    need: "Éditeur de logiciel desktop C++ 3D pour architectes : prototyper la portabilité vers une version web en SaaS.",
    highlights: [
      "Étude de faisabilité d'une infrastructure cloud hybride Windows + Linux, feuille de route, chiffrage et spécifications.",
      "Gestion des quotas disque, permissions et partages ; plans de souscription.",
      "Upload de fichiers très volumineux sans FTP.",
      "Conversion de fichiers AutoCAD vers un format d'exploitation BJSON sous Windows IoT.",
      "Montage d'un web studio WebGL 2D/3D avec web workers et mise à jour scalable des fichiers de travail édités.",
    ],
    stack: ["AWS (Lambda, EC2, S3, SQS, SNS, Cognito, Glacier)", "MongoDB", "WebGL", "React", "Node.js", "Stripe"],
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
    stack: ["Qt for Mobile", "QtQuick / QML", "MeteorJS", "Scalingo"],
  },
];

export type SideProject = {
  id: string;
  name: string;
  index: string;
  pitch: string;
  bullets: string[];
  stack: string[];
  business: string;
};

export const sideProjects: SideProject[] = [
  {
    id: "nocodext",
    index: "01",
    name: "Nocodext",
    pitch: "Outillage en extensions Chrome pour les agences NoCode Bubble : découvrabilité d'une app reprise et QA continue pour livrer du professionnel — totalement absent en natif dans Bubble.",
    bullets: [
      "Solopreneur : maquettages, dev frontend / backend / extensions Chrome.",
      "Feedback communautaire, stratégie de pricing, positionnement produit & features.",
      "Analyse de la cible, veille concurrentielle, design thinking, UX/UI.",
      "Agents de dev, MCP et skills dans la boucle de production.",
    ],
    stack: ["Supabase (OTP, edge functions, triggers, RBAC)", "Stripe", "React", "shadcn/ui", "Tailwind", "Plasmo", "Brevo", "GCP", "Sentry", "PostHog"],
    business: "2 leads prêts à bêta-tester. Recyclage marché : agences web.",
  },
  {
    id: "breejd",
    index: "02",
    name: "Breejd",
    pitch: "Après un job post LinkedIn : récupérer en masse, trier et exporter les répondants vers fichier plat, outil bureautique cloud ou ATS.",
    bullets: [
      "Sneak-peek d'un profil candidat en mode incognito garanti et sans ban.",
      "Réalisation intégrale, de l'idée à la production.",
    ],
    stack: ["Même stack que Nocodext"],
    business: "2 leads RH prêts à bêta-tester.",
  },
  {
    id: "pinnpm",
    index: "03",
    name: "pin'npm",
    pitch: "NPMjs.com ne permet pas de bookmarker des librairies, même connecté. pin'npm répertorie et enrichit les packages directement in-page.",
    bullets: [
      "Bookmark de librairies NPM dans un side panel.",
      "Infos centralisées in-page : sécurité, CVE, vulnérabilités, maintenabilité.",
      "Moteur de suggestions : les équipes qui utilisent cette lib complètent aussi avec celle-ci.",
      "Intégration de packages bookmarkés directement dans le projet local via VS Code.",
    ],
    stack: ["Même stack que Nocodext"],
    business: "De l'idée à la prod.",
  },
  {
    id: "airtable",
    index: "04",
    name: "Airtable Colors",
    pitch: "Les couleurs du dashboard Airtable ont disparu sur décision du CEO. L'extension les rend — et rend une table réellement navigable.",
    bullets: [
      "Atteindre les colonnes sans scroller quand il y en a beaucoup (par liste, par voix).",
      "Bookmark de colonnes, auto most-popular.",
      "Export Excel, là où le natif ne propose que le CSV.",
      "Coloration et iconification des tables, groupement des onglets par catégorie fonctionnelle.",
      "Masquer des tables aux membres à rôle limité sans licence Collaborateur payante.",
    ],
    stack: ["JS vanilla legacy"],
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
    body: "Implémentation code + NoCode, mise en production, documentation DSI/RSSI, formation des équipes et mémoire vivante de la codebase.",
    accent: "text-amber",
  },
];
