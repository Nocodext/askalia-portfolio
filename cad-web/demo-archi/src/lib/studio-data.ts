export type Project = {
  id: string;
  name: string;
  building: string;
  city: string;
  status: "En cours" | "Revue client" | "Livré" | "Archivé";
  voxels: number;
  sizeGb: number;
  updated: string;
  owner: string;
  accent: string;
  buildingType: "tower" | "campus" | "hospital" | "station" | "residential";
};

export const PROJECTS: Project[] = [
  {
    id: "tour-helios-594a0176-2777-4ae3-a475-359332f8337f",
    name: "Tour Hélios",
    building: "Tour de bureaux — 34 niveaux",
    city: "La Défense, Paris",
    status: "En cours",
    voxels: 184320,
    sizeGb: 42.8,
    updated: "il y a 12 min",
    owner: "Camille Rousseau",
    accent: "195",
    buildingType: "tower",
  },
  {
    id: "campus-nord-1238d6dd-68cf-4f79-a7f6-f978057cf815",
    name: "Campus Nord — Bloc B",
    building: "Campus universitaire",
    city: "Lille",
    status: "Revue client",
    voxels: 96040,
    sizeGb: 27.4,
    updated: "il y a 2 h",
    owner: "Yanis Bertrand",
    accent: "155",
    buildingType: "campus",
  },
  {
    id: "hopital-lumiere-8567f129-8fcc-4b53-997b-7d10df369142",
    name: "Hôpital Lumière",
    building: "CHU — 6 ailes",
    city: "Lyon",
    status: "En cours",
    voxels: 268100,
    sizeGb: 61.2,
    updated: "hier",
    owner: "Nadia Belkacem",
    accent: "300",
    buildingType: "hospital",
  },
  {
    id: "gare-atlantique-483a7973-c7f8-4e19-b087-13de4b26e1bc",
    name: "Gare Atlantique",
    building: "Pôle multimodal",
    city: "Nantes",
    status: "Livré",
    voxels: 143870,
    sizeGb: 33.9,
    updated: "il y a 4 j",
    owner: "Léo Marchand",
    accent: "68",
    buildingType: "station",
  },
  {
    id: "residence-onyx-f77d9706-ebed-431d-bd9b-448b8c11cbf6",
    name: "Résidence Onyx",
    building: "Logements — 118 lots",
    city: "Bordeaux",
    status: "Archivé",
    voxels: 51230,
    sizeGb: 12.1,
    updated: "il y a 3 sem.",
    owner: "Camille Rousseau",
    accent: "22",
    buildingType: "residential",
  },
];

export type Comment = {
  id: string;
  projectId: string;
  author: string;
  role: "Client" | "Collaborateur";
  initials: string;
  level: string;
  levelIndex?: number;
  time: string;
  body: string;
  resolved: boolean;
  /** Is the spot this comment points to inside the building (a core, a
   * courtyard, a lobby) or on its outer massing (a facade, a wing, the
   * roof)? Drives how close the close-up camera comes to rest — see
   * MatrixCanvas's focusLevel. */
  interior?: boolean;
};

const idOf = (prefix: string) => PROJECTS.find((p) => p.id.startsWith(prefix))!.id;

export const COMMENTS: Comment[] = [
  {
    id: "c1",
    projectId: idOf("tour-helios"),
    author: "Sophie Meunier",
    role: "Client",
    initials: "SM",
    level: "Niveau 12 · Noyau",
    levelIndex: 12,
    time: "09:41",
    body: "Le noyau technique déborde de 40 cm sur la trame. Peut-on recaler la matrice sur l'axe X ?",
    resolved: false,
    interior: true,
    },
  {
    id: "c2",
    projectId: idOf("tour-helios"),
    author: "Yanis Bertrand",
    role: "Collaborateur",
    initials: "YB",
    level: "Niveau 08 · Façade sud",
    levelIndex: 8,
    time: "10:02",
    body: "J'ai densifié les voxels de façade à 12 cm pour la simulation thermique. Rendu validé de mon côté.",
    resolved: true,
    interior: false,
  },
  {
    id: "c3",
    projectId: idOf("tour-helios"),
    author: "Marc Vidal",
    role: "Client",
    initials: "MV",
    level: "Niveau 21 · Sky lobby",
    levelIndex: 21,
    time: "11:18",
    body: "Le sky lobby doit rester traversant. La matrice actuelle bloque la vue nord-est.",
    resolved: false,
    interior: true,
  },
  {
    id: "c4",
    projectId: idOf("tour-helios"),
    author: "Nadia Belkacem",
    role: "Collaborateur",
    initials: "NB",
    level: "Socle · Parking",
    levelIndex: 0,
    time: "12:07",
    body: "Export IFC relancé après la fusion des couches. 3 collisions restantes sur les gaines.",
    resolved: false,
    interior: true,
  },
  {
    id: "c5",
    projectId: idOf("tour-helios"),
    author: "Léo Marchand",
    role: "Collaborateur",
    initials: "LM",
    level: "Toiture",
    levelIndex: 33,
    time: "13:52",
    body: "Panneaux photovoltaïques intégrés en couche 34. Poids matrice +2,1 Go.",
    resolved: true,
    interior: false,
  },
  {
    id: "c6",
    projectId: idOf("hopital-lumiere"),
    author: "Nadia Belkacem",
    role: "Collaborateur",
    initials: "NB",
    level: "Niveau 06 · Aile B",
    levelIndex: 6,
    time: "08:15",
    body: "L'aile B déborde sur la marge de recul réglementaire. À recaler avant le dépôt du permis.",
    resolved: false,
    interior: false,
  },
  {
    id: "c7",
    projectId: idOf("hopital-lumiere"),
    author: "Bureau Veritas — Contrôle",
    role: "Client",
    initials: "BV",
    level: "Socle · Urgences",
    levelIndex: 1,
    time: "14:30",
    body: "Vérifié : les circulations pompiers restent conformes avec la nouvelle implantation des ailes.",
    resolved: true,
    interior: false,
  },
  {
    id: "c8",
    projectId: idOf("campus-nord"),
    author: "Yanis Bertrand",
    role: "Collaborateur",
    initials: "YB",
    level: "Niveau 02 · Cour intérieure",
    levelIndex: 2,
    time: "09:05",
    body: "La cour intérieure manque de lumière naturelle au RDC. On élargit le vide central ?",
    resolved: false,
    interior: true,
  },
  {
    id: "c9",
    projectId: idOf("campus-nord"),
    author: "Camille Rousseau",
    role: "Collaborateur",
    initials: "CR",
    level: "Général",
    time: "16:40",
    body: "Point d'avancement partagé avec le maître d'ouvrage, rien à signaler côté planning.",
    resolved: false,
  },
];

export type PrivateNote = {
  id: string;
  projectId: string;
  level?: string;
  levelIndex?: number;
  time: string;
  body: string;
  /** See Comment.interior. */
  interior?: boolean;
};

export const PRIVATE_NOTES: PrivateNote[] = [
  {
    id: "n1",
    projectId: idOf("tour-helios"),
    level: "Niveau 12 · Noyau",
    levelIndex: 12,
    time: "09:50",
    body: "Vérifier avec le BET structure avant la prochaine revue client — ne pas encore engager Sophie là-dessus.",
    interior: true,
  },
  {
    id: "n2",
    projectId: idOf("tour-helios"),
    time: "13:58",
    body: "Penser à relancer Léo sur le rapport photovoltaïque, deadline vendredi.",
  },
  {
    id: "n3",
    projectId: idOf("hopital-lumiere"),
    level: "Socle · Urgences",
    levelIndex: 1,
    time: "14:35",
    body: "Point de vigilance perso : re-vérifier les cotes pompiers avant envoi définitif à Bureau Veritas.",
    interior: false,
  },
];

export type Person = {
  id: string;
  name: string;
  email: string;
  initials: string;
  org: string;
  external: boolean;
};

export const DIRECTORY: Person[] = [
  { id: "p1", name: "Camille Rousseau", email: "camille.rousseau@acme-studio.fr", initials: "CR", org: "ACME Studio", external: false },
  { id: "p2", name: "Yanis Bertrand", email: "yanis.bertrand@acme-studio.fr", initials: "YB", org: "ACME Studio", external: false },
  { id: "p3", name: "Nadia Belkacem", email: "nadia.belkacem@acme-studio.fr", initials: "NB", org: "ACME Studio", external: false },
  { id: "p4", name: "Léo Marchand", email: "leo.marchand@acme-studio.fr", initials: "LM", org: "ACME Studio", external: false },
  { id: "p5", name: "Sophie Meunier", email: "s.meunier@groupe-verlaine.com", initials: "SM", org: "Groupe Verlaine (client)", external: true },
  { id: "p6", name: "Marc Vidal", email: "m.vidal@groupe-verlaine.com", initials: "MV", org: "Groupe Verlaine (client)", external: true },
  { id: "p7", name: "Bureau Veritas — Contrôle", email: "controle@bv-technique.fr", initials: "BV", org: "Tiers · Bureau de contrôle", external: true },
  { id: "p8", name: "Atelier Kova", email: "studio@atelier-kova.io", initials: "AK", org: "Tiers · Paysagiste", external: true },
];

export const QUOTA = { usedGb: 177.4, totalGb: 210 };

export type LibraryItem = {
  id: string;
  name: string;
  spec: string;
  accent: string;
};

export type LibraryCategory = {
  id: string;
  label: string;
  audience: string;
  items: LibraryItem[];
};

export const LIBRARY: LibraryCategory[] = [
  {
    id: "structure",
    label: "Structure",
    audience: "Architecte",
    items: [
      { id: "s1", name: "Mur porteur", spec: "béton · 20 cm", accent: "252" },
      { id: "s2", name: "Poteau", spec: "béton armé", accent: "252" },
      { id: "s3", name: "Poutre", spec: "acier IPN", accent: "252" },
      { id: "s4", name: "Dalle / plancher", spec: "béton 18 cm", accent: "252" },
      { id: "s5", name: "Toiture-terrasse", spec: "étanchéité EPDM", accent: "252" },
    ],
  },
  {
    id: "envelope",
    label: "Enveloppe & menuiseries",
    audience: "Architecte",
    items: [
      { id: "e1", name: "Mur rideau", spec: "verre / alu", accent: "195" },
      { id: "e2", name: "Fenêtre double vitrage", spec: "Uw 1,3 W/m².K", accent: "195" },
      { id: "e3", name: "Fenêtre triple vitrage", spec: "Uw 0,8 W/m².K", accent: "195" },
      { id: "e4", name: "Porte extérieure", spec: "Ud 1,2 W/m².K", accent: "195" },
      { id: "e5", name: "Bardage bois", spec: "mélèze", accent: "195" },
    ],
  },
  {
    id: "thermal",
    label: "Thermique & énergie",
    audience: "Thermicien",
    items: [
      { id: "t1", name: "Isolant laine de roche", spec: "λ 0,035 W/m.K", accent: "68" },
      { id: "t2", name: "Isolant PSE", spec: "λ 0,032 W/m.K", accent: "68" },
      { id: "t3", name: "Isolant PIR", spec: "λ 0,022 W/m.K", accent: "68" },
      { id: "t4", name: "Pont thermique", spec: "ψ 0,35 W/m.K", accent: "68" },
      { id: "t5", name: "VMC double flux", spec: "rendement 85 %", accent: "68" },
      { id: "t6", name: "Pompe à chaleur", spec: "COP 4,2", accent: "68" },
      { id: "t7", name: "Panneau photovoltaïque", spec: "380 Wc", accent: "68" },
    ],
  },
];
