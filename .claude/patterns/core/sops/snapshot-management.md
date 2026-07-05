# SOP: Snapshot Management

> **PURPOSE**: Isolate snapshot file changes from feature code to reduce review noise and keep feature PRs focused on business logic.
> **LAYER**: Agnostic (applies to Jest, Vitest, Playwright screenshots, any snapshot-based tool)
> **UPDATED**: 2026-04-22

---

## Core Rule

**Snapshot changes (snapshot files — `.snap`, `.png`, etc. — additions/deletions/updates) MUST travel in commits and PRs separate from feature/refactor work.** They target the trunk directly (`master` / `main`) — not the staging branch (`qa` / `staging`) — because they are non-behavioral artifacts.

Feature PRs must NOT include snapshot diffs. If the feature work legitimately changes rendered output, snapshots are regenerated in a follow-up snapshot-only PR after the feature merges.

---

## Why

- **Review signal**: Reviewers ignore large snapshot diffs, which drown the real change.
- **Merge conflicts**: Snapshot files conflict frequently across parallel feature branches. Isolating them simplifies resolution.
- **Traceability**: A dedicated PR makes it obvious when and why snapshots changed.
- **Revert safety**: Feature rollback doesn't drag snapshot churn with it.

---

## Workflow

### During feature work

1. Implement the feature/refactor.
2. Run tests **without** the snapshot-update flag (`-u` in Jest/Vitest, `--update-snapshots` in Playwright) — leave failing snapshots as failures.
3. If snapshots fail only due to expected output changes, **do not** regenerate in the feature branch.
4. Commit and PR the feature code, excluding snapshot files.

```bash
# Stage feature changes WITHOUT snapshots
git add <feature files>
git reset -- '**/__snapshots__/**' '**/*.snap' '**/*-snapshots/**'
git commit -m "refactor: ..."
```

### After feature merges to trunk

1. Check out a fresh branch from the trunk:
   ```bash
   git checkout <trunk> && git pull origin <trunk>
   git checkout -b chore/<TICKET>-snapshots
   ```
2. Regenerate snapshots:
   ```bash
   # Jest/Vitest
   <pkg-manager> test -u
   # Playwright
   <pkg-manager> playwright test --update-snapshots
   ```
3. Commit only snapshot files:
   ```bash
   git add '**/__snapshots__/**' '**/*.snap' '**/*-snapshots/**'
   git commit -m "chore: update snapshots for <TICKET>"
   ```
4. Open PR **to the trunk** with title:
   ```
   [<TRUNK>][Chore][<Module>] - <TICKET>: Update snapshots
   ```
5. PR description: one line referencing the feature PR whose output changed.

---

## When Snapshots CAN Stay in the Feature PR

Only when **all** of these hold:

- The PR creates brand-new test files with brand-new snapshots (no pre-existing snapshots updated).
- No existing snapshot file is modified.
- The snapshot count added is small (< 5 files) and reviewable.

In this case, the new snapshot files ship with the feature. Deletions and updates of pre-existing snapshots still go in a separate PR.

---

## Anti-Patterns

| Anti-pattern | Why it's wrong |
|--------------|----------------|
| `-u` / `--update-snapshots` in the feature branch to "make tests pass" | Masks unintended regressions; bloats PR diff |
| Mixing feature + snapshot commits in the same PR | Reviewer can't distinguish intentional render changes from mechanical regen |
| Targeting snapshot PRs to staging (`qa`) | Snapshots are non-behavioral; skip the staging gate |
| Batching snapshots from multiple tickets into one PR | Breaks ticket ↔ PR traceability |

---

## Integration with SDP

This SOP inserts between **SDP step 10 (Branch Strategy)** and **SDP step 11 (PR Creation)**:

1. Before pushing the feature branch, check `git status` for snapshot file changes.
2. If present → split them off per the workflow above.
3. Feature PR proceeds through normal SDP.
4. Snapshot PR (if needed) follows its own lightweight SDP pass: branch → commit → PR → merge to trunk.

---

## See Also

- `core/sops/branch-merge-strategy.md` — Branch hierarchy, PR titles
- `methodology/development/sops/sdp/branch-strategy.md` — Feature branch push procedure, test-only changes section
- `methodology/development/sops/sdp/pr-creation.md` — PR title/body template
- `frontend/testing/runners/snapshot-testing.md` — When to use snapshots at all (use sparingly)
