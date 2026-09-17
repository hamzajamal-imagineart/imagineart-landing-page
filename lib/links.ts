/**
 * Every outbound destination on the page, in one place.
 *
 * The page sells the product, so every primary action opens the main app.
 * Destinations marked "inferred" were not confirmed against the live site
 * and point at the closest page known to exist; see HANDOFF.md.
 */
export const HOME = "https://www.imagine.art";

/** Primary CTA everywhere: nav, hero, closing band. */
export const START_HREF = HOME;
export const PRICING_HREF = `${HOME}/subscription`;
/** Secondary CTA in the hero and closing band. The booking page the footer
    already pointed at, so the page keeps its no-contact-form decision. */
export const DEMO_HREF = "https://cal.com/team/imagineart/imagineart-customer-assist";

/** The three pillars. */
export const CHAT_HREF = `${HOME}/imagine-computer/ai-chat`;
export const WORKFLOWS_HREF = `${HOME}/workflow`;
export const CREATIVE_HREF = `${HOME}/image`;
export const COMPUTER_HREF = `${HOME}/imagine-computer`;

/** Studios. Ad, Fashion and Film confirmed (Hamza, 17 Sep); Avatar inferred. */
export const STUDIO_HREFS = {
  ad: `${HOME}/ad-studio`,
  avatar: `${HOME}/apps/heygen-avatar`,
  fashion: `${HOME}/fashion-studio`,
  film: `${HOME}/film-studio`,
} as const;

/** Plugin pages, one anchor per host application. Confirmed. */
const PLUGINS_HREF = `${HOME}/plugins`;
export const pluginHref = (anchor: string) => `${PLUGINS_HREF}#${anchor}`;

/** App gallery, by category. Confirmed. */
const APPS_HREF = `${HOME}/apps`;
export const appsCategoryHref = (id: number) => `${APPS_HREF}?category-id=${id}`;
export const APP_CATEGORY = { image: 14, video: 23, music: 18 } as const;

/** Template gallery, optionally filtered to a confirmed category slug. */
const TEMPLATES_HREF = `${HOME}/enterprise/template`;
export const templateHref = (category?: string) =>
  category ? `${TEMPLATES_HREF}?category=${category}` : TEMPLATES_HREF;
