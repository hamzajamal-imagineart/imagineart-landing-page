import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { PageTint } from "@/components/PageTint";
import { HeroMosaic } from "@/components/sections/HeroMosaic";

/**
 * /hero-5 (Hamza, 7 Oct): an editorial hero, a band of use-case stills
 * that flip over every two seconds above a large headline. Dark (Hamza,
 * 7 Oct), so the nav is `onDark`. Parked for comparison; not indexed.
 */
export const metadata: Metadata = {
  title: "Hero 5 — ImagineArt",
  robots: { index: false, follow: false },
};

export default function HeroFivePage() {
  return (
    <>
      <PageTint palette="neutral" />
      <SiteNav variant="onDark" theme="light" />
      <main>
        <HeroMosaic />
      </main>
      <SiteFooter />
    </>
  );
}
