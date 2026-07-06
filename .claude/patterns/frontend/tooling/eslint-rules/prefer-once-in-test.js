/**
 * ESLint Custom Rule: Prefer Once in Test
 *
 * Detects persistent mock configuration methods (without Once) inside it()/test()
 * bodies. Within a test block, prefer the *Once variants to ensure each test is
 * isolated and does not accidentally leak state to subsequent tests.
 *
 * Persistent variants reconfigure the mock globally (until the next clearMocks cycle),
 * which can mask failures or cause ordering-dependent flakiness if clearMocks is disabled.
 *
 * Bad (inside it() / test()):
 *   it('fetches users', async () => {
 *     vi.mocked(userService.getAll).mockResolvedValue(mockUsers);     // persists
 *     vi.mocked(userService.getAll).mockReturnValue(mockUsers);       // persists
 *     vi.mocked(userService.getAll).mockRejectedValue(new Error('!')); // persists
 *     vi.mocked(userService.getAll).mockImplementation(() => ...);    // persists
 *   });
 *
 * Good (inside it() / test()):
 *   it('fetches users', async () => {
 *     vi.mocked(userService.getAll).mockResolvedValueOnce(mockUsers);     // isolated
 *     vi.mocked(userService.getAll).mockReturnValueOnce(mockUsers);       // isolated
 *     vi.mocked(userService.getAll).mockRejectedValueOnce(new Error('!')); // isolated
 *     vi.mocked(userService.getAll).mockImplementationOnce(() => ...);    // isolated
 *   });
 *
 * Allowed contexts:
 *   - beforeEach / beforeAll: persistent setup is intentional
 *   - afterEach / afterAll: cleanup context
 *   - vi.fn().mockReturnValue(...): defining a new mock inline (not reconfiguring)
 *   - jest.fn().mockReturnValue(...): same as above
 *
 * Agnostic: works with both Vitest (vi.*) and Jest (jest.*).
 *
 * @see .claude/patterns/frontend/testing/vitest.md (Test Isolation)
 * @see .claude/patterns/core/testing/mocking.md
 */

const PERSISTENT_METHODS = new Set([
  'mockReturnValue',
  'mockResolvedValue',
  'mockRejectedValue',
  'mockImplementation',
]);

const LIFECYCLE_HOOKS = new Set(['beforeEach', 'beforeAll', 'afterEach', 'afterAll']);
const TEST_FUNCTIONS = new Set(['it', 'test']);

/**
 * Returns true if the node's call chain originates from vi.fn() or jest.fn().
 * Pattern: vi.fn().mockReturnValue(...) — this is defining a new mock, not
 * reconfiguring an existing shared mock.
 */
function isChainedFromNewFn(node) {
  let current = node.callee?.object;

  while (current) {
    if (
      current.type === 'CallExpression' &&
      current.callee?.type === 'MemberExpression' &&
      current.callee.object?.type === 'Identifier' &&
      ['vi', 'jest'].includes(current.callee.object.name) &&
      current.callee.property?.name === 'fn'
    ) {
      return true;
    }

    if (current.type === 'MemberExpression') {
      current = current.object;
    } else if (current.type === 'CallExpression') {
      current = current.callee?.object ?? null;
    } else {
      break;
    }
  }

  return false;
}

/** @type {import('eslint').Rule.RuleModule} */
export const preferOnceInTestRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Prefer *Once mock variants (mockResolvedValueOnce, etc.) inside it()/test() bodies to ensure test isolation',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: 'code',
    messages: {
      preferOnce:
        'Use {{method}}Once() inside test bodies for isolation. Reserve {{method}}() for beforeEach/beforeAll setup.',
    },
    schema: [],
  },

  create(context) {
    const filename = context.filename || context.getFilename();

    if (!filename.match(/\.(test|spec)\.(ts|tsx|js|jsx)$/)) {
      return {};
    }

    /**
     * Stack tracking whether we're inside a test body vs lifecycle hook body.
     * Each entry: 'test' | 'hook' | 'other'
     */
    const contextStack = [];

    function getCalleeName(node) {
      if (node.callee?.type === 'Identifier') return node.callee.name;
      if (node.callee?.type === 'MemberExpression' && node.callee.object?.type === 'Identifier') {
        return node.callee.object.name;
      }
      return null;
    }

    return {
      CallExpression(node) {
        const calleeName = getCalleeName(node);

        // Track context entry
        if (TEST_FUNCTIONS.has(calleeName)) {
          const callback = node.arguments[1] ?? node.arguments[0];
          if (
            callback &&
            ['ArrowFunctionExpression', 'FunctionExpression'].includes(callback.type)
          ) {
            contextStack.push('test');
            return;
          }
        }

        if (LIFECYCLE_HOOKS.has(calleeName)) {
          contextStack.push('hook');
          return;
        }

        // Only flag inside a test body
        if (contextStack[contextStack.length - 1] !== 'test') return;

        // Check for persistent mock methods
        if (
          node.callee?.type === 'MemberExpression' &&
          node.callee.property?.type === 'Identifier' &&
          PERSISTENT_METHODS.has(node.callee.property.name)
        ) {
          // Allow vi.fn().mockReturnValue(...) — inline new mock definition
          if (isChainedFromNewFn(node)) return;

          const method = node.callee.property.name;
          context.report({
            node,
            messageId: 'preferOnce',
            data: { method },
            fix(fixer) {
              return fixer.replaceText(node.callee.property, `${method}Once`);
            },
          });
        }
      },

      'CallExpression:exit'(node) {
        const calleeName = getCalleeName(node);
        if (TEST_FUNCTIONS.has(calleeName) || LIFECYCLE_HOOKS.has(calleeName)) {
          const callback = node.arguments[1] ?? node.arguments[0];
          if (
            callback &&
            ['ArrowFunctionExpression', 'FunctionExpression'].includes(callback.type)
          ) {
            contextStack.pop();
          }
        }
      },
    };
  },
};
