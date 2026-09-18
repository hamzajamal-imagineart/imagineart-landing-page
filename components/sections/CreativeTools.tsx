import { withBasePath } from "@/lib/assets";
import { appsHref } from "@/lib/links";
import { BlurHeading } from "@/components/BlurHeading";
import { SectionGuides } from "@/components/primitives/SectionGuides";
import { ButtonLink } from "@/components/Button";
import {
  IconAudio, IconBox, IconCamera, IconClapper, IconHanger, IconImage, IconPalette, IconPerson,
  IconPlay, IconVideo,
} from "@/components/icons";
import { SectionGlow, sectionGlowCss } from "@/components/primitives/SectionGlow";

/**
 * The tools, as the bento from Figma (H-Drafts 483:442).
 *
 * Four columns of 308 with a 16px gutter, each column split differently: two
 * cards at 372/172, or three at 112/112/300. That uneven split is the whole
 * point of the layout, so the columns are real flex columns with fixed card
 * heights rather than a uniform grid, exactly as the Figma frames are built.
 *
 * Cards come in three kinds now. One carries a photograph full-bleed with a
 * scrim under the copy; one carries that tool's own clip under the same
 * scrim; the last is a flat tinted panel, and its tint is the only thing
 * separating it from its neighbours (#46211e, #171726 and #141417 are sampled
 * from the export; the second row's four are in the same family). Every card
 * with a clip keeps its tint underneath, since the clips have no posters and
 * the card would otherwise be black until the first frame arrives.
 *
 * **Two cards are still flat on purpose.** Dub Video and Remove Background
 * have no clip of their own anywhere in `public/media`, and giving them a
 * neighbour's footage would repeat the mismatch already flagged in the
 * handoff, where three card bodies describe the wrong tool.
 *
 * The second row is flat across all four columns, and deliberately so: it
 * reads as a quieter shelf under the picture row rather than a repeat of it,
 * and there are no more photographs in the Figma to give it.
 *
 * The cards are dark on the page's light wash, as the Apps section was,
 * rather than sitting on a dark band of their own as in Figma. A dark band
 * this early would fight the hero backdrop directly above it. If the band is
 * wanted, it is one background on .bt-grid.
 */
type Card = {
  title: string;
  body: string;
  icon: React.ReactNode;
  /** Photograph, full-bleed. */
  image?: string;
  /** That tool's own clip, full-bleed, for cards with no photograph. */
  video?: string;
  /** Flat tint, for the cards with neither. */
  tint?: string;
  size: "tall" | "short" | "mini" | "fill";
  badge?: string;
};

const COLUMNS: Card[][] = [
  [
    { title: "Lipsync", body: "Create high-end visuals from prompts or images.", icon: <IconPerson />, image: "/media/tools/lipsync.jpg", size: "tall" },
    { title: "AI Voiceover", body: "Studio-quality voiceovers in every major language.", icon: <IconAudio />, image: "/media/tools/ai-voiceover.jpg", size: "short" },
    { title: "Inpaint", body: "Change one part of an image and keep the rest exactly as it was.", icon: <IconImage />, video: "/media/capabilities/inpaint.mp4", tint: "#1b2430", size: "short" },
  ],
  [
    { title: "Relight Video", body: "Make cinematic videos that feel professionally directed.", icon: <IconVideo />, image: "/media/tools/relight-video.jpg", size: "tall", badge: "New" },
    { title: "Outpaint", body: "Connect AI tools into a single, reusable creative pipeline.", icon: <IconPalette />, video: "/media/capabilities/video-reframe.mp4", tint: "#141417", size: "short" },
    { title: "Image Upscaler", body: "Sharper and larger, ready for print at full resolution.", icon: <IconBox />, video: "/media/capabilities/upscale.mp4", tint: "#241b2b", size: "short" },
  ],
  [
    { title: "Motion Sync", body: "70+ ready-made AI effects. Transform any visual in seconds.", icon: <IconPlay />, image: "/media/tools/motion-sync.jpg", size: "tall" },
    { title: "VFX", body: "Create a track for any video, in any style.", icon: <IconClapper />, image: "/media/tools/vfx.jpg", size: "short" },
    { title: "Video Extend", body: "Add seconds to the end of a shot without cutting away.", icon: <IconVideo />, video: "/media/capabilities/video-extend.mp4", tint: "#1f2a22", size: "short" },
  ],
  [
    { title: "Dub Video", body: "Change spoken language with lipsync.", icon: <IconAudio />, tint: "#46211e", size: "mini" },
    { title: "Remove Background", body: "Generate without leaving your timeline.", icon: <IconImage />, tint: "#171726", size: "mini" },
    { title: "Create Characters", body: "Create high-end AI video production with precise control.", icon: <IconCamera />, image: "/media/tools/create-characters.jpg", size: "fill" },
    { title: "Outfit Try-on", body: "Dress a model in your garment from a single product photo.", icon: <IconHanger />, video: "/media/capabilities/outfit-tryon.mp4", tint: "#2b201a", size: "short" },
  ],
];

export function CreativeTools() {
  return (
    <section id="tools" className="relative border-t border-[color:var(--line)] py-24 md:py-32 lg:border-t-0">
      <SectionGlow />
      <SectionGuides edge="top" />
      <div className="container-page">
        {/* Wider than the page's usual 680px heading block: .h2 is nowrap
            above 880px and this is a multi-word heading. */}
        <div className="mx-auto max-w-[820px] text-center">
          <BlurHeading className="h2" lead="Creative tools" muted="for every medium" />
          <p className="lede mx-auto mt-5">
            Image, video, music and audio in one place, on the latest models from every
            major lab, with the editing tools that take a first result to a finished one.
          </p>
        </div>

        <div className="bt-grid mt-14">
          {COLUMNS.map((col, c) => (
            <div key={c} className="bt-col">
              {col.map((card) => (
                <a
                  key={card.title}
                  className={`bt-card bt-${card.size} ${card.image || card.video ? "bt-has-image" : ""}`}
                  href={appsHref()}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={card.tint ? { background: card.tint } : undefined}
                >
                  {(card.image || card.video) && (
                    <>
                      {card.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img className="bt-img" src={withBasePath(card.image)} alt="" aria-hidden />
                      ) : card.video ? (
                        /* The tint stays underneath as the poster: these clips
                           have none, so a card would be a black rectangle
                           until its first frame arrives. eslint-disable-next-line jsx-a11y/media-has-caption */
                        <video
                          className="bt-img"
                          src={withBasePath(card.video)}
                          autoPlay
                          muted
                          loop
                          playsInline
                          preload="none"
                          aria-hidden
                          disablePictureInPicture
                        />
                      ) : null}
                      <span className="bt-scrim" aria-hidden />
                    </>
                  )}
                  {card.badge && <span className="bt-badge">{card.badge}</span>}
                  <span className="bt-meta">
                    <span className="bt-icon" aria-hidden>{card.icon}</span>
                    <span className="bt-title">{card.title}</span>
                    <span className="bt-reveal">
                      <span className="bt-body">{card.body}</span>
                    </span>
                  </span>
                </a>
              ))}
            </div>
          ))}
        </div>

        <div className="bt-foot">
          <ButtonLink href={appsHref()} target="_blank" rel="noopener noreferrer" variant="ghost" size="md">
            View all tools
          </ButtonLink>
        </div>
      </div>

      <style>{`
        /* Hosts a <SectionGlow> at z-index -1. */
        #tools { isolation: isolate; }
        ${sectionGlowCss}

        .bt-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
          align-items: start;
        }
        .bt-col { display: flex; flex-direction: column; gap: 16px; min-width: 0; }

        /* The Figma's heights (372/172 against 112/112/300) taken up about a
           tenth. The uneven column split is the layout, and the four columns
           have to end level: three run tall + short + short and the fourth
           runs mini + mini + fill + short, so every column totals 822 with
           its gaps. Change one height and the rest have to absorb it. */
        .bt-tall  { height: 410px; }
        .bt-short { height: 190px; }
        /* Taller than the Figma's 112, and the fill card shorter than its
           300, so the fourth column still lands level with the other three.
           At 112 a mini card could not hold its icon, title and description
           at once and the description was cut off. */
        .bt-mini  { height: 144px; }
        .bt-fill  { height: 296px; }

        .bt-card {
          position: relative;
          display: block;
          overflow: hidden;
          border-radius: var(--radius-4);
          background-color: #141417;
          color: #fff;
          text-decoration: none;
          transition: transform 340ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 340ms ease;
        }
        .bt-card:hover, .bt-card:focus-visible {
          transform: translateY(-3px);
          box-shadow: 0 14px 34px rgba(16, 20, 30, 0.18);
        }

        .bt-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        /* Only the picture cards need a scrim; the flat ones are already dark
           enough for white type. */
        .bt-scrim {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(10, 10, 11, 0.88) 0%, rgba(10, 10, 11, 0.45) 30%, transparent 62%);
          transition: background 320ms ease;
        }
        .bt-card:hover .bt-scrim, .bt-card:focus-visible .bt-scrim {
          background: linear-gradient(to top, rgba(10, 10, 11, 0.92) 0%, rgba(10, 10, 11, 0.66) 44%, rgba(10, 10, 11, 0.2) 100%);
        }

        .bt-meta {
          position: absolute;
          left: 0; right: 0; bottom: 0;
          display: block;
          padding: 20px;
        }
        .bt-icon {
          width: 32px; height: 32px;
          border-radius: 10px;
          display: grid; place-items: center;
          background: rgba(255, 255, 255, 0.12);
          color: #fff;
          margin-bottom: 10px;
        }
        .bt-icon svg { width: 17px; height: 17px; }
        .bt-mini .bt-meta { padding: 16px; }
        .bt-mini .bt-icon { width: 28px; height: 28px; border-radius: 9px; margin-bottom: 8px; }
        .bt-mini .bt-icon svg { width: 15px; height: 15px; }

        .bt-title {
          display: block;
          font-size: 16px;
          font-weight: 500;
          letter-spacing: -0.01em;
          color: #fff;
        }
        /* The description is the hover: at rest a card is its picture, its
           icon and its name. max-height rather than a 0fr-to-1fr grid row,
           which cannot both close and open in an auto-height box. */
        .bt-reveal {
          display: block;
          max-height: 0;
          overflow: hidden;
          opacity: 0;
          transition: max-height 320ms cubic-bezier(0.22, 1, 0.36, 1), opacity 220ms ease;
        }
        .bt-card:hover .bt-reveal, .bt-card:focus-visible .bt-reveal {
          max-height: 80px;
          opacity: 1;
        }
        .bt-body {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          padding-top: 5px;
          font-size: 13.5px;
          line-height: 1.45;
          color: rgba(255, 255, 255, 0.72);
        }

        .bt-badge {
          position: absolute;
          top: 10px; right: 10px;
          padding: 3px 9px;
          border-radius: 999px;
          background: #aa7eeb;
          color: #17111f;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }

        .bt-foot { display: flex; justify-content: center; margin-top: 40px; }

        /* Two columns keeps each column's internal split intact; one column
           lets every card find its own height. */
        @media (max-width: 1100px) {
          .bt-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        /* No hover to reveal with, so the description simply stays open and
           the cards take whatever height that needs. */
        @media (hover: none) {
          .bt-reveal { max-height: 80px; opacity: 1; }
          .bt-mini { height: auto; min-height: 144px; }
          .bt-mini .bt-meta { position: static; }
        }
        @media (max-width: 680px) {
          .bt-grid { grid-template-columns: minmax(0, 1fr); }
          .bt-tall { height: 330px; }
          .bt-fill { height: 286px; }
          .bt-short { height: 190px; }
          .bt-mini { height: auto; min-height: 144px; }
          .bt-mini .bt-meta { position: static; }
        }
        @media (prefers-reduced-motion: reduce) {
          .bt-card, .bt-reveal, .bt-scrim { transition: none; }
          .bt-card:hover, .bt-card:focus-visible { transform: none; }
        }
      `}</style>
    </section>
  );
}
