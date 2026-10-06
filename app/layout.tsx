import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import { withBasePath } from "@/lib/assets";

// Google Sans Flex is the only typeface. Variable font, weights 100 to 900,
// of which the page uses 400, 500 and 600 only.
const googleSans = localFont({
  src: "./fonts/google-sans-flex.woff2",
  variable: "--font-google-sans",
  display: "swap",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "ImagineArt, The AI Creative Platform",
  description:
    "Chat, Workflows and Creative in one platform: 50+ image, video and audio models, an infinite canvas with realtime collaboration, and studios for ads, avatars, fashion and film.",
  // Next emits app/favicon.ico at the export root, which a sub-path mount
  // cannot serve. Point at a nested copy instead. Same icon set as
  // www.imagine.art, so the tab matches the main site.
  icons: {
    icon: [
      { url: withBasePath("/media/favicon/favicon.ico"), sizes: "48x48", type: "image/x-icon" },
      { url: withBasePath("/media/favicon/icon0.svg"), sizes: "any", type: "image/svg+xml" },
      { url: withBasePath("/media/favicon/icon1.png"), sizes: "96x96", type: "image/png" },
    ],
    apple: [{ url: withBasePath("/media/favicon/apple-icon.png"), sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // The page ships dark. The light palette is still defined in globals.css
    // and still correct, so this attribute is the only thing to change back.
    <html lang="en" data-theme="dark" className={googleSans.variable}>
      <body>{children}</body>
    </html>
  );
}
