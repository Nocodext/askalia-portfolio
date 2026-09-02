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
    sector: "Healthcare · Hospital / ICU",
    title: "Care Team · Patient · Family Information Platform",
    need: "Hospital software bridging the information gap between care teams, ICU patients, and families.",
    highlights: [
      "Modeled ICU patient flows: admissions, monitoring, discharges, transfers, business rules, triggers and automations.",
      "Migrated a legacy PHP/CMS app to a hospital-grade NestJS architecture: hexagonal, event-driven, IHE / PAM / HL7 synchronization.",
      "Migrated legacy MySQL to PostgreSQL: triggers, pg_cron, PostgREST, pg_net, partitioning, pooling, schema segregation.",
      "Delivered medical and paramedical information, family/care-team alerting, and action follow-up.",
      "Hospital information system interoperability with CHU Montpellier (university hospital), its Digital Health Directorate and electronic health record (DPI); state-level interop with France's national digital health agency (ANS) and the shared medical record (DMP).",
      "Implemented HDS (France's certified health-data hosting standard) requirements, levels 4-6.",
      {
        text: "Ingested HL7/FHIR patient event streams from the patient administration (PAM) system provided by the hospital's IT department.",
        objective:
          "Objective: the software reflects the ward's day-to-day operational reality at all times.",
        detail: [
          "Built SFTP and MLLP/MLLPS adapters — the industry's two standard data-exchange protocols.",
          "Imported a paramedical staff pool via Excel to align the software with actual staffing on the ground.",
          "Integrated the care-team login mechanism, of the DPI (electronic health record) type.",
        ],
      },
      "Resilient node-based architecture, Docker Compose LAN design, internal ops CLI.",
      "Family & Care Team portal: e-CPS (French health professional e-card), OTP, 2FA, Citrix & RPA.",
      "React Native mobile app designed for families: magic link, OTP, mTLS certificates, WhatsApp app links, SMS notifications.",
      "Vibe-coded demo admin panel to make the Sales team self-sufficient.",
      "Knowledge base via Claude / MCP / Notion / Mermaid / Structurizr, plus flowcharts, logic diagrams and architecture schemas on Whimsical.",
      "IT/CISO documentation: data flows, ADRs, incident log register, regulatory, HDS, GDPR/DPO, cybersecurity, DMZ.",
      "Tech lead & mentoring for a small team + an English-speaking intern.",
      "Data governance: kSuite repositories for partners, scoped internal access, SSH keys, an online vault, password manager.",
      "Built an LLM code-knowledge-graph as a living memory of the codebase.",
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
      "healthcare",
      "data-sovereignty",
      "GDPR",
      "cybersecurity",
      "resilience",
      "real-time",
      "Cloud Act",
    ],
    matrix: {
      roles: ["Tech Lead", "Architect", "Mentor", "Mobile Developer"],
      functional: [
        "Admissions & patient monitoring",
        "Family/care-team alerting",
        "Family & care-team portal",
      ],
      sectors: ["Hospital / ICU", "University Hospital (CHU)", "Public Health"],
      technical: [
        "Event-driven",
        "Hexagonal architecture",
        "Relational database",
        "Native mobile",
        "Containerization",
      ],
      ethical: ["HDS levels 4-6", "GDPR / DPO", "Data sovereignty"],
    },
    duration: "1 year",
    glossary: [
      {
        term: "PAM",
        def: "Patient Administration Management software — handles patient identities, admissions and movements.",
      },
      {
        term: "HL7",
        def: "Health Level 7 — a family of standards for exchanging health data between hospital systems.",
      },
      {
        term: "MLLP",
        def: "Minimal Lower Layer Protocol — the legacy transport protocol for HL7 messages on hospital networks.",
      },
      {
        term: "FHIR",
        def: "Fast Healthcare Interoperability Resources — the modern HL7 standard, built on REST/JSON APIs.",
      },
      {
        term: "DPI",
        def: "Electronic Health Record (Dossier Patient Informatisé) — the digital medical file centralizing a patient's data.",
      },
      {
        term: "SFTP",
        def: "SSH File Transfer Protocol — secure file transfer over SSH.",
      },
      {
        term: "EAI",
        def: "Enterprise Application Integration — the middleware layer connecting a hospital IT system's applications.",
      },
    ],
    flagship: true,
  },
  {
    id: "channel-manager",
    index: "01",
    sector: "SaaS · Channel manager",
    title: "A shared opportunity hub across partner CRMs",
    need: "Channel-manager SaaS: a hub that turns partner CRMs into a shared pool of opportunities, with no manual client-file exchange — 50,000+ company records enriched and cross-matched across 3 different CRMs.",
    logos: ["/logos/crm/salesforce.svg", "/logos/crm/hubspot.svg", "/logos/crm/pipedrive.svg"],
    highlights: [
      "Salesforce, Pipedrive and HubSpot API interoperability: 3 heterogeneous APIs, 3 different rate-limiting policies.",
      "Code / no-code mix and data-hosting trade-offs between Bubble and PostgreSQL (GDPR).",
      "Business process: implementation + flowchart documentation.",
      "Arbitrated monolithic NestJS vs. stateless serverless architecture (Vercel Edge Functions).",
      "Asynchronous jobs on a Redis MQ, retries, multi-client OAuth token rotation, Redis resilience and recovery.",
      "Supervised freelancers, client check-ins and management, production rollout.",
    ],
    stackSoftware: [
      "NestJS",
      "Bubble",
      "Redis MQ",
      "Vercel Edge",
      "OAuth",
      "Salesforce · Pipedrive · HubSpot",
    ],
    hashtags: ["GDPR", "scalability", "resilience"],
    matrix: {
      roles: ["Architect", "Lead Dev", "Freelancer Supervision"],
      functional: ["Cross-CRM enrichment", "Business process", "Multi-API rate limiting"],
      sectors: ["SaaS B2B", "Channel management"],
      technical: [
        "Serverless architecture",
        "Asynchronous queues",
        "Delegated authentication",
        "Heterogeneous REST APIs",
      ],
      ethical: ["GDPR", "Data-hosting choices"],
    },
    duration: "3 years",
    scope:
      "Delivered: everything — feasibility, design & blind spots, backend, tests & edge cases, frontend, code + no-code architecture, production.",
  },
  {
    id: "ocr-labo",
    index: "02",
    sector: "SaaS · Analytical Laboratory",
    title: "OCR-based digitization of lab test requests",
    need: "Digitize requests submitted to an environmental testing lab via OCR, moving the workflow from paper to digital.",
    highlights: [
      "Pipeline: internal scan → OCR → structured JSON to a Pipedrive lambda (then N8N) → RPA data entry into the LIMS via Citrix.",
      "Landscape review and performance benchmark of cloud OCR providers on biology-specific semantics.",
      "Secure drive and anonymized PDFs for GDPR compliance (binary shredding).",
      "Self-hosted N8N on an o2switch VPS, headless Playwright RPA via CDP to drive the desktop LIMS software.",
      "Managed the transition phase end to end: study, proposals, design document, implementation, feedback loops, hosting, shipping, documentation and training.",
    ],
    stackSoftware: ["OCR Cloud", "N8N", "Playwright · CDP", "Citrix", "Pipedrive", "GDPR"],
    hashtags: ["GDPR", "anonymization"],
    matrix: {
      roles: ["Architect", "Transition Project Lead"],
      functional: ["OCR digitization", "LIMS data-entry RPA", "User training"],
      sectors: ["Analytical Laboratory", "Environment"],
      technical: [
        "Computer vision (OCR)",
        "Workflow automation",
        "RPA (robotic process automation)",
        "Self-hosted infrastructure",
      ],
      ethical: ["GDPR", "PDF anonymization"],
    },
    duration: "3 months",
    scope: "Delivered: everything.",
  },
  {
    id: "patrimoine",
    index: "03",
    sector: "Internal Software · Wealth Management",
    title: "CRM + ERP for a wealth-management firm",
    need: "Internal software: manage the client-tracking funnel, multi-level approval, and the permission tree between the CRM and ERP of a wealth-management firm.",
    highlights: [
      "Upfront Product Design (UX/UI) scoping phase to align the software with business expectations.",
      "Built a CRM + ERP on Bubble.",
      "Secure, data-sovereign file storage (kSuite Drive) and legal-document deposit via an accredited French SaaS.",
      "Raised the web agency's awareness of GDPR-related risks.",
      "Migrated business workflows to Pipedream.",
      "Feedback loops and team training.",
    ],
    stackSoftware: ["Bubble", "Pipedream", "kSuite Drive", "GDPR", "RBAC"],
    hashtags: ["data-sovereignty", "GDPR"],
    matrix: {
      roles: ["Product Builder", "GDPR Advisory"],
      functional: ["UX/UI scoping", "CRM + ERP", "Multi-level permission tree", "Team training"],
      sectors: ["Wealth Management", "Finance"],
      technical: ["No-code", "iPaaS (automation)", "RBAC (access control)"],
      ethical: ["GDPR", "Data sovereignty (kSuite Drive)"],
    },
    duration: "1 year",
  },
  {
    id: "stt-ehpad",
    index: "04",
    sector: "AI · Senior Care Facilities / Healthcare",
    title: "Senior care facilities: medical reports via speech-to-text",
    need: "Let physicians and paramedical staff in senior care facilities produce medical reports and voice notes via speech-to-text, then archive them for follow-up and handover.",
    highlights: [
      "Governed the data under HDS and data-sovereignty requirements.",
      "API interoperability with senior care facilities' electronic resident record (DUI) software.",
      "Studied AI inference cost models and made hardware + software recommendations: edge AI, Kyutai, Whisper (OpenAI), Apple M-series CoreML.",
      "Real-time streamed transcription, handling varied voices, background noise, and foreign accents.",
      "Spoke at AI conferences.",
      "Full study, proposals, estimates, specifications, PoC and prototypes via agentic coding.",
    ],
    stackSoftware: ["Whisper", "Kyutai", "Apple M-series CoreML", "iPadOS", "HDS", "DUI API"],
    stackHardware: ["iPad", "NPU"],
    hashtags: ["healthcare", "data-sovereignty", "AI Act", "Cloud Act"],
    matrix: {
      roles: ["Study & PoC", "Hardware / Software Advisory"],
      functional: ["Medical speech-to-text", "Report archiving", "DUI interoperability"],
      sectors: ["Senior Care Facilities", "Healthcare"],
      technical: ["Edge AI", "Speech recognition (ASR)", "On-device inference (NPU)"],
      ethical: ["HDS", "Data sovereignty"],
    },
    duration: "5 days",
  },
  {
    id: "energie",
    index: "05",
    sector: "Energy · Brokerage",
    title: "Energy broker: Enedis grid API certification & market indices",
    need: "Collect electricity meter consumption data and scrape electricity, carbon and gas price indices to estimate the best moment to issue a quote.",
    highlights: [
      "Certified an XML/SOAP API against Enedis's SGE web service, including TLS certificate management.",
      "Managed the relationship with Enedis support and client follow-up.",
      "14 endpoints and 54 unit tests on Make.com.",
      "Switched to N8N to integrate JS scripts and AI agents: index scraping + Enedis data processing.",
    ],
    stackSoftware: ["SOAP / XML", "TLS", "Make.com", "N8N", "Weweb"],
    hashtags: ["real-time", "cybersecurity", "scalability"],
    matrix: {
      roles: ["Integration Architect", "Enedis Support Liaison"],
      functional: ["Meter data collection", "Market-index scraping", "Quote decision support"],
      sectors: ["Energy", "Brokerage"],
      technical: ["SOAP/XML web services", "No-code automation", "AI agents"],
      ethical: ["TLS certificates & access security"],
    },
    duration: "4 months",
  },
  {
    id: "cad-web",
    index: "06",
    sector: "Software Vendor · 3D Architecture",
    title: "BIM design office: porting a Windows 3D architecture app to web SaaS",
    need: "C++ desktop 3D software vendor for architects: prototype portability to a web SaaS version.",
    highlights: [
      "Feasibility study for a hybrid Windows + Linux cloud infrastructure, roadmap, costing and specifications.",
      "Managed disk quotas, permissions and shares; subscription plans.",
      "Very large file uploads without FTP.",
      "Converted AutoCAD files to a BJSON working format on Windows IoT.",
      "Built a WebGL 2D/3D web studio with web workers and scalable updating of edited working files.",
    ],
    stackSoftware: [
      "AWS (Lambda, EC2, S3, SQS, SNS, Cognito, Glacier)",
      "MongoDB",
      "WebGL",
      "React",
      "Node.js",
      "Stripe",
    ],
    hashtags: ["scalability", "Cloud Act"],
    matrix: {
      roles: ["Versatile Architect"],
      functional: [
        "Desktop → web SaaS portability",
        "Quota & subscription-plan management",
        "WebGL studio",
      ],
      sectors: ["Software Publishing", "3D Architecture", "Building Information Modeling (BIM)"],
      technical: ["Public cloud", "NoSQL database", "Real-time 3D rendering", "Full-stack JS"],
      ethical: ["Cloud infrastructure scalability", "Cloud Act exposure (AWS)"],
    },
    duration: "6 months",
    scope: "Role: versatile architect.",
  },
  {
    id: "smur",
    index: "07",
    sector: "Emergency Medicine · Mobile Emergency Unit (SMUR)",
    title: "Real-time network for medically-staffed transport",
    need: "Relieve the SMUR (mobile emergency unit) call center by broadcasting hospital ↔ home medical-transport requests to a network of equipped private-hire drivers and ambulance crews.",
    highlights: [
      "Mobile app where each paramedic reports availability, location, equipment and qualifications in real time.",
      "Request handoff between paramedics.",
      "Real-time backend and part of the QML / JS-signals frontend.",
    ],
    stackSoftware: ["Qt for Mobile", "QtQuick / QML", "MeteorJS", "Scalingo"],
    hashtags: ["healthcare", "real-time", "resilience"],
    matrix: {
      roles: ["Backend Lead", "QML Frontend Developer"],
      functional: ["Real-time dispatch", "Request handoff between paramedics"],
      sectors: ["Emergency Medicine", "Medical Transport"],
      technical: ["Native C++ mobile", "Real-time reactive full-stack", "PaaS hosting"],
      ethical: ["Reliability in emergency medical context"],
    },
    duration: "3 months",
  },
  {
    id: "ats-youtubers",
    index: "08",
    sector: "HR Tech · Creator Economy",
    title: "ATS platform for YouTube creators",
    need: "Community platform: build an ATS that matches internet users' professional skills through niche YouTube communities.",
    highlights: [
      "Implemented a complex Figma design in no-code, with strong attention to visual detail.",
      "Managed the full ATS funnel, from application to qualification, with advanced UI logic tailored to the candidate's profile.",
      "Mass emailing via Brevo, with full deliverability configuration (DKIM, DMARC, SPF).",
      "WhatsApp Web deeplinking to smooth out candidate contact.",
      "Built a WhatsApp bot for candidate pre-qualification.",
      "Managed data volume and scaling load on Bubble.",
    ],
    stackSoftware: ["Bubble", "WhatsApp Business", "Brevo"],
    hashtags: ["NoCode", "workflows"],
    matrix: {
      roles: ["Product Builder"],
      functional: [
        "ATS application funnel",
        "Emailing & deliverability at scale",
        "Automated pre-qualification (WhatsApp bot)",
      ],
      sectors: ["HR Tech", "Creator Economy"],
      technical: ["No-code", "Email automation", "Conversational bot", "Mobile deeplinking"],
      ethical: ["GDPR (candidate data)", "Deliverability & anti-spam (SPF/DKIM/DMARC)"],
    },
    duration: "1 month",
    scope: "Business outcome: business network across OnlyFans and MyM.",
  },
  {
    id: "sftp-photographe",
    index: "09",
    sector: "Event Photography · Cloud Post-Production",
    title: "Real-time FTP pipeline for event-photography post-production",
    need: "Outdoor event photography: massive upload and real-time cloud post-production of shoots, straight from the camera over a mobile network.",
    highlights: [
      "Real-time, mobile-network-resilient application FTP server, with massive direct intake from the camera over 5G.",
      "Post-production pipeline triggered on receipt: preview albums, formats optimized for social-media distribution, protective watermarking.",
      "Integrated a Stripe payment link for album sales.",
      "Pushed a no-code interface past its native limits to make it reactive.",
      "Sourced a cloud host that accepts FTP — a constraint imposed by the professional camera's firmware.",
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
    stackHardware: ["5G camera"],
    hashtags: ["real-time", "resilience"],
    matrix: {
      roles: ["Versatile Architect"],
      functional: [
        "Real-time media intake",
        "Automated post-production",
        "Album sales (Stripe payment)",
      ],
      sectors: ["Event Photography", "Media & Post-Production"],
      technical: [
        "File transfer protocol (FTP)",
        "Event-driven pipeline (inotify)",
        "No-code automation",
        "Mobile-network resilience",
      ],
      ethical: ["Copyright protection (watermark)"],
    },
    duration: "1 month",
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
      "Chrome-extension tooling for Bubble no-code agencies: discoverability of a handed-over app and continuous QA to ship professionally — entirely missing natively in Bubble.",
    bullets: [
      "Solo-founder: wireframes, frontend / backend dev, Chrome extensions.",
      "Pivoted targeting to B2B (web agencies): value hypotheses, pricing iterations and product repositioning.",
      "Community feedback, pricing strategy, product positioning & features.",
      "Target audience analysis, competitive monitoring, design thinking, UX/UI.",
      "Advanced work in UX, UI, Interaction Design.",
      "Dev agents, MCP and skills in the production loop.",
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
    business: "2 leads ready to beta-test. B2B market retargeting: web agencies.",
  },
  {
    id: "breejd",
    index: "02",
    name: "Breejd",
    pitch:
      "After a LinkedIn job post: bulk-collect, sort and export respondents to a flat file, cloud office tool, or ATS.",
    bullets: [
      "Sneak-peek a candidate profile in guaranteed incognito mode, ban-free.",
      "UX/UI and interaction design for the respondent sorting and export flow.",
      "Positioning and HR-targeting strategy currently in progress.",
      "Built end to end, from idea to production.",
    ],
    stack: ["Same stack as Nocodext"],
    logos: ["/logos/side/linkedin.svg"],
    business: "2 HR leads ready to beta-test.",
  },
  {
    id: "pinnpm",
    index: "03",
    name: "pin'npm",
    pitch:
      "NPMjs.com doesn't let you bookmark libraries, even when signed in. pin'npm catalogs and enriches packages directly in-page.",
    bullets: [
      "Bookmark NPM libraries in a side panel.",
      "Centralized in-page info: security, CVEs, vulnerabilities, maintainability.",
      "Suggestion engine: teams using this library also pair it with this one.",
      "Add bookmarked packages straight into the local project via VS Code.",
      "UX/UI and interaction design for the side panel and in-page integration.",
    ],
    stack: ["Same stack as Nocodext"],
    logos: ["/logos/side/pinnpm.png"],
    business: "From idea to production.",
  },
  {
    id: "airtable",
    index: "04",
    name: "Airtable explorer",
    pitch:
      "Airtable's dashboard colors disappeared after an internal decision. The extension brings them back — and makes the dashboard genuinely navigable.",
    bullets: [
      "Reach columns without scrolling when there are many of them (by list, by voice).",
      "Bookmark columns, auto most-popular.",
      "Excel export, where the native app only offers CSV.",
      "Table coloring and iconography, tab grouping by functional category.",
      "Hide tables from limited-role members without a paid Collaborator license.",
      "UX/UI and interaction design for navigation and coloring in Airtable's native interface.",
    ],
    stack: ["JS vanilla legacy"],
    logos: ["/logos/side/airtable.svg"],
    business: "1 lead ready to beta-test.",
  },
];

export const capabilities = [
  {
    key: "01",
    title: "Scope",
    body: "Model the business, the flows, and the blind spots. Feasibility study, ADRs, costing and roadmap before the first line of code.",
    accent: "text-cyan",
  },
  {
    key: "02",
    title: "Architect",
    body: "Event-driven, hexagonal, standards-based interoperability (HL7/FHIR, SOAP, CRM APIs), data sovereignty and HDS / GDPR compliance by design.",
    accent: "text-violet",
  },
  {
    key: "03",
    title: "Deliver & Hand Off",
    body: "Code, no-code, and agentic (AI) implementation, co-design, production rollout, documentation, team training.",
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

export const overview: OverviewCategory[] = [
  {
    key: "sectors",
    label: "Sectors covered",
    color: "amber",
    description: "Mission domains, grouped by business family.",
    buckets: [
      { label: "Healthcare & medical", caseIds: ["reanimation", "stt-ehpad", "smur"] },
      { label: "SaaS & business tools", caseIds: ["channel-manager", "patrimoine"] },
      { label: "Laboratory & environment", caseIds: ["ocr-labo"] },
      { label: "Energy", caseIds: ["energie"] },
      { label: "Design office & Building Information Modeling", caseIds: ["cad-web"] },
      { label: "HR Tech & creator economy", caseIds: ["ats-youtubers"] },
      { label: "Photography & media", caseIds: ["sftp-photographe"] },
    ],
  },
  {
    key: "technical",
    label: "Technology skills",
    color: "blue",
    description: "Technology families deployed.",
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
        label: "Automation & integration",
        caseIds: ["ocr-labo", "patrimoine", "energie", "ats-youtubers", "sftp-photographe"],
      },
      { label: "Frontend & mobile", caseIds: ["reanimation", "cad-web", "smur"] },
      {
        label: "No-code, Low-Code",
        caseIds: ["patrimoine", "ats-youtubers", "sftp-photographe"],
      },
      { label: "AI & edge computing", caseIds: ["ocr-labo", "stt-ehpad"] },
    ],
  },
  {
    key: "product",
    label: "Product skills",
    color: "violet",
    description: "Types of product value delivered, client missions and side ventures included.",
    buckets: [
      { label: "Product strategy & positioning", caseIds: ["nocodext", "breejd"] },
      {
        label: "Product Design (UX/UI/Interaction)",
        caseIds: ["nocodext", "patrimoine", "breejd", "pinnpm", "airtable", "ats-youtubers"],
      },
      {
        label: "Business automation & integration",
        caseIds: [
          "channel-manager",
          "ocr-labo",
          "stt-ehpad",
          "energie",
          "ats-youtubers",
          "sftp-photographe",
        ],
      },
      { label: "Real-time alerting & dispatch", caseIds: ["reanimation", "smur"] },
      { label: "Management, permissions & training", caseIds: ["patrimoine", "ocr-labo"] },
      { label: "AI & product portability", caseIds: ["stt-ehpad", "cad-web"] },
    ],
  },
  {
    key: "roles",
    label: "Roles held",
    color: "cyan",
    description: "Hats worn across missions.",
    buckets: [
      {
        label: "Architect",
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
        label: "Product / Advisory",
        caseIds: ["patrimoine", "stt-ehpad", "energie", "ats-youtubers"],
      },
      { label: "Tech lead / Dev lead", caseIds: ["reanimation", "channel-manager", "smur"] },
      {
        label: "Mentoring",
        caseIds: ["reanimation", "ocr-labo", "channel-manager"],
      },
      { label: "Frontend / mobile developer", caseIds: ["smur", "reanimation"] },
    ],
  },
];
