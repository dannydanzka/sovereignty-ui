/**
 * ESLint Custom Rule: Prefer Mocked Helper
 *
 * Detects `as Mock` and `as Mocked<typeof x>` type casts in test files.
 * These should use the framework's mocked() helper for type-safe mock assertions.
 * Agnostic: works with both Vitest (vi.mocked) and Jest (jest.mocked / jest.MockedFunction).
 *
 * Bad:  (myFn as Mock).mockResolvedValue(...)
 * Good: vi.mocked(myFn).mockResolvedValue(...)  // Vitest
 * Good: jest.mocked(myFn).mockResolvedValue(...) // Jest
 */

/** @type {import('eslint').Rule.RuleModule} */
export const preferMockedHelperRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prefer framework mocked() helper over `as Mock` / `as Mocked<>` type casts',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      preferMockedHelper:
        'Use mocked() helper instead of `as {{castType}}`. Example: vi.mocked(fn) or jest.mocked(fn)',
    },
    schema: [],
  },

  create(context) {
    const filename = context.filename || context.getFilename();

    if (!filename.match(/\.(test|spec)\.(ts|tsx|js|jsx)$/)) {
      return {};
    }

    return {
      TSAsExpression(node) {
        const typeAnnotation = node.typeAnnotation;

        // Detect `as Mock`
        if (
          typeAnnotation.type === 'TSTypeReference' &&
          typeAnnotation.typeName.type === 'Identifier' &&
          typeAnnotation.typeName.name === 'Mock'
        ) {
          context.report({
            node,
            messageId: 'preferMockedHelper',
            data: { castType: 'Mock' },
          });
          return;
        }

        // Detect `as Mocked<typeof x>`
        if (
          typeAnnotation.type === 'TSTypeReference' &&
          typeAnnotation.typeName.type === 'Identifier' &&
          typeAnnotation.typeName.name === 'Mocked'
        ) {
          context.report({
            node,
            messageId: 'preferMockedHelper',
            data: { castType: 'Mocked<>' },
          });
        }
      },
    };
  },
};
