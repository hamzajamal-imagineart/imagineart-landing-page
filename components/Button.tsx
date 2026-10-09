import type { ComponentPropsWithoutRef, ReactNode } from "react";

/**
 * Trailing arrow on the tertiary (ghost) variant.
 *
 * Part of the variant rather than something each call site passes, so every
 * ghost button on the page carries it without being asked. Pass
 * `arrow={false}` where one should not.
 */
function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0">
      <path d="M6 12h12M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type Variant = "brand" | "ghost" | "white" | "muted";
type Size = "sm" | "md" | "lg";

interface CommonProps {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
  /** Ghost buttons carry a trailing arrow; set false to drop it. */
  arrow?: boolean;
}

// Pills, like the hero and closing-band buttons. The kit's 10px rectangle
// left the page with two button shapes and no rule saying which was which.
const base =
  "inline-flex items-center justify-center gap-2 rounded-[var(--radius-pill)] font-sans font-medium tracking-[-0.005em] " +
  "transition-opacity duration-200 ease-out cursor-pointer border-0 active:translate-y-px";

const sizes: Record<Size, string> = {
  // Sizes read the --btn-* tokens in globals.css (9 Oct).
  sm: "h-[var(--btn-h-sm)] px-[var(--btn-px-sm)] text-[length:var(--btn-fs-sm)]",
  md: "h-[var(--btn-h-md)] px-[var(--btn-px-md)] text-[length:var(--btn-fs-md)]",
  lg: "h-[var(--btn-h-lg)] px-[var(--btn-px-lg)] text-[length:var(--btn-fs-lg)]",
};

const variants: Record<Variant, string> = {
  brand: "bg-content-primary text-white transition-colors hover:bg-primary-90",
  ghost:
    "bg-transparent text-content-primary border border-border-secondary transition-colors hover:bg-primary-100/[0.04] hover:border-border-tertiary",
  white:
    "bg-white text-content-primary border border-[color:var(--line-strong)] shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-colors hover:bg-white/90 hover:border-[color:var(--ink-3)]",
  muted: "bg-[#EDEDED] text-content-primary transition-colors hover:bg-[#E3E3E3]",
};

export function buttonClass({
  variant = "brand",
  size = "md",
  className = "",
}: { variant?: Variant; size?: Size; className?: string } = {}) {
  return `${base} ${sizes[size]} ${variants[variant]} ${className}`.trim();
}

type AnchorProps = CommonProps & Omit<ComponentPropsWithoutRef<"a">, "className" | "children">;

export function ButtonLink({ variant, size, className, children, arrow, ...rest }: AnchorProps) {
  const showArrow = arrow ?? variant === "ghost";
  return (
    <a className={buttonClass({ variant, size, className })} {...rest}>
      {children}
      {showArrow && <Arrow />}
    </a>
  );
}

type ButtonProps = CommonProps & Omit<ComponentPropsWithoutRef<"button">, "className" | "children">;

export function Button({ variant, size, className, children, arrow, ...rest }: ButtonProps) {
  const showArrow = arrow ?? variant === "ghost";
  return (
    <button className={buttonClass({ variant, size, className })} {...rest}>
      {children}
      {showArrow && <Arrow />}
    </button>
  );
}
