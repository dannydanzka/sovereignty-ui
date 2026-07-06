/**
 * ESLint Custom Rule: No Inline Hook Mock Factory
 *
 * Detects arrow/function expressions inside vi.mock()/jest.mock() factories
 * that return object or array LITERALS directly.
 *
 * This is the "unstable reference" anti-pattern: each render/call creates a new
 * object/array reference, causing React to detect a state change, triggering
 * re-renders, which creates an infinite loop → Worker OOM crash.
 *
 * Bad:
 *   vi.mock('@hooks/useAuth', () => ({
 *     useAuth: () => ({ user: mockUser, isLoading: false }),   // new object each call
 *     useData: () => ([item1, item2]),                          // new array each call
 *   }));
 *
 * Good (stable reference via vi.hoisted()):
 *   const { stableUser } = vi.hoisted(() => ({
 *     stableUser: { user: mockUser, isLoading: false },
 *   }));
 *   vi.mock('@hooks/useAuth', () => ({
 *     useAuth: () => stableUser,  // returns existing reference
 *   }));
 *
 * Allowed (primitives and vi.fn() are safe):
 *   vi.mock('@hooks/useFlag', () => ({ useFlag: () => true }));
 *   vi.mock('@hooks/useService', () => ({ getById: vi.fn() }));
 *
 * Agnostic: works with both vi.mock() and jest.mock().
 *
 * @see .claude/patterns/frontend/testing/vitest.md (Stable References in Hook Mocks)
 */

/**
 * Checks if a node is a vi.mock() or jest.mock() call with a factory argument.
 */
function isMockCallWithFactory(node) {
  if (node.type !== 'CallExpression') return false;
  if (node.callee.type !== 'MemberExpression') return false;

  const obj = node.callee.object;
  const method = node.callee.property;

  if (
    obj.type !== 'Identifier' ||
    !['vi', 'jest'].includes(obj.name)
  ) return false;

  if (
    method.type !== 'Identifier' ||
    method.name !== 'mock'
  ) return false;

  // Must have a factory (2nd argument that is a function)
  return (
    node.arguments.length >= 2 &&
    ['ArrowFunctionExpression', 'FunctionExpression'].includes(node.arguments[1].type)
  );
}

/**
 * Returns the direct return value of an arrow function or function expression.
 * Handles both concise body (() => expr) and block body (() => { return expr }).
 * Returns null if the return value cannot be determined statically.
 */
function getDirectReturnValue(fn) {
  if (!['ArrowFunctionExpression', 'FunctionExpression'].includes(fn.type)) {
    return null;
  }

  // Concise arrow: () => expression
  if (fn.type === 'ArrowFunctionExpression' && fn.body.type !== 'BlockStatement') {
    return fn.body;
  }

  // Block body: search for first return statement
  if (fn.body && fn.body.type === 'BlockStatement') {
    for (const stmt of fn.body.body) {
      if (stmt.type === 'ReturnStatement' && stmt.argument) {
        return stmt.argument;
      }
    }
  }

  return null;
}

/** @type {import('eslint').Rule.RuleModule} */
export const noInlineHookMockFactoryRule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow inline object/array literals returned by functions inside vi.mock() factories — use vi.hoisted() for stable references',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      inlineObjectReturn:
        '"{{key}}" returns an inline object literal on every call — use vi.hoisted() for a stable reference to prevent infinite re-renders.',
      inlineArrayReturn:
        '"{{key}}" returns an inline array literal on every call — use vi.hoisted() for a stable reference to prevent infinite re-renders.',
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
        if (!isMockCallWithFactory(node)) return;

        const factory = node.arguments[1];

        // Get what the factory returns (the module shape)
        const factoryReturn = getDirectReturnValue(factory);
        if (!factoryReturn || factoryReturn.type !== 'ObjectExpression') return;

        // Inspect each exported property
        for (const prop of factoryReturn.properties) {
          if (prop.type !== 'Property') continue;

          const propValue = prop.value;
          if (
            !['ArrowFunctionExpression', 'FunctionExpression'].includes(propValue.type)
          ) continue;

          const returnValue = getDirectReturnValue(propValue);
          if (!returnValue) continue;

          const keyName =
            prop.key.type === 'Identifier'
              ? prop.key.name
              : prop.key.type === 'Literal'
                ? String(prop.key.value)
                : '?';

          if (returnValue.type === 'ObjectExpression') {
            context.report({
              node: propValue,
              messageId: 'inlineObjectReturn',
              data: { key: keyName },
            });
          } else if (returnValue.type === 'ArrayExpression') {
            context.report({
              node: propValue,
              messageId: 'inlineArrayReturn',
              data: { key: keyName },
            });
          }
        }
      },
    };
  },
};
