---
phase: 01-foundation-architecture-brand-identity-security-baseline
plan: 02
subsystem: data-and-integrations
tags: [nextjs, zod, vitest, eslint, architecture-seam, allowlist]

# Dependency graph
requires: ["01-01"]
provides:
  - "getStoreInfo() repository seam — the only sanctioned path from src/data/store.ts to UI (ARQ-02 seam 1)"
  - "Zod v4 storeInfoSchema + externalLinkSchema — build-time validation of commercial data (ARQ-03, CONT-03)"
  - "assertAllowedHost() + ALLOWED_HOSTS — single outbound-destination allowlist guard (SEC-03)"
  - "buildIFoodUrl/buildWhatsAppUrl/buildInstagramUrl/buildMapsUrl — the four allowlisted integration builders (ARQ-02 seam 2, INTEGRA-04)"
  - "ESLint no-restricted-imports boundary — components cannot import @/data/* directly (ARQ-02)"
  - "Home page rendering real store data and a real allowlisted iFood CTA"
affects: ["01-03", "01-04", "01-05", "01-06", "all Phase 2-5 plans that render store info or outbound CTAs"]

# Actuals (#2632)
actuals:
  tokens: 5457
  tasks: 3
  commits: 3
  plan_head_before: c33c1c9fe7484bfb588956c1cb24c1c93509292d

# Tech tracking
tech-stack:
  added: []
  patterns: ["Zod v4 schema + repository .parse() as the ARQ-03 build gate", "centralized lib/integrations/* + allowlist.ts as the single outbound-destination guard (SEC-03/INTEGRA-04)", "no-restricted-imports ESLint boundary enforcing the data/repositories/integrations seam (ARQ-02), with a test-file exemption for schema regression tests"]

key-files:
  created:
    - src/data/store.ts
    - src/data/links.ts
    - src/lib/schemas/store.schema.ts
    - src/lib/schemas/link.schema.ts
    - src/lib/schemas/store.schema.test.ts
    - src/lib/repositories/store-repository.ts
    - src/lib/integrations/allowlist.ts
    - src/lib/integrations/ifood.ts
    - src/lib/integrations/whatsapp.ts
    - src/lib/integrations/instagram.ts
    - src/lib/integrations/maps.ts
    - src/lib/integrations/allowlist.test.ts
    - src/lib/integrations/integrations.test.ts
  modified:
    - src/app/page.tsx
    - eslint.config.mjs

key-decisions:
  - "storeInfoSchema follows the PATTERNS.md template literally: neighborhood/city/state are z.literal (not z.string()) since Phase 1 has exactly one confirmed store location — a genuine second location would be a schema change, not a data edit."
  - "link.schema.ts uses Zod v4's top-level z.url() (preferred over the deprecated .string().url() method form) plus a .refine() enforcing that confirmed:false always carries a non-empty pendingConfirmation."
  - "Integration builders (ifood/whatsapp/instagram/maps) import src/data/links.ts directly rather than through a links-repository — this matches RESEARCH.md Pattern 2's own template and is exactly why the ESLint boundary rule carves out src/lib/integrations/** as a sanctioned seam alongside src/lib/repositories/**."
  - "ESLint no-restricted-imports exemption extended to *.test.ts files (deviation — see below): a schema regression test needs the raw src/data/store.ts module to prove the schema has teeth against the real shipped file (ARQ-03 Task 3), which the original Task 2 exemption (repositories/integrations only) did not anticipate."

requirements-completed: [ARQ-02, ARQ-03, INTEGRA-04, SEC-03, CONT-03]

coverage:
  - id: D1
    description: "Home page shows real store name/address/neighbourhood read from src/data/store.ts through getStoreInfo() — not typed into the component"
    requirement: "ARQ-02"
    verification:
      - kind: other
        ref: "node -e prerendered-HTML check (PLAN.md Task 1 <verify>) — asserts 'Mercado da Torre' present in .next/server/app HTML"
        status: pass
      - kind: other
        ref: "node -e seam check — src/app/page.tsx contains the identifiers getStoreInfo and buildIFoodUrl, no address string literal, no https:// literal"
        status: pass
    human_judgment: false
  - id: D2
    description: "Working 'Pedir no iFood' anchor built by buildIFoodUrl() and cleared by assertAllowedHost()"
    requirement: "INTEGRA-04"
    verification:
      - kind: other
        ref: "node -e prerendered-HTML check — asserts 'ifood.com.br' href present and 'PLACEHOLDER_PENDING_CLIENT_CONFIRMATION' present (unconfirmed placeholder, not a guessed URL)"
        status: pass
    human_judgment: false
  - id: D3
    description: "Malformed src/data/store.ts (missing required field) fails npm run build instead of shipping a blank address"
    requirement: "ARQ-03"
    verification:
      - kind: other
        ref: "Demonstrated: temporarily removed 'address', ran npm run build, captured non-zero exit + ZodError naming 'address' (see Task 3 Evidence below); restored via git checkout, confirmed green rebuild"
        status: pass
      - kind: unit
        ref: "npx vitest run src/lib/schemas/store.schema.test.ts — 6 tests, including the real-shipped-module regression case"
        status: pass
    human_judgment: false
  - id: D4
    description: "Every one of the four outbound destinations is produced by a function in src/lib/integrations/ that calls assertAllowedHost() before returning"
    requirement: "INTEGRA-04"
    verification:
      - kind: other
        ref: "node -e grep check (PLAN.md Task 2 <verify>) — all four of ifood/whatsapp/instagram/maps.ts contain 'assertAllowedHost'"
        status: pass
      - kind: unit
        ref: "src/lib/integrations/integrations.test.ts — asserts each builder's hostname is a member of ALLOWED_HOSTS"
        status: pass
    human_judgment: false
  - id: D5
    description: "A look-alike hostname (suffix or substring of an allowed domain) is rejected by assertAllowedHost() with a thrown error"
    requirement: "SEC-03"
    verification:
      - kind: unit
        ref: "src/lib/integrations/allowlist.test.ts — dedicated suffix-look-alike and substring-embed rejection cases, plus a non-parseable-URL case, alongside all 9 ALLOWED_HOSTS acceptance cases"
        status: pass
    human_judgment: false
  - id: D6
    description: "Every unconfirmed link in src/data/links.ts carries confirmed:false + non-empty pendingConfirmation + an obviously-invalid placeholder path"
    requirement: "CONT-03"
    verification:
      - kind: other
        ref: "Manual inspection of src/data/links.ts — ifood/whatsapp records both carry PLACEHOLDER_PENDING_CLIENT_CONFIRMATION in their path"
        status: pass
      - kind: unit
        ref: "src/lib/schemas/store.schema.test.ts externalLinkSchema case — rejects confirmed:false with no pendingConfirmation"
        status: pass
    human_judgment: false
  - id: D7
    description: "A component outside src/lib/repositories/ and src/lib/integrations/ that imports from @/data/* fails npm run lint"
    requirement: "ARQ-02"
    verification:
      - kind: other
        ref: "Manually created a throwaway src/app/_lint-rule-check.tsx importing @/data/store, confirmed npm run lint reports 1 error naming the ARQ-02 message, then deleted the file (not committed) — proven twice: once after Task 2, again after the Task 3 test-file exemption fix"
        status: pass
    human_judgment: false
  - id: D8
    description: "Store hours parse only while provisional is the literal true"
    requirement: "ARQ-03"
    verification:
      - kind: unit
        ref: "src/lib/schemas/store.schema.test.ts — 'rejects hours.provisional set to false' case"
        status: pass
    human_judgment: false

duration: ~7min (commit-to-commit)
completed: 2026-09-13
status: complete
---

# Phase 1 Plan 2: Walking Skeleton — Data, Schema, Repository & Integrations Summary

**One real path wired end-to-end — hand-authored store data, through a Zod v4 schema, through a repository function, into the rendered home page — plus a completed, allowlist-guarded integrations module for all four outbound destinations (iFood/WhatsApp/Instagram/Maps), with automated SEC-03/ARQ-03/ARQ-02 guards proven, including a real (not just asserted) demonstration of the ARQ-03 build gate against a malformed data edit.**

## Performance

- **Duration:** ~7 min (commit-to-commit, `c33c1c9`→`deb84b7`)
- **Tasks:** 3 (1 tracer + 1 TDD auto + 1 auto)
- **Commits:** 3
- **Files changed:** 15 (13 created, 2 modified)

## Accomplishments

- **Task 1 (tracer):** wired the single happy path — `src/data/store.ts` → `storeInfoSchema` (Zod v4) → `getStoreInfo()` → `src/app/page.tsx`, and `src/data/links.ts` → `assertAllowedHost()` → `buildIFoodUrl()` → the page's "Pedir no iFood" CTA. `npm run build` produces prerendered HTML containing the real neighbourhood ("Mercado da Torre") and an `ifood.com.br` href carrying the deliberately-invalid `PLACEHOLDER_PENDING_CLIENT_CONFIRMATION` path.
- **Task 2 (TDD):** RED — wrote `allowlist.test.ts`, `integrations.test.ts`, `store.schema.test.ts` against the still-missing `whatsapp.ts`/`instagram.ts`/`maps.ts` builders (confirmed failing: `integrations.test.ts` could not resolve `./whatsapp`, while the other two suites already passed with 18 tests). GREEN — implemented all three remaining builders, all 23 tests passing. Added the ARQ-02 `no-restricted-imports` ESLint rule barring `@/data/*` imports outside `src/lib/repositories/**` and `src/lib/integrations/**`, verified it has teeth with a throwaway violating file.
- **Task 3:** added a regression test that imports the real `src/data/store.ts` module (not a fixture) and asserts it parses cleanly. Then **demonstrated** (not merely asserted) the ARQ-03 gate: temporarily removed `address` from `store.ts` (bypassing TypeScript via `as unknown as StoreInfo` so the runtime Zod gate — not the type checker — was what failed), ran `npm run build`, captured the non-zero exit and the `ZodError` naming `address`, restored the file with `git checkout` and confirmed `git diff --exit-code` reports no drift, then reran `npm run build` green.

## Task Commits

Each task was committed atomically:

1. **Task 1: End-to-end tracer path** — `cf0c588` (feat)
2. **Task 2: Complete integrations module + SEC-03/ARQ-03 guards** — `e081e5b` (test)
3. **Task 3: Demonstrate the ARQ-03 build gate** — `deb84b7` (test; amended once to fold in the ARQ-02 lint-exemption fix, see Deviations)

## Task 3 Evidence — ARQ-03 Build Gate Demonstration

**Failing build** (captured with `address` removed from `src/data/store.ts`, bypassed via `as unknown as StoreInfo`):

```
Error occurred prerendering page "/". Read more: https://nextjs.org/docs/messages/prerender-error
Error [ZodError]: [
  {
    "expected": "string",
    "code": "invalid_type",
    "path": [
      "address"
    ],
    "message": "Invalid input: expected string, received undefined"
  }
]
    at <unknown> (src\lib\repositories\store-repository.ts:8:26)
   6 |   // `.parse`, not `.safeParse` — a malformed edit must throw and fail the build (ARQ-03),
   7 |   // not degrade into a rendered page with a blank address.
>  8 |   return storeInfoSchema.parse(rawStore);
     |                          ^
   9 | }
  10 | {
  digest: '57562680'
}
Export encountered an error on /page: /, exiting the build.
⨯ Next.js build worker exited with code: 1 and signal: null
```
Exit code: `1`.

**Restored + green rebuild:**

```
git checkout -- src/data/store.ts
git diff --exit-code -- src/data/store.ts   # exit 0 — byte-identical to the Task 1 commit

npm run build
...
Route (app)
┌ ○ /
└ ○ /_not-found

○  (Static)  prerendered as static content
```
Exit code: `0`.

## Files Created/Modified

- `src/data/store.ts` — hand-authored store facts (name, address, neighborhood, city, state, modalities); `hours` carries `provisional: true`, an empty `schedule`, and a PT-BR `pendingConfirmation` sentence — neither stale Instagram-story schedule from PROJECT.md was copied in
- `src/data/links.ts` — four destination records (`ifood`, `whatsapp`, `instagram`, `maps`); Instagram/Maps `confirmed: true` with real URLs, iFood/WhatsApp `confirmed: false` with a real official hostname but a `PLACEHOLDER_PENDING_CLIENT_CONFIRMATION` path
- `src/lib/schemas/store.schema.ts` — `storeInfoSchema` (Zod v4), `hours.provisional` gated by `z.literal(true)`; exports `StoreInfo`
- `src/lib/schemas/link.schema.ts` — `externalLinkSchema` with the confirmed/pendingConfirmation `.refine()` invariant; exports `externalLinksSchema`, `ExternalLink`, `ExternalLinkId`
- `src/lib/schemas/store.schema.test.ts` — 6 tests: missing/empty address rejection, empty-schedule acceptance, `provisional:false` rejection, real-shipped-module regression, `externalLinkSchema` unconfirmed-requires-explanation case
- `src/lib/repositories/store-repository.ts` — `getStoreInfo()`, calls `storeInfoSchema.parse` (not `.safeParse`)
- `src/lib/integrations/allowlist.ts` — `ALLOWED_HOSTS` (9 official hostnames) + `assertAllowedHost()` using exact-equality hostname comparison
- `src/lib/integrations/ifood.ts`, `whatsapp.ts`, `instagram.ts`, `maps.ts` — one builder per destination, each guarded by `assertAllowedHost`; `buildWhatsAppUrl` percent-encodes its optional message
- `src/lib/integrations/allowlist.test.ts` — 12 tests: acceptance for all 9 `ALLOWED_HOSTS`, suffix look-alike rejection, substring-embed rejection, non-parseable-URL rejection
- `src/lib/integrations/integrations.test.ts` — 5 tests: all four builders return allowlisted hostnames, `buildWhatsAppUrl` percent-encodes its message
- `src/app/page.tsx` — replaced the `create-next-app` scaffold placeholder with a Server Component rendering `getStoreInfo()` output and a `buildIFoodUrl()`-built CTA anchor
- `eslint.config.mjs` — added the ARQ-02 `no-restricted-imports` rule barring `@/data/*` outside `src/lib/repositories/**`, `src/lib/integrations/**`, and `**/*.test.ts`

## Decisions Made

- Followed `PATTERNS.md`'s literal `store.schema.ts` template, including `z.literal` for `neighborhood`/`city`/`state` (single confirmed location — a second location is a schema change, not a data edit).
- Used Zod v4's top-level `z.url()` in `link.schema.ts` rather than the deprecated `.string().url()` method form.
- Integration builders import `src/data/links.ts` directly (matching RESEARCH.md Pattern 2's own template), which is why the ARQ-02 lint rule's sanctioned-seam allowlist includes `src/lib/integrations/**` alongside `src/lib/repositories/**`.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] ARQ-02 lint rule needed a `*.test.ts` exemption**
- **Found during:** Task 3, after adding the real-shipped-module regression test to `store.schema.test.ts`
- **Issue:** `store.schema.test.ts` imports `rawStore` directly from `@/data/store` to prove the schema parses the real shipped data (an explicit Task 3 requirement: "loads the actual shipped data module (not a fixture)"). Task 2's lint rule only exempted `src/lib/repositories/**` and `src/lib/integrations/**`, so `npm run lint` correctly flagged this new import as an ARQ-02 violation — a genuine gap in the Task 2 exemption list, not a false positive.
- **Fix:** Extended the lint rule's sanctioned-seam file list to include `src/**/*.test.{ts,tsx}`. A test file proving schema/data correctness is a different concern than a UI component bypassing the repository seam, so this does not weaken ARQ-02's actual guarantee (component code still cannot import `@/data/*`).
- **Files modified:** `eslint.config.mjs`
- **Verification:** `npm run lint` exits 0; re-confirmed the rule still rejects a throwaway non-test violating file (`src/app/_lint-rule-check.tsx`, created and deleted, never committed) both before and after this exemption.
- **Committed in:** `deb84b7` (folded into the Task 3 commit via amend, since it was required to make Task 3's own changes pass the plan's lint verification step)

None of the other Task 1/2 acceptance criteria required a deviation — the tracer path, the four integration builders, and the schema/allowlist test suites all landed matching the plan's literal specification.

## Issues Encountered

None beyond the lint-exemption gap documented above.

## User Setup Required

None — no external service configuration required. The `ifood`/`whatsapp` placeholder destinations remain pending client confirmation (carried forward from `01-01-SUMMARY.md` and `STATE.md` Blockers/Concerns — INTEGRA-01/02/04 real values are Phase 2 scope).

## Next Phase Readiness

- `getStoreInfo()` and all four `build*Url()` functions are ready for Phase 2's hero/location section to consume — no component should ever import `@/data/*` directly; the ESLint rule now enforces this.
- The `hours.provisional: true` / `pendingConfirmation` convention established here is the exact seam LOCAL-03 (Phase 2) will use for the labelled provisional hours display.
- `confirmed: false` + `pendingConfirmation` + placeholder-path convention in `src/data/links.ts` is ready for Phase 2 to swap in the real iFood URL and WhatsApp number once the client confirms them — a one-file edit, no component changes needed.
- Open item carried forward (from `01-01-SUMMARY.md`, unrelated to this plan): 5 moderate `npm audit` findings in `potrace`'s dependency chain, to be re-checked when plan 01-04 wires the `npm audit` CI gate.

## Self-Check: PASSED

All 15 claimed created/modified files verified present on disk; all three task commits (`cf0c588`, `e081e5b`, `deb84b7`) verified present in `git log --oneline --all`.

---
*Phase: 01-foundation-architecture-brand-identity-security-baseline*
*Completed: 2026-09-13*
