# ImagineArt Landing Page — Handoff

One product overview page for **ImagineArt** (www.imagine.art), built as its
own project on the ImagineArt Enterprise design system. Seeded from the
Guidelines kit in `imagine-business-landing-pages/Guidelines/` and that repo's
live components, not forked from it.

- **Repo:** https://github.com/hamzajamal-imagineart/imagineart-landing-page — `main`, commit straight to it
- **Local:** `Claude Projects/imagineart-landing/`, sibling of the B2B repo
- **Stack:** Next.js 16.2.4 (App Router, Turbopack) · React 19 · TypeScript · Tailwind v4 · `motion` 13 · static export
- **Run:** `npm run dev` → http://localhost:3100 · **Build:** `npm run build` (exports to `out/`, passes clean)
- **Lint:** not wired. ESLint 9 needs an `eslint.config.js`; the build is the only guard.

**Working style (Hamza):** no browser previews or screenshots unless asked.
Verify with `npx next build` plus grep or DOM measurement. Keep replies short.

---

## 1. Decisions

1. **One overview page**, not a hub plus category pages.
2. **Product framing.** The primary action always goes to imagine.art; "Book a
   demo" (cal.com) is secondary. No contact form. The **hero carries the
   primary action alone**, worded "Start creating for free"; the closing band
   and footer still offer both.
3. **The page ships dark.** The light palette still exists and still works —
   one attribute flips it back (§3).
4. **Separate project** from the Guidelines kit, deployed on its own path
   (undecided, §8).
5. **References used:** Kyoso (hero layout), the ElevenLabs enterprise page
   (the earlier hero), Higgsfield's ChatGPT-skills page (Use Cases wheel),
   Figma *H-Drafts* `483:442` (tools bento), the ImagineArt product site
   (studio banners, Fashion and Ad copy), the Enterprise page (partners strip,
   integrations cluster, capabilities bento).

---

## 2. Page anatomy, in order

| Section | Component | What it is |
|---|---|---|
| Hero | `sections/Hero` | A centred column over a mosaic of work: headline "Imagine, design, animate. / edit. One platform.", the copy, one CTA. Below it a 16:9 panel holding a single clip edge to edge, with the **mode chips** floating on the footage at its head: Image · Video · Music · Workflows · Agent · Computer. Image and Video play their clips in turn, Music is a wall of track cards, and the rest loop one clip. The three modes that carry sound get a control bar above the chips. |
| Partners | `sections/Partners` | Six partner marks (ByteDance, Kling AI, MINIMAX, Wan, fal, Grok) with two captions. |
| Creative Tools `#tools` | `sections/CreativeTools` | A 13-card bento from Figma: four 308px columns, 16px gutter, split 410/190/190 or 144/144/296/190 so every column ends level at 822. Eight cards carry a photograph, five carry that tool's own clip. No icons. Title always showing, description on hover. "View all tools" at the foot. |
| Studios `#studios` | `sections/AdStudio` | Heading "Studios" + lede, then the **Ad Studio banner**: five vertical marquee columns of 9:16 ad clips (30 clips, CDN, posters, `preload="none"`) and a frosted left panel. |
| Fashion Studio `#fashion-studio` | `sections/FashionStudio` | Banner: campaign clip full-bleed, rising scrim, white wordmark, glass "Try Now". |
| Film Studio `#film-studio` | `sections/FilmStudio` | Banner: CSS marquee of 24 film thumbnails behind blurred edges and a frosted centre disc. The whole band links to the studio. |
| Studio reel `#studio-reel` | `sections/StudioReel` | The three studios as a coverflow: selected clip flat and centred, neighbours turned away and cut by the section edges, each tagged **Advertising · Fashion · Filmmaking**. The Ad card holds three verticals side by side; the other two hold one clip each. Chevrons and dots, no auto-advance. |
| Workflows `#workflows` | `sections/Workflows` | Bento, spans [2,1] / [1,1,1]: Node canvas (wide, clip), Brand Guidelines (clip), Creative Analyser (clip), Connectors as a `MarkCluster`, Plugins as a linked list. Every tile carries a gradient ground. No borders, 460px rows. |
| Agents `#agents` | `sections/Agent` | A split, deliberately not another bento: three numbered steps and a text link on the left, one clip filling the panel on the right. Stacks under 1024px. |
| Use Cases `#use-cases` | `sections/UseCases` + `UseCaseWheel` | "USE CASES" eyebrow, heading "One-click skills for every creative task". A centred vertical list of six use cases advancing every 3s, the active one in a pill with an arrow into the template gallery, four of its clips scattered either side. |
| MCP `#mcp` | `sections/Mcp` | Connect panel ported from `Vyro-ai/imagine-web-mcp-landing`: the Imagine MCP wordmark, client tabs, an MCP / CLI segment, three numbered steps with copy buttons and deep links, and the client's real connect recording. |
| Models | `sections/Models` | Eight model cards, four by two: provider sample full-bleed fading into a per-card tone. |
| Reviews `#reviews` | `ReviewsSection` | Sticky summary + auto-scrolling column of real Trustpilot five-star reviews. |
| FAQ `#faq` | `FAQSection` | Sticky heading rail + accordion, rows open by default, FAQPage JSON-LD from the same array. |
| Closing CTA | `sections/ClosingCta` | Full-bleed `cta/portal.jpg`, scrim in from the left, copy on the page grid, white + glass buttons. |

The three studio banners share one height, `--studio-band-h` in
`globals.css`, and follow each other with no rules between them. The studio
reel sits under them.

Nav is **Tools · Studios · Workflows · Agents · Use Cases · MCP · Pricing**, CTA Get
Started. **Keep the nav in the same order as the page** so no link scrolls
backwards.

`sections/Apps` is pulled, not deleted — the component and its eight-app data
are on disk; recovering it is one import and one line in `app/page.tsx`.

---

## 3. Design system

### Theme

`data-theme="dark"` is set on `<html>` in `app/layout.tsx`, and one override
block in `globals.css` keyed to `:root[data-theme="dark"]` carries the whole
theme. Two things make that reach everything: the selector outranks the
`:root` that `<PageTint>` emits (0,1,1 against 0,1,0), and Tailwind v4
compiles its utilities to `var(--color-*)`, so redefining those flips every
utility class without touching a className.

Dark is **neutral** — shades of black rather than a darkened slate. The hue is
what warms the light page against white; on black it reads as a blue cast.

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
| dwell fill on a tab | `--progress-wash` | `white/0.09` |
| heading halo / section glow / selection | `--head-glow`, `--glow-tint`, `--selection-bg` | |

Radii by name: `--radius-6` 24 for full-width bands and the hero panel,
`--radius-5` 20 for panels and bento tiles, `--radius-4` 16 for cards,
`--radius-3` 12 for media frames inside a card. Arrow discs are 28px. Buttons
are pills.

### Rules carried over from the kit

Weight ≤ 600, headings 500, monochrome with colour from imagery and real brand
marks only, one typeface (Google Sans Flex, local woff2), no em-dashes in
copy, `.container-page` 1240/32, section rhythm `py-24 md:py-32` with a
hairline at every seam. `overflow-x: auto` rails need `padding-block`
headroom; no scroll-snap on rails; `background-color` not the shorthand on
media tiles; every hand-written asset path through `withBasePath()`; assets
one directory deep under `public/media/`.

Deviations, all by request: two-tone headings on Creative Tools, Use Cases and
the closing band (`.h-muted`); Use Cases carries the page's only eyebrow;
every section lede is one short line, centred (Reviews and FAQ stay left
because they sit beside content); the studio banners, closing band and the
hero CTA's purple are surfaces beyond the kit's two.

### Headings

`.display` and `.h2` take a vertical gradient (`background-clip: text`)
falling from the heading ink to a `color-mix` of it and the page, plus a
`--head-glow` halo. They render through `components/BlurHeading`, which
carries the shapes the page uses: one clause, or a clause plus a muted second
clause.

**Headings do not animate.** `BlurHeading` used to wrap
`components/ui/blur-reveal` and reveal per character on scroll. It was pulled
because it split every heading into one `inline-block` span per character,
which cost first paint, broke `text-wrap: balance`, and baked `opacity:0` into
the static export so headings were invisible without JS. `ui/blur-reveal.tsx`
is still on disk, unused.

**The hero headline opts out of the gradient** — flat ink, weight 500, both
clauses the same. That takes three overrides, not one: `background: none`,
`-webkit-text-fill-color` and `text-shadow: none`. Setting `color` alone does
nothing (§6).

### Shared components

In use: `UseCaseWheel`, `MarkCluster`, `SiteNav`, `SiteFooter`, `Button`,
`PageTint`, `BlurHeading`, `icons.tsx`, `primitives/SectionGuides`,
`primitives/SectionGlow`, `primitives/SlidingIndicator`,
`primitives/useAutoAdvance`.

Unused, kept on disk: `ui/blur-reveal`, `Backdrop`, `RailGrid`, `MediaCard`,
`CollaborationDemo`, `primitives/SectionPattern`.

- **Tabs.** Every tab list (MCP clients, MCP route, the hero chips, the wheel)
  uses `SlidingIndicator`: one fill that travels on
  `transform`/`width`/`height`, leaving each tab nothing to animate but its
  text colour. Only the wheel walks itself, on `useAutoAdvance` (3s), drawing
  the dwell as a faint fill in `--progress-wash`.
- **Section guides.** `SectionGuides` is the Enterprise repo's version, ported
  wholesale — keep it in sync with the B2B repo rather than editing this copy.
  It diverges in one place: rule and dot colours come from `--guide-line` /
  `--guide-dot` so they survive dark. In use on Partners, Tools, Workflows,
  Studios and MCP, each `edge="top"` with `lg:border-t-0` on the section.
- **Section glow.** `SectionGlow` puts a faint pool of light at the head of
  alternate sections (Tools, Studios, Use Cases, Models, FAQ). It sits at
  `z-index: -1`, so its host needs `isolation: isolate`. **Not on the hero** —
  there it lit the middle of the section, which is where the headline is.

---

## 4. How the hero works

The most heavily iterated part of the page. Worth reading before touching it.

**Ground.** A mosaic of eighteen pieces of work, edge to edge behind the copy,
downscaled to 440px wide in `hero/mosaic/` — **568KB for the set**, against
several MB for the originals, which would have rendered at a fraction of their
size. Rebuild with `sips -Z 440` and update `MOSAIC`'s length if the set
changes. Laid out in CSS **columns**, not a grid: the tiles mix 1:1, 3:4 and
9:16, and columns let each keep its ratio and pack against its neighbours,
which is what keeps the edges ragged. It runs 130% of the section's height so
the columns are always cut off rather than running out and leaving a bald
foot. Six columns; three under 880px.

**The mosaic is sharp at rest and blurs once the page moves** (`blur(14px)`
past 24px of scroll), so the work reads as work until it is only a ground. It
carries `transform: scale(1.09)` at all times, not just when blurred: a
blurred layer samples transparent past its own edges, so without it the mosaic
haloes along every edge of the section (§6) — and applying the scale with the
blur would shift the ground as it arrived.

**Legibility over it took three things, and the obvious one mattered least.**

1. `SectionGlow` came out of the hero (above).
2. The blur, which removes hard edges from under the letterforms.
3. **The scrim's pool, which is what actually carries it.** Swept against the
   real mosaic at 1440: a pool of `64% × 48%` gave 11.2:1 behind the headline;
   `80% × 62%` gave 13.2:1 and halved the variation across the text box, while
   blurring from 9px to 24px moved the worst case by 0.3. **The pool has to be
   wider than the copy, not tighter.**

Measured per pixel across each text box at 1440, worst case: blurred, 13.2:1
behind the headline, 9.6:1 behind the copy, 17.1:1 behind the CTA; sharp at
the top of the page, 12.5:1 and 9.1:1.

**The panel grows as the page scrolls**, `0.9` → full size over half a screen.
The value is written straight to the element as a custom property from the
same passive listener that drives the blur, not held in React state, so
scrolling does not re-render the section every frame. It is a `transform`, not
a width, so nothing reflows under it, and the origin is the top so it opens
downward rather than pushing up under the copy. With no JS it stays at its
starting size — a slightly smaller panel, not a broken one. Its border is a
2px white rule at 20% inside `border-box`.

**The chip row floats on the clip, on a solid dark bar** (`rgba(10,10,11,.82)`
with a hairline), not a band under the video, which ate the bottom of the
panel. It was frosted glass first and that was worse — the backdrop blur let
the footage show through the control, which read as noise under the labels.
Its colours are fixed white and `#0b0b0c`, not tokens: they sit on footage,
not on the page, so they do not follow the theme.

**The CTA is built from a supplied SVG**, not approximated: 56 tall on a 21
radius; the fill is that SVG's radial gradient, whose rx/ry were 161.58 and
125.29 against a 255×48 button, hence 63% and 261%; the two glows are its drop
shadows, `#8A3FFC` at 15% with `stdDeviation` 6 and 12 (12px and 24px of CSS
blur); the lip is its inner shadow, offset up 4 with no blur, landing as a 4px
band inside the bottom edge. The white label measures 5.0:1 on the gradient's
mid purple. **The lip eats the bottom 4px**, so the visible face is the top
52px and a label centred on the box sits low — `padding-bottom: 4px` puts it
back.

---

## 5. Section notes worth knowing

**Tools cards wash only on hover.** At rest a card is its picture with a fade
under the copy; hover brings the wash across the whole card so the description
has a ground. The fade at rest is **not** optional: measured against the raw
pictures with none at all, twelve of thirteen titles land between 1.0:1 and
2.2:1 — white on white. With it, the worst is 9.2:1 at rest and 13.9:1 on
hover.

**The copy sits at the foot of a Tools card** (`.bt-meta` is
`position: absolute; bottom: 0`). Easy to get wrong from the markup, where it
reads as the first thing in the card — and a scrim anchored to the wrong edge
protects nothing.

**Short cards need their own scrim.** A gradient sized for a 410px card is
gone by 62% of the way up, which is above a mini card's title. A photograph on
a 144px card with the tall card's scrim measured 3.5:1. `.bt-mini`,
`.bt-short` and `.bt-fill` take a gradient that reaches their full height.
**Re-check if a brighter still goes on a short card.**

**Five Tools cards carry their tool's own clip.** Inpaint, Image Upscaler,
Video Extend and Outfit Try-on have exact footage in `capabilities/`; Outpaint
borrows `video-reframe.mp4`, the same operation from the other side. Each
keeps its tint underneath as a stand-in poster, since none of these clips has
one and the card would otherwise be black until the first frame lands.

**Every Workflows tile carries a gradient ground** from `workflows/bg/`: blue
on Node canvas, amber on Brand Guidelines, green on Creative Analyser, ember
on Connectors, violet on Plugins. The two warm ones sit diagonally, not in one
column. `.wf-tile` has `overflow: hidden` so the ground follows the radius.
Measured per pixel at 1440, the tightest is the green tile's body at 5.3:1
against the brightest pixel behind it. **A brighter image needs the scrim
raised.**

**The studio reel's ring wraps by animating the long way.** With three cards
every step moves one from one end of the ring to the other. It travels across
the stage rather than teleporting, because the selected card sits above its
neighbours (`z-index` 2 vs 1) and is wide enough to hide the journey. No
special case needed — the teleport a ring usually wants is what reads as a
glitch here.

**The reel's turn direction is easy to get backwards.** The side cards lean
*in*: for the card on the left, the inner edge sits 217px nearer the viewer
and the outer 217px further. Negating the angle gives the same geometry inside
out and looks almost right. `getBoxQuads` is unavailable in this browser —
project the corners through the element's `DOMMatrix` and the stage's
perspective instead.

**The Ad reel card holds three clips.** An ad is a vertical, and three fill a
16:9 card where one sits in a letterbox. They stream from the Ad Studio
banner's CDN and, unusually for this page, carry posters — the CDN has a
`.webp` per clip. A reel entry takes `videos` as an array, so any card can do
the same.

---

## 6. Traps already paid for

Each failed **silently**. Re-read before touching the same ground.

- **A token paired with a fixed partner.** `background: var(--ink); color:
  #fff` is white on white once `--ink` is near-white. Every such pair now takes
  `var(--page-bg)` for the label. It caught the hero and MCP buttons, the nav
  CTA, the arrow discs, the MCP copy button, and the Use Cases dwell fill,
  which was a fixed near-black at 4.5% and drew nothing at all on the dark pill
  it sits in.
- **Never point more than one `<video>` at one URL.** Five elements sharing a
  file fire five range requests in the same millisecond, none able to hit the
  cache the others are still filling, so a 1.4MB file cost 7MB — on a CDN as
  much as on the dev server. If several elements must share a file, fetch it
  once and hand every element the same object URL.
- **Measure a scrim over a photograph; do not eyeball it.** Composite the
  picture with the scrim layers at the text's real position, sample **per
  pixel**, take the worst, and look at the variation across the box as well as
  the ratio. A contrast ratio against the *mean* is not legibility — the hero's
  first attempt measured 15:1 and still read badly.
- **Logos with baked-in near-black** each need their own answer. The
  ImagineArt and Imagine MCP wordmarks ship a `-dark.svg` twin swapped by CSS,
  because a filter would invert their coloured marks too. The single-glyph MCP
  client marks take `filter: brightness(0) invert(1)` instead, because
  `grok.svg` carries a `fill="white"` inside a `<mask>` that a fill-swap would
  corrupt.
- **Never put a `var(--…)` in `PageTint`'s palette table.** Those literals are
  the source of the tokens; a self-reference emits `--tile: var(--tile)`, which
  resolves to nothing and removes every panel background.
- **`background-clip: text` paints only inside the element's own background
  box.** Descenders on the last line went unpainted until the `padding-bottom`
  / negative `margin-bottom` pair was added. A transparent text fill also means
  `::selection` must restore `-webkit-text-fill-color`, and anything overriding
  `.h-muted` — or opting out of the gradient, as the hero does — must set the
  fill as well as the colour.
- **The `0fr` → `1fr` grid reveal does not work here.** A bare `0fr` keeps an
  automatic min-content floor so it never closes; `minmax(0, 1fr)` closes but
  has no minimum to size against in an auto-height box, so it never opens. Use
  `max-height`.
- **Do not gate first paint on `requestAnimationFrame`.** It is suspended in
  background tabs, which left every tab list snapping until the tab was looked
  at. Arm from a passive effect.
- **A blurred layer samples transparent past its own edges** and haloes every
  seam unless it overhangs its host and something clips the overhang. The hero
  mosaic scales 1.09 for this; `Backdrop` clips itself.
- **`100vw` counts the vertical scrollbar.** Anything sized to fill the page
  should use `100cqw` (with `container-type: inline-size`) or it gives the
  document a horizontal scrollbar wherever a scrollbar is reserved — invisible
  on macOS overlay scrollbars.
- **A contrast checker here must resolve `oklab()`** (paint to a canvas) or it
  will misread every Tailwind alpha colour on the page.

### When measuring in a browser pane

The pane is often **backgrounded** (`document.hidden === true`), which freezes
CSS transitions mid-flight and suspends video. Readings taken then look like
bugs and are not. Disable transitions before measuring a resting state, and
expect `paused: true` on clips. Programmatic `window.scrollTo` may also be
suppressed; drive scroll-linked state by dispatching a `scroll` event instead.

---

## 7. Links, content and media

### Links (`lib/links.ts`)

Confirmed: Creative `/image`, Workflows `/workflow`, Computer
`/imagine-computer`, the three studios `/ad-studio` · `/fashion-studio` ·
`/film-studio`, Pricing `/subscription`, demo
`cal.com/team/imagineart/imagineart-customer-assist`, template gallery
`/enterprise/template` with category slugs `advertising · cinematic · fashion
· branding`, app gallery `/apps` and `/apps?category-id=` with `image 14 ·
video 23 · music 18`, plugin pages `/plugins#<app>`.

**Inferred, verify before shipping:** the Avatar studio →
`/apps/heygen-avatar`. Note `/apps/outfit-tryon`, which Fashion Studio used to
point at, returns 500.

### Content caveats

- **The bento's photographs come from Figma** and are the real thing. **Three
  descriptions do not match their titles**: VFX reads as music copy, Outpaint
  as pipeline copy, Lipsync as image copy, because the Figma frames were
  renamed without their bodies. **Fix before shipping.** Every card links to
  `/apps`, since per-tool URLs are not confirmed.
- **Hero chips.** Six modes (Hamza, 19 Sep). Five own a list of clips:
  **Image plays four in turn** and **Video three**, since no single recording
  shows what either does; Workflows, Agent and Computer loop one. Image,
  Video, Workflows and Agent are the product's own recordings under
  `hero/modes/`; Computer is `hero/computer.mp4`, no longer unused.
- **Music is not a clip at all.** A recording of the music tool shows a
  waveform moving, which says nothing about what it produced, so the mode is
  **four track cards with a chevron each side**, paged four at a time through
  sixteen tracks, each card with its own play button. One `<audio>` element
  serves every card, so starting one stops the last and only one file is ever
  in flight; switching modes unmounts it, which stops the sound. Chevrons stop
  at the ends rather than wrapping. On a phone the panel grows to 3:4 (via
  `.hero-frame:has(.hc-music)`) and the four cards wrap two by two — at 375 a
  16:9 panel is about 175px tall, shorter than one card.
  - Tracks, artwork and avatars are the product's own, from the live music
    gallery. **Artwork and avatars are local and downscaled**
    (`sips -s format jpeg -Z 440` and `-Z 48`; the originals are 1024px and
    146KB each against a card 260px wide). **The songs stream from
    `imagine.animagic.art/imagine-one/audio/music/songs/<n>.mp3`** — about
    960KB each, so sixteen local would be 15MB. That path is not in the
    gallery's markup, which plays them from JS; it was found by probing.
  - The cards clear the chip row with `padding-top` on `.hc-music`.
  - `capabilities/music.mp4`, the mode's old clip, is still in `Apps` (pulled
    from the page) and is otherwise unused.
- **Only Workflows, Agent and Computer carry an audio track**, and only those
  three get the control bar — play/pause, seek, elapsed, mute. `audio` is set
  per entry in `MODES` rather than sniffed: there is no portable way to ask a
  video whether it has sound. These three were read off the files' own `soun`
  handlers (`grep -c soun` on the moov will do it); **re-check when a clip is
  swapped**, or a silent mode gets a dead bar. Note the Music chip's clip is
  itself silent.
- **The chips sit at the head of the panel** (Hamza, 19 Sep), and the control
  bar at its foot. Both float off one inset, `--hc-float` on `.hc` — the chips
  that far from the top, the bar the same from the bottom — so they cannot
  collide however the panel is sized. The bar sat above the chips while the
  chips were at the foot. Playback always starts muted — autoplay
  with sound is blocked everywhere — and `pick()` resets that with the clip.
- **Four of the Image sources were served as `.webm` and are MP4 inside**, and
  are stored as `.mp4`. The static server sets the media type from the
  extension, and a lying one stops some browsers playing the file at all.
  `hero/creative-suite-image.webm` is now unused — it was the Image clip.
- **Agents section copy is written, not the product's own.** The three steps
  and the "Put the agent to work" link (which goes to the app home, since no
  agent URL is confirmed) are drafts.
- **Written from names alone, treat as draft:** Workflows tile bodies, the four
  second-row bento cards (Inpaint, Image Upscaler, Video Extend, Outfit
  Try-on), the studio reel's heading and lede, and its tags (Advertising,
  Fashion, Filmmaking). MCP copy and commands are the MCP repo's own. Fashion
  and Ad banner copy is the product's own, shortened.
- **Model names** are copied from the B2B repo's Workflows page. Flagged there
  as unverified: Alibaba and Lightricks inferred, Kling used as the brand, Flux
  3 filed as video. Seedance uses the `dreamina` mark.
- **Connector marks** are Simple Icons in brand colour; LinkedIn is a drawn
  lettered tile. **Plugin marks are the product's own**, from the live
  `/plugins` assets.
- **Reviews** are consumer Trustpilot five-star reviews (profile 3.9 overall).
  Selected view; no aggregate rating claim is made.
- **FAQ** reuses the B2B repo's "we never train on your content" and "full
  commercial rights" lines; "free to start" assumes a free tier.
- **Remote runtime dependencies:** MCP connect recordings, the 30 Ad Studio
  banner clips and the reel's three Ad clips stream from `cdn-imagine.vyro.ai`;
  the hero's 16 music tracks and the reel's Film clip from
  `imagine.animagic.art`; Brand Guidelines' clip from `www.imagine.art`.
  Everything else is local.

### Media

`public/media/` is ~71MB. No ffmpeg on this machine — see the B2B Guidelines
§7 for the re-encode recipe.

| File | Size | Status |
|---|---|---|
| `studios/film-studio.mp4` | 15MB | **unused** — the reel streams its film clip instead. Delete, or re-encode and use it |
| `studios/fashion/banner.mp4` | 13MB | in use; re-encode |
| `hero/showcase/*.jpg` | 2.6MB | originals behind seven of the mosaic tiles; keep |
| `hero/modes/agent.mp4` | 11MB | the hero's Agent chip; loads only when the chip is picked. Re-encode |
| `hero/modes/image/*.mp4` | 3.8MB | the Image chip's four clips; in use |
| `hero/modes/video/*.mp4` | 1.9MB | the Video chip's three clips; in use |
| `music/art/*.jpg` | 1.1MB | the Music chip's 16 covers, 440px; in use |
| `music/avatar/*.jpg` | 64KB | the Music chip's 16 avatars, 48px; in use |
| `hero/creative-suite-image.webm` | 1.4MB | **unused** since the Image chip became a playlist; delete |
| `hero/modes/workflows.mp4` | 4.7MB | the hero's Workflows chip; re-encode |
| `hero/computer.mp4` | 1.9MB | back in use as the hero's Computer chip |
| `hero/creative-suite-image.webm` | 1.4MB | the hero clip; in use |
| `hero/mosaic/*.jpg` | 568KB | the hero's ground, 18 tiles; in use |
| `hero/backdrop-veil.jpg` | 410KB | **unused** since the hero photograph was dropped; delete |
| `cta/hills.jpg` | 195KB | **unused**; delete |

Also unused: `models/*.png` icons beyond the eight on the model cards,
`pillars/chat.mp4`, `pillars/creative.mp4`, and the six `models/providers/*`
backdrops not on cards. **Clips are reused across sections on purpose**, so
replacing one changes every card that shows it.

---

## 8. Open items

1. **Fix the three mismatched bento descriptions** (§7) and give the cards
   per-tool links.
2. Re-encode `hero/modes/agent.mp4` (11MB) and `workflows.mp4` (4.7MB).
3. Confirm the inferred Avatar URL (§7) and the flagged model names (§7).
   Confirm the Agent section's steps, and whether an agent URL exists to
   point its link at instead of the app home.
4. Confirm the studio reel's heading, lede and tags (§7).
5. Re-encode the Fashion banner clip and delete the unused media (§7).
6. **Deployment.** `next.config.ts` reads `BASE_PATH` at build time; there is
   no deploy workflow yet. Reuse the B2B repo's R2 + BunnyCDN workflow once the
   mount path is decided.
7. Wire `npm run lint` (ESLint 9 needs `eslint.config.js`).
8. **Tap targets.** 63 elements are under 40px on mobile, almost all text links
   in the nav and footer where the text is the target and spacing is adequate.
   The MCP client tabs at 36px are the closest to worth changing. A decision,
   not a defect.

---

## 9. Audits

### No-JS and crawler

Run against `out/index.html`, since the crawler and a reader without JS get
exactly that file. **The page's text is all in the static HTML**: one `<h1>`,
every section lede, all 13 bento cards with their descriptions, all six use
cases, every FAQ question and answer, every review, the whole footer. No
element carries `opacity:0` from the markup.

Two gaps were found and fixed:

- **Eight of nine use-case rows were `<button onClick>`**, so only the selected
  one was a link — one way out of the section, one URL for a crawler to follow.
  Every row is now an `<a href>`; with JS, clicking an inactive row still
  selects it instead of navigating. Page anchors went 90 → 102.
- **The mobile menu did not exist until JS opened it**, and the desktop links
  are `display:none` under 1080px, so a phone without JS got a wordmark and a
  dead burger. A `<noscript>` block now lays the same links out in flow.

Left alone on purpose: the hero panel renders only the selected mode, so the
Music wall's track names are not in the static HTML (the same trade the MCP
panel makes, and the mode strip has never rendered more than one mode); MCP
renders only the selected client's steps (the
default panel is complete and the others are the same instructions with a
different name); bento descriptions are hover-revealed but in the DOM and
forced open under `@media (hover: none)`; 89 of 95 images carry `alt=""` and
are decorative, each beside real text.

**Re-run this after any section is added or restructured.**

### Layout and contrast

Instrumented passes at 1440 and 375, walking the page so lazy media mounts:
no horizontal overflow, no broken images or videos, and no text under WCAG AA
at either width. Getting there took `--ink-3` up from `#85858a` (3.84:1 on a
tile) and the footer's column headings from `white/38` to `white/62`.

Images reported "broken" are usually `loading="lazy"` and simply below the
fold at sample time.
