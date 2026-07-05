/**
 * ESLint Custom Rule: Prefer Centralized Assertions
 *
 * Detects inline assertion patterns that have centralized equivalents in @testing:
 *
 * - expect(screen.getByText(x)).toBeInTheDocument()  → assertText(x)
 * - expect(screen.queryByText(x)).not.toBeInTheDocument() → assertNoText(x)
 * - expect(screen.getByTestId(x)).toBeInTheDocument() → assertTestId(x)
 * - expect(screen.getByRole(x)).toBeInTheDocument() → assertRole(x)
 * - expect(screen.queryByRole(x)).not.toBeInTheDocument() → assertNoRole(x)
 *
 * @see src/libs/shared/testing/utils/test-helpers/test-helpers.ts
 */

/**
 * Map of screen query method → suggested centralized helper
 */
const QUERY_TO_HELPER = {
  getByText: 'assertText',
  getByTestId: 'assertTestId',
  getByRole: 'assertRole',
};

const NEGATIVE_QUERY_TO_HELPER = {
  queryByText: 'assertNoText',
  queryByRole: 'assertNoRole',
};

/** @type {import('eslint').Rule.RuleModule} */
export const preferCentralizedAssertionsRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Prefer centralized assertion helpers (assertText, assertTestId, etc.) over inline expect(screen.getBy*).toBeInTheDocument()',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      preferHelper:
        'Use {{helper}}() from @testing instead of expect(screen.{{query}}(...)).toBeInTheDocument().',
      preferNegativeHelper:
        'Use {{helper}}() from @testing instead of expect(screen.{{query}}(...)).not.toBeInTheDocument().',
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
        // Match: expect(...).toBeInTheDocument()
        if (!isToBeInTheDocumentCall(node)) return;

        // Get the expect() call
        const expectCall = getExpectCall(node);
        if (!expectCall) return;

        // Get the argument to expect()
        const expectArg = expectCall.arguments[0];
        if (!expectArg) return;

        // Check if it's screen.getBy* or screen.queryBy*
        const screenQuery = getScreenQueryName(expectArg);
        if (!screenQuery) return;

        // Check if this is a .not chain
        const isNegated = isNotChain(node);

        if (isNegated && NEGATIVE_QUERY_TO_HELPER[screenQuery]) {
          context.report({
            node,
            messageId: 'preferNegativeHelper',
            data: {
              helper: NEGATIVE_QUERY_TO_HELPER[screenQuery],
              query: screenQuery,
            },
          });
        } else if (!isNegated && QUERY_TO_HELPER[screenQuery]) {
          context.report({
            node,
            messageId: 'preferHelper',
            data: {
              helper: QUERY_TO_HELPER[screenQuery],
              query: screenQuery,
            },
          });
        }
      },
    };
  },
};

/**
 * Check if a CallExpression is .toBeInTheDocument()
 */
function isToBeInTheDocumentCall(node) {
  return (
    node.callee.type === 'MemberExpression' &&
    node.callee.property.type === 'Identifier' &&
    node.callee.property.name === 'toBeInTheDocument'
  );
}

/**
 * Extract the expect() CallExpression from a matcher chain.
 * Handles: expect(x).toBeInTheDocument() and expect(x).not.toBeInTheDocument()
 */
function getExpectCall(node) {
  // expect(x).toBeInTheDocument() → callee is expect(x).toBeInTheDocument
  let obj = node.callee.object;

  // Handle .not chain: expect(x).not.toBeInTheDocument()
  if (
    obj &&
    obj.type === 'MemberExpression' &&
    obj.property.type === 'Identifier' &&
    obj.property.name === 'not'
  ) {
    obj = obj.object;
  }

  if (
    obj &&
    obj.type === 'CallExpression' &&
    obj.callee.type === 'Identifier' &&
    obj.callee.name === 'expect'
  ) {
    return obj;
  }

  return null;
}

/**
 * Check if the chain includes .not before the matcher
 */
function isNotChain(node) {
  const obj = node.callee.object;
  return (
    obj &&
    obj.type === 'MemberExpression' &&
    obj.property.type === 'Identifier' &&
    obj.property.name === 'not'
  );
}

/**
 * Get the screen query method name from a CallExpression argument
 * e.g., screen.getByText('x') → 'getByText'
 */
function getScreenQueryName(node) {
  if (
    node.type === 'CallExpression' &&
    node.callee.type === 'MemberExpression' &&
    node.callee.object.type === 'Identifier' &&
    node.callee.object.name === 'screen' &&
    node.callee.property.type === 'Identifier'
  ) {
    return node.callee.property.name;
  }
  return null;
}
