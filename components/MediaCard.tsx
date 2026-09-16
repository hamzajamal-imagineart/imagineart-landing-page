import { withBasePath } from "@/lib/assets";

/**
 * The shared media card: full-bleed footage, a title over it, an arrow, a
 * hover lift. Studios and Use cases both render it; callers choose only size
 * and fill.
 *
 * Fixed here on purpose: no scrim at rest so the footage is the card, a scrim
 * fading in on hover to carry the body copy, a text-shadow doing the title's
 * legibility locally, both shown outright on touch, and every transition
 * cancelled under reduced motion.
 *
 * Render MediaCardStyles once per section, not per card.
 */
export type MediaCardProps = {
  /** Omit for a card that is not a link: it renders a div and drops the arrow. */
  href?: string;
  video?: string;
  image?: string;
  /** Small uppercase line above the title. */
  label?: string;
  title: string;
  /** Revealed with the scrim on hover. */
  body?: string;
  /** CSS aspect-ratio, e.g. "3 / 4". Ignored when `height` is set. */
  aspect?: string;
  height?: string;
  /** Fill under the media, so nothing flashes before the first frame. */
  fill?: string;
  className?: string;
  /** Only the first few cards in a grid are worth eager-loading. */
  eager?: boolean;
};

export function MediaCard({
  href,
  video,
  image,
  label,
  title,
  body,
  aspect = "3 / 4",
  height,
  fill,
  className = "",
  eager = false,
}: MediaCardProps) {
  const Tag = href ? "a" : "div";
  const hasMedia = Boolean(video || image);

  return (
    <Tag
      {...(href ? { href, target: "_blank", rel: "noopener noreferrer" } : {})}
      aria-label={href ? title : undefined}
      className={`mc ${hasMedia ? "mc-has-media" : ""} ${className}`.trim()}
      style={{
        ...(height ? { height } : { aspectRatio: aspect }),
        ...(fill ? { backgroundColor: fill } : {}),
      }}
    >
      {video ? (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video
          className="mc-media"
          src={withBasePath(video)}
          autoPlay
          muted
          loop
          playsInline
          preload={eager ? "auto" : "metadata"}
          aria-hidden
        />
      ) : image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="mc-media" src={withBasePath(image)} alt="" aria-hidden />
      ) : null}

      {hasMedia && <span className="mc-scrim" aria-hidden />}

      {href && (
        <span className="mc-arrow glass" aria-hidden>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M6 12h12M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      )}

      <div className="mc-copy">
        {label && <span className="mc-label">{label}</span>}
        <h3 className="mc-title">{title}</h3>
        {body && <p className="mc-body">{body}</p>}
      </div>
    </Tag>
  );
}

/** The card's stylesheet. Render once per section. */
export function MediaCardStyles() {
  return (
    <style>{`
      .mc {
        position: relative;
        isolation: isolate;
        overflow: hidden;
        border-radius: 20px;
        padding: clamp(18px, 1.8vw, 26px);
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        text-decoration: none;
        transition: transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
      }
      a.mc:hover,
      a.mc:focus-visible { transform: scale(1.015); }

      .mc-has-media { color: #fff; }
      .mc-has-media::after { content: none; }

      .mc-media {
        position: absolute;
        inset: 0;
        z-index: -2;
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      .mc-scrim {
        position: absolute;
        inset: 0;
        z-index: -1;
        pointer-events: none;
        opacity: 0;
        transition: opacity 300ms ease;
        background: linear-gradient(
          to top,
          rgba(8, 11, 9, 0.88) 0%,
          rgba(8, 11, 9, 0.6) 46%,
          rgba(8, 11, 9, 0.3) 100%
        );
      }
      .mc:hover .mc-scrim,
      .mc:focus-visible .mc-scrim { opacity: 1; }

      .mc-arrow {
        position: absolute;
        top: 22px;
        right: 22px;
        z-index: 1;
        width: 34px; height: 34px;
        border-radius: 999px;
        display: grid; place-items: center;
        color: currentColor;
        flex: 0 0 auto;
      }

      .mc-copy { position: relative; z-index: 1; }
      .mc-label {
        display: block;
        font-size: 10px;
        font-weight: 600;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        opacity: 0.7;
        margin-bottom: 6px;
      }
      .mc-title {
        font-size: clamp(16px, 1.5vw, 19px);
        font-weight: 500;
        letter-spacing: -0.01em;
        line-height: 1.2;
        margin: 0;
      }
      .mc-has-media .mc-title {
        text-shadow: 0 1px 3px rgba(8, 11, 9, 0.65), 0 2px 18px rgba(8, 11, 9, 0.5);
      }

      .mc-body {
        margin: 10px 0 0;
        font-size: 13.5px;
        line-height: 1.55;
        opacity: 0.72;
      }
      .mc-has-media .mc-body {
        max-height: 0;
        margin-top: 0;
        opacity: 0;
        overflow: hidden;
        transition: max-height 320ms ease, opacity 260ms ease, margin-top 320ms ease;
      }
      .mc-has-media:hover .mc-body,
      .mc-has-media:focus-visible .mc-body {
        max-height: 170px;
        margin-top: 10px;
        opacity: 0.82;
      }

      @media (hover: none) {
        .mc-scrim { opacity: 1; }
        .mc-has-media .mc-body {
          max-height: 170px;
          margin-top: 10px;
          opacity: 0.82;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .mc, .mc-scrim, .mc-has-media .mc-body { transition: none; }
        a.mc:hover, a.mc:focus-visible { transform: none; }
      }
    `}</style>
  );
}
