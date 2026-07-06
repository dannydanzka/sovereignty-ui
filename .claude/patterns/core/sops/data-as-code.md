# SOP: Data-as-Code — Datos Opacos a Fuente de Verdad Tipada

> **PURPOSE**: Convert opaque, untrustworthy data (spreadsheets, PDFs, scattered files) into a typed, versioned, auditable source of truth from which human-readable views are generated.
> **SCOPE**: Any domain where data lives in opaque/contradictory formats and decisions depend on trusting it (personal finance, audits, inventories, migrations).
> **PREREQUISITE**: Node ≥ 22 or `tsx`; raw files already converted to `.md`/`.json` (see `document-ingestion.md`).
> **UPDATED**: 2026-06-27

---

## Principle

> Excel/PDF allow contradiction (the same figure with three values in three places). A typed, versioned source of truth makes contradiction impossible by construction.

The same doctrine as code sovereignty, applied to data: the readable view is a **derivative**, never the source. The source is typed code/JSON.

---

## The 3-layer pipeline

```
raw/ (opaque)              source-of-truth/ (typed)        views/ (readable)
PDFs · xlsx · dirty .md →  .ts entities / .json records →  .md / .html generated
contradictory              computable · validated           never hand-edited
```

**Golden rule**: never hand-edit a generated view. Edit the source, regenerate. This is what eliminates drift.

---

## Procedure

### 1. Model the entity (domain)
Typed `interface` per concept. Every field that can be missing is `T | null` — `null` means **UNKNOWN** (visible uncertainty), never `0` or a fake default. Add a mandatory `fuente`/`source` field: traceability per datum. Without a source, the datum is not sovereign.

### 2. Extract — deterministic first, AI only where needed
- **Tier-1 (deterministic)**: where the format is regular, parse with code. Auditable, free, reproducible, **cannot hallucinate**.
- **Tier-2 (AI)**: only where code can't — unstructured input, images, semantic classification. AI **proposes**; a human (or rules) approves; the decision is applied deterministically (e.g. an overrides file). AI is never the source of truth.

### 3. Load to the typed source of truth
- Hand-curated entities → `.ts` (one file per instance, git-diff friendly).
- Machine-extracted bulk → `.json` validated against the schema.
- On conflicting figures: take the most recent dated value; document the reconciliation in notes + source.

### 4. Generate views
Reports/dashboards import the source, **compute** derived values (totals, projections, scores) and write `.md`/`.html`. Computation lives in code, not in the data → always consistent.

### 5. Validate against the source — always
Compare extracted sums against the source's stated totals. When they differ, **the more faithful datum wins** (the parse often captures rows the summary omits). Never hide the discrepancy — report it (a fidelity report).

### 6. Surface uncertainty as a first-class output
Report what is unknown (the `null`s) as its own section, ideally a single completeness score. Degrade gracefully: produce value with partial data instead of demanding perfection.

---

## Privacy boundary (when data is sensitive)

- The **system** (code: entities, use-cases, extractors) is versionable and generic — **never contains data**.
- The **instance** (real records, PII) lives in a gitignored `ledger/` + generated `reports/`.
- Test: "would this be identical for someone else?" → system. "Specific to this subject?" → instance (gitignored).

---

## Anti-Patterns

| Don't | Do Instead |
|-------|-----------|
| Hand-edit generated views | Edit source, regenerate |
| Use `0` for unknown data | Use `null` → visible uncertainty |
| Make AI the source of truth | AI proposes; deterministic application approves |
| Put real data in versioned code | Schema in code; instances in gitignored ledger |
| Trust the summary over the parse | Validate both; the faithful one wins; report the gap |

---

## Reference implementation

The Sovertainty project (financial sovereignty) is the canonical instance of this SOP: deterministic statement extractor → typed `ledger/` → generated reports + a "Sovertainty Score" that quantifies remaining uncertainty. Finance is the instance; this SOP is the agnostic method.

## See Also

- `core/sops/document-ingestion.md` — upstream step (raw → markdown)
- `core/architecture/code-sovereignty.md` — the doctrine this extends to data
