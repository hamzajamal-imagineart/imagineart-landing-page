"use client";

import { useState } from "react";
import { withBasePath } from "@/lib/assets";

/**
 * The Toolkit tab of the platform strip (Hamza, 7 Oct): five short tool
 * recordings, one at a time, with a row of pills along the foot naming each.
 * A clip plays through once and hands over to the next, looping back to the
 * first; a pill jumps straight to its tool. The active pill fills as its
 * clip plays, so the row doubles as a progress bar.
 *
 * Re-encoded from the 1080p masters with avconvert (Preset1920x1080, H.264),
 * which roughly halved them: 37MB for the set. Only the active clip mounts.
 */
// Order set by Hamza, 9 Oct.
const TOOLS = [
  { id: "edit-image", label: "Edit Image" },
  { id: "image-upscale", label: "Image Upscale" },
  { id: "video-extend", label: "Video Extend" },
  { id: "resize-video", label: "Resize Video" },
  { id: "remove-bg", label: "Remove BG" },
];

export function ToolkitStage() {
  const [on, setOn] = useState(0);
  const [progress, setProgress] = useState(0);
  const t = TOOLS[on];
  const go = (i: number) => { setOn(i); setProgress(0); };

  return (
    <div className="tk">
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        key={t.id}
        className="tk-video"
        src={withBasePath(`/media/toolkit/${t.id}.mp4`)}
        autoPlay
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        aria-hidden
        onTimeUpdate={(e) => { const v = e.currentTarget; if (v.duration) setProgress(v.currentTime / v.duration); }}
        onEnded={() => go((on + 1) % TOOLS.length)}
      />
      <span className="tk-scrim" aria-hidden />

      <div className="tk-pills" role="group" aria-label="Tools">
        {TOOLS.map((x, i) => (
          <button
            key={x.id}
            type="button"
            className={`tk-pill ${i === on ? "tk-pill-on" : ""}`}
            aria-pressed={i === on}
            onClick={() => go(i)}
          >
            {i === on && <span className="tk-fill" style={{ transform: `scaleX(${progress})` }} aria-hidden />}
            <span className="tk-label">{x.label}</span>
          </button>
        ))}
      </div>

      <style>{`
        .tk { position: absolute; inset: 0; background: var(--media-ground); }
        .tk-video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; animation: tk-in 360ms ease both; }
        @keyframes tk-in { from { opacity: 0; } to { opacity: 1; } }
        .tk-scrim {
          position: absolute; inset: 0; pointer-events: none;
          background: linear-gradient(to top, var(--scrim-2) 0%, rgba(0, 0, 0, 0) 32%);
        }
        .tk-pills {
          position: absolute;
          left: 50%;
          bottom: clamp(12px, 4%, 28px);
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
          max-width: calc(100% - 24px);
          overflow-x: auto;
          scrollbar-width: none;
        }
        .tk-pills::-webkit-scrollbar { display: none; }
        .tk-pill {
          position: relative;
          overflow: hidden;
          flex: none;
          height: 44px;
          padding: 0 20px;
          border-radius: var(--radius-pill);
          border: 1px solid var(--glass-line);
          background: var(--glass);
          -webkit-backdrop-filter: blur(var(--glass-blur));
          backdrop-filter: blur(var(--glass-blur));
          color: var(--on-media);
          font: inherit;
          font-size: 15px;
          font-weight: 500;
          white-space: nowrap;
          cursor: pointer;
          opacity: 0.7;
          transition: opacity var(--dur-fast) ease, border-color var(--dur-fast) ease;
        }
        .tk-pill:hover { opacity: 0.95; }
        .tk-pill-on { opacity: 1; border-color: var(--glass-line-on); }
        .tk-pill:focus-visible { outline: 2px solid var(--on-media); outline-offset: 2px; }
        /* The active pill fills left to right as its clip plays. */
        .tk-fill { position: absolute; inset: 0; background: var(--glass-fill-on); transform-origin: left center; transition: transform 260ms linear; }
        .tk-label { position: relative; }
        @media (max-width: 640px) {
          .tk-pills { left: 12px; right: 12px; transform: none; }
          .tk-pill { height: 36px; padding: 0 14px; font-size: 13px; }
        }
        @media (prefers-reduced-motion: reduce) { .tk-video { animation: none; } }
      `}</style>
    </div>
  );
}
