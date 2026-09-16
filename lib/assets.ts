// Asset URL helper for the static-export CDN deploy.
//
// Next.js prefixes `basePath` onto URLs it generates (`_next/`, `<Link>`,
// `next/font`) but not onto hand-written asset strings, and with
// `images.unoptimized` an `<img src>` is emitted verbatim. Every hand-written
// /public path goes through withBasePath() so it resolves under the mount.

export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefix a root-relative /public asset path with the mount basePath. */
export const withBasePath = (p: string): string =>
  p.startsWith("/") ? `${BASE_PATH}${p}` : p;
