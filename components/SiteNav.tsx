"use client";

/* eslint-disable @next/next/no-img-element */
import { Fragment, useEffect, useRef, useState } from "react";
import { withBasePath } from "@/lib/assets";
import { PAGE_THEME, type PageTheme } from "@/lib/theme";
import {
  NAV,
  NAV_CTA,
  NAV_HOME,
  NAV_SIGN_IN,
  type NavCard,
  type NavGroup,
  type NavItem,
  type NavPanel,
} from "@/lib/nav-menu";

const FONT = "var(--font-sans), sans-serif";
const NAV_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const NAV_DURATION = "480ms";

const isExternal = (href: string) => href.startsWith("http") && !href.startsWith(NAV_HOME);
const linkTarget = (href: string) =>
  isExternal(href) ? { target: "_blank", rel: "noopener noreferrer" } : {};

/* ─── Icons ─────────────────────────────────────────────────── */

function Chevron({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <path d="M6 3.5l4.2 4.1a.55.55 0 010 .8L6 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <path d="M5 7.5l4.6 4.6a.55.55 0 00.8 0L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M11 7H2.5M8.25 10.5L11 7.4c.4-.4.4-.4 0-.8L8.25 3.5" stroke="currentColor" strokeLinecap="round" />
    </svg>
  );
}

function ArrowUpRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M14.5 5.5L5 15M15.5 13l-.35-7c0-.9 0-.9-1-1l-7.15-.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/* ─── Dropdown pieces (desktop panel and mobile accordion share them) ── */

function Badge({ children, muted }: { children: string; muted?: boolean }) {
  return <span className={muted ? "mm-badge mm-badge-muted" : "mm-badge"}>{children}</span>;
}

function Item({ item, onNavigate }: { item: NavItem; onNavigate: () => void }) {
  const title = (
    <span className="mm-item-title">
      {item.title}
      {item.badge && <Badge>{item.badge}</Badge>}
      {item.href && <Chevron className="mm-chev" />}
    </span>
  );
  const desc = item.description && <span className="mm-desc">{item.description}</span>;

  // Several destinations: the item is a label, its links sit under the copy.
  if (item.links) {
    return (
      <div className="mm-item mm-item-static">
        {title}
        {desc}
        <span className="mm-sublinks">
          {item.links.map((l) => (
            <a key={l.label} href={l.href} className="mm-sublink" onClick={onNavigate} {...linkTarget(l.href)}>
              {l.label}
              <ArrowRight />
            </a>
          ))}
        </span>
      </div>
    );
  }
  // No page yet ("Soon"): shown, not linked.
  if (!item.href) {
    return (
      <div className="mm-item mm-item-static mm-item-soon" aria-disabled="true">
        {title}
        {desc}
      </div>
    );
  }
  return (
    <a href={item.href} className="mm-item" onClick={onNavigate} {...linkTarget(item.href)}>
      {title}
      {desc}
    </a>
  );
}

function Group({ group, onNavigate }: { group: NavGroup; onNavigate: () => void }) {
  return (
    <div className={group.links ? "mm-group mm-group-links" : "mm-group"}>
      {group.heading && <p className="mm-heading">{group.heading}</p>}
      {group.items?.map((item) => <Item key={item.title} item={item} onNavigate={onNavigate} />)}
      {group.links?.map((link) => (
        <a key={link.label} href={link.href} className="mm-link" onClick={onNavigate} {...linkTarget(link.href)}>
          {link.label}
        </a>
      ))}
      {group.more && (
        <a href={group.more.href} className="mm-more" onClick={onNavigate} {...linkTarget(group.more.href)}>
          {group.more.label}
          <ArrowRight />
        </a>
      )}
    </div>
  );
}

function CardMedia({ media }: { media: Extract<NavCard, { kind: "card" }>["media"] }) {
  if (media.kind === "image") {
    return (
      <div className="mm-media-image">
        <img src={withBasePath(media.src)} alt="" />
      </div>
    );
  }
  if (media.kind === "fan") {
    const [left, right, front] = media.srcs;
    return (
      <div className="mm-fan" aria-hidden>
        <img src={withBasePath(left)} alt="" className="mm-fan-left" />
        <img src={withBasePath(right)} alt="" className="mm-fan-right" />
        <img src={withBasePath(front)} alt="" className="mm-fan-front" />
      </div>
    );
  }
  return (
    <div className="mm-split" aria-hidden>
      <img src={withBasePath(media.srcs[0])} alt="" />
      <img src={withBasePath(media.srcs[1])} alt="" className="mm-split-mirror" />
    </div>
  );
}

function Card({ card, onNavigate }: { card: NavCard; onNavigate: () => void }) {
  if (card.kind === "tile") {
    return (
      <a href={card.href} className="mm-tile" onClick={onNavigate} {...linkTarget(card.href)}>
        <img src={withBasePath(card.src)} alt={card.alt} />
      </a>
    );
  }
  return (
    <div className={`mm-card${card.surface ? ` mm-card-${card.surface}` : ""}`}>
      <CardMedia media={card.media} />
      <div className="mm-card-copy">
        <p className="mm-card-title">
          {card.title}
          {card.badge && <Badge muted>{card.badge}</Badge>}
        </p>
        <p className="mm-card-body">{card.body}</p>
      </div>
      <a href={card.cta.href} className="mm-card-cta" onClick={onNavigate} {...linkTarget(card.cta.href)}>
        {card.cta.label}
      </a>
    </div>
  );
}

function Panel({ panel, onNavigate }: { panel: NavPanel; onNavigate: () => void }) {
  return (
    <>
      {panel.columns.map((col, i) => (
        <div
          key={i}
          className={`mm-col${col.width === "narrow" ? " mm-col-narrow" : ""}${col.divider ? " mm-col-divider" : ""}`}
        >
          {col.groups.map((g, j) => <Group key={j} group={g} onNavigate={onNavigate} />)}
        </div>
      ))}
      {panel.cards && (
        <div className="mm-cards">
          {panel.cards.map((c, i) => <Card key={i} card={c} onNavigate={onNavigate} />)}
        </div>
      )}
    </>
  );
}

/* ─── SiteNav ───────────────────────────────────────────────── */

export function SiteNav({
  variant = "onLight",
  theme = PAGE_THEME,
}: {
  /** Theme of the hero the navbar sits over while at the top of the page.
   *  "onDark" → white links/logo/CTA. "onLight" → dark ones (default).
   *  The scrolled pill is always the dark glass treatment. Opening a
   *  dropdown never changes the bar; the panel hangs under it as-is. */
  variant?: "onDark" | "onLight";
  /** Colour scheme of the dropdown panels and the mobile sheet. Follows the
   *  page (PAGE_THEME in lib/theme.ts) unless a page overrides it here. */
  theme?: PageTheme;
} = {}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  /** Label of the open desktop dropdown, or null. */
  const [openPanel, setOpenPanel] = useState<string | null>(null);
  /** Label of the expanded mobile accordion row, or null. */
  const [openRow, setOpenRow] = useState<string | null>(null);
  const focusPanel = useRef(false);
  /** Pending hover open/close, so crossing the gap to the panel doesn't close it. */
  const hoverTimer = useRef<number | undefined>(undefined);
  /** The open panel came from hover: the click that usually follows mustn't toggle it shut. */
  const openedByHover = useRef(false);

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

  useEffect(() => {
    if (!openPanel && !menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpenPanel(null); setMenuOpen(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openPanel, menuOpen]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1080px)");
    const onChange = () => (mq.matches ? setOpenPanel(null) : setMenuOpen(false));
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Keyboard opens (Enter/Space report detail 0) move focus into the panel,
  // since it renders after the bar and would otherwise sit behind every tab stop.
  useEffect(() => {
    if (!openPanel || !focusPanel.current) return;
    focusPanel.current = false;
    document.querySelector<HTMLElement>("#nav-dropdown a")?.focus();
  }, [openPanel]);

  const closeAll = () => { setOpenPanel(null); setMenuOpen(false); };

  // Desktop menus open on hover (mouse only; touch and keyboard use click).
  useEffect(() => () => window.clearTimeout(hoverTimer.current), []);
  const isMouse = (e: React.PointerEvent) => e.pointerType === "mouse";
  const hoverOpen = (label: string) => (e: React.PointerEvent) => {
    if (!isMouse(e)) return;
    window.clearTimeout(hoverTimer.current);
    // Small intent delay from closed, instant when moving between open menus.
    hoverTimer.current = window.setTimeout(() => {
      openedByHover.current = true;
      setOpenPanel(label);
    }, openPanel ? 0 : 90);
  };
  const hoverClose = (e: React.PointerEvent) => {
    if (!isMouse(e)) return;
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setOpenPanel(null), 180);
  };
  const hoverKeep = (e: React.PointerEvent) => {
    if (isMouse(e)) window.clearTimeout(hoverTimer.current);
  };

  const compact = scrolled;
  const panelEntry = NAV.find((e) => e.label === openPanel && e.panel);
  const darkTheme = compact || variant === "onDark";

  // Full width and flush to the top at all times (Hamza, 6 Oct): no gap
  // above the bar and no compact pill; scrolling only brings in the dark
  // glass. Local change to the kit's file — fold it back into
  // guidelines-for-landing-page.
  const barTop = 0;
  const barHeight = 64;

  const themeVars = (
    darkTheme
      ? {
          "--nav-fg": "rgba(255,255,255,0.65)",
          "--nav-fg-hover": "#ffffff",
          "--nav-tab-hover": "rgba(255,255,255,0.1)",
          "--nav-cta-bg": "#ffffff",
          "--nav-cta-fg": "#0A0A0B",
          "--nav-cta-glow": "rgba(255,255,255,0.08)",
          "--nav-burger": "rgba(255,255,255,0.9)",
          "--nav-sel-bg": "rgba(255,255,255,0.22)",
          "--nav-sel-fg": "#ffffff",
        }
      : {
          "--nav-fg": "#757575",
          "--nav-fg-hover": "#0b0b0c",
          "--nav-tab-hover": "#ebebeb",
          "--nav-cta-bg": "#171717",
          "--nav-cta-fg": "#ffffff",
          "--nav-cta-glow": "rgba(11,11,12,0.08)",
          "--nav-burger": "rgba(11,11,12,0.8)",
          "--nav-sel-bg": "rgba(23,23,23,0.12)",
          "--nav-sel-fg": "#171717",
        }
  ) as React.CSSProperties;

  return (
    <>
      <style>{`
        .nav-tab { display: inline-flex; align-items: center; height: 32px; padding: 6px 12px; border: none; border-radius: 10px; background: transparent; cursor: pointer; text-decoration: none; white-space: nowrap; font-family: ${FONT}; font-size: 14px; font-weight: 500; line-height: 20px; letter-spacing: 0.02em; color: var(--nav-fg); transition: color 0.25s, background 0.25s; }
        .nav-tab:hover, .nav-tab:focus-visible, .nav-tab[aria-expanded="true"] { color: var(--nav-fg-hover); background: var(--nav-tab-hover); outline: none; }

        .nav-signin { font-family: ${FONT}; font-size: 14px; font-weight: 500; color: var(--nav-fg-hover); text-decoration: none; padding: 6px 10px; border-radius: 10px; white-space: nowrap; transition: color 0.3s, background 0.25s; }
        .nav-signin:hover { background: var(--nav-tab-hover); }
        .nav-cta { font-family: ${FONT}; font-weight: 500; color: var(--nav-cta-fg); background: var(--nav-cta-bg); border: none; border-radius: 10px; cursor: pointer; letter-spacing: 0.02em; white-space: nowrap; transition: box-shadow 0.2s, transform 0.2s, background 0.3s, color 0.3s; text-decoration: none; display: inline-flex; align-items: center; justify-content: center; box-sizing: border-box; }
        .nav-cta:hover { box-shadow: 0 0 0 6px var(--nav-cta-glow); transform: scale(1.02); }

        .nav-desktop { display: flex; }
        .nav-burger { display: none; }
        @media (max-width: 1080px) {
          .nav-desktop, .mm-panel, .mm-backdrop { display: none !important; }
          .nav-burger { display: inline-flex !important; }
        }
        @keyframes navMenuIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } }

        /* Selection follows the bar's own theme, whatever the page sets. */
        .site-nav ::selection { background: var(--nav-sel-bg); color: var(--nav-sel-fg); }

        /* ── Menu theme ─────────────────────────────────────────
           Every colour in the dropdowns and the mobile sheet comes from
           these tokens. data-menu-theme="dark" swaps the whole set; pick it
           with the \`theme\` prop or PAGE_THEME in lib/theme.ts.
           --mm-accent-soft is the "New"/"Soon" badge and the tinted card.
           Figma has it lavender rgba(165,110,255,0.15); it ships grey per
           the monochrome rule (GUIDELINES §2) until that's signed off. */
        .mm-scope {
          --mm-surface: #ffffff; --mm-border: rgba(0,0,0,0.06); --mm-divider: #dbdbdb;
          --mm-fg: #0f0f0f; --mm-muted: #757575; --mm-row: #3d3d3d; --mm-more: #3d3d3d;
          --mm-hover: #ebebeb; --mm-accent-soft: rgba(23,23,23,0.07); --mm-tint-surface: #f1f2f3;
          --mm-badge-muted-bg: #dbdbdb; --mm-badge-muted-fg: #3d3d3d;
          --mm-cta-bg: #171717; --mm-cta-fg: #ffffff; --mm-cta-glow: rgba(11,11,12,0.08);
          --mm-shadow: 0 4px 8px rgba(176,175,175,0.2), 0 18px 50px rgba(23,35,56,0.08);
          --mm-sel-bg: rgba(23,23,23,0.12); --mm-sel-fg: #171717; --mm-logo-filter: none;
        }
        .mm-scope[data-menu-theme="dark"] {
          --mm-surface: #141416; --mm-border: rgba(255,255,255,0.08); --mm-divider: rgba(255,255,255,0.1);
          --mm-fg: #f5f5f5; --mm-muted: rgba(255,255,255,0.55); --mm-row: rgba(255,255,255,0.85); --mm-more: rgba(255,255,255,0.75);
          --mm-hover: rgba(255,255,255,0.08); --mm-accent-soft: rgba(255,255,255,0.1); --mm-tint-surface: #1c1c1f;
          --mm-badge-muted-bg: rgba(255,255,255,0.12); --mm-badge-muted-fg: rgba(255,255,255,0.7);
          --mm-cta-bg: #ffffff; --mm-cta-fg: #0a0a0b; --mm-cta-glow: rgba(255,255,255,0.1);
          --mm-shadow: 0 18px 50px rgba(0,0,0,0.5);
          --mm-sel-bg: rgba(255,255,255,0.22); --mm-sel-fg: #ffffff; --mm-logo-filter: brightness(0) invert(1);
        }
        .mm-scope ::selection { background: var(--mm-sel-bg); color: var(--mm-sel-fg); }

        /* ── Dropdown panel ───────────────────────────────────── */
        .mm-panel { position: fixed; left: 0; right: 0; margin-inline: auto; width: max-content; max-width: calc(100vw - 32px); z-index: 59; display: flex; align-items: flex-start; gap: 24px; padding: 24px; box-sizing: border-box; background: var(--mm-surface); border: 1px solid var(--mm-border); border-radius: 20px; box-shadow: var(--mm-shadow); animation: navMenuIn 0.22s ${NAV_EASE} both; transition: top ${NAV_DURATION} ${NAV_EASE}; font-family: ${FONT}; }
        /* Invisible bridge over the gap to the bar, so hover survives the trip down. */
        .mm-panel::before { content: ""; position: absolute; left: 0; right: 0; top: -34px; height: 34px; }
        .mm-backdrop { position: fixed; inset: 0; z-index: 58; }

        .mm-col { display: flex; flex-direction: column; gap: 23px; width: 247px; flex-shrink: 0; }
        .mm-col-narrow { width: 196px; }
        .mm-col-divider { padding-right: 24px; border-right: 1px solid var(--mm-hover); width: 271px; box-sizing: border-box; }
        .mm-group { display: flex; flex-direction: column; gap: 16px; }
        .mm-group-links { gap: 8px; }
        .mm-heading { margin: 0; padding: 0 10px; font-size: 14px; line-height: 20px; font-weight: 500; letter-spacing: 0.01em; color: var(--mm-muted); }

        .mm-item { display: flex; flex-direction: column; gap: 2px; padding: 8px 10px; border-radius: 10px; text-decoration: none; transition: background 0.2s; outline: none; }
        .mm-item:hover, .mm-item:focus-visible { background: var(--mm-hover); }
        .mm-item-title { display: flex; align-items: center; gap: 10px; font-size: 18px; line-height: 28px; font-weight: 600; color: var(--mm-fg); }
        .mm-item-title .mm-badge { margin-left: 4px; }
        .mm-chev { color: var(--mm-fg); opacity: 0; transform: translateX(-4px); transition: opacity 0.2s, transform 0.2s; flex-shrink: 0; }
        .mm-item:hover .mm-chev, .mm-item:focus-visible .mm-chev { opacity: 1; transform: none; }
        .mm-item-static:hover { background: transparent; }
        .mm-item-soon { cursor: default; }
        .mm-item-soon .mm-item-title { color: var(--mm-muted); }
        .mm-sublinks { display: flex; gap: 4px; margin: 6px 0 0 -8px; }
        .mm-sublink { display: inline-flex; align-items: center; gap: 6px; height: 28px; padding: 4px 8px; box-sizing: border-box; border-radius: 8px; font-size: 14px; font-weight: 500; letter-spacing: 0.01em; color: var(--mm-fg); text-decoration: none; transition: background 0.2s; }
        .mm-sublink:hover, .mm-sublink:focus-visible { background: var(--mm-hover); outline: none; }
        .mm-desc { font-size: 14px; line-height: 20px; font-weight: 400; letter-spacing: 0.01em; color: var(--mm-muted); max-width: 227px; }

        .mm-badge { display: inline-flex; align-items: center; height: 20px; padding: 2px 6px; box-sizing: border-box; border-radius: 6px; background: var(--mm-accent-soft); font-size: 12px; line-height: 16px; font-weight: 500; letter-spacing: 0.02em; color: var(--mm-fg); }
        .mm-badge-muted { height: 16px; padding: 1px 5px; background: var(--mm-badge-muted-bg); font-size: 10px; line-height: 14px; color: var(--mm-badge-muted-fg); }

        .mm-link { padding: 4px 10px; border-radius: 10px; font-size: 14px; line-height: 20px; font-weight: 500; letter-spacing: 0.01em; color: var(--mm-fg); text-decoration: none; transition: background 0.2s; }
        .mm-link:hover, .mm-link:focus-visible { background: var(--mm-hover); outline: none; }
        .mm-more { margin-top: 8px; align-self: flex-start; display: inline-flex; align-items: center; gap: 6px; height: 32px; padding: 6px 10px; box-sizing: border-box; border-radius: 10px; font-size: 14px; font-weight: 500; letter-spacing: 0.02em; color: var(--mm-more); text-decoration: none; transition: background 0.2s; }
        .mm-more:hover, .mm-more:focus-visible { background: var(--mm-hover); outline: none; }

        .mm-cards { display: flex; gap: 20px; align-self: stretch; }
        .mm-tile { display: block; width: 260px; min-height: 374px; border-radius: 16px; overflow: hidden; background: var(--mm-tint-surface); }
        .mm-tile img { display: block; width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ${NAV_EASE}; }
        .mm-tile:hover img { transform: scale(1.03); }
        /* Cards drop out before the panel can outgrow a narrow desktop window. */
        @media (max-width: 1180px) { .mm-cards { display: none; } }

        .mm-card { width: 260px; display: flex; flex-direction: column; gap: 12px; padding: 16px; box-sizing: border-box; border: 1px solid var(--mm-hover); border-radius: 12px; background: var(--mm-surface); overflow: hidden; }
        .mm-card-tint { background: var(--mm-tint-surface); }
        .mm-card-muted { background: var(--mm-tint-surface); border-color: var(--mm-divider); }
        .mm-card-copy { display: flex; flex-direction: column; gap: 4px; }
        .mm-card-title { margin: 0; display: flex; align-items: center; gap: 12px; font-size: 20px; line-height: 28px; font-weight: 500; color: var(--mm-fg); }
        .mm-card-body { margin: 0; font-size: 14px; line-height: 20px; font-weight: 400; letter-spacing: 0.01em; color: var(--mm-muted); }
        .mm-card-cta { align-self: flex-start; display: inline-flex; align-items: center; height: 32px; padding: 6px 10px; box-sizing: border-box; border-radius: 10px; background: var(--mm-cta-bg); color: var(--mm-cta-fg); font-size: 14px; font-weight: 500; letter-spacing: 0.02em; text-decoration: none; transition: box-shadow 0.2s; }
        .mm-card-cta:hover { box-shadow: 0 0 0 5px var(--mm-cta-glow); }

        .mm-media-image { aspect-ratio: 243 / 186; border-radius: 12px; overflow: hidden; }
        .mm-media-image img { display: block; width: 100%; height: 100%; object-fit: cover; transform: scale(1.55); transform-origin: 50% 45%; }
        .mm-fan { position: relative; width: 156px; height: 104px; margin: 8px auto 4px; }
        .mm-fan img { position: absolute; object-fit: cover; border-radius: 9px; box-shadow: 0 6px 16px rgba(23,35,56,0.14); }
        .mm-fan .mm-fan-left, .mm-fan .mm-fan-right { top: 4px; width: 68px; height: 88px; }
        .mm-fan .mm-fan-left { left: 6px; transform: rotate(-7.75deg); }
        .mm-fan .mm-fan-right { right: 6px; transform: rotate(7.75deg); object-position: left center; }
        .mm-fan .mm-fan-front { top: 0; left: 0; right: 0; margin-inline: auto; width: 62px; height: 84px; z-index: 1; }
        .mm-split { display: flex; height: 208px; border-radius: 6px; overflow: hidden; border: 0.6px solid var(--mm-divider); box-shadow: 0 4.8px 9.7px rgba(176,175,175,0.25); }
        .mm-split img { display: block; width: 50%; height: 100%; object-fit: cover; }
        .mm-split-mirror { transform: scaleX(-1); }

        /* ── Mobile sheet ───────────────────────────────────── */
        .ms-row { width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border: none; background: transparent; cursor: pointer; text-align: left; text-decoration: none; font-family: ${FONT}; font-size: 18px; line-height: 28px; font-weight: 600; color: var(--mm-row); }
        .ms-chev { color: var(--mm-fg); transition: transform 0.25s ${NAV_EASE}; }
        .ms-row[aria-expanded="true"] .ms-chev { transform: rotate(180deg); }
        .ms-body { display: flex; flex-direction: column; gap: 23px; padding: 4px 0 16px; animation: navMenuIn 0.2s ${NAV_EASE} both; }
        .ms-body .mm-group { gap: 8px; }
        .ms-body .mm-heading { padding: 0; }
        .ms-body .mm-item, .ms-body .mm-link { border-radius: 0; padding: 8px 10px; border-bottom: 1px solid var(--mm-divider); }
        .ms-body .mm-item:hover, .ms-body .mm-link:hover { background: transparent; }
        .ms-body .mm-item-title { font-size: 14px; line-height: 20px; }
        .ms-body .mm-chev { display: none; }
        .ms-body .mm-desc { max-width: none; }
        .ms-body .mm-sublinks { margin-left: -8px; }
        .ms-body .mm-more { margin-top: 4px; padding-left: 10px; }
        @media (min-width: 640px) {
          .ms-body .mm-item-title, .ms-body .mm-desc, .ms-body .mm-link { font-size: 16px; line-height: 24px; }
        }
      `}</style>

      <nav
        className="site-nav"
        aria-label="Main"
        style={{
          ...themeVars,
          position: "fixed",
          top: barTop,
          left: 0,
          right: 0,
          marginInline: "auto",
          // Respect the page container (.container-page: max 1240px, 32px gutters).
          maxWidth: "100%",
          zIndex: 60,
          height: barHeight,
          paddingLeft: "max(32px, calc((100vw - 1240px) / 2 + 32px))",
          paddingRight: "max(32px, calc((100vw - 1240px) / 2 + 32px))",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          background: compact ? "rgba(10,10,11,0.42)" : "transparent",
          // No frosted band at the top of the page (Hamza, 6 Oct): the bar is
          // fully clear until the page scrolls. Local change to the kit's
          // file — fold it back into guidelines-for-landing-page.
          backdropFilter: compact ? "blur(32px) saturate(180%)" : "none",
          WebkitBackdropFilter: compact ? "blur(32px) saturate(180%)" : "none",
          borderRadius: 0,
          boxShadow: compact
            ? "0 12px 32px rgba(0,0,0,0.18), inset 0 -1px 0 rgba(255,255,255,0.08)"
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
        {/* Logo — wordmark; inverted to white on the dark bar, dark on a light surface */}
        <a href={NAV_HOME} style={{ display: "flex", alignItems: "center", flexShrink: 0 }} aria-label="ImagineArt home">
          <img
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
        </a>

        {/* Desktop nav: dropdown triggers open on hover or click, plain entries are links */}
        <div className="nav-desktop" style={{ alignItems: "center", gap: 2 }}>
          {NAV.map((entry) =>
            entry.panel ? (
              <button
                key={entry.label}
                type="button"
                className="nav-tab"
                aria-expanded={openPanel === entry.label}
                aria-controls="nav-dropdown"
                onPointerEnter={hoverOpen(entry.label)}
                onPointerLeave={hoverClose}
                onClick={(e) => {
                  window.clearTimeout(hoverTimer.current);
                  focusPanel.current = e.detail === 0;
                  // A click right after hover opened this menu shouldn't close it.
                  if (openedByHover.current && openPanel === entry.label) {
                    openedByHover.current = false;
                    return;
                  }
                  openedByHover.current = false;
                  setOpenPanel((cur) => (cur === entry.label ? null : entry.label));
                }}
              >
                {entry.label}
              </button>
            ) : (
              <a key={entry.label} href={entry.href} className="nav-tab" onPointerEnter={hoverClose} onClick={closeAll} {...linkTarget(entry.href!)}>
                {entry.label}
              </a>
            ),
          )}
        </div>

        <div className="nav-desktop" style={{ alignItems: "center", gap: 8, flexShrink: 0 }}>
          <a href={NAV_SIGN_IN} className="nav-signin">Sign in</a>
          <a href={NAV_CTA.href} className="nav-cta" style={{ height: 36, padding: "6px 14px", fontSize: 14 }}>
            {NAV_CTA.label}
          </a>
        </div>

        {/* Hamburger (mobile) */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="nav-burger"
          style={{
            width: 38, height: 38, borderRadius: 10, border: "none", background: "transparent",
            color: "var(--nav-burger)", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0,
          }}
          aria-label="Open menu"
          aria-expanded={menuOpen}
          aria-haspopup="dialog"
        >
          <span style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <span style={{ display: "block", width: 18, height: 1.5, borderRadius: 2, background: "currentColor" }} />
            <span style={{ display: "block", width: 18, height: 1.5, borderRadius: 2, background: "currentColor" }} />
          </span>
        </button>
      </nav>

      {/* Desktop dropdown: hangs 10px under the bar; the backdrop closes it on an outside click */}
      {panelEntry?.panel && (
        <>
          <div className="mm-backdrop" onClick={() => setOpenPanel(null)} aria-hidden />
          <div
            key={panelEntry.label}
            id="nav-dropdown"
            role="region"
            aria-label={panelEntry.label}
            className="mm-scope mm-panel"
            data-menu-theme={theme}
            // Tucked up under the bar (Hamza, 6 Oct: less space between the
            // item and its panel): the bar is 64 tall and its items end about
            // 10px above its foot, so −4 puts the panel 6px under the item.
            // Local change to the kit's file — fold it back.
            style={{ top: barTop + barHeight - 4 }}
            onPointerEnter={hoverKeep}
            onPointerLeave={hoverClose}
          >
            <Panel panel={panelEntry.panel} onNavigate={closeAll} />
          </div>
        </>
      )}

      {/* Mobile sheet: accordion of the same entries, cards left out */}
      {menuOpen && (
        <div
          className="mm-scope"
          data-menu-theme={theme}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          style={{
            position: "fixed", inset: 0, zIndex: 101, background: "var(--mm-surface)",
            display: "flex", flexDirection: "column", fontFamily: FONT,
            animation: "navMenuIn 0.22s cubic-bezier(0.4,0,0.2,1) forwards",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", flexShrink: 0 }}>
            <a href={NAV_HOME} onClick={closeAll} style={{ display: "inline-flex", alignItems: "center" }} aria-label="ImagineArt home">
              <img src={withBasePath("/media/imagine-art-wordmark.svg")} alt="ImagineArt" style={{ display: "block", height: 24, width: "auto", filter: "var(--mm-logo-filter)" }} />
            </a>
            <button
              onClick={() => setMenuOpen(false)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", width: 40, height: 40,
                borderRadius: 999, border: "1px solid var(--mm-border)", background: "var(--mm-cta-bg)", color: "var(--mm-cta-fg)", cursor: "pointer",
              }}
              aria-label="Close menu"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <div style={{ height: 1, background: "var(--mm-divider)", margin: "0 24px", flexShrink: 0 }} />

          <div style={{ flex: 1, overflowY: "auto", padding: "8px 24px", display: "flex", flexDirection: "column", gap: 2 }}>
            {NAV.map((entry) => {
              if (!entry.panel) {
                return (
                  <a key={entry.label} href={entry.href} className="ms-row" onClick={closeAll} {...linkTarget(entry.href!)}>
                    {entry.label}
                  </a>
                );
              }
              const expanded = openRow === entry.label;
              return (
                <Fragment key={entry.label}>
                  <button
                    type="button"
                    className="ms-row"
                    aria-expanded={expanded}
                    onClick={() => setOpenRow(expanded ? null : entry.label)}
                  >
                    {entry.label}
                    <ChevronDown className="ms-chev" />
                  </button>
                  {expanded && (
                    <div className="ms-body">
                      {entry.panel.columns.flatMap((col) => col.groups).map((g, i) => (
                        <Group key={i} group={g} onNavigate={closeAll} />
                      ))}
                    </div>
                  )}
                </Fragment>
              );
            })}
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18, padding: "16px 24px 28px", flexShrink: 0 }}>
            <a
              href={NAV_CTA.href}
              onClick={closeAll}
              style={{
                display: "inline-flex", alignItems: "center", height: 48, padding: "12px 16px", boxSizing: "border-box",
                borderRadius: 14, background: "var(--mm-cta-bg)", color: "var(--mm-cta-fg)", fontSize: 14, fontWeight: 500,
                letterSpacing: "0.02em", textDecoration: "none",
              }}
            >
              {NAV_CTA.label}
            </a>
            <a
              href={NAV_SIGN_IN}
              onClick={closeAll}
              style={{ display: "inline-flex", alignItems: "center", gap: 10, fontSize: 16, fontWeight: 500, color: "var(--mm-fg)", textDecoration: "none" }}
            >
              Sign in
              <ArrowUpRight />
            </a>
          </div>
        </div>
      )}
    </>
  );
}
