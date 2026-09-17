# ImagineArt Landing Page Handoff

One product overview page for **ImagineArt** (www.imagine.art), built as its own
project on the ImagineArt Enterprise design system. Seeded from the Guidelines
kit in `imagine-business-landing-pages/Guidelines/` and that repo's live
components, not forked from it.

- **Repo:** https://github.com/hamzajamal-imagineart/imagineart-landing-page (`main`)
- **Local:** `Claude Projects/imagineart-landing/`, sibling of the B2B repo
- **Stack:** Next.js 16.2.4 (App Router, Turbopack) · React 19 · TypeScript · Tailwind v4 · static export
- **Run:** `npm run dev` → http://localhost:3100 · **Build:** `npm run build` (export to `out/`, passes clean)
- **Working style (Hamza, 16 Sep 2026):** no browser previews or screenshots. Verify with `npx next build` and grep, keep replies short.

## 1. Decisions

1. **One overview page**, not a hub plus category pages.
2. **Product framing.** Every primary action is "Get Started" → imagine.art. No contact form.
3. **Separate project** from the Guidelines kit, deployed on its own path (undecided, see §7).
4. **References used:** ElevenLabs enterprise hero (hero), Higgsfield's ChatGPT-skills page (rail-and-cards), the ImagineArt product site itself (studio banners, Fashion and Ad copy), the Enterprise page (partners strip, suite rail, integrations cluster, capabilities bento).

## 2. Page anatomy, in order

| Section | Component | What it is |
|---|---|---|
| Hero | `sections/Hero` | Headline "Bringing / imagination to life" ("Bringing" at weight 400) left, one-line copy right, Get Started + See Plans pills. Framed panel (`#dce4ee`) with a Creative · Workflows · Computer tab bar (text only) and one 16:9 clip per tab with a hairline. |
| Partners | `sections/Partners` | Six partner marks (ByteDance, Kling AI, MINIMAX, Wan, fal, Grok) with two captions. The only section that keeps the kit's `SectionGuides` rules and dots. |
| Creative Tools `#tools` | `sections/CreativeTools` | Z-fold: Image, Video, Music and Audio, alternating clip and copy, three points and an Open link each. The page's only Z-fold. |
| Workflows `#workflows` | `sections/Workflows` | Bento, spans [2,1] / [1,1,1]: Node canvas (wide, clip), Scheduling (clip), Creative Analyser (clip), Connectors and Plugins as `MarkCluster`s (round brand marks with the Enterprise Integrations proximity hover). Tiles on `--panel-2`, 460px rows, one-line bodies. |
| Apps `#apps` | `sections/Apps` | Horizontal card rail with chevrons, the Enterprise suite-rail pattern: dark cards, arrow top right, clip filling the card below the copy. Eight apps. |
| MCP `#mcp` | `sections/Mcp` | Connect panel ported from `Vyro-ai/imagine-web-mcp-landing`: heading is the Imagine MCP wordmark; client tabs (Claude, ChatGPT, Cursor, Hermes, OpenClaw, Grok) and a small MCP / CLI segment, both on `#cfd9e5`; three numbered steps with icon-only copy buttons and deep links; the client's real connect recording streamed from the Imagine CDN on a light ground. CLI route shows a static terminal transcript. Panel is `#dce4ee`, no inner backgrounds. |
| Studios `#studios` | `sections/AdStudio` | Heading "Studios" + one line, then the **Ad Studio banner**: dark band of five vertical marquee columns of 9:16 ad clips (30 clips, CDN, posters, `preload="none"`) and a frosted left panel with "ImagineArt presents", the white Ad Studio wordmark, "Ship your next ad in 1 minute." and a glass "Try Ad Studio" button. |
| Fashion Studio `#fashion-studio` | `sections/FashionStudio` | Banner: campaign clip full-bleed, rising dark scrim, white wordmark, headline "AI Fashion for Catalog and Editorial Shoots" (24 to 38px), glass "Try Now", 15-word paragraph right behind a hairline. |
| Film Studio `#film-studio` | `sections/FilmStudio` | Banner: CSS marquee of 24 film thumbnails behind blurred edges and a frosted centre disc, "ImagineArt presents", the Film Studio logo, "See studio in action" pill. Whole band links to the studio. |
| Use Cases and Templates `#use-cases` | `sections/UseCases` | `RailGrid`: nine use-case groups in a rail (`#dce4ee`, tiles `#f3f5f8`), 3 to 4 template/example cards each, every card a link into the template gallery. "Browse all templates" ghost button in the header. |
| Models `#models` | `sections/Models` | Eight model cards, four by two: provider sample full-bleed, fading into a per-card tone, one caption of provider mark + model name. |
| Reviews `#reviews` | `ReviewsSection` | Sticky summary (left-aligned) + auto-scrolling column of real Trustpilot five-star reviews. |
| FAQ `#faq` | `FAQSection` | Sticky heading rail (left-aligned) + accordion, rows open by default, FAQPage JSON-LD from the same array. |
| Closing CTA | `sections/ClosingCta` | Un-boxed band, hills photograph, Get Started + See Plans. |

The three studio banners share one height, `--studio-band-h` in `globals.css`
(360 to 420px), and follow each other with no rules between them.

Nav is **Tools · Workflows · Studios · Use Cases · FAQ · Pricing**, CTA Get Started.

## 3. Design system

Page palette is **slate** via `components/PageTint.tsx`: one hue used as wash,
heading ink, tile, panel, and two nested-container shades (`--shade-1`,
`--shade-2`). In practice the framed panels settled on hard-coded `#dce4ee`
(panel) and `#cfd9e5` (segmented controls inside it), with `#f3f5f8` for light
tiles inside those.

Rules carried over from the kit: weight ≤ 600, headings 500, monochrome with
colour from imagery and real brand marks only, one typeface (Google Sans Flex,
local woff2), no em-dashes in copy, hover in CSS only, `.container-page`
1240/32, section rhythm `py-24 md:py-32` with a plain hairline at every seam.

Deviations, all by request: section headings are single words with no eyebrow
and no two-tone clause, pinned to one line above 880px; every section lede is
one short line, centred (Reviews and FAQ stay left because they sit beside
content); the kit's `SectionGuides` are off everywhere except Partners; the
three studio banners and the Apps cards are dark surfaces beyond the kit's two.

Shared components in use: `RailGrid`, `MarkCluster`, `SiteNav`, `SiteFooter`,
`Button`, `PageTint`, `icons.tsx`, `primitives/SectionGuides`. Unused, kept on
disk: `MediaCard`, `CollaborationDemo`, `primitives/SectionPattern`.

Inherited rules that still apply: `overflow-x: auto` rails need `padding-block`
headroom; no scroll-snap on rails; `background-color` not the shorthand on
media tiles; every hand-written asset path through `withBasePath()`; assets one
directory deep under `public/media/`.

## 4. Links (`lib/links.ts`)

Confirmed: Creative `/image`, Workflows `/workflow`, Computer `/imagine-computer`,
Film Studio `/ai-film-studio`, Pricing `/subscription`, template gallery
`/enterprise/template` with category slugs `advertising · cinematic · fashion · branding`,
apps `image-upscaler` and `heygen-avatar`.

**Inferred, verify before shipping:** Ad Studio → `/ai-image-generator`,
Fashion Studio → `/apps/outfit-tryon`, and the app slugs `outfit-tryon`,
`reframe`, `inpaint`, `video-extend`, `sketch-to-render`.

## 5. Content caveats

- **Written from names alone, treat as draft:** Creative Tools row copy and
  points, Workflows tile bodies, Apps card bodies, Plugins list. MCP copy and
  commands are the MCP repo's own. Fashion and Ad banner copy is the product's
  own, shortened.
- **Model names** are copied from the B2B repo's Workflows page, which took
  them from the product's model pickers. Flagged there as unverified: Alibaba
  and Lightricks inferred, Kling used as the brand, Flux 3 filed as video.
  Seedance uses the `dreamina` mark because there is no ByteDance icon.
- **Connector and plugin marks** are Simple Icons in brand colour. LinkedIn
  and the three Adobe marks are not in that set, so they are drawn lettered
  tiles (`public/media/connectors/linkedin.svg`, `public/media/plugins/adobe*.svg`).
- **Reviews** are consumer Trustpilot five-star reviews (profile 3.9 overall).
  Selected view; no aggregate rating claim is made.
- **FAQ** reuses the B2B repo's "we never train on your content" and "full
  commercial rights" lines; "free to start" assumes a free tier.
- **Hero clips** (Creative, Workflows) are placeholders from other sections;
  Computer uses the Imagine Computer campaign clip.
- **Remote runtime dependencies:** MCP connect recordings and the 30 Ad Studio
  clips stream from `cdn-imagine.vyro.ai`. Everything else is local.

## 6. Media

`public/media/` is ~71MB. Heavy files, re-encode or delete before shipping (no
ffmpeg on this machine; see the B2B Guidelines §7 for the recipe):

| File | Size | Status |
|---|---|---|
| `studios/film-studio.mp4` | 16MB | unused since the Film banner replaced it; delete |
| `studios/fashion/banner.mp4` | 13MB | in use; re-encode |
| `hero/hero.mp4` | 6MB | unused since the hero changed; delete |

Also unused and deletable: `models/*.png` icons other than the eight on the
model cards, `pillars/chat.mp4`, the six `models/providers/*` backdrops not on
the cards.

Clips are reused across sections on purpose (`ugc`, `upscale`,
`sketch-to-render`, the pipeline and creative clips). Replacing one changes
every card that shows it.

## 7. Open items

1. Confirm the inferred URLs (§4) and the flagged model names (§5).
2. Replace placeholder footage in the hero and Creative Tools, and the invented copy (§5).
3. Re-encode the Fashion clip and delete the unused media (§6).
4. Deployment: `next.config.ts` reads `BASE_PATH` at build time; there is no deploy workflow yet. Reuse the B2B repo's R2 + BunnyCDN workflow once the mount path is decided.
5. `npm run lint` is not wired (ESLint 9 needs `eslint.config.js`); the build is the only guard.
6. Not visually verified in a real browser above ~1180px since the preview pane was dropped; check the studio banners, the bento and the rail at 1440 before shipping.
