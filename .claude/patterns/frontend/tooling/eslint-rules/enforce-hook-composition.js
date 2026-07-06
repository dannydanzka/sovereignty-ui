/**
 * ESLint Rule: enforce-hook-composition
 *
 * CODE SOVEREIGNTY PRINCIPLE: Self-Sufficiency + Territorial Integrity
 *
 * Enforces Single Responsibility Principle in React hooks by detecting:
 * - Hooks with too many lines (default: 200)
 * - Hooks with too many state variables (default: 8)
 * - Hooks with too many useCallback/useMemo (default: 10)
 *
 * Large hooks should be composed from smaller, focused hooks.
 *
 * DETECTED PATTERNS:
 * ❌ Hooks with >200 lines
 * ❌ Hooks with >8 useState calls
 * ❌ Hooks with >10 useCallback/useMemo calls
 *
 * RECOMMENDED PATTERN:
 * ```typescript
 * // ❌ BAD: Monolithic hook
 * const useUserManager = () => {
 *   const [state1, setState1] = useState();
 *   const [state2, setState2] = useState();
 *   // ... 15 more states, 400 lines
 * };
 *
 * // ✅ GOOD: Composed hooks
 * const useUserManager = () => {
 *   const filters = useUserFilters();
 *   const formModal = useUserFormModal();
 *   const confirmModal = useUserConfirmModal();
 *   // Orchestrator pattern
 * };
 * ```
 *
 * EXCEPTIONS:
 * - Test files
 * - Files in /hooks/ directories that end with .test.ts
 *
 * @context7 Code Sovereignty - Self-Sufficiency
 */

/** @type {import('eslint').Rule.RuleModule} */
export const enforceHookCompositionRule = {
  create: (context) => {
    const filename = context.filename || context.getFilename();
    const sourceCode = context.sourceCode || context.getSourceCode();

    // Skip test files
    if (
      filename.endsWith('.test.ts') ||
      filename.endsWith('.test.tsx') ||
      filename.endsWith('.spec.ts') ||
      filename.endsWith('.spec.tsx') ||
      filename.includes('__tests__')
    ) {
      return {};
    }

    const options = context.options[0] || {};
    const maxLines = options.maxLines || 200;
    const maxStateVariables = options.maxStateVariables || 8;
    const maxCallbacks = options.maxCallbacks || 10;

    /**
     * Check if a function is a custom hook (starts with 'use' and uppercase)
     */
    function isCustomHook(node) {
      let name = null;

      // Arrow function assigned to variable
      if (
        node.parent &&
        node.parent.type === 'VariableDeclarator' &&
        node.parent.id.type === 'Identifier'
      ) {
        name = node.parent.id.name;
      }

      // Function declaration
      if (node.id && node.id.type === 'Identifier') {
        name = node.id.name;
      }

      // Check if it's a hook (starts with 'use' followed by uppercase)
      return name && /^use[A-Z]/.test(name);
    }

    /**
     * Count useState calls in a function body
     */
    function countStateVariables(node) {
      let count = 0;
      const body = node.body;

      if (!body) return 0;

      const text = sourceCode.getText(body);
      const matches = text.match(/useState\s*[<(]/g);
      count = matches ? matches.length : 0;

      return count;
    }

    /**
     * Count useCallback and useMemo calls
     */
    function countCallbacks(node) {
      let count = 0;
      const body = node.body;

      if (!body) return 0;

      const text = sourceCode.getText(body);
      const callbackMatches = text.match(/useCallback\s*\(/g);
      const memoMatches = text.match(/useMemo\s*\(/g);

      count = (callbackMatches ? callbackMatches.length : 0) + (memoMatches ? memoMatches.length : 0);

      return count;
    }

    /**
     * Get the line count of a function
     */
    function getLineCount(node) {
      if (!node.loc) return 0;
      return node.loc.end.line - node.loc.start.line + 1;
    }

    /**
     * Get hook name for error message
     */
    function getHookName(node) {
      if (
        node.parent &&
        node.parent.type === 'VariableDeclarator' &&
        node.parent.id.type === 'Identifier'
      ) {
        return node.parent.id.name;
      }
      if (node.id && node.id.type === 'Identifier') {
        return node.id.name;
      }
      return 'anonymous hook';
    }

    function checkHook(node) {
      if (!isCustomHook(node)) return;

      const hookName = getHookName(node);
      const lineCount = getLineCount(node);
      const stateCount = countStateVariables(node);
      const callbackCount = countCallbacks(node);

      const issues = [];

      if (lineCount > maxLines) {
        issues.push(`${lineCount} lines (max: ${maxLines})`);
      }

      if (stateCount > maxStateVariables) {
        issues.push(`${stateCount} useState calls (max: ${maxStateVariables})`);
      }

      if (callbackCount > maxCallbacks) {
        issues.push(`${callbackCount} useCallback/useMemo calls (max: ${maxCallbacks})`);
      }

      if (issues.length > 0) {
        context.report({
          data: {
            hookName,
            issues: issues.join(', '),
          },
          message:
            'Hook "{{hookName}}" violates Single Responsibility Principle: {{issues}}. ' +
            'SOLUTION: Split into specialized hooks by responsibility: ' +
            '(1) useXxxFilters - search, sort, pagination state ' +
            '(2) useXxxFormModal - form state, validation, save logic ' +
            '(3) useXxxConfirmModal - delete/toggle confirmation ' +
            '(4) useXxxActions - CRUD operations. ' +
            'Then compose them in the main hook as orchestrator.',
          node: node.parent && node.parent.type === 'VariableDeclarator' ? node.parent : node,
        });
      }
    }

    return {
      ArrowFunctionExpression: checkHook,
      FunctionDeclaration: checkHook,
      FunctionExpression: checkHook,
    };
  },
  meta: {
    docs: {
      category: 'Best Practices',
      description:
        'Enforce Single Responsibility Principle in React hooks. Detect hooks that are too large and should be composed from smaller hooks.',
      recommended: true,
    },
    messages: {
      hookTooLarge:
        'Hook "{{hookName}}" violates Single Responsibility Principle: {{issues}}. Consider splitting into composed hooks.',
    },
    schema: [
      {
        additionalProperties: false,
        properties: {
          maxCallbacks: {
            default: 10,
            description: 'Maximum number of useCallback/useMemo calls allowed',
            minimum: 1,
            type: 'integer',
          },
          maxLines: {
            default: 200,
            description: 'Maximum number of lines allowed in a hook',
            minimum: 50,
            type: 'integer',
          },
          maxStateVariables: {
            default: 8,
            description: 'Maximum number of useState calls allowed',
            minimum: 1,
            type: 'integer',
          },
        },
        type: 'object',
      },
    ],
    type: 'suggestion',
  },
};
