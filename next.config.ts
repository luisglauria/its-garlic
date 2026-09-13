import type { NextConfig } from "next";
// Relative import, not the `@/` alias — this config file is loaded outside the app's module
// graph, where the alias is not guaranteed to resolve.
import { securityHeaders } from "./src/lib/security/headers";

const mode = process.env.NODE_ENV === "development" ? "development" : "production";

const nextConfig: NextConfig = {
  // No visible effect yet — the only hero asset is an SVG, which next/image serves as-is
  // regardless of this config (RESEARCH.md Pitfall 3). Declared now because the raster product
  // photography Phase 3 ships and the production LCP verification Phase 5 runs both assume this
  // is already here (RESEARCH.md Pitfall 2) — one line now is cheaper than discovering it
  // missing during Phase 5's production check.
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders(mode) }];
  },
};

export default nextConfig;
