import { withBasePath } from "@/lib/assets";
import { BlurHeading } from "@/components/BlurHeading";
import { SectionGuides } from "@/components/primitives/SectionGuides";

/**
 * Security, ported from the Enterprise page's own section and re-toned for a
 * dark page (Hamza, 20 Sep). Sits between Models and Reviews (Hamza, 21 Sep):
 * what the platform runs on, then whether it is safe to put work into, then
 * who vouches for it.
 *
 * **The tiles do not use the `.grain-*` palettes** the kit ships, and the kit
 * copy in `globals.css` is left alone. Those palettes are built for a white
 * page — mineral and sand are near-white — and six of them here would be a
 * bright slab in the middle of a dark run. The grain machinery is the
 * same (`.grain` draws the noise from `--grain-1/2/3`); only the tones are
 * local, four neutral steps off the page floor, cycled so no two touching
 * tiles share one.
 *
 * Two tiles keep the Enterprise page's photographs, which are dark abstracts
 * — navy and deep green — and so survived the re-tone where a palette would
 * not. Dark is not the same as even, though: measured per pixel under the
 * real text boxes, the green one put its bright middle behind the diagram's
 * labels at 2.0:1, so both carry a wash (`.sec-photo`). With it the worst
 * case on either is 4.7:1.
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
    bg: "/media/security/soc2.jpg",
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

        <div className="sec-bento mt-14">
          {TILES.map((t) => (
            <div
              key={t.n}
              className={`sec-tile grain sec-tone-${t.tone} ${t.bg ? "sec-photo" : ""}`}
              style={t.bg ? { backgroundImage: `url(${withBasePath(t.bg)})` } : undefined}
            >
              <span className="sec-n">{t.n}</span>
              <h3 className="sec-title">{t.title}</h3>
              <p className="sec-body">{t.body}</p>
              <div className="sec-graphic glass">{t.icon}</div>
            </div>
          ))}

          <div
            className="sec-tile sec-wide grain sec-tone-2 sec-photo"
            style={{ backgroundImage: `url(${withBasePath("/media/security/zero-retention.jpg")})` }}
          >
            <span className="sec-n">07</span>
            <h3 className="sec-title">Zero data retention</h3>
            <p className="sec-body">
              Your prompts and outputs are never stored or used to train
              models. Processed, delivered, and not kept.
            </p>
            <div className="sec-flow">
              <div className="sec-node">
                <span className="sec-chip glass"><IconPerson /></span>
                <span className="sec-label">Your data</span>
              </div>
              <span className="sec-line" />
              <div className="sec-node">
                <span className="sec-chip sec-chip-lg glass glass-strong"><IconShield /></span>
                <span className="sec-label">Blocked in the boundary</span>
              </div>
              <span className="sec-x">×</span>
              <div className="sec-node">
                <span className="sec-chip glass"><IconSpark /></span>
                <span className="sec-label">AI model</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .sec-bento {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
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
          /* The photograph rides over the palette, which stays underneath as
             the fallback while it loads and wherever it does not cover. */
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          color: var(--ink-heading);
          min-height: 320px;
          display: flex;
          flex-direction: column;
          border-radius: var(--radius-6);
          padding: 32px;
          overflow: hidden;
        }
        .sec-wide { grid-column: span 2; min-height: 280px; }
        /* The two photographs are dark but not evenly so: measured per pixel
           under the real text boxes at 1440, the green one put its bright
           middle straight behind the diagram's labels at 2.0:1. This wash is
           what carries them — heaviest at the head where the copy sits, and
           still substantial across the middle where the flow nodes are. It
           sits at z-index 0, under .grain's content but over the picture. */
        .sec-photo::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 0;
          background:
            linear-gradient(rgba(8, 8, 9, 0.46), rgba(8, 8, 9, 0.46)),
            linear-gradient(to bottom, rgba(8, 8, 9, 0.52) 0%, rgba(8, 8, 9, 0.3) 52%, rgba(8, 8, 9, 0.42) 100%);
        }
        /* 0.62, not the kit's 0.55: at 11px on the lightest tone that was
           4.43:1, just under AA. Raising the one rule fixes it on every tile
           rather than pushing that tone darker than its neighbours. */
        .sec-n {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          opacity: 0.62;
        }
        .sec-title {
          margin-top: 12px;
          font-size: clamp(20px, 1.8vw, 26px);
          font-weight: 500;
          line-height: 1.2;
          letter-spacing: -0.015em;
        }
        .sec-body {
          margin-top: 10px;
          max-width: 34ch;
          font-size: 15px;
          line-height: 1.55;
          opacity: 0.72;
        }
        /* Pinned to the foot on the far side, so the copy never competes with
           it for width. */
        .sec-graphic {
          margin-top: auto;
          align-self: flex-end;
          display: grid;
          place-items: center;
          width: 44px;
          height: 44px;
          border-radius: 14px;
        }
        .sec-graphic svg { width: 20px; height: 20px; }

        .sec-flow {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
          margin-top: 20px;
        }
        .sec-node { display: flex; flex-direction: column; align-items: center; gap: 10px; max-width: 108px; }
        .sec-label { font-size: 12px; line-height: 1.35; text-align: center; opacity: 0.75; }
        .sec-chip {
          width: 44px; height: 44px; border-radius: 14px;
          display: grid; place-items: center; flex: 0 0 auto;
        }
        .sec-chip svg { width: 20px; height: 20px; }
        /* One step up: it is the focal node of the diagram. */
        .sec-chip-lg { width: 52px; height: 52px; border-radius: 16px; }
        .sec-chip-lg svg { width: 22px; height: 22px; color: #fff; }
        .sec-line { width: 28px; height: 1px; margin-top: 24px; background: currentColor; opacity: 0.3; }
        .sec-x { margin-top: 14px; font-size: 16px; opacity: 0.5; }

        /* The kit's brighter lens, for the focal node. globals.css carries
           .glass and .glass-on-light but not this one. */
        .glass-strong {
          --glass-tint: rgba(255, 255, 255, 0.18);
          --glass-spec: rgba(255, 255, 255, 0.95);
          --glass-ring: rgba(255, 255, 255, 0.32);
          --glass-bloom: rgba(255, 255, 255, 0.14);
        }

        @media (max-width: 640px) {
          .sec-bento { grid-template-columns: 1fr; }
          .sec-wide { grid-column: span 1; }
          .sec-tile { padding: 24px; min-height: 280px; }
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

function IconPerson() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M5 20c0-3.9 3.1-6.4 7-6.4s7 2.5 7 6.4v.5H5V20z" />
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

function IconSpark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.5l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.9L12 2.5z" />
    </svg>
  );
}
