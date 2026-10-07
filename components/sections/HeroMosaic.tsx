"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import { withBasePath } from "@/lib/assets";
import { DEMO_HREF, START_HREF } from "@/lib/links";
import { PlatformStrip } from "@/components/sections/Platform";

/**
 * Mosaic hero (/hero-5; Hamza, 7 Oct, after an editorial report cover): a
 * band of irregular image cells across the top, the headline set large in
 * the right half beneath it, a short lede and the actions on the left, and a
 * quiet footer line. Dark (Hamza, 7 Oct): the section carries
 * data-theme="dark", so its tokens are the dark set; the strip below is light.
 *
 * Every FLIP_EVERY ms the band turns over: each cell flips on its vertical
 * axis to a new use-case still, in a wave from left to right (FLIP_STAGGER ms
 * apart), and the whole band changes theme at once: Photography, Fashion,
 * Product, Architecture. The hidden faces are loaded with the next theme a
 * beat before they turn, so a flip never lands on a blank. Two cells carry a
 * label naming the theme. Under reduced motion the band holds still.
 */
const FLIP_EVERY = 2000, FLIP_MS = 700, FLIP_STAGGER = 70;

/* One theme on the band at a time (Hamza, 7 Oct: "same category of images
   at a time"). Each theme has at least as many stills as the band has cells,
   so a turn never repeats an image; the use-case stills are topped up from
   the globe's set where a category ran short. */
const uc = (dir: string, ns: number[]) => ns.map((n) => `/media/use-cases/${dir}/${n}.jpg`);
const THEMES: { tag: string; srcs: string[] }[] = [
  {
    tag: "Photography",
    srcs: [...uc("photography", [1, 2, 3, 5, 7, 8, 9, 10, 11]), ...["travel", "coast-road", "sprinter", "film-noir", "beauty"].map((n) => `/media/hero/globe/${n}.jpg`)],
  },
  {
    tag: "Fashion",
    srcs: [
      ...uc("try-on", [1, 2, 3, 4, 5, 6]), ...uc("style-transfer", [1, 2, 3, 4]),
      ...[9, 12, 13, 15, 17, 18].map((n) => `/media/hero/mosaic/m${n}.jpg`),
      "/media/hero/globe/fashion-dress.jpg", "/media/hero/corridor/fashion.jpg", "/media/outcomes/brand.jpg",
    ],
  },
  {
    tag: "Product",
    srcs: [
      ...uc("product", [1, 2, 3, 4]),
      ...["perfume", "ring", "cocktail", "burger", "car"].map((n) => `/media/hero/globe/${n}.jpg`),
      "/media/outcomes/advertising.jpg", "/media/outcomes/product.jpg", "/media/hero/corridor/beauty.jpg", "/media/hero/corridor/food-beverage.jpg",
    ],
  },
  {
    tag: "Architecture",
    srcs: [
      ...uc("architecture", [1, 2, 3, 4, 8, 10, 11]),
      "/media/hero/globe/house.jpg", "/media/hero/globe/interior.jpg", "/media/hero/corridor/home-decor.jpg", "/media/use-cases/branding/8.jpg",
    ],
  },
];

/* The band's cells, by grid area (see .hm-band). Two carry labels. */
const CELLS: { area: string; label?: boolean }[] = [
  { area: "a" }, { area: "b", label: true }, { area: "c" }, { area: "d" }, { area: "e", label: true },
  { area: "f" }, { area: "g" }, { area: "h" }, { area: "i" }, { area: "j" }, { area: "k" },
];

/** A deterministic shuffle, so server and client agree on the first frame. */
function shuffled<T>(xs: T[]): T[] {
  const out = xs.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const x = Math.sin((i + 1) * 127.1) * 43758.5453;
    const j = Math.floor((x - Math.floor(x)) * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
/* Each theme's stills, shuffled once. */
const POOLS = THEMES.map((t) => shuffled(t.srcs));
/** The band for a visit to a theme: one still per cell, the window moving
    on each visit so a theme comes back with a different selection. */
const bandFor = (visit: number) => {
  const t = visit % THEMES.length, pool = POOLS[t], round = Math.floor(visit / THEMES.length);
  return CELLS.map((_, i) => pool[(round * CELLS.length + i) % pool.length]);
};

type Face = { front: string; back: string; flipped: boolean };

export function HeroMosaic() {
  const n = CELLS.length;
  // The front shows visit 0, the back is loaded with visit 1.
  const [faces, setFaces] = useState<Face[]>(() => {
    const a = bandFor(0), b = bandFor(1);
    return CELLS.map((_, i) => ({ front: a[i], back: b[i], flipped: false }));
  });
  /** The visit now showing. */
  const [visit, setVisit] = useState(0);
  const next = useRef(2);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Warm the cache so every theme's first turn has its images.
    POOLS.flat().forEach((src) => { const im = new Image(); im.src = withBasePath(src); });
    let preload: ReturnType<typeof setTimeout>;
    const id = setInterval(() => {
      // Turn every cell over to the next theme; once it has turned, load the
      // theme after that onto the faces now hidden.
      setFaces((fs) => fs.map((f) => ({ ...f, flipped: !f.flipped })));
      setVisit((v) => v + 1);
      preload = setTimeout(() => {
        const band = bandFor(next.current++);
        setFaces((fs) => fs.map((f, i) => (f.flipped ? { ...f, front: band[i] } : { ...f, back: band[i] })));
      }, FLIP_MS + FLIP_STAGGER * n + 50);
    }, FLIP_EVERY);
    return () => { clearInterval(id); clearTimeout(preload); };
  }, [n]);

  return (
    <>
      <section id="top" className="hm" data-theme="dark">
        <div className="hm-band" aria-hidden>
          {CELLS.map((c, i) => {
            const f = faces[i];
            // The label names the theme on each face: the one showing, and
            // the one coming next on the hidden side.
            const showing = THEMES[visit % THEMES.length].tag, coming = THEMES[(visit + 1) % THEMES.length].tag;
            const front = { src: f.front, tag: f.flipped ? coming : showing };
            const back = { src: f.back, tag: f.flipped ? showing : coming };
            return (
              <div key={c.area} className="hm-cell" data-area={c.area} style={{ gridArea: c.area }}>
                <div className={`hm-card ${f.flipped ? "hm-flipped" : ""}`} style={{ transitionDelay: `${i * FLIP_STAGGER}ms` }}>
                  {[front, back].map((s, side) => (
                    <div key={side} className={`hm-face ${side ? "hm-back" : ""}`}>
                      <img src={withBasePath(s.src)} alt="" loading={i < 6 ? "eager" : "lazy"} decoding="async" />
                      {c.label && <span className="hm-tag">{s.tag}</span>}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="hm-body">
          <div className="hm-left">
            <p className="hm-lede">
              Every leading model for image, video and audio in one workspace, with your brand held
              across every output and the security your organisation needs.
            </p>
            <div className="hm-actions">
              <a href={START_HREF} className="hm-primary">Start creating for free</a>
              <a href={DEMO_HREF} className="hm-secondary">Contact sales</a>
            </div>
          </div>
          <h1 className="hm-title">One workspace for your content generations</h1>
        </div>

        <div className="hm-foot">
          <span className="hm-mono">ImagineArt · the AI creative platform</span>
          <span className="hm-scroll">Scroll to explore</span>
          <span className="hm-arrow" aria-hidden>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2v12M3 9l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
        </div>
      </section>

      <div className="hm-strip">
        <div className="container-page">
          <PlatformStrip />
        </div>
      </div>

      <style>{`
        .hm {
          position: relative;
          min-height: 100vh;
          padding-top: 64px;
          display: flex;
          flex-direction: column;
          background: var(--page-bg);
          color: var(--ink-heading);
        }
        /* The band: two tall rows and one short, cells of uneven width, a
           hairline of page colour between them. */
        .hm-band {
          display: grid;
          height: clamp(320px, 52vh, 600px);
          grid-template-columns: 20fr 7fr 14fr 22fr 25fr 12fr;
          grid-template-rows: 1fr 1fr 1fr;
          grid-template-areas:
            "a b c d e e"
            "a b c d f f"
            "g g h i j k";
          gap: 2px;
          perspective: 1400px;
        }
        .hm-cell { position: relative; min-width: 0; min-height: 0; }
        .hm-card {
          position: absolute; inset: 0;
          transform-style: preserve-3d;
          transition: transform ${FLIP_MS}ms cubic-bezier(0.65, 0, 0.35, 1);
        }
        .hm-flipped { transform: rotateY(180deg); }
        .hm-face { position: absolute; inset: 0; overflow: hidden; backface-visibility: hidden; -webkit-backface-visibility: hidden; background: var(--tile); }
        .hm-back { transform: rotateY(180deg); }
        .hm-face img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .hm-tag {
          position: absolute; left: 0; bottom: 0;
          padding: 5px 9px;
          background: var(--page-bg);
          font-family: var(--font-mono);
          font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase;
          color: var(--ink-2);
        }

        .hm-body {
          flex: 1;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1.25fr);
          gap: clamp(24px, 4vw, 64px);
          padding: clamp(20px, 2.4vw, 32px) clamp(16px, 1.6vw, 24px) 0;
        }
        .hm-lede { max-width: 30em; font-size: clamp(16px, 1.3vw, 20px); line-height: 1.4; color: var(--ink-heading); }
        .hm-actions { margin-top: 24px; display: flex; flex-wrap: wrap; gap: 10px; }
        .hm-primary, .hm-secondary {
          display: inline-flex; align-items: center; height: 46px; padding: 0 20px;
          border-radius: var(--radius-pill); font-size: 15px; font-weight: 500; white-space: nowrap;
          transition: background var(--dur-fast) ease, opacity var(--dur-fast) ease;
        }
        .hm-primary { background: var(--brand); color: #fff; }
        .hm-primary:hover { background: var(--brand-deep); }
        .hm-secondary { color: var(--ink-heading); border: 1px solid var(--line-strong); }
        .hm-secondary:hover { background: var(--tile); }
        .hm-primary:focus-visible, .hm-secondary:focus-visible { outline: 2px solid var(--ink-heading); outline-offset: 3px; }
        .hm-title {
          /* Sized to fit the hero in one screen (Hamza, 7 Oct): by width and by height, whichever is tighter. */
          font-size: clamp(34px, min(4.6vw, 8.2vh), 88px);
          line-height: 0.98;
          font-weight: 600;
          letter-spacing: -0.04em;
          color: var(--ink-heading);
          text-wrap: balance;
        }

        .hm-foot {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1.25fr) auto;
          align-items: end;
          gap: clamp(24px, 4vw, 64px);
          padding: 24px clamp(16px, 1.6vw, 24px) 20px;
        }
        .hm-mono { font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--ink-2); }
        .hm-scroll { font-size: 15px; color: var(--ink-heading); }
        .hm-arrow { color: var(--ink-heading); display: inline-flex; }

        .hm-strip { padding-top: clamp(40px, 5vw, 72px); padding-bottom: clamp(48px, 7vh, 88px); }

        @media (max-width: 760px) {
          .hm-band {
            height: 46vh;
            grid-template-columns: 1fr 1fr 1fr;
            grid-template-rows: 1fr 1fr 1fr;
            grid-template-areas: "a b c" "d e e" "f g h";
          }
          .hm-cell[data-area="i"], .hm-cell[data-area="j"], .hm-cell[data-area="k"] { display: none; }
          .hm-body { grid-template-columns: 1fr; }
          .hm-title { order: -1; }
          .hm-foot { grid-template-columns: 1fr auto; }
          .hm-scroll { display: none; }
        }
        @media (prefers-reduced-motion: reduce) { .hm-card { transition: none; } }
      `}</style>
    </>
  );
}
