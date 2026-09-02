import posthog from "posthog-js";

const POSTHOG_KEY = "phc_p4yReKNSYWQkTmwBCgbhWnyS2FArihWKySEJCjiLdEm9";
const POSTHOG_HOST = "https://eu.i.posthog.com";

let initialized = false;

// Privacy-conscious config: no cookies/localStorage, nothing persisted across
// visits or sessions on the visitor's device — avoids the consent-banner
// requirement that PostHog's default (cookie-based) persistence would need
// for EU visitors.
export function initAnalytics() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    persistence: "memory",
    autocapture: true,
    capture_pageview: true,
    // Free plan is one PostHog project total — this tags every event
    // (autocapture included) so nocodext.studio and future landing pages can
    // share it and still be filtered/segmented apart in PostHog's UI.
    loaded: (ph) => ph.register({ app: "portfolio" }),
  });
}

export function trackEvent(name: string, properties?: Record<string, unknown>) {
  if (!initialized) return;
  posthog.capture(name, properties);
}
