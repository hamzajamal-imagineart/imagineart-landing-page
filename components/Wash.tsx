import type { ReactNode } from "react";

/**
 * A soft pastel wash behind a section (Hamza, 7 Oct, after a reference):
 * green, butter, peach and lilac pooled in a few wide radials, feathered out
 * at the top and bottom so it rises out of the white page and sinks back
 * into it with no edge. The page uses one on every third white section.
 *
 * The wash bleeds BLEED px past the section on both ends so the feather
 * lands in the neighbours' padding rather than on the section's content.
 * Three variants move the colour around so the repeats don't read as one
 * stamp. Off in the dark theme.
 */
const BLEED = 160;
/** Overall strength of the wash (0–1). */
const STRENGTH = 0.75;

type Variant = "a" | "b" | "c";

/* Each variant is a stack of radials on the page colour, in the --wash-*
   tokens from globals.css. */
const LAYERS: Record<Variant, string> = {
  // Left to right: green, butter, peach, lilac at the far edge.
  a: `radial-gradient(60% 70% at 0% 40%, var(--wash-green) 0%, transparent 70%),
      radial-gradient(50% 60% at 40% 30%, var(--wash-butter) 0%, transparent 70%),
      radial-gradient(45% 60% at 72% 35%, var(--wash-peach) 0%, transparent 70%),
      radial-gradient(40% 70% at 100% 45%, var(--wash-lilac) 0%, transparent 70%)`,
  // Pooled bottom-left: peach in the corner, green spreading right.
  b: `radial-gradient(45% 60% at 0% 85%, var(--wash-peach) 0%, transparent 70%),
      radial-gradient(55% 55% at 30% 95%, var(--wash-green) 0%, transparent 70%),
      radial-gradient(40% 55% at 12% 30%, var(--wash-blush) 0%, transparent 70%)`,
  // Mirrored: lilac left, butter and green to the right.
  c: `radial-gradient(45% 65% at 0% 50%, var(--wash-lilac) 0%, transparent 70%),
      radial-gradient(50% 60% at 62% 40%, var(--wash-butter) 0%, transparent 70%),
      radial-gradient(50% 70% at 100% 60%, var(--wash-green) 0%, transparent 70%)`,
};

/** `flushTop` keeps the wash from bleeding upward, for a section that sits
 *  right under a dark band it must not paint over. */
export function Wash({ variant = "a", flushTop, children }: { variant?: Variant; flushTop?: boolean; children: ReactNode }) {
  return (
    <div className={`wash wash-${variant}${flushTop ? " wash-flush" : ""}`}>
      {children}
      <style>{`
        .wash { position: relative; isolation: isolate; }
        .wash::before {
          content: "";
          position: absolute;
          left: 0; right: 0;
          top: -${BLEED}px; bottom: -${BLEED}px;
          z-index: -1;
          pointer-events: none;
          opacity: ${STRENGTH};
          -webkit-mask-image: linear-gradient(to bottom, transparent 0%, #000 28%, #000 72%, transparent 100%);
          mask-image: linear-gradient(to bottom, transparent 0%, #000 28%, #000 72%, transparent 100%);
        }
        .wash-a::before { background: ${LAYERS.a}; }
        .wash-b::before { background: ${LAYERS.b}; }
        .wash-c::before { background: ${LAYERS.c}; }
        .wash-flush::before { top: 0; }
        [data-theme="dark"] .wash::before { display: none; }
      `}</style>
    </div>
  );
}
