import { BlurHeading } from "@/components/BlurHeading";
import { SectionGuides } from "@/components/primitives/SectionGuides";

/**
 * Security, ported from the Enterprise page and re-toned for a dark page
 * (Hamza, 20 Sep), between Models and Reviews.
 *
 * **Minimal since 6 Oct** (Hamza): no lede, and each tile is a title and a
 * few words. Flat tiles on the page tokens rather than dark grain tones, so
 * they read on the white page. Before that, compact (Hamza: "the cards take
 * too much space"). It was a
 * bento of six 320px tiles plus a wide zero-retention tile with photographs
 * and a flow diagram; now seven small tiles, icon and title on one row and one
 * line under, four across with zero retention spanning two, so the whole set
 * is two short rows. The photographs and the diagram are gone (the two
 * images stay on disk in media/security/).
 */
const TILES = [
  {
    n: "01",
    title: "SSO and MFA",
    body: "Access through your identity provider.",
    icon: <IconPeople />,
  },
  {
    n: "02",
    title: "SOC 2 Type II",
    body: "Independently audited controls.",
    icon: <IconCheckCircle />,
  },
  {
    n: "03",
    title: "Your IP stays yours",
    body: "Full commercial rights, contract-backed.",
    icon: <IconScales />,
  },
  {
    n: "04",
    title: "Admin controls",
    body: "Roles and usage, across every team.",
    icon: <IconLayers />,
  },
  {
    n: "05",
    title: "Encrypted end to end",
    body: "At rest and in transit.",
    icon: <IconLock />,
  },
  {
    n: "06",
    title: "Full audit trail",
    body: "Every action logged.",
    icon: <IconTrail />,
  },
  {
    n: "07",
    title: "Zero data retention",
    body: "Never stored, never used to train models.",
    icon: <IconShield />,
    wide: true,
  },
];

export function Security() {
  return (
    <section id="security" className="relative border-t border-[color:var(--line)] py-24 md:py-32 lg:border-t-0">
      <SectionGuides edge="top" />
      <div className="container-page">
        <div className="max-w-[640px]">
          <p className="eyebrow">Security</p>
          <BlurHeading
            className="h2 mt-4"
            lead="Safe, secure,"
            muted="and built for the enterprise"
          />
        </div>

        <div className="sec-grid mt-12">
          {TILES.map((t) => (
            <div key={t.n} className={`sec-tile ${t.wide ? "sec-wide" : ""}`}>
              <div className="sec-head">
                <span className="sec-chip">{t.icon}</span>
                <h3 className="sec-title">{t.title}</h3>
              </div>
              <p className="sec-body">{t.body}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        /* Four across, zero retention spanning two: seven tiles in two short
           rows. */
        .sec-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
        }
        /* Minimal (6 Oct): flat tiles on the page's own tokens, so they hold
           on white and on the dark theme alike. No grain, no fixed tones. */
        .sec-tile {
          position: relative;
          color: var(--ink-heading);
          background: var(--tile);
          border-radius: var(--radius-4);
          padding: 20px;
          overflow: hidden;
        }
        .sec-wide { grid-column: span 2; }
        .sec-head { display: flex; align-items: center; gap: 12px; }
        .sec-chip {
          width: 36px; height: 36px; border-radius: 10px;
          display: grid; place-items: center; flex: 0 0 auto;
          background: var(--panel);
          box-shadow: inset 0 0 0 1px var(--line);
          color: var(--ink-heading);
        }
        .sec-chip svg { width: 18px; height: 18px; }
        .sec-title {
          font-size: 17px;
          font-weight: 500;
          line-height: 1.25;
          letter-spacing: -0.01em;
        }
        .sec-body {
          margin-top: 12px;
          font-size: 14px;
          line-height: 1.5;
          color: var(--ink-2);
        }

        @media (max-width: 1000px) {
          .sec-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 560px) {
          .sec-grid { grid-template-columns: minmax(0, 1fr); }
          .sec-wide { grid-column: span 1; }
        }
      `}</style>
    </section>
  );
}

/* ── icons, monochrome at one stroke weight throughout ── */
function IconLock() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="4" y="10.5" width="16" height="9.5" rx="2.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconTrail() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 6.5h14M5 12h14M5 17.5h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="19" cy="17.5" r="2.2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function IconPeople() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <circle cx="9" cy="7.5" r="3.2" />
      <path d="M2.5 19c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6v.5h-13V19z" />
      <circle cx="17.3" cy="6.4" r="2.5" />
      <path d="M15.2 12.4c3 .1 5.3 2.1 5.3 5.1v.5h-3.2c0-2.2-.8-4.1-2.1-5.6z" />
    </svg>
  );
}

function IconCheckCircle() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7.5 12.2l3 3 6-6.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconScales() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3v18M7 21h10" />
      <path d="M5 8h14l-3.2 5.2H8.2L5 8z" />
      <path d="M5 8L2.6 13.2M19 8l2.4 5.2" />
    </svg>
  );
}

function IconLayers() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3l9 5-9 5-9-5 9-5z" />
      <path d="M3 13l9 5 9-5" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 2.5l7.5 3.2v5.6c0 4.8-3.2 8-7.5 9.7-4.3-1.7-7.5-4.9-7.5-9.7V5.7L12 2.5z" fill="rgba(255,255,255,0.16)" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M8.4 12l2.6 2.6 4.6-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

