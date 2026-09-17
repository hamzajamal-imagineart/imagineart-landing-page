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
export function SectionGlow({ position = "50% 0%" }: { position?: string }) {
  return <div className="sg" aria-hidden style={{ ["--sg-pos" as string]: position }} />;
}

/** Emitted once per host section; duplicate rules are harmless. */
export const sectionGlowCss = `
  .sg {
    position: absolute;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    background: radial-gradient(58% 46% at var(--sg-pos), var(--glow-tint), transparent 72%);
  }
`;
