"use client";

/* eslint-disable @next/next/no-img-element */
import { useRef } from "react";
import { withBasePath } from "@/lib/assets";

/**
 * A cluster of round brand marks with a parallax and proximity hover, ported
 * from the Enterprise repo's IntegrationsGrid. Moving the pointer over the
 * tile drifts every mark by its own depth, and the marks nearest the pointer
 * grow and brighten. Everything resets on leave.
 *
 * Marks are local files in public/media/<dir>/. Real brand marks keep their
 * colour, the one sanctioned exception to the monochrome rule. Four per row,
 * sized as a share of the tile, so the cluster fits any card width.
 */
function sr(seed: number) { const x = Math.sin(seed + 1) * 10000; return x - Math.floor(x); }

export function MarkCluster({ dir, marks, label }: { dir: string; marks: string[]; label: string }) {
  const ref = useRef<HTMLDivElement>(null);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const card = ref.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const mx = e.clientX, my = e.clientY;
    const dx = (mx - rect.left - rect.width / 2) / rect.width;
    const dy = (my - rect.top - rect.height / 2) / rect.height;
    card.querySelectorAll<HTMLSpanElement>("[data-depth]").forEach((el) => {
      const depth = parseFloat(el.dataset.depth ?? "1");
      const r = el.getBoundingClientRect();
      const dist = Math.hypot(mx - (r.left + r.width / 2), my - (r.top + r.height / 2));
      const prox = Math.max(0, 1 - dist / 90);
      el.style.transform = `translate(${dx * 22 * depth}px, ${dy * 16 * depth}px) scale(${1 + prox * 0.18})`;
      el.style.filter = prox > 0.05 ? `brightness(${1 + prox * 0.35})` : "";
    });
  }
  function onMouseLeave() {
    ref.current?.querySelectorAll<HTMLSpanElement>("[data-depth]").forEach((el) => {
      el.style.transform = "";
      el.style.filter = "";
    });
  }

  return (
    <div ref={ref} className="mk" onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} role="img" aria-label={label}>
      {marks.map((m, i) => (
        <span key={m} className="mk-tile" data-depth={(0.4 + sr(i * 23 + 7) * 1.4).toFixed(2)}>
          <img src={withBasePath(`/media/${dir}/${m}.svg`)} alt="" aria-hidden />
        </span>
      ))}
      <style>{`
        .mk {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          align-content: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          padding: 14px;
        }
        .mk-tile {
          flex: 0 0 auto;
          width: calc((100% - 42px) / 4);
          max-width: 78px;
          aspect-ratio: 1;
          border-radius: 50%;
          background: #f3f5f8;
          border: 1px solid rgba(0, 0, 0, 0.06);
          display: grid;
          place-items: center;
          transition: transform 0.15s ease-out, filter 0.15s ease-out;
          will-change: transform;
        }
        .mk-tile img { width: 41%; height: 41%; display: block; object-fit: contain; pointer-events: none; }
        @media (prefers-reduced-motion: reduce) {
          .mk-tile { transition: none; transform: none !important; filter: none !important; }
        }
      `}</style>
    </div>
  );
}
