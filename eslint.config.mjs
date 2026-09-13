import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// ARQ-02: components must never import `@/data/*` (or a relative path resolving into
// src/data) directly — the repository/integrations layers are the only sanctioned seams.
const dataImportBoundaryRule = {
  "no-restricted-imports": [
    "error",
    {
      patterns: [
        {
          group: ["@/data/*", "@/data", "**/data/*", "**/../data/*"],
          message:
            "Do not import src/data/* directly. Go through a function in src/lib/repositories/ or src/lib/integrations/ instead (ARQ-02).",
        },
      ],
    },
  ],
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: dataImportBoundaryRule,
  },
  {
    // The two sanctioned seams: repositories and integrations are allowed to import
    // straight from src/data — everything else must go through them. Test files (`*.test.ts`)
    // are also exempt: a schema/data regression test legitimately needs the raw data module
    // to prove the schema has teeth against the real shipped file (ARQ-03), which is a
    // different concern than a UI component bypassing the repository seam.
    files: [
      "src/lib/repositories/**/*.{ts,tsx}",
      "src/lib/integrations/**/*.{ts,tsx}",
      "src/**/*.test.{ts,tsx}",
    ],
    rules: {
      "no-restricted-imports": "off",
    },
  },
]);

export default eslintConfig;
