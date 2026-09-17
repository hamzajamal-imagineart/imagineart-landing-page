"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { withBasePath } from "@/lib/assets";
import { SlidingIndicator, slidingIndicatorCss, useSlidingIndicator } from "@/components/primitives/SlidingIndicator";

/**
 * MCP connect panel, ported from Vyro-ai/imagine-web-mcp-landing and restyled
 * to this page's system (slate wash, monochrome ink, no orange accent).
 *
 * A row of client tabs on the left, an MCP / CLI route toggle on the right.
 * Below, a numbered three-step walkthrough for the selected client with copy
 * fields and deep links, and the client's real connect recording beside it.
 * The CLI route swaps the recording for a static terminal transcript.
 *
 * URLs, commands, prompts and recordings are the source repo's, verbatim.
 * Recordings stream from the Imagine CDN; the only local assets are the
 * client marks. Every tab's steps render into the HTML; the recordings load
 * lazily and only the visible one plays.
 */
const MCP_URL = "https://mcp.imagine.art";
const PKG = "@imagineartofficial/mcp";
const CDN = "https://cdn-imagine.vyro.ai/imagine-one/imagine-mcp/connect";
const FIRST_PROMPT =
  "Use Imagine MCP to generate a cinematic product shot of a matte black water bottle on wet slate, soft morning light, 16:9.";
const enc = encodeURIComponent;

const installPrompt = (id: string, label: string) =>
  [
    "Set up ImagineArt for me so I can generate images, video and music from here.",
    `1. Install the CLI: run \`npm i -g ${PKG}\`.`,
    `2. Add the server to ${label}: run \`imagine install ${id}\`. It opens my browser to sign in: tell me when it needs me, and wait. If it stops because something is missing, install that and run it again.`,
    `3. Tell me it is ready, and what I need to type in ${label} to pick up the new config.`,
  ].join("\n");

const cursorInstallUrl = () => {
  const config = JSON.stringify({ type: "http", url: MCP_URL });
  return `cursor://anysphere.cursor-deeplink/mcp/install?name=ImagineArt&config=${enc(btoa(config))}`;
};

type Action =
  | { kind: "copy"; value: string; block?: boolean }
  | { kind: "link"; href: string; label: string; primary?: boolean; external?: boolean };
type Step = { title: string; body?: React.ReactNode; action?: Action };
type Client = {
  id: string;
  label: string;
  icon: string;
  video?: string;
  steps: Step[];
};

const agentSteps = (id: string, label: string, finish: React.ReactNode): Step[] => [
  { title: `Send this prompt to ${label}`, action: { kind: "copy", value: installPrompt(id, label), block: true } },
  { title: "Finish the sign-in", body: "It opens your browser once." },
  { title: "Start creating", body: finish },
];

const CLIENTS: Client[] = [
  {
    id: "claude", label: "Claude", icon: "claude", video: "claude",
    steps: [
      { title: "Copy the connector URL", action: { kind: "copy", value: MCP_URL } },
      { title: "Go to Claude → Connectors", body: <>Add a custom connector, name it <strong>Imagine MCP</strong>.</>, action: { kind: "link", href: "https://claude.ai/customize/connectors?modal=add-custom-connector", label: "Open Claude Connectors" } },
      { title: "Connect, sign in and start", action: { kind: "link", href: `https://claude.ai/new?q=${enc(FIRST_PROMPT)}`, label: "Start Creating", primary: true } },
    ],
  },
  {
    id: "chatgpt", label: "ChatGPT", icon: "chatgpt",
    steps: [
      { title: "Open ImagineArt in ChatGPT", action: { kind: "link", href: "https://chatgpt.com/plugins/plugin_asdk_app_6a97af93ebc88191961039f177688fa9", label: "Open In ChatGPT" } },
      { title: "Install the plugin", body: "Connect your imagine.art account when ChatGPT asks." },
      { title: "Start creating", body: <>Type <code>@ImagineArt</code> and ask for an image, a video or a track.</>, action: { kind: "link", href: `https://chatgpt.com/?q=${enc(FIRST_PROMPT)}`, label: "Start Creating", primary: true } },
    ],
  },
  {
    id: "cursor", label: "Cursor", icon: "cursor", video: "cursor",
    steps: [
      { title: "Add to Cursor", body: "One click, then approve the server.", action: { kind: "link", href: cursorInstallUrl(), label: "Add To Cursor", primary: true, external: false } },
      { title: "Or use one command", action: { kind: "copy", value: `npx -y ${PKG} install cursor`, block: true } },
      { title: "Connect and start", body: "Cursor signs in on first use. Then ask it for a hero image." },
    ],
  },
  { id: "hermes", label: "Hermes", icon: "hermes", video: "hermes", steps: agentSteps("hermes", "Hermes", <>In your Hermes session type <code>/reload-mcp</code>, then ask for <em>an image of a red bicycle on a beach at dawn</em>.</>) },
  { id: "openclaw", label: "OpenClaw", icon: "openclaw", video: "openclaw", steps: agentSteps("openclaw", "OpenClaw", <>Restart the gateway with <code>openclaw mcp reload</code>, then ask for <em>an image of a red bicycle on a beach at dawn</em>.</>) },
  {
    id: "grok", label: "Grok", icon: "grok", video: "grok",
    steps: [
      { title: "Copy the connector URL", action: { kind: "copy", value: MCP_URL } },
      { title: "Go to Grok → Connectors", body: <>Add a connector, name it <strong>Imagine MCP</strong>.</>, action: { kind: "link", href: "https://grok.com/connectors", label: "Open Grok Connectors" } },
      { title: "Connect, sign in and start", action: { kind: "link", href: `https://grok.com/?q=${enc(FIRST_PROMPT)}`, label: "Start Creating", primary: true } },
    ],
  },
];

const CLI_STEPS: Step[] = [
  { title: "Install the CLI", action: { kind: "copy", value: `npm i -g ${PKG}` } },
  { title: "Sign in once", action: { kind: "copy", value: "imagine login" } },
  { title: "Start creating", body: <>Same for <code>video</code>, <code>music</code>, <code>ad</code> and <code>fashion</code>.</>, action: { kind: "copy", value: 'imagine image "a red bicycle on a beach at dawn"' } },
];

const CLI_CAST: { kind: "cmd" | "out" | "ok" | "gap"; text?: string }[] = [
  { kind: "cmd", text: `npm i -g ${PKG}` },
  { kind: "out", text: "added 63 packages in 4s" },
  { kind: "gap" },
  { kind: "cmd", text: "imagine login" },
  { kind: "ok", text: "✓ Signed in as you@yourteam.com" },
  { kind: "out", text: "  Studio workspace · 12,480 credits" },
  { kind: "gap" },
  { kind: "cmd", text: 'imagine image "a red bicycle at dawn"' },
  { kind: "ok", text: "✓ 1 image · 38s" },
  { kind: "out", text: "  ./imagine-a1c93f.png" },
];

function CopyButton({ value }: { value: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className="mcp-copy"
      onClick={async () => {
        try { await navigator.clipboard.writeText(value); setDone(true); setTimeout(() => setDone(false), 1400); } catch {}
      }}
      aria-label={done ? "Copied" : "Copy"}
      title={done ? "Copied" : "Copy"}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {done ? <path d="M5 12.5l4.5 4.5L19 7" /> : <><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V6a2 2 0 0 1 2-2h9" /></>}
      </svg>
    </button>
  );
}

function StepAction({ a }: { a: Action }) {
  if (a.kind === "copy") {
    return a.block ? (
      <div className="mcp-block">
        <span className="mcp-block-copy"><CopyButton value={a.value} /></span>
        <pre><code>{a.value}</code></pre>
      </div>
    ) : (
      <span className="mcp-field">
        <code>{a.value}</code>
        <CopyButton value={a.value} />
      </span>
    );
  }
  const ext = a.external !== false;
  return (
    <a href={a.href} {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})} className={`mcp-btn ${a.primary ? "mcp-btn-dark" : ""}`}>
      {a.label}
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M7 17L17 7M9 7h8v8" />
      </svg>
    </a>
  );
}

function Steps({ steps }: { steps: Step[] }) {
  return (
    <ol className="mcp-steps">
      {steps.map((s, i) => (
        <li key={s.title} className="mcp-step">
          <span className="mcp-n">{i + 1}</span>
          <div className="mcp-step-body">
            <div className="mcp-step-title">{s.title}</div>
            {s.body && <p className="mcp-step-text">{s.body}</p>}
            {s.action && <div className="mcp-step-action"><StepAction a={s.action} /></div>}
          </div>
        </li>
      ))}
    </ol>
  );
}

export function Mcp() {
  const [route, setRoute] = useState<"mcp" | "cli">("mcp");
  const [client, setClient] = useState(0);
  // Nothing is selected in the client list while the CLI route is showing.
  const clientTabs = useSlidingIndicator<HTMLButtonElement>(route === "mcp" ? client : -1);
  const routeTabs = useSlidingIndicator<HTMLButtonElement>(route === "mcp" ? 0 : 1);
  const c = CLIENTS[client];

  return (
    <section id="mcp" className="relative border-t border-black/[0.08] py-24 md:py-32">
      <div className="container-page">
        <div className="mx-auto max-w-[680px] text-center">
          <h2 className="h2 mcp-title"><img src={withBasePath("/media/mcp/imagine-mcp-logo.svg")} alt="Imagine MCP" /></h2>
          <p className="lede mx-auto mt-5">
            Every ImagineArt tool inside the agent you already use, connected once
            and ready in a minute.
          </p>
        </div>

        <div className="mcp-panel mt-12">
          <div className="mcp-bar">
            <div
              className={`mcp-tabs ${route === "cli" ? "mcp-tabs-off" : ""}`}
              ref={clientTabs.containerRef as React.Ref<HTMLDivElement>}
              role="tablist"
              aria-label="Clients"
            >
              <SlidingIndicator box={clientTabs.box} ready={clientTabs.ready} className="mcp-tab-fill" />
              {CLIENTS.map((cl, i) => (
                <button
                  key={cl.id}
                  ref={(el) => { clientTabs.itemRefs.current[i] = el; }}
                  role="tab"
                  type="button"
                  aria-selected={route === "mcp" && i === client}
                  className={`mcp-tab ${route === "mcp" && i === client ? "mcp-tab-on" : ""}`}
                  onClick={() => { setRoute("mcp"); setClient(i); }}
                >
                  <img src={withBasePath(`/media/mcp/clients/${cl.icon}.svg`)} alt="" aria-hidden />
                  {cl.label}
                </button>
              ))}
            </div>
            <div className="mcp-route" ref={routeTabs.containerRef as React.Ref<HTMLDivElement>} role="tablist" aria-label="Route">
              <SlidingIndicator box={routeTabs.box} ready={routeTabs.ready} className="mcp-tab-fill mcp-route-fill" />
              <button ref={(el) => { routeTabs.itemRefs.current[0] = el; }} type="button" role="tab" aria-selected={route === "mcp"} className={`mcp-tab ${route === "mcp" ? "mcp-tab-on" : ""}`} onClick={() => setRoute("mcp")}>
                <svg viewBox="0 0 180 180" fill="none" aria-hidden><g stroke="currentColor" strokeWidth="13" strokeLinecap="round"><path d="M23.6 85.25 86.2 22.65c8.65-8.64 22.66-8.64 31.3 0 8.65 8.65 8.65 22.66 0 31.3L70.23 101.23" /><path d="m70.88 100.58 46.62-46.63c8.65-8.64 22.66-8.64 31.31 0l.33.33c8.64 8.64 8.64 22.66 0 31.3l-56.62 56.62c-2.88 2.88-2.88 7.55 0 10.43l11.62 11.63" /><path d="M101.85 38.3 55.55 84.6c-8.64 8.65-8.64 22.66 0 31.3 8.65 8.65 22.66 8.65 31.3 0l46.3-46.3" /></g></svg>
                MCP
              </button>
              <button ref={(el) => { routeTabs.itemRefs.current[1] = el; }} type="button" role="tab" aria-selected={route === "cli"} className={`mcp-tab ${route === "cli" ? "mcp-tab-on" : ""}`} onClick={() => setRoute("cli")}>
                <svg viewBox="0 0 24 24" fill="none" aria-hidden><g stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="m18 16 4-4-4-4" /><path d="m6 8-4 4 4 4" /><path d="m14.5 4-5 16" /></g></svg>
                CLI
              </button>
            </div>
          </div>

          <div className="mcp-body">
            {route === "mcp" ? (
              <>
                <Steps steps={c.steps} />
                <div className="mcp-visual">
                  {c.video ? (
                    // eslint-disable-next-line jsx-a11y/media-has-caption
                    <video
                      key={c.video}
                      src={`${CDN}/${c.video}.mp4`}
                      poster={`${CDN}/${c.video}.jpg`}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      aria-hidden
                    />
                  ) : (
                    <div className="mcp-empty">
                      <img src={withBasePath(`/media/mcp/clients/${c.icon}.svg`)} alt="" aria-hidden />
                      <span>Type <code>@ImagineArt</code> in any chat.</span>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Steps steps={CLI_STEPS} />
                <div className="mcp-visual mcp-term">
                  <div className="mcp-term-bar" aria-hidden><span /><span /><span /></div>
                  <pre>
                    {CLI_CAST.map((l, i) =>
                      l.kind === "gap" ? <span key={i} className="mcp-gap" /> : (
                        <span key={i} className={`mcp-l mcp-l-${l.kind}`}>{l.kind === "cmd" ? "$ " : ""}{l.text}</span>
                      ),
                    )}
                  </pre>
                </div>
              </>
            )}
          </div>

          <div className="mcp-foot">
            <span>{route === "mcp" ? "On Claude Code or Codex? The CLI is the shorter road." : "Same package as the MCP server. Eleven clients install with one command."}</span>
            <a href={`https://www.npmjs.com/package/${PKG}`} target="_blank" rel="noopener noreferrer" className="mcp-pkg">
              {PKG}
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M7 17L17 7M9 7h8v8" /></svg>
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .mcp-panel {
          border: 1px solid var(--line);
          border-radius: 26px;
          background: #dce4ee;
          padding: 8px;
        }
        .mcp-bar { display: flex; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
        /* Segmented groups: a step darker than the panel so the row reads as a
           control, with the active pill white on top. */
        .mcp-tabs, .mcp-route {
          display: inline-flex;
          gap: 4px;
          padding: 5px;
          border-radius: 16px;
          background: #cfd9e5;
        }
        .mcp-tabs { flex-wrap: wrap; position: relative; }
        .mcp-tab {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          height: 40px;
          padding: 0 14px;
          border: 0;
          border-radius: 16px;
          background: transparent;
          font-family: inherit;
          font-size: 14.5px;
          font-weight: 500;
          letter-spacing: -0.01em;
          color: var(--ink-3);
          cursor: pointer;
          position: relative;
          z-index: 1;
          transition: color 260ms ease;
        }
        /* No border: the fill alone marks the selected tab, and an outline
           here read as a button. */
        .mcp-tab-fill {
          border-radius: 16px;
          background: var(--panel);
          box-shadow: 0 1px 2px rgba(16, 20, 30, 0.05);
        }
        .mcp-route-fill { border-radius: 13px; }
        .mcp-tab:hover { color: var(--ink); }
        .mcp-tab-on { color: var(--ink); }
        ${slidingIndicatorCss}
        .mcp-tab img, .mcp-tab svg { width: 18px; height: 18px; display: block; }
        .mcp-tabs-off .mcp-tab { color: var(--ink-3); }
        .mcp-route { padding: 4px; border-radius: 12px; align-self: center; position: relative; }
        .mcp-route .mcp-tab { height: 32px; padding: 0 10px; font-size: 13px; gap: 6px; border-radius: 13px; }
        .mcp-route .mcp-tab svg { width: 14px; height: 14px; }
        .mcp-title { display: flex; justify-content: center; }
        .mcp-title img { display: block; height: clamp(30px, 3.2vw, 44px); width: auto; }

        .mcp-body {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);
          gap: clamp(20px, 3vw, 40px);
          align-items: center;
          padding: clamp(22px, 3vw, 40px) clamp(14px, 2vw, 28px);
        }

        .mcp-steps { list-style: none; display: flex; flex-direction: column; gap: 22px; }
        .mcp-step { display: flex; gap: 14px; align-items: flex-start; }
        .mcp-n {
          width: 26px; height: 26px;
          border-radius: 999px;
          display: grid; place-items: center;
          background: rgba(255, 255, 255, 0.6);
          font-size: 12.5px;
          font-weight: 500;
          color: var(--ink-2);
          flex: 0 0 auto;
          margin-top: 1px;
        }
        .mcp-step-body { min-width: 0; flex: 1; }
        .mcp-step-title { font-size: 16.5px; font-weight: 500; letter-spacing: -0.01em; color: var(--ink); line-height: 1.3; }
        .mcp-step-text { margin-top: 5px; font-size: 14.5px; line-height: 1.55; color: var(--ink-2); }
        .mcp-step-text code, .mcp-empty code { font-family: var(--font-mono); font-size: 0.92em; padding: 1px 6px; border-radius: 6px; background: var(--panel); border: 1px solid var(--line); }
        .mcp-step-action { margin-top: 10px; }

        .mcp-field {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          max-width: 100%;
          height: 38px;
          padding-left: 12px;
          padding-right: 5px;
          border-radius: 10px;
          background: var(--panel);
          border: 1px solid var(--line);
        }
        .mcp-field code { font-family: var(--font-mono); font-size: 13px; color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .mcp-copy {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          padding: 0;
          border: 0;
          border-radius: 7px;
          background: var(--ink);
          color: #fff;
          font-family: inherit;
          font-size: 12.5px;
          font-weight: 500;
          cursor: pointer;
        }
        .mcp-block {
          position: relative;
          border-radius: 12px;
          background: var(--panel);
          border: 1px solid var(--line);
          padding: 12px 14px;
        }
        .mcp-block-copy { position: absolute; top: 10px; right: 10px; }
        .mcp-block pre { font-family: var(--font-mono); font-size: 11.5px; line-height: 1.6; color: var(--ink-2); white-space: pre-wrap; word-break: break-word; padding-right: 40px; }

        .mcp-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          height: 38px;
          padding: 0 14px;
          border-radius: 10px;
          background: var(--panel);
          border: 1px solid var(--line-strong);
          font-size: 13.5px;
          font-weight: 500;
          color: var(--ink);
          transition: border-color 0.2s ease, background 0.2s ease;
        }
        .mcp-btn:hover { border-color: var(--ink-3); }
        .mcp-btn-dark { background: var(--ink); color: #fff; border-color: var(--ink); }
        .mcp-btn-dark:hover { background: #2a2a2c; }

        .mcp-visual {
          position: relative;
          aspect-ratio: 16 / 9.4;
          border-radius: 16px;
          overflow: hidden;
          background: #cfd9e5;
          border: 1px solid rgba(0, 0, 0, 0.1);
        }
        .mcp-visual video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }
        .mcp-empty {
          position: absolute; inset: 0;
          display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px;
          color: var(--ink-2);
          font-size: 14.5px;
        }
        .mcp-empty img { width: 40px; height: 40px; }

        .mcp-term { padding: 14px 16px 16px; display: flex; flex-direction: column; gap: 12px; }
        .mcp-term-bar { display: flex; gap: 6px; }
        .mcp-term-bar span { width: 9px; height: 9px; border-radius: 999px; background: rgba(0,0,0,0.14); }
        .mcp-term pre { font-family: var(--font-mono); font-size: 12.5px; line-height: 1.7; color: var(--ink-3); display: flex; flex-direction: column; }
        .mcp-l-cmd { color: var(--ink); }
        .mcp-l-ok { color: var(--ink-2); }
        .mcp-gap { height: 0.7em; }

        .mcp-foot {
          border-top: 0;
          display: flex;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
          padding: 14px 18px 10px;
          font-size: 13px;
          color: var(--ink-3);
        }
        .mcp-pkg { display: inline-flex; align-items: center; gap: 5px; font-family: var(--font-mono); font-size: 12.5px; color: var(--ink-2); }
        .mcp-pkg:hover { color: var(--ink); }

        @media (max-width: 880px) {
          .mcp-body { grid-template-columns: 1fr; }
          .mcp-visual { order: -1; }
          .mcp-tab { height: 36px; padding: 0 11px; font-size: 13.5px; }
        }
      `}</style>
    </section>
  );
}
