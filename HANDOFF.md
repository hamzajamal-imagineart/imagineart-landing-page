# ImagineArt Landing Page Handoff

One product overview page for **ImagineArt** (www.imagine.art), built as its own
project on the ImagineArt Enterprise design system. Seeded from the Guidelines
kit in `imagine-business-landing-pages/Guidelines/` and that repo's live
components, not forked from it.

- **Repo:** https://github.com/hamzajamal-imagineart/imagineart-landing-page (`main`)
- **Local:** `Claude Projects/imagineart-landing/`, sibling of the B2B repo
- **Stack:** Next.js 16.2.4 (App Router, Turbopack) · React 19 · TypeScript · Tailwind v4 · `motion` 13 · static export
- **Run:** `npm run dev` → http://localhost:3100 · **Build:** `npm run build` (export to `out/`, passes clean)
- **Working style (Hamza, 16 Sep 2026):** no browser previews or screenshots. Verify with `npx next build` and grep, keep replies short.

## 1. Decisions

1. **One overview page**, not a hub plus category pages.
2. **Product framing.** Primary action is always "Get Started" → imagine.art; secondary is "Book a demo" → the cal.com booking page. No contact form.
3. **Separate project** from the Guidelines kit, deployed on its own path (undecided, see §7).
4. **References used:** ElevenLabs enterprise hero (hero), Higgsfield's ChatGPT-skills page (the Use Cases wheel, and the earlier rail-and-cards), the ImagineArt product site itself (studio banners, Fashion and Ad copy), the Enterprise page (partners strip, integrations cluster, capabilities bento).

## 2. Page anatomy, in order

| Section | Component | What it is |
|---|---|---|
| Hero | `sections/Hero` | Headline "Bringing / imagination to life" ("Bringing" at weight 400) left, one-line copy right, Get Started + Book a demo pills. Full-bleed `hero/backdrop.jpg` behind the whole section, blurred and masked out at the foot. Framed panel with a Creative · Workflows · Computer tab bar and one 16:9 clip per tab; the visible clip shows native controls on hover or focus. Tabs do not auto-advance. |
| Partners | `sections/Partners` | Six partner marks (ByteDance, Kling AI, MINIMAX, Wan, fal, Grok) with two captions. The only section that keeps the kit's `SectionGuides` rules and dots. |
| Creative Tools `#tools` | `sections/CreativeTools` | Three labelled rails, Image · Video · Music and Audio, each with a "See all" into that app-gallery category. Cards are the clip full-bleed at 3:4, title always on a bottom veil, description revealed on hover. Rails bleed to the window edges; the section clips the overflow. |
| Workflows `#workflows` | `sections/Workflows` | Bento, spans [2,1] / [1,1,1]: Node canvas (wide, clip), Scheduling (clip), Creative Analyser (clip), Connectors as a `MarkCluster`, Plugins as a linked list of host apps. Tiles on `#dce4ee`, 460px rows. |
| Studios `#studios` | `sections/AdStudio` | Heading "Studios" + one line, then the **Ad Studio banner**: dark band of five vertical marquee columns of 9:16 ad clips (30 clips, CDN, posters, `preload="none"`) and a frosted left panel. |
| Fashion Studio `#fashion-studio` | `sections/FashionStudio` | Banner: campaign clip full-bleed, rising dark scrim, white wordmark, glass "Try Now". |
| Film Studio `#film-studio` | `sections/FilmStudio` | Banner: CSS marquee of 24 film thumbnails behind blurred edges and a frosted centre disc. Whole band links to the studio. |
| Use Cases `#use-cases` | `sections/UseCases` + `UseCaseWheel` | "USE CASES" eyebrow, heading "One-click skills for every creative task". A centred vertical list of six use cases that advances itself every 3s, the active one in a pill with an inline arrow linking into the template gallery, four of its clips scattered either side. "Browse all templates" ghost button at the foot. |
| MCP `#mcp` | `sections/Mcp` | Connect panel ported from `Vyro-ai/imagine-web-mcp-landing`: heading is the Imagine MCP wordmark; client tabs and a small MCP / CLI segment; three numbered steps with copy buttons and deep links; the client's real connect recording streamed from the Imagine CDN. |
| Models | `sections/Models` | Eight model cards, four by two: provider sample full-bleed, fading into a per-card tone. |
| Reviews `#reviews` | `ReviewsSection` | Sticky summary (left-aligned) + auto-scrolling column of real Trustpilot five-star reviews. |
| FAQ `#faq` | `FAQSection` | Sticky heading rail (left-aligned) + accordion, rows open by default, FAQPage JSON-LD from the same array. |
| Closing CTA | `sections/ClosingCta` | Full-bleed `cta/portal.jpg` behind the whole section, scrim in from the left, copy on the page grid, white + glass buttons. |

The three studio banners share one height, `--studio-band-h` in `globals.css`
(360 to 420px), and follow each other with no rules between them.

Nav is **Tools · Workflows · Studios · Use Cases · MCP · Pricing**, CTA Get Started.
It is kept in the same order as the page so no link ever scrolls backwards.

**`sections/Apps` is pulled, not deleted** (Hamza, 17 Sep). The component and its
eight-app data are still on disk; recovering it is one import and one line in
`app/page.tsx`, plus a nav entry if it earns one. Most of its app names now
appear as cards in the Creative Tools rails.

## 3. Design system

Page palette is **slate** via `components/PageTint.tsx`: one hue used as wash,
heading ink, tile, panel, and two nested-container shades (`--shade-1`,
`--shade-2`). In practice the framed panels settled on hard-coded `#dce4ee`
(panel) and `#f3f5f8` (light tiles inside those).

Rules carried over from the kit: weight ≤ 600, headings 500, monochrome with
colour from imagery and real brand marks only, one typeface (Google Sans Flex,
local woff2), no em-dashes in copy, `.container-page` 1240/32, section rhythm
`py-24 md:py-32` with a plain hairline at every seam.

**Tokens, after the coherence pass (17 Sep).** The page had drifted to five
container radii, six light slates and five hairline blacks, roughly half of
them hard-coded beside a token that already said the same thing. Everything
now goes through a name:

| Job | Token |
|---|---|
| page wash | `--page-bg` `#eef1f5` |
| raised, the one elevation cue | `--panel` `#ffffff` |
| recessed: framed panels, bento tiles, media grounds | `--tile` `#dce4ee` |
| a light tile inside a recessed panel | `--tile-2` `#f3f5f8` |
| segmented-control groove | `--track` `#cfd9e5` |
| dark bands (Ad, Film, closing) | `--ground` `#0a0a0b` |
| every hairline on a light ground | `--line`, and `--line-strong` where it must read |

Radii use the ladder by name: `--radius-6` 24 for full-width bands and the
hero frame, `--radius-5` 20 for panels and bento tiles, `--radius-4` 16 for
cards and tabs, `--radius-3` 12 for media frames inside a card. Arrow discs
are 28px everywhere, solid `--ink-heading` on a light ground and glass on
media. Buttons are pills; tabs are `--radius-4` and unbordered.

Do not put a `var(--…)` into `PageTint`'s palette table: those literals are
the source of these tokens, and a self-reference there emits
`--tile: var(--tile)`, which resolves to nothing and silently removes every
panel background.

**Backdrop.** `components/Backdrop.tsx` reuses the hero photograph at
`blur(64px)` behind Workflows, Use Cases, Models and FAQ, so a thread of the
hero's light runs down the page. It overhangs its host by 140px (a blurred
layer samples transparent past its own edges and haloes the seams otherwise),
sits at `z-index: -1` in a host that isolates and clips, and masks out top and
bottom. The studio banners and the closing band are skipped: they are dark or
already carry a photograph.

**Tabs.** Every tab list on the page (hero, MCP clients, MCP route, the Use
Cases wheel) uses `primitives/SlidingIndicator`: one fill that travels between
tabs on `transform`/`width`/`height`, leaving each tab nothing to animate but
its text colour. Only the Use Cases wheel walks itself, on
`primitives/useAutoAdvance` (3s), drawing the dwell as a very faint fill
sweeping the selected tab. The hero tabs are manual: under the headline, a
panel changing on its own competes with the copy for the eye.

**Section guides.** `primitives/SectionGuides` is the Enterprise repo's
version, ported wholesale on 17 Sep; the copy this project was seeded with was
an older one that drew four dots per section (so every shared seam rendered a
double dot), gapped its verticals at both ends (so the grid read as detached
boxes rather than one continuous rule), and sat at `z-20`, painting lines over
cards. Keep them in sync with the B2B repo rather than editing this copy. In
use on Partners, Workflows, Studios and MCP, each `edge="top"` with
`lg:border-t-0` on the section so the guide's rule takes over from the border
at desktop. A section that also hosts a `<Backdrop>` needs
`overflow-clip-margin`, or the clip halves the dots standing proud of its top
edge.

**Headings** animate through `components/BlurHeading`, which wraps the
`components/ui/blur-reveal` component (shadcn-style drop-in, `motion`). It adds
the three things the bare component could not do: a muted second clause, the
hero's two lines at different weights, and a reduced-motion path that renders
plain text. Every heading reveals `inView` and `once`.

Deviations, all by request: two-tone headings are back on Creative Tools, Use
Cases and the closing band (`.h-muted`); Use Cases carries the page's only
eyebrow, because its heading no longer names its section; every section lede is
one short line, centred (Reviews and FAQ stay left because they sit beside
content); the kit's `SectionGuides` are off everywhere except Partners; the
three studio banners and the closing band are dark surfaces beyond the kit's two.

Shared components in use: `UseCaseWheel`, `MarkCluster`, `SiteNav`,
`SiteFooter`, `Button`, `PageTint`, `BlurHeading`, `icons.tsx`,
`primitives/SectionGuides`, `primitives/SlidingIndicator`,
`primitives/useAutoAdvance`, `ui/blur-reveal`. Unused, kept on disk:
`RailGrid`, `MediaCard`, `CollaborationDemo`, `primitives/SectionPattern`.

Inherited rules that still apply: `overflow-x: auto` rails need `padding-block`
headroom; no scroll-snap on rails; `background-color` not the shorthand on
media tiles; every hand-written asset path through `withBasePath()`; assets one
directory deep under `public/media/`.

Two things learned the hard way, both silent failures:

- **The `0fr` → `1fr` grid reveal does not work here.** A bare `0fr` keeps an
  automatic min-content floor so it never closes; `minmax(0, 1fr)` closes but
  then has no minimum to size against in an auto-height container, so it never
  opens and the text is clipped to nothing. The Creative Tools card uses
  `max-height` instead.
- **Do not gate first paint on `requestAnimationFrame`.** It is suspended in
  background tabs, which left every tab list snapping until the tab was looked
  at. `SlidingIndicator` arms from a passive effect.

## 4. Links (`lib/links.ts`)

Confirmed: Creative `/image`, Workflows `/workflow`, Computer `/imagine-computer`,
Film Studio `/ai-film-studio`, Pricing `/subscription`, demo
`cal.com/team/imagineart/imagineart-customer-assist`, template gallery
`/enterprise/template` with category slugs `advertising · cinematic · fashion · branding`,
app gallery `/apps?category-id=` with `image 14 · video 23 · music 18`,
plugin pages `/plugins#<app>`.

**Inferred, verify before shipping:** Ad Studio → `/ai-image-generator`,
Fashion Studio → `/apps/outfit-tryon`.

## 5. Content caveats

- **Written from names alone, treat as draft:** Creative Tools card titles and
  bodies, Workflows tile bodies. MCP copy and commands are the MCP repo's own.
  Fashion and Ad banner copy is the product's own, shortened.
- **Creative Tools thumbnails are placeholders.** Every clip is borrowed from
  another section and picked only for being the nearest thing to the tool it
  sits under. The Music and Audio row is the weakest: there is no audio footage
  on disk at all. Cards also all link to their row's category page, because
  per-app URLs are not confirmed; give each card its own `href` once they are.
- **Model names** are copied from the B2B repo's Workflows page. Flagged there
  as unverified: Alibaba and Lightricks inferred, Kling used as the brand,
  Flux 3 filed as video. Seedance uses the `dreamina` mark.
- **Connector marks** are Simple Icons in brand colour; LinkedIn is a drawn
  lettered tile. **Plugin marks are the product's own**, taken from the live
  `/plugins` page assets, so the tile shows the same icons as its destination.
- **Reviews** are consumer Trustpilot five-star reviews (profile 3.9 overall).
  Selected view; no aggregate rating claim is made.
- **FAQ** reuses the B2B repo's "we never train on your content" and "full
  commercial rights" lines; "free to start" assumes a free tier.
- **Hero clips:** Creative and Workflows stream real footage; Computer is
  still a placeholder.
- **Remote runtime dependencies:** MCP connect recordings and the 30 Ad Studio
  clips stream from `cdn-imagine.vyro.ai`; the hero's Creative clip streams
  from `imagine.animagic.art` and its Workflows clip from `www.imagine.art`.
  Everything else is local.

## 6. Media

`public/media/` is ~72MB. Heavy files, re-encode or delete before shipping (no
ffmpeg on this machine; see the B2B Guidelines §7 for the recipe):

| File | Size | Status |
|---|---|---|
| `studios/film-studio.mp4` | 16MB | unused since the Film banner replaced it; delete |
| `studios/fashion/banner.mp4` | 13MB | in use; re-encode |
| `hero/hero.mp4` | 6MB | unused since the hero changed; delete |
| `cta/hills.jpg` | 195KB | unused since the closing band changed; delete |
| `hero/backdrop.jpg` | 122KB | in use, twice over: the hero ground and every `<Backdrop>` |

Also unused and deletable: `models/*.png` icons other than the eight on the
model cards, `pillars/chat.mp4`, the six `models/providers/*` backdrops not on
the cards, and `pillars/creative.mp4` now the hero streams its Creative clip.

Clips are reused across sections on purpose. Replacing one changes every card
that shows it.

## 7. Open items

1. Confirm the inferred URLs (§4) and the flagged model names (§5).
2. Replace the Creative Tools thumbnails and give the cards per-app links; supply real audio footage (§5).
3. Replace the remaining placeholder hero footage and the invented copy (§5).
4. Re-encode the Fashion clip and delete the unused media (§6).
5. **Headings are invisible without JS.** `motion` renders `initial="hidden"` into the static HTML, so every character carries `opacity:0` in `out/index.html`. Crawlers still get the text (the `sr-only` span is real), but a reader whose JS fails sees no headings. Decide whether to accept it or render plain text until hydration.
6. `text-wrap: balance` no longer applies to headings, since every character is its own `inline-block`.
7. Deployment: `next.config.ts` reads `BASE_PATH` at build time; there is no deploy workflow yet. Reuse the B2B repo's R2 + BunnyCDN workflow once the mount path is decided.
8. `npm run lint` is not wired (ESLint 9 needs `eslint.config.js`); the build is the only guard.
9. Not visually verified in a real browser above ~1180px. Check the studio banners, the bento, the Creative Tools rails and the Use Cases wheel at 1440 before shipping.
