/**
 * Monochrome line icons, one stroke weight throughout. Used by the rail
 * groups in Capabilities and Use cases, and anywhere else a small glyph is
 * needed. Sized by the parent via CSS; the SVGs carry no width or height.
 */
const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export function IconImage() {
  return (
    <svg viewBox="0 0 24 24" {...stroke} aria-hidden>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
      <circle cx="9" cy="10" r="1.6" />
      <path d="M4 17.5l4.6-4.6 3.4 3.4 2.6-2.6L20 18" />
    </svg>
  );
}
export function IconVideo() {
  return (
    <svg viewBox="0 0 24 24" {...stroke} aria-hidden>
      <rect x="3.5" y="6" width="13" height="12" rx="2.5" />
      <path d="M16.5 10.5l4-2.5v8l-4-2.5" />
    </svg>
  );
}
export function IconAudio() {
  return (
    <svg viewBox="0 0 24 24" {...stroke} aria-hidden>
      <path d="M4 10v4M8 7v10M12 4v16M16 8v8M20 10v4" />
    </svg>
  );
}
export function IconConnector() {
  return (
    <svg viewBox="0 0 24 24" {...stroke} aria-hidden>
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
      <circle cx="12" cy="18" r="2.5" />
      <path d="M7.8 7.8l2.9 7.7M16.2 7.8l-2.9 7.7M8.5 6h7" />
    </svg>
  );
}
export function IconMcp() {
  return (
    <svg viewBox="0 0 24 24" {...stroke} aria-hidden>
      <path d="M12 3.5l7.5 4.3v8.4L12 20.5l-7.5-4.3V7.8L12 3.5z" />
      <path d="M12 12l7.5-4.2M12 12v8.5M12 12L4.5 7.8" />
    </svg>
  );
}
export function IconPlugin() {
  return (
    <svg viewBox="0 0 24 24" {...stroke} aria-hidden>
      <path d="M9 3.5v4M15 3.5v4" />
      <path d="M6 7.5h12v4a6 6 0 0 1-12 0v-4z" />
      <path d="M12 17.5v3" />
    </svg>
  );
}
export function IconClock() {
  return (
    <svg viewBox="0 0 24 24" {...stroke} aria-hidden>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}
export function IconAnalyser() {
  return (
    <svg viewBox="0 0 24 24" {...stroke} aria-hidden>
      <path d="M4 19.5h16" />
      <path d="M6.5 16v-4M11 16V7.5M15.5 16v-6M20 16V5" />
    </svg>
  );
}
export function IconApps() {
  return (
    <svg viewBox="0 0 24 24" {...stroke} aria-hidden>
      <rect x="4" y="4" width="6.5" height="6.5" rx="1.8" />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.8" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.8" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.8" />
    </svg>
  );
}

/* Use-case glyphs */
export function IconMegaphone() {
  return (
    <svg viewBox="0 0 24 24" {...stroke} aria-hidden>
      <path d="M4 10v4a1.5 1.5 0 0 0 1.5 1.5H8l8 4V4.5l-8 4H5.5A1.5 1.5 0 0 0 4 10z" />
      <path d="M19 10a3 3 0 0 1 0 4M8 15.5v3.5" />
    </svg>
  );
}
export function IconPlay() {
  return (
    <svg viewBox="0 0 24 24" {...stroke} aria-hidden>
      <rect x="3.5" y="5" width="17" height="14" rx="3" />
      <path d="M10 9.2v5.6l4.6-2.8L10 9.2z" />
    </svg>
  );
}
export function IconClapper() {
  return (
    <svg viewBox="0 0 24 24" {...stroke} aria-hidden>
      <rect x="3.5" y="9" width="17" height="11" rx="2.5" />
      <path d="M3.5 9l2.5-4.5h12L20.5 9M8 4.5L10 9M13 4.5L15 9" />
    </svg>
  );
}
export function IconHanger() {
  return (
    <svg viewBox="0 0 24 24" {...stroke} aria-hidden>
      <path d="M12 4.5a2 2 0 0 1 2 2c0 1.2-2 1.6-2 3.2" />
      <path d="M12 9.7l8.2 5.6a1.4 1.4 0 0 1-.8 2.6H4.6a1.4 1.4 0 0 1-.8-2.6L12 9.7z" />
    </svg>
  );
}
export function IconPerson() {
  return (
    <svg viewBox="0 0 24 24" {...stroke} aria-hidden>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M5 20c0-3.9 3.1-6.4 7-6.4s7 2.5 7 6.4" />
    </svg>
  );
}
export function IconBox() {
  return (
    <svg viewBox="0 0 24 24" {...stroke} aria-hidden>
      <path d="M12 3.5l8 4.5v8l-8 4.5-8-4.5V8l8-4.5z" />
      <path d="M4 8l8 4.5L20 8M12 12.5V20.5" />
    </svg>
  );
}
export function IconPalette() {
  return (
    <svg viewBox="0 0 24 24" {...stroke} aria-hidden>
      <path d="M12 3.5a8.5 8.5 0 1 0 0 17h1.2a2 2 0 0 0 1.4-3.4 1.4 1.4 0 0 1 1-2.4h2.1A2.8 2.8 0 0 0 20.5 12 8.5 8.5 0 0 0 12 3.5z" />
      <circle cx="8" cy="11" r="1.1" /><circle cx="11" cy="7.5" r="1.1" /><circle cx="15.5" cy="8.5" r="1.1" />
    </svg>
  );
}
export function IconCamera() {
  return (
    <svg viewBox="0 0 24 24" {...stroke} aria-hidden>
      <path d="M4 8.5h3l1.5-2.5h7L17 8.5h3v10H4v-10z" />
      <circle cx="12" cy="13.3" r="3" />
    </svg>
  );
}
export function IconCompass() {
  return (
    <svg viewBox="0 0 24 24" {...stroke} aria-hidden>
      <path d="M4 20.5l6-16h4l6 16M7 12.5h10" />
    </svg>
  );
}
