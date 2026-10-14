/**
 * GTM `session_started`, mirroring imagine-one-web
 * (apps/web .../trigger-user-auth-analytic and gtm-analytics-provider).
 *
 * The page is mounted on the same origin as the app, so it shares the app's
 * localStorage flag and cookies: if the app already fired the event for this
 * browser, this page does not fire it again, and the other way round.
 */

/** Same container the app loads (gtm-body-script). Hard-wired, no env vars. */
export const GTM_ID = "GTM-WNBR3NM";

/** The app's ANALYTICS_NONE. */
const ANALYTICS_NONE = "None";
const PAGE_NAME = "overview";

// The app never expires this flag (localStorage, despite the "Cookie" in its name).
const HAS_FIRED_SESSION_STARTED_KEY = "hasFiredSessionStarted";

// Cookies the app's middleware sets from the URL; the app attaches these to every event.
const UTM_COOKIES = [
  "utm_campaign",
  "utm_campaign_name",
  "utm_source",
  "utm_medium",
  "utm_term",
  "utm_interval",
  "utm_content",
  "utm_campaign_meta",
  "utm_content_meta",
  "utm_model",
  "utm_variant",
  "fbclid",
  "_fbc",
  "_fbp",
  "gclid",
] as const;

const cookie = (name: string): string | undefined => {
  const hit = document.cookie.split("; ").find((c) => c.startsWith(`${name}=`));
  return hit ? decodeURIComponent(hit.slice(name.length + 1)) : undefined;
};

export function trackSessionStarted() {
  try {
    if (localStorage.getItem(HAS_FIRED_SESSION_STARTED_KEY)) return;

    const superProps = Object.fromEntries(UTM_COOKIES.map((k) => [k, cookie(k) ?? ANALYTICS_NONE]));
    const w = window as Window & { dataLayer?: Record<string, unknown>[] };
    (w.dataLayer ??= []).push({
      event: "gtm.click",
      "gtm.elementId": "session_started",
      meta_event_id: crypto.randomUUID(),
      page_name: PAGE_NAME,
      // No auth state on a static page; the app reads the user context here.
      state: "logged_out",
      impact_referral: cookie("impact_referral") ?? ANALYTICS_NONE,
      is_company_domain: false,
      ...superProps,
    });
    localStorage.setItem(HAS_FIRED_SESSION_STARTED_KEY, "true");
  } catch {
    // Analytics must never break the page (the app swallows tag errors too).
  }
}
