# ImagineArt landing page — context for a new chat

_Snapshot: 6 Oct 2026. Paste this into a new chat to pick up where we left off._

## Project

- **What:** one-page enterprise/B2B overview for ImagineArt (www.imagine.art).
- **Local:** `~/Documents/Claude Projects/imagineart-landing`
- **Repo:** github.com/hamzajamal-imagineart/imagineart-landing-page, branch `main`.
- **Stack:** Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind v4, static export.
- **Run:** `npm run dev` → http://localhost:3100. **Build:** `npx next build` (the only guard; no lint wired).

## How Hamza works

- **Pushing:** don't commit or push until he says so. When he does, commit straight to `main` (no branches or PRs).
- **HANDOFF.md:** don't rewrite it until he asks. It's currently stale in places: it still says corners are sharp and describes older hero designs.
- **Verification:** verify with the build plus DOM measurement, and screenshot only when he asks ("see by yourself").
- **Replies:** short.
- **Copy and claims:** no invented claims or brands on the page. Use unbranded imagery, and leave placeholders for unconfirmed facts.

## Shared kit (nav and footer)

- **Source:** `SiteNav`, `SiteFooter`, `lib/nav-menu.ts` and `lib/theme.ts` are copied from the central kit, github.com/hamzajamal-imagineart/guidelines-for-landing-page (`template/`, last pulled at `b2d1c03`). Edit them in the kit, not here.
- **Usage here:** the page uses `<SiteNav variant="onDark" theme="dark" />`.
- **One local change not yet in the kit:** in `SiteNav.tsx` the default (unscrolled) bar has no backdrop blur. Fold it back into the kit.

## Theme and design switches

- **Dark mode (current):** three switches.
  - `<html data-theme="dark">` in `app/layout.tsx`
  - `HERO_THEME = "dark"` in `lib/theme.ts`
  - the nav props `onDark` / `dark`
  - For light mode, flip all three. Light-only fixes are scoped `:root:not([data-theme="dark"])`.
- **Palette:** `<PageTint palette="neutral" />`, white and neutral greys for light mode, no slate or blue tint. The dark tokens live in `globals.css` under `:root[data-theme="dark"]`.
- **Corners:** one switch, `--corner` in the first `:root` block of `globals.css` (`1` = rounded, now; `0` = sharp). Every radius is either a `--radius-*` token or `calc(Npx * var(--corner))`. The kit's nav and footer aren't tied to it.
- **Headings:** `.h2` stays on one line from 880px with `width: max-content`, so the gradient fill covers the whole line. Centred wrappers (`.text-center:has(> .h2)`) use a column flexbox so oversized headings stay centred.

## Page order (`app/page.tsx`)

Hero (with platform strip) · Partners · Suite · Outcomes · Industries · Use Cases · Workflows · Models · Security · Reviews · FAQ · Closing CTA.
Removed from the page but kept on disk: AdStudio / FashionStudio / FilmStudio (Studios), Agent, CreativeTools, Apps, StudioReel, Mcp (section).

## Sections

- **Hero (`sections/Hero.tsx`):** a TwelveLabs-style tunnel (studied live on twelvelabs.io).
  - **Copy:** a two-line heading, "Generate, animate, and edit / at scale. One Canvas" (second line muted, size `clamp(24px, 3.25vw, 52px)` so it always fits on two lines), the B2B paragraph, and the purple "Start creating for free" button (radial gradient with a 4px lip). The text sits on a soft pool of the page colour.
  - **Tunnel:** about 16 straight rows (22 ring positions, minus those within 28° of vertical) on a wide oval ring around a vanishing point behind the headline, 13 cards per row. Cards are rounded 16:9 billboards that slide along their row toward the camera.
  - **Motion:** keyframes are generated in code: the scale grows geometrically (`s = S0·(S1/S0)^t`, depth `z = P − P/s`), which keeps an even gap between cards. Far cards are darkened and blurred. The trip is `TRIP = 52s`; density and size are set by `PER_RAY`, `ROWS` and `w`.
  - **Extras:** the pointer drifts the vanishing point (`CorridorDrift.tsx`); halftone dot fields sit on the edges; reduced motion freezes everything.
  - **Images:** the ten industry images (`media/hero/corridor/`), the Outcomes and Suite stills, and the best mosaic tiles (`m8` and `m10` are gradients and excluded).
- **Platform strip (`sections/Platform.tsx`), under the hero:**
  - **Tabs:** Creative Suite · Agents · MCP (NEW tag) · Plugins, minimal (dot glyph, soft fill on the active tab only), above a single-border container.
  - **Creative Suite:** plays one video, `https://imagine.animagic.art/imagine-one/home/campaigns/gpt-2.5.mp4`.
  - **Other tabs:** Agents is a clip; MCP is the full connect panel; Plugins is a hub of six app tiles wired to the ImagineArt mark.
- **Suite ("Everything your team needs to create"):** Figma 647:239 layout: heading plus round pagers, then a rail of 320px cards with a 433px image and text underneath. Nine ImagineArt-generated stills (`media/suite/*.jpg`).
- **Outcomes ("From product shot to viral phenomenon"):** Figma 644:4317 layout: three tall cards and one wide. Four ImagineArt-generated images (`media/outcomes/*.jpg`).
- **Industries:** ten MediaCards, copied from the Enterprise page.
- **Workflows:** flat `--tile` tiles, no gradient grounds.
- **Security:** a two-line heading and six flat tiles three across (line icon, title, one line). "Full audit trail" is folded into "Admin controls".
- **Reviews:** a five-card bento of real Trustpilot five-star reviews. The featured card (Uzair Khan) uses a generated, unbranded personal-care still (`media/reviews/featured.jpg`).

## Generated imagery (Imagine MCP)

- **Setup:** ImagineArt MCP, Nano Banana Pro, 2K, workspace **ImagineArt (Official)**.
- **Prompting:** always "no text, no logos". Check each image for brand marks: one football boot was regenerated because it had a swoosh-like mark.
- **Processing:** convert to JPEG (`sips -s format jpeg -s formatOptions 78 -Z 1000`).
- **Unilever:** Hamza asked for "a Unilever brand" image for the review card. I made an unbranded personal-care shot instead, because a real brand next to a review implies an endorsement. Use the real brand only if it's a confirmed client with approval.

## State and open items

- **Last push:** `d43f71d`. Everything since is uncommitted:
  - the tunnel hero
  - the single-border container and the Creative Suite video
  - the new review image
  - the nav blur removal
  - the Hero comments and HANDOFF edits
- **`BRAND-PROMPTS.md`:** untracked and not created by Claude. Don't commit it.
- **HANDOFF.md:** needs a refresh once Hamza says so (corner switch now on, current hero, dark mode, current section list).
- **Copy for messaging review:** the hero headline, paragraph and the Suite/Outcomes lines.
- **Deployment:** still not wired (`BASE_PATH` is read at build time; there's no workflow).
- **Lint:** `npm run lint` is unwired (ESLint 9 needs `eslint.config.js`).
- **Media weight:** `public/media` is large, with many orphaned clips from removed sections; worth a cleanup pass before deploy.
