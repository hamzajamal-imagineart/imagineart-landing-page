"use client";

import { useEffect, useRef, useState } from "react";
import { withBasePath } from "@/lib/assets";
import { START_HREF } from "@/lib/links";
import { SlidingIndicator, slidingIndicatorCss, useSlidingIndicator } from "@/components/primitives/SlidingIndicator";
import { BlurHeading } from "@/components/BlurHeading";

/**
 * Hero, on the ElevenLabs pattern, pared down.
 *
 * A centred column over the mosaic: headline, copy, one CTA. Below it a 16:9
 * panel holding a single clip edge to edge, with the mode chips floating on
 * the footage.
 */
/**
 * The hero's mode strip.
 *
 * Six modes, selected by the chip row floating on the panel. Each mode owns a
 * list of clips: most have one, and **Image has four**, played one after the
 * other, because there is no single recording of what the image tools do.
 *
 * Workflows, Agent, Video and the Image set are the product's own recordings,
 * pulled local under `hero/modes/` rather than streamed. Four of the sources
 * were served as `.webm` but are MP4 payloads; they are stored with the
 * extension that matches what is inside them, since the static server sets
 * the media type from the extension and a lying one stops some browsers
 * playing the file at all.
 *
 * Music and Computer borrow footage already on the page.
 */
const IMAGE_SET = [
  "/media/hero/modes/image/1-text-to-image.mp4",
  "/media/hero/modes/image/2-camera-angles.mp4",
  "/media/hero/modes/image/3-models.mp4",
  "/media/hero/modes/image/4-references.mp4",
];

const VIDEO_SET = [
  "/media/hero/modes/video/1-prompt.mp4",
  "/media/hero/modes/video/2-fashion.mp4",
  "/media/hero/modes/video/3-bike.mp4",
];

/**
 * `audio` is set per entry rather than sniffed: there is no portable way to
 * ask a video whether it carries an audio track, and the guesses that exist
 * are per-engine. These three were read off the files' own `soun` handlers.
 * A mode without it gets no control bar rather than a dead one.
 */
const MODES = [
  { id: "image", label: "Image", videos: IMAGE_SET, audio: false },
  { id: "video", label: "Video", videos: VIDEO_SET, audio: false },
  { id: "music", label: "Music", videos: [], audio: false, wall: true },
  { id: "workflows", label: "Workflows", videos: ["/media/hero/modes/workflows.mp4"], audio: true },
  { id: "agent", label: "Agents", videos: ["/media/hero/modes/agent.mp4"], audio: true },
  { id: "computer", label: "Computer", videos: ["/media/hero/computer.mp4"], audio: true },
];

/**
 * The Music mode is not a clip: it is four cards of real tracks, paged.
 *
 * A recording of the music tool shows a waveform moving, which says nothing
 * about what it produced. Cards let you hear four different pieces, which is
 * the whole claim. Each card owns its play button; one <audio> element serves
 * all of them, so starting one stops whatever was playing.
 *
 * Artwork and avatars are the product's own, pulled local and downscaled
 * (`sips -s format jpeg -Z 440` / `-Z 48`) — the originals are 1024px and
 * 146KB each against a card 260px wide. **The songs still stream from
 * `imagine.animagic.art`**, at about 960KB each, which is why they are not
 * local: sixteen of them is 15MB.
 */
const TRACKS = [
  { n: 1, title: "Starry Night", by: "Anya Sharma" },
  { n: 2, title: "Urban Echoes", by: "Kenji Tanaka" },
  { n: 3, title: "Crimson Tide", by: "Ingrid Dubois" },
  { n: 4, title: "Silent Whispers", by: "Zara Petrova" },
  { n: 5, title: "Lost in Translation", by: "Javier Ramirez" },
  { n: 6, title: "Emerald Green", by: "Chloe Dubois" },
  { n: 7, title: "Neon Lights", by: "Rohan Patel" },
  { n: 8, title: "Galactic Symphony", by: "Lars Olsen" },
  { n: 9, title: "Desert Wind", by: "Amara Osei" },
  { n: 10, title: "Midnight Drive", by: "Maya Chen" },
  { n: 11, title: "Electric Dreams", by: "Diego Vega" },
  { n: 12, title: "Ocean Breeze", by: "Sofia Andersen" },
  { n: 13, title: "City Never Sleeps", by: "Marcus Williams" },
  { n: 14, title: "Northern Lights", by: "Elena Vasquez" },
  { n: 15, title: "Vapor Trail", by: "Nadia Kowalski" },
  { n: 16, title: "Broken Glass", by: "Ryan O'Brien" },
];

const SONG = (n: number) => `https://imagine.animagic.art/imagine-one/audio/music/songs/${n}.mp3`;

const Chevron = ({ back }: { back?: boolean }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden
    style={back ? { transform: "scaleX(-1)" } : undefined}>
    <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * Four track cards and a chevron each side.
 *
 * Pages by a whole row rather than one card, so the set you are looking at is
 * always a clean four and nothing slides half out of the frame. The chevrons
 * stop at the ends instead of wrapping: with sixteen tracks a wrap reads as a
 * glitch, where a disabled chevron reads as the end of the list.
 */
function MusicWall() {
  const PER = 4;
  const [page, setPage] = useState(0);
  const [playing, setPlaying] = useState<number | null>(null);
  const audio = useRef<HTMLAudioElement | null>(null);
  const pages = Math.ceil(TRACKS.length / PER);
  const shown = TRACKS.slice(page * PER, page * PER + PER);

  // One element for every card, so starting a track stops the last one with
  // no bookkeeping, and only one file is ever in flight.
  useEffect(() => {
    const a = audio.current;
    if (!a) return;
    if (playing === null) { a.pause(); return; }
    a.load();
    void a.play().catch(() => setPlaying(null));
  }, [playing]);

  return (
    <div className="hc-music">
      <button
        type="button"
        className="hc-nav"
        aria-label="Previous tracks"
        disabled={page === 0}
        onClick={() => setPage((p) => Math.max(0, p - 1))}
      >
        <Chevron back />
      </button>

      <ul className="hc-cards">
        {shown.map((t) => (
          <li key={t.n} className="hc-card">
            <div className="hc-art">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={withBasePath(`/media/music/art/${t.n}.jpg`)} alt="" aria-hidden />
              <button
                type="button"
                className="hc-play"
                aria-label={playing === t.n ? `Pause ${t.title}` : `Play ${t.title}`}
                aria-pressed={playing === t.n}
                onClick={() => setPlaying((cur) => (cur === t.n ? null : t.n))}
              >
                {playing === t.n ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <rect x="6" y="5" width="4" height="14" rx="1" />
                    <rect x="14" y="5" width="4" height="14" rx="1" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M8 5.5v13l11-6.5z" />
                  </svg>
                )}
              </button>
            </div>
            <p className="hc-track">{t.title}</p>
            <p className="hc-by">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={withBasePath(`/media/music/avatar/${t.n}.jpg`)} alt="" aria-hidden />
              by {t.by}
            </p>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="hc-nav"
        aria-label="More tracks"
        disabled={page >= pages - 1}
        onClick={() => setPage((p) => Math.min(pages - 1, p + 1))}
      >
        <Chevron />
      </button>

      {playing !== null && (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <audio ref={audio} src={SONG(playing)} onEnded={() => setPlaying(null)} preload="none" />
      )}
    </div>
  );
}

const fmtTime = (t: number) => {
  if (!Number.isFinite(t)) return "0:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
};

/**
 * The panel: one clip, full width, and the chip row floating over it.
 *
 * Single-source, so there is nothing here to load twice: the earlier version
 * showed five cards at once, which meant five <video> elements on one URL
 * firing five range requests in the same millisecond, none of them able to
 * hit the cache the others were still filling.
 */
function ModeStrip({ live }: { live: boolean }) {
  const [card, setCard] = useState(0);
  /** Which clip of the selected mode is playing. Only Image has more than one. */
  const [shot, setShot] = useState(0);
  const chips = useSlidingIndicator<HTMLButtonElement>(card);
  const clip = useRef<HTMLVideoElement | null>(null);
  const seek = useRef<HTMLInputElement | null>(null);
  const time = useRef<HTMLSpanElement | null>(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [scrubbing, setScrubbing] = useState(false);

  const mode = MODES[card];
  const wall = !!mode.wall;
  const src = wall ? "" : mode.videos[shot % mode.videos.length];
  const single = mode.videos.length === 1;

  const pick = (i: number) => { setCard(i); setShot(0); setMuted(true); };

  /**
   * Play whenever the source changes, not only on mount.
   *
   * The <video> carries `autoPlay`, but that attribute only fires when the
   * element first enters the document: swapping `src` on the element React
   * already has in the tree leaves it loaded and paused, which is why picking
   * a chip stopped the panel dead. `load()` then `play()` restarts it. The
   * element is also keyed on the source, so a mode change remounts it and
   * nothing of the previous clip's buffer is carried over.
   */
  useEffect(() => {
    const v = clip.current;
    if (!v) return;
    if (!live || !src) { v.pause(); return; }
    v.load();
    void v.play().catch(() => {});
  }, [live, src]);

  /**
   * The control bar's readouts, written straight to the DOM.
   *
   * `timeupdate` fires about four times a second; putting the position in
   * state would re-render the whole hero that often for a bar that only moves
   * visually. Re-armed on `src` because the element is keyed on it, so each
   * clip gets a freshly mounted node to listen to.
   */
  useEffect(() => {
    const v = clip.current;
    if (!v) return;
    const onTime = () => {
      if (scrubbing) return;
      if (seek.current) seek.current.value = String(v.duration ? (v.currentTime / v.duration) * 100 : 0);
      if (time.current) time.current.textContent = `${fmtTime(v.currentTime)} / ${fmtTime(v.duration)}`;
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("loadedmetadata", onTime);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    onTime();
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("loadedmetadata", onTime);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
    };
  }, [src, scrubbing]);

  const togglePlay = () => {
    const v = clip.current;
    if (!v) return;
    if (v.paused) void v.play().catch(() => {});
    else v.pause();
  };

  /** Sound is opt-in: autoplay with sound is blocked everywhere, so every
      clip starts muted and the bar is the only way to turn it on. */
  const toggleMuted = () => {
    const v = clip.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const scrub = (value: string) => {
    const v = clip.current;
    if (!v || !v.duration) return;
    v.currentTime = (Number(value) / 100) * v.duration;
    if (time.current) time.current.textContent = `${fmtTime(v.currentTime)} / ${fmtTime(v.duration)}`;
  };

  const onChipKey = (e: React.KeyboardEvent) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const next = (card + d + MODES.length) % MODES.length;
    pick(next);
    document.getElementById(`hero-chip-${MODES[next].id}`)?.focus();
  };

  return (
    <div className="hc">
      <div className="hc-stage" id={`hero-card-${mode.id}`}>
        {wall ? <MusicWall /> : (<>
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          key={src}
          ref={clip}
          src={withBasePath(src)}
          title={`${mode.label} in ImagineArt`}
          autoPlay
          muted
          loop={single}
          playsInline
          preload="auto"
          disablePictureInPicture
          /* A mode with several clips runs them in order and comes back to
             the first; one with a single clip loops on the element instead,
             so there is no state change per repeat. */
          onEnded={single ? undefined : () => setShot((n) => (n + 1) % mode.videos.length)}
        />

        {/* Only a mode that actually carries sound gets a bar: on the silent
            ones there is nothing here a viewer needs, and a scrubber over
            looping b-roll is chrome for its own sake. Revealed on hover, and
            on focus-within so it does not vanish from under a keyboard user
            mid-scrub; always visible where there is no hover to speak of. */}
        {mode.audio && (
          <div className="hc-controls">
            <button
              type="button"
              className="hc-btn"
              aria-label={playing ? "Pause video" : "Play video"}
              onClick={togglePlay}
            >
              {playing ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <rect x="6" y="5" width="4" height="14" rx="1" />
                  <rect x="14" y="5" width="4" height="14" rx="1" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M8 5.5v13l11-6.5z" />
                </svg>
              )}
            </button>

            <input
              ref={seek}
              className="hc-seek"
              type="range"
              min="0"
              max="100"
              step="0.1"
              defaultValue="0"
              aria-label="Seek"
              onPointerDown={() => setScrubbing(true)}
              onPointerUp={() => setScrubbing(false)}
              onBlur={() => setScrubbing(false)}
              onChange={(e) => scrub(e.target.value)}
            />

            <span ref={time} className="hc-time">0:00 / 0:00</span>

            <button
              type="button"
              className="hc-btn"
              aria-label={muted ? "Unmute video" : "Mute video"}
              aria-pressed={!muted}
              onClick={toggleMuted}
            >
              {muted ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M11 5 6 9H3v6h3l5 4z" />
                  <path d="M17 9l4 6M21 9l-4 6" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M11 5 6 9H3v6h3l5 4z" />
                  <path d="M16 8.5a4 4 0 0 1 0 7M18.5 6a7 7 0 0 1 0 12" />
                </svg>
              )}
            </button>
          </div>
        )}
        </>)}
      </div>

      <div
        className="hc-chips"
        role="tablist"
        aria-label="ImagineArt modes"
        onKeyDown={onChipKey}
        ref={chips.containerRef as React.Ref<HTMLDivElement>}
      >
        <SlidingIndicator box={chips.box} ready={chips.ready} className="hc-chip-fill" />
        {MODES.map((c, i) => (
          <button
            key={c.id}
            ref={(el) => { chips.itemRefs.current[i] = el; }}
            id={`hero-chip-${c.id}`}
            role="tab"
            type="button"
            aria-selected={i === card}
            aria-controls={`hero-card-${c.id}`}
            tabIndex={i === card ? 0 : -1}
            className={`hc-chip ${i === card ? "hc-chip-on" : ""}`}
            onClick={() => pick(i)}
          >
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * The hero's ground: a mosaic of work, run edge to edge behind the copy.
 *
 * The tiles are eighteen pieces of work, downscaled to 440px wide in
 * `hero/mosaic/` — 568KB for the set, where the originals are several MB and
 * would render at a fraction of their size. Rebuild with `sips -Z 440` if the
 * set changes, and update MOSAIC's length to match.
 *
 * Laid out in CSS columns rather than a grid: the tiles are a mix of 1:1,
 * 3:4 and 9:16, and columns let each keep its own ratio and pack, which is
 * what makes the edges ragged rather than a tidy grid of equal boxes.
 */
const MOSAIC = Array.from({ length: 18 }, (_, i) => `/media/hero/mosaic/m${i + 1}.jpg`);

export function Hero() {
  /**
   * The mosaic is sharp at the top of the page and blurs once you move.
   *
   * At rest the work should be legible as work; the moment the page starts
   * scrolling it is only a ground, and the blur takes the hard edges out from
   * under the copy. Armed from a passive effect and seeded from the current
   * scroll position, so a reload partway down starts blurred; never from
   * requestAnimationFrame, which is suspended in a background tab (§4). With
   * no JS at all the mosaic simply stays sharp, which is the state that needs
   * no explanation.
   */
  const [moved, setMoved] = useState(false);
  const frame = useRef<HTMLDivElement | null>(null);

  /**
   * One listener for both scroll effects: the mosaic's blur, and the panel
   * growing to full size as the page moves.
   *
   * The growth is written straight to the element as a custom property rather
   * than held in state, so a scroll does not re-render the section on every
   * frame. The panel starts a tenth under size and reaches full size half a
   * screen down; with no JS it simply stays at its starting size, which is a
   * slightly smaller panel and not a broken one.
   */
  useEffect(() => {
    const onScroll = () => {
      setMoved(window.scrollY > 24);
      const p = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.5)));
      frame.current?.style.setProperty("--grow", String(0.9 + 0.1 * p));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);


  return (
    <section id="top" className="hero-section">
      {/* No <SectionGlow> here. It sat above the mosaic and poured white
          light into the middle of the section, which is exactly where the
          headline is: it was working against the scrim. The mosaic gives the
          section its interest now. */}
      {/* The ground, and the scrim that makes the copy legible over it. */}
      <div className="hero-bg" aria-hidden>
        <div className={`hero-mosaic ${moved ? "hero-mosaic-soft" : ""}`}>
          {MOSAIC.map((src) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={src} src={withBasePath(src)} alt="" />
          ))}
        </div>
        <span className="hero-bg-scrim" />
      </div>
      <div className="container-page">
        {/* One centred column: heading, copy, actions. */}
        <div className="hero-top">
          <BlurHeading
            as="h1"
            className="display hero-h1"
            lead="Imagine, design, animate,"
            muted="edit. One platform."
            mutedClassName=""
            lineBreak
          />
          <p className="hero-copy">
            ImagineArt is the best AI creative suite that generates images, videos,
            shorts, and voice from text prompt. Built for creators, teams and the
            developers shipping alongside them.
          </p>
          <div className="hero-actions">
            <a href={START_HREF} className="hero-cta">
              Start creating for free
              <svg className="hero-cta-go" width="13" height="12" viewBox="0 0 12 11" fill="none" aria-hidden>
                <path d="M11.17 5.5H1M7.75 10l3.585-3.97c.53-.53.54-.52 0-1.06L7.75 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </a>
          </div>
        </div>

        <div className="hero-frame" ref={frame}>
          <ModeStrip live />
        </div>
      </div>

      <style>{`
        /* Hosts the mosaic at z-index -2. */
        .hero-section {
          position: relative;
          isolation: isolate;
          padding-top: clamp(168px, 20vh, 232px);
          padding-bottom: clamp(40px, 6vh, 72px);
        }
        .hero-bg {
          position: absolute;
          inset: 0;
          z-index: -2;
          overflow: hidden;
          pointer-events: none;
        }
        .hero-mosaic {
          column-count: 6;
          column-gap: 8px;
          padding: 8px;
          /* Taller than the section so the columns are always cut off rather
             than running out partway down and leaving a bald foot. */
          height: 130%;
          /* The scale is not decoration: a blurred layer samples transparent
             past its own edges, so without it the mosaic haloes along every
             edge of the section once .hero-mosaic-soft is on. It stays on at
             all times rather than arriving with the blur, so nothing shifts
             at the moment the blur does. */
          transform: scale(1.09);
          transform-origin: center top;
          transition: filter 420ms ease;
        }
        /* Set by <Hero> once the page has moved: sharp at rest so the work
           reads as work, soft the moment it becomes only a ground. What the
           blur buys for legibility is smaller than the scrim's pool below —
           swept against the real mosaic, blurring from 9px to 24px moved the
           worst case behind the headline by 0.3, where widening the pool
           moved it by 2 — but it is what stops hard edges cutting through the
           letterforms. */
        .hero-mosaic-soft { filter: blur(14px); }
        .hero-mosaic img {
          display: block;
          width: 100%;
          margin-bottom: 8px;
          border-radius: 10px;
          break-inside: avoid;
        }
        /* Heavy, because the tiles are faces and bright grounds and the copy
           is centred right over the middle of them. Three layers: a flat wash
           over the whole mosaic, a heavier pool behind the copy, and the fade
           to --page-bg that lands the foot of the section on the page so the
           seam into Partners stays invisible. */
        .hero-bg-scrim {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(rgba(9, 9, 11, 0.46), rgba(9, 9, 11, 0.46)),
            /* Wide on purpose. Sweeping this against the real mosaic, the
               pool's size is what carries legibility and the blur barely
               registers: 64%x48% gave 11.2:1 behind the headline, 80%x62%
               gave 13.2:1 and halved the variation across the text box, while
               blurring 9px to 24px moved the worst case by 0.3. The pool has
               to be wider than the copy, not tighter. */
            radial-gradient(80% 62% at 50% 32%, rgba(9, 9, 11, 0.86) 0%, rgba(9, 9, 11, 0.52) 62%, rgba(9, 9, 11, 0.12) 100%),
            linear-gradient(to bottom, rgba(9, 9, 11, 0.46) 0%, rgba(9, 9, 11, 0.18) 28%, rgba(9, 9, 11, 0.55) 72%, var(--page-bg) 98%);
        }
        .hero-section .container-page { position: relative; z-index: 1; }
        .hero-top {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .hero-h1 {
          font-size: clamp(36px, 5.2vw, 72px);
          line-height: 1.04;
          letter-spacing: -0.025em;
          text-align: center;
          text-wrap: initial;
        }
        /* Flat white, not the page's gradient heading: one ink at one weight,
           as the rest of the hero now is. .display paints its text
           transparent to carry that gradient, so the fill has to be set as
           well as the colour, and the halo goes with it. */
        .hero-h1, .hero-h1 span {
          font-weight: 500;
          color: var(--ink-heading);
          background: none;
          -webkit-text-fill-color: var(--ink-heading);
          text-shadow: none;
        }
        .hero-copy {
          font-size: clamp(16px, 1.25vw, 18px);
          line-height: 1.6;
          color: var(--ink-2);
          max-width: 56ch;
          margin-top: 20px;
        }
        .hero-actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin-top: 28px; }
        /* The CTA, built from the supplied SVG rather than approximated.
           The shape is 48 tall on an 18 radius; the fill is that SVG's radial
           gradient, whose rx and ry were 161.58 and 125.29 against a 255x48
           button, so 63% and 261%; the two glows are its drop shadows, both
           #8A3FFC at 15% (stdDeviation 6 and 12, which is 12px and 24px of
           CSS blur); and the lip is its inner shadow, offset up 4 with no
           blur, which lands as a 4px band inside the bottom edge. */
        .hero-cta {
          display: inline-flex;
          align-items: center;
          gap: 11px;
          height: 56px;
          /* The 4px lip eats the bottom of the button, so the visible face is
             the top 52px. Centring on the box put the label below the middle
             of what you actually see; this pads it back up. */
          padding: 0 32px 4px;
          border-radius: 21px;
          font-size: 16.5px;
          font-weight: 500;
          letter-spacing: -0.005em;
          white-space: nowrap;
          color: #fff;
          background: radial-gradient(63% 261% at 50% 50%, #8A3FFC 30.29%, #8A3FFC 63.46%, #491D8B 100%);
          box-shadow:
            0 6px 12px rgba(138, 63, 252, 0.15),
            0 12px 24px rgba(138, 63, 252, 0.15),
            inset 0 -4px 0 #491D8B;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .hero-cta:hover {
          box-shadow:
            0 8px 16px rgba(138, 63, 252, 0.26),
            0 16px 32px rgba(138, 63, 252, 0.22),
            inset 0 -4px 0 #491D8B;
        }
        .hero-cta:active { transform: translateY(1px); }
        .hero-cta-go { flex: 0 0 auto; }

        /* The clip fills the frame: no padding, no inner chrome. The chips
           float on top of it rather than sitting on a band below, which is
           what was eating the bottom of the panel. */
        .hero-frame {
          position: relative;
          margin-top: clamp(20px, 3vh, 36px);
          /* A wide white rule at 20%: the frame reads as a lit edge around
             the clip rather than a hairline. border-box keeps the panel's
             outer size, so the clip loses 8px a side rather than the layout
             moving. */
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: var(--radius-6);
          background: var(--tile);
          overflow: hidden;
          aspect-ratio: 16 / 9;
          /* Set by <Hero> from the scroll position. Transform rather than
             width, so the panel grows without reflowing the section under it
             on every frame; the origin is the top so it opens downward into
             the page rather than pushing back up under the copy. */
          --grow: 0.9;
          transform: scale(var(--grow));
          transform-origin: center top;
          will-change: transform;
        }
        ${slidingIndicatorCss}



        /* One clip filling the panel, with the chips floating over it. */
        /* One inset for both floating layers: the chip row sits this far
           from the top of the panel, the control bar the same distance from
           the foot, so they cannot collide however the panel is sized. */
        .hc { position: absolute; inset: 0; --hc-float: clamp(12px, 2.2%, 22px); }
        .hc-stage { position: absolute; inset: 0; overflow: hidden; background: var(--tile-2); }
        .hc-stage video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        /* Music: four track cards, a chevron each side, sitting on the
           panel's own ground rather than on footage. Padded clear of the
           chip row at the foot. */
        .hc-music {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          gap: clamp(8px, 1vw, 16px);
          padding: clamp(16px, 2.2%, 28px);
          padding-top: calc(var(--hc-float) + 68px);
          background: var(--tile);
        }
        .hc-cards {
          list-style: none;
          flex: 1 1 auto;
          min-width: 0;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: clamp(8px, 1.1vw, 16px);
          align-content: center;
        }
        .hc-card { min-width: 0; display: flex; flex-direction: column; }
        /* Portrait, not square. Four squares across a 16:9 panel leave a
           third of its height empty; 3:4 fills it and is the shape a
           playlist tile takes anyway. */
        .hc-art {
          position: relative;
          aspect-ratio: 3 / 4;
          border-radius: var(--radius-3);
          overflow: hidden;
          background: var(--tile-2);
        }
        .hc-art img { width: 100%; height: 100%; object-fit: cover; display: block; }
        /* Always on, not hover-revealed: the button is the point of the card,
           and on a phone there is no hover to reveal it with. */
        .hc-play {
          position: absolute;
          left: 50%; top: 50%;
          transform: translate(-50%, -50%);
          width: 44px; height: 44px;
          display: grid; place-items: center;
          border: 0;
          border-radius: 999px;
          color: #fff;
          background: rgba(10, 10, 11, 0.44);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          cursor: pointer;
          transition: background 160ms ease;
        }
        .hc-play:hover { background: rgba(10, 10, 11, 0.62); }
        .hc-play:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
        .hc-track {
          margin-top: 10px;
          font-size: 13.5px;
          font-weight: 500;
          letter-spacing: -0.01em;
          color: var(--ink);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .hc-by {
          margin-top: 4px;
          display: flex; align-items: center; gap: 6px;
          font-size: 12px;
          color: var(--ink-3);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .hc-by img { width: 18px; height: 18px; border-radius: 999px; flex: 0 0 auto; object-fit: cover; }
        /* The chevrons take the page's ink on the panel ground, not the fixed
           white the chips use: these sit on --tile, not on footage. */
        .hc-nav {
          flex: 0 0 auto;
          width: 34px; height: 34px;
          display: grid; place-items: center;
          border: 1px solid var(--line);
          border-radius: 999px;
          background: var(--tile-2);
          color: var(--ink);
          cursor: pointer;
          transition: background 160ms ease, opacity 160ms ease;
        }
        .hc-nav:hover:not(:disabled) { background: var(--hover-wash); }
        .hc-nav:disabled { opacity: 0.32; cursor: default; }
        .hc-nav:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }

        /* The control bar, on the modes that carry sound. Ported from the
           B2B Workflows page's VideoCard. It sat above the chip row rather
           than to the foot of the panel, where it would have landed on the
           chips; it moved back down when the chips went to the top.
           Frosted here rather than solid, unlike the chips: it is transient
           and the chips are the panel's permanent control, so the two should
           not read as the same object. */
        .hc-controls {
          position: absolute;
          left: 12px;
          right: 12px;
          bottom: var(--hc-float);
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          border-radius: 12px;
          background: rgba(10, 10, 11, 0.62);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          opacity: 0;
          transform: translateY(6px);
          transition: opacity 220ms ease, transform 220ms ease;
        }
        .hc:hover .hc-controls,
        .hc-controls:focus-within { opacity: 1; transform: translateY(0); }
        /* No hover reveal on touch, where there is no hover to speak of. */
        @media (hover: none) { .hc-controls { opacity: 1; transform: none; } }

        /* Fixed white, like the chips: these sit on footage, not on the page. */
        .hc-btn {
          flex: 0 0 auto;
          width: 26px;
          height: 26px;
          display: grid;
          place-items: center;
          border: 0;
          border-radius: 7px;
          background: rgba(255, 255, 255, 0.12);
          color: #fff;
          cursor: pointer;
          transition: background 160ms ease;
        }
        .hc-btn:hover { background: rgba(255, 255, 255, 0.22); }
        .hc-btn:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
        .hc-time {
          flex: 0 0 auto;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.01em;
          color: rgba(255, 255, 255, 0.75);
          font-variant-numeric: tabular-nums;
          white-space: nowrap;
        }
        /* The track is styled per engine; there is no cross-browser shorthand. */
        .hc-seek {
          flex: 1 1 auto;
          min-width: 0;
          height: 16px;
          margin: 0;
          appearance: none;
          -webkit-appearance: none;
          background: transparent;
          cursor: pointer;
        }
        .hc-seek::-webkit-slider-runnable-track { height: 3px; border-radius: 2px; background: rgba(255, 255, 255, 0.28); }
        .hc-seek::-moz-range-track { height: 3px; border-radius: 2px; background: rgba(255, 255, 255, 0.28); }
        .hc-seek::-webkit-slider-thumb {
          appearance: none;
          -webkit-appearance: none;
          width: 11px; height: 11px;
          margin-top: -4px;
          border: 0; border-radius: 50%;
          background: #fff;
        }
        .hc-seek::-moz-range-thumb { width: 11px; height: 11px; border: 0; border-radius: 50%; background: #fff; }
        .hc-seek:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }

        /* A solid dark bar on the clip, not glass: frosting it let whatever
           the video was doing show through the control, which read as noise
           under the labels. The hairline is what keeps its edge legible over
           a light frame as well as a dark one. */
        .hc-chips {
          position: absolute;
          left: 50%;
          top: var(--hc-float);
          transform: translateX(-50%);
          max-width: calc(100% - 24px);
          display: flex;
          justify-content: center;
          gap: 4px;
          padding: 5px;
          border-radius: 999px;
          background: rgba(10, 10, 11, 0.82);
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 8px 28px rgba(0, 0, 0, 0.36);
          overflow-x: auto;
          scrollbar-width: none;
        }
        .hc-chips::-webkit-scrollbar { display: none; }
        .hc-chip-fill {
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.92);
        }
        /* Fixed white rather than a token: these sit on the clip, not on the
           page, so they do not follow the theme. The selected one takes the
           ground colour against the near-white fill, per the pairing rule in
           §4. */
        .hc-chip {
          position: relative;
          z-index: 1;
          flex: 0 0 auto;
          border: 0;
          border-radius: 999px;
          padding: 0 16px;
          height: 34px;
          background: transparent;
          font-family: inherit;
          font-size: 13.5px;
          font-weight: 500;
          letter-spacing: -0.005em;
          color: rgba(255, 255, 255, 0.72);
          cursor: pointer;
          white-space: nowrap;
          transition: color 260ms ease;
        }
        .hc-chip:hover { color: #fff; }
        .hc-chip-on, .hc-chip-on:hover { color: #0b0b0c; }

        /* Music needs height the 16:9 panel does not have on a phone: at 375
           the panel is about 175px tall, which is shorter than a single card.
           The panel grows for this mode only and the four cards wrap to two
           by two, so a page is still the same four tracks it is on a desktop.
           :has is what lets the child mode resize its own host. */
        @media (max-width: 880px) {
          .hero-frame:has(.hc-music) { aspect-ratio: 3 / 4; }
          .hc-cards { grid-template-columns: repeat(2, minmax(0, 1fr)); align-content: center; }
          .hc-music { padding-top: calc(var(--hc-float) + 56px); }
          .hc-art { aspect-ratio: 1 / 1; }
          .hc-play { width: 38px; height: 38px; }
          .hc-nav { width: 28px; height: 28px; }
          .hc-track { font-size: 12.5px; }
        }
        @media (max-width: 880px) {
          .hc-controls { padding: 6px 10px; gap: 8px; }
          .hc-time { display: none; }
          .hc-chip { height: 30px; padding: 0 12px; font-size: 12.5px; }
          .hero-mosaic { column-count: 3; }
          .hc-chip { height: 30px; padding: 0 12px; font-size: 12.5px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hc-controls { transition: none; transform: none; }
          .hc:hover .hc-controls, .hc-controls:focus-within { transform: none; }
          .hero-mosaic { transition: none; }
          .hero-frame { transform: none; }
          .hero-mosaic { transition: none; }
        }
      `}</style>
    </section>
  );
}
