import type { NextConfig } from "next";

// Mount prefix on the host app (www.imagine.art). Empty in development so the
// page serves at the root; set BASE_PATH at build time (e.g. "/platform") when
// the export is uploaded under a sub-path. Every hand-written asset URL goes
// through withBasePath() in lib/assets.ts, which reads the same value.
const BASE_PATH = process.env.BASE_PATH ?? "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  ...(BASE_PATH ? { basePath: BASE_PATH, assetPrefix: BASE_PATH } : {}),
  // Pages emit <route>/index.html, which a CDN + rewrite can serve without a
  // server resolving extensionless paths.
  trailingSlash: true,
  // next/image optimization needs a server.
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: BASE_PATH },
};

export default nextConfig;
