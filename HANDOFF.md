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
2. **Product framing.** Primary action is always → imagine.art; "Book a demo" → the cal.com booking page is secondary. No contact form. **The hero carries the primary action alone** (18 Sep), worded "Start creating for free"; the closing band and the footer still offer both.
3. **The page ships dark** (17 Sep). The light palette still exists and still works; see §3.
4. **Separate project** from the Guidelines kit, deployed on its own path (undecided, §7).
5. **References used:** ElevenLabs enterprise hero (hero), Higgsfield's ChatGPT-skills page (the Use Cases wheel), Figma *H-Drafts* `483:442` (the tools bento), the ImagineArt product site (studio banners, Fashion and Ad copy), the Enterprise page (partners strip, integrations cluster, capabilities bento).

## 2. Page anatomy, in order

| Section | Component | What it is |
|---|---|---|
| Hero | `sections/Hero` | One centred column over a mosaic of work: headline "Imagine, design, animate, / edit. One platform." flat and all at weight 500, the copy, then one CTA, "Start creating for free". Below it a 16:9 panel holding one clip edge to edge, with its chip row (Image Generator · Upscaler · Variations · Relight · Camera Angles) floating over the footage in glass. |
| Partners | `sections/Partners` | Six partner marks (ByteDance, Kling AI, MINIMAX, Wan, fal, Grok) with two captions. |
| Creative Tools `#tools` | `sections/CreativeTools` | A 13-card bento from Figma: four 308px columns, 16px gutter, columns split 410/190/190 or 144/144/296/190 so all four end level at 822. Eight cards carry a photograph under a scrim, five carry that tool's own clip under the same scrim. No icons. Title always showing, description on hover. "View all tools" at the foot. |
| Workflows `#workflows` | `sections/Workflows` | Bento, spans [2,1] / [1,1,1]: Node canvas (wide, clip), Brand Guidelines (clip), Creative Analyser (clip), Connectors as a `MarkCluster`, Plugins as a linked list of host apps. Every tile carries a gradient ground. No borders, 460px rows. |
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

**The hero's ground is a mosaic of work** (18 Sep), eighteen tiles run edge to
edge behind the copy, downscaled to 440px wide in `hero/mosaic/`: **568KB for
the set**, against several MB for the originals, which would have rendered at
a fraction of their size. Rebuild with `sips -Z 440` and update `MOSAIC`'s
length if the set changes.

It is laid out in CSS **columns**, not a grid. The tiles are a mix of 1:1, 3:4
and 9:16, and columns let each keep its own ratio and pack against its
neighbours, which is what makes the edges ragged rather than a tidy grid of
equal boxes. The mosaic runs 130% of the section's height so the columns are
always cut off rather than running out partway down and leaving a bald foot;
six columns, three under 880px.

**Making the copy readable over it took three things, and the obvious one
mattered least.**

1. **`SectionGlow` came out of the hero.** It sat above the mosaic and poured
   white light into the middle of the section, which is exactly where the
   headline is. It was working against the scrim.
2. **The mosaic blurs once the page moves**, `blur(14px)` past 24px of
   scroll. Sharp at rest, so the work reads as work; soft the moment it is
   only a ground. It takes the hard edges out from under the letterforms. It
   needs `transform: scale(1.09)`, kept on at all times rather than arriving
   with the blur: a blurred layer samples transparent past its own edges, so
   without it the mosaic haloes along every edge of the section (§4), and
   applying the scale with the blur would shift the ground as it arrives. The
   toggle is a passive scroll listener seeded from the current position, never
   `requestAnimationFrame` (§4); with no JS the mosaic simply stays sharp.
3. **The scrim's pool is wide.** This is the one that carries it. Swept
   against the real mosaic at 1440: a pool of `64% x 48%` gave 11.2:1 behind
   the headline, `80% x 62%` gave 13.2:1 and halved the variation across the
   text box, while blurring from 9px to 24px moved the worst case by 0.3.
   **The pool has to be wider than the copy, not tighter.**

Measured at 1440 per pixel across each text box, worst case: blurred, **13.2:1
behind the headline, 9.6:1 behind the copy, 17.1:1 behind the CTA**; sharp, at
the top of the page, **12.5:1 and 9.1:1**. The pool is what holds it either
way, which is why the hero survives losing the blur at rest.

The first attempt at this measured 15:1 and still read badly, which is the
lesson: **a contrast ratio against the mean is not legibility over a
photograph.** Sample per pixel, take the worst, and look at the variation
across the box as well as the ratio.

**The hero headline does not take the page's gradient.** `.display` paints its
text transparent and fills it with a gradient plus a halo; the hero overrides
all three (`background: none`, `-webkit-text-fill-color`, `text-shadow: none`)
to one flat ink at weight 500, both clauses the same. Setting only `color`
would have done nothing, per the trap in §4.

**The hero has no tab bar** (18 Sep). Creative · Workflows · Computer is gone,
and with it the two clips only those tabs reached, so `hero/computer.mp4` is
unused. The panel is one 16:9 clip filling it edge to edge, no padding and no
inner chrome.

**The chip row floats on the clip, in glass.** It used to sit on a band under
the video, which was eating the bottom of the panel. It is now absolutely
placed over the footage on `rgba(255,255,255,0.1)` with a
`backdrop-filter: blur(22px)` and a hairline, so it belongs to the clip rather
than to a strip beneath it. Its colours are fixed white and `#0b0b0c`, not
tokens: these sit on the footage, not on the page, so they do not follow the
theme — and the selected chip takes the ground colour against the near-white
fill, per the pairing rule in §4.

**Every Tools card carries media now** (18 Sep), and none carries an icon.
Five have their tool's own clip: Inpaint, Image Upscaler, Video Extend and
Outfit Try-on have exact footage in `capabilities/`, and Outpaint borrows
`video-reframe.mp4`, the same operation seen from the other side. Each keeps
its tint underneath as a stand-in poster, since none of these clips has one
and the card would otherwise be black until the first frame lands. The last
two flat cards, Dub Video and Remove Background, took stills cut down from the
showcase set.

**The short cards need their own scrim.** The original is sized for a 410px
card — it is gone by 62% of the way up, which is above a mini card's title but
well below a tall one's. Putting a photograph on a 144px card with that scrim
measured **3.5:1 on Remove Background's title, under AA**, and Inpaint was
marginal at 4.7:1. `.bt-mini`, `.bt-short` and `.bt-fill` now take a gradient
that reaches their full height. Measured per pixel across every card title at
1440 afterwards: the worst on the page is **9.4:1**, and nothing is near AA.
**Check this again if a brighter still goes on a short card.**

**The hero CTA is built from a supplied SVG**, not approximated: shape 48 tall
on an 18 radius; the fill is that SVG's radial gradient, whose rx and ry were
161.58 and 125.29 against a 255x48 button, hence 63% and 261%; the two glows
are its drop shadows, both `#8A3FFC` at 15% with `stdDeviation` 6 and 12,
which is 12px and 24px of CSS blur; and the lip is its inner shadow, offset up
4 with no blur, which lands as a 4px band inside the bottom edge. It is the
page's only saturated control, and its white label measures 5.0:1 on the
gradient's mid purple.

The lip costs one thing that is easy to miss: it eats the bottom 4px, so the
visible face is the top 44px of a 48px button and a label centred on the box
sits 1.8px below the middle of what you see. `padding-bottom: 4px` puts it
back.

**The tab bar stands on the page as a segmented control.** A groove on
`--track`, the token for exactly this, hugging its three tabs rather than
stretching, so it stays centred at any width; `overflow-x: auto` on the groove
rather than wrapping, so the control never becomes two rows. The fill is still
`SlidingIndicator`, on **`--panel`**: `--tile` is only six values off the page
in dark, so the selected tab was all but invisible when the bar first left the
panel and stood on `--page-bg`. `--panel` is the token for a raised surface,
which is what the selected tab is, and it now sits in a groove that is darker
than the page, so the selection reads at a glance. The panel below it is media only.

**The hero panel is the tabbed one** (18 Sep). A Creative · Workflows ·
Computer tab bar over one clip each; Creative is a full-width clip with a chip
row under it (Image Generator · Upscaler · Variations · Relight · Camera
Angles), every chip pointing at the same file, so picking one changes the
selection and nothing else. Give each `CREATIVE` entry its own `video` and it
starts working with no other change.

**A showcase rail replaced this panel for part of 18 Sep and was reverted.**
It was a row of seven 3:4 cards arching to the middle, filling the page edge
to edge, with the copy centred under a larger flat headline and the section
locked to `100svh`. `Hero.tsx` was restored wholesale from the commit before
it, so the two-column top, the gradient headline and the auto-height section
came back with it. The seven images are still on disk at `hero/showcase/`
(2.6MB) and are now unused. `git show 4e3143f:components/sections/Hero.tsx`
has the rail version if any of it is wanted again.

Two things from that stretch are worth keeping in mind whatever the hero does
next. **Never point more than one `<video>` at one URL**: five elements
sharing a file fire five range requests in the same millisecond, none able to
hit the cache the others are still filling, so a 1.4MB file cost 7MB. And
**measure a scrim over a photograph, do not eyeball it**: the method is to
composite the picture with the scrim layers at the text's real position and
take the ratio, including against the brightest pixel in the band.

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
  alternate sections (Tools, Studios, Use Cases, Models, FAQ).
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
- **Hero clips:** Workflows streams real footage; Computer is still a
  placeholder. All five Creative chips play one file,
  `hero/creative-suite-image.webm` (1.4MB), so the clip does not change when
  you pick a chip. **Give each entry its own footage before shipping.** WebM
  is the only one on the page; every other clip is MP4.
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
| `hero/backdrop-veil.jpg` | 410KB | unused since the hero photograph was dropped; delete |
| `hero/mosaic/*.jpg` | 568KB | the hero's ground, eighteen tiles; in use |
| `hero/showcase/*.jpg` | 2.6MB | the originals behind seven of the mosaic tiles; keep |
| `hero/creative-suite-image.webm` | 1.4MB | the Creative clip; in use |
| `hero/computer.mp4` | 1.9MB | unused since the hero tab bar went; delete |
| `cta/hills.jpg` | 195KB | unused since the closing band changed; delete |

`hero/hero.mp4` (6MB) and `hero/backdrop.jpg` were deleted on 18 Sep.

Also unused: `models/*.png` icons other than the eight on the model cards,
`pillars/chat.mp4`, `pillars/creative.mp4`, and the six `models/providers/*`
backdrops not on the cards. Clips are reused across sections on purpose, so
replacing one changes every card that shows it.

## 8. Open items

1. **Fix the three mismatched bento descriptions** (§6) and give the cards per-tool links.
2. Confirm the remaining inferred URL (§5) and the flagged model names (§6).
3. Replace the Computer hero clip, give each Creative chip its own footage,
   and replace the remaining invented copy (§6).
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
