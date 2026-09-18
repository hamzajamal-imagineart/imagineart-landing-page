# ImagineArt Landing Page Handoff

One product overview page for **ImagineArt** (www.imagine.art), built as its own
project on the ImagineArt Enterprise design system. Seeded from the Guidelines
kit in `imagine-business-landing-pages/Guidelines/` and that repo's live
components, not forked from it.

- **Repo:** https://github.com/hamzajamal-imagineart/imagineart-landing-page (`main`, commit straight to it)
- **Local:** `Claude Projects/imagineart-landing/`, sibling of the B2B repo
- **Stack:** Next.js 16.2.4 (App Router, Turbopack) · React 19 · TypeScript · Tailwind v4 · `motion` 13 · static export
- **Run:** `npm run dev` → http://localhost:3100 · **Build:** `npm run build` (exports to `out/`, passes clean)
- **Working style (Hamza):** no browser previews or screenshots unless asked. Verify with `npx next build` plus grep or DOM measurement. Keep replies short.

## 1. Decisions

1. **One overview page**, not a hub plus category pages.
2. **Product framing.** Primary action is always "Get Started" → imagine.art; secondary is "Book a demo" → the cal.com booking page. No contact form.
3. **The page ships dark** (17 Sep). The light palette still exists and still works; see §3.
4. **Separate project** from the Guidelines kit, deployed on its own path (undecided, §7).
5. **References used:** ElevenLabs enterprise hero (hero), Higgsfield's ChatGPT-skills page (the Use Cases wheel), Figma *H-Drafts* `483:442` (the tools bento), the ImagineArt product site (studio banners, Fashion and Ad copy), the Enterprise page (partners strip, integrations cluster, capabilities bento).

## 2. Page anatomy, in order

| Section | Component | What it is |
|---|---|---|
| Hero | `sections/Hero` | Headline "Bringing / imagination to life" ("Bringing" at weight 400) left, one-line copy right, Get Started + Book a demo, over a full-bleed photograph. At the foot, a clipped rail of portrait cards, bottoms aligned and heights arching to the middle, each with its name above and a badge in its corner. |
| Partners | `sections/Partners` | Six partner marks (ByteDance, Kling AI, MINIMAX, Wan, fal, Grok) with two captions. |
| Creative Tools `#tools` | `sections/CreativeTools` | A 13-card bento from Figma: four 308px columns, 16px gutter, columns split 372/172 or 130/130/268. Picture cards carry a photograph under a scrim, the rest are flat tinted panels. Title always showing, description on hover. "View all tools" at the foot. |
| Workflows `#workflows` | `sections/Workflows` | Bento, spans [2,1] / [1,1,1]: Node canvas (wide, clip), Brand Guidelines (clip), Creative Analyser (clip), Connectors as a `MarkCluster`, Plugins as a linked list of host apps. Tiles on `--tile`, no borders, 460px rows. |
| Studios `#studios` | `sections/AdStudio` | Heading "Studios" + lede, then the **Ad Studio banner**: five vertical marquee columns of 9:16 ad clips (30 clips, CDN, posters, `preload="none"`) and a frosted left panel. |
| Fashion Studio `#fashion-studio` | `sections/FashionStudio` | Banner: campaign clip full-bleed, rising scrim, white wordmark, glass "Try Now". |
| Film Studio `#film-studio` | `sections/FilmStudio` | Banner: CSS marquee of 24 film thumbnails behind blurred edges and a frosted centre disc. Whole band links to the studio. |
| Use Cases `#use-cases` | `sections/UseCases` + `UseCaseWheel` | "USE CASES" eyebrow, heading "One-click skills for every creative task". A centred vertical list of six use cases advancing every 3s, the active one in a pill with an inline arrow into the template gallery, four of its clips scattered either side. "Browse all templates" at the foot. |
| MCP `#mcp` | `sections/Mcp` | Connect panel ported from `Vyro-ai/imagine-web-mcp-landing`: the Imagine MCP wordmark, client tabs and an MCP / CLI segment, three numbered steps with copy buttons and deep links, and the client's real connect recording. |
| Models | `sections/Models` | Eight model cards, four by two: provider sample full-bleed fading into a per-card tone. |
| Reviews `#reviews` | `ReviewsSection` | Sticky summary + auto-scrolling column of real Trustpilot five-star reviews. |
| FAQ `#faq` | `FAQSection` | Sticky heading rail + accordion, rows open by default, FAQPage JSON-LD from the same array. |
| Closing CTA | `sections/ClosingCta` | Full-bleed `cta/portal.jpg`, scrim in from the left, copy on the page grid, white + glass buttons. |

The three studio banners share one height, `--studio-band-h` in `globals.css`,
and follow each other with no rules between them.

Nav is **Tools · Workflows · Studios · Use Cases · MCP · Pricing**, CTA Get
Started. Keep the nav in the same order as the page so no link scrolls backwards.

**`sections/Apps` is pulled, not deleted.** The component and its eight-app data
are still on disk; recovering it is one import and one line in `app/page.tsx`.

## 3. Design system

### Theme

The page ships dark. `data-theme="dark"` is set on `<html>` in
`app/layout.tsx`, and one override block in `globals.css` keyed to
`:root[data-theme="dark"]` carries the whole theme. Two things make that reach
everything: the selector outranks the `:root` that `<PageTint>` emits
(0,1,1 against 0,1,0), and Tailwind v4 compiles its utilities to
`var(--color-*)`, so redefining those flips every utility class without
touching a className. Dark is **neutral**, shades of black rather than a
darkened slate: the hue is what warms the light page against white, and on
black it reads as a blue cast. Light is still defined and still correct, so
that one attribute is the only thing to change back.

### Tokens

Everything goes through a name. Hard-coding a value three units off one of
these is what made the page read as several designs before the coherence pass.

| Job | Light | Dark |
|---|---|---|
| page wash | `--page-bg` `#eef1f5` | `#0b0b0c` |
| raised, the one elevation cue | `--panel` `#ffffff` | `#2b2b2f` |
| recessed: framed panels, bento tiles, media grounds | `--tile` `#dce4ee` | `#17171a` |
| a light tile inside a recessed panel | `--tile-2` `#f3f5f8` | `#232326` |
| segmented-control groove | `--track` `#cfd9e5` | `#101012` |
| dark bands (Ad, Film, closing) | `--ground` `#0a0a0b` | same |
| hairlines | `--line`, `--line-strong` | white alphas |
| row hover on a tile | `--hover-wash` `white/0.55` | `white/0.045` |
| heading halo / section glow / selection | `--head-glow`, `--glow-tint`, `--selection-bg` | |

Radii use the ladder by name: `--radius-6` 24 for full-width bands and the
hero frame, `--radius-5` 20 for panels and bento tiles, `--radius-4` 16 for
cards and tabs, `--radius-3` 12 for media frames inside a card. Arrow discs are
28px everywhere. Buttons are pills; tabs are `--radius-4` and unbordered.

### Rules carried over from the kit

Weight ≤ 600, headings 500, monochrome with colour from imagery and real brand
marks only, one typeface (Google Sans Flex, local woff2), no em-dashes in copy,
`.container-page` 1240/32, section rhythm `py-24 md:py-32` with a hairline at
every seam. `overflow-x: auto` rails need `padding-block` headroom; no
scroll-snap on rails; `background-color` not the shorthand on media tiles;
every hand-written asset path through `withBasePath()`; assets one directory
deep under `public/media/`.

Deviations, all by request: two-tone headings on Creative Tools, Use Cases and
the closing band (`.h-muted`); Use Cases carries the page's only eyebrow; every
section lede is one short line, centred (Reviews and FAQ stay left because they
sit beside content); the studio banners and closing band are dark surfaces
beyond the kit's two.

### Headings

`.display` and `.h2` take a vertical gradient (`background-clip: text`) falling
from the heading ink to a `color-mix` of it and the page, plus a `--head-glow`
halo. They render through `components/BlurHeading`, which carries the three
shapes the page uses: one clause, a clause plus a muted second clause, and the
hero's two lines at different weights.

### Hero

**The hero carries a photograph** (18 Sep), `hero/backdrop-veil.jpg`, full bleed
behind the whole section. It is an `<img>` rather than a `background-image` so
it can be `object-fit: cover` at `50% 12%`, which keeps the crown in frame as
the section shortens. Its scrim does two jobs in one element: a dark wash over
the top half so the headline and copy hold AA over the red, and a fade to
`--page-bg` at the foot so the seam into Partners stays invisible. The
`SectionGlow` still sits above it, at `z-index: -1` to the photograph's `-2`.

This is the page's one saturated surface. The rest of the design system is
still monochrome, and the colour rule (§3) is unchanged: colour comes from
imagery, and this is imagery.

**The hero's framed panel is gone** (18 Sep). It held a Creative · Workflows ·
Computer tab bar over one clip each, and before that a five-card carousel in
the Creative tab. All of it is deleted: no tabs, no video, nothing to play or
pause in the hero. `hero/computer.mp4` and `hero/creative-suite-image.webm`
are unused as a result, and so are `SlidingIndicator` and `useState` in this
file.

One thing from that work is worth keeping even though its code went: **never
point more than one `<video>` at one URL.** Five elements sharing a file fire
five range requests in the same millisecond, and none can hit the cache the
others are still filling, so a 1.4MB file cost 7MB, on a CDN as much as on the
dev server. If that layout returns, fetch once and hand every element the same
object URL.

**In its place, the showcase rail.** A row of 3:4 cards with their bottoms
aligned and each one taking its own share `--k` of the tallest height, which
is what draws the arch; the width follows from the ratio, so one number per
card sets both. The rail sits outside `.container-page` and runs wider than
the page, clipped with a `mask-image` so the end cards are cut and the row
reads as continuing past the screen. It is a scroll rail, so it takes
`padding-block` headroom rather than margins, per the kit rule.

**Headings do not animate** (17 Sep). BlurHeading used to wrap
`components/ui/blur-reveal` and reveal per character on scroll; it was pulled
because it split every heading into one `inline-block` span per character,
which cost first paint, broke `text-wrap: balance`, and baked `opacity:0` into
the static export so headings were invisible without JS. `ui/blur-reveal.tsx`
is still on disk but unused.

### Shared components

In use: `UseCaseWheel`, `MarkCluster`, `SiteNav`, `SiteFooter`, `Button`,
`PageTint`, `BlurHeading`, `icons.tsx`, `primitives/SectionGuides`,
`primitives/SectionGlow`, `primitives/SlidingIndicator`,
`primitives/useAutoAdvance`.
Unused, kept on disk: `ui/blur-reveal`, `Backdrop`, `RailGrid`, `MediaCard`,
`CollaborationDemo`, `primitives/SectionPattern`.

- **Tabs.** Every tab list (hero, MCP clients, MCP route, the wheel) uses
  `SlidingIndicator`: one fill that travels on `transform`/`width`/`height`,
  leaving each tab nothing to animate but its text colour. Only the wheel walks
  itself, on `useAutoAdvance` (3s), drawing the dwell as a faint fill in
  `--progress-wash`.
- **Section guides.** `SectionGuides` is the Enterprise repo's version, ported
  wholesale; keep it in sync with the B2B repo rather than editing this copy.
  It diverges in one place only: the rule and dot colours come from
  `--guide-line` / `--guide-dot` so they survive dark. In use on Partners,
  Tools, Workflows, Studios and MCP, each `edge="top"` with `lg:border-t-0` on
  the section.
- **Section glow.** `SectionGlow` puts a faint pool of light at the head of
  the hero and of alternate sections (Tools, Studios, Use Cases, Models, FAQ).
  The hero's sits at `50% 20%` rather than the usual `50% 0%`, since a pool at
  the very top would fall behind the fixed bar. Sits at
  `z-index: -1`, so its host needs `isolation: isolate`.

## 4. Traps already paid for

Each of these failed **silently**. Re-read before touching the same ground.

- **A token paired with a fixed partner.** `background: var(--ink); color: #fff`
  is white on white once `--ink` is near-white. Every such pair now takes
  `var(--page-bg)` for the label. It caught the hero and MCP buttons, the nav
  CTA, the arrow discs and the MCP copy button.
- **Logos with baked-in near-black** each need their own answer. The ImagineArt
  and Imagine MCP wordmarks ship a `-dark.svg` twin swapped by CSS, because a
  filter would invert their coloured marks too. The single-glyph MCP client
  marks take `filter: brightness(0) invert(1)` instead, because `grok.svg`
  carries a `fill="white"` inside a `<mask>` that a fill-swap would corrupt.
- **Never put a `var(--…)` in `PageTint`'s palette table.** Those literals are
  the source of the tokens; a self-reference emits `--tile: var(--tile)`, which
  resolves to nothing and removes every panel background.
- **`background-clip: text` paints only inside the element's own background
  box.** Descenders on the last line went unpainted until the `padding-bottom`
  / negative `margin-bottom` pair was added. A transparent text fill also means
  `::selection` must restore `-webkit-text-fill-color`, and anything overriding
  `.h-muted` must set the fill as well as the colour.
- **The `0fr` → `1fr` grid reveal does not work here.** A bare `0fr` keeps an
  automatic min-content floor so it never closes; `minmax(0, 1fr)` closes but
  has no minimum to size against in an auto-height box, so it never opens and
  the text clips to nothing. Use `max-height`.
- **Do not gate first paint on `requestAnimationFrame`.** It is suspended in
  background tabs, which left every tab list snapping until the tab was looked
  at. `SlidingIndicator` arms from a passive effect.
- **A blurred layer samples transparent past its own edges** and haloes every
  seam unless it overhangs its host and something clips the overhang.
  `Backdrop` clips itself, rather than making the host clip and then fighting
  `SectionGuides` dots over `overflow-clip-margin`.

## 5. Links (`lib/links.ts`)

Confirmed: Creative `/image`, Workflows `/workflow`, Computer
`/imagine-computer`, the three studios `/ad-studio` · `/fashion-studio` ·
`/film-studio`, Pricing `/subscription`, demo
`cal.com/team/imagineart/imagineart-customer-assist`, template gallery
`/enterprise/template` with category slugs `advertising · cinematic · fashion ·
branding`, app gallery `/apps` and `/apps?category-id=` with
`image 14 · video 23 · music 18`, plugin pages `/plugins#<app>`.

**Inferred, verify before shipping:** the Avatar studio → `/apps/heygen-avatar`.
Note `/apps/outfit-tryon`, which Fashion Studio used to point at, returns 500.

## 6. Content caveats

- **The bento's six photographs come from Figma** and are the real thing. Three
  of its descriptions do not match their titles: VFX reads as music copy,
  Outpaint as pipeline copy and Lipsync as image copy, because the Figma frames
  were renamed without their bodies. **Fix before shipping.** Every card links
  to `/apps`, since per-tool URLs are not confirmed.
- **Written from names alone, treat as draft:** Workflows tile bodies, and the
  four second-row bento cards (Inpaint, Image Upscaler, Video Extend, Outfit
  Try-on). MCP copy and commands are the MCP repo's own. Fashion and Ad banner
  copy is the product's own, shortened.
- **Model names** are copied from the B2B repo's Workflows page. Flagged there
  as unverified: Alibaba and Lightricks inferred, Kling used as the brand,
  Flux 3 filed as video. Seedance uses the `dreamina` mark.
- **Connector marks** are Simple Icons in brand colour; LinkedIn is a drawn
  lettered tile. **Plugin marks are the product's own**, taken from the live
  `/plugins` page assets.
- **Reviews** are consumer Trustpilot five-star reviews (profile 3.9 overall).
  Selected view; no aggregate rating claim is made.
- **FAQ** reuses the B2B repo's "we never train on your content" and "full
  commercial rights" lines; "free to start" assumes a free tier.
- **The showcase rail is entirely placeholder.** Its eight images are the
  bento's photographs reused, because they are the only 3:4 stills on disk.
  Its eight labels are worse: they are **copied from the ElevenLabs reference
  screenshot**, so they are another company's customer names (Superpower,
  Girlfriends, Character AI, Bastion Bees, Eliza Dolittle, Waverly, Timmons,
  POGA). **Both must be replaced before this is shown to anyone.** Swapping
  `image` and `label` on each `SHOWCASE` entry is the whole job.
- **Remote runtime dependencies:** MCP connect recordings and the 30 Ad Studio
  clips stream from `cdn-imagine.vyro.ai`; the hero's Creative clip from
  `imagine.animagic.art` and its Workflows clip from `www.imagine.art`.
  Everything else is local.

## 7. Media

`public/media/` is ~72MB. Heavy files, re-encode or delete before shipping (no
ffmpeg on this machine; see the B2B Guidelines §7 for the recipe):

| File | Size | Status |
|---|---|---|
| `studios/film-studio.mp4` | 16MB | unused; delete |
| `studios/fashion/banner.mp4` | 13MB | in use; re-encode |
| `hero/backdrop-veil.jpg` | 410KB | the hero photograph; in use |
| `hero/creative-suite-image.webm` | 1.4MB | unused since the hero panel went; delete |
| `hero/computer.mp4` | 1.9MB | unused since the hero panel went; delete |
| `cta/hills.jpg` | 195KB | unused since the closing band changed; delete |

`hero/hero.mp4` (6MB) and `hero/backdrop.jpg` were deleted on 18 Sep.

Also unused: `models/*.png` icons other than the eight on the model cards,
`pillars/chat.mp4`, `pillars/creative.mp4`, and the six `models/providers/*`
backdrops not on the cards. Clips are reused across sections on purpose, so
replacing one changes every card that shows it.

## 8. Open items

1. **Fix the three mismatched bento descriptions** (§6) and give the cards per-tool links.
2. Confirm the remaining inferred URL (§5) and the flagged model names (§6).
3. **Replace the showcase rail's placeholder images and labels** (§6): the
   labels are currently another company's customer names. Then the remaining
   invented copy (§6).
4. Re-encode the Fashion clip and delete the unused media (§7).
5. ~~Headings invisible without JS~~ and ~~`text-wrap: balance` not applying~~:
   both resolved by removing the heading animation (§3).
6. **Tap targets.** 63 elements are under 40px on mobile, almost all text links
   in the nav and footer where the text is the target and spacing is adequate.
   The MCP client tabs at 36px are the closest to worth changing. A decision,
   not a defect.
7. Deployment: `next.config.ts` reads `BASE_PATH` at build time; there is no
   deploy workflow yet. Reuse the B2B repo's R2 + BunnyCDN workflow once the
   mount path is decided.
8. `npm run lint` is not wired (ESLint 9 needs `eslint.config.js`); the build is
   the only guard.

## 9. No-JS and crawler audit (17 Sep)

Run against `out/index.html`, since the crawler and a reader without JS both
get exactly that file. **The page's text is all in the static HTML**: one
`<h1>`, ten `<h2>`, every section lede, all 13 bento cards with their
descriptions, all six use cases, every FAQ question and answer, every review,
and the whole footer. No element carries `opacity:0` from the markup. Nothing
about the copy depends on hydration.

Two gaps were found and fixed:

- **Eight of the nine use-case rows were `<button onClick>`**, so only the
  selected one was a link. Without JS that left the section with a single way
  out, and a crawler with one template-gallery URL to follow. Every row is now
  an `<a href>`; with JS, a click on an inactive row still selects it instead
  of navigating. Anchors on the page went from 90 to 102.
- **The mobile menu did not exist until JS opened it** (`menuOpen && …`), and
  the desktop links are `display:none` under 1080px, so a phone without JS got
  a wordmark and a dead burger. A `<noscript>` block now lays the same link set
  out in flow under the bar. It costs a hydrated page nothing.

Checked and deliberately left alone:

- **Hero tabs.** The first panel is server-rendered with `hero-panel-on`, so
  it shows without JS. The other two hold video only, no text.
- **MCP.** Only the selected client's three steps are in the DOM. The default
  (Claude) panel is complete, and the other five are the same instructions
  with a different client name, so there is nothing unique to lose.
- **Bento descriptions** are hover-revealed but already forced open under
  `@media (hover: none)`, and they are in the DOM either way.
- **89 of 95 images carry `alt=""`.** They are decorative: each sits in a card
  whose title and description are real text beside it.

## 10. Last layout audit (17 Sep)


Instrumented pass at 1440 and 375, walking the page so lazy media mounted:
**no horizontal overflow, no broken images or videos, and no text under WCAG AA
at either width.** Getting there took `--ink-3` up from `#85858a` (3.84:1 on a
tile) and the footer's column headings from `white/38` to `white/62`.

Two things that looked like bugs and were not: images reported "broken" are
usually `loading="lazy"` and simply below the fold at sample time; and any
contrast checker here must resolve `oklab()` colours (paint them to a canvas)
or it will misread every Tailwind alpha colour on the page.
