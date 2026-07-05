# SOP: API Inventory Extraction

> **PURPOSE**: Build a complete `(verb, URL)` inventory of every backend call a frontend makes, for backend documentation handoff or audit.
> **SCOPE**: Any frontend codebase (web or mobile) where backend documentation is missing, incomplete, or out of date.
> **PREREQUISITES**: Read access to the codebase; awareness of the project's API consumption pattern (see Step 1).
> **UPDATED**: 2026-04-27

---

## Overview

Frontend codebases consume backend APIs through one of three patterns. Each requires a different extraction strategy. **Identify the pattern first** — applying the wrong strategy produces an incomplete or noisy inventory.

The deliverable is intentionally minimal: a flat CSV with two columns (`VERBO`, `URL`), one row per unique endpoint. This is the canonical format requested by backend teams when the vendor declines to provide API documentation. Body schemas, response types, and authentication details are documented separately by the backend team — extraction stays out of scope.

---

## Step 1 — Identify the Consumption Pattern

Run a quick reconnaissance to classify the codebase before writing any extractor.

### Pattern A — Centralized Catalog

**Signals**:
- A JSON or TS config file declares every endpoint (e.g. `apiConfig.json`, `endpoints.ts`).
- Every API call goes through a single wrapper (`handleRequest`, `apiClient.call`, `fetcher`, ...).
- Endpoints are referenced symbolically (`API.ENDPOINTS.X.Y`) and resolved at runtime.

**Best for**: deterministic regex/AST extraction. Output is exhaustive and stable.

**Example projects**: any app with a centralized endpoint catalog (e.g. `config/default.json`, `endpoints.ts`), apps using a generated typed client.

### Pattern B — Scattered Fetch Calls

**Signals**:
- `fetch(...)` / `axios.get(...)` / `http.post(...)` calls inlined inside components or hooks.
- URLs hardcoded as string literals or composed from environment variables.
- No central catalog; the source of truth is the calling code itself.

**Best for**: AST-based extraction over the entire `src/` tree, hunting for HTTP-method call expressions.

**Example projects**: legacy React apps, ad-hoc Next.js codebases without service layer.

### Pattern C — API Client SDK

**Signals**:
- Generated client (from OpenAPI, GraphQL, gRPC) or manually authored classes (`UserService`, `OrderService`).
- Method calls like `userService.createUser(payload)` — no URL in the calling code at all.
- The URL is hidden inside the client.

**Best for**: introspection of the SDK source (or the OpenAPI/GraphQL spec it was generated from). Often the spec **is** the inventory — extraction is just a format conversion.

### Mixed codebases

Real projects often combine patterns. Recommended order: extract A first (centralized & exhaustive), then sweep B for outliers, then handle C separately.

---

## Step 2 — Choose the Extraction Strategy

| Pattern | Strategy | Tooling |
|---|---|---|
| A | Parse the catalog → walk service files → resolve symbolic refs | Python/Node script with regex or AST |
| B | AST traversal over all source files looking for HTTP-method call expressions | `ts-morph`, `babel-parser`, ESLint custom rule |
| C | Convert the spec (OpenAPI/GraphQL) directly | `openapi-cli`, `graphql-introspection` |

**Avoid**:
- Pure `grep` for `fetch(` or `axios` — misses dynamic URLs and produces too much noise.
- LLM-only extraction (asking the model "list all endpoints") — non-reproducible and miss-prone for >50 endpoints.
- Manual extraction beyond the first ~20 endpoints — error-prone and not maintainable as the codebase evolves.

---

## Step 3 — Build the Extractor

The script must be **idempotent** and **deterministic**. Re-running it after vendor changes should produce a clean diff.

### Required behaviors

1. **Resolve URLs literally.** Preserve `{id}` / `{userId}` placeholders, casing, and any inconsistencies (e.g. `/Api` vs `/api`). The inventory documents *what is*, not *what should be*. Convention drift is a separate audit finding.
2. **Expand query params.** For verbs that pass query params (typically GET, sometimes POST), reconstruct the URL as `?key1={key1}&key2={key2}`. This makes parameters visible without a separate column.
3. **Skip body params.** They belong to the backend's payload contract; the inventory's purpose is route discovery.
4. **Deduplicate by `(verb, base_path)`.** When multiple callers hit the same endpoint with different query keys, collapse into one row with the **union** of all observed keys.
5. **Report unresolved references.** Print a warning if a symbolic ref doesn't resolve, or if a URL extraction fails. Never silently drop rows.

### Output format

```
VERBO,URL
GET,https://api.example.com/users/{id}
POST,https://api.example.com/users
DELETE,https://api.example.com/users/{id}/sessions
```

---

## Step 4 — Validate the Inventory

A static extractor can produce false positives (endpoints declared but never called) and false negatives (dynamic URLs the regex missed). Three validation layers, in increasing cost:

1. **Static cross-check** — every symbolic ref resolves to a catalog path; every catalog path is referenced. Unreferenced paths are either dead code or extractor blind spots.
2. **Smoke test against staging/QA** — fire each non-destructive endpoint with an empty payload and classify by status code. The decision rule is **"not 404 = endpoint exists"** (200/400/401/403/422 all confirm existence). See `api-testing.md` for the curl patterns.
3. **Runtime capture during E2E** — intercept network requests during the existing E2E suite and diff against the static inventory. Anything in runtime but not in static is an extractor bug; anything in static but not in runtime is either dead code or a path the E2E doesn't cover.

For a one-shot inventory delivery to backend, validation layer 2 is usually sufficient. For ongoing audit work, add layer 3.

**Always exclude destructive endpoints** from the smoke (DELETE, password resets, SMS senders, payment captures). Mark them `SKIPPED_DESTRUCTIVE` and let backend validate them server-side.

---

## Step 5 — Hand Off

Deliver the CSV to the backend team. Include in the handoff message:

- **What's in scope**: HTTP verb + URL only.
- **What's NOT in scope**: payload schemas, response shapes, authentication details, rate limits.
- **How URLs are formatted**: literal as the frontend constructs them; `{id}` placeholders preserved.
- **Caveats**: any inconsistencies discovered (case mismatches, deprecated endpoints, orphaned catalog entries).
- **Re-extraction**: how to re-run the script when the vendor adds/changes endpoints.

The backend team imports the CSV into their preferred tool (Excel, Postman collection, OpenAPI generator) and uses it as the seed for documenting payloads, schemas, and auth.

---

## Anti-Patterns

| Don't | Do Instead |
|---|---|
| Hand-edit the CSV to "fix" URL casing or naming | Fix the catalog or calling code; re-run the extractor |
| Normalize URLs (lowercasing, camelCase) before backend confirms | Keep literal; open a separate finding for naming-convention debt |
| Omit query params to "simplify" the URL | Query keys are part of the route signature — backend needs them |
| Inline body params in the URL string | Body is documented by backend, not by the inventory |
| Run the extractor and trust output blindly | Run sanity checks (gateway distribution, duplicate detection) every time |
| Treat first extraction as final | Re-run on every audit cycle; the inventory drifts as the vendor adds/removes endpoints |

---

## Project-Specific Implementations

| Project | Pattern | Implementation |
|---|---|---|
| (add yours here) | A / B / C | `<project>/.claude/patterns/core/sops/api-inventory-extraction.md` + extractor script path |

When implementing for a new project, read the project-specific SOP first if it exists — it captures the regex patterns, gateway type maps, and edge cases discovered during the audit. The generic SOP (this file) describes the methodology; project-specific SOPs describe the executable procedure.

---

## Related

- `core/sops/api-testing.md` — Smoke testing the extracted URLs against a live backend
- `core/sops/code-audit.md` — Where API inventory fits in the broader audit workflow
- `core/sops/sop-creation.md` — Two-layer SOP doctrine (this is a Layer 2 / detail SOP)
