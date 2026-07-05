/**
 * ESLint Custom Rule: No English in Mock Errors
 *
 * Detects English error messages inside `new Error('...')` in test files.
 * All test data must use the project locale (Spanish for DearAdry).
 *
 * The `essential-testing` rule already catches English names and emails.
 * This rule specifically targets error message strings passed to `new Error()`,
 * which are commonly used in mockRejectedValue / mockRejectedValueOnce setups.
 *
 * Bad:  mockRepo.findById.mockRejectedValue(new Error('Network error'))
 * Good: mockRepo.findById.mockRejectedValue(new Error('Error de red'))
 *
 * Agnostic: works with both Vitest and Jest.
 * Configurable: custom patterns can be added via rule options.
 *
 * @see .claude/patterns/frontend/testing/vitest.md (Mock Data Rules)
 * @see .claude/patterns/core/testing/mocking.md
 */

/**
 * Default English error phrases to detect.
 * These are generic infrastructure/network error messages that are commonly
 * copy-pasted in English when they should follow the project locale.
 *
 * Pattern: full string match (case-insensitive) to avoid false positives.
 */
const DEFAULT_ENGLISH_ERROR_PATTERNS = [
  /^Network error$/i,
  /^Database error$/i,
  /^Unexpected error$/i,
  /^Server error$/i,
  /^Connection error$/i,
  /^Internal error$/i,
  /^Internal server error$/i,
  /^Service unavailable$/i,
  /^Permission denied$/i,
  /^Access denied$/i,
  /^Unauthorized$/i,
  /^Forbidden$/i,
  /^Not found$/i,
  /^Bad request$/i,
  /^Timeout$/i,
  /^Request timeout$/i,
  /^Connection refused$/i,
  /^Something went wrong$/i,
  /^An error occurred$/i,
  /^Unknown error$/i,
  /^Failed to fetch$/i,
  /^Request failed$/i,
];

/** @type {import('eslint').Rule.RuleModule} */
export const noEnglishInMockErrorsRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Disallow English error messages in new Error() constructor within test files — use project locale instead',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      englishErrorMessage:
        'English error message detected: "{{message}}". Use project locale (e.g., "Error de red", "Error de base de datos").',
    },
    schema: [
      {
        type: 'object',
        properties: {
          additionalPatterns: {
            type: 'array',
            items: { type: 'string' },
            description: 'Additional regex patterns (strings) to flag as English error messages',
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const filename = context.filename || context.getFilename();

    if (!filename.match(/\.(test|spec)\.(ts|tsx|js|jsx)$/)) {
      return {};
    }

    const options = context.options[0] ?? {};
    const extraPatterns = (options.additionalPatterns ?? []).map((p) => new RegExp(p, 'i'));
    const allPatterns = [...DEFAULT_ENGLISH_ERROR_PATTERNS, ...extraPatterns];

    return {
      NewExpression(node) {
        // Only target: new Error('...')
        if (
          node.callee.type !== 'Identifier' ||
          node.callee.name !== 'Error'
        ) {
          return;
        }

        const firstArg = node.arguments[0];
        if (
          !firstArg ||
          firstArg.type !== 'Literal' ||
          typeof firstArg.value !== 'string'
        ) {
          return;
        }

        const message = firstArg.value.trim();

        for (const pattern of allPatterns) {
          if (pattern.test(message)) {
            context.report({
              node: firstArg,
              messageId: 'englishErrorMessage',
              data: { message: message.slice(0, 60) },
            });
            return;
          }
        }
      },
    };
  },
};
