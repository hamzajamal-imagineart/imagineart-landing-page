/**
 * Site-wide navigation: the top-level items and every dropdown panel.
 *
 * Shared by all landing pages. SiteNav renders it as a mega-menu on desktop
 * and as an accordion in the mobile sheet, so edit copy and links here, not
 * in the component. Layout: Figma H-Drafts 564:5535. Items and links: the
 * "Header" spec PDF (Oct 2026).
 *
 * Image paths are pre-basePath (SiteNav runs them through withBasePath) and
 * live under /media/nav/, copied from the kit's assets/nav/.
 */

const IA = "https://www.imagine.art";

// Primary actions in the bar and at the foot of the mobile sheet.
export const NAV_HOME = IA;
// /login 404s; the site opens its sign-in dialog from this query instead.
export const NAV_SIGN_IN = `${IA}/?showAuth=true`; // TODO: confirm
export const NAV_CTA = { label: "Try it free", href: IA };

export type NavItem = {
  title: string;
  description?: string;
  /** Omit for a page that isn't live yet: the item renders unlinked. */
  href?: string;
  badge?: string;
  /** Several destinations under one item (e.g. Integrations: MCP, Plugins).
   *  The item itself then isn't a link; these render under the description. */
  links?: NavLink[];
};

export type NavLink = { label: string; href: string };

/** One heading and what sits under it: rich items, or a plain link list. */
export type NavGroup = {
  heading?: string;
  items?: NavItem[];
  links?: NavLink[];
  /** "All …" link closing a plain link list. */
  more?: NavLink;
};

export type NavColumn = {
  groups: NavGroup[];
  /** "wide" for rich items (247px), "narrow" for plain link lists (196px). */
  width?: "wide" | "narrow";
  /** Hairline on the column's right edge (Business). */
  divider?: boolean;
};

export type NavCardMedia =
  | { kind: "image"; src: string }
  /** Three portraits fanned out; [left, right, front]. */
  | { kind: "fan"; srcs: [string, string, string] }
  /** Two images side by side in a framed window. */
  | { kind: "split"; srcs: [string, string] };

export type NavCard =
  /** A bare image tile, as tall as the panel's content. */
  | { kind: "tile"; src: string; alt: string; href: string }
  | {
      kind: "card";
      title: string;
      body: string;
      badge?: string;
      cta: NavLink;
      media: NavCardMedia;
      /** "tint" = soft accent surface, "muted" = grey, default white. */
      surface?: "tint" | "muted";
    };

/** A link in a panel's bottom bar: a label, a stack of small marks before it
 *  (image paths, or a built-in "chrome" / "phone" glyph), and an outbound arrow. */
export type NavBarLink = { label: string; href?: string; marks: string[] };
/** A full-width strip along the foot of a panel (Platform: where else Imagine runs). */
export type NavBar = { title: string; links: NavBarLink[] };

export type NavPanel = { columns: NavColumn[]; cards?: NavCard[]; bar?: NavBar };

export type NavEntry = { label: string; href?: string; panel?: NavPanel };

// Every href below is from the spec and returned 200 on 5 Oct 2026.
// Items without an href are pages that aren't live yet ("Soon").
export const NAV: NavEntry[] = [
  {
    label: "Platform",
    panel: {
      columns: [
        {
          groups: [
            {
              heading: "Create",
              items: [
                { title: "Image", description: "Images from text, top models", href: `${IA}/ai-image-generator` },
                { title: "Video", description: "Prompts and images into video", href: `${IA}/ai-video-generator` },
                { title: "Music", description: "Songs and tracks from a prompt", href: `${IA}/audio/music/elevenlabs-music?filter-assets=audio` },
                { title: "AI Tools", badge: "Soon" }, // TODO: link when the page is live
              ],
            },
          ],
        },
        {
          groups: [
            {
              heading: "Build",
              items: [
                { title: "Creative Agent", description: "An agent that plans and creates", href: `${IA}/imagine-computer` },
                { title: "Workflows", description: "Repeatable model pipelines", href: `${IA}/business/workflows` },
              ],
            },
          ],
        },
        {
          groups: [
            {
              heading: "Studios",
              items: [
                { title: "Audio Studio", description: "Music, voice and sound effects", href: `${IA}/audio-studio` },
                { title: "Film Studio", description: "Scenes and shots for short films", href: `${IA}/ai-film-studio` },
                { title: "Ad Studio", description: "Ad creatives for every channel", href: `${IA}/ai-ad-studio` },
                { title: "Fashion Studio", description: "Campaign and catalogue imagery", href: `${IA}/ai-fashion-studio` },
              ],
            },
          ],
        },
      ],
      // Integrations moved out of the Build column into this bar (Hamza, 8 Oct).
      bar: {
        title: "Use ImagineArt everywhere you create",
        links: [
          { label: "MCP", href: `${IA}/mcp`, marks: ["/media/mcp/clients/claude.svg", "/media/mcp/clients/chatgpt.svg"] },
          { label: "Plugins", href: `${IA}/plugins`, marks: ["/media/plugins/aftereffects.svg", "/media/plugins/figma.svg"] },
          { label: "Extensions", marks: ["chrome"] }, // TODO: Chrome extension URL
          { label: "Mobile", href: "https://apps.apple.com/us/app/imagineart-ai-video-generator/id1664121419", marks: ["phone"] },
        ],
      },
      cards: [
        {
          kind: "card",
          surface: "tint",
          title: "AI Models",
          body: "GPT Image 2.5, Runway Gen 4.5, Kling 4 and 50+ more, in one place.",
          cta: { label: "Explore Models", href: `${IA}/` },
          media: { kind: "image", src: "/media/nav/platform-teams.jpg" },
        },
      ],
    },
  },
  {
    label: "Business",
    panel: {
      columns: [
        {
          groups: [
            {
              heading: "Business",
              items: [
                { title: "Enterprise", description: "Security and control at scale", href: `${IA}/business` },
                { title: "Solutions", description: "For marketing, sales and agencies", href: `${IA}/business/solutions` },
                { title: "Case Studies", description: "Results from real teams", href: `${IA}/business/case-studies` },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    label: "Resources",
    panel: {
      columns: [
        {
          groups: [
            {
              heading: "Resources",
              items: [
                { title: "Blog", description: "Tutorials, tips and AI trends", href: `${IA}/insights` },
                { title: "Announcements", description: "Launches and product updates", href: `${IA}/announcements` },
                // Same page as Business > Case Studies, cross-listed.
                { title: "Case Studies", description: "Results from real teams", href: `${IA}/business/case-studies` },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    label: "Collaborate",
    panel: {
      columns: [
        {
          groups: [
            {
              heading: "Collaborate",
              items: [
                { title: "Creators Program", description: "Get rewarded for your work", href: `${IA}/creators-program` },
                { title: "Affiliate Program", description: "Earn by referring creators", href: `${IA}/affiliate-program` },
              ],
            },
          ],
        },
      ],
    },
  },
  // Individuals, Teams and Enterprise are sections of this one page.
  // TODO: make it a dropdown once the section anchors are known.
  { label: "Pricing", href: `${IA}/subscription` },
];
