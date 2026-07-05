/**
 * ESLint Rule: e2e-testing-policy
 *
 * Enforces Playwright E2E testing best practices in .spec.ts files.
 *
 * ERRORS:
 * - No vi.mock() / vi.fn() — E2E tests use real services, not mocks
 * - No page.waitForTimeout() — use auto-wait or waitForURL
 * - No CSS/XPath selectors — use semantic locators (getByRole, getByLabel, getByText)
 * - No inline timeout literals > 5_000 ms — use TIMEOUTS.* from e2e/support/timeouts.ts
 *
 * WARNINGS:
 * - No hardcoded credentials — use process.env.E2E_*
 * - No page.$() / page.$$() — use page.getBy* locators
 */

export const e2eTestingPolicyRule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce Playwright E2E testing best practices',
      category: 'Testing',
    },
    messages: {
      noViMock: 'E2E tests must not use vi.mock(). Playwright tests use real services, not Vitest mocks.',
      noViFunc: 'E2E tests must not use vi.fn(). Use real implementations or Playwright route interception.',
      noWaitForTimeout:
        'Avoid page.waitForTimeout(). Use auto-wait (expect().toBeVisible()), waitForURL(), or waitForSelector().',
      noCssSelector:
        "Avoid CSS selectors in page.locator('{{selector}}'). Use getByRole(), getByLabel(), getByText(), or getByTestId().",
      noPageDollar:
        'Avoid page.$() / page.$$() / page.evaluate(). Use Playwright locators (getByRole, getByLabel, getByText).',
      noHardcodedCredentials:
        "Do not hardcode credentials in test files. Use process.env.E2E_* from .env.local.",
      noInlineTimeout:
        'Inline timeout of {{value}}ms exceeds the 5s budget. Use TIMEOUTS.* from e2e/support/timeouts.ts (VISIBLE, PAGE_LOAD, OVERLAY_HIDDEN, LOGIN_REDIRECT, TEST) and document the justification in the pattern doc if a new budget is required.',
    },
    schema: [],
  },
  create(context) {
    return {
      // No vi.mock() in E2E tests
      CallExpression(node) {
        // vi.mock()
        if (
          node.callee.type === 'MemberExpression' &&
          node.callee.object.name === 'vi' &&
          node.callee.property.name === 'mock'
        ) {
          context.report({ node, messageId: 'noViMock' });
        }

        // vi.fn()
        if (
          node.callee.type === 'MemberExpression' &&
          node.callee.object.name === 'vi' &&
          node.callee.property.name === 'fn'
        ) {
          context.report({ node, messageId: 'noViFunc' });
        }

        // page.waitForTimeout()
        if (
          node.callee.type === 'MemberExpression' &&
          node.callee.property.name === 'waitForTimeout'
        ) {
          context.report({ node, messageId: 'noWaitForTimeout' });
        }

        // page.$() / page.$$()
        if (
          node.callee.type === 'MemberExpression' &&
          (node.callee.property.name === '$' || node.callee.property.name === '$$')
        ) {
          context.report({ node, messageId: 'noPageDollar' });
        }
      },

      // Detect inline timeout literals > 5_000 ms in options objects
      // Flags: { timeout: 10_000 }, { timeout: 15000 }, etc.
      // Allows: { timeout: 5_000 } and { timeout: TIMEOUTS.X }
      'Property[key.name="timeout"]'(node) {
        const val = node.value;
        if (val.type !== 'Literal' || typeof val.value !== 'number') return;
        if (val.value <= 5_000) return;
        // Allow inside e2e/support/ (where constants themselves are defined)
        const filename = context.getFilename();
        if (filename.includes('/e2e/support/')) return;
        context.report({
          node: val,
          messageId: 'noInlineTimeout',
          data: { value: String(val.value) },
        });
      },

      // Detect CSS/XPath selectors in page.locator()
      'CallExpression[callee.property.name="locator"]'(node) {
        const arg = node.arguments[0];
        if (arg && arg.type === 'Literal' && typeof arg.value === 'string') {
          const selector = arg.value;
          // Allow [role="..."] and [data-testid="..."] as they are semantic
          if (
            selector.startsWith('.') ||
            selector.startsWith('#') ||
            selector.includes(' > ') ||
            selector.includes(' ~ ') ||
            selector.includes(' + ') ||
            /^[a-z]+$/i.test(selector) // bare tag name like 'div', 'span'
          ) {
            // Allow known exceptions
            const exceptions = ['dialog', 'form', 'main', 'nav', 'header', 'footer', 'section'];
            if (!exceptions.includes(selector.toLowerCase())) {
              context.report({
                node,
                messageId: 'noCssSelector',
                data: { selector },
              });
            }
          }
        }
      },

      // Detect hardcoded email/password patterns
      'Literal'(node) {
        if (typeof node.value !== 'string') return;
        const val = node.value;

        // Skip short strings and env var references
        if (val.length < 5) return;

        // Detect common credential patterns (exclude test/example domains)
        const isEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val);
        const isSafeTestEmail = /@(test|example|localhost|mock|fake|invalid)\b/i.test(val);
        if (isEmail && isSafeTestEmail) return; // test emails are fine
        const isPassword = /^(password|pass|pwd|secret|admin|usuario)\d*$/i.test(val);

        // Only flag if it looks like a real credential (not a test assertion pattern)
        if (isEmail || isPassword) {
          // Check if parent is process.env access — that's fine
          const parent = node.parent;
          if (
            parent &&
            parent.type === 'MemberExpression' &&
            parent.object.type === 'MemberExpression' &&
            parent.object.property.name === 'env'
          ) {
            return; // process.env.X === 'value' — OK
          }

          // Check if it's in a comparison with process.env — that's fine too
          if (parent && parent.type === 'BinaryExpression') {
            const other = parent.left === node ? parent.right : parent.left;
            if (other && other.type === 'MemberExpression') {
              const src = context.getSourceCode().getText(other);
              if (src.includes('process.env')) return;
            }
          }

          // Check if inside test.skip() call — that's a skip message, not a credential
          if (parent && parent.type === 'CallExpression') {
            const calleeSrc = context.getSourceCode().getText(parent.callee);
            if (calleeSrc.includes('skip')) return;
          }

          // Flag emails in fill() calls or login() calls
          if (
            parent &&
            parent.type === 'CallExpression' &&
            parent.callee.type === 'MemberExpression'
          ) {
            const methodName = parent.callee.property.name;
            if (['fill', 'login', 'type'].includes(methodName) && isEmail) {
              context.report({ node, messageId: 'noHardcodedCredentials' });
            }
          }
        }
      },
    };
  },
};
