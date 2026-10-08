import { withBasePath } from "@/lib/assets";

/**
 * Model providers marquee (Hamza, 8 Oct): ported from the "Controllable
 * content at scale" page (#models). One line, then the providers' marks
 * and names scrolling right to left, edges feathered, paused on hover.
 *
 * Icons are in public/media/model-icons/. Single-colour ones (`mono`) are
 * drawn as a mask filled with the text colour so they follow the theme;
 * the rest keep their own colours.
 */
const PROVIDERS: [file: string, name: string, mono?: boolean][] = [
  ["openai", "OpenAI", true], ["google-color", "Google"], ["bytedance-color", "ByteDance"],
  ["kling-color", "Kling"], ["minimax-color", "MiniMax"], ["flux", "Black Forest Labs", true],
  ["runway", "Runway", true], ["grok", "xAI", true], ["alibaba-color", "Alibaba"],
  ["hailuo-color", "Hailuo"], ["pixverse-color", "PixVerse"], ["recraft", "Recraft", true],
  ["ideogram", "Ideogram", true], ["elevenlabs", "ElevenLabs", true], ["suno", "Suno", true],
  ["stability-color", "Stability"], ["lightricks", "Lightricks", true], ["midjourney", "Midjourney", true],
];
/** Seconds for one full loop. */
const LOOP = 60;

function Items({ hidden }: { hidden?: boolean }) {
  return (
    <>
      {PROVIDERS.map(([f, name, mono]) => {
        const src = withBasePath(`/media/model-icons/${f}.svg`);
        return (
          <span key={f} className="mq-item" aria-hidden={hidden || undefined}>
            {mono ? (
              <i className="mq-mono" style={{ WebkitMaskImage: `url(${src})`, maskImage: `url(${src})` }} />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={src} alt="" />
            )}
            {name}
          </span>
        );
      })}
    </>
  );
}

export function ModelMarquee() {
  return (
    <section id="providers" className="mq-sec" aria-label="Models">
      <div className="container-page">
        <p className="mq-line">Every leading model, in one workspace. Switch mid-job, keep the brief.</p>
      </div>
      <div className="mq">
        {/* Two copies back to back; the track slides by half its width. */}
        <div className="mq-t">
          <Items />
          <Items hidden />
        </div>
      </div>

      <style>{`
        .mq-sec { padding: 72px 0 24px; text-align: center; }
        .mq-line { color: var(--ink-3); font-size: 17px; line-height: 1.5; margin-bottom: 32px; }
        .mq {
          overflow: hidden;
          -webkit-mask-image: linear-gradient(90deg, transparent, #000 5%, #000 95%, transparent);
          mask-image: linear-gradient(90deg, transparent, #000 5%, #000 95%, transparent);
        }
        .mq-t { display: flex; gap: 64px; width: max-content; padding-right: 64px; animation: mqSlide ${LOOP}s linear infinite; }
        .mq:hover .mq-t { animation-play-state: paused; }
        @keyframes mqSlide { to { transform: translateX(-50%); } }
        .mq-item { display: inline-flex; align-items: center; gap: 13px; white-space: nowrap; font-size: 21px; font-weight: 500; color: var(--ink-2); }
        .mq-item img, .mq-mono { width: 34px; height: 34px; flex: none; display: block; }
        .mq-mono { background: currentColor; -webkit-mask-size: contain; mask-size: contain; -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat; -webkit-mask-position: center; mask-position: center; color: var(--ink-heading); }
        @media (prefers-reduced-motion: reduce) { .mq-t { animation: none; flex-wrap: wrap; width: auto; justify-content: center; } .mq-t > [aria-hidden] { display: none; } }
      `}</style>
    </section>
  );
}
