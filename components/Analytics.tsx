"use client";

import { useEffect } from "react";
import Script from "next/script";

import { GTM_ID, trackSessionStarted } from "@/lib/analytics";

/** Loads GTM and fires session_started once per browser (see lib/analytics.ts). */
export function Analytics() {
  useEffect(trackSessionStarted, []);
  return (
    <Script id="gtm" strategy="afterInteractive">
      {`window.dataLayer=window.dataLayer||[];window.dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=document.getElementsByTagName('script')[0],j=document.createElement('script');j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id=${GTM_ID}';f.parentNode.insertBefore(j,f);`}
    </Script>
  );
}
