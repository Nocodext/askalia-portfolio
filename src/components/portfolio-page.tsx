import { useEffect, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import type {
  Bullet,
  CaseStudy,
  Highlight,
  OverviewBucket,
  OverviewCategory,
  PortfolioContent,
} from "@/content/portfolio";
import type { UIStrings } from "@/content/ui-strings";
import {
  Popover,
  PopoverArrow,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ContactEmail } from "@/components/contact-email";
import { SkillRing } from "@/components/skill-ring";
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
  Tags,
  ExternalLink,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Languages,
  type LucideIcon,
} from "lucide-react";

type CaseIconConfig =
  | { icon: LucideIcon; color: "cyan" | "violet" | "amber" | "blue" | "red"; flip?: boolean }
  | { image: string };

const caseIcons: Record<string, CaseIconConfig> = {
  reanimation: { icon: HeartPulse, color: "cyan" },
  "channel-manager": { icon: Network, color: "violet" },
  "ocr-labo": { icon: FlaskConical, color: "amber" },
  patrimoine: { icon: Landmark, color: "blue" },
  "stt-ehpad": { icon: Mic, color: "violet" },
  energie: { icon: Zap, color: "cyan" },
  "cad-web": { icon: DraftingCompass, color: "blue" },
  smur: { icon: Siren, color: "cyan" },
  "ats-youtubers": { icon: Youtube, color: "red" },
  "sftp-photographe": { icon: Camera, color: "blue" },
  "veille-tarifaire": { icon: Tags, color: "violet", flip: true },
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

const ringColorVar = {
  cyan: "var(--cyan)",
  violet: "var(--violet)",
  amber: "var(--amber)",
  blue: "var(--blue)",
  red: "#FF0000",
} as const;

const accentBorder = {
  cyan: "border-cyan",
  violet: "border-violet",
  amber: "border-amber",
  blue: "border-blue",
  red: "border-[#FF0000]",
} as const;

function scrollToCase(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.dispatchEvent(new Event(CASE_EXPAND_EVENT));
    // Same clearance on both breakpoints would eat too much of a mobile
    // viewport's height — scale it down below the `md` nav-collapse breakpoint.
    const offset = window.innerWidth < 768 ? 128 : 168;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "instant" });
  }
  history.replaceState(null, "", `#${id}`);
}

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

  const { icon: Icon, color, flip } = conf;
  const iconSize = size === "lg" ? "size-5" : "size-3.5";
  return (
    <span
      className={`relative grid ${box} shrink-0 place-items-center overflow-hidden rounded-full ${iconBadgeBg[color]} shadow-[0_8px_16px_-8px_rgba(16,19,26,0.45)]`}
    >
      <span className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/0 to-black/10" />
      <Icon
        className={`relative ${iconSize} text-white ${flip ? "-scale-x-100" : ""}`}
        strokeWidth={2}
      />
    </span>
  );
}

function useMatrixAxes(strings: UIStrings) {
  return [
    {
      key: "roles",
      label: strings.matrixAxes.roles,
      color: "text-cyan",
      bg: "bg-cyan/10",
      ring: "ring-cyan/25",
      head: "bg-cyan",
      headText: "text-white",
    },
    {
      key: "functional",
      label: strings.matrixAxes.functional,
      color: "text-violet",
      bg: "bg-violet/10",
      ring: "ring-violet/25",
      head: "bg-violet",
      headText: "text-white",
    },
    {
      key: "sectors",
      label: strings.matrixAxes.sectors,
      color: "text-amber",
      bg: "bg-amber/10",
      ring: "ring-amber/25",
      head: "bg-amber",
      headText: "text-ink",
    },
    {
      key: "technical",
      label: strings.matrixAxes.technical,
      color: "text-blue",
      bg: "bg-blue/10",
      ring: "ring-blue/25",
      head: "bg-blue",
      headText: "text-white",
    },
    {
      key: "ethical",
      label: strings.matrixAxes.ethical,
      color: "text-slate",
      bg: "bg-ink/5",
      ring: "ring-ink/15",
      head: "bg-ink",
      headText: "text-white",
    },
  ] as const;
}

const overviewColors = {
  cyan: {
    ring: "ring-cyan/25",
    text: "text-cyan",
    bg: "bg-cyan/10",
    head: "bg-cyan",
    // Darkens toward the same hue (not a different color) so the white
    // header text stays legible across the whole bar.
    headerBg: "bg-[linear-gradient(90deg,var(--cyan),color-mix(in_oklch,var(--cyan),black_30%))]",
    headText: "text-white",
  },
  violet: {
    ring: "ring-violet/25",
    text: "text-violet",
    bg: "bg-violet/10",
    head: "bg-violet",
    headerBg:
      "bg-[linear-gradient(90deg,var(--violet),color-mix(in_oklch,var(--violet),black_30%))]",
    headText: "text-white",
  },
  amber: {
    ring: "ring-amber/25",
    text: "text-amber",
    bg: "bg-amber/10",
    head: "bg-amber",
    // Amber's header text is dark, so it lightens instead of darkening.
    headerBg:
      "bg-[linear-gradient(90deg,var(--amber),color-mix(in_oklch,var(--amber),white_40%))]",
    headText: "text-ink",
  },
  blue: {
    ring: "ring-blue/25",
    text: "text-blue",
    bg: "bg-blue/10",
    head: "bg-blue",
    headerBg: "bg-[linear-gradient(90deg,var(--blue),color-mix(in_oklch,var(--blue),black_30%))]",
    headText: "text-white",
  },
} as const;

function Nav({ content, strings }: { content: PortfolioContent; strings: UIStrings }) {
  const { profile } = content;
  const navRowRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  // Anchors the glow to the hovered tab itself (its own rect), not the raw
  // cursor position — following the cursor read as a tracker trail, not a
  // tab highlight.
  const focusGlow = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const glow = glowRef.current;
    const row = navRowRef.current;
    if (!glow || !row) return;
    const linkRect = e.currentTarget.getBoundingClientRect();
    const rowRect = row.getBoundingClientRect();
    glow.style.left = `${linkRect.left - rowRect.left + linkRect.width / 2}px`;
    glow.style.top = `${linkRect.top - rowRect.top + linkRect.height / 2}px`;
    glow.style.opacity = "1";
  };

  const hideGlow = () => {
    if (glowRef.current) glowRef.current.style.opacity = "0";
  };

  return (
    <header
      className="sticky top-0 z-40 border-b border-ink/8 bg-[oklch(0.93_0.008_260/85%)] backdrop-blur-xl prism-edge"
      style={{ clipPath: "inset(-100px 0px 0px 0px)" }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/50 to-white/0" />
      <div className="mx-auto max-w-6xl px-6">
        <nav className="flex items-stretch justify-between">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              scrollToCase("top");
            }}
            className="flex items-center gap-3 py-4"
          >
            <span className="grid size-8 place-items-center rounded-md bg-ink font-mono text-xs font-medium text-white">
              {profile.initials}
            </span>
            <span className="font-display text-sm font-semibold tracking-tight">
              {profile.firstName} {profile.lastName}
            </span>
            <span className="hidden font-mono text-xs font-medium text-ink/70 sm:inline">
              / product architect
            </span>
          </a>
          <div
            ref={navRowRef}
            className="relative hidden items-stretch gap-7 text-sm font-medium text-slate md:flex"
            onMouseLeave={hideGlow}
          >
            <div
              ref={glowRef}
              className="pointer-events-none absolute size-16 rounded-full bg-violet/70 opacity-0 blur-2xl transition-all duration-300"
              style={{ left: 0, top: 0, transform: "translate(-50%, -50%)" }}
            />
            <a
              href="#work"
              onClick={(e) => {
                e.preventDefault();
                scrollToCase("work");
              }}
              onMouseEnter={focusGlow}
              className="relative flex items-center transition-colors hover:text-ink"
            >
              {strings.nav.caseStudies}
            </a>
            <a
              href="#map"
              onClick={(e) => {
                e.preventDefault();
                scrollToCase("map");
              }}
              onMouseEnter={focusGlow}
              className="relative flex items-center transition-colors hover:text-ink"
            >
              {strings.nav.cartography}
            </a>
            <a
              href="#process"
              onClick={(e) => {
                e.preventDefault();
                scrollToCase("process");
              }}
              onMouseEnter={focusGlow}
              className="relative flex items-center transition-colors hover:text-ink"
            >
              {strings.nav.method}
            </a>
            <a
              href="#lab"
              onClick={(e) => {
                e.preventDefault();
                scrollToCase("lab");
              }}
              onMouseEnter={focusGlow}
              className="relative flex items-center transition-colors hover:text-ink"
            >
              {strings.nav.sideBusiness}
            </a>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollToCase("contact");
              }}
              onMouseEnter={focusGlow}
              className="relative flex items-center transition-colors hover:text-ink"
            >
              {strings.nav.contact}
            </a>
          </div>
          <div className="flex items-center gap-4 py-4">
            <a
              href={strings.nav.altLangHref}
              className="rounded-full px-2.5 py-1 font-mono text-xs font-medium text-slate ring-1 ring-inset ring-ink/15 transition-colors hover:text-ink hover:ring-ink/30"
            >
              {strings.nav.altLangLabel}
            </a>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollToCase("contact");
              }}
              className="rounded-md bg-gradient-to-r from-violet to-blue px-4 py-2 text-sm font-medium text-white shadow-[0_8px_20px_-8px_var(--violet)] ring-1 ring-inset ring-white/10 transition-transform hover:-translate-y-0.5"
            >
              {strings.nav.startProject}
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}

function Hero({ content, strings }: { content: PortfolioContent; strings: UIStrings }) {
  const { profile, cases, sideProjects } = content;
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
          <h1 className="reveal d1 max-w-[18ch] font-display text-5xl font-bold leading-[1.02] tracking-tight text-balance sm:text-6xl lg:text-7xl">
            Product clarity.
            <br />
            Technical fluency.
          </h1>
          <p className="reveal d2 mt-6 max-w-[52ch] text-base text-pretty text-slate sm:text-lg">
            {strings.hero.intro}
          </p>
          <div className="reveal d3 mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#work"
              onClick={(e) => {
                e.preventDefault();
                scrollToCase("work");
              }}
              className="rounded-md bg-gradient-to-r from-violet to-blue px-5 py-2.5 text-sm font-medium text-white shadow-[0_8px_20px_-8px_var(--violet)] ring-1 ring-inset ring-white/10 transition-transform hover:-translate-y-0.5"
            >
              {strings.hero.seeCaseStudies}
            </a>
            <a
              href="#lab"
              onClick={(e) => {
                e.preventDefault();
                scrollToCase("lab");
              }}
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
                <div className="mt-1 font-mono text-[11px] text-slate">
                  {strings.hero.statCaseStudies}
                </div>
              </div>
              <div>
                <div className="font-display text-3xl font-semibold leading-none">
                  {sideProjects.length}
                </div>
                <div className="mt-1 font-mono text-[11px] text-slate">
                  {strings.hero.statSideProjects}
                </div>
              </div>
            </div>
            <div className="mt-6 border-t border-ink/10 pt-5">
              <p className="mt-2 font-mono text-xs text-ink">{strings.hero.traits}</p>
            </div>
            <div className="mt-5 border-t border-ink/10 pt-5">
              <div className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate">
                {strings.hero.currentlyLabel}
              </div>
              <ul className="mt-2 space-y-1.5 text-sm font-medium">
                <li className="flex items-start gap-2">
                  <DraftingCompass className="mt-0.5 size-4 shrink-0 text-cyan" strokeWidth={2} />
                  <span>{strings.hero.currentSoignant}</span>
                </li>
                <li className="flex items-start gap-2">
                  <DraftingCompass className="mt-0.5 size-4 shrink-0 text-cyan" strokeWidth={2} />
                  <span>
                    {strings.hero.currentlyLaunchingPrefix}
                    {profile.sideBusinessBrand}.
                  </span>
                </li>
              </ul>
            </div>
            <div className="mt-5 border-t border-ink/10 pt-5">
              <div className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-slate">
                <GraduationCap className="size-3.5" strokeWidth={2} />
                {strings.hero.juryLabel}
              </div>
              <p className="mt-2 text-sm font-medium">{strings.hero.jurySchools}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span
                  className="inline-flex items-center gap-1.5 rounded-full bg-ink/5 py-1 pl-1.5 pr-2.5 font-mono text-[11px] ring-1 ring-inset ring-ink/10"
                  title={strings.hero.ciiTitle}
                >
                  <img src="/logos/marianne.svg" alt="" className="size-3.5 rounded-[2px]" />
                  {strings.hero.ciiLabel}
                </span>
                <span
                  className="inline-flex items-center gap-1.5 rounded-full bg-ink/5 py-1 pl-1.5 pr-2.5 font-mono text-[11px] ring-1 ring-inset ring-ink/10"
                  title={strings.hero.intlTitle}
                >
                  <img src="/logos/uk-flag.svg" alt="" className="h-3.5 w-auto rounded-[1px]" />
                  {strings.hero.intlLabel}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

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
          <p className="mt-1.5 text-xs underline italic text-slate">{item.objective}</p>
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

const CASE_EXPAND_EVENT = "cc:expand";

function CaseCard({ item, strings }: { item: CaseStudy; strings: UIStrings }) {
  const matrixAxes = useMatrixAxes(strings);
  const [expanded, setExpanded] = useState(!!item.flagship);
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (location.hash === `#${item.id}`) setExpanded(true);
    const el = ref.current;
    const onExpand = () => setExpanded(true);
    el?.addEventListener(CASE_EXPAND_EVENT, onExpand);
    return () => el?.removeEventListener(CASE_EXPAND_EVENT, onExpand);
  }, [item.id]);

  const toggleExpand = () => {
    // A click that ends a text-selection drag shouldn't also toggle — bail
    // if the user is mid-selection anywhere on the page.
    if (window.getSelection()?.toString()) return;
    setExpanded((v) => {
      if (!v) trackEvent("case_expanded", { case: item.id });
      return !v;
    });
  };

  return (
    <article
      ref={ref}
      id={item.id}
      className="group relative overflow-hidden rounded-[min(1vw,14px)] bg-gradient-to-b from-white/85 to-white/55 ring-1 ring-ink/15 backdrop-blur-xl prism-edge transition-transform hover:-translate-y-1"
    >
      <div className="spectrum h-1 w-full opacity-80" />
      <div className="p-7">
        <div onClick={toggleExpand} className="cursor-pointer">
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
            <div className="flex flex-1 items-start gap-3.5">
              <CaseIcon id={item.id} />
              <h3 className="min-w-0 font-display text-2xl font-semibold leading-tight tracking-tight text-balance">
                {item.title}
              </h3>
            </div>
            {item.glossary ? (
              <Popover
                onOpenChange={(next) => {
                  if (next) trackEvent("popover_opened", { glossary_for: item.id });
                }}
              >
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    onClick={(e) => e.stopPropagation()}
                    className="mt-1 grid size-6 shrink-0 place-items-center rounded-full text-slate ring-1 ring-ink/15 transition-colors hover:text-ink hover:ring-ink/30"
                    aria-label={strings.caseCard.glossaryAria}
                    title={strings.caseCard.glossaryAria}
                  >
                    <Languages className="size-3.5" strokeWidth={2} />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  side="left"
                  align="start"
                  collisionPadding={16}
                  className="w-[min(18rem,calc(100vw-2rem))]"
                >
                  <div className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate">
                    {strings.caseCard.glossaryHeading}
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
        </div>
        <div
          className={`mt-4 border-l-4 bg-ink/[0.04] py-2.5 pl-4 sm:max-w-prose ${
            accentBorder[caseColor(item.id)]
          }`}
        >
          <p className="text-sm text-pretty text-slate">{item.need}</p>
          {item.needObjective ? (
            <p className="mt-1.5 text-xs italic text-slate">{item.needObjective}</p>
          ) : null}
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {item.hashtags.map((h) => (
              <span
                key={h}
                className="rounded-full bg-violet/10 px-2.5 py-1 font-mono text-xs text-violet ring-1 ring-inset ring-violet/25"
              >
                #{h.replace(/\s+/g, "-")}
              </span>
            ))}
          </div>
          {item.logos ? (
            <div className="flex w-full items-center justify-center gap-4 sm:w-auto sm:shrink-0 sm:justify-start sm:gap-5">
              {item.logos.map((src) => (
                <img
                  key={src}
                  src={src}
                  alt=""
                  className={
                    src.includes("salesforce") ? "h-9 w-auto sm:h-12" : "h-6 w-auto sm:h-8"
                  }
                />
              ))}
            </div>
          ) : null}
        </div>
        <button
          type="button"
          onClick={toggleExpand}
          className="mx-auto mt-5 flex w-fit cursor-pointer items-center gap-1.5 rounded-full bg-white px-4 py-2 font-mono text-[11px] font-medium text-cyan shadow-[0_6px_16px_-6px_rgba(16,19,26,0.25)] ring-1 ring-ink/10 transition-colors hover:text-ink"
        >
          {expanded ? strings.caseCard.collapse : strings.caseCard.expand}
          {expanded ? (
            <ChevronUp className="size-3.5" strokeWidth={2.5} />
          ) : (
            <ChevronDown
              className={`size-3.5 ${reducedMotion ? "" : "chevron-nudge"}`}
              strokeWidth={2.5}
            />
          )}
        </button>
        <div className={expanded ? "" : "hidden"}>
          {item.highlightGroups ? (
            <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-slate">
                  {strings.matrixAxes.functional}
                </div>
                <ul className="mt-2.5 space-y-2.5">
                  {item.highlightGroups.functional.map((h, i) => (
                    <HighlightItem key={typeof h === "string" ? h : (h.text ?? i)} item={h} />
                  ))}
                </ul>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-slate">
                  {strings.matrixAxes.technical}
                </div>
                <ul className="mt-2.5 space-y-2.5">
                  {item.highlightGroups.technical.map((h, i) => (
                    <HighlightItem key={typeof h === "string" ? h : (h.text ?? i)} item={h} />
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <ul
              className={`mt-6 space-y-2.5 ${
                item.highlights.length > 4 ? "sm:columns-2 sm:gap-8 sm:space-y-0" : ""
              }`}
            >
              {item.highlights.map((h, i) => (
                <HighlightItem key={typeof h === "string" ? h : (h.text ?? i)} item={h} />
              ))}
            </ul>
          )}
          {item.scope ? (
            <div className="mt-5 border-l-2 border-violet/40 pl-3">
              <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-slate">
                {item.scope.label}
              </div>
              <p className="mt-1 text-sm text-pretty text-slate">{item.scope.body}</p>
            </div>
          ) : null}

          <div className="mt-6 font-mono text-[10px] uppercase tracking-[0.1em] text-slate">
            {strings.caseCard.interventionFields}
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
                  {item.matrix[axis.key as keyof typeof item.matrix].map((v) => (
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
      </div>
    </article>
  );
}

function CaseToc({ content, strings }: { content: PortfolioContent; strings: UIStrings }) {
  const { cases } = content;
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
  }, [cases]);

  return (
    // top offsets by half the list's own rendered height (10 items, measured
    // ~298px) so the box is genuinely centered in the viewport via `top`
    // itself — a transform-based translateY(-50%) paints outside the sticky
    // containment box and can rise above the section's top bound; `top`
    // participates in that bound correctly. Re-measure this if the number of
    // cases changes enough to shift the list's height noticeably.
    <nav
      aria-label={strings.caseToc.ariaLabel}
      className="sticky top-[calc(50%-9.3rem)] hidden max-h-[70vh] w-44 shrink-0 flex-col gap-0.5 overflow-y-auto lg:flex"
    >
      {cases.map((c) => {
        const conf = caseIcons[c.id];
        const active = c.id === activeId;
        return (
          <a
            key={c.id}
            href={`#${c.id}`}
            title={c.title}
            onClick={(e) => {
              e.preventDefault();
              trackEvent("toc_click", { case: c.id });
              scrollToCase(c.id);
            }}
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

function Work({ content, strings }: { content: PortfolioContent; strings: UIStrings }) {
  const { cases } = content;
  return (
    <section id="work" className="border-y border-ink/10 bg-white/40">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-cyan">
              {strings.work.sectionLabel}
            </span>
            {false && (
              <h2 className="mt-3 max-w-[26ch] font-display text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl">
                {strings.work.disabledHeading}
              </h2>
            )}
          </div>
          <span className="font-mono text-xs text-slate">
            {cases.length} {strings.work.missionsSuffix}
          </span>
        </div>
        <div className="lg:flex lg:items-start lg:gap-8">
          <div className="grid grid-cols-1 gap-8 lg:min-w-0 lg:flex-1">
            {cases.map((item) => (
              <CaseCard key={item.id} item={item} strings={strings} />
            ))}
          </div>
          <CaseToc content={content} strings={strings} />
        </div>
      </div>
    </section>
  );
}

function OverviewPanel({
  category,
  popoverSide,
  content,
  strings,
}: {
  category: OverviewCategory;
  popoverSide: "left" | "right";
  content: PortfolioContent;
  strings: UIStrings;
}) {
  const c = overviewColors[category.color];
  const headerRef = useRef<HTMLDivElement>(null);

  // A perfectly regular loop reads as a puzzle to decode ("what's the
  // cycle?") rather than ambient decoration — vary the duration slightly
  // each hover so the rhythm never feels quite the same twice.
  const randomizeDrift = () => {
    if (headerRef.current) {
      headerRef.current.style.animationDuration = `${(2.3 + Math.random() * 1.4).toFixed(2)}s`;
    }
  };

  return (
    <div
      className="group overflow-hidden rounded-[min(1vw,14px)] ring-1 ring-ink/15 backdrop-blur-xl prism-edge"
      onMouseEnter={randomizeDrift}
    >
      <div
        ref={headerRef}
        className={`bg-[length:200%_100%] bg-[position:0%_50%] px-6 py-3 font-mono text-[11px] uppercase tracking-[0.15em] group-hover:animate-[gradientDrift_2.5s_ease-in-out_infinite] ${c.headerBg} ${c.headText}`}
      >
        {category.label}
      </div>
      <div className="bg-gradient-to-b from-white/85 to-white/55 p-6">
        <p className="text-xs text-slate">{category.description}</p>
        <ul className="mt-5">
          {category.buckets.map((b) => (
            <BucketRow
              key={b.label}
              bucket={b}
              category={category}
              colors={c}
              popoverSide={popoverSide}
              content={content}
              strings={strings}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

function BucketRow({
  bucket: b,
  category,
  colors: c,
  popoverSide,
  content,
  strings,
}: {
  bucket: OverviewBucket;
  category: OverviewCategory;
  colors: (typeof overviewColors)[keyof typeof overviewColors];
  popoverSide: "left" | "right";
  content: PortfolioContent;
  strings: UIStrings;
}) {
  const { cases, sideProjects } = content;
  const hasRing = b.caseIds.length >= 3;
  const [open, setOpen] = useState(false);

  return (
    <li className="flex items-center justify-between gap-3 border-t border-ink/10 py-2.5 first:border-t-0 first:pt-0">
      <span
        className={`flex items-center gap-1.5 text-sm ${open ? `font-semibold ${c.text}` : ""}`}
      >
        {open ? (
          <span className={`size-1.5 shrink-0 rounded-full ${iconBadgeBg[category.color]}`} />
        ) : null}
        {b.label}
      </span>
      <Popover
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (next) trackEvent("popover_opened", { bucket: b.label, category: category.key });
        }}
      >
        <PopoverTrigger asChild>
          <button
            type="button"
            className={`inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-full px-2.5 py-1 font-mono text-[11px] ring-1 ring-inset transition-colors hover:brightness-95 ${c.bg} ${c.text} ${c.ring}`}
          >
            {b.caseIds.length}
            <ArrowUpRight className="size-3" strokeWidth={2.5} />
          </button>
        </PopoverTrigger>
        <PopoverContent
          side={popoverSide}
          align="center"
          collisionPadding={16}
          className="w-[min(20rem,calc(100vw-2rem))]"
        >
          <PopoverArrow className="fill-popover" stroke="var(--line)" strokeWidth={1} />
          <div
            className={`flex items-center gap-1.5 font-mono text-[11px] whitespace-nowrap uppercase tracking-[0.15em] ${hasRing ? `font-semibold ${c.text}` : "text-slate"}`}
          >
            {hasRing ? (
              <span className={`size-1.5 shrink-0 rounded-full ${iconBadgeBg[category.color]}`} />
            ) : null}
            {b.label}
          </div>
          {hasRing ? (
            <div className="mt-3">
              <SkillRing
                hubClassName={c.head}
                onSelect={scrollToCase}
                items={b.caseIds.flatMap((id) => {
                  const item = cases.find((x) => x.id === id);
                  const project = sideProjects.find((x) => x.id === id);
                  const title = item?.title ?? project?.name;
                  if (!title) return [];
                  return [
                    {
                      id,
                      title,
                      color: ringColorVar[caseColor(id)],
                      node: <CaseIcon id={id} size="sm" />,
                    },
                  ];
                })}
              />
            </div>
          ) : null}
          <TooltipProvider delayDuration={200}>
            <ul className="-mx-1 mt-3">
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
                          scrollToCase(id);
                        }}
                        className="flex items-center gap-2.5 rounded-md px-1 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-ink/5"
                      >
                        <CaseIcon id={id} size="sm" />
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="min-w-0 flex-1 truncate text-left">{title}</span>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">{title}</TooltipContent>
                        </Tooltip>
                        {project ? (
                          <span className="shrink-0 font-mono text-[10px] font-normal text-slate">
                            {strings.work.sideProjectSuffix}
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
  );
}

function Overview({ content, strings }: { content: PortfolioContent; strings: UIStrings }) {
  const { cases, overview } = content;
  return (
    <section id="map" className="mx-auto max-w-6xl px-6 py-16">
      <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-cyan">
        {strings.overview.sectionLabel}
      </span>
      <h2 className="mt-3 max-w-[35ch] font-display text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl">
        {strings.overview.heading(cases.length)}
      </h2>
      <p className="mt-3 max-w-prose text-sm text-pretty text-slate">
        {strings.overview.description}
      </p>
      <div className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
        {overview.map((category, i) => (
          <OverviewPanel
            key={category.key}
            category={category}
            popoverSide={i % 2 === 0 ? "right" : "left"}
            content={content}
            strings={strings}
          />
        ))}
      </div>
    </section>
  );
}

function Process({ content, strings }: { content: PortfolioContent; strings: UIStrings }) {
  const { capabilities } = content;
  return (
    <section id="process" className="mx-auto max-w-6xl px-6 py-16">
      <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-cyan">
        {strings.process.sectionLabel}
      </span>
      <h2 className="mt-3 max-w-[35ch] font-display text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl">
        {strings.process.heading}
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

function SideBusiness({ content, strings }: { content: PortfolioContent; strings: UIStrings }) {
  const { sideProjects } = content;
  return (
    <section id="lab" className="mx-auto max-w-6xl px-6 pb-16">
      <div className="relative overflow-hidden rounded-[min(1vw,16px)] bg-ink p-8 text-white ring-1 ring-ink/10 prism-edge sm:p-10">
        <div className="spectrum absolute inset-x-0 top-0 h-1 opacity-90" />
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-white/60">
          <span className="size-1.5 rounded-full bg-cyan" /> {strings.sideBusiness.sectionLabel}
        </div>
        <div className="mt-5 inline-flex rounded-md bg-white px-4 py-2.5">
          <img src="/logos/nocodext.png" alt="nocodext.studio" className="h-7 w-auto sm:h-8" />
        </div>
        <p className="mt-3 max-w-[58ch] text-sm text-pretty text-white/70">
          {strings.sideBusiness.intro}
        </p>
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
          {sideProjects.map((p) => (
            <div
              key={p.id}
              id={p.id}
              className="rounded-[min(1vw,14px)] bg-white/5 p-6 ring-1 ring-white/10"
            >
              <div className="font-mono text-[11px] text-white/50">
                {p.index} {strings.sideBusiness.productSuffix}
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <h3 className="font-display text-xl font-semibold">
                  {p.url ? (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 transition-colors hover:text-cyan"
                    >
                      {p.name}
                      <ExternalLink className="size-3.5 shrink-0" strokeWidth={2} />
                    </a>
                  ) : (
                    p.name
                  )}
                </h3>
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
                {p.bullets.map((b, i) => (
                  <li
                    key={typeof b === "string" ? b : i}
                    className="flex gap-2.5 text-sm text-white/80"
                  >
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cyan" />
                    <span className="text-pretty">
                      {typeof b === "string" ? (
                        b
                      ) : (
                        <>
                          {b.before}
                          <img
                            src={b.logo}
                            alt=""
                            className="inline h-4 w-auto rounded-sm bg-white px-1 align-text-bottom"
                          />
                          {b.after}
                        </>
                      )}
                    </span>
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
                    {strings.sideBusiness.llmsUsed}
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

function Contact({ content, strings }: { content: PortfolioContent; strings: UIStrings }) {
  const { profile } = content;
  return (
    <section id="contact" className="mx-auto max-w-6xl px-6 pb-20">
      <div className="rounded-[min(1vw,16px)] bg-gradient-to-b from-white/85 to-white/55 p-8 ring-1 ring-ink/15 backdrop-blur-xl prism-edge sm:p-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-cyan">
              {strings.contact.sectionLabel}
            </span>
            <h2 className="mt-4 max-w-[20ch] font-display text-4xl font-bold leading-[1.05] tracking-tight text-balance sm:text-5xl">
              {strings.contact.heading}
            </h2>
            <p className="mt-4 max-w-[44ch] text-sm text-pretty text-slate sm:text-base">
              {strings.contact.body}
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <ContactEmail
              user={profile.emailUser}
              domain={profile.emailDomain}
              placeholder={strings.contact.emailPlaceholder}
              copiedMessage={strings.contact.copiedToClipboard}
              className="rounded-md bg-gradient-to-r from-violet to-blue px-6 py-4 text-center text-lg font-semibold text-white shadow-[0_8px_20px_-8px_var(--violet)] ring-1 ring-inset ring-white/10 transition-transform hover:-translate-y-0.5"
            />
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

export function PortfolioPage({
  content,
  strings,
}: {
  content: PortfolioContent;
  strings: UIStrings;
}) {
  useEffect(() => {
    if (location.hash) scrollToCase(location.hash.slice(1));
  }, []);

  useEffect(() => {
    const sectionIds = ["top", "work", "map", "process", "lab", "contact"];
    const seen = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !seen.has(entry.target.id)) {
            seen.add(entry.target.id);
            trackEvent("section_viewed", { section: entry.target.id });
          }
        });
      },
      { threshold: 0.4 },
    );
    const els = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="min-h-screen bg-ground font-sans text-ink antialiased selection:bg-cyan/20">
      <Nav content={content} strings={strings} />
      <Hero content={content} strings={strings} />
      <Work content={content} strings={strings} />
      <Overview content={content} strings={strings} />
      <Process content={content} strings={strings} />
      <SideBusiness content={content} strings={strings} />
      <Contact content={content} strings={strings} />
    </main>
  );
}
