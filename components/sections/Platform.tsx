"use client";

import { useEffect, useRef, useState } from "react";
import { withBasePath } from "@/lib/assets";
import { McpPanel } from "@/components/sections/Mcp";
import { SlidingIndicator, slidingIndicatorCss, useSlidingIndicator } from "@/components/primitives/SlidingIndicator";
import { pluginHref, CREATIVE_HREF, WORKFLOWS_HREF, START_HREF } from "@/lib/links";

/**
 * The platform strip: the tabs and the panel under the hero's copy.
 *
 * It briefly became a section of its own one fold down, then came back up
 * into the hero at Hamza's request (24 Sep) — the redesign was the point, not
 * the move. What changed and stayed changed is the shape: four tabs that name
 * what the platform is rather than what it makes — **Creative Suite, Agents,
 * MCP, Plugins** — at lettered size, over a panel with the copy beside the
 * stage. It carries no heading, since the hero's is directly above it.
 *
 * Creative Suite holds Image, Video and Audio on a rail of its own, so the
 * three generators are one thing with three parts rather than three of six
 * peers. That is the same reason the tabs are large and lettered rather than
 * the small chips they were: at chip size the strip read as a filter on a
 * gallery.
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


const AGENT_CLIP = "/media/hero/modes/agent.mp4";

/** The plugin marks and anchors the Workflows tile already carries. */
const PLUGINS = [
  { icon: "photoshop", name: "Photoshop", anchor: "photoshop" },
  { icon: "premiere", name: "Premiere Pro", anchor: "premiere" },
  { icon: "aftereffects", name: "After Effects", anchor: "aftereffects" },
  { icon: "figma", name: "Figma", anchor: "figma" },
  { icon: "framer", name: "Framer", anchor: "framer" },
  { icon: "shopify", name: "Shopify", anchor: "shopify" },
];

/**
 * The Audio mode is not a clip: it is four cards of real tracks, paged. The
 * chip reads Audio (Hamza, 21 Sep) but the cards are music, which is all the
 * gallery it is drawn from has.
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
 * Image, as a coverflow of its four clips.
 *
 * The four show different ways of working an image, so they are a set rather
 * than a sequence: the centre one plays, its neighbours sit turned down
 * either side, and the chevrons under the card step the ring. When the centre
 * clip ends the next one comes in on its own (Hamza, 20 Sep), which is what
 * the plain playlist did before, only now you can see what is coming.
 *
 * All four elements stay mounted so a step has something to move to, but only
 * the centre one plays: four decoders running for three pictures nobody is
 * looking straight at is the same waste the studio reel avoids.
 */
function ImageReel({ videos }: { videos: string[] }) {
  const [active, setActive] = useState(0);
  /** Which clips have a frame. Armed from an effect, so with no JS there is
      no skeleton to clear and the cards are simply the videos. */
  const [armed, setArmed] = useState(false);
  const [ready, setReady] = useState<boolean[]>(() => videos.map(() => false));
  const clips = useRef<(HTMLVideoElement | null)[]>([]);
  const n = videos.length;

  /**
   * Armed and measured in one pass. A cached clip can reach HAVE_CURRENT_DATA
   * before React attaches its handlers, so `loadeddata` never fires for it
   * and a skeleton that only listened would sit there for good; the
   * readyState check is what catches that. Setting both flags together also
   * keeps a cached clip from flashing a skeleton for one frame.
   */
  useEffect(() => {
    setArmed(true);
    setReady((r) => r.map((v, i) => v || (clips.current[i]?.readyState ?? 0) >= 2));
  }, []);

  useEffect(() => {
    clips.current.forEach((v, i) => {
      if (!v) return;
      if (i === active) { v.currentTime = 0; void v.play().catch(() => {}); }
      else v.pause();
    });
  }, [active]);

  const step = (d: number) => setActive((a) => (a + d + n) % n);

  return (
    <div className="hc-reel">
      {videos.map((src, i) => {
        // Signed distance around the ring, so the card behind wraps to the
        // short side rather than travelling the whole way across.
        const raw = (i - active + n) % n;
        const d = raw > n / 2 ? raw - n : raw;
        return (
          <span
            key={src}
            className={`hc-slide ${d === 0 ? "hc-slide-on" : ""} ${Math.abs(d) > 1 ? "hc-slide-far" : ""}`}
            style={{ ["--d" as string]: d }}
            aria-hidden={d !== 0}
          >
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video
              ref={(el) => { clips.current[i] = el; }}
              src={withBasePath(src)}
              muted
              playsInline
              preload="auto"
              disablePictureInPicture
              onEnded={d === 0 ? () => step(1) : undefined}
              onLoadedData={() => setReady((r) => (r[i] ? r : r.map((v, k) => (k === i ? true : v))))}
              onCanPlay={() => setReady((r) => (r[i] ? r : r.map((v, k) => (k === i ? true : v))))}
            />
            {armed && <span className={`skel ${ready[i] ? "skel-off" : ""}`} aria-hidden />}
          </span>
        );
      })}

      <div className="hc-reel-nav">
        <button type="button" className="hc-round" aria-label="Previous clip" onClick={() => step(-1)}>
          <Chevron back />
        </button>
        <button type="button" className="hc-round" aria-label="Next clip" onClick={() => step(1)}>
          <Chevron />
        </button>
      </div>
    </div>
  );
}


type Item = {
  id: string;
  label: string;
  body: string;
  /** `reel` is the coverflow, `music` the track wall. */
  kind: "reel" | "music";
  videos?: string[];
};

type Tab = {
  id: string;
  label: string;
  title: string;
  body: string;
  href: string;
  cta: string;
  /** Creative Suite is the only tab with a rail of its own. */
  items?: Item[];
  kind?: "clip" | "mcp" | "plugins";
  videos?: string[];
  /** Whether the clip carries sound, so it gets the control bar. */
  audio?: boolean;
};

const TABS: Tab[] = [
  {
    id: "creative",
    label: "Creative Suite",
    title: "Pro-level production, end to end",
    body: "Start with an idea, direct the shots, add the sound. Every model and every editing tool in one place, with your brand and your characters held across all of it.",
    href: CREATIVE_HREF,
    cta: "Open the suite",
    items: [
      {
        id: "image",
        label: "Image",
        body: "Generate, edit, resize, upscale. Keep characters and brand consistent across every shot.",
        kind: "reel",
        videos: IMAGE_SET,
      },
      {
        id: "video",
        label: "Video",
        body: "Direct a shot from a prompt or a still, then extend, reframe and grade it without leaving the timeline.",
        kind: "reel",
        videos: VIDEO_SET,
      },
      {
        id: "audio",
        label: "Audio",
        body: "Score the cut and voice it. Tracks and voiceover in any style, cleared for commercial use.",
        kind: "music",
      },
    ],
  },
  {
    id: "agents",
    label: "Agents",
    title: "Hand the work over",
    body: "Describe the outcome and the agent plans the run, picks the models and tools each step needs, and brings the work back finished and on brand.",
    href: START_HREF,
    cta: "Put an agent to work",
    kind: "clip",
    videos: [AGENT_CLIP],
    audio: true,
  },
  {
    id: "mcp",
    label: "MCP",
    title: "Every tool inside your own agent",
    body: "Connect ImagineArt to Claude, ChatGPT, Cursor or your own stack once, and generate from wherever your team already works.",
    href: "https://mcp.imagine.art",
    cta: "Read the docs",
    kind: "mcp",
  },
  {
    id: "plugins",
    label: "Plugins",
    title: "Inside the apps you already use",
    body: "Photoshop, Premiere, After Effects, Figma, Framer and Shopify, with the same models and the same brand kit behind them.",
    href: WORKFLOWS_HREF,
    cta: "See the plugins",
    kind: "plugins",
  },
];


/**
 * One clip, with the skeleton and — where the file carries sound — the
 * control bar the hero panel used. Ported whole; only its host changed.
 */
function ClipPlayer({ videos, audio }: { videos: string[]; audio?: boolean }) {
  const [shot, setShot] = useState(0);
  const [armed, setArmed] = useState(false);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [scrubbing, setScrubbing] = useState(false);
  const clip = useRef<HTMLVideoElement | null>(null);
  const seek = useRef<HTMLInputElement | null>(null);
  const time = useRef<HTMLSpanElement | null>(null);

  const src = videos[shot % videos.length];
  const single = videos.length === 1;

  useEffect(() => {
    setArmed(true);
    setReady((clip.current?.readyState ?? 0) >= 2);
    const v = clip.current;
    if (!v) return;
    v.load();
    void v.play().catch(() => {});
  }, [src]);

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

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        key={src}
        ref={clip}
        className="pf-clip"
        src={withBasePath(src)}
        autoPlay
        muted
        loop={single}
        playsInline
        preload="auto"
        disablePictureInPicture
        onEnded={single ? undefined : () => setShot((n) => (n + 1) % videos.length)}
        onLoadedData={() => setReady(true)}
        onCanPlay={() => setReady(true)}
      />
      {armed && <span className={`skel ${ready ? "skel-off" : ""}`} aria-hidden />}

      {audio && (
        <div className="hc-controls">
          <button
            type="button"
            className="hc-btn"
            aria-label={playing ? "Pause video" : "Play video"}
            onClick={() => {
              const v = clip.current;
              if (!v) return;
              if (v.paused) void v.play().catch(() => {});
              else v.pause();
            }}
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
            onChange={(e) => {
              const v = clip.current;
              if (!v || !v.duration) return;
              v.currentTime = (Number(e.target.value) / 100) * v.duration;
            }}
          />

          <span ref={time} className="hc-time">0:00 / 0:00</span>

          <button
            type="button"
            className="hc-btn"
            aria-label={muted ? "Unmute video" : "Mute video"}
            aria-pressed={!muted}
            onClick={() => {
              const v = clip.current;
              if (!v) return;
              v.muted = !v.muted;
              setMuted(v.muted);
            }}
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
    </>
  );
}

/** The six plugin marks, as a grid of links rather than a clip. */
function PluginGrid() {
  return (
    <ul className="pf-plugins">
      {PLUGINS.map((p) => (
        <li key={p.icon}>
          <a href={pluginHref(p.anchor)} target="_blank" rel="noopener noreferrer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={withBasePath(`/media/plugins/${p.icon}.svg`)} alt="" aria-hidden />
            <span>{p.name}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export function PlatformStrip() {
  const [tab, setTab] = useState(0);
  const [item, setItem] = useState(0);
  const tabs = useSlidingIndicator<HTMLButtonElement>(tab);
  const t = TABS[tab];
  const rail = t.items;
  const current = rail?.[item];

  const pick = (i: number) => { setTab(i); setItem(0); };

  /**
   * The nav still links to #mcp, which is a tab here rather than a section.
   * The section carries that id so the browser scrolls to it on its own; this
   * is what selects the matching tab, on load and on every later hash change.
   */
  useEffect(() => {
    const sync = () => {
      const i = TABS.findIndex((x) => x.id === window.location.hash.slice(1));
      if (i >= 0) pick(i);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const media =
    t.kind === "mcp" ? null
    : t.kind === "plugins" ? <PluginGrid />
    : current?.kind === "music" ? <MusicWall />
    : current?.kind === "reel" ? <ImageReel key={current.id} videos={current.videos ?? []} />
    : <ClipPlayer videos={t.videos ?? []} audio={t.audio} />;

  return (
    <div id="mcp" className="pf">
      {/* No heading of its own: it sits under the hero's, and two in one fold
          is one too many. */}
      <div className="pf-shell">
      <div className="pf-tabs" role="tablist" aria-label="Platform" ref={tabs.containerRef as React.Ref<HTMLDivElement>}>
        <SlidingIndicator box={tabs.box} ready={tabs.ready} className="pf-tab-fill" />
        {TABS.map((x, i) => (
          <button
            key={x.id}
            ref={(el) => { tabs.itemRefs.current[i] = el; }}
            type="button"
            role="tab"
            aria-selected={i === tab}
            className={`pf-tab ${i === tab ? "pf-tab-on" : ""}`}
            onClick={() => pick(i)}
          >
            {x.label}
          </button>
        ))}
      </div>

        <div className="pf-panel">
        <div className={`pf-grid ${t.kind === "mcp" ? "pf-grid-wide" : ""}`}>
          {t.kind === "mcp" ? (
            <div className="pf-mcp"><McpPanel /></div>
          ) : (
            <>
              <div className="pf-copy">
                <h3 className="pf-title">{t.title}</h3>
                <p className="pf-body">{t.body}</p>
                <a className="pf-go" href={t.href} target="_blank" rel="noopener noreferrer">
                  {t.cta}
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M6 12h12M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>

                {rail && (
                  <ul className="pf-rail">
                    {rail.map((it, i) => (
                      <li key={it.id}>
                        <button
                          type="button"
                          className={`pf-rail-btn ${i === item ? "pf-rail-on" : ""}`}
                          aria-expanded={i === item}
                          onClick={() => setItem(i)}
                        >
                          <span className="pf-rail-label">{it.label}</span>
                        </button>
                        {i === item && <p className="pf-rail-body">{it.body}</p>}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="pf-media">{media}</div>
            </>
          )}
        </div>
        </div>
      </div>

      <style>{`
        .pf { isolation: isolate; }
        ${slidingIndicatorCss}

        /* Lettered tabs, not chips. At chip size this read as a filter on a
           gallery rather than as the platform's own parts. */
        /* A rail of its own beside the panel (Hamza, 24 Sep), not a row
           inside it: four names stacked in a small card, the panel alongside.
           Vertical costs SlidingIndicator nothing — it measures offsetTop as
           well as offsetLeft — so the fill travels down the rail exactly as
           it travelled across the row. */
        .pf-shell {
          display: grid;
          grid-template-columns: clamp(168px, 14vw, 208px) minmax(0, 1fr);
          gap: clamp(12px, 1.2vw, 18px);
          align-items: start;
          /* Clear of the hero's actions: at 40px the buttons and the panel
             read as one crowded stack. */
          margin-top: clamp(64px, 8vh, 96px);
        }
        .pf-tabs {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 10px;
          border-radius: var(--radius-6);
          border: 1px solid var(--line);
          background: var(--tile);
        }
        .pf-tab-fill { border-radius: var(--radius-5); background: var(--panel); box-shadow: 0 1px 2px rgba(0, 0, 0, 0.18); }
        .pf-tab {
          position: relative;
          z-index: 1;
          width: 100%;
          border: 0;
          border-radius: var(--radius-5);
          padding: 0 16px;
          height: clamp(48px, 3.6vw, 58px);
          background: transparent;
          font-family: inherit;
          font-size: clamp(14.5px, 1.1vw, 16px);
          font-weight: 500;
          letter-spacing: -0.01em;
          color: var(--ink-3);
          cursor: pointer;
          white-space: nowrap;
          transition: color 260ms ease;
        }
        .pf-tab:hover { color: var(--ink); }
        .pf-tab-on, .pf-tab-on:hover { color: var(--ink); }

        /* The tabs live inside the panel (Hamza, 24 Sep), as its header row
           rather than as a control floating above it: one object on the page
           instead of two. */
        .pf-panel {
          position: relative;
          display: flex;
          flex-direction: column;
          padding: clamp(20px, 2.4vw, 34px);
          border-radius: var(--radius-6);
          border: 1px solid var(--line);
          background: var(--tile);
          min-height: 560px;
        }
        .pf-grid {
          flex: 1;
          display: grid;
          grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
          gap: clamp(20px, 2.4vw, 36px);
          align-items: stretch;
          min-height: 0;
        }
        .pf-grid-wide { grid-template-columns: minmax(0, 1fr); }

        .pf-copy { display: flex; flex-direction: column; min-width: 0; }
        .pf-title {
          font-size: clamp(21px, 1.9vw, 27px);
          line-height: 1.22;
          font-weight: 500;
          letter-spacing: -0.02em;
          color: var(--ink-heading);
        }
        .pf-body { margin-top: 12px; font-size: 15px; line-height: 1.6; color: var(--ink-2); max-width: 44ch; }
        .pf-go {
          margin-top: 18px;
          align-self: flex-start;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
          font-size: 14.5px;
          font-weight: 500;
          color: var(--ink-heading);
          transition: opacity 200ms ease;
        }
        .pf-go:hover { opacity: 0.72; }

        /* The rail sits at the foot of the copy column, so the three parts of
           the suite read as a sub-level of the tab rather than as more tabs. */
        .pf-rail { list-style: none; margin-top: auto; padding-top: 24px; display: flex; flex-direction: column; }
        .pf-rail li + li { margin-top: 2px; }
        .pf-rail-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 0;
          border: 0;
          background: transparent;
          font-family: inherit;
          font-size: clamp(16px, 1.3vw, 19px);
          font-weight: 500;
          letter-spacing: -0.015em;
          color: var(--ink-3);
          cursor: pointer;
          text-align: left;
          transition: color 200ms ease;
        }
        .pf-rail-btn:hover { color: var(--ink); }
        .pf-rail-on { color: var(--ink-heading); }
        .pf-rail-body { font-size: 14px; line-height: 1.55; color: var(--ink-2); padding-bottom: 14px; max-width: 42ch; }
        .pf-rail li + li { box-shadow: inset 0 1px 0 var(--line); }

        /* The media half: a framed 16:9 stage, which every mode fills. */
        .pf-media {
          position: relative;
          overflow: hidden;
          border-radius: var(--radius-5);
          border: 1px solid var(--line);
          background: var(--tile-2);
          min-height: 320px;
          --hc-float: clamp(12px, 2.2%, 22px);
        }
        .pf-clip { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }

        /* Plugins: marks and names rather than footage, since there is no
           recording of a plugin that is not just the host application. */
        .pf-plugins {
          list-style: none;
          position: absolute;
          inset: 0;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          padding: clamp(14px, 1.6vw, 22px);
          align-content: center;
        }
        .pf-plugins a {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px;
          border-radius: var(--radius-4);
          background: var(--tile);
          color: var(--ink);
          font-size: 14.5px;
          font-weight: 500;
          transition: background 200ms ease;
        }
        .pf-plugins a:hover { background: var(--hover-wash); }
        .pf-plugins img { width: 22px; height: 22px; object-fit: contain; display: block; flex: 0 0 auto; }

        .pf-mcp { min-width: 0; }
        .pf-mcp .mcp-panel { border: 0; background: transparent; padding: 0; }

        /* Image: the four clips on a ring, the centre one playing and its
           neighbours turned down either side. Sits on the panel's ground, so
           the cards read as cards rather than as one clip cropped. */
        .hc-reel {
          position: absolute;
          inset: 0;
          background: var(--tile);
          perspective: 1600px;
          overflow: hidden;
        }
        .hc-slide {
          position: absolute;
          top: calc(50% - 6px);
          left: 50%;
          width: 52%;
          aspect-ratio: 16 / 9;
          border-radius: var(--radius-4);
          overflow: hidden;
          background: var(--tile-2);
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.42);
          /* Every card is flat — no rotateY. The neighbours are pushed
             clear of the centre card rather than tucked behind it: the shift
             is a share of the card's own width, so at 97% of 52% the
             neighbour's inner edge lands about 2% of the panel past the
             centre card's, which is the gap. Depth comes from the blur and
             the fade instead of from a turn. */
          transform:
            translate(-50%, -50%)
            translateX(calc(var(--d) * 97%))
            scale(0.85);
          opacity: 0.5;
          filter: blur(5px);
          z-index: 1;
          transition:
            transform 560ms cubic-bezier(0.22, 1, 0.36, 1),
            opacity 420ms ease,
            filter 420ms ease;
        }
        .hc-slide-on {
          transform: translate(-50%, -50%) scale(1);
          opacity: 1;
          filter: none;
          z-index: 2;
        }
        /* The card round the back of the ring. Held at the centre rather than
           thrown further out, so it is behind the selected card when it comes
           round and the wrap is never seen crossing the stage. */
        .hc-slide-far { opacity: 0; filter: blur(8px); transform: translate(-50%, -50%) scale(0.7); z-index: 0; }
        .hc-slide video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .hc-reel-nav {
          position: absolute;
          left: 50%;
          bottom: var(--hc-float);
          transform: translateX(-50%);
          z-index: 3;
          display: flex;
          gap: 8px;
        }
        /* Fixed white on a dark disc, like the chips: these sit over footage,
           not on the page, so they do not follow the theme. */
        .hc-round {
          width: 34px; height: 34px;
          display: grid; place-items: center;
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 999px;
          background: rgba(10, 10, 11, 0.72);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          color: #fff;
          cursor: pointer;
          transition: background 160ms ease;
        }
        .hc-round:hover { background: rgba(10, 10, 11, 0.9); }
        .hc-round:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }

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


        @media (max-width: 1000px) {
          /* The rail lies down above the panel: a 168px column beside a
             stacked panel is most of a phone. */
          .pf-shell { grid-template-columns: minmax(0, 1fr); }
          .pf-tabs {
            flex-direction: row;
            overflow-x: auto;
            scrollbar-width: none;
            padding: 6px;
            border-radius: 999px;
          }
          .pf-tabs::-webkit-scrollbar { display: none; }
          .pf-tab { width: auto; flex: 0 0 auto; border-radius: 999px; height: 44px; }
          .pf-tab-fill { border-radius: 999px; }
          .pf-panel { min-height: 0; }
          .pf-grid { grid-template-columns: minmax(0, 1fr); }
          .pf-media { aspect-ratio: 16 / 9; min-height: 0; }
          .pf-rail { margin-top: 20px; padding-top: 8px; }
        }
        @media (max-width: 880px) {
          .hc-slide { width: 72%; }
          .hc-slide:not(.hc-slide-on) { filter: blur(3px); }
          .hc-round { width: 28px; height: 28px; }
          .hc-cards { grid-template-columns: repeat(2, minmax(0, 1fr)); align-content: center; }
          .hc-art { aspect-ratio: 1 / 1; }
          .hc-play { width: 38px; height: 38px; }
          .hc-nav { width: 28px; height: 28px; }
          .hc-track { font-size: 12.5px; }
          .hc-controls { padding: 6px 10px; gap: 8px; }
          .hc-time { display: none; }
          /* The reel and the music wall both outgrow 16:9 here: at 375 a
             16:9 stage is about 165px tall, which is shorter than one card. */
          .pf-media:has(.hc-reel) { aspect-ratio: 1 / 1; }
          .pf-media:has(.hc-music) { aspect-ratio: 3 / 4; }
          .pf-plugins { grid-template-columns: minmax(0, 1fr); }
        }
        @media (prefers-reduced-motion: reduce) {
          .hc-slide { transition: none; }
          .hc-controls { transition: none; transform: none; }
        }
      `}</style>
    </div>
  );
}
