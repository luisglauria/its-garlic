// Source: nextjs.org/docs/app/guides/testing/vitest (official Next.js guide)
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node", // Phase 1 only tests pure functions (schemas, allowlist) — no DOM needed yet
    passWithNoTests: true, // this plan creates the runner before any *.test.ts file exists
  },
});
