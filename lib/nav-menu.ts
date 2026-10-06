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

export type NavPanel = { columns: NavColumn[]; cards?: NavCard[] };

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
                { title: "AI Image Generator", description: "Create images from text with the top models", href: `${IA}/ai-image-generator` },
                { title: "AI Video Generator", description: "Turn prompts and images into video", href: `${IA}/ai-video-generator` },
                { title: "AI Tools", description: "Editing, upscaling and effects in one place", badge: "Soon" }, // TODO: link when the page is live
              ],
            },
          ],
        },
        {
          groups: [
            {
              heading: "Build",
              items: [
                { title: "Creative Agent", description: "An AI agent that plans and makes the work", href: `${IA}/imagine-computer` },
                { title: "Workflows", description: "Chain models into repeatable pipelines", href: `${IA}/business/workflows` },
                {
                  title: "Integrations",
                  description: "Use Imagine inside the tools you already work in",
                  links: [
                    { label: "MCP", href: `${IA}/mcp` },
                    { label: "Plugins", href: `${IA}/plugins` },
                  ],
                },
              ],
            },
          ],
        },
        {
          groups: [
            {
              heading: "Studios",
              items: [
                { title: "AI Creative Studios", description: "Purpose-built studios for every format", badge: "Soon" }, // TODO: link when the page is live
              ],
              links: [
                { label: "Audio Studio", href: `${IA}/audio-studio` },
                { label: "Film Studio", href: `${IA}/ai-film-studio` },
                { label: "Ad Studio", href: `${IA}/ai-ad-studio` },
                { label: "Fashion Studio", href: `${IA}/ai-fashion-studio` },
              ],
            },
          ],
        },
      ],
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
                { title: "Enterprise", description: "Security, admin controls and support for large teams", href: `${IA}/business` },
                { title: "Solutions", description: "Built for marketing, sales, agencies and more", href: `${IA}/business/solutions` },
                { title: "Case Studies", description: "How teams make more creative with Imagine", href: `${IA}/business/case-studies` },
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
                { title: "Blog", description: "Tutorials, creative tips and AI trends", href: `${IA}/insights` },
                { title: "Announcements", description: "Launches, new models and product updates", href: `${IA}/announcements` },
                // Same page as Business > Case Studies, cross-listed.
                { title: "Case Studies", description: "How teams make more creative with Imagine", href: `${IA}/business/case-studies` },
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
                { title: "Creators Program", description: "Create, share and get rewarded for your work", href: `${IA}/creators-program` },
                { title: "Affiliate Program", description: "Earn by bringing new creators to Imagine", href: `${IA}/affiliate-program` },
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
