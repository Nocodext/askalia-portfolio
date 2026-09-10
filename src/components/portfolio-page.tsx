import { useEffect, useId, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import type {
  Bullet,
  CaseStudy,
  Highlight,
  OverviewBucket,
  OverviewCategory,
  PortfolioContent,
  Recommendation,
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
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
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
  Camera,
  Tags,
  ExternalLink,
  Images,
  ArrowLeft,
  Briefcase,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Languages,
  Download,
  Quote,
  BadgeCheck,
  Radar,
  Play,
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
  "ats-youtubers": {
    image: "https://cdn.jsdelivr.net/npm/simple-icons@16.30.0/icons/youtube.svg",
  },
  "sftp-photographe": { icon: Camera, color: "blue" },
  "veille-tarifaire": { icon: Tags, color: "violet", flip: true },
  "multidiffusion-france-travail": { icon: Briefcase, color: "blue" },
  "discovery-hub": { icon: Radar, color: "amber" },
  "assistant-redaction": { icon: Languages, color: "cyan" },
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
    // viewport's height - scale it down below the `md` nav-collapse breakpoint.
    const offset = window.innerWidth < 768 ? 128 : 168;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "instant" });
  }
  history.replaceState(null, "", `#${id}`);
}

function scrollToRecommendation(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  const ring = ["ring-2", "ring-cyan", "ring-offset-2", "ring-offset-white"];
  el.classList.add(...ring, "reco-active");

  // Dim every other card on the board for a moment so the target one reads
  // as spotlighted rather than merely ringed. The fade itself is a plain
  // CSS class (see styles.css) — this just flags who's active/inactive.
  const board = document.getElementById("recommendations");
  const others = board
    ? Array.from(board.querySelectorAll<HTMLElement>("[id^='rec-']")).filter((node) => node.id !== id)
    : [];
  others.forEach((node) => node.classList.add("reco-inactive"));

  window.setTimeout(() => {
    el.classList.remove(...ring, "reco-active");
    others.forEach((node) => node.classList.remove("reco-inactive"));
  }, 5000);
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
    headerBg: "bg-[linear-gradient(90deg,var(--amber),color-mix(in_oklch,var(--amber),white_40%))]",
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
  // cursor position - following the cursor read as a tracker trail, not a
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
            <span className="flex flex-col leading-tight">
              <span className="font-display text-s font-semibold tracking-tight">
                {profile.firstName} {profile.lastName}
              </span>
              <span className="font-mono text-[11px] font-medium text-ink/60">{profile.role}</span>
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
              href="#recommendations"
              onClick={(e) => {
                e.preventDefault();
                scrollToCase("recommendations");
              }}
              onMouseEnter={focusGlow}
              className="relative flex items-center transition-colors hover:text-ink"
            >
              {strings.nav.recommendations}
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
          [01] A propos
        </span>
        <span className="h-px flex-1 bg-line" />
        <span className="font-mono text-[11px] text-slate">{profile.location}</span>
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <blockquote className="reveal d1 relative mb-8 rounded-r-xl border-l-4 border-violet bg-violet/5 py-5 pr-5 pl-6">
            <Quote
              className="absolute top-3 right-4 size-8 text-violet/15"
              strokeWidth={2}
              fill="currentColor"
            />
            <p className="relative font-display text-lg font-bold tracking-tight text-ink sm:text-xl">
              {profile.role}
            </p>
            <p className="relative mt-2 max-w-[52ch] text-sm text-pretty text-ink/80 sm:text-base">
              {strings.hero.titleExplainer}
            </p>
          </blockquote>
          <h1 className="reveal d1 max-w-[18ch] font-hero text-5xl font-bold leading-[1.02] tracking-tight text-balance sm:text-6xl lg:text-7xl">
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
      <li className="flex gap-3 text-[0.9em] text-pretty sm:break-inside-avoid sm:pb-2.5">
        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cyan" />
        <span>{item}</span>
      </li>
    );
  }
  return (
    <li className="flex gap-3 text-[0.9em] text-pretty sm:break-inside-avoid sm:pb-2.5">
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

function CaseCard({
  item,
  strings,
  recommendations,
}: {
  item: CaseStudy;
  strings: UIStrings;
  recommendations: Recommendation[];
}) {
  const linkedRecommendation = recommendations.find((r) => r.linkedCaseId === item.id);
  const matrixAxes = useMatrixAxes(strings);
  const [expanded, setExpanded] = useState(!!item.flagship);
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [photosApi, setPhotosApi] = useState<CarouselApi | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const hasTrackedPhotoNav = useRef(false);
  const carouselRootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!photosApi) return;
    if (selectedPhoto !== null) {
      photosApi.scrollTo(selectedPhoto, true);
      // The clicked thumbnail unmounts when switching to detail view, so
      // focus would otherwise fall back to the dialog root - pull it onto
      // the carousel itself so its built-in arrow-key handling works.
      carouselRootRef.current?.focus();
    }
    const onSelect = () => {
      if (hasTrackedPhotoNav.current) return;
      hasTrackedPhotoNav.current = true;
      trackEvent("case_photos_navigated", { case: item.id });
    };
    photosApi.on("select", onSelect);
    return () => {
      photosApi.off("select", onSelect);
    };
  }, [photosApi, selectedPhoto, item.id]);

  useEffect(() => {
    if (location.hash === `#${item.id}`) setExpanded(true);
    const el = ref.current;
    const onExpand = () => setExpanded(true);
    el?.addEventListener(CASE_EXPAND_EVENT, onExpand);
    return () => el?.removeEventListener(CASE_EXPAND_EVENT, onExpand);
  }, [item.id]);

  // A click that ends a text-selection drag shouldn't also toggle. Checking
  // for *any* selection on the page was too broad - leftover text selected
  // anywhere earlier (e.g. copying a paragraph, an accidental double-click)
  // silently disabled every "Voir le détail" button until the user clicked
  // to clear it. Track the actual mousedown/click positions on this element
  // instead, so only a real drag on THIS control suppresses the toggle.
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const onToggleMouseDown = (e: React.MouseEvent) => {
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };
  const toggleExpand = (e: React.MouseEvent) => {
    const start = dragStartRef.current;
    dragStartRef.current = null;
    if (start && (Math.abs(e.clientX - start.x) > 5 || Math.abs(e.clientY - start.y) > 5)) {
      return;
    }
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
        <div onMouseDown={onToggleMouseDown} onClick={toggleExpand} className="cursor-pointer">
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
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-stretch">
          <div
            className={`flex-1 border-l-4 bg-ink/[0.04] py-2.5 pl-4 sm:max-w-prose ${
              accentBorder[caseColor(item.id)]
            }`}
          >
            <p className="text-sm text-pretty text-slate">{item.need}</p>
            {item.needObjective ? (
              <p className="mt-1.5 text-xs italic text-slate">{item.needObjective}</p>
            ) : null}
          </div>
          {item.calloutImage ? (
            <img
              src={item.calloutImage}
              alt=""
              className="h-auto w-full max-w-[220px] shrink-0 self-center rounded-md object-contain sm:self-stretch"
            />
          ) : null}
        </div>
        {item.ecosystem && item.ecosystem.length > 0 ? (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="shrink-0 font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-violet">
              {strings.caseCard.positioningLabel}
            </span>
            {item.ecosystem.map((e) => (
              <span
                key={e.name}
                className="flex items-center gap-1.5 rounded-full bg-ink/5 px-2.5 py-1 font-mono text-xs text-ink ring-1 ring-inset ring-ink/10"
              >
                {e.logo ? (
                  <img src={e.logo} alt="" className="size-3.5 shrink-0 rounded-sm object-contain" />
                ) : null}
                {e.name}
              </span>
            ))}
          </div>
        ) : null}
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
          onMouseDown={onToggleMouseDown}
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
          {item.photos ? (
            <Dialog
              onOpenChange={(open) => {
                hasTrackedPhotoNav.current = false;
                // Skip straight to fullscreen when there's nothing to pick from.
                setSelectedPhoto(item.photos!.length === 1 ? 0 : null);
                if (open) trackEvent("case_photos_opened", { case: item.id });
              }}
            >
              <DialogTrigger asChild>
                <button
                  type="button"
                  onClick={(e) => e.stopPropagation()}
                  className="mt-5 flex cursor-pointer items-center gap-1.5 rounded-full bg-ink/5 px-3 py-1.5 font-mono text-[11px] font-medium text-ink ring-1 ring-inset ring-ink/10 transition-colors hover:bg-ink/10"
                >
                  <Images className="size-3.5" strokeWidth={2} />
                  {strings.caseCard.viewPhotos}
                </button>
              </DialogTrigger>
              <DialogContent
                className="w-fit max-w-[92vw] overflow-hidden border-none bg-transparent p-0 shadow-none sm:max-w-[92vw]"
                onEscapeKeyDown={(e) => {
                  if (selectedPhoto !== null) {
                    e.preventDefault();
                    setSelectedPhoto(null);
                  }
                }}
              >
                <DialogTitle className="sr-only">{strings.caseCard.viewPhotos}</DialogTitle>
                {selectedPhoto === null ? (
                  <div
                    className="mx-auto grid max-h-[85vh] w-fit max-w-[92vw] justify-center gap-3 overflow-y-auto rounded-lg bg-white p-4"
                    style={{ gridTemplateColumns: "repeat(auto-fit, 160px)" }}
                  >
                    {item.photos.map((p, i) => {
                      const isVideo = "youtubeId" in p;
                      return (
                        <button
                          key={isVideo ? p.youtubeId : p.src}
                          type="button"
                          onClick={() => setSelectedPhoto(i)}
                          className="relative size-40 cursor-pointer overflow-hidden rounded-md bg-ink/5 ring-2 ring-ink/15 transition-all duration-300 ease-out hover:z-10 hover:scale-110 hover:ring-violet"
                        >
                          <img
                            src={isVideo ? `https://i.ytimg.com/vi/${p.youtubeId}/hqdefault.jpg` : p.src}
                            alt={isVideo ? p.title : p.alt}
                            className="size-full object-cover"
                          />
                          {isVideo ? (
                            <span className="absolute inset-0 flex items-center justify-center bg-ink/25">
                              <span className="flex size-10 items-center justify-center rounded-full bg-white/90 shadow-md">
                                <Play className="ml-0.5 size-4 fill-ink text-ink" strokeWidth={0} />
                              </span>
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="relative mx-auto w-full max-w-6xl">
                    <button
                      type="button"
                      onClick={() => setSelectedPhoto(null)}
                      className="absolute top-2 left-2 z-10 flex cursor-pointer items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 font-mono text-[11px] font-medium text-ink shadow-md transition-colors hover:bg-white"
                    >
                      <ArrowLeft className="size-3.5" strokeWidth={2} />
                      {strings.caseCard.backToGallery}
                    </button>
                    <Carousel
                      ref={carouselRootRef}
                      setApi={setPhotosApi}
                      tabIndex={-1}
                      className="w-full outline-none"
                    >
                      <CarouselContent>
                        {item.photos.map((p) => {
                          const isVideo = "youtubeId" in p;
                          return (
                            <CarouselItem
                              key={isVideo ? p.youtubeId : p.src}
                              className="flex items-center justify-center"
                            >
                              {isVideo ? (
                                <iframe
                                  src={`https://www.youtube-nocookie.com/embed/${p.youtubeId}`}
                                  title={p.title}
                                  className="aspect-video w-full max-h-[85vh] rounded-lg"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                  allowFullScreen
                                  loading="lazy"
                                />
                              ) : (
                                <img
                                  src={p.src}
                                  alt={p.alt}
                                  className="max-h-[85vh] w-full rounded-lg object-contain"
                                />
                              )}
                            </CarouselItem>
                          );
                        })}
                      </CarouselContent>
                      <CarouselPrevious className="left-2" />
                      <CarouselNext className="right-2" />
                    </Carousel>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          ) : null}
          {item.liveDemo ? (
            <Dialog
              onOpenChange={(open) =>
                open && trackEvent("case_live_demo_opened", { case: item.id })
              }
            >
              <DialogTrigger asChild>
                <button
                  type="button"
                  onClick={(e) => e.stopPropagation()}
                  className="mt-5 ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-ink/5 px-3 py-1.5 font-mono text-[11px] font-medium text-ink ring-1 ring-inset ring-ink/10 transition-colors hover:bg-ink/10"
                >
                  <ExternalLink className="size-3.5" strokeWidth={2} />
                  {strings.caseCard.viewLiveDemo}
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-[92vw] overflow-hidden rounded-lg border-none bg-white p-0 shadow-2xl sm:max-w-[92vw] lg:max-w-5xl">
                <DialogTitle className="sr-only">{strings.caseCard.viewLiveDemo}</DialogTitle>
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  src={item.liveDemo.previewVideo}
                  className="block max-h-[80vh] w-full object-contain"
                />
                <div className="flex items-center justify-end gap-2 border-t border-ink/10 p-3">
                  <a
                    href={item.liveDemo.blogHref}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[11px] font-medium text-ink ring-1 ring-inset ring-ink/10 transition-colors hover:bg-ink/5"
                  >
                    {strings.caseCard.seeBlog}
                  </a>
                  <a
                    href={item.liveDemo.demoHref}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 font-mono text-[11px] font-medium text-white transition-colors hover:bg-ink/90"
                  >
                    {strings.caseCard.seeDemo}
                    <ArrowUpRight className="size-3.5" strokeWidth={2} />
                  </a>
                </div>
              </DialogContent>
            </Dialog>
          ) : null}
          {linkedRecommendation ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                scrollToRecommendation(linkedRecommendation.id);
              }}
              className="mt-5 ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-ink/5 px-3 py-1.5 font-mono text-[11px] font-medium text-ink ring-1 ring-inset ring-ink/10 transition-colors hover:bg-ink/10"
            >
              <Quote className="size-3.5" strokeWidth={2} fill="currentColor" />
              {strings.caseCard.seeTestimonial}
            </button>
          ) : null}
          {item.challenges ? (
            <div className="mt-5">
              <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-slate">
                {strings.caseCard.challengesLabel}
              </div>
              <ul className="mt-2.5 space-y-3">
                {item.challenges.map((pair) => (
                  <li key={pair.constraint} className="border-l-2 border-amber/40 pl-3">
                    <p className="text-sm text-pretty text-slate">{pair.constraint}</p>
                    <p className="mt-1 text-base text-pretty">{pair.response}</p>
                  </li>
                ))}
              </ul>
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
                      className={`rounded px-2 py-1 text-[13px] ring-1 ring-inset ${axis.bg} ${axis.color} ${axis.ring}`}
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
            <div className="mt-2 flex flex-wrap gap-2 font-mono text-xs">
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
              <div className="mt-2 flex flex-wrap gap-2 font-mono text-xs">
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
    // itself - a transform-based translateY(-50%) paints outside the sticky
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
              <CaseCard
                key={item.id}
                item={item}
                strings={strings}
                recommendations={content.recommendations}
              />
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
  // cycle?") rather than ambient decoration - vary the duration slightly
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
      <h2 className="mt-3 max-w-[40ch] font-display text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl">
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
      <h2 className="mt-3 max-w-[40ch] font-display text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl">
        {strings.process.heading}
      </h2>
      <p className="mt-4 max-w-[62ch] text-sm text-pretty text-slate sm:text-base">
        {strings.process.intro}
      </p>
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

// Deterministic per-card tilt (a stable hash of the id, not Math.random) -
// this page prerenders to static HTML, so a truly random value would pick a
// different tilt on the server than on the client and desync at hydration.
function tiltForId(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  const t = (((hash % 1000) + 1000) % 1000) / 1000; // 0..1, stable
  return -2.5 + t * 5; // spread across -2.5..2.5deg
}

function RecommendationPin() {
  const uid = useId();
  const headGrad = `pin-head-${uid}`;
  const needleGrad = `pin-needle-${uid}`;
  return (
    <span className="absolute top-0 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        className="rotate-[18deg] drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]"
      >
        <defs>
          <linearGradient id={headGrad} x1="15%" y1="10%" x2="85%" y2="95%">
            <stop offset="0%" stopColor="#fca5a5" />
            <stop offset="45%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#7f1d1d" />
          </linearGradient>
          <linearGradient id={needleGrad} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f4f4f5" />
            <stop offset="50%" stopColor="#a1a1aa" />
            <stop offset="100%" stopColor="#52525b" />
          </linearGradient>
        </defs>
        {/* needle, straight down in local coords - the group rotation gives it the jaunty lean */}
        <path d="M11.3 13.2 L12.7 13.2 L12 22.5 Z" fill={`url(#${needleGrad})`} />
        {/* neck, tapering from the head down to the needle */}
        <path d="M8.4 9.3 L15.6 9.3 L13.1 13.6 L10.9 13.6 Z" fill={`url(#${headGrad})`} />
        {/* domed head */}
        <ellipse cx="12" cy="6.8" rx="6" ry="5.3" fill={`url(#${headGrad})`} />
        {/* gloss highlight, off-center for a 3D sheen */}
        <ellipse cx="9.6" cy="4.5" rx="1.8" ry="1.05" fill="#fff" opacity="0.55" />
      </svg>
    </span>
  );
}

function RecommendationCard({
  rec,
  strings,
  expanded = false,
  onOpen,
  onClose,
}: {
  rec: Recommendation;
  strings: UIStrings;
  expanded?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}) {
  const stopThenAct = (fn: () => void) => (e: React.MouseEvent) => {
    e.stopPropagation();
    fn();
  };

  return (
    <div
      id={expanded ? undefined : rec.id}
      onClick={expanded ? onClose : onOpen}
      className={
        expanded
          ? "relative w-full max-w-md rounded-[min(1vw,10px)] bg-[#FFF6D8] p-7 pt-9 shadow-2xl ring-1 ring-black/10"
          : "relative scroll-mt-24 cursor-pointer rounded-[min(1vw,10px)] bg-[#FFF6D8] p-6 pt-8 shadow-md ring-1 ring-black/5 transition-shadow duration-300 hover:shadow-[0_18px_30px_-12px_rgba(58,33,15,0.45)]"
      }
    >
      <div className="relative flex h-8 items-center justify-end">
        <RecommendationPin />
        <Quote className="size-8 text-ink/10" strokeWidth={2} fill="currentColor" />
      </div>
      <p className="mt-2 text-sm text-pretty text-slate sm:text-base">{rec.quote}</p>
      <div className="mt-5 flex items-center justify-between gap-3 border-t border-dashed border-ink/15 pt-4">
        <div className="flex min-w-0 items-center gap-3">
          <img
            src={rec.photo}
            alt=""
            className="size-10 shrink-0 rounded-full object-cover ring-1 ring-ink/10"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="truncate text-sm font-semibold text-ink">{rec.name}</span>
              {rec.verified ? (
                <BadgeCheck
                  className="size-3.5 shrink-0 text-blue"
                  strokeWidth={2}
                  aria-label="LinkedIn verified"
                />
              ) : null}
            </div>
            <p className="mt-0.5 truncate text-xs text-slate">{rec.role}</p>
            <p className="mt-1 font-mono text-[10px] text-slate/70">{rec.relationship}</p>
          </div>
        </div>
        <a
          href={rec.linkedinUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn"
          onClick={(e) => e.stopPropagation()}
          className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#007EBB] transition-opacity hover:opacity-80"
        >
          <img src="/logos/side/linkedin-icon.svg" alt="" className="size-5 rounded-full" />
        </a>
      </div>
      {rec.linkedCaseId ? (
        <button
          type="button"
          onClick={stopThenAct(() => scrollToCase(rec.linkedCaseId!))}
          className="mt-4 flex w-fit cursor-pointer items-center gap-1.5 rounded-full bg-ink/5 px-3 py-1.5 font-mono text-[11px] font-medium text-ink ring-1 ring-inset ring-ink/10 transition-colors hover:bg-ink/10"
        >
          <ArrowUpRight className="size-3.5" strokeWidth={2} />
          {strings.recommendations.seeLinkedCase}
        </button>
      ) : null}
    </div>
  );
}

function RecommendationCtaCard({
  strings,
  profile,
}: {
  strings: UIStrings;
  profile: PortfolioContent["profile"];
}) {
  return (
    <div
      style={{ transform: `rotate(${tiltForId("cta-card")}deg)` }}
      className="scroll-fade mb-7 inline-block w-full break-inside-avoid"
    >
      <div className="relative flex flex-col items-center gap-4 rounded-[min(1vw,10px)] border-2 border-dashed border-ink/20 bg-[#FBE49A] p-7 pt-9 text-center shadow-md ring-1 ring-black/5 transition-shadow duration-300 hover:shadow-[0_18px_30px_-12px_rgba(58,33,15,0.45)]">
        <div className="relative flex h-8 w-full items-center justify-end">
          <RecommendationPin />
          <span className="text-3xl opacity-70" aria-hidden="true">
            😉
          </span>
        </div>
        <p className="max-w-[24ch] font-display text-lg font-semibold text-balance text-ink">
          {strings.recommendations.ctaText}
        </p>
        <ContactEmail
          user={profile.emailUser}
          domain={profile.emailDomain}
          placeholder={strings.contact.emailPlaceholder}
          copiedMessage={strings.contact.copiedToClipboard}
          className="rounded-md bg-gradient-to-r from-violet to-blue px-4 py-2 text-center font-mono text-[11px] font-medium text-white shadow-[0_6px_14px_-6px_var(--violet)] ring-1 ring-inset ring-white/10 transition-transform hover:-translate-y-0.5"
        />
      </div>
    </div>
  );
}

function Recommendations({ content, strings }: { content: PortfolioContent; strings: UIStrings }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [overlayVisible, setOverlayVisible] = useState(false);

  const openCard = (id: string) => {
    setExpandedId(id);
    requestAnimationFrame(() => requestAnimationFrame(() => setOverlayVisible(true)));
    // Opening a card to read it full-size is a stronger signal than a
    // passing glance at the grid - worth its own event.
    trackEvent("recommendation_opened", { recommendation: id });
  };

  const closeCard = () => {
    setOverlayVisible(false);
    window.setTimeout(() => setExpandedId(null), 300);
  };

  useEffect(() => {
    if (!expandedId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCard();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expandedId]);

  const expandedRec = expandedId
    ? (content.recommendations.find((r) => r.id === expandedId) ?? null)
    : null;

  return (
    <section id="recommendations" className="mx-auto max-w-6xl px-6 pb-16">
      <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-violet">
        <span className="size-1.5 rounded-full bg-violet" /> {strings.recommendations.sectionLabel}
      </div>
      <h2 className="mt-4 max-w-[45ch] font-display text-3xl font-bold leading-[1.1] tracking-tight text-balance sm:text-4xl">
        {strings.recommendations.heading}
      </h2>
      <div className="cork-texture mt-8 rounded-[min(1vw,16px)] p-6 shadow-inner ring-1 ring-black/15 sm:p-8">
        <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
          {content.recommendations.flatMap((rec) => {
            const card = (
              <div
                key={rec.linkedinUrl}
                style={{ transform: `rotate(${tiltForId(rec.id)}deg)` }}
                className="scroll-fade mb-7 inline-block w-full break-inside-avoid"
              >
                <div
                  style={{
                    opacity: expandedId === rec.id ? 0 : 1,
                    transition: "opacity 300ms ease",
                    pointerEvents: expandedId === rec.id ? "none" : undefined,
                  }}
                >
                  <RecommendationCard rec={rec} strings={strings} onOpen={() => openCard(rec.id)} />
                </div>
              </div>
            );
            // The CTA card rides right after Denis's in document order so
            // the column-balancing algorithm lands it directly beneath it,
            // rather than wherever the last column happens to bottom out.
            return rec.id === "rec-denis-ovtchinnikov"
              ? [
                  card,
                  <RecommendationCtaCard key="cta-card" strings={strings} profile={content.profile} />,
                ]
              : [card];
          })}
        </div>
      </div>
      {expandedRec ? (
        <div
          role="dialog"
          aria-modal="true"
          onClick={closeCard}
          className={`fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-6 backdrop-blur-sm transition-opacity duration-300 ${
            overlayVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className={`transition-transform duration-300 ${overlayVisible ? "scale-100" : "scale-95"}`}
          >
            <RecommendationCard rec={expandedRec} strings={strings} expanded onClose={closeCard} />
          </div>
        </div>
      ) : null}
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
          </div>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-ink/10 pt-6 font-mono text-xs text-slate">
          <span>Askalia</span>
          <span>{profile.sideBusinessBrand}</span>
          <a
            href={profile.linkedinUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-ink"
          >
            <span className="flex size-4 items-center justify-center rounded-full bg-[#007EBB]">
              <img src="/logos/side/linkedin-icon.svg" alt="" className="size-3 rounded-full" />
            </span>
            LinkedIn
          </a>
          <span>{profile.location} · CET</span>
        </div>
      </div>
      {false && (
        <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-ink/10 pt-6 font-mono text-[11px] text-slate">
          <span>
            © {new Date().getFullYear()} {profile.firstName} {profile.lastName} - {profile.role}
          </span>
          <span>{profile.tagline}</span>
        </footer>
      )}
    </section>
  );
}

export function PortfolioPage({
  content: rawContent,
  strings,
}: {
  content: PortfolioContent;
  strings: UIStrings;
}) {
  // A single filter point so every section (nav, hero stats, TOC, case
  // list, cartography) agrees on what's published without each one
  // needing to know about the `hidden` flag.
  const content: PortfolioContent = {
    ...rawContent,
    cases: rawContent.cases.filter((c) => !c.hidden),
  };

  useEffect(() => {
    if (location.hash) scrollToCase(location.hash.slice(1));
  }, []);

  useEffect(() => {
    const sectionIds = ["top", "work", "map", "process", "lab", "recommendations", "contact"];
    const seen = new Set<string>();
    // Last section the visitor actually had in view - read on tab-hide/unload
    // to know where in the page they were when they left, not just which
    // sections they passed through.
    const lastSectionRef = { current: "top" };
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          lastSectionRef.current = entry.target.id;
          if (!seen.has(entry.target.id)) {
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

    const onVisibilityChange = () => {
      if (document.visibilityState !== "hidden") return;
      trackEvent("session_exit", {
        last_section: lastSectionRef.current,
        reached_end: seen.has("contact"),
      });
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return (
    <main className="min-h-screen bg-ground font-sans text-ink antialiased selection:bg-cyan/20">
      <Nav content={content} strings={strings} />
      <Hero content={content} strings={strings} />
      <Work content={content} strings={strings} />
      <Overview content={content} strings={strings} />
      <Process content={content} strings={strings} />
      <SideBusiness content={content} strings={strings} />
      <Recommendations content={content} strings={strings} />
      <Contact content={content} strings={strings} />
    </main>
  );
}
