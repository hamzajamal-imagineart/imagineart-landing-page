import { BlurHeading } from "@/components/BlurHeading";
import { SectionGuides } from "@/components/primitives/SectionGuides";

/**
 * Security, ported from the Enterprise page and re-toned for a dark page
 * (Hamza, 20 Sep), between Models and Reviews.
 *
 * **Compact since 6 Oct** (Hamza: "the cards take too much space"). It was a
 * bento of six 320px tiles plus a wide zero-retention tile with photographs
 * and a flow diagram; now seven small tiles, icon and title on one row and one
 * line under, four across with zero retention spanning two, so the whole set
 * is two short rows. The photographs and the diagram are gone (the two
 * images stay on disk in media/security/).
 */
const TILES = [
  {
    n: "01",
    tone: 1,
    title: "SSO and MFA",
    body: "Single sign-on across your identity provider, with multi-factor enforced on every account, so access follows the org chart you already have.",
    icon: <IconPeople />,
  },
  {
    n: "02",
    tone: 2,
    title: "SOC 2 Type II",
    body: "Independently audited controls you can verify, aligned to the highest security and audit standards.",
    icon: <IconCheckCircle />,
  },
  {
    n: "03",
    tone: 3,
    title: "Your IP stays yours",
    body: "Full commercial rights to everything you generate, with contract-backed legal coverage for the content your team produces.",
    icon: <IconScales />,
  },
  {
    n: "04",
    tone: 4,
    title: "Centralized admin control",
    body: "One dashboard for the whole organization: role-based access, and usage visibility across every team.",
    icon: <IconLayers />,
  },
  {
    n: "05",
    tone: 3,
    title: "Encrypted end to end",
    body: "Protected at rest and in transit, at every stage of the pipeline.",
    icon: <IconLock />,
  },
  {
    n: "06",
    tone: 1,
    title: "Full audit trail",
    body: "Every action logged and traceable, for complete accountability.",
    icon: <IconTrail />,
  },
  {
    n: "07",
    tone: 2,
    title: "Zero data retention",
    body: "Your prompts and outputs are never stored or used to train models. Processed, delivered, and not kept.",
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
          <p className="lede mt-5">
            Security isn&apos;t a feature you bolt on later, it&apos;s the
            foundation. Zero data retention, SOC 2 compliance, enforced MFA,
            and full audit trails mean your creative work and your IP stay
            locked down and entirely yours.
          </p>
        </div>

        <div className="sec-grid mt-12">
          {TILES.map((t) => (
            <div key={t.n} className={`sec-tile grain sec-tone-${t.tone} ${t.wide ? "sec-wide" : ""}`}>
              <div className="sec-head">
                <span className="sec-chip glass">{t.icon}</span>
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
        /* Four neutral steps off the page floor rather than the kit's
           palettes, which are built for a white page. The grain itself still
           comes from .grain, which reads --grain-1/2/3. */
        .sec-tone-1 { --grain-1: #1f1f23; --grain-2: #1a1a1e; --grain-3: #151519; }
        .sec-tone-2 { --grain-1: #2a2a2f; --grain-2: #242429; --grain-3: #1e1e22; }
        .sec-tone-3 { --grain-1: #18181b; --grain-2: #141417; --grain-3: #101013; }
        .sec-tone-4 { --grain-1: #33333a; --grain-2: #2c2c33; --grain-3: #26262c; }
        .sec-tile {
          position: relative;
          color: var(--ink-heading);
          border-radius: var(--radius-4);
          padding: 20px;
          overflow: hidden;
        }
        .sec-wide { grid-column: span 2; }
        .sec-head { display: flex; align-items: center; gap: 12px; }
        .sec-chip {
          width: 36px; height: 36px; border-radius: 10px;
          display: grid; place-items: center; flex: 0 0 auto;
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
          line-height: 1.55;
          opacity: 0.72;
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

