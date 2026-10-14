"use client";

import { useEffect } from "react";

/**
 * Loading state for CTA buttons (Hamza, 14 Oct): the next page can take a
 * moment, so a clicked CTA swaps its label for a spinner until the browser
 * leaves. Same-tab clicks only — new-tab links and cmd/ctrl/shift clicks keep
 * this page as it is. Cleared when the page comes back from the back/forward
 * cache, and after a timeout in case the navigation never happens.
 * Every other same-tab link gets a loader of its own too (Hamza, 14 Oct):
 * its icon (a card's glass arrow, a menu chevron, a "→") turns into a small
 * spinner in the same spot, or, with no icon, a spinner follows the text.
 * All of them also start a thin bar across the top of the screen.
 * Styles: `[data-loading]`, `.link-spinner` and `.nav-progress` in globals.css.
 */
const CTA = [
  ".nav-cta", ".nav-signin", ".mm-card-cta",
  ".hx1-btn", ".oc-cta", ".st-cta", ".sec-cta",
  ".astra-cta", ".mcp-btn", ".hs-cta", ".hc-sales",
  "[data-cta]",
].map((s) => `a${s}`).join(", ");


/** Give up on the spinner after this long (ms) if the page hasn't changed. */
const LOADING_TIMEOUT = 10000;

export function CtaLoading() {
  useEffect(() => {
    const bar = document.createElement("div");
    bar.className = "nav-progress";
    bar.setAttribute("aria-hidden", "true");
    document.body.appendChild(bar);
    const clear = () => {
      document.querySelectorAll<HTMLElement>("[data-loading]").forEach((el) => {
        el.removeAttribute("data-loading");
        el.removeAttribute("aria-busy");
        el.style.width = el.style.transition = "";
      });
      document.querySelectorAll(".link-spinner").forEach((sp) => sp.remove());
      document.querySelectorAll<SVGElement>("[data-spin-hidden]").forEach((ic) => { ic.style.display = ""; ic.removeAttribute("data-spin-hidden"); });
      bar.classList.remove("on");
    };
    /** Swap the link's last icon for a spinner, or add one after its text. */
    const spinIn = (a: HTMLAnchorElement) => {
      if (a.querySelector(".link-spinner")) return;
      const sp = document.createElement("span");
      sp.className = "link-spinner";
      sp.setAttribute("aria-hidden", "true");
      const icons = a.querySelectorAll<SVGElement>("svg");
      const icon = icons[icons.length - 1];
      if (icon) {
        const r = icon.getBoundingClientRect();
        sp.style.width = sp.style.height = `${Math.max(10, Math.min(16, Math.round(r.width || 14)))}px`;
        icon.parentNode?.insertBefore(sp, icon);
        icon.setAttribute("data-spin-hidden", "");
        icon.style.display = "none";
      } else {
        sp.classList.add("link-spinner-after");
        a.appendChild(sp);
      }
      a.setAttribute("aria-busy", "true");
    };
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest<HTMLAnchorElement>("a[href]");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (!/^https?:$/.test(url.protocol)) return; // mailto:, tel: …
      if (url.origin === location.origin && url.pathname === location.pathname && url.search === location.search) return; // in-page jump
      bar.classList.remove("on");
      void bar.offsetWidth; // restart the animation on a second click
      bar.classList.add("on");
      if (a.matches(CTA)) {
        // The label stays and the spinner goes in front; the button grows by
        // the spinner's width with a short ease (Hamza, 14 Oct). A data
        // attribute, not a class, so a React re-render can't wipe it.
        const from = a.getBoundingClientRect().width;
        a.setAttribute("data-loading", "");
        a.setAttribute("aria-busy", "true");
        const to = a.getBoundingClientRect().width;
        a.style.width = `${from}px`;
        void a.offsetWidth;
        a.style.transition = "width 0.25s cubic-bezier(0.22, 1, 0.36, 1)";
        a.style.width = `${to}px`;
      } else {
        spinIn(a);
      }
      window.setTimeout(clear, LOADING_TIMEOUT);
    };
    const onShow = (e: PageTransitionEvent) => { if (e.persisted) clear(); };
    document.addEventListener("click", onClick);
    window.addEventListener("pageshow", onShow);
    return () => { document.removeEventListener("click", onClick); window.removeEventListener("pageshow", onShow); bar.remove(); };
  }, []);
  return null;
}
