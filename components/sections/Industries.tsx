import { SectionGuides } from "@/components/primitives/SectionGuides";
import { BlurHeading } from "@/components/BlurHeading";
import { MediaCard, MediaCardStyles } from "@/components/MediaCard";

/**
 * Industries: ten industry cards in a grid, ported from the Enterprise page's
 * `IndustriesSection` (Hamza, 24 Sep) into the slot Creative Tools held.
 * Copy, card bodies, gallery links and footage are that section's, verbatim;
 * the clips came across into media/industries/ (8.1MB). The only changes are
 * the heading, which uses this page's BlurHeading, and the hairline, which
 * takes the page's --line.
 *
 * <CreativeTools> is pulled, not deleted.
 */
/* The cards are not links (Hamza, 7 Oct: they won't redirect). They used to
   deep-link into the template gallery (enterprise/template?category=…); the
   `category` on each entry is that slug, kept in case the links come back. */
const INDUSTRIES = [
  /* Card copy rewritten as plain sentences for an enterprise reader
     (Hamza, 7 Oct): what the team makes, then why it matters, with the
     shorthand (PDP, POS, DVC/TVC) spelled out. */
  { name: "Fashion & Apparel", video: "/media/industries/fashion.mp4", category: "fashion", body: "From design to launch: product-page imagery, editorials, lookbooks and fashion films, plus the social, banners and ads that sell them." },
  { name: "CPG", video: "/media/industries/cpg.mp4", category: "fmcg", body: "Full campaigns in-house: ads, in-store displays and TV spots. Design a mascot, animate products and ride trends while they last." },
  { name: "Fast Food", video: "/media/industries/fast-food.mp4", category: "fastfood", body: "Make every menu item look its best, then run it everywhere: campaigns, ads, in-store displays and TV spots, the same day a trend hits." },
  { name: "Food & Beverage", video: "/media/industries/food-beverage.mp4", category: "fmcg", body: "Appetising food and drink photography, carried straight into campaigns, ads, product animations, in-store displays and TV spots." },
  { name: "Furniture / Home Décor", video: "/media/industries/furniture.mp4", body: "Every piece in a styled room, no shoot needed. Renders that become editorials, social, ads, TV spots and in-store displays." },
  { name: "Electronics", video: "/media/industries/electronics.mp4", body: "Launch-ready product and lifestyle renders, carried through editorials, banners, social, ads, TV spots and in-store displays." },
  { name: "Beauty & Cosmetics", video: "/media/industries/beauty.mp4", category: "fmcg", body: "Keep pace with a fast category: campaigns, ads, product animations, in-store displays and TV spots, plus trend-led video in the moment." },
  { name: "Automotive", video: "/media/industries/automotive.mp4", category: "cinematic", body: "Launch films and ads that sell the model, and video training that keeps your sales teams current." },
  { name: "Telecom", video: "/media/industries/telecom.mp4", category: "advertising", body: "Keep offers fresh across social, banners, ads and stores, and turn compliance training into video staff actually watch." },
  { name: "E-commerce / Marketplaces", video: "/media/industries/ecommerce.mp4", category: "advertising", body: "Listing-ready images and on-page motion for every seller, promoted with ads and storefront banners." },
];

/* Cycled across the ten cards. Each palette carries its own --grain-fg, so a
   dark card inverts its own copy without the card having to know. */
const PALETTES = [
  "grain-mineral",
  "grain-charcoal",
  "grain-sand",
  "grain-teal",
  "grain-olive",
  "grain-steel",
];

export function Industries() {
  return (
    <section
      id="industries"
      className="relative border-t border-[color:var(--line)] py-24 md:py-32 lg:border-t-0"
    >
      <SectionGuides edge="top" />
      <div className="container-page">
        <div className="max-w-[640px]">
          <p className="eyebrow">Industries</p>
          <BlurHeading className="h2 mt-4" lead="Built for" muted="your industry" />
          <p className="lede mt-5">
            One platform, every sector. Use cases mapped to how your team
            already works, not how a tool wishes you did. Find yours below.
          </p>
        </div>
      </div>

      <div className="ind-track mt-12">
        {INDUSTRIES.map((i, n) => (
          <MediaCard
            key={i.name}
            /* Not a link (Hamza, 7 Oct): the cards don't redirect, so no
               href, which also drops the arrow button. */
            video={i.video}
            title={i.name}
            body={i.body}
            aspect="3 / 4"
            /* The palette is the fill under the footage, so nothing flashes
               before the first frame, and it carries --grain-fg for a card
               that has no video yet. */
            className={`grain ${PALETTES[n % PALETTES.length]}`}
            eager={n < 4}
          />
        ))}
      </div>

      <style>{`
        /* Grid, not a rail. Ten cards on one screen instead of two behind a
           pager, so nothing is hidden behind an interaction. Gutters match
           .container-page so the grid lines up with the heading above it.

           Four across at the widest, not five: at five each card fell to
           ~230px and the footage was the point. Ten cards over four columns
           leaves a short last row of two, which is the cost of the larger
           card. */
        .ind-track {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
          padding-left: max(32px, calc((100vw - 1240px) / 2 + 32px));
          padding-right: max(32px, calc((100vw - 1240px) / 2 + 32px));
        }
        @media (min-width: 760px)  { .ind-track { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
        @media (min-width: 1040px) { .ind-track { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
        @media (max-width: 768px) {
          .ind-track { padding-left: 20px; padding-right: 20px; }
        }
      `}</style>

      <MediaCardStyles />
    </section>
  );
}
