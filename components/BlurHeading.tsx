"use client";

import { useReducedMotion } from "motion/react";
import { BlurReveal } from "@/components/ui/blur-reveal";

/**
 * The page's headings, revealed on scroll.
 *
 * Wraps <BlurReveal>, which takes a plain string, for the three shapes this
 * page's headings actually come in: one clause, a clause plus a muted second
 * clause (`.h-muted`), and the hero's two lines at different weights. A
 * string on its own cannot carry the second colour or the line break.
 *
 * The heading element keeps its own class (`.h2`, `.display`) and the clauses
 * animate inside it as spans, so nothing about the type scale changes.
 *
 * Two behaviours the bare component does not have and this page needs:
 *
 * - Reduced motion renders the heading as plain text. Per-character blur and
 *   travel is a lot of movement, and every other animation on the page is
 *   already gated this way.
 * - The second clause starts where the first one ends, timed off the same
 *   stagger the component uses internally, so the ripple crosses the whole
 *   heading once instead of restarting halfway.
 *
 * Every heading reveals `inView` and `once`: without it the headings far down
 * the page would play on mount, and be finished long before anyone scrolls to
 * them.
 */
const SPEED_REVEAL = 1.5;
/** Mirrors BlurReveal's own `0.03 / speedReveal`. */
const STAGGER = 0.03 / SPEED_REVEAL;

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
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <Tag className={className}>
        <span className={leadClassName}>{lead}</span>
        {muted && (lineBreak ? <br /> : " ")}
        {muted && <span className={mutedClassName}>{muted}</span>}
      </Tag>
    );
  }

  return (
    <Tag className={className}>
      <BlurReveal as="span" inView once className={leadClassName} speedReveal={SPEED_REVEAL}>
        {lead}
      </BlurReveal>
      {muted && (lineBreak ? <br /> : " ")}
      {muted && (
        <BlurReveal
          as="span"
          inView
          once
          className={mutedClassName}
          speedReveal={SPEED_REVEAL}
          // Each character is one animated item and BlurReveal adds one for
          // the space between words, so the first clause runs for exactly
          // lead.length items, plus one for the space that joins the two.
          delay={(lead.length + 1) * STAGGER}
        >
          {muted}
        </BlurReveal>
      )}
    </Tag>
  );
}
