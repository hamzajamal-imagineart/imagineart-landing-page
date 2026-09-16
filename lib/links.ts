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

/** The three pillars. */
export const CHAT_HREF = `${HOME}/imagine-computer/ai-chat`;
export const WORKFLOWS_HREF = `${HOME}/workflow`;
export const CREATIVE_HREF = `${HOME}/image`;
export const COMPUTER_HREF = `${HOME}/imagine-computer`;

/** Studios. Film is confirmed; the other three are inferred. */
export const STUDIO_HREFS = {
  ad: `${HOME}/ai-image-generator`,
  avatar: `${HOME}/apps/heygen-avatar`,
  fashion: `${HOME}/apps/outfit-tryon`,
  film: `${HOME}/ai-film-studio`,
} as const;

/** Template gallery, optionally filtered to a confirmed category slug. */
const TEMPLATES_HREF = `${HOME}/enterprise/template`;
export const templateHref = (category?: string) =>
  category ? `${TEMPLATES_HREF}?category=${category}` : TEMPLATES_HREF;
