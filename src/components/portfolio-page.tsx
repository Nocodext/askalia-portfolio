import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";
import type { PortfolioContent } from "@/content/portfolio";
import type { UIStrings } from "@/content/ui-strings";
import { scrollToCase } from "@/lib/case-navigation";
import { Nav, Hero, Process, SideBusiness, Contact } from "@/components/page-sections";
import { Work } from "@/components/case-studies";
import { Overview } from "@/components/overview";
import { Recommendations } from "@/components/recommendations";

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
    if (!location.hash) return;
    const id = location.hash.slice(1);
    // A case's own mount effect (see CaseCard) already opens its popup
    // directly when the hash matches it, with no background scroll - doing
    // it again here would just add the scroll-then-cover flash back in.
    if (!content.cases.some((c) => c.id === id)) scrollToCase(id);
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
