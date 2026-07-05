# SOP: Playwright BDD — Ticket AC to Automated Tests

> **PURPOSE**: Map Given/When/Then acceptance criteria from ticket stories to executable Playwright BDD tests
> **STACK**: `playwright-bdd` + TypeScript + Page Object Model
> **SCOPE**: Agnostic — applies to any project using Playwright for E2E testing
> **CONTEXT7**: `/vitalets/playwright-bdd` · `/microsoft/playwright.dev`
> **UPDATED**: 2026-04-19

---

## Core Principle

> **The Given/When/Then in the ticket story description IS the test scenario.**
> Not a summary of it. Not inspired by it. The exact same statement, in two formats.

```
Ticket AC (natural language)        .feature file (Gherkin)             Step definitions (TypeScript)
────────────────────────────        ───────────────────────             ─────────────────────────────
Given the user is on                Feature: Classification tag         @Given('the user is on {string}')
  the selection screen                                                  async ({ selectionPage }, screen) => {
When a premium item is              Scenario: Premium item shows tag      await selectionPage.goto();
  selected                          Given the user is on                }
Then the premium tag                  "selection screen"
  is shown in the card              When a premium item is selected
                                    Then the premium tag is shown
```

---

## Project Setup

### Install

```bash
npm install -D playwright-bdd @playwright/test
```

### `playwright.config.ts`

```typescript
import { defineConfig } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

const testDir = defineBddConfig({
  features: 'src/tests/features/**/*.feature',
  steps: 'src/tests/steps/**/*.ts',
});

export default defineConfig({
  testDir,
  use: {
    baseURL: process.env.BASE_URL ?? 'https://qa.example.com',
    storageState: 'auth.json',  // pre-authenticated session
  },
  projects: [
    { name: 'web', use: { viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { viewport: { width: 375, height: 812 } } },
  ],
});
```

### Directory structure

```
src/tests/
├── features/                   ← .feature files (one per ticket story)
│   ├── TICKET-1001-classification-tag.feature
│   ├── TICKET-1002-status-hierarchy.feature
│   └── TICKET-1003-last-call.feature
├── steps/                      ← Step definitions (one per Page Object)
│   ├── selection.steps.ts
│   ├── status.steps.ts
│   └── fixtures.ts
├── pages/                      ← Page Object Model
│   ├── SelectionPage.ts
│   ├── StatusPage.ts
│   └── index.ts
└── auth.setup.ts               ← Authentication state setup
```

---

## Step 1 — Feature File from Ticket AC

Each ticket story → one `.feature` file. File name = `{TICKET-ID}-{slug}.feature`.

**From an AC written in INVEST format:**

```gherkin
# TICKET-1001-classification-tag.feature
Feature: Classification Tag in Selection Screen
  As a user I want to see the classification tag in the selection screen
  so that I know the item profile before completing the action

  Background:
    Given the user is logged in with the appropriate role
    And the user is on the selection screen

  Scenario: Premium item shows premium classification tag
    When the user selects an item with premium classification
    Then the premium tag is shown in the item card

  Scenario: Standard item shows standard classification tag
    When the user selects an item with standard classification
    Then the standard tag is shown in the item card

  Scenario: Base item shows no tag
    When the user selects an item with base classification
    Then no classification tag is shown

  Scenario: Tag format matches other sections
    When the user selects a premium item
    Then the tag visual format matches the tag shown in other sections
```

**Scenario outline for status hierarchy:**

```gherkin
# TICKET-1002-status-hierarchy.feature
Feature: Status Hierarchy Display
  As a staff user I want the module to show the correct status hierarchy
  so that I can identify the real state of any record

  Scenario Outline: Header shows highest-priority status
    Given a record has statuses <statuses>
    When the user views the header
    Then the displayed status is <expected_status>

    Examples:
      | statuses                    | expected_status |
      | Completed, OnHold           | Completed       |
      | Received, Cancelled         | Received        |
      | OnHold, Cancelled           | OnHold          |
      | Unshipped, Cancelled        | Unshipped       |
      | Cancelled only              | Cancelled       |
      | Processing only             | Processing      |

  Scenario: Detail shows all-status totals
    Given a record has mixed statuses including Cancelled and OnHold
    When the user opens the detail view
    Then the totals include ALL statuses

  Scenario: Header and detail totals can differ
    Given a record has Cancelled and OnHold items
    When the user compares header total vs detail total
    Then the detail total is higher than the header total
    And this difference is the expected behavior
```

---

## Step 2 — Fixtures and Page Objects

### `fixtures.ts` — extend base test

```typescript
// src/tests/steps/fixtures.ts
import { test as base, createBdd } from 'playwright-bdd';
import { SelectionPage } from '../pages/SelectionPage';
import { StatusPage } from '../pages/StatusPage';

type AppFixtures = {
  selectionPage: SelectionPage;
  statusPage: StatusPage;
};

export const test = base.extend<AppFixtures>({
  selectionPage: async ({ page }, use) => {
    await use(new SelectionPage(page));
  },
  statusPage: async ({ page }, use) => {
    await use(new StatusPage(page));
  },
});

export const { Given, When, Then, BeforeScenario, AfterScenario } = createBdd(test);
```

### Page Object — SelectionPage

```typescript
// src/tests/pages/SelectionPage.ts
import { Page, expect, Locator } from '@playwright/test';

export class SelectionPage {
  private readonly itemList: Locator;
  private readonly itemCard: Locator;

  constructor(public readonly page: Page) {
    this.itemList = page.getByTestId('item-list');
    this.itemCard = page.getByTestId('item-card');
  }

  async goto() {
    await this.page.goto('/selection');
    await this.page.waitForLoadState('networkidle');
  }

  async selectItem(classification: 'premium' | 'standard' | 'base') {
    const item = this.itemList
      .locator(`[data-classification="${classification}"]`)
      .first();
    await item.click();
    await expect(this.itemCard).toBeVisible();
  }

  async getItemTag(): Promise<Locator> {
    return this.itemCard.getByTestId('classification-tag');
  }

  async takeEvidenceScreenshot(scenario: string) {
    await this.page.screenshot({
      path: `.playwright-mcp/screenshots/evidence-${scenario}.png`,
    });
  }
}
```

### Page Object — StatusPage

```typescript
// src/tests/pages/StatusPage.ts
import { Page, expect, Locator } from '@playwright/test';

export class StatusPage {
  private readonly headerStatus: Locator;
  private readonly headerTotal: Locator;
  private readonly detailTotal: Locator;

  constructor(public readonly page: Page) {
    this.headerStatus = page.getByTestId('header-status');
    this.headerTotal = page.getByTestId('header-total');
    this.detailTotal = page.getByTestId('detail-total');
  }

  async gotoRecord(recordId: string) {
    await this.page.goto(`/status/${recordId}`);
    await this.page.waitForLoadState('networkidle');
  }

  async getHeaderStatus(): Promise<string> {
    return (await this.headerStatus.textContent()) ?? '';
  }

  async getHeaderTotal(): Promise<number> {
    const text = await this.headerTotal.textContent() ?? '0';
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  async getDetailTotal(): Promise<number> {
    const text = await this.detailTotal.textContent() ?? '0';
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }
}
```

---

## Step 3 — Step Definitions

```typescript
// src/tests/steps/selection.steps.ts
import { expect } from '@playwright/test';
import { Given, When, Then } from './fixtures';

Given('the user is logged in with the appropriate role', async ({ page }) => {
  // storageState from playwright.config.ts handles this — no-op if already authenticated
  await expect(page).toHaveURL(/.*\/dashboard/);
});

Given('the user is on the selection screen', async ({ selectionPage }) => {
  await selectionPage.goto();
});

When('the user selects an item with {word} classification',
  async ({ selectionPage }, classification: string) => {
    await selectionPage.selectItem(
      classification.toLowerCase() as 'premium' | 'standard' | 'base'
    );
  }
);

Then('the premium tag is shown in the item card', async ({ selectionPage }) => {
  const tag = await selectionPage.getItemTag();
  await expect(tag).toBeVisible();
  await expect(tag).toHaveAttribute('data-type', 'premium');
  await selectionPage.takeEvidenceScreenshot('TICKET-1001-premium-tag-shown');
});

Then('no classification tag is shown', async ({ selectionPage }) => {
  const tag = await selectionPage.getItemTag();
  await expect(tag).not.toBeVisible();
  await selectionPage.takeEvidenceScreenshot('TICKET-1001-base-no-tag');
});
```

---

## Step 4 — Authentication Setup

Pre-authenticate once, reuse state across all scenarios.

```typescript
// src/tests/auth.setup.ts
import { test as setup } from '@playwright/test';
import * as path from 'path';

const authFile = path.join(__dirname, '../../auth.json');

setup('authenticate', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[name=username]', process.env.QA_USERNAME!);
  await page.fill('[name=password]', process.env.QA_PASSWORD!);
  await page.click('[type=submit]');
  await page.waitForURL(/.*\/dashboard/);
  await page.context().storageState({ path: authFile });
});
```

### `.env.qa` (not committed)

```bash
BASE_URL=https://qa.example.com
QA_USERNAME=qa-user-handle
QA_PASSWORD=<secret>
```

---

## Scenario → Evidence Screenshot Pattern

Every `Then` step that validates visual output takes a screenshot. This replaces manual evidence screenshots in ticket comments.

```typescript
// In every Then step that has a visual assertion:
await page.screenshot({
  path: `.playwright-mcp/screenshots/evidence-${TICKET_ID}-${scenario}.png`
});
```

**The developer then attaches the screenshots to the ticket comment** as structured evidence.

---

## Running Tests

```bash
# Generate test files from .feature
npx bddgen

# Run all tests
npx playwright test

# Run specific story
npx playwright test --grep "TICKET-1001"

# Run on mobile viewport only
npx playwright test --project=mobile

# Run with UI mode (visual debugging)
npx playwright test --ui

# Update screenshots baseline
npx playwright test --update-snapshots
```

---

## AC Coverage Checklist

Before a story moves to QA, verify every AC scenario has a test:

```
[ ] Every Given/When/Then in the ticket description has a .feature scenario
[ ] Every .feature scenario has a passing step definition
[ ] At least 1 error/negative scenario is tested (not just happy path)
[ ] Screenshots saved for each scenario (evidence-TICKET-ID-*.png)
[ ] Tests pass in QA environment (not just local)
[ ] Playwright tests run in CI (if configured)
```

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Testing only happy path | Every error scenario in ticket AC = one test scenario |
| Step definitions accessing DOM directly instead of through Page Object | All selectors must live in the Page Object class |
| Tests depend on each other (shared state) | Each scenario is isolated — use `BeforeScenario` to reset state |
| Hard-coding test users in step definitions | Use `process.env.QA_USER_*` from `.env.qa` |
| Skipping screenshots on `Then` steps | Every visual assertion = 1 screenshot for evidence |
| Writing feature files in Spanish | Feature files in English — same rule as all code/docs |

---

## See Also

- `core/sops/mcp-playwright.md` — Playwright MCP: browser control, visual testing, form testing
- `qa/sops/SQP.md` — Sovereign QA Process — where Playwright fits in the QA lifecycle
- `admin/commercial/ticket-issue-standards.md` — How to write the AC that become these tests
- Context7: `/vitalets/playwright-bdd` — BDD library docs
- Context7: `/microsoft/playwright.dev` — Playwright core docs
