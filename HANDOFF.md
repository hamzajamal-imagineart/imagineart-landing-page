# ImagineArt Landing Page Handoff

One product overview page for **ImagineArt** (www.imagine.art), built as a
separate project on the ImagineArt Enterprise design system. Seeded from the
Guidelines kit in `imagine-business-landing-pages/Guidelines/` and its live
components, not forked from that repo.

- **Location:** `Claude Projects/imagineart-landing/` (sibling of the B2B repo)
- **Stack:** Next.js 16.2.4 (App Router, Turbopack) · React 19 · TypeScript · Tailwind v4
- **Run:** `npm run dev` → http://localhost:3100 · **Build:** `npm run build` (static export to `out/`, passes clean)
- **Git:** not initialised yet. `node_modules` was copied from the B2B repo with its lockfile, so `npm ci` reproduces it.
- **Preview:** the parent `Claude Projects/.claude/launch.json` has an `imagineart-landing` entry.

## 1. Decisions (made with Hamza, 16 Sep 2026)

1. **One overview page**, not a hub plus category pages.
2. **Product framing.** Every primary action is "Get Started" → imagine.art. No contact form, no HubSpot.
3. **Separate project** from the Guidelines kit, deployed on its own path.

## 2. Page anatomy (in order)

| Section | Component | Pattern |
|---|---|---|
| Hero | `sections/Hero` | **ElevenLabs pattern, pared down** (Hamza, 16 Sep): headline left, copy right, Get Started + See Plans pills; a framed panel with a Creative · Workflows · Computer tab bar (no icons) and one 16:9 clip per tab, nothing else. Clips are placeholders |
| Partners | `sections/Partners` | Ported from the Enterprise page: six partner marks (ByteDance, Kling AI, MINIMAX, Wan, fal, Grok) with two captions, SVGs painted via CSS mask so Kling keeps its gradient |
| Creative Tools `#tools` | `sections/CreativeTools` | **Z-fold**: Image, Video, Music and Audio, alternating clip and copy, three points and an Open link each. The page's only Z-fold. `RailGrid` is now unused, kept on disk |
| Workflows `#workflows` | `sections/Workflows` | **Bento**, spans [2,1] / [1,1,1] like the Enterprise Capabilities: Node Canvas wide with the pipeline clip; Scheduling with a clip; Creative Analyser with a drawn bar chart; Connectors and Plugins as mark clusters. Replaced the separate Workflows, Connectors and Plugins sections |
| Apps `#apps` | `sections/Apps` | Horizontal card rail with chevrons, the Enterprise suite-rail pattern: dark cards, glass arrow, 16:9 clip at the foot |
| MCP `#mcp` | `sections/Mcp` | **Connect panel ported from `Vyro-ai/imagine-web-mcp-landing`** (16 Sep): client tabs (Claude, ChatGPT, Cursor, Hermes, OpenClaw, Grok) + MCP/CLI toggle; three numbered steps per client with copy fields, prompt blocks and deep links; the client's real connect recording streamed from the Imagine CDN (ChatGPT has none, gets a placeholder); CLI route shows a static terminal transcript. URLs, commands and prompts are the source repo's verbatim; restyled to this page, no orange |
| Studios `#studios` | `sections/AdStudio` + `FashionStudio` + `FilmStudio` | One heading ("Studios" + a one-line lede, in AdStudio) over three banners that follow with no rules between them. Ad: The product's own banner: a 400px dark band of five vertical CSS marquee columns of 9:16 ad clips (30 clips, streamed from the Imagine CDN with posters, `preload="none"`), and a frosted left panel with "ImagineArt presents", the white Ad Studio wordmark, "Ship your next ad in 1 minute." and a glass "Try Ad Studio" button. The Studios chat/result stack was removed once Avatar went (16 Sep) |
| Fashion Studio `#fashion-studio` | `sections/FashionStudio` | Banner: the campaign clip full-bleed (`fashion/banner.mp4`, 1.6MB), a rising dark scrim, white wordmark, headline "AI Fashion for Catalog and Editorial Shoots", glass "Try Now" button, paragraph on the right behind a hairline. Copy is the product's own. Replaced the two-card collage and its assets |
| Film Studio `#film-studio` | `sections/FilmStudio` | The product's own banner: a dark band with a CSS marquee of 24 film thumbnails behind blurred edges and a frosted centre disc, "ImagineArt presents", the Film Studio logo (webp from the CDN) and a "See studio in action" pill; the whole band links to the studio. A third dark surface on the page, by request. |
| Use cases `#use-cases` | `sections/UseCases` | The same **rail-and-cards** layout as Capabilities (`components/RailGrid`): nine use-case groups in the rail, 3 to 4 template/example cards each, every card a link into the template gallery. "Browse all templates" is a ghost button in the header |
| Models `#models` | `sections/Models` | **Eight model cards, four by two**: one model per card, the provider's sample output full-bleed, fading into a per-card tone at the foot, one centred caption of provider mark + model name. Nothing else on the card. Two columns under 760px |
| Reviews `#reviews` | `ReviewsSection` | Sticky summary + auto-scrolling column of real Trustpilot five-star reviews |
| FAQ `#faq` | `FAQSection` | Sticky heading rail + accordion, rows open by default, FAQPage JSON-LD derived from the same array |
| Closing CTA | `sections/ClosingCta` | Un-boxed band, hills photograph faded in from the bottom, Get Started + See Plans |

Nav is **Tools · Workflows · Studios · Use Cases · FAQ · Pricing** (MCP has an anchor but no nav item). The Platform/Pillars section was removed on 16 Sep: the hero tabs cover it., CTA Get Started.

## 3. Design system

Page palette is **slate** via `components/PageTint.tsx` (one hue used five ways:
wash, heading ink, muted clause, tile, panel). Rules carried over unchanged:
weight ≤ 600, headings 500, monochrome with colour from imagery and real brand
marks only, one typeface (Google Sans Flex, local woff2), no em-dashes in copy,
hover in CSS only, `.container-page` 1240/32, section rhythm `py-24 md:py-32`
with a plain hairline at every seam. The kit's `SectionGuides` (container-edge
rules and corner dots) were removed from every section on 16 Sep at Hamza's
request; the component is kept on disk, unused.

Hamza's layout calls (16 Sep): Studios as stacked footage walls with a "View
all of …" button each (reference: Higgsfield's Marketing Studio); Capabilities
and Use cases both on the sidebar rail plus example-card grid (reference:
Higgsfield's ChatGPT skills page); MCP pulled out of the rail into its own
section.
That layout is one shared client component, `components/RailGrid.tsx`
(WAI-ARIA tabs, every group's grid in the HTML, inactive clips
`preload="none"` until selected, cards with `href` render as links). Icons
live in `components/icons.tsx`. The page has no Z-fold.

Ported verbatim or near-verbatim from the B2B repo: `MediaCard`,
`CollaborationDemo` (now unused after the canvas panel was removed on 16 Sep; kept on disk), `SectionGuides`, `SiteNav`, `SiteFooter`, `Button`,
`PageTint`, the grain palettes, `.glass`, the type scale, the review section.
`globals.css` is the merged design system; the kit's hero-photo scrim rules
were dropped because the hero here is the banner-film pattern.

Decisions inherited from the B2B handoff that still apply here: render
`MediaCardStyles` once per section; rails need `padding-block` headroom because
`overflow-x: auto` coerces `overflow-y`; no scroll-snap on rails; `background-color`
not the shorthand on tiles with media; every hand-written asset path goes
through `withBasePath()`; assets live one directory deep under `public/media/`.

## 4. Links (`lib/links.ts`)

Confirmed against the B2B repo's footer: Chat `/imagine-computer/ai-chat`,
Workflows `/workflow`, Creative `/image`, Film Studio `/ai-film-studio`,
Pricing `/subscription`, template gallery `/enterprise/template` with confirmed
category slugs `advertising · cinematic · fashion · branding`.

**Inferred, verify before shipping:** Ad Studio → `/ai-image-generator`,
Avatar Studio → `/apps/heygen-avatar`, Fashion Studio → `/apps/outfit-tryon`.
Use cases without a confirmed category go to the gallery unfiltered.

## 5. Content caveats

- **Capabilities was split on 16 Sep** into Creative Tools, Workflows, Connectors,
  Plugins and Apps. Connector and plugin marks are Simple Icons in ink
  (`public/media/connectors`, `public/media/plugins`); LinkedIn and the three
  Adobe marks are not in that set, so they are drawn lettered tiles. Plugin
  and connector detail is now just the mark clusters in the Workflows bento. App hrefs other than image-upscaler and
  heygen-avatar are inferred slugs.

- **Model names and descriptors** are copied from the B2B repo's Workflows
  page, which took them from the product's model pickers. That repo flags
  some as unverified: Alibaba and Lightricks are inferred from descriptors,
  Kling is the brand rather than Kuaishou, Flux 3 is filed as video on its
  descriptor alone, and prefixes were dropped where the card already says the
  provider. Alibaba's "#1-ranked" claim was dropped here. Backdrops live in
  `public/media/models/providers/` (one file per provider, eight of the
  fourteen used); marks are `public/media/models/*.png`. **Seedance uses the
  `dreamina` mark** because there is no ByteDance icon in the pack; confirm
  that is acceptable or supply a ByteDance mark. Per-card `tone` values were
  eyeballed from each backdrop for the fade; adjust if a clip is replaced.
- **Studio chat transcripts, briefs and chips** and the **capability example
  cards** were written from the feature names alone. The MCP panel's facts
  come from the MCP repo's `PRODUCT.md` and `lib/data/connect.tsx`; its
  recordings are remote (`cdn-imagine.vyro.ai/imagine-one/imagine-mcp/connect/`),
  the one runtime third-party dependency on the page. Cards for
  Connectors, MCP, Plugin, Scheduling and Creative Analyser have no footage
  and render as titled tiles; drop a clip into `public/media/capabilities/`
  and add `video` to the card. Clips are reused across Capabilities and Use cases
  (`ugc`, `upscale`, `sketch-to-render`, the studio films), which is
  deliberate and noted at both call sites: replacing one changes every card
  that shows it.
- **Reviews** are consumer Trustpilot five-star reviews (profile scores 3.9
  overall). Selected view; the section makes no aggregate rating claim.
- **FAQ** reuses the B2B repo's "we never train on your content" and "full
  commercial rights" lines. The "free to start" answer assumes a free tier.
- **Hero carousel clips** are reused from other sections and are placeholders
  for real product footage per feature. `public/media/hero/hero.mp4` (5.6MB)
  is no longer referenced and can be deleted. The Pillars section was removed for that reason.

## 6. Media

**`studios/film-studio.mp4` is 15.5MB**, downloaded as supplied (no ffmpeg on
this machine to re-encode). Re-encode to ~2MB before shipping; see the B2B
Guidelines §7 for the ffmpeg recipe.

`public/media/` is ~40MB, all re-encoded clips copied from the B2B repo and
renamed to their role here (`studios/ad-studio.mp4`, `use-cases/avatars.mp4`,
…). Nothing is shared with another section, so any file can be replaced in
place. Card videos use `preload="metadata"` except the first few per section.

## 7. Verified

- `npx next build` passes; export root contains only Next's own files.
- Every asset request 200s; all 19 videos reach `readyState 4`.
- Checked at 1440 and 390: no horizontal overflow, sections stack, pillar
  visual moves above its copy on narrow screens, nav collapses to the burger
  below 1080.
- Tabs switch and pause inactive footage.

**Not verifiable in the in-app preview pane:** video autoplay (the pane blocks
it; frames were confirmed by sampling pixels via canvas) and the hero
scroll-zoom. Open in a real browser above 1280px before shipping.

## 8. Open items

1. Confirm the three inferred studio URLs (§4) and the model names flagged in §5.
2. Replace placeholder footage: hero film, three pillar clips.
3. `npm run lint` is not wired (ESLint 9 needs `eslint.config.js`); the build is the only guard.
4. Deployment: `next.config.ts` reads `BASE_PATH` at build time. Decide the mount path and reuse the B2B repo's R2 + BunnyCDN workflow.
5. Initialise git when ready; nothing is committed.
