"use client";

import { useEffect, useRef, useState } from "react";
import { withBasePath } from "@/lib/assets";
import { BlurHeading } from "@/components/BlurHeading";
import { SectionGuides } from "@/components/primitives/SectionGuides";

/**
 * Agents, between Workflows and Use Cases.
 *
 * Workflows is the pipeline you build yourself; the use cases are the things
 * to start from. The agent is the case where you build neither: you describe
 * the outcome and it assembles the run. That is why it sits between them.
 *
 * **Rebuilt to carry more weight** (Hamza, 21 Sep). It was a split panel with
 * three numbered rows beside a clip, which read as a feature tile rather than
 * as one of the page's claims. The section now leads with an eyebrow and a
 * two-clause heading, and puts the recording full width. The three steps
 * that sat under it as a rail (Brief it once, It plans the run, It
 * delivers) came out on 24 Sep (Hamza): the recording says it.
 *
 * **Nothing sits on the recording** (Hamza, 21 Sep): it carried a claim and
 * two buttons over a scrim, and both are gone. It also keeps its own aspect
 * ratio rather than being cropped to a band — the element is in flow at
 * `width: 100%; height: auto`: full width of the page grid, with the height
 * following the file, so none of the run is cut off. That upscales the
 * 636x416 source 1.85x, by request.
 *
 * The band shows a skeleton until the clip has a frame (Hamza, 21 Sep). It is
 * armed from an effect rather than from the markup, so a reader without JS
 * gets the video and not a shimmer that can never clear.
 *
 * The clip is `capabilities/agents.mp4` (581KB), not the hero's
 * `hero/modes/agent.mp4` (11MB). The hero's only loads when its chip is
 * picked; a section clip autoplays for everyone who scrolls past.
 */
export function Agent() {
  const [armed, setArmed] = useState(false);
  const [ready, setReady] = useState(false);
  const clip = useRef<HTMLVideoElement | null>(null);

  /* Armed and measured together: a cached clip can be ready before React is
     listening, so `loadeddata` never fires and a skeleton that only listened
     would never clear. */
  useEffect(() => {
    setArmed(true);
    setReady((clip.current?.readyState ?? 0) >= 2);
  }, []);

  return (
    <section id="agents" className="relative border-t border-[color:var(--line)] py-24 md:py-32 lg:border-t-0">
      <SectionGuides edge="top" />
      <div className="container-page">
        <div className="mx-auto max-w-[760px] text-center">
          <p className="eyebrow">Agents</p>
          <BlurHeading
            className="h2 mt-4"
            lead="Describe the outcome."
            muted="The agent runs the job."
          />
          <p className="lede mx-auto mt-5">
            Not a faster way to work the tools. A way to hand the work over.
          </p>
        </div>

        {/* The recording, whole: no crop, no scrim, nothing over it. */}
        <div className="ag-band mt-14">
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video
            ref={clip}
            className="ag-video"
            src={withBasePath("/media/capabilities/agents.mp4")}
            title="An agent run in ImagineArt"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden
            onLoadedData={() => setReady(true)}
            onCanPlay={() => setReady(true)}
          />
          {armed && <span className={`skel ${ready ? "skel-off" : ""}`} aria-hidden />}
        </div>

      </div>

      <style>{`
        .ag-band {
          position: relative;
          /* The skeleton is absolute over the clip; before the first frame
             the band still has the video's height, since the element keeps
             its intrinsic ratio once metadata lands. */
          overflow: hidden;
          border-radius: var(--radius-6);
          /* The same hairline the studio banners carry, and fixed white for
             the same reason: this is a dark surface in either theme. */
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: var(--ground);
          line-height: 0;
        }
        /* Full width of the page grid, with the height following the file's
           own ratio — in flow rather than absolute, so nothing is cropped.
           The file is 636x416, so at 1176 it is upscaled 1.85x; a larger
           recording would hold up better at this size. */
        .ag-video {
          display: block;
          width: 100%;
          height: auto;
          /* The file's own ratio, stated up front. A <video> with no metadata
             yet falls back to 300x150, so without this the band is the wrong
             height until the header lands and then jumps — with a skeleton
             sitting in it, which makes the jump the first thing you see.
             Matches capabilities/agents.mp4 (636x416); update both together. */
          aspect-ratio: 636 / 416;
        }
      `}</style>
    </section>
  );
}
