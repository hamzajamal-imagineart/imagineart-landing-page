"use client";

/* eslint-disable @next/next/no-img-element */
import { withBasePath } from "@/lib/assets";

/**
 * The Imagine MCP section head (Hamza, 8 Oct), from the hero of
 * imagine.art/mcp: the Imagine MCP lockup (its "For <client>" is off), one line,
 * then the client chips (the MCP / CLI switch is off, Hamza, 8 Oct). The pick is controlled by
 * the parent, whose banner button ("Connect In <client>") follows it, via
 * connectFor(). Links and icons are the live page's (read 8 Oct).
 */
const ICONS = "https://cdn-imagine.vyro.ai/imagine-one/imagine-mcp/clients/icons";

export type Client = { id: string; name: string; href?: string; filter?: string };
export const CLIENTS: Client[] = [
  // The ChatGPT mark is black: white on the dark chips unless picked (on a white chip). 8 Oct.
  { id: "chatgpt", name: "ChatGPT", href: "https://chatgpt.com/plugins/plugin_asdk_app_6a97af93ebc88191961039f177688fa9", filter: "brightness(0) invert(1)" },
  { id: "claude", name: "Claude", href: "https://claude.ai/customize/connectors?modal=add-custom-connector" },
  { id: "cursor", name: "Cursor", href: "cursor://anysphere.cursor-deeplink/mcp/install?name=ImagineArt&config=eyJ0eXBlIjoiaHR0cCIsInVybCI6Imh0dHBzOi8vbWNwLmltYWdpbmUuYXJ0In0%3D", filter: "brightness(0) invert(1)" },
  { id: "grok", name: "Grok", href: "https://grok.com/connectors", filter: "invert(1)" },
  { id: "manus", name: "Manus", href: "https://manus.im/app/plugins#connector_3878e37d-957c-4718-9678-82d2823c98c5", filter: "brightness(0) invert(1)" },
  { id: "claude-code", name: "Claude Code" },
];

export type Route = "mcp" | "cli";

/** The banner button for a pick: the client's own connect link, or, where
 *  there is none (Claude Code) and for the CLI, the matching part of
 *  imagine.art/mcp. */
export function connectFor(c: Client, route: Route): { label: string; href: string } {
  if (route === "cli") return { label: "Install the CLI", href: "https://www.imagine.art/mcp/cli" };
  if (c.href) return { label: `Connect In ${c.name}`, href: c.href };
  return { label: `Set Up ${c.name}`, href: `https://www.imagine.art/mcp#${c.id}` };
}

export function McpHero({ client, route, onClient, onRoute }: { client: number; route: Route; onClient: (i: number) => void; onRoute: (r: Route) => void }) {
  const cli = route === "cli";

  return (
    <div className="mh">
      <h2 className="mh-title" aria-label="Imagine MCP">
        <span className="mh-lockup" aria-hidden>
          <img src={withBasePath("/media/mcp/imagine-word-light.svg")} alt="" />
          <img src={withBasePath("/media/mcp/mcp-word-purple.svg")} alt="" />
        </span>
      </h2>
      <p className="lede mh-line">Every ImagineArt tool inside the agent you already use, connected once and ready in a minute.</p>

      <div className="mh-chips">
        <div role="group" aria-label="Choose your client" className="mh-clients">
          {CLIENTS.map((x, i) => (
            <button
              key={x.id}
              type="button"
              className={`mh-chip${!cli && i === client ? " on" : ""}`}
              aria-pressed={!cli && i === client}
              onClick={() => { onClient(i); onRoute("mcp"); }}
            >
              <img src={`${ICONS}/${x.id}.svg`} alt="" draggable={false} style={!cli && i === client ? undefined : x.filter ? { filter: x.filter } : undefined} />
              {x.name}
            </button>
          ))}
        </div>
      </div>

      <style>{`
        .mh { display: flex; flex-direction: column; align-items: center; text-align: center; width: 100%; max-width: 1080px; margin: 0 auto; }

        .mh-line { margin: 20px auto 0; max-width: 56ch; }
        .mh-chips { margin-top: 32px; display: flex; flex-wrap: nowrap; align-items: center; gap: 2px; max-width: 100%; overflow-x: auto; padding: 4px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.06); -webkit-backdrop-filter: blur(24px); backdrop-filter: blur(24px); box-shadow: 0 10px 34px -20px rgba(0,0,0,0.7); scrollbar-width: none; }
        .mh-chips::-webkit-scrollbar { display: none; }
        .mh-clients { display: flex; flex-wrap: nowrap; align-items: center; gap: 2px; }
        .mh-chip { display: inline-flex; align-items: center; gap: 6px; height: 32px; padding: 0 12px; flex-shrink: 0; white-space: nowrap; border: 0; border-radius: 8px; background: transparent; color: rgba(255,255,255,0.85); font: inherit; font-size: 13px; font-weight: 500; cursor: pointer; transition: background 0.2s, color 0.2s; }
        .mh-chip:hover { background: rgba(255,255,255,0.08); color: #fff; }
        .mh-chip.on { background: #fff; color: #15171b; box-shadow: 0 2px 10px -3px rgba(0,0,0,0.45); }
        .mh-chip img { width: 15px; height: 15px; flex-shrink: 0; transition: filter 0.2s; }

        .mh-title { --logo-h: clamp(30px, 5vw, 60px); margin: 0; display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 8px 16px; }
        .mh-lockup { display: inline-flex; align-items: center; height: var(--logo-h); gap: calc(var(--logo-h) * 8.8 / 50); transform: translateY(calc(var(--logo-h) * 0.08)); }
        .mh-lockup img { height: 100%; width: auto; display: block; }

              `}</style>
    </div>
  );
}
