"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ButtonLink } from "@/components/Button";
import { withBasePath } from "@/lib/assets";

/**
 * Points timeline (Hamza, 8 Oct): numbered points in a sticky list on the
 * left, one visual each scrolling past on the right; whichever visual sits
 * mid-screen opens its point, and clicking a point scrolls to its visual.
 *
 * Started as the Control section picked from the "Controllable content at
 * scale" page (#control). It now carries all of Outcomes: the outcome points
 * first, then CONTROL_POINTS (that page's copy, verbatim, proof chips cut,
 * a clip per edit tool on the third visual).
 */
export type TimelinePoint = {
  title: string;
  body: string;
  cta?: { label: string; href: string };
  media: ReactNode;
};

const REFS = [
  { src: "sneaker-flowers.jpg", tag: "Lifestyle · Flux 2" },
  { src: "shoe-jungle.jpg", tag: "Jungle · Seedream 5" },
  { src: "ad-shoe-poster.jpg", tag: "Poster · GPT Image 2.5" },
  { src: "boot-smoke-poster.jpg", tag: "Motion · Kling 3.0" },
];

/** Edit tools on the third visual, each with its own clip (Hamza, 8 Oct).
 *  Relight and Captions are left out until there is footage for them. */
const EDIT_TOOLS = [
  { label: "Inpaint", video: "/media/capabilities/inpaint.mp4" },
  { label: "Viral Remake", video: "/media/capabilities/viral-remake.mp4" }, // replaces Extend (Hamza, 9 Oct)
  { label: "Camera Angles", video: "/media/capabilities/camera-angles.mp4" }, // replaces Lip sync (Hamza, 8 Oct)
];

const img = (f: string) => withBasePath(`/media/control/${f}`);

function EditVisual() {
  const [tool, setTool] = useState(0);
  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video key={EDIT_TOOLS[tool].video} className="cm-bg" src={withBasePath(EDIT_TOOLS[tool].video)} autoPlay muted loop playsInline aria-hidden />
      <div className="edtools" role="tablist" aria-label="Edit tools">
        {EDIT_TOOLS.map((t, i) => (
          <button key={t.label} type="button" role="tab" aria-selected={i === tool} className={i === tool ? "on" : undefined} onClick={() => setTool(i)}>
            {t.label}
          </button>
        ))}
      </div>
    </>
  );
}

export const CONTROL_POINTS: TimelinePoint[] = [
  {
    title: "Your brand, locked",
    body: "Logos, colors, fonts, products and tone live in a brand kit every model reads. No re-briefing, no drift, on web, mobile and in your workflows.",
    cta: { label: "Brand kits", href: "https://www.imagine.art/enterprise/brand-kits" },
    media: (
      <>
        <img className="cm-bg" src={img("brandkit.jpg")} alt="" loading="lazy" />
        <div className="kitcard">
          <h5>MOKA brand kit</h5>
          <div className="sw">
            <i style={{ background: "#3b2a1f" }} />
            <i style={{ background: "#c8a27a" }} />
            <i style={{ background: "#efe6da" }} />
            <i style={{ background: "#a63d2f" }} />
          </div>
          <div className="ft"><span><b>Aa</b>Fraunces</span><span><b>Aa</b>Inter</span></div>
          <small>Tone: warm, direct, no exclamation marks · 2 products · 4 logos</small>
        </div>
      </>
    ),
  },
  {
    title: "Same product, same face, every frame",
    body: "Reference a product, a character or a presenter once. It holds across scenes, formats and models, so a campaign looks like one campaign.",
    cta: { label: "Try references", href: "https://www.imagine.art/image" },
    media: (
      <>
        <div className="refgrid">
          {REFS.map((r) => (
            <div key={r.src}><img src={img(r.src)} alt="" loading="lazy" /></div>
          ))}
        </div>
        <div className="refpin"><img src={img("product.jpg")} alt="" loading="lazy" /></div>
      </>
    ),
  },
  {
    title: "Edit the frame, not the prompt",
    body: "Inpaint, relight, extend, caption or change the camera angle on the exact frame, instead of rolling the dice again. Precision tools for video and image, in the same canvas.",
    cta: { label: "Open the editor", href: "https://www.imagine.art/ai-video-editor" },
    media: <EditVisual />,
  },
];

export function PointsTimeline({ points }: { points: TimelinePoint[] }) {
  const [active, setActive] = useState(0);
  const media = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => {
        for (const e of es) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.cm));
      },
      { rootMargin: "-40% 0px -45% 0px" },
    );
    for (const m of media.current) if (m) io.observe(m);
    return () => io.disconnect();
  }, []);

  const pick = (i: number) => {
    setActive(i);
    const m = media.current[i];
    if (m && window.innerWidth >= 1024) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: window.scrollY + m.getBoundingClientRect().top - 120, behavior: reduce ? "auto" : "smooth" });
    }
  };

  return (
    <>
      <div className="ctl">
        <div className="ctl-list">
          {points.map((p, i) => (
            <div
              key={p.title}
              className={`ci${active === i ? " on" : ""}`}
              onClick={() => pick(i)}
              role="button"
              tabIndex={0}
              aria-expanded={active === i}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), pick(i))}
            >
              <span className="ci-n">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="ci-title">{p.title}</h3>
              <div className="ci-body">
                <div>
                  <p>{p.body}</p>
                  {p.cta && (
                    <ButtonLink variant="ghost" arrow={false} href={p.cta.href} target="_blank" rel="noopener noreferrer" className="mt-5 ci-cta" onClick={(e) => e.stopPropagation()}>
                      {p.cta.label}
                    </ButtonLink>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="ctl-media">
          {points.map((p, i) => (
            <div key={p.title} className="cm" data-cm={i} ref={(el) => { media.current[i] = el; }}>
              {p.media}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .ctl { display: grid; gap: 40px; }
        @media (min-width: 1024px) { .ctl { grid-template-columns: 1fr 1fr; gap: 64px; align-items: start; } }
        .ctl-list { display: flex; flex-direction: column; }
        @media (min-width: 1024px) { .ctl-list { position: sticky; top: 140px; } }

        .ci { position: relative; padding: 16px 0 16px 24px; border-left: 2px solid var(--line); transition: border-color 0.3s; cursor: pointer; outline: none; }
        .ci.on { border-color: var(--ink-heading); }
        .ci:focus-visible { box-shadow: inset 2px 0 0 var(--ink-heading); }
        /* Page type throughout (Hamza, 8 Oct): the number in the eyebrow style rather than system mono, titles and copy on the Workflows card scale. */
        .ci-n { font-size: 11px; font-weight: 600; letter-spacing: 0.16em; color: var(--ink-3); font-variant-numeric: tabular-nums; }
        .ci-title { margin-top: 6px; font-size: clamp(20px, 1.8vw, 24px); line-height: 1.25; font-weight: 500; letter-spacing: -0.015em; color: var(--ink-3); transition: color 0.3s; }
        .ci.on .ci-title, .ci:hover .ci-title { color: var(--ink-heading); }
        .ci-body { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.4s var(--ease-out); }
        .ci.on .ci-body { grid-template-rows: 1fr; }
        .ci-body > div { overflow: hidden; }
        /* A solid pill (Hamza, 8 Oct: the ghost outline was near-invisible on
           the dark page). Only the open point shows its button, so one solid
           action at a time; it inverts with the theme. */
        .ci-cta { background: var(--ink-heading) !important; color: var(--page-bg) !important; border-color: transparent !important; }
        .ci-cta:hover { opacity: 0.88; }
        .ci-body p { padding-top: 10px; max-width: 44ch; font-size: 15px; line-height: 1.6; color: var(--ink-2); }

        .ctl-media { display: flex; flex-direction: column; gap: 40px; }
        .cm { position: relative; border-radius: 20px; overflow: hidden; background: var(--tile); aspect-ratio: 4 / 3; color: #fff; }
        @media (min-width: 1024px) { .cm { aspect-ratio: auto; min-height: 70vh; } }
        .cm-bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }


        .kitcard { position: absolute; left: 24px; top: 24px; width: min(18rem, 70%); display: flex; flex-direction: column; gap: 11px; padding: 16px; border-radius: 14px; background: rgba(15,15,17,0.85); -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.1); font-size: 13px; }
        .kitcard h5 { display: flex; justify-content: space-between; margin: 0; font-size: 15px; font-weight: 500; }
        .kitcard h5 i { font-style: normal; font-size: 12px; color: #22c55e; }
        .kitcard .sw { display: flex; gap: 6px; }
        .kitcard .sw i { flex: 1; aspect-ratio: 1; border-radius: 6px; }
        .kitcard .ft { display: flex; gap: 6px; }
        .kitcard .ft span { flex: 1; padding: 8px; border-radius: 8px; background: rgba(255,255,255,0.06); }
        .kitcard .ft b { display: block; font-size: 19px; font-weight: 600; }
        .kitcard small { color: rgba(255,255,255,0.6); }

        .refgrid { position: absolute; inset: 0; display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 12px; }
        .refgrid div { position: relative; border-radius: 12px; overflow: hidden; }
        .refgrid img { width: 100%; height: 100%; object-fit: cover; }
        .refgrid span { position: absolute; left: 10px; top: 10px; padding: 4px 10px; border-radius: 999px; background: rgba(0,0,0,0.6); -webkit-backdrop-filter: blur(6px); backdrop-filter: blur(6px); font-size: 11.5px; }
        .refpin { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: 104px; aspect-ratio: 1; border-radius: 16px; overflow: hidden; border: 3px solid #fff; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
        .refpin img { width: 100%; height: 100%; object-fit: cover; }
        .refpin b { position: absolute; left: 0; right: 0; bottom: 0; padding: 3px; background: #fff; color: #111; font-size: 10px; font-weight: 600; text-align: center; }

        .cm .edtools { position: absolute; left: 24px; top: 24px; display: flex; flex-wrap: wrap; gap: 6px; padding: 6px; border-radius: 999px; background: rgba(15,15,17,0.85); -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1); }
        .cm .edtools button { padding: 6px 13px; border: 0; border-radius: 999px; background: transparent; font: inherit; font-size: 13px; color: rgba(255,255,255,0.7); cursor: pointer; transition: color 0.2s, background 0.2s; }
        .cm .edtools button:hover { color: #fff; }
        .cm .edtools button.on { background: #fff; color: #111; }
        .cm .edtools button:focus-visible { outline: 2px solid #fff; outline-offset: 1px; }
        @media (prefers-reduced-motion: reduce) { .ci-body { transition: none; } }
      `}</style>
    </>
  );
}
