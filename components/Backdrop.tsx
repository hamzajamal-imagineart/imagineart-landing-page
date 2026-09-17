import { withBasePath } from "@/lib/assets";

/**
 * The hero photograph, blurred past recognition, reused down the page.
 *
 * At blur(64px) the image stops being a picture and becomes a soft field of
 * the same light the hero opens on, so the page keeps a thread of colour
 * through it instead of running flat wash from Partners to the footer.
 *
 * Three things it has to do to sit behind a section safely:
 *
 * - Overhang by more than the blur radius. A blurred layer samples
 *   transparent pixels past its own edges and fades out at the sides, so a
 *   flush layer leaves a pale halo along every seam. The overhang is clipped
 *   by a wrapper of the component's own rather than by the host section:
 *   clipping at the section forced `overflow-clip-margin` there to save the
 *   SectionGuides dots, and that margin then let the overhang leak back out
 *   and widen the document.
 * - Sit at `z-index: -1` inside a section that isolates. A positioned layer
 *   at `z-index: 0` paints *above* the section's own static text.
 * - Fade out hard at top and bottom, so it meets the hairline seams on the
 *   page wash rather than stopping on a line. The solid core is only the
 *   middle third; everything either side of it is already dissolving.
 *
 * `position` moves the crop so consecutive backdrops are not the same frame
 * twice; the image is unrecognisable at this blur, but the light in it still
 * shifts left to right.
 */
export function Backdrop({
  position = "center",
  opacity = 0.55,
}: {
  /** background-position for the crop. */
  position?: string;
  opacity?: number;
}) {
  return (
    <div className="bd" aria-hidden>
      <span
        className="bd-layer"
        style={{
          ["--bd-img" as string]: `url(${withBasePath("/media/hero/backdrop.jpg")})`,
          ["--bd-pos" as string]: position,
          ["--bd-op" as string]: String(opacity),
        }}
      />
    </div>
  );
}

/** Emitted once per host section; duplicate rules are harmless. */
export const backdropCss = `
  /* Clips its own overhang, so the host section needs nothing but an
     isolation context and can let other things overflow it. */
  .bd {
    position: absolute;
    inset: 0;
    z-index: -1;
    overflow: hidden;
    pointer-events: none;
  }
  .bd-layer {
    position: absolute;
    inset: -140px;
    background-image: var(--bd-img);
    background-size: cover;
    background-position: var(--bd-pos);
    background-repeat: no-repeat;
    filter: blur(64px);
    opacity: var(--bd-op);
    -webkit-mask-image: linear-gradient(to bottom, transparent 0, #000 38%, #000 62%, transparent 100%);
    mask-image: linear-gradient(to bottom, transparent 0, #000 38%, #000 62%, transparent 100%);
  }
`;
