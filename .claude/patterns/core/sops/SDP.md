# SDP — Sovereign Delivery Process

> **Phase**: AFTER code — deliver, document, track, promote
> **Prerequisite**: SCG complete (code validated, tests passing)
> **Location**: `rules/sop/SDP.md` (always loaded)
> **Updated**: 2026-04-09

---

## Purpose

Orchestrate everything after code is written: branch strategy, PR creation, external docs documentation, ticket system tracking (comments, time, estimates), and environment promotion (qa → lab → master).

---

## Steps

### 10. Branch Strategy → `sops/SDP/branch-strategy.md`

Read branch hierarchy. Push branch. Check for conflicts against target. If conflicts: create sacrifice branch (`<target>-<source-branch>`). Update existing PR source — NEVER decline PRs.

**Trigger**: Every task. First delivery step.

### 11. PR Creation → `sops/SDP/pr-creation.md`

Create PR with correct title format, description template, reviewers. Title includes ALL related TICKET-ID tickets. Tickets as direct URLs (not markdown). external docs in separate Documentación section.

**Trigger**: Every task. PR is the delivery artifact.

### 12. External Docs Documentation → `sops/SDP/external-docs.md`

Create Research Técnico (if spike/research task). Create Documentación Técnica (always for implementation). Check existing pages in same external docs space FIRST — match format. Spanish with accents.

**Trigger**: Every task needs at least Documentación Técnica. Research tasks also need Research Técnico.

### 13. Ticket Tracking → `sops/SDP/ticket-tracking.md`

Add comments (research-focused on research task, implementation-focused on execution task). Log time (7h/day effective base, separate research vs execution). Set estimates before logging. Create execution subtask if task is research-only.

**Trigger**: Every task. Time and comments are mandatory.

### 14. Promotion → `sops/SDP/promotion.md`

Promote through environments: qa → lab → master. Each promotion is a separate PR. At master: cleanup `.claude/business/`, `.claude/status/`, `.claude/plans/`, `.claude/docs/`. If feature is shared knowledge: create business pattern. Update SOPs with learnings.

**Trigger**: After PR approval at each environment level.

---

## Flow

```
SCG complete (code validated)
       ↓
  10. Branch Strategy   → Push, sacrifice branch if conflicts
       ↓
  11. PR Creation       → Title, description, reviewers
       ↓
  12. external docs Docs   → Research Técnico + Doc Técnica
       ↓
  13. ticket system Tracking     → Comments, time, estimates
       ↓
  ✅ PR open, waiting for review
       ↓
  14. Promotion         → qa → lab → master (after approval)
       ↓
  🏁 Master cleanup + learnings
```

---

## Anti-Patterns

| Anti-Pattern | Correct |
|-------------|---------|
| Decline PR to fix mistakes | Use `pr_update` to update existing PR |
| Name sacrifice branch `sacrifice/...` | Use `<target>-<source-branch>` |
| PR title with single ticket | Include ALL related TICKET-ID keys |
| Repeat PR title in body | Body starts with certification, then content |
| Include `Completa el template...` boilerplate | Remove — noise for reviewer |
| Mix ticket system + external docs links in one section | Tickets in one section, Documentación in another |
| ticket system links as markdown `[TICKET-ID](url)` | Direct URLs — git host auto-renders |
| Invent external docs format | Check existing pages in same category FIRST |
| external docs in English | Spanish with accents for the organization |
| Skip time logging | Always log — research AND execution |
| Log ALL hours literally | 7h/day effective. Intellectual work counts, overhead doesn't |
| One ticket for research + execution | Separate subtasks with individual estimates |
| Skip master cleanup | Delete business/, status/, plans/, docs/ at master |
| Skip learning capture | Update SOPs with session learnings |

---

## Exit Criteria (per environment)

### QA
- [ ] PR open with correct title, description, reviewers
- [ ] external docs docs created (Research Técnico + Doc Técnica)
- [ ] ticket system comments added (per task)
- [ ] Time logged (research + execution separated)
- [ ] Estimates set on all tasks

### LAB
- [ ] Separate PR from qa → lab
- [ ] Same branch strategy (sacrifice if conflicts)

### Master
- [ ] Separate PR from lab → master
- [ ] `.claude/business/`, `.claude/status/`, `.claude/plans/`, `.claude/docs/` deleted
- [ ] Business pattern created (if feature is shared knowledge)
- [ ] SOPs updated with learnings
- [ ] 🏁 Task complete
