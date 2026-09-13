# Pitfalls Research

**Domain:** Restaurant / digital-menu marketing site (static Next.js, no backend, external order links)
**Researched:** 2026-09-12
**Confidence:** MEDIUM-HIGH (security and performance findings grounded in current Next.js/OWASP guidance and cross-checked web sources; local-SEO and conversion findings grounded in industry sources but not project-specific data — no analytics in MVP means these will be unverifiable in production until a future phase)

## Critical Pitfalls

### Pitfall 1: Reflected XSS via search/filter query params rendered without sanitization

**What goes wrong:**
The cardápio has a search box and category filter (Active requirement: "Filtro por categoria e busca por produto no cardápio"). If the search term or a `?q=`/`?categoria=` URL param is read via `useSearchParams()`/`params` and then echoed back into the DOM (e.g., "Nenhum resultado para '<term>'", or used to pre-fill an `<input value>`, or interpolated into `dangerouslySetInnerHTML`, `href`, or a meta tag) without escaping, an attacker can craft a URL that executes script in a visitor's browser. This is the single most realistic client-side vulnerability class for a Next.js site with no backend — it doesn't require a server at all, just a search UI and URL sharing.

**Why it happens:**
React auto-escapes text content by default, which lulls teams into believing "we don't need to think about XSS." The actual danger points are the exceptions: `dangerouslySetInnerHTML`, building `href`/`src` attribute strings from user input, injecting into `<script>` tags (e.g., JSON-LD structured data built from a search term), or passing raw query values into `<title>`/meta tags for "dynamic" SEO snippets.

**How to avoid:**
- Never use `dangerouslySetInnerHTML` anywhere in the search/menu UI. Render search terms and filter labels as plain text via normal JSX interpolation (auto-escaped).
- Treat all `useSearchParams()`/route param values as untrusted strings: validate against an allowlist (known category slugs) before using them to select data; never reflect the raw user-typed string back into an attribute, URL, or JSON-LD block without encoding.
- If you build a "no results for X" message, render X through JSX text nodes only, never string-concatenate into HTML/JSON.
- Manually test: `?q=<script>alert(1)</script>`, `?categoria="><img src=x onerror=alert(1)>`, and encoded variants, against every page that reads a query/route param.
- This matches project requirement SEC (entradas não confiáveis tratadas como texto puro; XSS testado manualmente).

**Warning signs:**
- Any `dangerouslySetInnerHTML` in a component that touches search/filter state.
- Search term appearing in page `<title>`, meta description, or JSON-LD without going through a text-escaping path.
- Autocomplete/typeahead libraries that render suggestion HTML from user input.

**Phase to address:**
Cardápio/search implementation phase (build-time), verified in the dedicated security-hardening/verification phase before launch.

---

### Pitfall 2: External order/contact links get silently pointed at the wrong destination (link-swap / phishing risk)

**What goes wrong:**
The site's entire conversion funnel is three external links: iFood store URL, WhatsApp `wa.me` link, Google Maps/Instagram links. Because there's no backend, these links live as plain strings in the codebase (or worse, in an editable config someone treats as "just content"). A wrong character, a stale/expired iFood store slug, a copy-paste from a similar-looking phishing domain, or a compromised hosting/DNS account can silently redirect real customers' orders and payments to a fraudulent destination — this is explicitly flagged in PROJECT.md as the top real risk ("o maior risco real é troca de um desses links por um destino fraudulento").

**Why it happens:**
External links feel like "just content," so they don't get the same scrutiny as code. They're often hardcoded in multiple places (hero CTA, sticky mobile bar, footer, location section) without a single source of truth, so one gets updated and others don't, or a typo ships unnoticed because nobody manually clicks every CTA on every deploy.

**How to avoid:**
- Centralize all external destination URLs (iFood, WhatsApp, Instagram, Google Maps) in one typed config/data module — never hardcode the same URL string in multiple components.
- Validate the config against an explicit allowlist of expected hostnames (`ifood.com.br`, `wa.me`/`api.whatsapp.com`, `instagram.com`, `google.com`/`maps.app.goo.gl`) at build time or via a lint/test step — fail the build if a link's hostname isn't on the allowlist.
- Add all outbound link URLs to `noopener noreferrer` on `target="_blank"` (prevents `window.opener` tab-nabbing as a secondary hardening layer).
- Add a manual CI/PR checklist item (or automated e2e smoke test) that clicks every CTA against the allowlist before merging changes to link config.
- Protect the origin, not just the code: MFA + branch protection on the repo, registrar lock + MFA on the domain, MFA on the hosting provider (already captured as SEC requirements) — because the more likely attack vector than "bad code" is "compromised account pushing a malicious content change or DNS record."

**Warning signs:**
- Order/WhatsApp link strings duplicated across more than one component file.
- No automated check comparing shipped link hostnames against an allowlist.
- Link config is editable by anyone without PR review (e.g., a CMS-like JSON file merged without the same review rigor as code).

**Phase to address:**
Initial site-architecture/data-layer phase (centralize links + allowlist), verified continuously in the security-hardening phase and via a pre-launch/pre-deploy checklist.

---

### Pitfall 3: `NEXT_PUBLIC_*` and client-bundle secret leakage

**What goes wrong:**
Any environment variable prefixed `NEXT_PUBLIC_` is inlined into the JavaScript bundle at build time and is visible to anyone who views source — no exceptions. Teams sometimes prefix a Maps API key with billing restrictions, a future analytics/backend token, or a WhatsApp Business API key with `NEXT_PUBLIC_` "to make it work" without realizing it's now public and scrapeable by bots that harvest exposed keys.

**Why it happens:**
The naming convention is confusing — `NEXT_PUBLIC_` sounds like "publicly available config" but functions as "burned into a public file forever," including in the build's static JS chunks that persist even after the env var is rotated (old deployed bundles/CDN cache may still serve the old key).

**How to avoid:**
- Default posture: nothing goes in `NEXT_PUBLIC_*` unless it is explicitly meant to be public (e.g., a public Maps embed key restricted by HTTP referrer, not a secret).
- Use `server-only` package to make server-only modules fail the build if accidentally imported by a client component.
- Since this project has no backend at all in the MVP, there should be close to zero legitimate env secrets — treat any temptation to add one as a signal that the "no backend" boundary is being crossed and needs a design decision, not a quick env var.
- Grep the built output (`.next/static` or exported HTML/JS) for known secret patterns before each deploy as a final check.

**Warning signs:**
- Any `NEXT_PUBLIC_` variable whose name contains "key," "token," "secret," or maps to a paid/rate-limited API.
- `.env` files committed to git (check `.gitignore` covers `.env*` except `.env.example`).

**Phase to address:**
Project setup/scaffolding phase (establish the convention), enforced in the security-hardening phase with a bundle-scan check.

---

### Pitfall 4: CSP configured too strictly breaks Google Maps embed / iFood link / social icons — or too loosely to matter

**What goes wrong:**
The project requires CSP headers verified in production. A naive strict CSP (`default-src 'self'`) silently breaks the Google Maps iframe embed in the location section, blocks Instagram embed widgets if used, or blocks any inline `<script>` Next.js needs for hydration — producing a broken-looking page with no console-visible business logic explanation to a non-technical client. Conversely, a CSP with `'unsafe-inline'`/`'unsafe-eval'` sprinkled in to "make errors go away" defeats the purpose of having CSP as an XSS mitigation layer at all.

**Why it happens:**
CSP directives are easy to get wrong on the first pass, and the fastest way to "fix" a blocked resource under deadline pressure is to loosen the policy rather than scope it precisely (`frame-src maps.google.com`, nonce-based script-src, etc.).

**How to avoid:**
- Enumerate every third-party origin actually used (Google Maps iframe/domain, any font CDN, any embed) before writing the CSP, rather than writing CSP first and reacting to breakage.
- Use `Content-Security-Policy-Report-Only` in a staging/preview deploy for at least a few days of real navigation before switching to enforcing mode in production.
- Prefer a nonce or hash-based `script-src` (Next.js supports this) over `'unsafe-inline'`.
- Test the production CSP header with the actual embedded map/social widgets after every dependency or embed change — this is a "looks done but isn't" trap because a broken map only shows up as a blank box, not an obvious error.

**Warning signs:**
- Map/embed renders locally (no CSP in dev) but shows blank in production.
- CSP contains `'unsafe-inline'` or `'unsafe-eval'` with no comment explaining why it's unavoidable.
- No `Content-Security-Policy-Report-Only` testing step before enforcing.

**Phase to address:**
Security-hardening/headers phase, explicitly verified against the location-section embed in the same phase (don't split CSP config from the feature that depends on it).

---

### Pitfall 5: Dependency/supply-chain risk treated as "npm audit passed = safe"

**What goes wrong:**
`npm audit` (and similar) only catches *known, disclosed* vulnerabilities in the dependency graph — it does not detect malicious packages, typosquatted installs, or compromised maintainer accounts pushing a bad version, which is the dominant real-world supply-chain attack pattern in the JS ecosystem today. A project claiming "dependencies audited, we're secure" based solely on a clean `npm audit` is giving false assurance — this directly maps to the project's own stated principle ("Nenhuma alegação de '100% seguro' — scanner limpo é evidência parcial, não prova").

**Why it happens:**
`npm audit` is the path of least resistance and produces a reassuring green checkmark, so teams stop there.

**How to avoid:**
- Commit and enforce the lockfile (`package-lock.json`/`pnpm-lock.yaml`); use `npm ci` (not `npm install`) in CI so builds are reproducible and can't silently pull a newer, compromised version.
- Pin exact versions for anything touching the build pipeline; review diffs on lockfile changes in PRs, not just source diffs — a lockfile change with no corresponding `package.json` change is a red flag.
- Consider `--ignore-scripts` on install where feasible (most static-site dependency installs don't need postinstall scripts) to reduce the blast radius of a compromised package's install-time payload.
- Keep dependency count minimal — this is a marketing site, not an app; every added library (animation, carousel, analytics-adjacent) is additional attack surface for a site whose actual functional needs are simple.
- Enable GitHub's Dependabot/secret scanning (already an SEC requirement) and review — don't auto-merge dependency bumps without at least skimming the changelog for anything odd.

**Warning signs:**
- Lockfile diffs reviewed less carefully than code diffs in PRs.
- `npm install` used in CI instead of `npm ci`.
- Large, unexplained jump in transitive dependency count after adding a small UI library.

**Phase to address:**
Project setup phase (lockfile + CI enforcement), re-verified in the security-hardening phase and on an ongoing basis (documented as a recurring check, not one-time).

---

### Pitfall 6: Local SEO built around the brand name only, ignoring neighborhood/discovery search intent

**What goes wrong:**
Teams optimize only for "It's Garlic" (branded search, which people who already know the restaurant will find anyway) and neglect the discovery queries that actually drive new customers: "pão de alho Recife," "o que comer no Mercado da Torre," "restaurante Mercado da Torre Recife," "happy hour Torre Recife." Without content, headings, and metadata targeting the neighborhood + product/occasion combination, the site won't surface for the exact searches a new customer nearby would type.

**Why it happens:**
It feels redundant to "say Mercado da Torre and Recife again" when it's already in the address block; teams treat NAP (Name/Address/Phone) as sufdicient for local SEO and don't realize on-page content, title tags, H1s, and structured data need to reinforce location + product terms independently of the footer address.

**How to avoid:**
- Use `Restaurant`/`LocalBusiness` JSON-LD structured data with `address`, `geo`, `servesCuisine`, `priceRange`, `openingHoursSpecification`, and `menu` — this is what lets Google and AI answer engines surface the business for local queries.
- Write real page copy (hero, category intros, location section) that naturally includes "Mercado da Torre," "Recife," and product terms — not just in the footer address, but in headings and body text a human would read.
- Title tag and meta description should include neighborhood + core product ("It's Garlic — Pão de Alho e Petiscos no Mercado da Torre, Recife"), not just the brand name.
- Flag as a Pendência from PROJECT.md: confirm whether a Google Business Profile exists — if not, creating and NAP-matching one is a prerequisite for local SEO to work at all, independent of what the website does (this is outside the website codebase but blocks the SEO requirement's effectiveness).

**Warning signs:**
- Page `<title>`/H1 mentions only the brand name, no location/product terms.
- No `LocalBusiness`/`Restaurant` structured data in page source.
- No confirmed Google Business Profile (per PROJECT.md Pendências) — website SEO work has nothing to reinforce.

**Phase to address:**
SEO/metadata phase (structured data + copy), but flag the Google Business Profile dependency to the client early since it's outside the codebase and blocks the requirement's real-world effectiveness.

---

### Pitfall 7: NAP (Name/Address/Phone) and hours inconsistency across site, iFood, Instagram, and Google

**What goes wrong:**
PROJECT.md already documents two divergent, years-old sets of operating hours found in old Instagram stories, with no confirmed current hours. Shipping a site with unconfirmed/wrong hours is worse than a generic industry mistake here — it's a known, flagged risk. Beyond hours, if the address format, phone number, or business name differs even slightly (abbreviation, suite number, spelling) between the website, Google Business Profile, iFood listing, and Instagram bio, search engines lose confidence in which data is authoritative and rank the business lower for local queries; customers also show up when the restaurant is closed.

**Why it happens:**
Each platform (website, iFood, Google, Instagram) is edited by a different person or at a different time, so drift is inevitable without an explicit reconciliation process; "publish now, ask forgiveness" pressure leads to using the old Instagram-story hours as a stand-in for confirmed hours.

**How to avoid:**
- Do exactly what PROJECT.md already mandates: mark hours as provisional/"a confirmar" in the UI until the client confirms current hours — never present the old story-derived hours as authoritative fact.
- Before launch, reconcile NAP across website, Google Business Profile (once it exists), iFood store listing, and Instagram bio into one canonical source; note any mismatch found during research as a client action item, not something to silently "fix" by picking one.
- Revisit this reconciliation as a recurring checklist item (quarterly, per the industry guidance found), not a one-time launch task — hours/promotions change seasonally (happy hour, combo do dia) per PROJECT.md's own active requirements.

**Warning signs:**
- Hours displayed on the site don't have a visible "provisional/pending confirmation" indicator.
- No single documented source of truth for address/phone/hours that all platforms are checked against.

**Phase to address:**
Content/copy phase (provisional-hours UI treatment), location/contact section phase (NAP display), with a recurring post-launch content-maintenance note (ties to the Pendência "responsável por atualização de cardápio/preços/horários pós-lançamento").

---

### Pitfall 8: Hero/menu food photography tanks mobile LCP and Lighthouse score

**What goes wrong:**
Food photography is the single highest-impact visual asset on a restaurant site — and the single most common cause of failing Core Web Vitals. An unoptimized hero image or a menu grid of full-resolution product photos (the site has 10 menu categories with photo cards for every product) routinely pushes mobile LCP well past the 2.5s target, especially over real-world mobile network conditions in Brazil, not just fast wifi in a dev environment. This directly threatens the project's own explicit acceptance criteria (Lighthouse mobile ≥90, LCP ≤2.5s, CLS ≤0.1, INP ≤200ms, verified in production).

**Why it happens:**
Photos come straight from a phone/camera or Instagram export at full resolution; a single huge hero image is prioritized visually without corresponding compression/sizing work; using `next/image` incorrectly (or not at all) means no responsive `srcset`/lazy-loading; menu grids load every category's photos upfront instead of lazy-loading off-screen ones.

**How to avoid:**
- Compress and pre-size every product photo to actual rendered dimensions (never ship a 3000px source image to a 390px mobile card) — use `next/image` with explicit `sizes` for responsive `srcset`, WebP/AVIF output, and `priority`/preload only on the single actual LCP element (the hero image), not on every menu photo.
- **Critical stack interaction**: if the project ends up using Next.js static export (`output: "export"`, plausible for a backend-less MVP hosted on a static host), `next/image`'s built-in optimization server does NOT run — `unoptimized: true` becomes necessary, which means responsive resize/WebP conversion has to happen at build time instead (pre-optimize with Sharp in a build step, or a static-export image optimizer package, or host images on an image CDN with URL-based transforms). Decide this during the stack/architecture phase, not after 60+ product photos are already in the repo at full resolution — retrofitting is expensive.
- Lazy-load every menu-grid image below the fold; only the hero (and maybe first category) should be eagerly loaded.
- Set explicit width/height (or aspect-ratio) on every image to prevent layout shift (CLS) as photos load in.
- Test Lighthouse mobile against production (real CDN/hosting), not just localhost — local dev servers don't reflect real network/compression behavior.

**Warning signs:**
- Any `<img>` without explicit dimensions in the menu grid.
- Hero image file size >300–500KB before optimization pipeline.
- Lighthouse passes locally but fails in production (different caching/compression/CDN behavior).
- `next/image` used with `unoptimized: true` but no separate build-time optimization step compensating for it.

**Phase to address:**
Decide the image pipeline in the stack/architecture phase (before content is loaded); implement per-image in the cardápio/product-card build phase; verify with real Lighthouse-on-production runs in a dedicated performance-verification phase (not just "looks fine on my machine").

---

### Pitfall 9: Single external conversion path (iFood/WhatsApp) has no fallback when the link itself fails

**What goes wrong:**
Because the entire "conversion" of this site is clicking through to iFood or WhatsApp, any failure in that hand-off is a 100% loss of the primary business goal for that visitor — there's no in-site fallback (no cart, no alternate contact form). Concretely: the iFood store link can go stale if the store's iFood slug/ID changes, the store can be temporarily paused/closed on iFood (common for restaurants adjusting capacity) with the site still linking to it as if open, or the WhatsApp number can be malformed (a stray "+" or "0" makes `wa.me` show "invalid number" instead of opening a chat) or point to a number that changed carriers/instances. On mobile, in-app browsers (Instagram/TikTok's built-in browser, if traffic arrives via a social post) can also fail to hand off to the WhatsApp/iFood app correctly, leaving the user stuck.

**How to avoid:**
- Validate the `wa.me` number format exactly (country code, no leading zero, no punctuation) and test the live link, not just visually inspect the string.
- Since there's no backend to detect "iFood store paused" automatically, this becomes a process/content risk, not a code risk: document in the Pendências/ops handoff that whoever manages the iFood store must also remember the site links to it, and a "closed on iFood" state isn't reflected on the site automatically. Consider (as a v1.1, not MVP-blocking) a simple, manually-updated "loja temporariamente indisponível" banner data flag the client can toggle without a deploy, given PROJECT.md explicitly wants a data-driven, backend-ready architecture.
- Provide the WhatsApp link as an explicit, always-available fallback next to every iFood CTA (already an active requirement — "CTAs de iFood e WhatsApp lado a lado") specifically because it's the recovery path when iFood fails.
- Test both links from an actual mobile device via a real in-app browser share flow (post the link in Instagram DM/story and tap it) before launch, not just desktop Chrome devtools mobile emulation.

**Warning signs:**
- iFood/WhatsApp links only tested on desktop browser, never on a real phone via a shared/in-app-browser link.
- No documented owner for keeping the iFood link in sync if the client changes iFood plans/store setup.
- WhatsApp number stored as a display-formatted string (with spaces/dashes/parentheses) instead of validated separately for the `wa.me` URL format.

**Phase to address:**
CTA/link implementation phase (validation + testing on real devices), and flagged as an operational handoff item (outside code) for whoever manages the iFood account post-launch.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|-----------------|------------------|
| Hardcoding menu/price/hours data directly in JSX components instead of a typed data layer | Faster to ship first version | Violates PROJECT.md's explicit "arquitetura orientada a dados" requirement; makes future backend migration a rewrite instead of a swap | Never — this is an explicit architectural requirement, not a nice-to-have |
| Using `unoptimized: true` on `next/image` without a compensating build-time optimization step | Unblocks a static-export build quickly | Directly threatens the LCP/Lighthouse acceptance criteria with image-heavy content | Only as a temporary state during early scaffolding, never at launch |
| Skipping the CSP `Report-Only` staging period and going straight to enforcing | Saves a few days | Silent breakage of Maps embed / other third-party resources in production with no easy diagnosis | Never for the initial CSP rollout; acceptable for later, minor CSP tweaks once the baseline is proven |
| Storing external links (iFood/WhatsApp/Maps) as ad-hoc strings per component instead of one central validated config | Fast for a single CTA | Multiplies the link-swap/phishing risk (Pitfall 2) as more CTAs get added across phases | Never — centralize from the first CTA |
| Treating old Instagram-story hours as "close enough" current hours | Avoids blocking on client response | Ships factually wrong business info, directly contradicts PROJECT.md's explicit provisional-data constraint | Never — mark provisional instead |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|-----------------|-------------------|
| iFood store link | Linking to a generic iFood restaurant search or an outdated store slug instead of the exact, current store URL | Get the canonical current store URL directly from the client/iFood dashboard; add it to the link allowlist check (Pitfall 2) |
| WhatsApp `wa.me` link | Malformed number (extra "+"/"0", wrong country code) causing "invalid number" instead of opening chat; pre-filled message text not URL-encoded correctly | Use `https://wa.me/<countrycode><number>` with digits only, no punctuation; URL-encode any pre-filled `?text=` message; test the literal link on a phone |
| Google Maps embed | Using an unrestricted API key, or an iframe URL that gets blocked by a naive CSP | Restrict the Maps API key by HTTP referrer; explicitly allow the Maps iframe origin in `frame-src`/`img-src` CSP directives before enforcing |
| Instagram embed/link | Embedding via a script widget that introduces its own CSP/tracking exceptions for a low-value visual add | Prefer a plain link/icon to the Instagram profile over an embedded widget, given the "minimal footprint" security posture already chosen for this project (no analytics, no backend) |
| Google Business Profile (not yet confirmed to exist per PROJECT.md) | Treating on-site SEO as sufficient without a matching, claimed GBP listing | Flag to client as a blocking dependency for local SEO to actually work, independent of website code |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|-----------------|
| Full-resolution product photos in every menu card | Slow LCP/TTI on mobile, high data usage for users on limited mobile plans | Build-time image pipeline (Sharp/CDN) producing responsive WebP/AVIF sized to actual card dimensions | Breaks immediately at launch with real photos — this isn't a "scale" problem, it's a day-one problem given 10 menu categories of photographed products |
| Eager-loading every category's images at once instead of lazy-loading below the fold | High initial payload even though user only sees one category | `next/image` default lazy loading for all non-hero images; only `priority` the actual hero | Breaks as soon as more than ~1 category's worth of products is added |
| CSS/JS from convenience UI libraries (carousels, animation libs) added per new section without a bundle-size budget | Slowly growing JS bundle, worse INP over successive phases | Set and monitor a bundle-size budget from the first phase; prefer CSS-only solutions (Tailwind) over JS libraries for simple carousels/animations | Creeps in gradually across phases 2–5+ as more sections are added; each individual addition looks harmless |
| Testing Lighthouse only on localhost/dev build | False confidence — local dev server and production CDN/compression behave very differently | Always verify Lighthouse mobile + Core Web Vitals against the deployed production URL, per PROJECT.md's own explicit acceptance criteria | Breaks trust in the metric the moment it's checked in production for the first time, potentially after "launch" |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Reflecting search/filter query params into DOM/attributes/JSON-LD unsanitized | Reflected XSS executed in a visitor's browser via a shared/malicious URL | Treat all query params as untrusted text; allowlist category values; never use `dangerouslySetInnerHTML` with user input |
| Hardcoded/duplicated external CTA links with no hostname validation | Silent link-swap to a phishing/fraudulent destination — the project's own stated top risk | Central link config + hostname allowlist check + manual click-test before every deploy touching links |
| `NEXT_PUBLIC_*` prefix used on anything sensitive | Secret permanently exposed in client bundle, even after rotation (old deployed bundles) | Default to nothing being public; `server-only` package to fail builds on accidental client import |
| CSP loosened to `'unsafe-inline'`/`'unsafe-eval'` to silence errors quickly | Defeats CSP's purpose as an XSS mitigation layer | Scope CSP precisely to enumerated third-party origins; use nonces/hashes, not blanket unsafe directives |
| Relying on `npm audit` alone as "dependencies are secure" | False assurance — misses malicious/typosquatted packages and compromised-maintainer attacks, the dominant real-world supply-chain risk today | Lockfile enforcement + `npm ci` in CI + minimal dependency count + reviewed lockfile diffs; treat as ongoing practice, not one-time scan |
| No MFA/branch protection treated as "we'll add it before launch" | Compromised GitHub/hosting/domain account can push a malicious content change or DNS record — a more realistic attack than exploiting application code on a backend-less site | Set up MFA + branch protection + secret scanning + registrar lock as part of initial project/repo setup, not a pre-launch afterthought |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-------------------|
| Only one CTA style (e.g., only iFood) prominent per screen, WhatsApp buried | Users who prefer/need WhatsApp (no iFood account, iFood unavailable in their situation) drop off entirely | Keep iFood + WhatsApp CTAs visually paired throughout, as PROJECT.md already requires, with priority varying by time-of-day context (almoço/happy hour) rather than removing either option |
| Menu categories require excessive scrolling/tapping on mobile to reach relevant section (e.g., "almoço" buried under petiscos/espetinhos) | Users bounce before finding what they came for, especially time-pressured lunch searchers | Category filter/jump-nav visible near top of cardápio; use time-of-day-aware default ordering per PROJECT.md's own active requirement |
| Prices/hours shown with no visible "provisional" indicator while awaiting client confirmation | Users act on wrong information (show up at wrong time, expect a price that's since changed) | Explicit "a confirmar"/provisional UI treatment until client-confirmed, per PROJECT.md constraint |
| Product cards with photo but no clear indication if item is a highlighted/destaque vs. a filler entry among 10 categories | Users can't quickly find "what this restaurant is known for" (pão de alho) buried among broader menu | Use the "destaques opcionais" field (already an active requirement) deliberately to surface the pão de alho signature items first, reinforcing "mais que um pão de alho" positioning |

## "Looks Done But Isn't" Checklist

- [ ] **External CTAs (iFood/WhatsApp):** Often "look done" after a visual review but were never actually clicked end-to-end on a real mobile device via a shared/in-app-browser link — verify by tapping the live production link from a phone, including via an in-app browser (Instagram DM/story share).
- [ ] **CSP headers:** Often pass a basic page load but break the Google Maps embed or another third-party resource only visible on the specific page/section that uses it — verify every page with an embed, not just the homepage.
- [ ] **Search/filter XSS testing:** Often "tested" only with normal search terms, never with `<script>`/HTML payloads in the query string — verify by manually trying injection payloads on every page reading `useSearchParams()`.
- [ ] **Lighthouse ≥90 / Core Web Vitals:** Often verified only on localhost/preview deploy, not the actual production domain with real CDN/caching behavior — verify against the live production URL post-launch, on mobile throttled network.
- [ ] **NAP/hours consistency:** Often "looks done" because the website shows *something* plausible, but was never cross-checked against Google Business Profile, iFood listing, and Instagram bio for exact matches — verify with a side-by-side comparison across all platforms before calling launch complete.
- [ ] **Secret/env scan:** Often assumed clean because `.env` isn't committed, but a `NEXT_PUBLIC_*` variable can leak a key just as badly without ever touching `.env` in git — verify by grepping the actual built JS output for key-shaped strings before each deploy.
- [ ] **Dependency audit:** Often "done" because `npm audit` shows zero vulnerabilities — verify the lockfile is committed, CI uses `npm ci`, and lockfile diffs are reviewed in PRs (a clean scan today says nothing about a compromised package pushed tomorrow).

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|-----------------|------------------|
| Reflected XSS found post-launch | LOW–MEDIUM | Patch the specific unsanitized render path, redeploy (static site, so fast); rotate nothing sensitive since no backend/session exists to steal, but audit for any other similarly-patterned param usage across the codebase |
| Link swapped to wrong/fraudulent destination discovered post-launch | MEDIUM–HIGH | Immediately correct the link and redeploy; if caused by account compromise (not just a typo), rotate all credentials (GitHub, hosting, domain registrar), review recent commits/DNS changes for other tampering, and notify the client given real customers may have been misdirected |
| Secret leaked in a past bundle (even after later removed) | MEDIUM | Rotate the leaked credential immediately (removing it from future bundles doesn't invalidate what's already been scraped/cached); check hosting/CDN cache for how long the old bundle remains reachable |
| Lighthouse/CWV targets missed in production after launch | LOW–MEDIUM | Re-run the image optimization pipeline against actual production assets; audit for any eagerly-loaded off-screen images or unbudgeted JS added in later phases; re-measure |
| Stale/wrong hours or menu data discovered live | LOW | Since this is a data-driven static site, correcting a data file and redeploying is fast — the real cost is reputational (a customer who showed up when "closed"), not technical; prioritize getting the provisional-data UI treatment right up front to avoid this scenario entirely |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|-------------------|----------------|
| Reflected XSS via search/filter params | Cardápio/search build phase | Manual injection-payload testing in the security-hardening/verification phase |
| External link swap / phishing risk | Data-layer/architecture phase (centralized link config) | Hostname allowlist check + manual click-test in security-hardening phase and pre-deploy checklist |
| `NEXT_PUBLIC_*` secret exposure | Project setup phase (convention + `server-only`) | Bundle grep for secret patterns in security-hardening phase |
| CSP breaking Maps/embeds | Security headers phase, done together with location-section embed work | `Report-Only` staging period, then live check on every page with an embed |
| Dependency/supply-chain risk | Project setup phase (lockfile + `npm ci` in CI) | Ongoing PR review discipline; re-checked in security-hardening phase |
| Local SEO ignoring neighborhood search intent | SEO/metadata phase | Structured data validation (Rich Results Test) + manual search-query review; flag GBP dependency to client |
| NAP/hours inconsistency | Content/copy phase + location-section phase | Cross-platform side-by-side comparison before launch; recurring post-launch check |
| Food photography tanking mobile LCP | Stack/architecture phase (decide image pipeline) → cardápio build phase (implement) | Production Lighthouse mobile run in dedicated performance-verification phase |
| Single conversion path with no fallback for link failure | CTA implementation phase | Real-device end-to-end click test (including in-app browser); document iFood-status ownership as ops handoff |

## Sources

- [Next.js secrets in client bundle — DEV Community](https://dev.to/anas_sheikh_2/your-nextjs-app-might-be-leaking-secrets-right-now-check-your-client-bundle-1fl) — MEDIUM confidence (community, cross-checked against Next.js official `NEXT_PUBLIC_` documentation behavior)
- [Next.js security checklist — Arcjet](https://blog.arcjet.com/next-js-security-checklist/) — MEDIUM confidence
- [XSS in Next.js: dangerouslySetInnerHTML, Server Components, App Router — vibeappscanner](https://vibeappscanner.com/vulnerability-in/xss-nextjs) — MEDIUM confidence, consistent with known React/Next.js XSS patterns
- [Yext — Local SEO mistakes](https://www.yext.com/knowledge-center/categories/explore/industry-guides/local-seo-mistakes-and-how-to-fix-them) — MEDIUM confidence (vendor content, but consistent with general local-SEO consensus)
- [Restaurant SEO Mistakes — LocalBrandHub](https://localbrandhub.com/blog/restaurant-seo-mistakes) — MEDIUM confidence
- [NAP Consistency for Local SEO — Amigo Studios](https://www.amigostudios.co/blog/nap-consistency-local-seo) — MEDIUM confidence
- [Restaurant website speed & Core Web Vitals — Flipdish](https://www.flipdish.com/us/resources/blog/restaurant-website-speed-optimisation) — MEDIUM confidence, vendor content but aligns with well-established Core Web Vitals guidance
- [Restaurant Website Speed 2026 — RichMenu](https://richmenu.io/restaurant-website-speed/) — MEDIUM confidence
- [Next.js `output: export` + image optimization discussion — GitHub vercel/next.js #60977](https://github.com/vercel/next.js/discussions/60977) — HIGH confidence (official project discussion, technically verifiable via Next.js docs)
- [Next.js official docs — export-image-api error message](https://nextjs.org/docs/messages/export-image-api) — HIGH confidence (official documentation)
- [WhatsApp deep links guide — AppsFlyer](https://www.appsflyer.com/blog/deep-linking/whatsapp-deep-link/) — MEDIUM confidence
- [npm supply chain attack simulation — DEV Community](https://dev.to/jtorchia/npm-audit-isnt-enough-i-simulated-a-supply-chain-attack-on-my-node-dependencies-and-found-what-2ofc) — MEDIUM confidence (community-verified, consistent with well-documented npm ecosystem incidents e.g. event-stream, ua-parser-js)
- [CSP + Google Maps embed examples — content-security-policy.com](https://content-security-policy.com/examples/google-maps/) — MEDIUM-HIGH confidence (reference site specifically for CSP config patterns)
- Project's own threat model summary — `ask_questions/QA-LOG.md` (referenced via PROJECT.md) — HIGH confidence (primary source, client-specific)

---
*Pitfalls research for: Restaurant/digital-menu marketing site (It's Garlic, Recife) — static Next.js, no backend, iFood/WhatsApp as sole conversion path*
*Researched: 2026-09-12*
