import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  cases,
  capabilities,
  overview,
  profile,
  sideProjects,
  type Highlight,
} from "@/content/portfolio.en";
import {
  Popover,
  PopoverArrow,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  HeartPulse,
  Network,
  FlaskConical,
  Landmark,
  Mic,
  Zap,
  Siren,
  DraftingCompass,
  Youtube,
  Camera,
  ArrowUpRight,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";

export const Route = createFileRoute("/en")({
  head: () => ({
    meta: [
      { title: "Joris Grouillet — Product Architect" },
      {
        name: "description",
        content:
          "Product clarity. Technical fluency. Freelance portfolio of Joris Grouillet: product & technical architecture, healthcare, AI, interoperability, and side venture nocodext.studio.",
      },
      { property: "og:title", content: "Joris Grouillet — Product Architect" },
      {
        property: "og:description",
        content:
          "Product clarity. Technical fluency. Client case studies in healthcare, AI, interoperability and business SaaS, plus four side ventures in production.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-ground/80 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-6">
        <nav className="flex items-center justify-between py-4">
          <a href="#top" className="flex items-center gap-3">
            <span className="grid size-8 place-items-center rounded-md bg-ink font-mono text-xs font-medium text-white">
              {profile.initials}
            </span>
            <span className="font-display text-sm font-semibold tracking-tight">
              {profile.firstName} {profile.lastName}
            </span>
            <span className="hidden font-mono text-[11px] text-slate sm:inline">
              / product architect
            </span>
          </a>
          <div className="hidden items-center gap-7 text-sm font-medium text-slate md:flex">
            <a href="#work" className="transition-colors hover:text-ink">
              Case Studies
            </a>
            <a href="#map" className="transition-colors hover:text-ink">
              Overview
            </a>
            <a href="#process" className="transition-colors hover:text-ink">
              Method
            </a>
            <a href="#lab" className="transition-colors hover:text-ink">
              Side Projects
            </a>
            <a href="#contact" className="transition-colors hover:text-ink">
              Contact
            </a>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="font-mono text-xs font-medium text-slate transition-colors hover:text-ink"
            >
              FR
            </a>
            <a
              href="#contact"
              className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-white ring-1 ring-ink/10 transition-transform hover:-translate-y-0.5"
            >
              Start a Project
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="mx-auto max-w-6xl px-6 pt-12 pb-16">
      <div className="mb-8 flex items-center gap-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-cyan">
          {profile.role} — Freelance
        </span>
        <span className="h-px flex-1 bg-line" />
        <span className="font-mono text-[11px] text-slate">{profile.location}</span>
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="reveal d1 font-mono text-xs text-slate">[01] — Positioning</p>
          <h1 className="reveal d1 mt-4 max-w-[18ch] font-display text-5xl font-bold leading-[1.02] tracking-tight text-balance sm:text-6xl lg:text-7xl">
            Product clarity.
            <br />
            Technical fluency.
          </h1>
          <p className="reveal d2 mt-6 max-w-[52ch] text-base text-pretty text-slate sm:text-lg">
            A generalist by choice, cross-functional by temperament — healthcare, digital
            publishing, e-learning, smart cities, laboratories, energy, engineering firms,
            photography, wealth management, research, brokerage, AI, and more.
            <br />
            I go looking for the real need behind the one that gets asked for — especially on
            problems everyone assumes are impossible.
            <br />
            I help traditional-industry companies through digital & AI transformation, from
            scoping to production, then hand it off cleanly to the teams who'll own it.
          </p>
          <div className="reveal d3 mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#work"
              className="rounded-md bg-ink px-5 py-2.5 text-sm font-medium text-white ring-1 ring-ink/10 transition-transform hover:-translate-y-0.5"
            >
              See the case studies
            </a>
            <a
              href="#lab"
              className="rounded-md bg-white/70 px-5 py-2.5 text-sm font-medium text-ink ring-1 ring-ink/10 backdrop-blur transition-transform hover:-translate-y-0.5"
            >
              {profile.sideBusinessBrand}
            </a>
          </div>
        </div>
        <div className="lg:col-span-5">
          <div className="reveal d3 relative rounded-[min(1vw,16px)] bg-gradient-to-b from-white/85 to-white/55 p-6 ring-1 ring-ink/15 backdrop-blur-xl prism-edge">
            <div className="spectrum absolute inset-x-6 top-0 h-px opacity-70" />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="font-display text-3xl font-semibold leading-none">
                  {cases.length}
                </div>
                <div className="mt-1 font-mono text-[11px] text-slate">case studies featured</div>
              </div>
              <div>
                <div className="font-display text-3xl font-semibold leading-none">
                  {sideProjects.length}
                </div>
                <div className="mt-1 font-mono text-[11px] text-slate">solo-built products</div>
              </div>
            </div>
            <div className="mt-6 border-t border-ink/10 pt-5">
              <p className="mt-2 font-mono text-xs text-ink">
                Adaptive | Inventive | Versatile | Proactive | Committed
              </p>
            </div>
            <div className="mt-5 border-t border-ink/10 pt-5">
              <div className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate">
                Currently
              </div>
              <ul className="mt-2 space-y-1.5 text-sm font-medium">
                <li className="flex items-start gap-2">
                  <DraftingCompass className="mt-0.5 size-4 shrink-0 text-cyan" strokeWidth={2} />
                  <span>
                    Architecting a hospital Care Team · Patient · Family information platform
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <DraftingCompass className="mt-0.5 size-4 shrink-0 text-cyan" strokeWidth={2} />
                  <span>launching {profile.sideBusinessBrand}.</span>
                </li>
              </ul>
            </div>
            <div className="mt-5 border-t border-ink/10 pt-5">
              <div className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-slate">
                <GraduationCap className="size-3.5" strokeWidth={2} />
                Technical expert jury
              </div>
              <p className="mt-2 text-sm font-medium">
                Oreegami (digital school) · Ynov (software engineering)
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span
                  className="inline-flex items-center gap-1.5 rounded-full bg-ink/5 py-1 pl-1.5 pr-2.5 font-mono text-[11px] ring-1 ring-inset ring-ink/10"
                  title="Crédit Impôt Innovation — France's state-approved R&D tax credit accreditation, valid through 2028"
                >
                  <img src="/logos/marianne.svg" alt="" className="size-3.5 rounded-[2px]" />
                  CII Tax Credit → 2028
                </span>
                <span
                  className="inline-flex items-center gap-1.5 rounded-full bg-ink/5 py-1 pl-1.5 pr-2.5 font-mono text-[11px] ring-1 ring-inset ring-ink/10"
                  title="Comfortable working with English-speaking, international teams (e.g. an international intern)"
                >
                  <img src="/logos/uk-flag.svg" alt="" className="h-3.5 w-auto rounded-[1px]" />
                  International teams
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type CaseIconConfig =
  { icon: LucideIcon; color: "cyan" | "violet" | "amber" | "blue" | "red" } | { image: string };

const caseIcons: Record<string, CaseIconConfig> = {
  reanimation: { icon: HeartPulse, color: "cyan" },
  "channel-manager": { icon: Network, color: "violet" },
  "ocr-labo": { icon: FlaskConical, color: "amber" },
  patrimoine: { icon: Landmark, color: "blue" },
  "stt-ehpad": { icon: Mic, color: "violet" },
  energie: { icon: Zap, color: "amber" },
  "cad-web": { icon: DraftingCompass, color: "blue" },
  smur: { icon: Siren, color: "cyan" },
  "ats-youtubers": { icon: Youtube, color: "red" },
  "sftp-photographe": { icon: Camera, color: "blue" },
  nocodext: { image: "/logos/side/bubble-icon.png" },
  breejd: { image: "/logos/side/linkedin-icon.svg" },
  pinnpm: { image: "/logos/side/npm-icon.svg" },
  airtable: { image: "/logos/side/airtable-icon.svg" },
};

const iconBadgeBg = {
  cyan: "bg-cyan",
  violet: "bg-violet",
  amber: "bg-amber",
  blue: "bg-blue",
  red: "bg-[#FF0000]",
} as const;

const accentBorder = {
  cyan: "border-cyan",
  violet: "border-violet",
  amber: "border-amber",
  blue: "border-blue",
  red: "border-[#FF0000]",
} as const;

function caseColor(id: string): "cyan" | "violet" | "amber" | "blue" | "red" {
  const conf = caseIcons[id];
  return conf && "color" in conf ? conf.color : "cyan";
}

function CaseIcon({ id, size = "lg" }: { id: string; size?: "lg" | "sm" }) {
  const conf = caseIcons[id];
  if (!conf) return null;
  const box = size === "lg" ? "size-11" : "size-7";

  if ("image" in conf) {
    const imgSize = size === "lg" ? "h-6" : "h-4";
    return (
      <span
        className={`grid ${box} shrink-0 place-items-center overflow-hidden rounded-full bg-white ring-1 ring-ink/10 shadow-[0_8px_16px_-8px_rgba(16,19,26,0.45)]`}
      >
        <img src={conf.image} alt="" className={`${imgSize} w-auto object-contain`} />
      </span>
    );
  }

  const { icon: Icon, color } = conf;
  const iconSize = size === "lg" ? "size-5" : "size-3.5";
  return (
    <span
      className={`relative grid ${box} shrink-0 place-items-center overflow-hidden rounded-full ${iconBadgeBg[color]} shadow-[0_8px_16px_-8px_rgba(16,19,26,0.45)]`}
    >
      <span className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/0 to-black/10" />
      <Icon className={`relative ${iconSize} text-white`} strokeWidth={2} />
    </span>
  );
}

const matrixAxes = [
  {
    key: "roles",
    label: "Roles",
    color: "text-cyan",
    bg: "bg-cyan/10",
    ring: "ring-cyan/25",
    head: "bg-cyan",
    headText: "text-white",
  },
  {
    key: "functional",
    label: "Functional",
    color: "text-violet",
    bg: "bg-violet/10",
    ring: "ring-violet/25",
    head: "bg-violet",
    headText: "text-white",
  },
  {
    key: "sectors",
    label: "Sector",
    color: "text-amber",
    bg: "bg-amber/10",
    ring: "ring-amber/25",
    head: "bg-amber",
    headText: "text-ink",
  },
  {
    key: "technical",
    label: "Technology",
    color: "text-blue",
    bg: "bg-blue/10",
    ring: "ring-blue/25",
    head: "bg-blue",
    headText: "text-white",
  },
  {
    key: "ethical",
    label: "Ethics",
    color: "text-slate",
    bg: "bg-ink/5",
    ring: "ring-ink/15",
    head: "bg-ink",
    headText: "text-white",
  },
] as const;

function HighlightItem({ item }: { item: Highlight }) {
  if (typeof item === "string") {
    return (
      <li className="flex gap-3 text-sm text-pretty sm:break-inside-avoid sm:pb-2.5">
        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cyan" />
        <span>{item}</span>
      </li>
    );
  }
  return (
    <li className="flex gap-3 text-sm text-pretty sm:break-inside-avoid sm:pb-2.5">
      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cyan" />
      <div className="flex-1">
        <span>{item.text}</span>
        {item.objective ? (
          <p className="mt-1.5 text-xs italic text-slate">{item.objective}</p>
        ) : null}
        {item.detail ? (
          <ul className="mt-2 space-y-1.5 border-l-2 border-cyan/30 pl-3">
            {item.detail.map((d) => (
              <li key={d} className="text-xs text-pretty text-slate">
                {d}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </li>
  );
}

function CaseCard({ item }: { item: (typeof cases)[number] }) {
  return (
    <article
      id={item.id}
      className="group relative overflow-hidden rounded-[min(1vw,14px)] bg-gradient-to-b from-white/85 to-white/55 ring-1 ring-ink/15 backdrop-blur-xl prism-edge transition-transform hover:-translate-y-1"
    >
      <div className="spectrum h-1 w-full opacity-80" />
      <div className="p-7">
        <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-slate">
          <span>
            {item.index} / {item.sector}
          </span>
          <div className="flex items-center gap-2">
            {item.duration ? (
              <span className="rounded-full bg-ink/5 px-2.5 py-0.5 ring-1 ring-inset ring-ink/10">
                {item.duration}
              </span>
            ) : null}
            {item.flagship ? (
              <span className="rounded-full bg-amber/10 px-2.5 py-0.5 text-amber ring-1 ring-inset ring-amber/25">
                Flagship
              </span>
            ) : null}
          </div>
        </div>
        <div className="mt-5 flex items-start justify-between gap-3">
          <div className="flex max-w-prose items-start gap-3.5">
            <CaseIcon id={item.id} />
            <h3 className="min-w-0 font-display text-2xl font-semibold leading-tight tracking-tight text-balance">
              {item.title}
            </h3>
          </div>
          {item.glossary ? (
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="mt-1 grid size-6 shrink-0 place-items-center rounded-full font-mono text-[11px] text-slate ring-1 ring-ink/15 transition-colors hover:text-ink"
                  aria-label="Glossary"
                >
                  ?
                </button>
              </PopoverTrigger>
              <PopoverContent side="left" align="start" className="w-72">
                <div className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate">
                  Glossary
                </div>
                <dl className="mt-3 space-y-2.5">
                  {item.glossary.map((g) => (
                    <div key={g.term}>
                      <dt className="font-mono text-xs font-semibold text-ink">{g.term}</dt>
                      <dd className="mt-0.5 text-xs text-pretty text-slate">{g.def}</dd>
                    </div>
                  ))}
                </dl>
              </PopoverContent>
            </Popover>
          ) : null}
        </div>
        <div className="mt-4 flex items-center justify-between gap-4">
          <p
            className={`max-w-prose border-l-4 bg-ink/[0.04] py-2.5 pl-4 text-sm text-pretty text-slate ${
              accentBorder[caseColor(item.id)]
            }`}
          >
            {item.need}
          </p>
          {item.logos ? (
            <div className="flex shrink-0 items-center gap-5">
              {item.logos.map((src) => (
                <img key={src} src={src} alt="" className="h-9 w-auto" />
              ))}
            </div>
          ) : null}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {item.hashtags.map((h) => (
            <span
              key={h}
              className="rounded-full bg-violet/10 px-2.5 py-1 font-mono text-xs text-violet ring-1 ring-inset ring-violet/25"
            >
              #{h.replace(/\s+/g, "-")}
            </span>
          ))}
        </div>
        <ul
          className={`mt-6 space-y-2.5 ${
            item.highlights.length > 4 ? "sm:columns-2 sm:gap-8 sm:space-y-0" : ""
          }`}
        >
          {item.highlights.map((h, i) => (
            <HighlightItem key={typeof h === "string" ? h : (h.text ?? i)} item={h} />
          ))}
        </ul>
        {item.scope ? (
          <p className="mt-5 border-l-2 border-violet/40 pl-3 font-mono text-[11px] leading-relaxed text-slate">
            {item.scope}
          </p>
        ) : null}

        <div className="mt-6 font-mono text-[10px] uppercase tracking-[0.1em] text-slate">
          Areas of intervention
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-5">
          {matrixAxes.map((axis) => (
            <div key={axis.key} className="overflow-hidden rounded-md ring-1 ring-ink/10">
              <div
                className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] ${axis.head} ${axis.headText}`}
              >
                {axis.label}
              </div>
              <div className="flex flex-wrap gap-1.5 bg-white p-3">
                {item.matrix[axis.key].map((v) => (
                  <span
                    key={v}
                    className={`rounded px-2 py-1 text-xs ring-1 ring-inset ${axis.bg} ${axis.color} ${axis.ring}`}
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-slate">
            Stack software
          </div>
          <div className="mt-2 flex flex-wrap gap-2 font-mono text-[11px]">
            {item.stackSoftware.map((s) => (
              <span
                key={s}
                className="rounded-full bg-ink/5 px-2.5 py-1 ring-1 ring-inset ring-ink/10"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
        {item.stackHardware ? (
          <div className="mt-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-slate">
              Stack hardware
            </div>
            <div className="mt-2 flex flex-wrap gap-2 font-mono text-[11px]">
              {item.stackHardware.map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-blue/10 px-2.5 py-1 text-blue ring-1 ring-inset ring-blue/25"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </article>
  );
}

function CaseToc() {
  const [activeId, setActiveId] = useState<string>(cases[0]?.id ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "0px 0px -80% 0px", threshold: 0 },
    );
    const els = cases
      .map((c) => document.getElementById(c.id))
      .filter((el): el is HTMLElement => el !== null);
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Case studies table of contents"
      className="sticky top-24 hidden max-h-[calc(100vh-8rem)] w-44 shrink-0 flex-col gap-0.5 overflow-y-auto lg:flex"
    >
      {cases.map((c) => {
        const conf = caseIcons[c.id];
        const active = c.id === activeId;
        return (
          <a
            key={c.id}
            href={`#${c.id}`}
            title={c.title}
            className={`flex items-center gap-2.5 rounded-md py-1.5 pl-3 text-xs transition-colors ${
              active ? "font-medium text-ink" : "text-slate hover:text-ink"
            }`}
          >
            <span className="grid size-2.5 shrink-0 place-items-center">
              <span
                className={`rounded-full transition-all ${conf && "color" in conf ? iconBadgeBg[conf.color] : "bg-ink/30"} ${
                  active ? "size-2.5" : "size-1.5"
                }`}
              />
            </span>
            <span className="truncate">{c.title}</span>
          </a>
        );
      })}
    </nav>
  );
}

function Work() {
  return (
    <section id="work" className="border-y border-ink/10 bg-white/40">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-cyan">
              [02] — Case Studies
            </span>
            {false && (
              <h2 className="mt-3 max-w-[26ch] font-display text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl">
                Challenges everyone said were impossible, shipped to production.
              </h2>
            )}
          </div>
          <span className="font-mono text-xs text-slate">{cases.length} missions</span>
        </div>
        <div className="lg:flex lg:items-start lg:gap-8">
          <div className="grid grid-cols-1 gap-5 lg:min-w-0 lg:flex-1">
            {cases.map((item) => (
              <CaseCard key={item.id} item={item} />
            ))}
          </div>
          <CaseToc />
        </div>
      </div>
    </section>
  );
}

const overviewColors = {
  cyan: {
    ring: "ring-cyan/25",
    text: "text-cyan",
    bg: "bg-cyan/10",
    head: "bg-gradient-to-r from-cyan to-cyan/75",
    headText: "text-white",
  },
  violet: {
    ring: "ring-violet/25",
    text: "text-violet",
    bg: "bg-violet/10",
    head: "bg-gradient-to-r from-violet to-violet/75",
    headText: "text-white",
  },
  amber: {
    ring: "ring-amber/25",
    text: "text-amber",
    bg: "bg-amber/10",
    head: "bg-gradient-to-r from-amber to-amber/75",
    headText: "text-ink",
  },
  blue: {
    ring: "ring-blue/25",
    text: "text-blue",
    bg: "bg-blue/10",
    head: "bg-gradient-to-r from-blue to-blue/75",
    headText: "text-white",
  },
} as const;

function OverviewPanel({
  category,
  popoverSide,
}: {
  category: (typeof overview)[number];
  popoverSide: "left" | "right";
}) {
  const c = overviewColors[category.color];
  return (
    <div className="overflow-hidden rounded-[min(1vw,14px)] ring-1 ring-ink/15 backdrop-blur-xl prism-edge">
      <div
        className={`px-6 py-3 font-mono text-[11px] uppercase tracking-[0.15em] ${c.head} ${c.headText}`}
      >
        {category.label}
      </div>
      <div className="bg-gradient-to-b from-white/85 to-white/55 p-6">
        <p className="text-xs text-slate">{category.description}</p>
        <ul className="mt-5">
          {category.buckets.map((b) => (
            <li
              key={b.label}
              className="flex items-center justify-between gap-3 border-t border-ink/10 py-2.5 first:border-t-0 first:pt-0"
            >
              <span className="text-sm">{b.label}</span>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={`inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-full px-2.5 py-1 font-mono text-[11px] ring-1 ring-inset transition-colors hover:brightness-95 ${c.bg} ${c.text} ${c.ring}`}
                  >
                    {b.caseIds.length}
                    <ArrowUpRight className="size-3" strokeWidth={2.5} />
                  </button>
                </PopoverTrigger>
                <PopoverContent side={popoverSide} align="center" className="w-72">
                  <PopoverArrow className="fill-popover" stroke="var(--line)" strokeWidth={1} />
                  <div className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate">
                    {b.label}
                  </div>
                  <TooltipProvider delayDuration={200}>
                    <ul className="mt-3 -mx-1">
                      {b.caseIds.map((id) => {
                        const item = cases.find((x) => x.id === id);
                        const project = sideProjects.find((x) => x.id === id);
                        const title = item?.title ?? project?.name;
                        if (!title) return null;
                        return (
                          <li key={id}>
                            <PopoverClose asChild>
                              <a
                                href={`#${id}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  const el = document.getElementById(id);
                                  if (el) {
                                    const top =
                                      el.getBoundingClientRect().top + window.scrollY - 96;
                                    window.scrollTo({ top, behavior: "instant" });
                                  }
                                  history.replaceState(null, "", `#${id}`);
                                }}
                                className="flex items-center gap-2.5 rounded-md px-1 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-ink/5"
                              >
                                <CaseIcon id={id} size="sm" />
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="min-w-0 flex-1 truncate text-left">
                                      {title}
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent side="bottom">{title}</TooltipContent>
                                </Tooltip>
                                {project ? (
                                  <span className="shrink-0 font-mono text-[10px] font-normal text-slate">
                                    (side project)
                                  </span>
                                ) : null}
                              </a>
                            </PopoverClose>
                          </li>
                        );
                      })}
                    </ul>
                  </TooltipProvider>
                </PopoverContent>
              </Popover>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Overview() {
  return (
    <section id="map" className="mx-auto max-w-6xl px-6 py-16">
      <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-cyan">
        [03] — Overview
      </span>
      <h2 className="mt-3 max-w-[30ch] font-display text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl">
        What the {cases.length} missions cover, at a glance.
      </h2>
      <p className="mt-3 max-w-prose text-sm text-pretty text-slate">
        A synthesis of sectors, technical and product skills, and roles held, drawn from each case
        study's intervention matrix.
      </p>
      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
        {overview.map((category, i) => (
          <OverviewPanel
            key={category.key}
            category={category}
            popoverSide={i % 2 === 0 ? "right" : "left"}
          />
        ))}
      </div>
    </section>
  );
}

function Process() {
  return (
    <section id="process" className="mx-auto max-w-6xl px-6 py-16">
      <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-cyan">
        [04] — Method
      </span>
      <h2 className="mt-3 max-w-[22ch] font-display text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl">
        A clear plan that becomes a working system.
      </h2>
      <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-[min(1vw,14px)] ring-1 ring-ink/10 md:grid-cols-3">
        {capabilities.map((c) => (
          <div
            key={c.key}
            className="bg-gradient-to-b from-white/85 to-white/55 p-6 ring-1 ring-ink/15"
          >
            <span className={`font-mono text-xs ${c.accent}`}>{c.key}</span>
            <div className="mt-3 font-display text-lg font-semibold">{c.title}</div>
            <p className="mt-2 text-sm text-pretty text-slate">{c.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function SideBusiness() {
  return (
    <section id="lab" className="mx-auto max-w-6xl px-6 pb-16">
      <div className="relative overflow-hidden rounded-[min(1vw,16px)] bg-ink p-8 text-white ring-1 ring-ink/10 prism-edge sm:p-10">
        <div className="spectrum absolute inset-x-0 top-0 h-1 opacity-90" />
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-white/60">
          <span className="size-1.5 rounded-full bg-cyan" /> [05] — Side Projects
        </div>
        <div className="mt-5 inline-flex rounded-md bg-white px-4 py-2.5">
          <img src="/logos/nocodext.png" alt="nocodext.studio" className="h-7 w-auto sm:h-8" />
        </div>
        <p className="mt-3 max-w-[58ch] text-sm text-pretty text-white/70">
          Four products built solo, from idea to production: browser extensions and tooling that
          fill the gaps in the platforms teams use every day.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
          {sideProjects.map((p) => (
            <div
              key={p.id}
              id={p.id}
              className="rounded-[min(1vw,14px)] bg-white/5 p-6 ring-1 ring-white/10"
            >
              <div className="font-mono text-[11px] text-white/50">{p.index} / product</div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <h3 className="font-display text-xl font-semibold">{p.name}</h3>
                {p.logos ? (
                  <div className="flex shrink-0 items-center gap-2">
                    {p.logos.map((src) => (
                      <span
                        key={src}
                        className="inline-flex items-center rounded-md bg-white px-2 py-1"
                      >
                        <img src={src} alt="" className="h-4 w-auto" />
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
              <p className="mt-2 text-sm text-pretty text-white/70">{p.pitch}</p>
              <ul className="mt-4 space-y-2">
                {p.bullets.map((b) => (
                  <li key={b} className="flex gap-2.5 text-sm text-white/80">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cyan" />
                    <span className="text-pretty">{b}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-2 font-mono text-[11px] text-white/60">
                {p.stack.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-white/10 px-2.5 py-1 ring-1 ring-inset ring-white/15"
                  >
                    {s}
                  </span>
                ))}
              </div>
              {p.llms ? (
                <div className="mt-4">
                  <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/50">
                    LLMs used
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2 font-mono text-[11px] text-amber">
                    {p.llms.map((l) => (
                      <span
                        key={l}
                        className="rounded-full bg-amber/10 px-2.5 py-1 ring-1 ring-inset ring-amber/25"
                      >
                        {l}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
              <div className="mt-4 border-t border-white/10 pt-3 font-mono text-[11px] text-cyan">
                {p.business}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-6xl px-6 pb-20">
      <div className="rounded-[min(1vw,16px)] bg-gradient-to-b from-white/85 to-white/55 p-8 ring-1 ring-ink/15 backdrop-blur-xl prism-edge sm:p-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-cyan">
              [06] — Contact
            </span>
            <h2 className="mt-4 max-w-[20ch] font-display text-4xl font-bold leading-[1.05] tracking-tight text-balance sm:text-5xl">
              Let's talk about the problem before the solution.
            </h2>
            <p className="mt-4 max-w-[44ch] text-sm text-pretty text-slate sm:text-base">
              One committed engagement at a time. Describe the context and the constraints: I look
              past the stated need to find what it's really about, and what technology can
              actually unlock — usually more than people expect. I study feasibility, scope the
              work, get immersed in the business and its workflows, then own the architecture and
              delivery iterations — through to the outcome that matters: adoption, ease of use,
              real value created.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <a
              href={`mailto:${profile.email}`}
              className="rounded-md bg-ink px-6 py-3.5 text-center text-sm font-semibold text-white ring-1 ring-ink/10 transition-transform hover:-translate-y-0.5"
            >
              {profile.email}
            </a>
            <div className="flex flex-wrap gap-4 font-mono text-xs text-slate">
              <span>Askalia</span>
              <span>·</span>
              <span>{profile.sideBusinessBrand}</span>
              <span>·</span>
              <span>LinkedIn</span>
              <span>·</span>
              <span>{profile.location} · CET</span>
            </div>
          </div>
        </div>
      </div>
      <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-ink/10 pt-6 font-mono text-[11px] text-slate">
        <span>
          © {new Date().getFullYear()} {profile.firstName} {profile.lastName} — {profile.role}
        </span>
        <span>{profile.tagline}</span>
      </footer>
    </section>
  );
}

function Index() {
  return (
    <main className="min-h-screen bg-ground font-sans text-ink antialiased selection:bg-cyan/20">
      <Nav />
      <Hero />
      <Work />
      <Overview />
      <Process />
      <SideBusiness />
      <Contact />
    </main>
  );
}
