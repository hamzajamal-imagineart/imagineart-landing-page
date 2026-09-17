/**
 * The page's headings.
 *
 * Renders plain text for the three shapes this page's headings actually come
 * in: one clause, a clause plus a muted second clause (`.h-muted`), and the
 * hero's two lines at different weights.
 *
 * This used to wrap <BlurReveal> and animate per character on scroll. That
 * was removed: it split every heading into one `inline-block` span per
 * character, which cost first paint, broke `text-wrap: balance`, and left
 * `opacity:0` baked into the static export so headings were invisible without
 * JS. The component stays as the shared shape for headings; only the
 * animation went. `components/ui/blur-reveal.tsx` is now unused.
 */
export function BlurHeading({
  as: Tag = "h2",
  className,
  lead,
  leadClassName,
  muted,
  mutedClassName = "h-muted",
  lineBreak = false,
}: {
  as?: "h1" | "h2" | "h3";
  /** Class for the heading element itself, e.g. "h2" or "display hero-h1". */
  className?: string;
  lead: string;
  leadClassName?: string;
  /** Optional second clause. */
  muted?: string;
  mutedClassName?: string;
  /** Break the line between the two clauses instead of spacing them. */
  lineBreak?: boolean;
}) {
  return (
    <Tag className={className}>
      <span className={leadClassName}>{lead}</span>
      {muted && (lineBreak ? <br /> : " ")}
      {muted && <span className={mutedClassName}>{muted}</span>}
    </Tag>
  );
}
