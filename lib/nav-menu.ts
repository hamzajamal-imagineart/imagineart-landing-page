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
/** Sign in, Try it free and the logo all open the app's auth (Hamza, 12 Oct). */
export const NAV_AUTH = "https://imagine.art/home?showAuth=true";
export const NAV_SIGN_IN = NAV_AUTH;
/** Secondary nav action: "Book a demo", the same booking page as the hero's Contact sales (Hamza, 12 Oct; was Sign in). */
export const NAV_DEMO = { label: "Book a demo", href: "https://cal.com/team/imagineart/imagineart-customer-assist" };
export const NAV_CTA = { label: "Try it free", href: NAV_AUTH };

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
  /** Keep the heading's space but hide it: the second column of a group that spans two (14 Oct). */
  headingHidden?: boolean;
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
      /** Optional: the AI Models card is logos and a link only (14 Oct). */
      title?: string;
      body?: string;
      badge?: string;
      cta: NavLink;
      media: NavCardMedia;
      /** "tint" = soft accent surface, "muted" = grey, default white. */
      surface?: "tint" | "muted";
    };

/** A link in a panel's bottom bar: a label, a stack of small marks before it
 *  (image paths, or a built-in "chrome", "apple" or "android" glyph), and an outbound arrow. */
export type NavBarLink = { label: string; href?: string; marks: string[] };
/** A full-width strip along the foot of a panel (Platform: where else Imagine runs). */
export type NavBar = { title: string; links: NavBarLink[] };

export type NavPanel = { columns: NavColumn[]; cards?: NavCard[]; bar?: NavBar };

export type NavEntry = { label: string; href?: string; panel?: NavPanel };

// Every href below is from the "updated navbar" spec and returned 200 on 14 Oct 2026.
// Items without an href are pages that aren't live yet ("Soon").
export const NAV: NavEntry[] = [
  {
    label: "Platform",
    panel: {
      // Platform (was Build) leads; Create and AI Tools merged into one
      // "AI Tools" group across two balanced columns (Hamza, 14 Oct).
      columns: [
        {
          divider: true, // hairline between Product and the rest (Hamza, 14 Oct)
          groups: [
            {
              heading: "Product", // was "Platform", which repeated the menu's own name (14 Oct)
              items: [
                { title: "Creative Agent", description: "An agent that plans and creates", href: `${IA}/imagine-computer` },
                { title: "Workflows", description: "Canvas for content at scale", href: `${IA}/business/workflows` },
                // Integrations as two rows of their own (Hamza, 14 Oct).
                { title: "MCP", description: "Connect Claude, ChatGPT, Grok", href: `${IA}/mcp` },
                { title: "Plugins", description: "Use in Photoshop, Figma, After Effects", href: `${IA}/plugins` },
              ],
            },
          ],
        },
        {
          groups: [
            {
              heading: "Studios",
              items: [
                // Fashion, Ad, Film: the same order as the hero's Studios tab and the footer (14 Oct).
                { title: "Fashion Studio", description: "Campaign and catalogue imagery", href: `${IA}/ai-fashion-studio` },
                { title: "Ad Studio", description: "Create ads that convert", href: `${IA}/ai-ad-studio` },
                { title: "Film Studio", description: "Bring your stories to life", href: `${IA}/ai-film-studio` },
                // Not live yet: shown with a Soon badge, not linked (Hamza, 14 Oct). One-liner written by Claude.
                { title: "Avatar Studio", description: "Consistent AI presenters and avatars", badge: "Soon" },
              ],
            },
          ],
        },
        {
          groups: [
            {
              heading: "AI Tools",
              items: [
                { title: "Image", description: "Generate AI images", href: `${IA}/image` },
                { title: "Video", description: "Generate AI videos", href: `${IA}/video/create/seedance-25` },
                { title: "Audio", description: "Music, voice and sound effects", href: `${IA}/audio?filter-assets=audio` },
                // Every tool opens the app, not a landing page (Hamza, 14 Oct). Titles and
                // one-liners follow the app's own tool menus where they match;
                // Audio, Camera Angles and Variate aren't in those menus, so theirs are ours.
                { title: "Camera Angles", description: "Reshoot from a new angle", href: `${IA}/apps/camera-angles` },
                { title: "AI Captions", description: "Add subtitles to videos", href: `${IA}/video/captions` }, // replaces Video Ad Maker; wording from the app's video menu (Hamza, 14 Oct)
              ],
            },
          ],
        },
        {
          // Second half of AI Tools (14 Oct): a hidden heading keeps its first
          // row level with the column beside it; five rows a side.
          groups: [
            {
              heading: "AI Tools",
              headingHidden: true,
              items: [
                { title: "Variate", description: "Fresh variations of one image", href: `${IA}/apps/variate` },
                { title: "Upscale", description: "Boost image or video quality", href: `${IA}/edit/upscale` },
                { title: "Lipsync Studio", description: "Make a photo speak your audio", href: `${IA}/lipsync-studio` },
                { title: "Video Recolor", description: "Apply a color grade to any video", href: `${IA}/apps/video-recolor?category-id=23` },
              ],
              more: { label: "All AI tools", href: `${IA}/tools` },
            },
          ],
        },
      ],
      // The shimmer bar along the panel's foot (Hamza, 8 Oct; kept 14 Oct beside Integrations in Build).
      bar: {
        title: "Use ImagineArt everywhere you create",
        links: [
          { label: "MCP", href: `${IA}/mcp`, marks: ["/media/mcp/clients/claude.svg", "/media/mcp/clients/chatgpt.svg"] },
          { label: "Plugins", href: `${IA}/plugins`, marks: ["/media/plugins/aftereffects.svg", "/media/plugins/figma.svg"] },
          { label: "Extensions", href: "https://chromewebstore.google.com/detail/imagineart/cimlkemminoobnamlheobhnghepobcff", marks: ["chrome"] },
          { label: "iOS", href: "https://apps.apple.com/us/app/imagineart-ai-video-generator/id1664121419", marks: ["apple"] },
          { label: "Android", href: "https://play.google.com/store/apps/details?id=com.vyroai.aiart&hl=en", marks: ["android"] },
        ],
      },
      cards: [
        {
          kind: "card",
          surface: "tint",
          // Logo grid, one evergreen line and a quiet link (Hamza, 14 Oct): was a
          // paper-bird illustration and a list of model versions.
          title: "AI Models",
          body: "Seedance 2.5, GPT Image 2.5, Kling 4 and 50+ more.",
          cta: { label: "Explore Models", href: `${IA}/models` },
          media: { kind: "image", src: "/media/nav/platform-teams.jpg" },
        },
      ],
    },
  },
  {
    label: "Enterprise", // was "Business" (Hamza, 14 Oct)
    panel: {
      columns: [
        {
          divider: true, // separator after Business, as in Platform (Hamza, 14 Oct)
          groups: [
            {
              heading: "Business",
              items: [
                { title: "Enterprise", description: "Security and control at scale", href: `${IA}/business` },
                { title: "Case Studies", description: "Results from real teams", href: `${IA}/business/case-studies` },
              ],
            },
          ],
        },
        // Industries in three columns of three (Hamza, 14 Oct). Lines reuse the
        // home page's Industries copy where it exists; the rest were written by
        // Claude, check before shipping.
        {
          groups: [
            {
              heading: "Solutions",
              items: [
                { title: "Fashion and Apparel", description: "Lookbooks, catalogs and films", href: `${IA}/business/industries/fashion` },
                { title: "Real Estate", description: "Listings, tours and staged rooms", href: `${IA}/business/industries/real-estate` },
                { title: "Food and Beverage", description: "Appetizing food and drink visuals", href: `${IA}/business/industries/ai-for-fb-creatives` },
              ],
            },
          ],
        },
        {
          groups: [
            {
              heading: "Solutions",
              headingHidden: true,
              items: [
                { title: "Education", description: "Course visuals and explainers", href: `${IA}/business/industries/education` },
                { title: "Automotive", description: "Launch films and ads that sell", href: `${IA}/business/industries/automotive` },
                { title: "Beauty", description: "Campaigns at the category's pace", href: `${IA}/business/industries/beauty-and-skincare` },
              ],
            },
          ],
        },
        {
          groups: [
            {
              heading: "Solutions",
              headingHidden: true,
              items: [
                { title: "Retail", description: "Promos for every store and season", href: `${IA}/business/industries/retail` },
                { title: "Ecommerce", description: "Listing-ready images and motion", href: `${IA}/business/solutions/ecommerce` },
                { title: "Interior Design", description: "Every piece in a styled room", href: `${IA}/business/industries/interior-design-ai` },
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
        {
          groups: [
            {
              heading: "Community",
              items: [
                { title: "Creators Program", description: "Get rewarded for your work", href: `${IA}/creators-program` },
                { title: "Affiliate Program", description: "Earn by referring creators", href: `${IA}/affiliate-program` },
                { title: "Ambassadors Program", description: "Represent ImagineArt", href: `${IA}/ambassadors` },
                { title: "ImagineArt Academy", description: "Courses on creating with AI", href: "https://academy.imagine.art/" },
              ],
            },
          ],
        },
      ],
    },
  },
  // A plain link, not a dropdown (Hamza, 14 Oct).
  { label: "Pricing", href: `${IA}/subscription` },
];
