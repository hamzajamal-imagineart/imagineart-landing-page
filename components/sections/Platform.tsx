"use client";

import { useEffect, useRef, useState } from "react";
import { withBasePath } from "@/lib/assets";
import { CDN, CLIENTS, MONO_MARKS } from "@/components/sections/Mcp";
import { SlidingIndicator, slidingIndicatorCss, useSlidingIndicator } from "@/components/primitives/SlidingIndicator";
import { pluginHref } from "@/lib/links";

/**
 * The platform strip: a pill of tabs over one stage, under the hero's copy.
 *
 * Four tabs that name what the platform is rather than what it makes —
 * **Creative Suite, Agents, MCP, Plugins** — at lettered size, centred above
 * the panel. It carries no heading, since the hero's is directly above it.
 *
 * The panel is the stage and nothing else (Hamza, 24 Sep): no title, no
 * paragraph, and no Image · Video · Audio rail inside Creative Suite, whose
 * stage is now one coverflow of the image and video clips together. Copy
 * beside the stage made the tabs uneven and the strip read as a brochure;
 * the footage says it.
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

const Chevron = ({ back }: { back?: boolean }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden
    style={back ? { transform: "scaleX(-1)" } : undefined}>
    <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);


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

type Tab = {
  id: string;
  label: string;
  /** Carries the NEW tag. */
  isNew?: boolean;
  kind: "reel" | "clip" | "mcp" | "plugins";
  videos?: string[];
  /** Whether the clip carries sound, so it gets the control bar. */
  audio?: boolean;
};

const TABS: Tab[] = [
  { id: "creative", label: "Creative Suite", kind: "reel", videos: [...IMAGE_SET, ...VIDEO_SET] },
  { id: "agents", label: "Agents", kind: "clip", videos: [AGENT_CLIP], audio: true },
  { id: "mcp", label: "MCP", isNew: true, kind: "mcp" },
  { id: "plugins", label: "Plugins", kind: "plugins" },
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

/**
 * Plugins: the six marks as a 3 × 2 grid of tiles, centred on the stage. There
 * is no recording of a plugin that is not just the host application.
 */
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

/** The clients that have a connect recording; ChatGPT has none. */
const MCP_CLIENTS = CLIENTS.filter((c) => c.video);

/**
 * MCP: one client's connect recording, with the client marks as a frosted
 * row over it. The full three-step walkthrough was the whole of this stage
 * before (a second and third row of tabs inside the tab); it is still what
 * <Mcp> renders, on disk, and the docs link carries the steps from here.
 */
function McpStage() {
  const [i, setI] = useState(0);
  const [armed, setArmed] = useState(false);
  const [ready, setReady] = useState(false);
  const c = MCP_CLIENTS[i];

  useEffect(() => { setArmed(true); }, []);

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        key={c.video}
        className="pf-clip"
        src={`${CDN}/${c.video}.mp4`}
        poster={`${CDN}/${c.video}.jpg`}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        onLoadedData={() => setReady(true)}
        onCanPlay={() => setReady(true)}
      />
      {armed && <span className={`skel ${ready ? "skel-off" : ""}`} aria-hidden />}

      <div className="pf-clients" role="group" aria-label="Client">
        {MCP_CLIENTS.map((cl, k) => (
          <button
            key={cl.id}
            type="button"
            className={`pf-client ${k === i ? "pf-client-on" : ""}`}
            aria-pressed={k === i}
            aria-label={cl.label}
            title={cl.label}
            onClick={() => { if (k !== i) { setReady(false); setI(k); } }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={MONO_MARKS.has(cl.icon) ? "pf-mono" : undefined}
              src={withBasePath(`/media/mcp/clients/${cl.icon}.svg`)}
              alt=""
              aria-hidden
            />
          </button>
        ))}
      </div>
    </>
  );
}

export function PlatformStrip() {
  const [tab, setTab] = useState(0);
  const tabs = useSlidingIndicator<HTMLButtonElement>(tab);
  const t = TABS[tab];

  /**
   * The nav still links to #mcp, which is a tab here rather than a section.
   * The strip carries that id so the browser scrolls to it on its own; this
   * is what selects the matching tab, on load and on every later hash change.
   */
  useEffect(() => {
    const sync = () => {
      const i = TABS.findIndex((x) => x.id === window.location.hash.slice(1));
      if (i >= 0) setTab(i);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const stage =
    t.kind === "mcp" ? <McpStage />
    : t.kind === "plugins" ? <PluginGrid />
    : t.kind === "reel" ? <ImageReel key={t.id} videos={t.videos ?? []} />
    : <ClipPlayer videos={t.videos ?? []} audio={t.audio} />;

  return (
    <div id="mcp" className="pf">
      {/* No heading of its own: it sits under the hero's, and two in one fold
          is one too many. */}
      <div className="pf-tabs" role="tablist" aria-label="Platform" ref={tabs.containerRef as React.Ref<HTMLDivElement>}>
        <SlidingIndicator box={tabs.box} ready={tabs.ready} className="pf-tab-fill" />
        {TABS.map((x, i) => (
          <button
            key={x.id}
            ref={(el) => { tabs.itemRefs.current[i] = el; }}
            type="button"
            role="tab"
            aria-selected={i === tab}
            aria-controls="pf-stage"
            className={`pf-tab ${i === tab ? "pf-tab-on" : ""}`}
            onClick={() => setTab(i)}
          >
            {x.label}
            {x.isNew && <span className="pf-new">New</span>}
          </button>
        ))}
      </div>

      <div className="pf-panel">
        <div id="pf-stage" className="pf-stage" role="tabpanel" aria-label={t.label}>{stage}</div>
      </div>

      <style>{`
        .pf { isolation: isolate; }
        ${slidingIndicatorCss}

        /* A segmented control (Hamza, 24 Sep, to a reference): squared
           segments on a recessed track, hairline dividers between the
           unselected ones, the selected one lifted. Centred above the panel,
           and clear of the hero's actions: at 40px the buttons and the strip
           read as one stack. */
        .pf-tabs {
          position: relative;
          margin: clamp(64px, 8vh, 96px) auto 0;
          width: max-content;
          max-width: 100%;
          display: flex;
          padding: 4px;
          border-radius: 14px;
          background: var(--track);
          border: 1px solid var(--line);
          overflow-x: auto;
          scrollbar-width: none;
        }
        .pf-tabs::-webkit-scrollbar { display: none; }
        .pf-tab-fill {
          border-radius: 10px;
          background: var(--panel);
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.22), inset 0 0 0 1px var(--line);
        }
        .pf-tab {
          position: relative;
          z-index: 1;
          flex: 0 0 auto;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: 0;
          border-radius: 10px;
          padding: 0 clamp(18px, 1.7vw, 24px);
          height: 42px;
          background: transparent;
          font-family: inherit;
          font-size: 14.5px;
          font-weight: 500;
          letter-spacing: -0.01em;
          color: var(--ink-3);
          cursor: pointer;
          white-space: nowrap;
          transition: color 220ms ease;
        }
        .pf-tab:hover, .pf-tab-on, .pf-tab-on:hover { color: var(--ink); }
        /* Dividers between segments, dropped either side of the selected one
           so the lifted segment never has a line against it. */
        .pf-tab + .pf-tab::before {
          content: "";
          position: absolute;
          left: 0;
          top: 12px;
          bottom: 12px;
          width: 1px;
          background: var(--line);
          transition: opacity 220ms ease;
        }
        .pf-tab-on::before, .pf-tab-on + .pf-tab::before { opacity: 0; }
        /* Violet tint, not ink (Hamza, 24 Sep, to a reference): the one
           colour in the strip, so it reads as a flag rather than a label.
           #a78bfa on the tinted track is 5.8:1; the light theme darkens it. */
        .pf-new {
          display: inline-flex;
          align-items: center;
          height: 20px;
          padding: 0 7px;
          border-radius: 6px;
          background: rgba(139, 92, 246, 0.2);
          color: #a78bfa;
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        :root:not([data-theme="dark"]) .pf-new { background: #ede9fe; color: #6d28d9; }

        /* The panel frames the stage and holds nothing else. */
        .pf-panel {
          margin-top: clamp(20px, 2.4vw, 32px);
          padding: clamp(8px, 0.9vw, 12px);
          border-radius: var(--radius-6);
          border: 1px solid var(--line);
          background: var(--tile);
        }

        /* One ratio for every tab, so switching never moves the height. */
        .pf-stage {
          position: relative;
          overflow: hidden;
          aspect-ratio: 16 / 8;
          border-radius: var(--radius-5);
          border: 1px solid var(--line);
          background: var(--tile-2);
          --hc-float: clamp(12px, 2.2%, 22px);
        }
        .pf-clip { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }
        .pf-stage:hover .hc-controls { opacity: 1; transform: translateY(0); }

        .pf-plugins {
          list-style: none;
          position: absolute;
          inset: 0;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          grid-template-rows: repeat(2, minmax(0, 1fr));
          gap: 12px;
          padding: clamp(20px, 6%, 56px) clamp(20px, 14%, 180px);
        }
        .pf-plugins a {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 14px;
          height: 100%;
          border-radius: var(--radius-4);
          border: 1px solid var(--line);
          background: var(--tile);
          color: var(--ink-2);
          font-size: 13.5px;
          font-weight: 500;
          transition: background 200ms ease, color 200ms ease;
        }
        .pf-plugins a:hover { background: var(--hover-wash); color: var(--ink-heading); }
        .pf-plugins img { width: 36px; height: 36px; object-fit: contain; display: block; }

        /* Fixed white on a frosted dark bar: it sits on footage. */
        .pf-clients {
          position: absolute;
          left: 50%;
          bottom: var(--hc-float);
          transform: translateX(-50%);
          z-index: 3;
          display: flex;
          gap: 4px;
          padding: 5px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(10, 10, 11, 0.62);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .pf-client {
          width: 40px; height: 40px;
          display: grid; place-items: center;
          border: 0;
          border-radius: 999px;
          background: transparent;
          cursor: pointer;
          opacity: 0.5;
          transition: background 160ms ease, opacity 160ms ease;
        }
        .pf-client:hover { opacity: 0.85; }
        .pf-client-on { opacity: 1; background: rgba(255, 255, 255, 0.14); }
        .pf-client:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
        .pf-client img { width: 20px; height: 20px; object-fit: contain; display: block; }
        .pf-mono { filter: brightness(0) invert(1); }

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



        @media (max-width: 880px) {
          .hc-slide { width: 72%; }
          .hc-slide:not(.hc-slide-on) { filter: blur(3px); }
          .hc-round { width: 28px; height: 28px; }
          .hc-controls { padding: 6px 10px; gap: 8px; }
          .hc-time { display: none; }
          /* At 375 a 2:1 stage is about 170px tall, too short for the reel
             or the plugin tiles. */
          .pf-stage { aspect-ratio: 16 / 10; }
          .pf-stage:has(.hc-reel) { aspect-ratio: 1 / 1; }
          .pf-stage:has(.pf-plugins) { aspect-ratio: 3 / 4; }
          .pf-plugins { grid-template-columns: repeat(2, minmax(0, 1fr)); grid-template-rows: repeat(3, minmax(0, 1fr)); gap: 8px; padding: 14px; }
          .pf-client { width: 34px; height: 34px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hc-slide { transition: none; }
          .hc-controls { transition: none; transform: none; }
        }
      `}</style>
    </div>
  );
}
