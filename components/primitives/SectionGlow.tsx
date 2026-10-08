/**
 * A wide, faint pool of light at the head of a section.
 *
 * Applied to alternate sections so the page breathes on the way down instead
 * of running one flat black from Partners to the footer. Deliberately soft
 * enough that you notice the rhythm rather than the effect.
 *
 * Drop it as the first child of a `relative` section that also isolates: it
 * sits at z-index -1, and a positioned layer at 0 would paint over the
 * section's own static text.
 *
 * The tint is a token, so it is white in dark and nothing at all in light,
 * where a white glow on a pale wash only muddies the seams.
 */
/** How far (px) the light runs past the section's top and bottom, dissolving
 *  across the seams instead of starting on a hard edge (Hamza, 8 Oct). */
const BLEED = 240;

export function SectionGlow({ position = "50% 0%" }: { position?: string }) {
  // `position` is still given against the section; the layer is taller by
  // BLEED each end, so its y is pushed down by BLEED.
  const [x = "50%", y = "0%"] = position.split(" ");
  return <div className="sg" aria-hidden style={{ ["--sg-pos" as string]: `${x} calc(${BLEED}px + ${y})` }} />;
}

/** Emitted once per host section; duplicate rules are harmless. */
export const sectionGlowCss = `
  .sg {
    position: absolute;
    inset: -${BLEED}px 0;
    z-index: -1;
    pointer-events: none;
    background: radial-gradient(70% 46% at var(--sg-pos), var(--glow-tint), transparent 74%);
    -webkit-mask-image: linear-gradient(180deg, transparent 0, #000 ${BLEED * 1.4}px, #000 calc(100% - ${BLEED * 1.4}px), transparent 100%);
    mask-image: linear-gradient(180deg, transparent 0, #000 ${BLEED * 1.4}px, #000 calc(100% - ${BLEED * 1.4}px), transparent 100%);
  }
`;
