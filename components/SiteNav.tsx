"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { withBasePath } from "@/lib/assets";
import { HOME, PRICING_HREF, START_HREF } from "@/lib/links";

const FONT = "var(--font-sans), sans-serif";
const NAV_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const NAV_DURATION = "480ms";

type NavLink = { label: string; href: string };

/** Keep ids in sync with the section anchors on the page. */
const NAV_LINKS: NavLink[] = [
  { label: "Tools", href: "#tools" },
  { label: "Workflows", href: "#workflows" },
  { label: "Studios", href: "#studios" },
  { label: "Use Cases", href: "#use-cases" },
  { label: "MCP", href: "#mcp" },
  { label: "Pricing", href: PRICING_HREF },
];

const isExternal = (href: string) => href.startsWith("http");

export function SiteNav({
  variant = "onLight",
}: {
  /** Theme of the hero the navbar sits over at the top of the page. The
   *  scrolled pill is always the dark glass treatment. */
  variant?: "onDark" | "onLight";
} = {}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const compact = scrolled;
  const darkTheme = compact || variant === "onDark";

  const themeVars = (
    darkTheme
      ? {
          "--nav-fg": "rgba(255,255,255,0.65)",
          "--nav-fg-hover": "#ffffff",
          "--nav-fg-ghost": "rgba(255,255,255,0.3)",
          "--nav-cta-bg": "#ffffff",
          "--nav-cta-fg": "#0A0A0B",
          "--nav-cta-glow": "rgba(255,255,255,0.08)",
          "--nav-burger": "rgba(255,255,255,0.9)",
        }
      : {
          // Over the page itself, so these follow the theme. Fixed near-black
          // here left the whole bar invisible on a dark page.
          "--nav-fg": "var(--ink-2)",
          "--nav-fg-hover": "var(--ink)",
          "--nav-fg-ghost": "var(--ink-3)",
          "--nav-cta-bg": "var(--ink)",
          "--nav-cta-fg": "var(--page-bg)",
          "--nav-cta-glow": "var(--line-strong)",
          "--nav-burger": "var(--ink-2)",
        }
  ) as React.CSSProperties;

  return (
    <>
      <style>{`
        /* The wordmark's letters are a fixed #0F0F0F, so the theme swaps the file
           rather than filtering it and inverting the mark with it. */
        .brand-dark { display: none !important; }
        :root[data-theme="dark"] .brand-light { display: none !important; }
        :root[data-theme="dark"] .brand-dark { display: block !important; }
        .nav-link { position: relative; display: inline-flex; flex-direction: column; height: 20px; overflow: hidden; cursor: pointer; text-decoration: none; }
        .nav-link-inner { display: flex; flex-direction: column; transition: transform 0.32s cubic-bezier(0.22, 1, 0.36, 1); }
        .nav-link:hover .nav-link-inner { transform: translateY(-20px); }
        .nav-link-text { display: block; height: 20px; line-height: 20px; white-space: nowrap; font-family: ${FONT}; font-size: 15px; font-weight: 500; letter-spacing: 0.01em; color: var(--nav-fg); transition: color 0.3s; }
        .nav-link:hover .nav-link-text { color: var(--nav-fg-hover); }
        .nav-link-ghost { color: var(--nav-fg-ghost); }

        .nav-cta { font-family: ${FONT}; font-weight: 500; color: var(--nav-cta-fg); background: var(--nav-cta-bg); border: none; border-radius: 22px; cursor: pointer; letter-spacing: -0.01em; white-space: nowrap; transition: box-shadow 0.2s, transform 0.2s, background 0.3s, color 0.3s; text-decoration: none; display: inline-flex; align-items: center; justify-content: center; box-sizing: border-box; }
        .nav-cta:hover { box-shadow: 0 0 0 6px var(--nav-cta-glow); transform: scale(1.02); }

        .nav-desktop { display: flex; }
        .nav-burger { display: none; }
        @media (max-width: 1080px) {
          .nav-desktop { display: none !important; }
          .nav-burger { display: inline-flex !important; }
        }
        @keyframes navMenuIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } }

        /* Without JS the burger cannot open anything, and the desktop links
           are already display:none at this width, so the bar would be a
           wordmark and a dead button. This is the same link set laid out in
           flow under the bar. It only ever renders inside <noscript>, so it
           costs a hydrated page nothing. */
        .nav-fallback {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 4px 18px;
          padding: 10px 24px 14px;
          border-bottom: 1px solid var(--line);
          background: var(--page-bg);
        }
        .nav-fallback a {
          font-size: 15px;
          font-weight: 500;
          color: var(--ink-2);
          text-decoration: none;
          padding: 6px 2px;
        }
        @media (min-width: 1081px) { .nav-fallback { display: none; } }
      `}</style>

      <nav
        style={{
          ...themeVars,
          position: "fixed",
          top: compact ? 16 : 12,
          left: 0,
          right: 0,
          marginInline: "auto",
          maxWidth: compact ? "min(1240px, calc(100vw - 32px))" : "100%",
          zIndex: 60,
          height: compact ? 72 : 64,
          paddingLeft: compact ? 28 : "max(32px, calc((100vw - 1240px) / 2 + 32px))",
          paddingRight: compact ? 16 : "max(32px, calc((100vw - 1240px) / 2 + 32px))",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          background: compact ? "rgba(10,10,11,0.42)" : "transparent",
          // At the top the bar is fully transparent: no fill and no blur
          // either. A backdrop blur with no background still frosts whatever
          // is behind it, which read as a band across the hero's mosaic.
          backdropFilter: compact ? "blur(32px) saturate(180%)" : "none",
          WebkitBackdropFilter: compact ? "blur(32px) saturate(180%)" : "none",
          borderRadius: compact ? 999 : 0,
          boxShadow: scrolled
            ? "0 20px 48px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0 1px rgba(255,255,255,0.1)"
            : "none",
          boxSizing: "border-box",
          transition: [
            `top ${NAV_DURATION} ${NAV_EASE}`,
            `max-width ${NAV_DURATION} ${NAV_EASE}`,
            `padding ${NAV_DURATION} ${NAV_EASE}`,
            `height ${NAV_DURATION} ${NAV_EASE}`,
            `border-radius ${NAV_DURATION} ${NAV_EASE}`,
            `background 320ms ease`,
            `box-shadow ${NAV_DURATION} ease`,
          ].join(", "),
        }}
      >
        <a href={HOME} style={{ display: "flex", alignItems: "center", flexShrink: 0 }} aria-label="ImagineArt home">
          <img
            className="brand-light"
            src={withBasePath("/media/imagine-art-wordmark.svg")}
            alt="ImagineArt"
            style={{
              display: "block",
              height: 24,
              width: "auto",
              filter: darkTheme ? "brightness(0) invert(1)" : "none",
              transition: "filter 0.3s ease",
            }}
          />
          <img
            className="brand-dark"
            src={withBasePath("/media/imagine-art-wordmark-dark.svg")}
            alt="" aria-hidden
            style={{
              display: "block",
              height: 24,
              width: "auto",
              filter: darkTheme ? "brightness(0) invert(1)" : "none",
              transition: "filter 0.3s ease",
            }}
          />
        </a>

        <div className="nav-desktop" style={{ alignItems: "center", gap: "clamp(14px, 1.4vw, 22px)" }}>
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="nav-link"
              {...(isExternal(link.href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              <span className="nav-link-inner">
                <span className="nav-link-text">{link.label}</span>
                <span className="nav-link-text nav-link-ghost">{link.label}</span>
              </span>
            </a>
          ))}
        </div>

        <div className="nav-desktop" style={{ alignItems: "center", gap: 10, flexShrink: 0 }}>
          <a href={START_HREF} className="nav-cta" style={{ height: 40, padding: "8px 16px", fontSize: 16 }}>
            Get Started
          </a>
        </div>

        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="nav-burger"
          style={{
            width: 38, height: 38, borderRadius: 10, border: "none", background: "transparent",
            color: "var(--nav-burger)", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0,
          }}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <span style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <span style={{ display: "block", width: 18, height: 1.5, borderRadius: 2, background: "currentColor", transition: "transform 250ms ease", transform: menuOpen ? "translateY(3.25px) rotate(45deg)" : "none" }} />
            <span style={{ display: "block", width: 18, height: 1.5, borderRadius: 2, background: "currentColor", transition: "transform 250ms ease", transform: menuOpen ? "translateY(-3.25px) rotate(-45deg)" : "none" }} />
          </span>
        </button>
      </nav>

      <noscript>
        <div className="nav-fallback">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              {...(isExternal(link.href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {link.label}
            </a>
          ))}
          <a href={START_HREF}>Get Started</a>
        </div>
      </noscript>

      {menuOpen && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 101, background: "var(--page-bg)",
            display: "flex", flexDirection: "column",
            animation: "navMenuIn 0.22s cubic-bezier(0.4,0,0.2,1) forwards",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", flexShrink: 0 }}>
            <a href={HOME} onClick={() => setMenuOpen(false)} style={{ display: "inline-flex", alignItems: "center" }} aria-label="ImagineArt home">
              <>
                <img className="brand-light" src={withBasePath("/media/imagine-art-wordmark.svg")} alt="ImagineArt" style={{ display: "block", height: 24, width: "auto" }} />
                <img className="brand-dark" src={withBasePath("/media/imagine-art-wordmark-dark.svg")} alt="" aria-hidden style={{ display: "block", height: 24, width: "auto" }} />
              </>
            </a>
            <button
              onClick={() => setMenuOpen(false)}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 4, border: "none", background: "transparent", color: "var(--ink-2)", cursor: "pointer" }}
              aria-label="Close menu"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingBottom: 40 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  {...(isExternal(link.href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  style={{
                    display: "block", textAlign: "center", padding: "10px 32px", borderRadius: 10,
                    fontFamily: FONT, fontSize: 22, fontWeight: 400, letterSpacing: "-0.2px",
                    color: "rgba(11,11,12,0.7)", textDecoration: "none",
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div style={{ width: "calc(100% - 48px)", height: 1, background: "var(--line)", margin: "16px 0" }} />

            <a
              href={START_HREF}
              onClick={() => setMenuOpen(false)}
              style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: 46, padding: "0 26px", borderRadius: 22, fontFamily: FONT, fontSize: 15, fontWeight: 600, color: "var(--page-bg)", background: "var(--ink)", textDecoration: "none" }}
            >
              Get Started
            </a>
          </div>
        </div>
      )}
    </>
  );
}
