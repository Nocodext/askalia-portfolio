import { useEffect, useId, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { trackEvent } from "@/lib/analytics";
import type { PortfolioContent, Recommendation } from "@/content/portfolio";
import type { UIStrings } from "@/content/ui-strings";
import { ContactEmail } from "@/components/contact-email";
import { openCase } from "@/lib/case-navigation";
import { ArrowUpRight, BadgeCheck, Quote } from "lucide-react";

export function scrollToRecommendation(id: string) {
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
  const navigate = useNavigate();

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
          onClick={stopThenAct(() => {
            onClose?.();
            openCase(rec.linkedCaseId!, navigate);
          })}
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

export function Recommendations({ content, strings }: { content: PortfolioContent; strings: UIStrings }) {
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
