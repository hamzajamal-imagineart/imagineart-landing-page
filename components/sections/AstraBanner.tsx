"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { withBasePath } from "@/lib/assets";
import { McpHero, CLIENTS, connectFor, type Route } from "@/components/sections/McpHero";
import { GalaxyCanvas, StarsCanvas, GALAXY_DENSITY } from "@/components/sections/astra-galaxy";
import { ClientField } from "@/components/sections/ClientField";

/**
 * GPT-6 Astra banner (Hamza, 8 Oct): ported from imagine.art's home page
 * banner, above Industries. A dark rounded panel over a starfield, the
 * GPT-6 / ASTRA, one line and a connect pill that follows the client picked
 * in the head above (McpHero). The fanned carousel of example clips the site
 * has on the right is off (Hamza, 8 Oct).
 *
 * Behind it, the site's own star field and spiral galaxy (astra-galaxy.js);
 * its soft glow overlay is left off (Hamza, 8 Oct).
 */
/** How much of the banner's height the galaxy fills (the site uses 1.02; bigger here, Hamza, 8 Oct). */
const GALAXY_FILL = 1.3;

const MCP_ICONS = "https://cdn-imagine.vyro.ai/imagine-one/imagine-mcp/clients/icons";

/** The banner's title (bold + serif) and two-line copy per client. ChatGPT's
 *  is imagine.art's GPT-6 Astra banner; the rest are placeholders built from
 *  what the MCP page says it does (images, video and music from the client). */
const BANNER_FOR = (id: string, name: string): { title: string; serif: string; line: [string, string] } =>
  id === "chatgpt"
    ? { title: "GPT-6", serif: "ASTRA", line: ["Build games, motion graphics, & interactive 3D", "experiences with Imagine MCP."] }
    : { title: name, serif: "", line: [`Generate images, video and music`, `from ${name} with Imagine MCP.`] };

export function AstraBanner() {
  // The pick in the head drives the banner's button.
  const [client, setClient] = useState(0);
  const [route, setRoute] = useState<Route>("mcp");
  const pick = CLIENTS[client];
  const cta = connectFor(pick, route);
  const isGpt = pick.id === "chatgpt";
  const copy = BANNER_FOR(pick.id, pick.name);

  // The site's density: lighter under 1024px.
  const [density, setDensity] = useState<number>(GALAXY_DENSITY);
  useEffect(() => {
    if (window.matchMedia("(max-width: 1023px)").matches) setDensity(2);
  }, []);

  return (
    <section id="imagine-mcp" className="relative py-24 md:py-32">
      <div className="container-page">
      {/* The chooser from imagine.art/mcp's hero: client chips + MCP / CLI,
          "Imagine MCP For <client>", Connect / How To Connect?, server URL
          (Hamza, 8 Oct). It replaces the wordmark-and-line head and the
          setup panel that sat under the banner. */}
      <McpHero client={client} route={route} onClient={setClient} onRoute={setRoute} />
      <div className="astra mt-8" role="region" aria-label="GPT-6 Astra on Imagine MCP">
        {/* imagine.art's own canvases (astra-galaxy.js): background stars, then the galaxy that parts round the pointer. */}
        <StarsCanvas className="astra-stars" />
        {/* ChatGPT keeps the site's galaxy; every other client gets its own
            formation in one particle field (ClientField). The two crossfade. */}
        <div className={`astra-layer${isGpt ? " on" : ""}`}>
          <GalaxyCanvas interactionMode="repel" density={density} frameFill={GALAXY_FILL} className="astra-galaxy" />
        </div>
        <div className={`astra-layer${isGpt ? "" : " on"}`}>
          <ClientField client={pick.id} className="astra-galaxy" />
        </div>

        <div className="astra-copy">
          {/* The Imagine MCP mark is in the section head above, so not repeated here (Hamza, 8 Oct). */}
          {/* Title, mark and line follow the chip picked above (Hamza, 8 Oct).
              ChatGPT keeps the site's GPT-6 Astra banner copy; the others use
              BANNER_FOR until they get copy of their own. */}
          <div className="astra-title">
            {isGpt ? (
              <svg className="astra-mark" width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path fill="currentColor" d="M19.813 10.367a4.43 4.43 0 0 0-.39-3.683 4.61 4.61 0 0 0-3.986-2.277q-.488 0-.965.1a4.5 4.5 0 0 0-1.535-1.113A4.6 4.6 0 0 0 11.073 3h-.039C9.04 3 7.273 4.27 6.66 6.14A4.54 4.54 0 0 0 3.62 8.316 4.5 4.5 0 0 0 3 10.592c0 1.124.423 2.207 1.186 3.041a4.43 4.43 0 0 0 .39 3.683 4.61 4.61 0 0 0 3.987 2.277q.487 0 .964-.1c.427.473.95.853 1.536 1.113s1.221.394 1.864.394h.04c1.994 0 3.762-1.27 4.374-3.142a4.54 4.54 0 0 0 3.039-2.175 4.485 4.485 0 0 0-.566-5.316m-6.856 9.456h-.005a3.44 3.44 0 0 1-2.184-.78l.108-.06 3.632-2.071a.59.59 0 0 0 .299-.506v-5.057l1.535.875a.05.05 0 0 1 .03.042v4.184c-.002 1.86-1.53 3.37-3.415 3.373M5.61 16.728a3.33 3.33 0 0 1-.408-2.26l.108.063 3.633 2.07a.6.6 0 0 0 .596 0l4.435-2.526v1.75a.05.05 0 0 1-.022.046l-3.672 2.091a3.46 3.46 0 0 1-3.417 0 3.4 3.4 0 0 1-1.253-1.234m-.955-7.824a3.4 3.4 0 0 1 1.78-1.48l-.003.124v4.144a.58.58 0 0 0 .298.506l4.435 2.526-1.535.875a.06.06 0 0 1-.052.005L5.907 13.51a3.4 3.4 0 0 1-1.25-1.236 3.34 3.34 0 0 1-.001-3.37M17.27 11.8l-4.435-2.526 1.535-.875a.06.06 0 0 1 .052-.004l3.672 2.091a3.37 3.37 0 0 1 1.71 2.922 3.38 3.38 0 0 1-2.238 3.166v-4.269a.58.58 0 0 0-.296-.505m1.528-2.27-.108-.063-3.633-2.07a.6.6 0 0 0-.596 0l-4.435 2.527V8.17a.05.05 0 0 1 .022-.043l3.672-2.09a3.46 3.46 0 0 1 1.708-.451c1.888 0 3.42 1.51 3.42 3.373q-.001.287-.05.57M9.19 12.65l-1.535-.875a.05.05 0 0 1-.03-.041V7.548c0-1.862 1.532-3.371 3.42-3.371.798 0 1.572.276 2.187.78q-.056.03-.108.061l-3.633 2.07a.59.59 0 0 0-.298.507v.003zm.834-1.774 1.976-1.126 1.975 1.125v2.25L12 14.25l-1.976-1.125z" />
              </svg>
            ) : (
              <img className="astra-mark" src={`${MCP_ICONS}/${pick.id}.svg`} alt="" style={pick.filter ? { filter: pick.filter } : undefined} />
            )}
            <h2>
              <span className="astra-gpt">{copy.title}</span>
              {copy.serif && <span className="astra-serif">{copy.serif}</span>}
            </h2>
          </div>
          <p className="astra-line">
            {copy.line.join(" ")}
          </p>
          <a className="astra-cta" href={cta.href} target="_blank" rel="noopener noreferrer">
            {cta.label}
          </a>
        </div>

      </div>
      </div>

      <style>{`
        .astra {
          position: relative; isolation: isolate; overflow: hidden;
          display: flex; align-items: center;
          height: 560px; width: 100%;
          border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); /* tighter corners (8 Oct; was 32) */
          /* Black fill behind the stars (Hamza, 8 Oct). */
          background: #000; color: #fff;
        }
        @media (min-width: 768px) { .astra { height: 440px; } }
        /* Out to the container's edges (its 1240px frame and guide lines), past .container-page's 32px gutter (Hamza, 8 Oct). */
        @media (min-width: 769px) { .astra { width: calc(100% + 64px); margin-left: -32px; margin-right: -32px; } }
        @media (min-width: 1024px) { .astra { height: 516px; } }
        .astra-stars { position: absolute; inset: 0; }
        .astra-layer { position: absolute; inset: 0; opacity: 0; pointer-events: none; transition: opacity 0.7s ease; }
        .astra-layer.on { opacity: 1; pointer-events: auto; }
        /* Full width on phones; on desktop the galaxy keeps to the right half,
           clear of the copy (Hamza, 8 Oct; the site centres it on large screens). */
        .astra-galaxy { position: absolute; inset: 0; display: block; width: 100%; height: 100%; }
        @media (min-width: 1024px) { .astra-galaxy { left: 40%; width: 60%; } } /* a little wider than half so the bigger galaxy isn't clipped on its left */

        .astra-copy { position: relative; z-index: 10; pointer-events: none; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; width: 100%; height: 100%; padding: 0 24px; text-align: center; }
        @media (min-width: 1100px) { .astra-copy { align-items: flex-start; text-align: left; padding: 0 32px 0 48px; } }
        .astra-logo { height: 37px; width: auto; display: block; }
        .astra-title { display: flex; flex-direction: row; align-items: center; gap: clamp(10px, 1.1vw, 14px); }
        @media (max-width: 1099px) { .astra-title { justify-content: center; } }
        .astra-title h2 { display: flex; flex-wrap: wrap; align-items: center; gap: 0 12px; margin: 0; }
        /* Mark sits left of the title at about cap height (Hamza, 8 Oct). */
        .astra-mark { width: clamp(34px, 4vw, 52px); height: clamp(34px, 4vw, 52px); display: block; flex-shrink: 0; }
        .astra-gpt { font-size: clamp(36px, 4.4vw, 56px); line-height: 1.1; font-weight: 600; letter-spacing: -0.02em; white-space: nowrap; text-shadow: 0 4px 8px rgba(176,175,175,0.2); }
        .astra-serif { font-family: var(--font-instrument-serif), Georgia, serif; font-size: clamp(36px, 4.4vw, 56px); line-height: 1.1; font-weight: 400; white-space: nowrap; }
        /* One flowing line, wider than the old two-line break (Hamza, 8 Oct). */
        .astra-line { margin: 0; max-width: 28em; font-size: 16px; line-height: 1.45; letter-spacing: -0.005em; text-wrap: pretty; }
        .astra-cta { pointer-events: auto; display: inline-flex; align-items: center; gap: 8px; height: 40px; padding: 0 14px; border-radius: 999px; background: #fff; color: #000; font-size: 15px; font-weight: 500; white-space: nowrap; transition: background 0.3s; }
        .astra-cta:hover { background: #ececec; }
        .astra-cta:active { transform: translateY(1px); }


      `}</style>
    </section>
  );
}
