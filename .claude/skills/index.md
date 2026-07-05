# Skills Index

> **Purpose**: Portable, installable behavior and capability protocols for Claude Code.
> **Scope**: Sovereignty-owned; distributable standalone to team members without sovereignty access.
> **Updated**: 2026-04-23

---

## What are Skills?

**Skills** are self-contained protocol files (single `SKILL.md`) that Claude Code loads to modify its behavior. Unlike `patterns/` (consulted on demand) or `rules/` (routing rules), skills are **always-on behavior contracts** that govern interaction, execution, and decision boundaries.

### Skills vs Other Layers

| Layer | Purpose | When loaded | Distribution |
|-------|---------|-------------|--------------|
| **Skills** | Behavior protocols (how Claude talks, decides, executes) | Session start / on invoke | Standalone — can ship without sov |
| **Rules** | Project routing (WHEN/WHERE) | Every message | Via sync-sovereignty.sh |
| **Patterns** | Implementation (HOW) | On demand | Via sync-sovereignty.sh |
| **Doctrine** | Philosophy (WHY) | On demand | Via sync-sovereignty.sh |

---

## Available Skills

| Skill | Purpose | Lines |
|-------|---------|-------|
| [behavior-sov](behavior-sov/SKILL.md) | Token Economy Behavior Protocol — interaction, execution, and authorization discipline (33 rules across 8 parts) | ~440 |

---

## Installation (for any skill)

### Option 1 — Drop-in (team members, no sovereignty access)

Share the skill's `SKILL.md` file. Recipient creates the directory and pastes:

```bash
mkdir -p ~/.claude/skills/<skill-name>
# Paste SKILL.md into that directory.
```

Skills are fully self-contained. Their internal `Cross-References` sections are optional drill-downs for sovereignty contributors and do not affect the skill's function.

### Option 2 — Symlink (sovereignty maintainers)

```bash
ln -s ~/Documents/proyectos/sovereignty/soberania-del-codigo/skills/<skill-name> \
      ~/.claude/skills/<skill-name>
```

Updates in sovereignty propagate automatically.

### Option 3 — Per-project via sync

`sync-sovereignty.sh` copies all of `skills/` into each project's `.claude/skills/` on every run. No manual step.

---

## How Skills Activate

Skills in `~/.claude/skills/<name>/SKILL.md` are discoverable by Claude Code.

- **Session start**: skills with `auto_invoke: session_start` in front-matter apply from the first message.
- **Manual invoke**: `/<skill-name>` reloads the skill into active context (useful if behavior drift is detected mid-session).

---

## Contributing a New Skill

1. Create `sov/skills/<skill-name>/SKILL.md`.
2. Structure:
   - YAML front-matter (`name`, `description`, `auto_invoke`, `scope`)
   - Philosophy / root principle
   - Rules organized in parts (tables for DO/DON'T)
   - Installation section (drop-in + symlink + sync)
   - Cross-references to sov files (optional drill-down)
   - Changelog
3. Keep it **self-contained**: a team member should be able to use it with only the `SKILL.md` file.
4. Add an entry to the table above.
5. Commit in sov, push, and announce to team.

---

## Team Onboarding (Quick Reference)

Send team members this one-pager (or link to this file if they have sov read access):

> **How to install a behavior skill in Claude Code**
> 1. Create `~/.claude/skills/<skill-name>/` on your machine.
> 2. Paste the `SKILL.md` file you received into that folder.
> 3. Restart Claude Code (or run `/<skill-name>` to invoke immediately).
> 4. The skill is now active in every session on your machine.

No sovereignty repo, no sync script, no git. One file, one folder, done.

---

## Related

- `README.md` — sovereignty overview
- `CLAUDE.md` — sovereignty root entry point
- `core/sops/sovereignty-workflow.md` — daily sync + backup
