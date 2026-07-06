/**
 * ESLint Custom Rule: No Redundant Clear Mocks
 *
 * Detects vi.clearAllMocks()/jest.clearAllMocks() and vi.restoreAllMocks()/jest.restoreAllMocks()
 * in test files. These are redundant when the test runner is configured with:
 *   clearMocks: true / restoreMocks: true
 * Agnostic: works with both Vitest and Jest.
 */

const REDUNDANT_METHODS = new Set(['clearAllMocks', 'restoreAllMocks']);

/** @type {import('eslint').Rule.RuleModule} */
export const noRedundantClearMocksRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Disallow vi.clearAllMocks()/vi.restoreAllMocks() — already configured globally',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      redundantClear:
        'Redundant call: {{method}}() is already configured globally (clearMocks/restoreMocks: true). Remove this call.',
    },
    schema: [],
  },

  create(context) {
    const filename = context.filename || context.getFilename();

    if (!filename.match(/\.(test|spec)\.(ts|tsx|js|jsx)$/)) {
      return {};
    }

    return {
      CallExpression(node) {
        // Agnostic: detect both vi.* and jest.*
        if (
          node.callee.type === 'MemberExpression' &&
          node.callee.object.type === 'Identifier' &&
          (node.callee.object.name === 'vi' || node.callee.object.name === 'jest') &&
          node.callee.property.type === 'Identifier' &&
          REDUNDANT_METHODS.has(node.callee.property.name)
        ) {
          context.report({
            node,
            messageId: 'redundantClear',
            data: { method: node.callee.property.name },
          });
        }
      },
    };
  },
};
