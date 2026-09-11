import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { trackEvent } from "@/lib/analytics";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import type { CaseStudy, Highlight, PortfolioContent, Recommendation } from "@/content/portfolio";
import type { UIStrings } from "@/content/ui-strings";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { CASE_EXPAND_EVENT, openCase, scrollToCase } from "@/lib/case-navigation";
import { scrollToRecommendation } from "@/components/recommendations";
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
  ChevronLeft,
  ChevronRight,
  Languages,
  Quote,
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
  "ats-youtubers": { image: "/logos/side/youtube-icon.svg" },
  "sftp-photographe": { icon: Camera, color: "blue" },
  "veille-tarifaire": { icon: Tags, color: "violet", flip: true },
  "multidiffusion-france-travail": { icon: Briefcase, color: "blue" },
  "discovery-hub": { icon: Radar, color: "amber" },
  "assistant-redaction": { icon: Languages, color: "cyan" },
  nocodext: { image: "/logos/side/bubble-icon.png" },
  breedj: { image: "/logos/side/linkedin-icon.svg" },
  pinnpm: { image: "/logos/side/npm-icon.svg" },
  airtable: { image: "/logos/side/airtable-icon.svg" },
};

export const iconBadgeBg = {
  cyan: "bg-cyan",
  violet: "bg-violet",
  amber: "bg-amber",
  blue: "bg-blue",
  red: "bg-[#FF0000]",
} as const;

export const ringColorVar = {
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

export function caseColor(id: string): "cyan" | "violet" | "amber" | "blue" | "red" {
  const conf = caseIcons[id];
  return conf && "color" in conf ? conf.color : "cyan";
}

export function CaseIcon({ id, size = "lg" }: { id: string; size?: "lg" | "sm" }) {
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

function CaseCard({
  item,
  strings,
  onOpenDetail,
}: {
  item: CaseStudy;
  strings: UIStrings;
  onOpenDetail: (id: string) => void;
}) {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (location.hash === `#${item.id}`) onOpenDetail(item.id);
    const el = ref.current;
    const onExpand = () => onOpenDetail(item.id);
    el?.addEventListener(CASE_EXPAND_EVENT, onExpand);
    return () => el?.removeEventListener(CASE_EXPAND_EVENT, onExpand);
  }, [item.id, onOpenDetail]);

  // A click that ends a text-selection drag shouldn't also open the detail
  // popup. Checking for *any* selection on the page was too broad - leftover
  // text selected anywhere earlier (e.g. copying a paragraph, an accidental
  // double-click) silently disabled every "Voir le détail" trigger until the
  // user clicked to clear it. Track the actual mousedown/click positions on
  // this element instead, so only a real drag on THIS control suppresses it.
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const onToggleMouseDown = (e: React.MouseEvent) => {
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };
  const openDetail = (e: React.MouseEvent) => {
    const start = dragStartRef.current;
    dragStartRef.current = null;
    if (start && (Math.abs(e.clientX - start.x) > 5 || Math.abs(e.clientY - start.y) > 5)) {
      return;
    }
    onOpenDetail(item.id);
    trackEvent("case_expanded", { case: item.id });
  };

  return (
    <article
      ref={ref}
      id={item.id}
      className="group relative overflow-hidden rounded-[min(1vw,14px)] bg-gradient-to-b from-white/85 to-white/55 ring-1 ring-ink/15 backdrop-blur-xl prism-edge transition-transform hover:-translate-y-1"
    >
      <div className="spectrum h-1 w-full opacity-80" />
      <div className="p-7">
        <div onMouseDown={onToggleMouseDown} onClick={openDetail} className="cursor-pointer">
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
                  <img
                    src={e.logo}
                    alt=""
                    className="size-3.5 shrink-0 rounded-sm object-contain"
                  />
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
          onClick={openDetail}
          className="mx-auto mt-5 flex w-fit cursor-pointer items-center gap-1.5 rounded-full bg-white px-4 py-2 font-mono text-[11px] font-medium text-cyan shadow-[0_6px_16px_-6px_rgba(16,19,26,0.25)] ring-1 ring-ink/10 transition-colors hover:text-ink"
        >
          {strings.caseCard.expand}
          <ChevronDown
            className={`size-3.5 ${reducedMotion ? "" : "chevron-nudge"}`}
            strokeWidth={2.5}
          />
        </button>
      </div>
    </article>
  );
}

// Full case detail, shown inside the single shared CaseDetailDialog. Kept as
// its own component (mounted with key={item.id}) so switching cases via
// prev/next remounts it - local UI state (photo carousel position etc.)
// resets automatically instead of leaking between cases, with no need to
// manually reset each piece of state by hand.
function CaseDetailBody({
  item,
  strings,
  recommendations,
  onClose,
}: {
  item: CaseStudy;
  strings: UIStrings;
  recommendations: Recommendation[];
  onClose: () => void;
}) {
  const linkedRecommendation = recommendations.find((r) => r.linkedCaseId === item.id);
  const matrixAxes = useMatrixAxes(strings);
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

  return (
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
        <div className="flex flex-1 items-start gap-3.5">
          <CaseIcon id={item.id} />
          <DialogTitle asChild>
            <h3 className="min-w-0 font-display text-2xl font-semibold leading-tight tracking-tight text-balance">
              {item.title}
            </h3>
          </DialogTitle>
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
                className={src.includes("salesforce") ? "h-9 w-auto sm:h-12" : "h-6 w-auto sm:h-8"}
              />
            ))}
          </div>
        ) : null}
      </div>
      {item.highlightGroups ? (
        <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-slate">
              {strings.caseCard.functionalWork}
            </div>
            <ul className="mt-2.5 space-y-2.5">
              {item.highlightGroups.functional.map((h, i) => (
                <HighlightItem key={typeof h === "string" ? h : (h.text ?? i)} item={h} />
              ))}
            </ul>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-slate">
              {strings.caseCard.technicalWork}
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
                        src={
                          isVideo ? `https://i.ytimg.com/vi/${p.youtubeId}/hqdefault.jpg` : p.src
                        }
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
          onOpenChange={(open) => open && trackEvent("case_live_demo_opened", { case: item.id })}
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
            onClose();
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
  );
}

// One shared dialog for every case's detail view, rendered once (not per
// card). Switching cases only swaps which item it shows - it never closes
// and reopens - so prev/next navigation doesn't cross-fade two separate
// Dialog/Overlay instances into each other, which was the actual source of
// the flicker with the earlier per-card-Dialog approach.
function CaseDetailDialog({
  cases,
  openId,
  onOpenIdChange,
  strings,
  recommendations,
}: {
  cases: CaseStudy[];
  openId: string | null;
  onOpenIdChange: (id: string | null) => void;
  strings: UIStrings;
  recommendations: Recommendation[];
}) {
  const index = openId ? cases.findIndex((c) => c.id === openId) : -1;
  const item = index >= 0 ? cases[index] : null;
  const prevId = item && index > 0 ? cases[index - 1]!.id : undefined;
  const nextId = item && index < cases.length - 1 ? cases[index + 1]!.id : undefined;

  // The scroll container is a single persistent DOM node shared across every
  // case (only its CaseDetailBody child remounts, via `key`), so it keeps
  // whatever scrollTop the previous case was left at unless reset here -
  // navigating to a new case would otherwise silently open it mid-scroll.
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [item?.id]);

  const navigate = useNavigate();
  // See openCase's comment: a raw `history.replaceState` here would leave
  // the router's scroll-restoration watcher free to scroll the newly-shown
  // case's background card into view a moment later, so the hash update has
  // to go through `navigate` with both scroll behaviors turned off.
  const goToCase = (id: string | undefined) => {
    if (!id) return;
    navigate({ hash: id, replace: true, resetScroll: false, hashScrollIntoView: false });
    onOpenIdChange(id);
  };

  return (
    <Dialog
      open={!!item}
      onOpenChange={(open) => {
        if (!open) onOpenIdChange(null);
      }}
    >
      <DialogContent className="w-[min(92vw,860px)] max-w-none overflow-visible border-none bg-transparent p-0 shadow-none">
        {/* Rendered even at the first/last case - invisible but still
            hit-testable (opacity, not `hidden`/`visibility`), so a click at
            that spot is swallowed by this no-op button instead of falling
            through to the backdrop and closing the dialog. */}
        <button
          type="button"
          onClick={() => goToCase(prevId)}
          aria-label={strings.caseCard.prevCase}
          aria-hidden={!prevId}
          tabIndex={prevId ? 0 : -1}
          className={`fixed top-1/2 left-0 z-10 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow-md ring-1 ring-ink/15 transition-colors sm:left-auto sm:right-full sm:mr-3 sm:translate-x-0 ${
            prevId ? "cursor-pointer hover:ring-ink/30" : "opacity-0"
          }`}
        >
          <ChevronLeft className="size-4" strokeWidth={2.5} />
        </button>
        <button
          type="button"
          onClick={() => goToCase(nextId)}
          aria-label={strings.caseCard.nextCase}
          aria-hidden={!nextId}
          tabIndex={nextId ? 0 : -1}
          className={`fixed top-1/2 right-0 z-10 flex size-9 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow-md ring-1 ring-ink/15 transition-colors sm:right-auto sm:left-full sm:ml-3 sm:translate-x-0 ${
            nextId ? "cursor-pointer hover:ring-ink/30" : "opacity-0"
          }`}
        >
          <ChevronRight className="size-4" strokeWidth={2.5} />
        </button>
        {/* Rounding lives on this outer overflow-hidden frame rather than on
            the scrollable div directly below - a rounded element with its
            own overflow:auto scrollbar gets its native scrollbar painted as
            a plain straight bar that squares off the top/bottom-right
            corners. Nesting an unrounded scroll container inside a rounded
            clipping frame lets the frame's own overflow clip the scrollbar's
            corners to match, without having to fight the browser's own
            scrollbar rendering. */}
        <div className="max-h-[85vh] overflow-hidden rounded-[min(1vw,14px)] bg-white ring-1 ring-ink/15 prism-edge">
          <div ref={scrollRef} className="max-h-[85vh] overflow-y-auto overflow-x-hidden">
            <div className="spectrum h-1 w-full opacity-80" />
            {item ? (
              <CaseDetailBody
                key={item.id}
                item={item}
                strings={strings}
                recommendations={recommendations}
                onClose={() => onOpenIdChange(null)}
              />
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CaseToc({ content, strings }: { content: PortfolioContent; strings: UIStrings }) {
  const { cases } = content;
  const [activeId, setActiveId] = useState<string>(cases[0]?.id ?? "");
  const navigate = useNavigate();

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
              openCase(c.id, navigate);
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

export function Work({ content, strings }: { content: PortfolioContent; strings: UIStrings }) {
  const { cases } = content;
  const [openCaseId, setOpenCaseId] = useState<string | null>(null);
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
              <CaseCard key={item.id} item={item} strings={strings} onOpenDetail={setOpenCaseId} />
            ))}
          </div>
          <CaseToc content={content} strings={strings} />
        </div>
      </div>
      <CaseDetailDialog
        cases={cases}
        openId={openCaseId}
        onOpenIdChange={setOpenCaseId}
        strings={strings}
        recommendations={content.recommendations}
      />
    </section>
  );
}
