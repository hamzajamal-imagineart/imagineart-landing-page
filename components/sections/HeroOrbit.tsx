"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import { withBasePath } from "@/lib/assets";
import { DEMO_HREF, START_HREF } from "@/lib/links";

/**
 * Orbit hero (Hamza, 8 Oct): ported from the "Controllable content at scale"
 * page (?hero=a). Centred copy with a rotating word (images → videos →
 * audios) and a hand-drawn underline, over eight stills and clips scattered
 * around it. Cards scale in one by one, float on their own clocks, drift
 * against the pointer by depth (parallax) and swell as the pointer nears,
 * showing the model that made them. Under 1024px the field gives way to a
 * row of four stills under the copy.
 *
 * Copy, positions, models and media are that page's; media sits in
 * public/media/hero/orbit/. The drift hero it replaced is parked at /hero-2.
 */
const O = (f: string) => withBasePath(`/media/hero/orbit/${f}`);

const MODELS: Record<string, [string, string]> = {
  flux: ["Flux 2 Max", "flux"],
  kling: ["Kling 3.0", "kling"],
  gpt: ["GPT Image 2.5", "chatgpt"],
  seedance: ["Seedance 2.5", "dreamina"],
  nanobanana: ["Nano Banana Pro", "nanobanana"],
  imagineart: ["ImagineArt 2.0", "imagineart"],
};
const logo = (m: string) => O(`models/${MODELS[m][1]}.png`);

/** x/y: centre as % of the hero; w: px at full size; d: parallax depth. */
type Orb = { x: number; y: number; w: number; ar: string; d: number; src: string; m: string; v?: string };
const ORB: Orb[] = [
  { x: 4.9, y: 13.6, w: 330, ar: "7/5", d: 1, src: "red-light", m: "kling" },
  { x: 34, y: 7, w: 194, ar: "16/10", d: 3, src: "macro-perfume", m: "nanobanana" }, // up and left, clear of the kicker (8 Oct; was 39.7, 12.8)
  { x: 87.8, y: 13.2, w: 560, ar: "21/9", d: 1, src: "ad-smooth", m: "gpt" },
  { x: 15.8, y: 42.8, w: 150, ar: "3/4", d: 3, src: "surfer-poster", m: "kling", v: "surfer" }, // latest Kling clips replace the UGC talking heads (Hamza, 8 Oct)
  { x: 7.6, y: 66.3, w: 221, ar: "3/4", d: 2, src: "tryon-poster", m: "seedance", v: "jacket-tryon" },
  { x: 88.4, y: 55.8, w: 165, ar: "3/4", d: 3, src: "skier-poster", m: "kling", v: "skier" },
  { x: 77.5, y: 70.5, w: 227, ar: "16/10", d: 2, src: "car-coffee", m: "seedance" },
  { x: 41.9, y: 80, w: 230, ar: "1/1", d: 2, src: "sneaker-flowers", m: "flux" }, // smaller and higher, clear of the foot fade (8 Oct; was y 89.5, w 281)
];
/** The four stills in the narrow-screen row. */
const MROW = [3, 4, 5, 7];

const WORKS: { m: string; label: string; href: string }[] = [
  { m: "gpt", label: "GPT Image", href: "https://www.imagine.art/image?modelListId=70&mode=create" },
  { m: "kling", label: "Kling", href: "https://www.imagine.art/video?modelListId=48&mode=create" },
  { m: "flux", label: "Flux", href: "https://www.imagine.art/image?modelListId=22&mode=create" },
  { m: "seedance", label: "Seedance", href: "https://www.imagine.art/video/create/seedance-25" },
  { m: "grok", label: "Grok", href: "https://www.imagine.art/video?modelListId=46&editorMode=default" },
  { m: "nanobanana", label: "Nano Banana", href: "https://www.imagine.art/image?modelListId=103&mode=create" },
];
const WORKS_LOGO: Record<string, string> = { gpt: "chatgpt", kling: "kling", flux: "flux", seedance: "dreamina", grok: "grok", nanobanana: "nanobanana" };

const WORDS = [
  { w: "images", g: "linear-gradient(90deg,#C9A6FF,#7C5CFF 55%,#FF7AA2)" },
  { w: "videos", g: "linear-gradient(90deg,#60A5FA,#22D3EE)" },
  { w: "audios", g: "linear-gradient(90deg,#34D399,#A3E635)" },
];
/** Rotating word: ms per word. */
const WORD_EVERY = 2400;
/** Parallax travel per depth step (px at the hero's edge) and pointer swell radius / amount. */
const PARALLAX = 22, NEAR_R = 340, NEAR_SCALE = 0.14;
/** Top of the card field, px below the hero's top: clears the 76px nav. */
const FIELD_TOP = 110;
/** Minimum gap (px) between a card and the hero's left/right edge. */
const EDGE = 32;
/** Film grain over the hero (Hamza, 8 Oct): strength 0–1. */
const NOISE = 0.13;
/** The grain and a soft light pool in the centre and fade out toward every
 *  edge (Hamza, 8 Oct): GLOW_SIZE is the ellipse (% of the hero's width /
 *  height) they reach zero at; GLOW is the light's strength (0–1). */
const GLOW_SIZE = "70% 75%", GLOW = 0.07;
/** The grain runs BLEED px past the hero's foot and dissolves over the next
 *  section (Hamza, 8 Oct); GRAIN_SIZE is its ellipse over that taller box. */
const BLEED = 320, GRAIN_SIZE = "72% 70%";
const NOISE_URL = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E\")";

export function HeroOrbit() {
  const hero = useRef<HTMLElement | null>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const rw = useRef<HTMLSpanElement | null>(null);
  const words = useRef<(HTMLSpanElement | null)[]>([]);
  const [shown, setShown] = useState(0);
  const [word, setWord] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);

  // Cards scale in one after another.
  useEffect(() => {
    const ts = ORB.map((_, i) => setTimeout(() => setShown((n) => Math.max(n, i + 1)), 150 + i * 70));
    return () => ts.forEach(clearTimeout);
  }, []);

  // Rotating word; the slot animates to each word's width.
  useEffect(() => {
    const fit = (i: number) => {
      const el = words.current[i];
      if (rw.current && el) rw.current.style.width = `${el.getBoundingClientRect().width}px`;
    };
    fit(0);
    document.fonts?.ready.then(() => fit(0));
    let i = 0;
    const t = setInterval(() => {
      if (document.hidden) return;
      const p = i;
      i = (i + 1) % WORDS.length;
      setPrev(p);
      setWord(i);
      fit(i);
      setTimeout(() => setPrev(null), 650);
    }, WORD_EVERY);
    return () => clearInterval(t);
  }, []);

  // Parallax against the pointer, and a swell on the card nearest it.
  useEffect(() => {
    const el = hero.current;
    if (!el) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    let tx = 0, ty = 0, px = 0, py = 0, mx = -9999, my = -9999, raf = 0;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width - 0.5;
      ty = (e.clientY - r.top) / r.height - 0.5;
      mx = e.clientX; my = e.clientY;
    };
    const leave = () => { tx = 0; ty = 0; mx = -9999; my = -9999; };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    const loop = () => {
      px += (tx - px) * 0.06; py += (ty - py) * 0.06;
      cards.current.forEach((c, i) => {
        if (!c) return;
        const d = ORB[i].d;
        c.style.transform = `translate(-50%, -50%) translate(${(-px * d * PARALLAX).toFixed(1)}px, ${(-py * d * PARALLAX).toFixed(1)}px)`;
        const r = c.getBoundingClientRect();
        let k = Math.max(0, 1 - Math.hypot(mx - (r.left + r.width / 2), my - (r.top + r.height / 2)) / NEAR_R);
        k = k * k * (3 - 2 * k);
        c.style.setProperty("--s", (1 + k * NEAR_SCALE).toFixed(3));
        c.classList.toggle("near", k > 0.45);
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <section id="top" ref={hero} className="hx1" data-theme="dark" aria-label="Overview">
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
        <defs>
          <linearGradient id="hx1g" x1="0" x2="1">
            <stop offset="0" stopColor="#C9A6FF" />
            <stop offset=".5" stopColor="#7C5CFF" />
            <stop offset="1" stopColor="#FF7AA2" />
          </linearGradient>
        </defs>
      </svg>

      <div className="hx1-field" aria-hidden>
        {ORB.map((o, i) => (
          <div
            key={o.src}
            ref={(el) => { cards.current[i] = el; }}
            className={`oc1${i < shown ? "" : " pre"}`}
            style={{ "--x": `${o.x}%`, "--y": `${o.y}%`, "--w": `min(${o.w}px, ${(o.w / 22).toFixed(2)}vw)`, "--ar": o.ar, "--fd": `${6 + (i % 4)}s` } as React.CSSProperties}
          >
            <div className="oc1-in">
              {o.v ? (
                // eslint-disable-next-line jsx-a11y/media-has-caption
                <video src={O(`${o.v}.mp4`)} poster={O(`${o.src}.jpg`)} autoPlay muted loop playsInline preload="metadata" />
              ) : (
                <img src={O(`${o.src}.jpg`)} alt="" />
              )}
              <span className="oc1-tg"><img src={logo(o.m)} alt="" />{MODELS[o.m][0]}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="hx1-copy">
        <h1 className="hx1-h1">
          <span className="hx1-h">
            {/* The underline runs under "Create <word>," only (Hamza, 8 Oct). */}
            <span className="hx1-u">
            Create{" "}
            <span className="rw" ref={rw} aria-live="polite">
              {WORDS.map((w, i) => (
                <span
                  key={w.w}
                  ref={(el) => { words.current[i] = el; }}
                  className={`rw-w${i === word ? " on" : ""}${i === prev ? " out" : ""}`}
                  style={{ "--g": w.g } as React.CSSProperties}
                >
                  <b>{w.w}</b>,
                </span>
              ))}
            </span>
            <svg className="hx1-doodle" viewBox="0 0 600 40" preserveAspectRatio="none" aria-hidden>
              <path d="M6 28 C 120 10, 260 36, 400 18 S 560 14, 594 24" />
            </svg>
            </span>{" "}
            control at scale
          </span>
        </h1>
        <p className="hx1-lede">
          Every leading model, studios for the work you ship, brand control that holds across every output, and
          workflows.
        </p>
        <div className="hx1-cta">
          <a className="hx1-btn hx1-btn-primary" href={START_HREF}>Start creating for free</a>
          <a className="hx1-btn hx1-btn-secondary" href={DEMO_HREF}>Contact sales</a>
        </div>
        <div className="hx1-works">
          <span>Works with</span>
          {WORKS.map((w) => (
            <a key={w.m} href={w.href} aria-label={w.label} target="_blank" rel="noopener noreferrer">
              <img src={O(`models/${WORKS_LOGO[w.m]}.png`)} alt="" />
            </a>
          ))}
          <a href="https://www.imagine.art/models" className="more" target="_blank" rel="noopener noreferrer">+50 more</a>
        </div>
        <div className="hx1-mrow" aria-hidden>
          {MROW.map((i) => <div key={i}><img src={O(`${ORB[i].src}.jpg`)} alt="" /></div>)}
        </div>
      </div>

      <style>{`
        .hx1 {
          /* Clipped sideways only, so the grain can run on down into the next section. */
          position: relative; overflow-x: clip; isolation: isolate;
          min-height: 100svh; box-sizing: border-box;
          display: flex; align-items: center; justify-content: center;
          padding: 96px 20px 72px;
          background: var(--page-bg); color: var(--ink);
        }
        /* The field starts FIELD_TOP below the hero's top (Hamza, 8 Oct) so
           the top row of cards clears the 76px nav instead of sitting under it. */
        /* The light pool behind the hero is off (Hamza, 8 Oct); GLOW, GLOW_SIZE, GRAIN_SIZE and BLEED are unused. */
        /* Grain over the hero removed (Hamza, 8 Oct); NOISE / NOISE_URL are unused. */
        .hx1-field {
          position: absolute; inset: ${FIELD_TOP}px 0 0 0; pointer-events: none;
          -webkit-mask-image: linear-gradient(180deg, #000 0, #000 calc(100% - 140px), transparent 100%);
          mask-image: linear-gradient(180deg, #000 0, #000 calc(100% - 140px), transparent 100%);
        }
        /* left is clamped so no card is cut by the hero's edge (Hamza, 8 Oct): its centre stays at least half its width plus EDGE in from either side. */
        .oc1 { position: absolute; left: clamp(calc(var(--w) / 2 + ${EDGE}px), var(--x), calc(100% - var(--w) / 2 - ${EDGE}px)); top: var(--y); width: var(--w); transform: translate(-50%, -50%); pointer-events: auto; will-change: transform; }
        .oc1.near { z-index: 5; }
        .oc1-in {
          position: relative; border-radius: 16px; overflow: hidden; background: var(--tile);
          aspect-ratio: var(--ar, 4/5);
          box-shadow: 0 30px 60px rgba(0,0,0,.5), inset 0 0 0 1px rgba(255,255,255,.08);
          transform: scale(var(--s, 1)); opacity: 1;
          transition: opacity .6s cubic-bezier(.22,1,.36,1), transform .7s cubic-bezier(.22,1,.36,1), box-shadow .5s;
          animation: oc1float var(--fd, 7s) ease-in-out infinite alternate;
        }
        .oc1.pre .oc1-in { opacity: 0; transform: scale(.6); }
        .oc1.near .oc1-in { box-shadow: 0 40px 80px rgba(0,0,0,.6), inset 0 0 0 1px rgba(255,255,255,.18); }
        @keyframes oc1float { from { translate: 0 0; } to { translate: 0 -10px; } }
        .oc1-in img, .oc1-in video { width: 100%; height: 100%; object-fit: cover; display: block; }
        .oc1-tg {
          position: absolute; left: 8px; bottom: 8px; display: inline-flex; align-items: center; gap: 5px;
          padding: 3px 8px; border-radius: 999px; background: rgba(0,0,0,.6); -webkit-backdrop-filter: blur(6px); backdrop-filter: blur(6px);
          font-size: 11px; color: #fff; opacity: 0; transform: translateY(4px); transition: opacity .25s, transform .25s;
        }
        .oc1-tg img { width: 12px !important; height: 12px !important; border-radius: 3px; }
        .oc1.near .oc1-tg { opacity: 1; transform: none; }

        .hx1-copy { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 22px; max-width: 76rem; }
        .hx1-kicker { font-size: 11px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; color: var(--ink-3); }
        .hx1-h1 { font-size: clamp(2.1rem, 3.8vw, 54px); /* 54px on desktop (Hamza, 8 Oct) */ line-height: 1.02; letter-spacing: -.04em; font-weight: 600; color: #fff; text-wrap: balance; }
        .hx1-mute { color: #6f6f76; }
        .hx1-h { position: relative; display: inline-block; }
        .hx1-u { position: relative; display: inline-block; white-space: nowrap; }
        @media (min-width: 1024px) { .hx1-h { white-space: nowrap; } }
        .hx1-doodle { position: absolute; left: -2%; right: -2%; bottom: -.18em; width: 104%; height: .42em; pointer-events: none; }
        .hx1-doodle path { fill: none; stroke: url(#hx1g); stroke-width: 7; stroke-linecap: round; stroke-dasharray: 1200; stroke-dashoffset: 1200; animation: hx1draw 1.3s cubic-bezier(.22,1,.36,1) .5s forwards; }
        @keyframes hx1draw { to { stroke-dashoffset: 0; } }

        .rw { display: inline-grid; justify-items: start; text-align: left; vertical-align: baseline; transition: width .5s cubic-bezier(.22,1,.36,1); }
        .rw-w { grid-area: 1 / 1; white-space: nowrap; opacity: 0; transform: translateY(.45em); transition: opacity .45s cubic-bezier(.22,1,.36,1), transform .6s cubic-bezier(.22,1,.36,1); }
        .rw-w.on { opacity: 1; transform: none; }
        .rw-w.out { opacity: 0; transform: translateY(-.45em); }
        .rw-w b { font-weight: inherit; -webkit-background-clip: text; background-clip: text; color: transparent; background-image: var(--g); }

        .hx1-lede { font-size: 16px; /* fixed (Hamza, 8 Oct) */ line-height: 1.55; color: var(--ink-2); max-width: 40rem; }
        .hx1-cta { display: flex; gap: .6rem; flex-wrap: wrap; align-items: center; justify-content: center; }
        .hx1-btn { display: inline-flex; align-items: center; justify-content: center; min-height: 2.75rem; padding: 0 1.4rem; border-radius: 999px; border: 1px solid transparent; font-size: .95rem; font-weight: 500; white-space: nowrap; transition: background .25s, transform .25s; }
        .hx1-btn:active { transform: scale(.98); }
        .hx1-btn-primary { background: #f9f9f9; color: #0d0d0d; }
        .hx1-btn-primary:hover { background: #ececec; }
        .hx1-btn-secondary { background: transparent; color: #fff; border-color: rgba(255,255,255,.15); }
        .hx1-btn-secondary:hover { background: var(--tile); }

        .hx1-works { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; justify-content: center; font-size: 13px; color: var(--ink-3); }
        .hx1-works > span { white-space: nowrap; }
        .hx1-works a { display: inline-flex; width: 30px; height: 30px; border-radius: 50%; overflow: hidden; opacity: .55; filter: grayscale(1); transition: opacity .25s, transform .3s cubic-bezier(.22,1,.36,1), filter .25s; }
        .hx1-works a:hover { opacity: 1; transform: translateY(-2px) scale(1.08); filter: none; }
        .hx1-works a img { width: 100%; height: 100%; object-fit: cover; }
        .hx1-works a.more { width: auto; padding: 0 10px; align-items: center; border-radius: 999px; border: 1px solid rgba(255,255,255,.14); font-size: 12px; color: var(--ink-2); opacity: 1; filter: none; white-space: nowrap; }

        .hx1-mrow { display: none; }
        @media (max-width: 1023px) {
          .hx1-field { display: none; }
          .hx1 { min-height: auto; padding: 112px 20px 56px; }
          .hx1-mrow { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; width: 100%; margin-top: 10px; }
          .hx1-mrow div { aspect-ratio: 3/4; border-radius: 12px; overflow: hidden; background: var(--tile); box-shadow: inset 0 0 0 1px rgba(255,255,255,.08); }
          .hx1-mrow img { width: 100%; height: 100%; object-fit: cover; display: block; }
        }
        @media (prefers-reduced-motion: reduce) {
          .oc1-in { animation: none; }
          .hx1-doodle path { animation: none; stroke-dashoffset: 0; }
          .rw-w { transition: none; }
        }
      `}</style>
    </section>
  );
}
