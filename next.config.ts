import type { NextConfig } from "next";
// Relative import, not the `@/` alias — this config file is loaded outside the app's module
// graph, where the alias is not guaranteed to resolve.
import { securityHeaders } from "./src/lib/security/headers";

const mode = process.env.NODE_ENV === "development" ? "development" : "production";

const nextConfig: NextConfig = {
  // `dangerouslyAllowSVG` is REQUIRED, not optional decoration: without it, next/image's
  // built-in optimizer (node_modules/next/dist/server/image-optimizer.js) rejects any
  // `image/svg+xml` upstream with an HTTP 400 — confirmed empirically against this installed
  // Next.js version via `next dev` + curl against the exact `/_next/image` URL Hero.tsx's
  // <Image> generates for /brand/hero-illustration.svg (02-REVIEW.md CR-01). The prior comment
  // here claiming "next/image serves SVG as-is regardless of this config" was wrong for this
  // version and is the reason the hero LCP element — the site's only above-the-fold visual —
  // silently 400'd in every real environment (dev, `next start`, and Vercel's production image
  // pipeline all share this code path). `contentDispositionType`/`contentSecurityPolicy` are the
  // Next.js-documented pairing for `dangerouslyAllowSVG`: since SVG can carry inline script, the
  // optimizer is told to serve it as a downloadable attachment under a locked-down CSP rather
  // than inline-rendered, even though this project only ever serves its own trusted /public SVGs.
  images: {
    formats: ["image/avif", "image/webp"],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders(mode) }];
  },
};

export default nextConfig;
