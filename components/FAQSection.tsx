"use client";

import { useState } from "react";
import { BlurHeading } from "@/components/BlurHeading";
import { SectionGlow, sectionGlowCss } from "@/components/primitives/SectionGlow";

/**
 * FAQ on the kit's layout: heading in a fixed left rail, accordion beside it.
 *
 * Rows are open by default so the answers sit in the initial SSR HTML where
 * crawlers can see them, and FAQPage structured data is derived from ITEMS so
 * it cannot drift from the visible copy.
 */
const ITEMS = [
  {
    q: "What is ImagineArt?",
    a: "ImagineArt is an AI creative platform in three parts. Chat lets you brief and iterate with frontier models in one thread. Workflows lets you chain models, tools and connectors into pipelines that run on their own. Creative is the toolset itself: image, video, music and audio generation, an infinite canvas, and dedicated studios for ads, avatars, fashion and film.",
  },
  {
    q: "Which models can I use?",
    a: "Over 50 image, video, audio and language models from providers including OpenAI, Google, Black Forest Labs, Kling, ByteDance and MiniMax, alongside ImagineArt's own. New models are added as they release, and you switch between them without changing tools.",
  },
  {
    q: "Is it free to start?",
    a: "Yes. You can start on the free plan and upgrade when you need more generations, higher resolutions or team features. Current plans are on the pricing page.",
  },
  {
    q: "Can my team work together in realtime?",
    a: "Yes. The infinite canvas is shared: everyone sees the same file, with live cursors, comments and versions, so reviews happen where the work is instead of in an export.",
  },
  {
    q: "How do Workflows connect to the rest of my stack?",
    a: "Through connectors that bring assets in and publish results out, plugins that run ImagineArt inside the apps you already use, and MCP, so your own agents and tools can drive a workflow directly. Any workflow can also run on a schedule.",
  },
  {
    q: "Do you train on my content?",
    a: "No. Your assets, prompts and outputs are private to your workspace. We never use customer content to train our models.",
  },
  {
    q: "Who owns what I make?",
    a: "You do. You keep full commercial rights to everything you generate.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: ITEMS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

function PlusMinus({ open }: { open: boolean }) {
  return (
    <span className="faq-toggle" aria-hidden>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <line x1="1" y1="7" x2="13" y2="7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <line
          x1="7" y1="1" x2="7" y2="13"
          stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"
          style={{
            transition: "transform 240ms cubic-bezier(0.2, 0.7, 0.2, 1), opacity 200ms ease",
            transformOrigin: "center",
            transform: open ? "scaleY(0)" : "scaleY(1)",
            opacity: open ? 0 : 1,
          }}
        />
      </svg>
    </span>
  );
}

function FaqRow({ q, a, defaultOpen = false }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="faq-row">
      <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className="faq-q">
        <span>{q}</span>
        <PlusMinus open={open} />
      </button>
      <div className="faq-a-wrap" style={{ gridTemplateRows: open ? "1fr" : "0fr" }}>
        <div style={{ overflow: "hidden" }}>
          <p className="faq-a">{a}</p>
        </div>
      </div>
    </div>
  );
}

export function FAQSection() {
  return (
    <section id="faq" className="relative border-t border-[color:var(--line)] py-24 md:py-32">
      <SectionGlow position="50% 6%" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="container-page relative z-10">
        <div className="faq-grid">
          <div className="faq-intro">
            <BlurHeading className="h2" lead="FAQ" />
            <p className="lede mt-5" style={{ maxWidth: "34ch" }}>
              The things people ask before they start.
            </p>
          </div>

          <div className="faq-list">
            {ITEMS.map((item) => (
              <FaqRow key={item.q} q={item.q} a={item.a} defaultOpen />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        /* Hosts a <SectionGlow> at z-index -1. */
        #faq { isolation: isolate; }
        ${sectionGlowCss}


        .faq-grid {
          display: grid;
          grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
          gap: clamp(32px, 5vw, 80px);
          align-items: start;
        }
        .faq-intro { position: sticky; top: 120px; }
        .faq-list { border-top: 1px solid var(--line); }
        .faq-row { border-bottom: 1px solid var(--line); }
        .faq-q {
          width: 100%;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 32px;
          padding: 22px 0;
          text-align: left;
          cursor: pointer;
          background: transparent;
          border: 0;
          font-family: inherit;
          font-size: clamp(16px, 1.4vw, 19px);
          font-weight: 500;
          line-height: 1.35;
          letter-spacing: -0.01em;
          color: var(--ink);
        }
        .faq-toggle {
          flex: 0 0 auto;
          width: 32px; height: 32px;
          border-radius: 50%;
          display: grid; place-items: center;
          background: rgba(0, 0, 0, 0.05);
          color: var(--ink);
        }
        .faq-a-wrap {
          display: grid;
          transition: grid-template-rows 280ms cubic-bezier(0.2, 0.7, 0.2, 1);
        }
        .faq-a {
          font-size: 16px;
          line-height: 1.7;
          color: var(--ink-2);
          max-width: 68ch;
          padding-bottom: 24px;
        }
        @media (max-width: 900px) {
          .faq-grid { grid-template-columns: 1fr; gap: 32px; }
          .faq-intro { position: static; }
        }
        @media (prefers-reduced-motion: reduce) {
          .faq-a-wrap { transition: none; }
        }
      `}</style>
    </section>
  );
}
