import type { NextConfig } from "next";
// Relative import, not the `@/` alias — this config file is loaded outside the app's module
// graph, where the alias is not guaranteed to resolve.
import { securityHeaders } from "./src/lib/security/headers";

const mode = process.env.NODE_ENV === "development" ? "development" : "production";

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders(mode) }];
  },
};

export default nextConfig;
