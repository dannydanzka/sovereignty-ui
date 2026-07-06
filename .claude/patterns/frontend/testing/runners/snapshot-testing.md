# Snapshot Testing — Layer 2 (Runner mechanics)

> **Layer**: 2 (runner-specific — same mechanics in Jest and Vitest)
> **Updated**: 2026-04-22

> **Not to be confused with**: documentation context-snapshots (`core/documentation/context-snapshots.md`). Different concept entirely.

---

## What snapshot testing is

A snapshot assertion serializes a value and compares it against a stored reference file. On first run, the reference is created. On subsequent runs, the test fails if the serialization differs.

```ts
expect(<ErrorBanner message="Error de red" />).toMatchSnapshot();
// First run: writes __snapshots__/component.test.tsx.snap
// Later runs: diffs the rendered output against the snap file
```

It's a **regression check**, not a behavioral test. It tells you "this changed" — not "this is correct".

---

## When snapshots help

- **Small, stable, presentation-only** components (`<Badge>`, `<Spinner>`, `<Avatar>`)
- **Pure data transformers** with complex output shape (mappers, normalizers, formatters) — snapshot the output for one realistic input
- **Generated artifacts** that should not change without intent (codegen output, derived constants)

---

## When snapshots hurt

- **Large components** or **whole pages** — every refactor produces churn, reviewers stop reading the diff
- **Components with dynamic content** (timestamps, IDs, randomness) — flaky or require constant snapshot updates
- **As a substitute for behavioral tests** — `expect(component).toMatchSnapshot()` proves nothing about user-visible behavior
- **For data with sensitive info** — snapshots commit user-like data into source; treat them like any other source

The signal: if `yarn test -u` is part of your normal workflow ("just update the snapshot"), the snapshot isn't catching anything.

---

## Inline snapshots

Better than file snapshots for small assertions — the expected value lives next to the test:

```ts
// Jest
expect(formatPrice(1234.5)).toMatchInlineSnapshot(`"$1,234.50"`);

// Vitest (identical)
expect(formatPrice(1234.5)).toMatchInlineSnapshot(`"$1,234.50"`);
```

First run writes the literal into the source file. Reviewers see the expected value in the diff, no separate `.snap` file to chase.

Limit to single-line or very short multi-line outputs. For 50-line component renders, file snapshots are clearer.

---

## Custom serializers

Strip unstable values before they hit the snapshot:

```ts
// jest.config.ts / vitest.config.ts
snapshotSerializers: ['./test/serializers/no-class-name-hashes.ts'],
```

Common targets:

- styled-components / emotion class hashes (`sc-abc123` → `[styled-class]`)
- React keys generated from runtime IDs
- timestamps and UUIDs in props

If you need a custom serializer to make a snapshot stable, ask first whether the snapshot is the right tool. Often a targeted `expect` on the meaningful prop is clearer.

---

## Updating snapshots

```bash
yarn jest -u                       # Jest
yarn vitest -u                     # Vitest
yarn jest -u path/to/file.test.ts  # scoped
```

**Treat `-u` as a code change, not a test fix.** Every updated snapshot needs reviewer attention — was the change intentional?

---

## Anti-patterns

| Pattern | Why it fails |
|---|---|
| Snapshotting an entire page | Diffs are unreadable; reviewers approve blindly |
| `toMatchSnapshot()` as the only assertion | Proves nothing about behavior — a no-op render passes |
| `--ci -u` in CI | Defeats the purpose; snapshots silently absorb regressions |
| Storing >5 snapshots per file | Signals over-reliance on snapshots vs behavioral tests |
| Snapshotting object identity (memoization checks) | Object identity isn't observable; test the user-visible effect |

---

## Snapshots vs behavioral assertions

```ts
// ❌ Snapshot — passes regardless of whether title is correct
expect(render(<Card title="Hola" />).container).toMatchSnapshot();

// ✅ Behavioral — fails if the title doesn't render
render(<Card title="Hola" />);
expect(screen.getByRole('heading', { name: 'Hola' })).toBeInTheDocument();
```

Default to behavioral. Reach for snapshots only when the alternative is a long chain of granular assertions on stable structure.

---

## File location

| Convention | Pros | Cons |
|---|---|---|
| `__snapshots__/file.test.tsx.snap` (default) | Auto-managed by runner | Hides snapshots from main diff |
| Inline (`toMatchInlineSnapshot`) | Snapshot visible in source | Larger source files |

Default to runner convention for file snapshots, inline for one-liners.

---

## Related

- `philosophy.md` — value over coverage; snapshots inflate coverage cheaply, don't be fooled
- `anti-patterns.md` — `essential-testing/max-snapshots` rule (5/file)
- `runners/jest.md`, `runners/vitest.md` — config syntax
