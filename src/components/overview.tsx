import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { trackEvent } from "@/lib/analytics";
import type { OverviewBucket, OverviewCategory, PortfolioContent } from "@/content/portfolio";
import type { UIStrings } from "@/content/ui-strings";
import { Popover, PopoverArrow, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SkillRing } from "@/components/skill-ring";
import { CaseIcon, caseColor, iconBadgeBg, ringColorVar } from "@/components/case-studies";
import { openCase, scrollToCase } from "@/lib/case-navigation";
import { useIsMobile } from "@/lib/use-is-mobile";
import { ArrowUpRight } from "lucide-react";

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
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  // Cases open their popup in place; side projects (no popup) still scroll
  // to their spot on the page.
  const goToItem = (id: string) => {
    if (cases.some((x) => x.id === id)) openCase(id, navigate);
    else scrollToCase(id);
    setOpen(false);
  };

  // On mobile there's no good trigger-relative side to anchor to - the row
  // can sit anywhere in a long scrolling page, and Radix's own "left"/
  // "right" positioning (plus its collision handling) still resolves
  // relative to the trigger, never to the viewport itself. So instead of
  // fighting that, mobile skips PopoverContent's Popper positioning
  // entirely and renders a manually-controlled overlay centered on the
  // page, the same pattern the Recommendations modal already uses.
  useEffect(() => {
    if (!isMobile || !open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMobile, open]);

  const body = (
    <>
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
            onSelect={goToItem}
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
                <a
                  href={`#${id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    goToItem(id);
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
              </li>
            );
          })}
        </ul>
      </TooltipProvider>
    </>
  );

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
        {!isMobile ? (
          <PopoverContent
            side={popoverSide}
            align="center"
            collisionPadding={16}
            className="w-[min(20rem,calc(100vw-2rem))]"
          >
            <PopoverArrow className="fill-popover" stroke="var(--line)" strokeWidth={1} />
            {body}
          </PopoverContent>
        ) : null}
      </Popover>
      {isMobile && open ? (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-6 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-[min(20rem,calc(100vw-2rem))] rounded-md border bg-popover p-4 text-popover-foreground shadow-md"
          >
            {body}
          </div>
        </div>
      ) : null}
    </li>
  );
}

export function Overview({ content, strings }: { content: PortfolioContent; strings: UIStrings }) {
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
