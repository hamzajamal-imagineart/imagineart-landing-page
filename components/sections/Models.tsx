/* eslint-disable @next/next/no-img-element */
import { withBasePath } from "@/lib/assets";
import { BlurHeading } from "@/components/BlurHeading";
import { Backdrop, backdropCss } from "@/components/Backdrop";

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
type Model = { name: string; icon: string; media: string; tone: string };

const DIR = "/media/models";

const MODELS: Model[] = [
  { name: "Nano Banana Pro", icon: "nanobanana", media: `${DIR}/providers/google.jpg`, tone: "#3a2a1c" },
  { name: "Seedance 2.5", icon: "dreamina", media: `${DIR}/providers/bytedance.mp4`, tone: "#151c26" },
  { name: "Kling 3.0", icon: "kling", media: `${DIR}/providers/kling.mp4`, tone: "#14304a" },
  { name: "Flux 2 Max", icon: "flux", media: `${DIR}/providers/black-forest-labs.mp4`, tone: "#1f2226" },
  { name: "GPT Image 2", icon: "chatgpt", media: `${DIR}/providers/openai.jpg`, tone: "#26363a" },
  { name: "Grok 1.5", icon: "grok", media: `${DIR}/providers/xai.mp4`, tone: "#1a1a1e" },
  { name: "Hailuo H3", icon: "hailuo", media: `${DIR}/providers/minimax.mp4`, tone: "#2a2530" },
  { name: "ImagineArt 2.0", icon: "imagineart", media: `${DIR}/providers/imagineart.jpg`, tone: "#2a2224" },
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
    <section id="models" className="relative border-t border-[color:var(--line)] py-24 md:py-32">
      <Backdrop position="20% 60%" opacity={0.45} />
      <div className="container-page">
        <div className="mx-auto max-w-[680px] text-center">
          <BlurHeading className="h2" lead="Models" />
          <p className="lede mx-auto mt-5">
            Eight of the 50+ models you can switch between mid-workflow, without
            moving your work elsewhere.
          </p>
        </div>

        <div className="mdl-grid mt-12">
          {MODELS.map((m) => (
            <article key={m.name} className="mdl-card" style={{ backgroundColor: m.tone, ["--mdl-tone" as string]: m.tone }}>
              <CardMedia src={m.media} />
              <span className="mdl-fade" aria-hidden />
              <h3 className="mdl-cap">
                <img className="mdl-mark" src={withBasePath(`${DIR}/${m.icon}.png`)} alt="" aria-hidden width={20} height={20} />
                <span>{m.name}</span>
              </h3>
            </article>
          ))}
        </div>
      </div>

      <style>{`
        /* Hosts a <Backdrop>: isolate so the layer can sit at z-index -1
           without falling behind the page, clip so its overhang does not
           bleed into the neighbouring sections. */
        #models { isolation: isolate; overflow: clip; }
        ${backdropCss}

        .mdl-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
        }
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
           third, so the caption sits on a solid rather than on a scrim. */
        .mdl-fade {
          position: absolute;
          inset: 0;
          z-index: -1;
          pointer-events: none;
          background: linear-gradient(
            to bottom,
            transparent 0%,
            transparent 52%,
            color-mix(in srgb, var(--mdl-tone) 55%, transparent) 72%,
            color-mix(in srgb, var(--mdl-tone) 92%, transparent) 88%,
            var(--mdl-tone) 100%
          );
        }
        .mdl-cap {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          padding: 0 18px 26px;
          font-size: clamp(14px, 1.2vw, 16.5px);
          font-weight: 500;
          letter-spacing: -0.01em;
          line-height: 1.2;
          text-align: center;
        }
        .mdl-mark {
          width: 20px; height: 20px;
          border-radius: 5px;
          display: block;
          flex: 0 0 auto;
        }

        @media (max-width: 1000px) { .mdl-grid { gap: 12px; } }
        @media (max-width: 760px) {
          .mdl-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
          .mdl-card { border-radius: 16px; }
          .mdl-cap { padding-bottom: 18px; }
        }
      `}</style>
    </section>
  );
}
