import type { Metadata } from "next";
import { PageTint } from "@/components/PageTint";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteFooterPrevious } from "@/components/SiteFooterPrevious";

/**
 * /footer-1 (Hamza, 8 Oct): the two footers one above the other, to compare.
 * Top: the one the site uses now (from the Business landing pages). Bottom:
 * the one it replaced (from the "Footer" spec). Dark, like the home page.
 * Not indexed.
 */
export const metadata: Metadata = {
  title: "Footers — ImagineArt",
  robots: { index: false, follow: false },
};

function Label({ children }: { children: string }) {
  return (
    <p style={{ maxWidth: 1240, margin: "0 auto", padding: "56px 32px 20px", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>
      {children}
    </p>
  );
}

export default function FootersPage() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: "document.documentElement.setAttribute('data-theme','dark')" }} />
      <PageTint palette="neutral" />
      <main>
        <Label>A · Current: Business landing pages footer</Label>
        <SiteFooter />
        <Label>B · Previous: Footer spec</Label>
        <SiteFooterPrevious />
      </main>
    </>
  );
}
