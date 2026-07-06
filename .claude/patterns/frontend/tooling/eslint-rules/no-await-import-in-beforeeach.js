/**
 * ESLint Custom Rule: No Await Import in beforeEach
 *
 * Detects `await import(...)` inside beforeEach/beforeAll blocks.
 * This pattern is fragile and should use the framework's mock() at module level instead.
 * Agnostic: works with both Vitest and Jest.
 *
 * Bad:
 *   beforeEach(async () => {
 *     const mod = await import('@repositories/user');
 *     vi.spyOn(mod, 'findById');
 *   });
 *
 * Good:
 *   vi.mock('@repositories/user');
 *   // then use vi.mocked() in tests
 */

/** @type {import('eslint').Rule.RuleModule} */
export const noAwaitImportInBeforeEachRule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow dynamic await import() inside beforeEach — use vi.mock() + vi.mocked() instead',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      noAwaitImport:
        'Avoid `await import()` in beforeEach/beforeAll. Use mock("{{module}}") at module level and mocked() in tests.',
    },
    schema: [],
  },

  create(context) {
    const filename = context.filename || context.getFilename();

    if (!filename.match(/\.(test|spec)\.(ts|tsx|js|jsx)$/)) {
      return {};
    }

    const HOOK_NAMES = new Set(['beforeEach', 'beforeAll']);
    let insideHook = false;

    return {
      CallExpression(node) {
        if (
          node.callee.type === 'Identifier' &&
          HOOK_NAMES.has(node.callee.name)
        ) {
          insideHook = true;
        }
      },

      'CallExpression:exit'(node) {
        if (
          node.callee.type === 'Identifier' &&
          HOOK_NAMES.has(node.callee.name)
        ) {
          insideHook = false;
        }
      },

      ImportExpression(node) {
        if (!insideHook) return;

        const source = node.source;
        const moduleName =
          source.type === 'Literal' ? source.value : '<dynamic>';

        context.report({
          node,
          messageId: 'noAwaitImport',
          data: { module: moduleName },
        });
      },
    };
  },
};
