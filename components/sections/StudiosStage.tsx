"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import { withBasePath } from "@/lib/assets";
import { STUDIO_HREFS } from "@/lib/links";

/**
 * The Studios tab of the platform strip (Hamza, 7 Oct): one studio's footage
 * fills the stage, and a row of chips along the foot, each carrying that
 * studio's mark, switches between them over a dark overlay that keeps the
 * marks legible.
 *
 * Ad Studio's work is vertical, so it plays three ads side by side (as the
 * old studio reel did) rather than one in a letterbox; Fashion and Film are
 * single 16:9 clips. Only the chosen studio's videos are mounted.
 *
 * Copy (Hamza, 14 Oct): each studio's title, paragraph and an "Open …"
 * button sit bottom left over a left-and-foot scrim; the chips sit bottom
 * right as the switcher and advance every 6s (paused on hover or keyboard
 * focus, off under reduced motion). The corner arrow is gone (14 Oct): the button
 * is the way in, on phones too.
 */
/** Auto-advance (Hamza, 14 Oct; 6s, was 4): ms per studio. The active chip's bar fills over the same time. */
const ADVANCE_MS = 6000;

const AD_CDN = "https://cdn-imagine.vyro.ai/imagine-one/marketingstudio/home";

type Studio = { id: string; name: string; title: string; body: string; href: string; logo: string; logoH: number; videos: string[]; posters?: string[] };

const STUDIOS: Studio[] = [
  // Fashion, Ad, Film (Hamza, 14 Oct); the nav and footer list them in the same order.
  {
    id: "fashion", name: "Fashion Studio", href: STUDIO_HREFS.fashion,
    title: "Fashion Studio",
    body: "Upload a garment and get on-model lookbooks, e-commerce shots and editorial campaigns.",
    logo: "/media/studios/logos/fashion-studio-white.svg", logoH: 32, videos: ["/media/studios/fashion/banner.mp4"],
  },
  {
    id: "ad", name: "Ad Studio", href: STUDIO_HREFS.ad,
    title: "Ad Studio",
    body: "Turn a product photo into on-brand ads, UGC videos and variations in every format.", logo: "/media/studios/logos/ad-studio-white.svg", logoH: 22,
    videos: [`${AD_CDN}/UGC_1.mp4`, `${AD_CDN}/Unboxing_4.mp4`, `${AD_CDN}/Tutorial_And_Review_2.mp4`],
    posters: [`${AD_CDN}/UGC_1.webp`, `${AD_CDN}/Unboxing_4.webp`, `${AD_CDN}/Tutorial_And_Review_2.webp`],
  },
  {
    id: "film", name: "Film Studio", href: STUDIO_HREFS.film,
    title: "Film Studio",
    body: "Characters, storyboards and scenes that stay consistent from the first shot to the last.",
    logo: "/media/studios/logos/film-studio.png", logoH: 37, videos: ["https://imagine.animagic.art/imagine-one/film-studio/video/27.mp4"],
  },
];

export function StudiosStage() {
  const [on, setOn] = useState(0);
  // Paused while the pointer is over the stage or a chip has focus; off under reduced motion.
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const [still, setStill] = useState(false);
  const [offscreen, setOffscreen] = useState(false);
  const paused = hover || focus || still || offscreen;
  const root = useRef<HTMLDivElement>(null);

  // No cycling (and no reloading the next studio's videos) while scrolled out of view.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOffscreen(!e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const s = STUDIOS[on];

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setStill(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Restarts on every change of studio, so a click gives the chosen one its full time.
  useEffect(() => {
    if (paused) return;
    const t = window.setTimeout(() => setOn((i) => (i + 1) % STUDIOS.length), ADVANCE_MS);
    return () => window.clearTimeout(t);
  }, [on, paused]);

  return (
    <div
      ref={root}
      className="st"
      data-paused={paused || undefined}
      style={{ "--st-advance": `${ADVANCE_MS}ms` } as React.CSSProperties}
      onPointerEnter={(e) => { if (e.pointerType === "mouse") setHover(true); }}
      onPointerLeave={() => setHover(false)}
    >
      <div key={s.id} className={`st-media ${s.videos.length > 1 ? "st-multi" : ""}`}>
        {s.videos.map((v, i) => (
          <video
            key={v}
            className="st-video"
            src={withBasePath(v)}
            poster={s.posters?.[i]}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
            aria-hidden
          />
        ))}
      </div>
      <span className="st-scrim" aria-hidden />

      <div key={`${s.id}-copy`} className="st-copy">
        <h3 className="st-title">{s.title}</h3>
        <p className="st-body">{s.body}</p>
        <a href={s.href} className="st-cta">
          Open {s.name}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>


      <div
        className="st-chips"
        role="group"
        aria-label="Studios"
        onFocus={(e) => { if (e.target.matches(":focus-visible")) setFocus(true); }}
        onBlur={() => setFocus(false)}
      >
        {STUDIOS.map((x, i) => (
          <button
            key={x.id}
            type="button"
            className={`st-chip ${i === on ? "st-chip-on" : ""}`}
            aria-pressed={i === on}
            aria-label={x.name}
            onClick={() => setOn(i)}
          >
            <img src={withBasePath(x.logo)} alt="" style={{ height: x.logoH }} />
            {i === on && (
              <span key={on} className={`st-progress${still ? " st-progress-full" : ""}`} aria-hidden />
            )}
          </button>
        ))}
      </div>

      <style>{`
        /* One inset for every edge, measured off the stage's width (cqw): a
           % in bottom/top is of the height, which left the copy nearer the
           foot than the side (14 Oct). */
        .st { position: absolute; inset: 0; background: var(--media-ground); container-type: size; --st-inset: clamp(20px, 4cqw, 48px); }
        .st-media { position: absolute; inset: 0; display: flex; animation: st-in 420ms ease both; }
        .st-video { flex: 1 1 0; min-width: 0; height: 100%; object-fit: cover; display: block; }
        .st-multi { gap: 2px; }
        @keyframes st-in { from { opacity: 0; } to { opacity: 1; } }
        /* Shade from the left edge and up from the foot, under the copy and the chips. */
        .st-scrim {
          position: absolute; inset: 0; pointer-events: none;
          background:
            linear-gradient(90deg, rgba(0, 0, 0, 0.64) 0%, rgba(0, 0, 0, 0.36) 34%, rgba(0, 0, 0, 0) 60%),
            linear-gradient(to top, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 46%);
        }
        /* The copy, bottom left, on the same inset as the chips above it. */
        .st-copy {
          position: absolute; left: var(--st-inset); bottom: var(--st-inset);
          width: min(460px, 46%);
          color: var(--on-media);
          animation: st-copy-in 520ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @keyframes st-copy-in { from { opacity: 0; translate: 0 8px; } to { opacity: 1; translate: 0 0; } }
        .st-title { font-size: clamp(var(--fs-h5), 2.3vw, var(--fs-h3)); line-height: 1.12; letter-spacing: -0.02em; font-weight: 500; text-wrap: balance; }
        .st-body { margin-top: 12px; font-size: var(--fs-md); line-height: 1.55; color: var(--on-media-2); text-wrap: pretty; }
        .st-cta {
          margin-top: 22px; display: inline-flex; align-items: center; gap: 8px;
          height: var(--btn-h-md); padding: 0 var(--btn-px-md); border-radius: var(--radius-pill);
          background: #f9f9f9; color: #0d0d0d; font-size: var(--fs-sm); font-weight: 500; text-decoration: none;
          transition: background var(--dur-fast) ease, transform var(--dur-fast) ease;
        }
        .st-cta:hover { background: #ececec; }
        .st-cta:active { transform: scale(0.98); }
        .st-cta:focus-visible { outline: 2px solid var(--on-media); outline-offset: 3px; }
        /* The chips, bottom right, level with the copy's foot (Hamza, 14 Oct):
           text and switcher share one baseline and the top stays clear. */
        .st-chips {
          position: absolute;
          right: var(--st-inset);
          bottom: var(--st-inset);
          display: flex;
          gap: 8px;
        }
        /* Darker, more solid glass so the chips hold up over bright footage
           (14 Oct); inactive ones dim their logo, not the whole chip. */
        .st-chip {
          position: relative; overflow: hidden; isolation: isolate;
          display: flex; align-items: center; justify-content: center;
          height: 52px;
          padding: 0 24px;
          border-radius: var(--radius-pill);
          border: 0;
          /* Near solid, no shadow (14 Oct): at 80% the footage showed
             through and washed the chips out over bright frames. */
          background: rgba(12, 12, 14, 0.94);
          cursor: pointer;
          transition: background var(--dur-fast) ease;
        }
        .st-chip img { position: relative; z-index: 1; display: block; width: auto; opacity: 0.4; transition: opacity var(--dur-fast) ease; }
        .st-chip:hover { background: rgb(18, 18, 20); }
        .st-chip:hover img { opacity: 0.8; }
        /* Active (14 Oct): a lifted surface and a full logo; inactive logos dim further. */
        .st-chip-on, .st-chip-on:hover { background: rgb(34, 34, 38); }
        .st-chip-on img { opacity: 1; }
        .st-chip:focus-visible { outline: 2px solid var(--on-media); outline-offset: 2px; }
        /* Continuous edge shimmer on the active chip (Hamza, 14 Oct): a bright
           arc of light runs round a 1px ring without rest, a conic gradient
           turned by an animated angle. Browsers without @property show the
           ring still. */
        @property --st-angle { syntax: "<angle>"; inherits: false; initial-value: 0deg; }
        .st-chip-on::before {
          content: ""; position: absolute; inset: 0; z-index: 2; border-radius: inherit; pointer-events: none;
          padding: 1px;
          background: conic-gradient(from var(--st-angle), rgba(255, 255, 255, 0.4) 0deg, rgba(255, 255, 255, 0.4) 250deg, rgba(255, 255, 255, 1) 320deg, rgba(255, 255, 255, 0.4) 360deg); /* a steady 40% ring, not 8%, so the active chip reads as selected between passes (Hamza, 14 Oct) */
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor;
          mask: linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0);
          animation: st-orbit 3s linear infinite;
        }
        @keyframes st-orbit { to { --st-angle: 360deg; } }
        /* Time left on the active studio (14 Oct): a plain fill revealed left
           to right behind the logo, its leading edge straight. */
        .st-progress {
          position: absolute; inset: 0; z-index: 0;
          background: rgba(255, 255, 255, 0.18);
          clip-path: inset(0 100% 0 0);
          animation: st-fill var(--st-advance) linear forwards;
        }
        .st-progress-full { animation: none; clip-path: none; }
        .st[data-paused] .st-progress { animation-play-state: paused; }
        @keyframes st-fill { to { clip-path: inset(0 0 0 0); } }
        /* Mid widths: a slightly smaller paragraph. */
        @media (max-width: 1100px) {
          .st-copy { width: min(420px, 52%); }
          .st-body { font-size: var(--fs-sm); }
          .st-cta { margin-top: 16px; }
        }
        /* Not enough room beside the copy: the chips go to the top, centred. */
        @media (max-width: 960px) {
          .st-chips { right: auto; bottom: auto; left: 50%; top: var(--st-inset); transform: translateX(-50%); }
        }
        /* Tablets: title and button only. */
        @media (max-width: 860px) {
          .st-body { display: none; }
          .st-copy { width: 60%; }
          .st-chip { height: 44px; padding: 0 16px; }
          .st-chip img { max-height: 28px; }
        }
        /* Phones: chips across the top, the title and a smaller button at the foot. */
        @media (max-width: 640px) {
          .st-chips { left: 12px; right: 12px; top: 12px; transform: none; gap: 6px; }
          .st-chip { flex: 1; min-width: 0; height: 40px; padding: 0 10px; }
          .st-chip img { max-height: 18px; max-width: 100%; }
          .st-copy { left: 14px; bottom: 14px; width: calc(100% - 28px); }
          .st-title { font-size: var(--fs-lg); }
          .st-cta { margin-top: 10px; height: 34px; padding: 0 14px; font-size: var(--fs-sm); }
        }
        @media (prefers-reduced-motion: reduce) {
          .st-media, .st-copy { animation: none; }
          .st-chip-on::before { animation: none; background: rgba(255, 255, 255, 0.45); }
        }
      `}</style>
    </div>
  );
}
