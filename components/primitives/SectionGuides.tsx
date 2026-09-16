/**
 * Decorative container guide lines scoped to one section.
 *
 * Drop this as the first child of any `relative` section. It draws faint
 * vertical rules at the page-container edges (1240px) spanning the section's
 * height, plus a horizontal rule along the bordered edge, with a dot at each
 * corner. Every line stops short of its dot via a CSS mask gap.
 *
 * `edge` should match the section's own border: the section keeps its
 * `border-t` for mobile and hides it at `lg:` where this takes over. Mark one
 * edge only per seam, or two dots stack.
 */
export function SectionGuides({ edge }: { edge: "top" | "bottom" }) {
  const GAP = 10;

  const vMask = `linear-gradient(to bottom, transparent 0, transparent ${GAP}px, black ${GAP}px, black calc(100% - ${GAP}px), transparent calc(100% - ${GAP}px), transparent 100%)`;
  const hMask = `linear-gradient(to right, transparent 0, transparent ${GAP}px, black ${GAP}px, black calc(100% - ${GAP}px), transparent calc(100% - ${GAP}px), transparent 100%)`;

  return (
    <div aria-hidden="true" className="hidden lg:block pointer-events-none absolute inset-[3px] z-20">
      <div className="relative mx-auto h-full w-full max-w-[1240px]">
        <span
          className="absolute left-0 top-0 bottom-0 w-px bg-border-primary"
          style={{ WebkitMaskImage: vMask, maskImage: vMask }}
        />
        <span
          className="absolute right-0 top-0 bottom-0 w-px bg-border-primary"
          style={{ WebkitMaskImage: vMask, maskImage: vMask }}
        />
        <span
          className={`absolute left-0 right-0 h-px bg-border-primary ${edge === "top" ? "top-0" : "bottom-0"}`}
          style={{ WebkitMaskImage: hMask, maskImage: hMask }}
        />
        <span className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 w-[6px] h-[6px] rounded-full bg-content-primary" />
        <span className="absolute right-0 top-0 translate-x-1/2 -translate-y-1/2 w-[6px] h-[6px] rounded-full bg-content-primary" />
        <span className="absolute left-0 bottom-0 -translate-x-1/2 translate-y-1/2 w-[6px] h-[6px] rounded-full bg-content-primary" />
        <span className="absolute right-0 bottom-0 translate-x-1/2 translate-y-1/2 w-[6px] h-[6px] rounded-full bg-content-primary" />
      </div>
    </div>
  );
}
