# SOP: Executive Presentations — HTML Format

> **PURPOSE**: Create, maintain, and export dark-theme HTML presentations for executive audiences
> **SCOPE**: Architecture proposals, governance reviews, AI committee decks, strategic onboarding
> **UPDATED**: 2026-04-19

---

## When to Use HTML Format

| Scenario | HTML | PPTX |
|----------|------|------|
| Governance / strategy proposal for directors | ✅ | |
| Technical content with code, tables, metrics | ✅ | |
| Dark theme required for readability | ✅ | |
| Keyboard-navigable, self-contained file | ✅ | |
| Client external delivery | | ✅ |
| Stakeholder insists on Office format | | ✅ |

HTML presentations are single-file, Git-tracked, renderable in any browser, and require zero installs.

---

## Design System

### CSS Variables

| Variable | Value | Use |
|----------|-------|-----|
| `--bg` | `#07090f` | Body background |
| `--a` | `#5b8df7` | Primary blue — accent, highlights |
| `--a2` | `#8b5cf6` | Purple — secondary |
| `--a3` | `#06b6d4` | Cyan — tertiary |
| `--g` | `#10b981` | Green — success, confirmed |
| `--y` | `#f59e0b` | Amber — warning, current state |
| `--r` | `#ef4444` | Red — danger, before state |
| `--t` | `#eef0f8` | Primary text |
| `--sub` | `#9ca3c4` | Secondary text |
| `--m` | `#6b7494` | Muted / labels |

### Card Variants

| Class | Border | Use |
|-------|--------|-----|
| `.card` | neutral | Generic content |
| `.card.ca` | blue | Info / features |
| `.card.cg` | green | Positive / results |
| `.card.cy` | amber | Current / in progress |
| `.card.cr` | red | Problem / before state |
| `.card.cp` | purple | Methods / process |
| `.card.cc` | cyan | Technical |

### Gradient Classes

| Class | Colors | Use |
|-------|--------|-----|
| `.grad` | blue→purple→pink | Primary emphasis (title) |
| `.grad2` | green→cyan | Positive / success |
| `.grad3` | amber→orange | Warning / before |

---

## Anatomy of a Slide

```html
<div class="slide [center|left]" id="sN">
  <div class="eye">Eyebrow — context or section label</div>
  <h2>Slide Title<br><span class="grad">Gradient Emphasis</span></h2>
  <div class="dv"></div>
  <p class="lead">Supporting paragraph — 1–2 sentences max.</p>
  <!-- content: grids, cards, tables, quotes, phases -->
  <div class="q">"Pull quote or key statement."</div>
</div>
```

### Layout Classes

| Class | Columns | Use |
|-------|---------|-----|
| `.g2` | 2 | Left/right split |
| `.g3` | 3 | Feature comparison (before/transition/after) |
| `.g4` | 4 | Metrics dashboard |
| `.phases` | 6 | Process phases (SRD, SCD) |
| `.slide.center` | centered | Concept, quote, title slides |
| `.slide.left` | left-aligned | Detail, comparison, tables |

---

## File Naming and Storage

```
admin/presentations/
├── [topic]-[audience]-[date].html
└── sovereignty-ai-committee.html       ← example canonical deck
```

Rules: `kebab-case`, no spaces, no version suffixes (Git is the version history).

---

## PDF Export

### Option A: Print CSS — built in, no script needed (recommended)

The presentation HTML includes `@media print` styles. Each slide renders as one landscape page.

**Steps:**
1. Open `.html` in **Chrome** or **Edge** (not Safari — gradient support differs)
2. `Cmd+P` (Mac) / `Ctrl+P` (Windows)
3. Destination → **Save as PDF**
4. Layout → **Landscape**
5. Options → ☑ **Background graphics** (critical — dark theme needs this)
6. Save

### Option B: Playwright automation

Use for batch exports or CI/CD pipelines.

```javascript
// scripts/export-presentation.js
const { chromium } = require('playwright');
const path = require('path');

async function exportPresentation(htmlPath, pdfPath) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto(`file://${path.resolve(htmlPath)}`);
  await page.emulateMedia({ media: 'print' });
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    landscape: true,
    printBackground: true,
  });
  await browser.close();
  console.log(`Exported: ${pdfPath}`);
}

const [,, html, pdf] = process.argv;
exportPresentation(html, pdf);
```

```bash
node scripts/export-presentation.js presentations/my-deck.html output/my-deck.pdf
```

---

## Keyboard Navigation

| Key | Action |
|-----|--------|
| `→` / `↓` / `Space` | Next slide |
| `←` / `↑` | Previous slide |
| `Home` | First slide |
| `End` | Last slide |

---

## Creating a New Presentation

1. Copy an existing deck as boilerplate
2. Strip all slide `<div class="slide">` blocks (keep CSS + JS)
3. Update `<title>`, `.brand` label, and `.ctr` initial counter
4. Add slides following the anatomy above
5. Test keyboard navigation before sharing
6. Commit the `.html` file — single-file, no assets needed

Pattern reference: `admin/commercial/executive-presentation-pattern.md`

---

## See Also

- `admin/commercial/executive-presentation-pattern.md` — HTML template and slide patterns
- `core/sops/mcp-playwright.md` — Playwright MCP for automated screenshots
