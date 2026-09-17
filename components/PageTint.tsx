/**
 * Per-route colour.
 *
 * One hue, used five ways: the page wash, the deep tone headings are set in,
 * the light tint the second clause of a two-tone heading takes, the tile fill
 * and the recessed panel fill. Because all five come from one palette, a
 * heading can never drift from the background behind it.
 */
type Palette = {
  bg: string;
  ink: string;
  muted: string;
  tile: string;
  panel: string;
  /** A light tile inside a recessed panel, and the groove of a segmented control. */
  tile2: string;
  track: string;
  /** Nested container shades, one and two steps darker than `bg`. */
  shade1: string;
  shade2: string;
  /** Hue of the noise tile, as an feColorMatrix rgb triple. */
  noise: [number, number, number];
};

/**
 * The literals below are the source of these tokens, so they stay literal:
 * a `var(--tile)` here would emit `--tile: var(--tile)` and resolve to
 * nothing, taking every panel's background with it.
 */
const PALETTES = {
  /** Slate blue, the coolest of the family. This page's palette. */
  slate:   { bg: "#eef1f5", ink: "#2f4358", muted: "#97aabd", tile: "#dce4ee", tile2: "#f3f5f8", track: "#cfd9e5", panel: "#e6ebf1", shade1: "#e3e8ee", shade2: "#d7dee6", noise: [0.4, 0.46, 0.58] },
  sage:    { bg: "#f3f6f1", ink: "#2c332b", muted: "#9dab9c", tile: "#dfe7de", tile2: "#f2f5f1", track: "#d2ddd1", panel: "#eaeee8", shade1: "#e8ede6", shade2: "#dbe3d9", noise: [0.42, 0.52, 0.4] },
  sand:    { bg: "#f4f2ed", ink: "#3a352b", muted: "#aca596", tile: "#e6e1d6", tile2: "#f6f4ef", track: "#dcd5c8", panel: "#eeebe4", shade1: "#ebe8e1", shade2: "#dfdbd1", noise: [0.56, 0.5, 0.4] },
  mineral: { bg: "#eef4f4", ink: "#283a3a", muted: "#93abab", tile: "#dbe8e8", tile2: "#f0f5f5", track: "#cadcdc", panel: "#e6eeee", shade1: "#e3ebeb", shade2: "#d6e2e2", noise: [0.38, 0.52, 0.53] },
  stone:   { bg: "#f3f2f6", ink: "#332f3a", muted: "#a39dae", tile: "#e3e0eb", tile2: "#f5f3f8", track: "#d6d2e1", panel: "#ebe9f0", shade1: "#e9e7ee", shade2: "#dcd9e4", noise: [0.48, 0.44, 0.56] },
  neutral: { bg: "#ffffff", ink: "#171717", muted: "#6e6e73", tile: "#f1f2f3", tile2: "#fafafa", track: "#e5e7ea", panel: "#f7f7f8", shade1: "#f1f2f3", shade2: "#e5e7ea", noise: [0.5, 0.5, 0.5] },
} satisfies Record<string, Palette>;

export type PageTintName = keyof typeof PALETTES;

function noiseUrl([r, g, b]: [number, number, number]) {
  const matrix = `0 0 0 0 ${r}  0 0 0 0 ${g}  0 0 0 0 ${b}  0 0 0 0.5 0`;
  return (
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E" +
    "%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E" +
    `%3CfeColorMatrix type='matrix' values='${matrix}'/%3E` +
    "%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E\")"
  );
}

/** Emits a :root override for the mounted page. */
export function PageTint({ palette }: { palette: PageTintName }) {
  const { bg, ink, muted, tile, tile2, track, panel, shade1, shade2, noise } = PALETTES[palette];
  return (
    <style>{
      `:root{--page-bg:${bg};--ink-heading:${ink};--heading-muted:${muted};` +
      `--tile:${tile};--tile-2:${tile2};--track:${track};--panel-2:${panel};` +
      `--shade-1:${shade1};--shade-2:${shade2};--page-noise:${noiseUrl(noise)};}`
    }</style>
  );
}
