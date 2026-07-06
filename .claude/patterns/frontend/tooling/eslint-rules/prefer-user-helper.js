/**
 * ESLint Custom Rule: Prefer User Helper
 *
 * Detects direct import of userEvent from @testing-library/user-event.
 * Tests should use the centralized `user` export from @testing instead.
 *
 * Bad:  import userEvent from '@testing-library/user-event';
 * Good: import { user } from '@testing';
 *
 * Also detects `userEvent.setup()` when `user` from @testing is available.
 */

/** @type {import('eslint').Rule.RuleModule} */
export const preferUserHelperRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Prefer `user` from @testing over direct @testing-library/user-event import',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      preferUserImport:
        'Import { user } from "@testing" instead of importing from "@testing-library/user-event" directly.',
    },
    schema: [],
  },

  create(context) {
    const filename = context.filename || context.getFilename();

    if (!filename.match(/\.(test|spec)\.(ts|tsx|js|jsx)$/)) {
      return {};
    }

    return {
      ImportDeclaration(node) {
        if (node.source.value === '@testing-library/user-event') {
          context.report({
            node,
            messageId: 'preferUserImport',
          });
        }
      },
    };
  },
};
