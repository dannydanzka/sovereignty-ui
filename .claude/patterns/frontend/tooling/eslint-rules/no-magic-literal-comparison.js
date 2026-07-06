/**
 * ESLint Rule: no-magic-literal-comparison
 *
 * Enforces that string literals AND numeric literals in equality comparisons
 * (===, !==) are replaced with named constants defined in .constants.ts files.
 *
 * Philosophy: "If a literal represents a discrete state, mode, threshold, or
 * category, it belongs in a constant — not scattered across component logic."
 *
 * WHY:
 * - Magic literals make code abstract: what does `status === 3` mean?
 * - Constants make refactoring safer (rename in one place)
 * - Constants improve readability: TAB_IDS.PAYMENTS vs 'payments', JWT_PARTS vs 3
 * - Aligns with Sovereignty Principle #1: Gobernanza Explicita
 *
 * SCOPE:
 * - Component files (.tsx)
 * - Hook files (use*.ts)
 *
 * STRINGS — DETECTS:
 *   activeTab === 'payments'          → use TABS.PAYMENTS
 *   status !== 'ACTIVE'               → use STATUS.ACTIVE
 *   step === 'shipping'               → use STEPS.SHIPPING
 *
 * NUMBERS — DETECTS:
 *   parts.length !== 3                → use JWT_PARTS_COUNT = 3
 *   maxAttempts === 5                 → use MAX_ATTEMPTS = 5
 *
 * NUMBERS — IGNORES (trivial boundaries):
 *   array.length === 0                → empty check (0 is always allowed)
 *   currentPage === 1                 → first page boundary (1 is always allowed)
 *   indexOf(...) === -1               → not found sentinel (-1 is always allowed)
 *   progressPercentage === 100        → percentage complete (100 is always allowed)
 *   totalPages === 0                  → no pages (0 is always allowed)
 *
 * @version 2.0.0
 * @reviewed 2026-03-06
 */

/** @type {import('eslint').Rule.RuleModule} */
export const noMagicLiteralComparisonRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Enforce named constants instead of string or numeric literals in equality comparisons. Define constants in .constants.ts files.',
      recommended: true,
    },
    messages: {
      noMagicString:
        'String literal "{{value}}" in comparison should be a named constant. Define it in the nearest .constants.ts file and import it.',
      noMagicNumber:
        'Numeric literal {{value}} in comparison should be a named constant. Define it in the nearest .constants.ts file and import it.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          allowedValues: {
            type: 'array',
            items: { type: 'string' },
            description: 'Additional string values to allow in comparisons',
          },
          allowedNumbers: {
            type: 'array',
            items: { type: 'number' },
            description: 'Additional numeric values to allow in comparisons',
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create: (context) => {
    const filename = context.filename || context.getFilename();

    // Only check component (.tsx) and hook (use*.ts) files
    const isComponent = /\.tsx$/.test(filename);
    const isHook = /use[A-Z][^/]*\.ts$/.test(filename);

    if (!isComponent && !isHook) return {};

    // Skip files that don't need this check
    const skipPatterns = [
      /\.(test|spec)\./,
      /\.(interfaces|types)\./,
      /\.(constants)\./,
      /\.(styled)\./,
      /\.(entity)\./,
      /\.mock\./,
      /\/mocks?\//,
      /__tests__\//,
    ];
    if (skipPatterns.some((p) => p.test(filename))) return {};

    const options = context.options[0] || {};
    const extraAllowedStrings = options.allowedValues || [];
    const extraAllowedNumbers = options.allowedNumbers || [];

    // String values that are safe to use inline
    const ALLOWED_STRINGS = new Set([
      // Empty
      '',
      // HTML input types
      'text', 'submit', 'button', 'radio', 'checkbox', 'tel', 'email',
      'password', 'color', 'number', 'search', 'url', 'date', 'file',
      'hidden', 'range',
      // Sort directions
      'asc', 'desc',
      // Text directions
      'ltr', 'rtl',
      // Common CSS/layout
      'block', 'inline', 'flex', 'grid', 'none',
      'row', 'column',
      'center', 'left', 'right', 'top', 'bottom',
      'auto', 'inherit', 'initial',
      // HTTP methods
      'GET', 'POST', 'PUT', 'PATCH', 'DELETE',
      // Boolean-like
      'true', 'false',
      // Keyboard events
      'Escape', 'Enter', 'Tab', 'Space', 'ArrowUp', 'ArrowDown',
      'ArrowLeft', 'ArrowRight', 'Backspace', 'Delete',
      // Misc safe
      'production', 'development', 'test',
      // Object property/field names (used in sorting, form fields)
      'order', 'progressValue', 'type', 'status', 'slug', 'age', 'user',
      // UI variants and states
      'success', 'error', 'processing', 'probably', 'maybe',
      // Breakpoints
      'sm', 'md', 'lg', 'xl',
      // Separators
      ' ',
      // Common filter values (shared across screens)
      'all', 'active', 'inactive', 'available', 'unavailable',
      // Common modal/UI action types
      'create', 'edit', 'delete', 'blocked',
      ...extraAllowedStrings,
    ]);

    // Numeric values that are safe to use inline (trivial boundaries)
    const ALLOWED_NUMBERS = new Set([
      0,    // Empty check: array.length === 0, count === 0, totalPages === 0
      1,    // First page / singular boundary: currentPage === 1, count === 1
      -1,   // Not-found sentinel: indexOf === -1
      100,  // Percentage complete: progressPercentage === 100
      ...extraAllowedNumbers,
    ]);

    /**
     * Check if a node is inside a typeof expression
     * typeof x === 'string'
     */
    const isTypeofComparison = (node) => {
      if (node.type !== 'BinaryExpression') return false;
      return (
        (node.left.type === 'UnaryExpression' && node.left.operator === 'typeof') ||
        (node.right.type === 'UnaryExpression' && node.right.operator === 'typeof')
      );
    };

    /**
     * Check if a string is inside a .includes() call
     */
    const isInsideIncludesCall = (node) => {
      const parent = node.parent;
      if (!parent) return false;
      if (
        parent.type === 'CallExpression' &&
        parent.callee?.type === 'MemberExpression' &&
        parent.callee.property?.name === 'includes'
      ) {
        return true;
      }
      return false;
    };

    /**
     * Check if a node is in a switch case
     */
    const isInSwitchCase = (node) => {
      let current = node.parent;
      while (current) {
        if (current.type === 'SwitchCase') return true;
        current = current.parent;
      }
      return false;
    };

    /**
     * Check if a node is a property key or computed property access
     */
    const isPropertyAccess = (node) => {
      const parent = node.parent;
      if (!parent) return false;
      // obj['key'] or { 'key': value }
      if (parent.type === 'MemberExpression' && parent.computed && parent.property === node) return true;
      if (parent.type === 'Property' && parent.key === node) return true;
      return false;
    };

    /**
     * Check if a node is inside a constant/variable declaration at module level
     * (e.g., const TABS = { GENERAL: 'general' } or const MAX = 3)
     */
    const isInConstantDefinition = (node) => {
      let current = node.parent;
      while (current) {
        if (
          current.type === 'VariableDeclarator' &&
          current.id?.type === 'Identifier' &&
          /^[A-Z_][A-Z0-9_]*$/.test(current.id.name)
        ) {
          return true;
        }
        if (current.type === 'VariableDeclaration') break;
        current = current.parent;
      }
      return false;
    };

    return {
      BinaryExpression: (node) => {
        // Only check === and !==
        if (node.operator !== '===' && node.operator !== '!==') return;

        // Skip typeof comparisons
        if (isTypeofComparison(node)) return;

        const checkSide = (side) => {
          if (side.type !== 'Literal') return;

          // --- String literal check ---
          if (typeof side.value === 'string') {
            const value = side.value;

            if (ALLOWED_STRINGS.has(value)) return;
            if (isPropertyAccess(side)) return;
            if (isInsideIncludesCall(node)) return;
            if (isInSwitchCase(side)) return;
            if (isInConstantDefinition(side)) return;

            context.report({
              node: side,
              messageId: 'noMagicString',
              data: { value },
            });
          }

          // --- Numeric literal check ---
          if (typeof side.value === 'number') {
            const value = side.value;

            if (ALLOWED_NUMBERS.has(value)) return;
            if (isInSwitchCase(side)) return;
            if (isInConstantDefinition(side)) return;

            context.report({
              node: side,
              messageId: 'noMagicNumber',
              data: { value },
            });
          }
        };

        checkSide(node.left);
        checkSide(node.right);
      },
    };
  },
};
