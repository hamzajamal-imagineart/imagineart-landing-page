/* eslint-disable @next/next/no-img-element */
import { withBasePath } from "@/lib/assets";
import { AUTH_HREF } from "@/lib/links";
import { BlurHeading } from "@/components/BlurHeading";
import { SectionGlow, sectionGlowCss } from "@/components/primitives/SectionGlow";

/**
 * Models: eight cards, four by two.
 *
 * One model per card, a sample of its output full-bleed behind it, fading
 * into a dark foot that carries one caption: the provider's mark and the
 * model name. Nothing else. The eight are the headline model from each of
 * the eight providers with footage on hand; the lede says they are a sample.
 *
 * Backdrops are the provider samples ported from the B2B repo's Workflows
 * page (public/media/models/providers/, one per provider). `.mp4` renders as
 * a muted loop, anything else as a still. Marks are the icon pack the main
 * site ships (public/media/models/*.png); real third-party marks keep their
 * colour, the one sanctioned exception to the monochrome rule.
 *
 * Model names follow the B2B repo, which took them from the product's model
 * pickers; see HANDOFF.md §5 for the ones flagged as unverified.
 */
type Model = { name: string; icon: string; media: string; tone: string; href: string };

/* Model pages on imagine.art (Hamza, 14 Oct). Four cards have one; names
   follow those pages' headings. Seedance and Grok open the same generator
   links as the hero's "Works with" logos; Hailuo and ImagineArt, which have
   neither, open the app's sign-up like Try it free. Nano Banana's link in the doc (gemini/nanobanana-2-5) 404s; the live
   page is gemini/nano-banana-2-1. */
const MODEL_PAGE = "https://www.imagine.art/models";

const DIR = "/media/models";

const MODELS: Model[] = [
  { name: "Nano Banana 2.1", icon: "nanobanana", media: `${DIR}/providers/google.jpg`, tone: "#3a2a1c", href: `${MODEL_PAGE}/gemini/nano-banana-2-1` },
  { name: "Seedance 2.5", icon: "dreamina", media: `${DIR}/providers/bytedance.mp4`, tone: "#151c26", href: "https://www.imagine.art/video/create/seedance-25" },
  { name: "Kling 4.0", icon: "kling", media: `${DIR}/providers/kling.mp4`, tone: "#14304a", href: `${MODEL_PAGE}/kling/kling-4` },
  { name: "FLUX 3", icon: "flux", media: `${DIR}/providers/black-forest-labs.mp4`, tone: "#1f2226", href: `${MODEL_PAGE}/bfl/flux-3-image` },
  { name: "GPT Image 2.5", icon: "chatgpt", media: `${DIR}/providers/openai.jpg`, tone: "#26363a", href: `${MODEL_PAGE}/openai/gpt-image-2-5` },
  { name: "Grok 1.5", icon: "grok", media: `${DIR}/providers/xai.mp4`, tone: "#1a1a1e", href: "https://www.imagine.art/video?modelListId=46&editorMode=default" },
  { name: "Hailuo H3", icon: "hailuo", media: `${DIR}/providers/minimax.mp4`, tone: "#2a2530", href: AUTH_HREF },
  { name: "ImagineArt 2.0", icon: "imagineart", media: `${DIR}/providers/imagineart.jpg`, tone: "#2a2224", href: AUTH_HREF },
];

function CardMedia({ src }: { src: string }) {
  if (src.endsWith(".mp4")) {
    return (
      // eslint-disable-next-line jsx-a11y/media-has-caption
      <video className="mdl-bg" src={withBasePath(src)} autoPlay muted loop playsInline preload="metadata" aria-hidden />
    );
  }
  return <img className="mdl-bg" src={withBasePath(src)} alt="" loading="lazy" />;
}

export function Models() {
  return (
    <section id="models" className="relative py-24 md:py-32" /* no rule: the glow dissolves across the seam (8 Oct) */>
      <SectionGlow />
      <div className="container-page">
        <div className="mx-auto max-w-[680px] text-center">
          <BlurHeading className="h2" lead="Every leading AI model" />
          <p className="lede mx-auto mt-5">
            Eight of the 50+ models you can switch between mid-workflow, without
            moving your work elsewhere.
          </p>
        </div>

        <div className="mdl-grid mt-12">
          {MODELS.map((m) => (
            <a key={m.name} href={m.href} className="mdl-card" style={{ backgroundColor: m.tone, ["--mdl-tone" as string]: m.tone }}>
              <CardMedia src={m.media} />
              <span className="mdl-fade" aria-hidden />
              <h3 className="mdl-cap">
      <img className="mdl-mark" src={withBasePath(`${DIR}/${m.icon}.png`)} alt="" aria-hidden width={26} height={26} />
                <span>{m.name}</span>
              </h3>
              {/* Glass arrow top right, as on the other linked cards (14 Oct). */}
              <span className="mdl-arrow glass" aria-hidden>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M6 12h12M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </a>
          ))}
        </div>
      </div>

      <style>{`
        /* Hosts a <SectionGlow> at z-index -1. */
        #models { isolation: isolate; }
        ${sectionGlowCss}


        .mdl-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
        }
        .mdl-arrow { position: absolute; top: 14px; right: 14px; z-index: 2; width: var(--btn-icon-sm); height: var(--btn-icon-sm); border-radius: var(--btn-radius); display: grid; place-items: center; color: var(--on-media); transition: transform 0.25s ease, background var(--dur-fast) ease; }
        .mdl-card:hover .mdl-arrow { transform: translateX(2px); }
        .mdl-card {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          aspect-ratio: 7 / 8;
          border-radius: var(--radius-4);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          color: #fff;
        }
        .mdl-bg {
          position: absolute;
          inset: 0;
          z-index: -2;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        /* The backdrop dissolves into the card's own tone along the bottom
           third, so the caption sits on a solid rather than on a scrim. It
           starts higher and lands on the tone sooner than it did (Hamza,
           21 Sep): several of the samples are bright right where the name
           sits, and the name is now large enough to need the whole width of
           that foot to stay clean. */
        .mdl-fade {
          position: absolute;
          inset: 0;
          z-index: -1;
          pointer-events: none;
          background: linear-gradient(
            to bottom,
            transparent 0%,
            transparent 40%,
            color-mix(in srgb, var(--mdl-tone) 45%, transparent) 58%,
            color-mix(in srgb, var(--mdl-tone) 82%, transparent) 72%,
            var(--mdl-tone) 84%
          );
        }
        .mdl-cap {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 11px;
          padding: 0 18px 28px;
          font-size: clamp(var(--fs-md), 1.45vw, var(--fs-xl));
          font-weight: 500;
          letter-spacing: -0.01em;
          line-height: 1.2;
          text-align: center;
        }
        .mdl-mark {
          width: 26px; height: 26px;
          border-radius: calc(7px * var(--corner));
          display: block;
          flex: 0 0 auto;
        }

        @media (max-width: 1000px) { .mdl-grid { gap: 12px; } }
        @media (max-width: 760px) {
          .mdl-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
          .mdl-card { border-radius: var(--radius-4); }
          .mdl-cap { padding-bottom: 18px; }
        }
      `}</style>
    </section>
  );
}
