/**
 * Container guide lines (ElevenLabs-style) scoped to ONE section, but designed
 * to stack into a single continuous page-wide grid.
 *
 * Drop this as the first child of any section you want framed, and make that
 * section `relative`. It draws faint vertical rules at the page-container
 * edges (1240px) spanning the section's height, plus a horizontal rule and a
 * pair of dots along ONE edge.
 *
 * WHY ONLY ONE EDGE GETS DOTS:
 * Sections sit flush against each other, so section A's bottom edge and
 * section B's top edge are the same seam. If each drew its own corner dots,
 * every seam would render two dots ~1px apart — reading as a smudge or a
 * figure-of-eight rather than one intersection. Marking a single edge means
 * exactly one dot per intersection no matter how many sections stack.
 *
 * WHY THE VERTICALS AREN'T GAPPED AT BOTH ENDS:
 * A gap at both ends breaks the vertical rule at every seam, so the "grid"
 * reads as a stack of detached boxes. The rule is masked only where it
 * actually passes through this section's dots; the opposite end runs to the
 * section boundary and meets the neighbouring section's rule, so the line
 * appears continuous down the whole page.
 *
 * Renders at z-0 so it sits BEHIND section content. Full-bleed content
 * (edge-to-edge card tracks, media) will therefore cover the rules where it
 * crosses them, which is correct — a guide painted over a card reads as a
 * scratch. Sections whose content is entirely full-bleed shouldn't use this
 * at all, since there's nothing left for the grid to align to.
 *
 * `edge` should match the section's own border — the section keeps its
 * `border-t`/`border-b` for mobile and hides it at `lg:` where this takes
 * over, via `lg:border-t-0` / `lg:border-b-0` on the section itself.
 * Desktop only; purely decorative and non-interactive.
 */
export function SectionGuides({ edge = "top" }: { edge?: "top" | "bottom" }) {
  /** Clear space each side of a dot before the line resumes. */
  const GAP = 7;

  // Mask only the end this section actually places dots on; the far end runs
  // clean into the next section so the vertical reads as one unbroken line.
  const vMask =
    edge === "top"
      ? `linear-gradient(to bottom, transparent 0, transparent ${GAP}px, black ${GAP}px, black 100%)`
      : `linear-gradient(to bottom, black 0, black calc(100% - ${GAP}px), transparent calc(100% - ${GAP}px), transparent 100%)`;

  // The horizontal rule has a dot at each of its ends, so it stays gapped both sides.
  const hMask = `linear-gradient(to right, transparent 0, transparent ${GAP}px, black ${GAP}px, black calc(100% - ${GAP}px), transparent calc(100% - ${GAP}px), transparent 100%)`;

  const dotY = edge === "top" ? "top-0 -translate-y-1/2" : "bottom-0 translate-y-1/2";

  return (
    /* Inset by the dot's 2px radius so a dot centred on this frame's edge is
       never sliced in half by an ancestor's overflow-hidden. */
    <div
      aria-hidden="true"
      className="hidden lg:block pointer-events-none absolute inset-x-[2px] inset-y-0 z-0"
    >
      <div className="relative mx-auto h-full w-full max-w-[1240px]">
        {/* Vertical rules — masked only at the dotted edge */}
        <span
          className="absolute left-0 top-0 bottom-0 w-px bg-black/[0.055]"
          style={{ WebkitMaskImage: vMask, maskImage: vMask }}
        />
        <span
          className="absolute right-0 top-0 bottom-0 w-px bg-black/[0.055]"
          style={{ WebkitMaskImage: vMask, maskImage: vMask }}
        />

        {/* Horizontal rule on the marked edge */}
        <span
          className={`absolute left-0 right-0 h-px bg-black/[0.055] ${edge === "top" ? "top-0" : "bottom-0"}`}
          style={{ WebkitMaskImage: hMask, maskImage: hMask }}
        />

        {/* One dot per intersection — this edge only */}
        <span
          className={`absolute left-0 ${dotY} -translate-x-1/2 w-[4px] h-[4px] rounded-full bg-black/50`}
        />
        <span
          className={`absolute right-0 ${dotY} translate-x-1/2 w-[4px] h-[4px] rounded-full bg-black/50`}
        />
      </div>
    </div>
  );
}
