/**
 * Hero + navbar surface theme — the single switch for the whole page.
 *
 * Flip HERO_THEME and everything follows in one go:
 *   • which photo the hero loads          (HERO_PHOTO)
 *   • the hero's foreground treatment     (HERO_SURFACE_CLASS → .hero-on-light / .hero-on-dark)
 *   • the scrim over the media            (driven by that same class in globals.css)
 *   • the navbar's link/logo/CTA colours  (NAV_VARIANT)
 *
 * Keep both photos the same dimensions so swapping never shifts layout.
 *
 * NOTE ON ASSET PATHS: everything lives under /media/. That is not cosmetic —
 * the host proxy that mounts these pages only forwards nested paths, so any
 * file at the export root 404s in production. See GUIDELINES.md §7.
 */

export type HeroTheme = "light" | "dark";

type ThemeConfig = {
  /** Photo path, pre-basePath. Always pass through withBasePath() at the call site. */
  photo: string;
  /** Scopes the hero's foreground overrides in globals.css. */
  surfaceClass: string;
  /** SiteNav's light/dark prop. */
  navVariant: "onDark" | "onLight";
};

const THEMES: Record<HeroTheme, ThemeConfig> = {
  light: {
    photo: "/media/hero-bg-light.jpg",
    surfaceClass: "hero-on-light",
    navVariant: "onLight",
  },
  dark: {
    photo: "/media/hero-bg-dark.jpg",
    surfaceClass: "hero-on-dark",
    navVariant: "onDark",
  },
};

/** ← THE SWITCH. Change this one value. */
export const HERO_THEME: HeroTheme = "dark";

const active = THEMES[HERO_THEME];

export const HERO_PHOTO: string = active.photo;
export const HERO_SURFACE_CLASS: string = active.surfaceClass;
export const NAV_VARIANT: ThemeConfig["navVariant"] = active.navVariant;

/**
 * The page's overall colour scheme. SiteNav's dropdowns and mobile sheet
 * follow it (white panels on a light page, near-black on a dark one).
 * Defaults to the hero's theme; set it directly if they differ.
 */
export type PageTheme = "light" | "dark";
export const PAGE_THEME: PageTheme = HERO_THEME;

/**
 * ← SECOND SWITCH: what fills the hero behind the copy.
 *   "photo" — the still above
 *   "video" — HERO_VIDEO on loop
 *
 * If you use video, read GUIDELINES.md §7 first. Three things matter and all
 * three were learned the hard way:
 *   1. Encode ABOVE 1920px. Retina is DPR 2, so a 1920 file gets upscaled and
 *      looks soft no matter the bitrate. 2560×1440 at CRF ~23 is the balance.
 *   2. Ping-pong the clip (forward + its own reverse) so the loop seam lands on
 *      an identical frame. Browsers cannot play a negative playbackRate, so
 *      this must be baked into the file with ffmpeg.
 *   3. Every hero UI element must be fully OPAQUE over video. Alpha shimmers
 *      as frames change behind it.
 */
export type HeroMedia = "photo" | "video";
export const HERO_MEDIA: HeroMedia = "photo";

export const HERO_VIDEO = "/media/hero-bg.mp4";

/** Poster = the video's own first frame, so nothing flashes before playback. */
export const HERO_VIDEO_POSTER = "/media/hero-video-poster.webp";
