import { useRef } from "react";
import type { PortfolioContent } from "@/content/portfolio";
import type { UIStrings } from "@/content/ui-strings";
import { ContactEmail } from "@/components/contact-email";
import { scrollToCase } from "@/lib/case-navigation";
import { DraftingCompass, ExternalLink, GraduationCap, Quote } from "lucide-react";

export function Nav({ content, strings }: { content: PortfolioContent; strings: UIStrings }) {
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

export function Hero({ content, strings }: { content: PortfolioContent; strings: UIStrings }) {
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

export function Process({ content, strings }: { content: PortfolioContent; strings: UIStrings }) {
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

// Rendered as real text (Comfortaa) rather than the source raster PNG -
// at the small sizes this mark is displayed at, downscaling the image
// left it looking muddy/soft even though the source itself is sharp when
// viewed at full size. Text stays crisp at any size.
function NocodextWordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-["Comfortaa"] font-bold ${className}`}>
      <span className="text-black">nocod</span>
      <span className="text-[#FF0000]">ext</span>
    </span>
  );
}

export function SideBusiness({
  content,
  strings,
}: {
  content: PortfolioContent;
  strings: UIStrings;
}) {
  const { sideProjects } = content;
  return (
    <section id="lab" className="mx-auto max-w-6xl px-6 pb-16">
      <div className="relative overflow-hidden rounded-[min(1vw,16px)] bg-ink p-8 text-white ring-1 ring-ink/10 prism-edge sm:p-10">
        <div className="spectrum absolute inset-x-0 top-0 h-1 opacity-90" />
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-white/60">
          <span className="size-1.5 rounded-full bg-cyan" /> {strings.sideBusiness.sectionLabel}
        </div>
        <div className="mt-5 inline-flex rounded-md bg-white px-4 py-2.5">
          <NocodextWordmark className="text-2xl sm:text-3xl" />
        </div>
        <p className="mt-3 max-w-[58ch] text-sm text-pretty text-white/70">
          {strings.sideBusiness.intro}
        </p>
        <div className="mt-5">
          <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/50">
            {strings.sideBusiness.stackLabel}
          </div>
          <div className="mt-2 flex flex-wrap gap-2 font-mono text-[11px] text-white/60">
            {content.sideProjectsStack.map((s) => (
              <span
                key={s}
                className="rounded-full bg-white/10 px-2.5 py-1 ring-1 ring-inset ring-white/15"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/50">
            {strings.sideBusiness.llmsUsed}
          </div>
          <div className="mt-2 flex flex-wrap gap-2 font-mono text-[11px] text-white/60">
            {content.sideProjectsLlms.map((l) => (
              <span
                key={l.name}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/10 py-1.5 pr-3 pl-2 ring-1 ring-inset ring-white/15"
              >
                <img src={l.logo} alt="" className="size-3.5 shrink-0" />
                {l.name}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
          {sideProjects.map((p) => {
            // A structured name reads as one merged white pill - logo(s)
            // and surrounding text as a single brand mark - rather than a
            // logo with a badge tacked on elsewhere in the header row.
            const pillContent =
              typeof p.name === "string" ? null : (
                <>
                  {p.name.before}
                  {p.name.logo === "/logos/nocodext.png" ? (
                    <NocodextWordmark className="text-2xl" />
                  ) : (
                    <img
                      src={p.name.logo}
                      alt={p.name.alt ?? ""}
                      style={p.name.offsetY ? { marginTop: p.name.offsetY } : undefined}
                      className={p.name.large ? "h-10 w-auto" : "h-7 w-auto"}
                    />
                  )}
                  {p.name.after}
                  {p.headerRight ? (
                    <>
                      <span className="font-mono text-xs text-slate">
                        {p.headerRight.before.trim()}
                      </span>
                      <img
                        src={p.headerRight.logo}
                        alt={p.headerRight.alt ?? ""}
                        className="h-5 w-auto"
                      />
                    </>
                  ) : null}
                </>
              );
            return (
              <div
                key={p.id}
                id={p.id}
                className="rounded-[min(1vw,14px)] bg-white/5 p-6 ring-1 ring-white/10"
              >
                <div className="font-mono text-[11px] text-white/50">
                  {p.index} {strings.sideBusiness.productSuffix}
                </div>
                <h3 className="mt-3 font-display text-xl font-semibold">
                  {typeof p.name !== "string" ? (
                    p.id === "breedj" && p.headerRight && p.url ? (
                      // Experimental two-tone pill: Breedj's own mark reads
                      // fine directly on a dark fill (no white backing
                      // needed, unlike every other logo here), so splitting
                      // the pill lets that show instead of flattening
                      // everything to the same white background.
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-white/50 transition-colors hover:text-cyan"
                      >
                        <span className="inline-flex items-stretch overflow-hidden rounded-md">
                          <span className="flex items-center bg-ink px-3 py-1.5 ring-1 ring-inset ring-white/10">
                            <img
                              src={p.name.logo}
                              alt={p.name.alt ?? ""}
                              className="h-10 w-auto"
                            />
                          </span>
                          <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 text-ink">
                            <span className="font-mono text-xs text-slate">
                              {p.headerRight.before.trim()}
                            </span>
                            <img
                              src={p.headerRight.logo}
                              alt={p.headerRight.alt ?? ""}
                              className="h-5 w-auto"
                            />
                          </span>
                        </span>
                        <ExternalLink className="size-3.5 shrink-0" strokeWidth={2} />
                      </a>
                    ) : p.url ? (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-white/50 transition-colors hover:text-cyan"
                      >
                        <span className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-1.5 text-ink">
                          {pillContent}
                        </span>
                        <ExternalLink className="size-3.5 shrink-0" strokeWidth={2} />
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-1.5 text-ink">
                        {pillContent}
                      </span>
                    )
                  ) : p.url ? (
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
                <div className="mt-4 border-t border-white/10 pt-3 font-mono text-[11px] text-cyan">
                  {p.business}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Deterministic per-card tilt (a stable hash of the id, not Math.random) -
// this page prerenders to static HTML, so a truly random value would pick a

export function Contact({ content, strings }: { content: PortfolioContent; strings: UIStrings }) {
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
