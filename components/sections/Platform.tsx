"use client";

import { useEffect, useRef, useState } from "react";
import { withBasePath } from "@/lib/assets";
import { BlurHeading } from "@/components/BlurHeading";
import { McpPanel } from "@/components/sections/Mcp";
import { StudiosStage } from "@/components/sections/StudiosStage";
import { ToolkitStage } from "@/components/sections/ToolkitStage";
import { SlidingIndicator, slidingIndicatorCss, useSlidingIndicator } from "@/components/primitives/SlidingIndicator";
import { pluginHref, PLUGINS_HREF } from "@/lib/links";

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


/** The Workflows recording (it ran under the Agents tab until 7 Oct, hence
    the file's name). */
const WORKFLOWS_CLIP = "/media/hero/modes/agent.mp4";
/** The Imagine Computer recording, for the Agent tab. */
const COMPUTER_CLIP = "/media/hero/computer.mp4";

/**
 * The plugin marks and anchors the Workflows tile already carries.
 *
 * `bg` is each app's own dark ground, which the hub tile takes (Hamza,
 * 25 Sep: "icons inside the container, dark-mode colours"). The three Adobe
 * files carry that ground as a rounded rect, so `full` stretches them to the
 * tile and the tile clips the corners: one container, not an icon boxed in a
 * box. Figma, Framer and Shopify are bare glyphs and sit centred on theirs.
 */
const PLUGINS = [
  { icon: "photoshop", name: "Photoshop", anchor: "photoshop", bg: "#001e36", full: true },
  { icon: "premiere", name: "Premiere Pro", anchor: "premiere", bg: "#00005b", full: true },
  { icon: "aftereffects", name: "After Effects", anchor: "aftereffects", bg: "#00005b", full: true },
  { icon: "figma", name: "Figma", anchor: "figma", bg: "#1e1e1e", full: false },
  { icon: "framer", name: "Framer", anchor: "framer", bg: "#0b0b0d", full: false },
  { icon: "shopify", name: "Shopify", anchor: "shopify", bg: "#0e2a1f", full: false },
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
  kind: "reel" | "clip" | "toolkit" | "studios" | "integrations";
  videos?: string[];
  /** Whether the clip carries sound, so it gets the control bar. */
  audio?: boolean;
};

const TABS: Tab[] = [
  // Order and clips (Hamza, 7 Oct): Agent runs the Imagine Computer
  // recording; Toolkit (was Creative Suite) runs five tool clips with pills;
  // Workflows takes the clip the Agents tab used, which is a Workflows
  // recording.
  { id: "agent", label: "Agent", kind: "clip", videos: [COMPUTER_CLIP], audio: true },
  { id: "toolkit", label: "Toolkit", kind: "toolkit" },
  { id: "workflows", label: "Workflows", kind: "clip", videos: [WORKFLOWS_CLIP], audio: true },
  // Ad, Fashion and Film Studio footage with chips to switch (Hamza, 7 Oct).
  { id: "studios", label: "Studios", kind: "studios" },
  // MCP and Plugins, merged (Hamza, 7 Oct): both are ways to use ImagineArt
  // from somewhere else, so one tab with a two-way switch under the tab row.
  { id: "integrations", label: "MCP & Plugins", isNew: true, kind: "integrations" },
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
 * Plugins, as a hub (Hamza, 25 Sep: "too basic, try something intriguing,
 * text on the left"). Copy on the left; on the right the ImagineArt mark in
 * the middle with the six host apps wired to it, three a side, and a pulse
 * running down each cable into the hub, staggered so something is always
 * arriving. Hover or focus an app and its cable lights and the caption under
 * the hub names it. Every app is still a link to its plugin page.
 *
 * The drawing is one coordinate space: the SVG's viewBox is 560 × 440 and the
 * figure holds that ratio, so the tiles (HTML, for links and focus) sit at
 * the same points as a percentage of the box.
 */
const HUB = { x: 280, y: 220 };
const NODES = [
  { x: 84, y: 76 }, { x: 60, y: 220 }, { x: 84, y: 364 },
  { x: 476, y: 76 }, { x: 500, y: 220 }, { x: 476, y: 364 },
];
/** Drawn from the hub out to the app, so the pulse runs outward and lands on
    the thing you can click rather than on the mark in the middle. */
const cable = (n: { x: number; y: number }) => {
  // Out from the side of the mark, not its centre: with no tile behind the
  // mark, a cable drawn to the centre would show through the spark cut-out.
  const x0 = HUB.x + Math.sign(n.x - HUB.x) * 44;
  const mx = (n.x + x0) / 2;
  return `M ${x0} ${HUB.y} C ${mx} ${HUB.y}, ${mx} ${n.y}, ${n.x} ${n.y}`;
};
/** One pulse cycle, shared by the cable and the app it lands on. */
const PULSE_S = 3.3;
const PULSE_GAP_S = 0.55;

function PluginHub() {
  const [on, setOn] = useState<number | null>(null);
  return (
    <div className="pf-plug">
      <div className="pf-plug-copy">
        <p className="pf-plug-eyebrow">Plugins</p>
        <h3 className="pf-plug-title">Your models, inside the apps you already use</h3>
        <p className="pf-plug-body">
          Photoshop, Premiere, After Effects, Figma, Framer and Shopify, with the
          same models and the same brand kit behind every one.
        </p>
        <a className="pf-plug-go" href={PLUGINS_HREF} target="_blank" rel="noopener noreferrer">
          See all plugins
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M6 12h12M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>

      <div className="pf-plug-fig">
        <svg className="pf-plug-wires" viewBox="0 0 560 440" aria-hidden>
          {NODES.map((n, i) => (
            <g key={i} className={on === i ? "pf-wire-on" : undefined}>
              <path className="pf-wire" d={cable(n)} pathLength={1} />
              <path className="pf-pulse" d={cable(n)} pathLength={1} style={{ animationDelay: `${i * PULSE_GAP_S}s` }} />
            </g>
          ))}
        </svg>

        <div className="pf-hub" aria-hidden>
          {/* The mark from the wordmark (a rounded square with the spark cut
              out) in the wordmark's own colour — not the favicon, which is a
              disc, and not recoloured (Hamza, 25 Sep). */}
          <svg className="pf-hub-mark" viewBox="0 0 21.67 20.95" aria-hidden>
            <path fill="currentColor" d="M19.7083 8.50305C17.4331 7.9892 14.86 7.82555 15.483 3.80968L20.0842 5.05666L21.6585 5.4265C21.5807 2.41541 19.0346 0 15.9028 0H5.73204C2.563 0 0 2.48415 0 5.54105V10.1984C0 11.7661 0.870133 12.1982 1.96034 12.4436H1.95357C4.22878 12.9608 6.80193 13.1277 6.17896 17.1403L1.57775 15.8933L0.00338573 15.5267C0.0677146 18.528 2.60363 20.9467 5.73204 20.9467H15.9366C19.0989 20.9467 21.6687 18.4625 21.6687 15.4056V10.745C21.6687 9.18709 20.7952 8.74524 19.7083 8.50305ZM10.831 16.813C9.82201 13.8805 7.42152 11.4847 4.27618 10.4733C7.42152 9.46201 9.82201 7.07278 10.831 4.14024C11.8433 7.07278 14.2404 9.46528 17.3891 10.4766C14.2404 11.4912 11.8433 13.8805 10.831 16.813Z" />
          </svg>
        </div>

        <ul className="pf-nodes">
          {PLUGINS.map((p, i) => (
            <li key={p.icon} style={{ left: `${(NODES[i].x / 560) * 100}%`, top: `${(NODES[i].y / 440) * 100}%` }}>
              <a
                href={pluginHref(p.anchor)}
                target="_blank"
                rel="noopener noreferrer"
                className={`pf-node ${on === i ? "pf-node-on" : ""}`}
                style={{ ["--arrive" as string]: `${i * PULSE_GAP_S}s`, background: p.bg }}
                aria-label={`${p.name} plugin`}
                onMouseEnter={() => setOn(i)}
                onMouseLeave={() => setOn(null)}
                onFocus={() => setOn(i)}
                onBlur={() => setOn(null)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className={p.full ? "pf-node-full" : undefined} src={withBasePath(`/media/plugins/${p.icon}.svg`)} alt="" aria-hidden />
                {/* The open badge says "this goes somewhere" at rest, not only
                    on hover: the apps are the links here, the hub is not. */}
                <span className="pf-node-go" aria-hidden>
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none"><path d="M7 17L17 7M9 7h8v8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
                <span className="pf-node-name">{p.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** A small dot glyph per tab, four arrangements, as in the reference. */
const DOT_SETS: [number, number][][] = [
  [[3, 3], [9, 3], [15, 3], [6, 9], [12, 9], [3, 15], [9, 15], [15, 15]],
  [[3, 4], [15, 4], [9, 9], [4, 14], [14, 14]],
  [[15, 3], [10, 8], [5, 13], [3, 15], [13, 6]],
  [[15, 3], [11, 7], [7, 11], [3, 15]],
];
function TabDots({ v, id }: { v: number; id: string }) {
  if (id === "integrations") return <McpGlyph />;
  if (id === "workflows") return <WorkflowGlyph />;
  return (
    <svg className="pf-tab-dots" width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      {DOT_SETS[v % DOT_SETS.length].map(([cx, cy], k) => <circle key={k} cx={cx} cy={cy} r="1.5" fill="currentColor" />)}
    </svg>
  );
}
/** MCP's glyph (Hamza, 6 Oct: "a better icon"): a hub with three spokes to
    three nodes, the connect-anything idea, in the same dot language as the
    other tabs rather than the diagonal scatter it had. */
/** Workflows' glyph (Hamza, 7 Oct: "a better icon"): a small node graph,
    two inputs feeding a step that feeds an output, in the same dot-and-line
    language as the hub. */
function WorkflowGlyph() {
  return (
    <svg className="pf-tab-dots" width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <path d="M4.2 4.5C7 4.5 6.5 9 9 9M4.2 13.5C7 13.5 6.5 9 9 9M9 9h4.6" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity="0.55" />
      <circle cx="2.8" cy="4.5" r="1.7" fill="currentColor" />
      <circle cx="2.8" cy="13.5" r="1.7" fill="currentColor" />
      <rect x="7.2" y="7.2" width="3.6" height="3.6" rx="1" fill="currentColor" />
      <circle cx="15.2" cy="9" r="1.9" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
function McpGlyph() {
  const spokes: [number, number][] = [[9, 2.6], [3.4, 12.2], [14.6, 12.2]];
  return (
    <svg className="pf-tab-dots" width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      {spokes.map(([x, y], k) => <line key={`l${k}`} x1="9" y1="9" x2={x} y2={y} stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity="0.55" />)}
      {spokes.map(([x, y], k) => <circle key={`c${k}`} cx={x} cy={y} r="1.7" fill="currentColor" />)}
      <circle cx="9" cy="9" r="2.3" fill="currentColor" />
    </svg>
  );
}

export function PlatformStrip() {
  const [tab, setTab] = useState(0);
  /** Which side of the Integrations tab is showing. */
  const [via, setVia] = useState<"mcp" | "plugins">("mcp");
  const tabs = useSlidingIndicator<HTMLButtonElement>(tab);
  const t = TABS[tab];

  /**
   * A deep link to #mcp lands on a tab here rather than a section.
   * The strip carries that id so the browser scrolls to it on its own; this
   * is what selects the matching tab, on load and on every later hash change.
   * #mcp and #plugins open Integrations on that side.
   */
  useEffect(() => {
    const sync = () => {
      const h = window.location.hash.slice(1);
      if (h === "mcp" || h === "plugins") { setVia(h); setTab(TABS.findIndex((x) => x.id === "integrations")); return; }
      const i = TABS.findIndex((x) => x.id === h);
      if (i >= 0) setTab(i);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const stage =
    t.kind === "integrations" ? (via === "mcp" ? <div className="pf-mcp"><McpPanel /></div> : <PluginHub />)
    : t.kind === "toolkit" ? <ToolkitStage />
    : t.kind === "studios" ? <StudiosStage />
    : t.kind === "reel" ? <ImageReel key={t.id} videos={t.videos ?? []} />
    : <ClipPlayer videos={t.videos ?? []} audio={t.audio} />;

  return (
    <div id="mcp" className="pf">
      {/* A heading over the tabs (Hamza, 6 Oct, to a reference): one line
          and a lede, centred, above the tab row. */}
      <div className="pf-head">
        <BlurHeading className="h2 pf-h2" lead="Purpose-built for creative enterprise" />
        <p className="lede mt-4">Agents, tools, workflows and studios in one platform, on brand and under your control.</p>
      </div>
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
            <TabDots v={i} id={x.id} />
            {x.label}
          </button>
        ))}
      </div>

      {/* Integrations' two sides, as a small switch under the tab row. */}
      {t.kind === "integrations" && (
        <div className="pf-via" role="group" aria-label="MCP and Plugins" data-on={via}>
          <span className="pf-via-thumb" aria-hidden />
          {(["mcp", "plugins"] as const).map((v) => (
            <button key={v} type="button" aria-pressed={via === v} className={`pf-via-btn ${via === v ? "pf-via-on" : ""}`} onClick={() => setVia(v)}>
              {v === "mcp" ? "MCP" : "Plugins"}
              {v === "mcp" && <span className="pf-via-new">New</span>}
            </button>
          ))}
        </div>
      )}

      {/* The product, in a quiet bordered container on a faint dot grid. */}
      <div className="pf-frame">
        <div className="pf-panel">
          <div id="pf-stage" className="pf-stage" role="tabpanel" aria-label={t.label}>{stage}</div>
        </div>
      </div>


      <style>{`
        .pf { isolation: isolate; }
        /* The MCP & Plugins switch (Hamza, 7 Oct: "make it better"): one
           segmented control, a soft track with a raised thumb that slides
           between two equal halves, and "New" as a small violet word rather
           than a filled tag. */
        .pf-via {
          position: relative;
          display: grid;
          grid-template-columns: 1fr 1fr;
          width: max-content;
          margin: 16px auto 0;
          padding: 4px;
          border-radius: var(--radius-pill);
          background: color-mix(in srgb, var(--ink-heading) 6%, transparent);
        }
        .pf-via-thumb {
          position: absolute;
          top: 4px; bottom: 4px; left: 4px;
          width: calc(50% - 4px);
          border-radius: var(--radius-pill);
          background: var(--panel);
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.06);
          transition: transform var(--dur-med) var(--ease-out);
        }
        .pf-via[data-on="plugins"] .pf-via-thumb { transform: translateX(100%); }
        .pf-via-btn {
          position: relative;
          display: inline-flex; align-items: center; justify-content: center; gap: 6px;
          height: 34px; min-width: 112px; padding: 0 16px;
          border: 0; border-radius: var(--radius-pill);
          background: transparent;
          font: inherit; font-size: 14px; font-weight: 500;
          color: var(--ink-3);
          cursor: pointer;
          transition: color var(--dur-fast) ease;
        }
        .pf-via-btn:hover, .pf-via-on { color: var(--ink-heading); }
        .pf-via-new { font-size: 10.5px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--brand); }
        [data-theme="dark"] .pf-via-new { color: var(--brand-soft); }
        .pf-via-btn:focus-visible { outline: none; box-shadow: inset 0 0 0 1.5px var(--line-strong); }
        ${slidingIndicatorCss}

        /* Minimal tabs (Hamza, 6 Oct, to a reference): no track and no
           dividers, a small dot glyph before each label, and only the
           selected tab on a soft fill. Above the container. */
        .pf-head { text-align: center; margin: 0 auto 56px; max-width: 720px; display: flex; flex-direction: column; align-items: center; }
        .pf-head .lede { max-width: 56ch; }
        .pf-tabs {
          position: relative;
          margin: 0 auto;
          width: max-content;
          max-width: 100%;
          display: flex;
          gap: 4px; /* tighter (Hamza, 7 Oct) */
          overflow-x: auto;
          scrollbar-width: none;
        }
        .pf-tabs::-webkit-scrollbar { display: none; }
        .pf-tab-fill { border-radius: calc(10px * var(--corner)); background: var(--tile); }
        /* On the light palette --tile is two percent off white and the pill
           barely shows; a step darker reads as a selection (Hamza, 6 Oct). */
        /* Not a flat cool grey (Hamza, 8 Oct: the greys fought the warm
           wash): a translucent ink tint, so the pill picks up whatever sits
           behind it. Same for the MCP/Plugins track below. */
        :root:not([data-theme="dark"]) .pf-tab-fill:not([data-theme="dark"] *) { background: rgba(23, 23, 23, 0.06); }
        .pf-tab {
          position: relative;
          z-index: 1;
          flex: 0 0 auto;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          border: 0;
          border-radius: calc(10px * var(--corner));
          padding: 0 20px;
          height: 48px;
          background: transparent;
          font-family: inherit;
          font-size: 17px;
          font-weight: 500;
          letter-spacing: -0.01em;
          /* Between the old grey (--ink-2) and full ink, so unselected tabs read clearly but still step back from the active one (Hamza, 8 Oct). */
          color: color-mix(in srgb, var(--ink-heading) 82%, var(--page-bg));
          cursor: pointer;
          white-space: nowrap;
          transition: color 220ms ease;
        }
        .pf-tab:hover, .pf-tab-on, .pf-tab-on:hover { color: var(--ink-heading); }
        /* Keyboard focus (Hamza, 7 Oct: the browser's black outline was
           clipped by the scrolling row): a soft inset ring in the line colour
           instead, inside the tab so nothing cuts it off. */
        .pf-tab:focus { outline: none; }
        .pf-tab:focus-visible { outline: none; color: var(--ink-heading); box-shadow: inset 0 0 0 1.5px var(--line-strong); }
        .pf-tab-dots { flex: 0 0 auto; display: block; }
        /* Violet tint, not ink (Hamza, 24 Sep, to a reference): the one
           colour in the strip, so it reads as a flag rather than a label.
           #a78bfa on the tinted track is 5.8:1; the light theme darkens it. */
        .pf-new {
          display: inline-flex;
          align-items: center;
          height: 20px;
          padding: 0 7px;
          border-radius: calc(6px * var(--corner));
          background: rgb(var(--brand-rgb) / 0.2);
          color: var(--brand-soft);
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        :root:not([data-theme="dark"]) .pf-new:not([data-theme="dark"] *) { background: #ede9fe; color: #6d28d9; }
        /* On the selected tab the pill's grey swallowed the tag's tint
           (Hamza, 7 Oct): a step stronger there, on both palettes. */
        .pf-tab-on .pf-new { background: rgb(var(--brand-rgb) / 0.34); }
        :root:not([data-theme="dark"]) .pf-tab-on .pf-new:not([data-theme="dark"] *) { background: #ddd6fe; color: #5b21b6; }

        /* The container: one hairline, nothing nested inside it (Hamza,
           6 Oct: "no double borders"). The stage fills it edge to edge. */
        /* No grey box of its own (Hamza, 8 Oct): the stage is the one
           rounded surface, edged with a hairline so a white recording still
           reads against the white page (no shadow). */
        .pf-frame {
          position: relative;
          margin-top: 40px;
          overflow: hidden;
          border-radius: var(--radius-5);
          border: 1px solid var(--line);
        }

        .pf-panel { padding: 0; }

        /* One ratio for every tab, so switching never moves the height. */
        .pf-stage {
          position: relative;
          overflow: hidden;
          aspect-ratio: 16 / 9;
          background: var(--tile-2);
          --hc-float: clamp(12px, 2.2%, 22px);
        }
        .pf-clip { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }
        .pf-stage:hover .hc-controls { opacity: 1; transform: translateY(0); }

        /* Plugins: copy left, the hub right, on the stage's own ground with
           a faint dot grid so the wiring reads as a diagram. */
        .pf-plug {
          position: absolute;
          inset: 0;
          display: grid;
          grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
          align-items: center;
          gap: clamp(16px, 3vw, 48px);
          padding: clamp(24px, 4vw, 56px);
          background:
            radial-gradient(circle at 70% 50%, rgb(var(--brand-rgb) / 0.10), transparent 55%),
            radial-gradient(var(--pf-dot, rgba(255, 255, 255, 0.07)) 1px, transparent 1.2px) 0 0 / 22px 22px,
            var(--tile);
        }
        :root:not([data-theme="dark"]) .pf-plug:not([data-theme="dark"] *) { --pf-dot: rgba(15, 20, 30, 0.09); }
        .pf-plug-eyebrow {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--ink-3);
        }
        .pf-plug-title {
          margin-top: 12px;
          font-size: clamp(22px, 2.1vw, 30px);
          line-height: 1.18;
          font-weight: 500;
          letter-spacing: -0.02em;
          color: var(--ink-heading);
          text-wrap: balance;
        }
        .pf-plug-body { margin-top: 14px; font-size: 15px; line-height: 1.6; color: var(--ink-2); max-width: 38ch; }
        .pf-plug-go {
          margin-top: 22px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 14.5px;
          font-weight: 500;
          color: var(--ink-heading);
          transition: opacity 200ms ease;
        }
        .pf-plug-go:hover { opacity: 0.72; }

        .pf-plug-fig { position: relative; width: 100%; aspect-ratio: 560 / 440; max-height: 100%; justify-self: center; }
        .pf-plug-wires { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
        .pf-wire { fill: none; stroke: var(--line-strong); stroke-width: 1.2; transition: stroke 240ms ease; }
        .pf-wire-on .pf-wire { stroke: rgb(var(--brand-soft-rgb) / 0.9); }
        /* A short dash that runs the length of the cable into the hub. */
        .pf-pulse {
          fill: none;
          stroke: var(--brand-soft);
          stroke-width: 2;
          stroke-linecap: round;
          stroke-dasharray: 0.08 1;
          stroke-dashoffset: 1.08;
          opacity: 0.9;
          animation: pf-pulse ${PULSE_S}s cubic-bezier(0.45, 0, 0.55, 1) infinite;
        }
        @keyframes pf-pulse {
          0%   { stroke-dashoffset: 1.08; opacity: 0; }
          10%  { opacity: 0.9; }
          85%  { opacity: 0.9; }
          100% { stroke-dashoffset: 0; opacity: 0; }
        }

        /* The hub is the mark alone, no tile behind it (Hamza, 25 Sep), and
           quiet on purpose: nothing that reads as a button. It is where the
           cables come from; the apps are what you click. */
        .pf-hub {
          position: absolute;
          left: 50%; top: 50%;
          width: 12%; aspect-ratio: 1;
          transform: translate(-50%, -50%);
          display: grid; place-items: center;
          pointer-events: none;
        }
        /* The wordmark's own two colours: #F2F2F3 on dark, #0F0F0F on light. */
        .pf-hub-mark { width: 100%; height: auto; display: block; color: #F2F2F3; }
        :root:not([data-theme="dark"]) .pf-hub-mark:not([data-theme="dark"] *) { color: #0F0F0F; }

        .pf-nodes { list-style: none; position: absolute; inset: 0; margin: 0; padding: 0; }
        .pf-nodes li { position: absolute; transform: translate(-50%, -50%); }
        .pf-node {
          width: clamp(52px, 5vw, 64px); aspect-ratio: 1;
          display: grid; place-items: center;
          border-radius: var(--radius-4);
          background: var(--tile);
          border: 1px solid rgba(255, 255, 255, 0.14);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
          cursor: pointer;
          transition: transform 240ms cubic-bezier(0.22, 1, 0.36, 1), border-color 240ms ease, background 240ms ease, box-shadow 240ms ease;
          position: relative;
          /* Lights as its pulse arrives, so the eye travels out to the apps. */
          animation: pf-arrive ${PULSE_S}s ease-out infinite;
          animation-delay: var(--arrive, 0s);
        }
        @keyframes pf-arrive {
          0%, 78%  { box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35), 0 0 0 0 rgb(var(--brand-soft-rgb) / 0); }
          90%      { box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35), 0 0 0 5px rgb(var(--brand-soft-rgb) / 0.28); }
          100%     { box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35), 0 0 0 10px rgb(var(--brand-soft-rgb) / 0); }
        }
        .pf-node img { width: 50%; height: 50%; object-fit: contain; display: block; }
        /* Stretched to the tile and clipped to its radius, so the file's own
           ground is the container. */
        .pf-node img.pf-node-full {
          position: absolute;
          inset: -1px;
          width: calc(100% + 2px);
          height: calc(100% + 2px);
          object-fit: fill;
          border-radius: inherit;
        }
        .pf-node:hover, .pf-node-on {
          transform: translateY(-3px) scale(1.08);
          border-color: rgb(var(--brand-soft-rgb) / 0.75);
          animation: none;
          box-shadow: 0 14px 30px rgba(0, 0, 0, 0.45), 0 0 0 4px rgb(var(--brand-soft-rgb) / 0.18);
        }
        .pf-node:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; }
        /* Open badge, top-right, always showing. */
        .pf-node-go {
          position: absolute;
          top: -6px; right: -6px;
          width: 20px; height: 20px;
          display: grid; place-items: center;
          border-radius: var(--radius-pill);
          background: var(--ink-heading);
          color: var(--page-bg);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
          transition: transform 240ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .pf-node:hover .pf-node-go, .pf-node-on .pf-node-go { transform: scale(1.12) rotate(0deg); }
        .pf-node-name {
          position: absolute;
          top: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
          white-space: nowrap;
          font-size: 12.5px;
          font-weight: 500;
          color: var(--ink-2);
          text-decoration: underline;
          text-decoration-color: transparent;
          text-underline-offset: 3px;
          transition: color 200ms ease, text-decoration-color 200ms ease;
        }
        .pf-node:hover .pf-node-name, .pf-node-on .pf-node-name { text-decoration-color: currentColor; }
        .pf-node:hover .pf-node-name, .pf-node-on .pf-node-name { color: var(--ink-heading); }

        /* MCP is the connect panel itself (Hamza, 24 Sep, "bring back the
           previous UI that had tabs"): client tabs, the MCP / CLI toggle, the
           three steps and the recording. It is taller than a 2:1 stage, so
           this tab alone lets the stage take its content's height. */
        .pf-stage:has(.pf-mcp) { aspect-ratio: auto; overflow: visible; border: 0; background: var(--tile); }
        .pf-mcp { min-width: 0; }
        .pf-mcp .mcp-panel { border: 0; background: transparent; padding: 0; }
        /* The tab tracks sit in from the frame's edges, not flush against
           them (Hamza, 7 Oct). */
        .pf-mcp .mcp-bar { padding: 16px 16px 0; }

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
          border: 1px solid var(--glass-line);
          border-radius: var(--radius-pill);
          background: var(--glass-strong);
          backdrop-filter: blur(var(--glass-blur));
          -webkit-backdrop-filter: blur(var(--glass-blur));
          color: var(--on-media);
          cursor: pointer;
          transition: background var(--dur-fast) ease;
        }
        .hc-round:hover { background: rgb(var(--glass-rgb) / 0.9); }
        .hc-round:focus-visible { outline: 2px solid var(--on-media); outline-offset: 2px; }

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
          border-radius: var(--radius-3);
          background: rgb(var(--glass-rgb) / 0.62);
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
          border-radius: calc(7px * var(--corner));
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
        .hc-seek::-webkit-slider-runnable-track { height: 3px; border-radius: calc(2px * var(--corner)); background: rgba(255, 255, 255, 0.28); }
        .hc-seek::-moz-range-track { height: 3px; border-radius: calc(2px * var(--corner)); background: rgba(255, 255, 255, 0.28); }
        .hc-seek::-webkit-slider-thumb {
          appearance: none;
          -webkit-appearance: none;
          width: 11px; height: 11px;
          margin-top: -4px;
          border: 0; border-radius: var(--radius-round);
          background: #fff;
        }
        .hc-seek::-moz-range-thumb { width: 11px; height: 11px; border: 0; border-radius: var(--radius-round); background: #fff; }
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
          /* The hub stacks under its copy, and the stage takes their
             height rather than a ratio. */
          .pf-stage:has(.pf-plug) { aspect-ratio: auto; }
          .pf-plug { position: relative; grid-template-columns: minmax(0, 1fr); padding: 24px 20px 40px; gap: 28px; }
          .pf-plug-fig { width: 100%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .pf-pulse { animation: none; opacity: 0; }
          .pf-node { animation: none; }
          .hc-slide { transition: none; }
          .hc-controls { transition: none; transform: none; }
        }
      `}</style>
    </div>
  );
}
