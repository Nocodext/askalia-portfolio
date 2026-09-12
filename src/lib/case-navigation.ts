import type { useNavigate } from "@tanstack/react-router";

// Dispatched on a case's <article id={item.id}> element to tell its CaseCard
// to open the shared detail popup - used both for internal cross-links
// (scrollToCase/openCase below) and for external ones (nav links,
// Recommendations' "Voir le cas client" button).
export const CASE_EXPAND_EVENT = "cc:expand";

export function scrollToCase(id: string) {
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

// Opens a case's popup directly, without moving the background scroll
// position first - once the modal covers the viewport a background scroll
// only reads as a distracting flash behind the overlay, never as a cue the
// visitor can act on. Updating the hash through the router's own `navigate`
// (rather than a raw `history.replaceState`) matters here: the router's
// scroll-restoration watcher reacts to every hash change it sees - including
// ones we trigger ourselves outside of `navigate` - and falls back to
// scrolling the target element into view unless the navigation explicitly
// opts out via `hashScrollIntoView: false`. A bare `history.replaceState`
// carries no such opt-out, so the watcher's own scroll would fire moments
// later and move the background after all.
export function openCase(id: string, navigate: ReturnType<typeof useNavigate>) {
  document.getElementById(id)?.dispatchEvent(new Event(CASE_EXPAND_EVENT));
  navigate({ hash: id, replace: true, resetScroll: false, hashScrollIntoView: false });
}

// For search hits that have no detail popup of their own (side-business
// product cards) - scrolls the element into view with the same header
// clearance as scrollToCase, then flashes a ring around it so the visitor
// can tell which card the search actually meant.
export function scrollAndFlash(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const offset = window.innerWidth < 768 ? 128 : 168;
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: "instant" });
  el.classList.remove("search-flash");
  // Force reflow so re-adding the class restarts the animation if this
  // card was already mid-flash from a previous jump.
  void el.offsetWidth;
  el.classList.add("search-flash");
}
