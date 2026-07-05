/**
 * ESLint Rule: no-underscore-prefix
 *
 * Enforces that underscore prefix is NOT used for function parameters.
 * The convention of using `_` to mark unused variables is discouraged because:
 * - It hides unused code that should be removed
 * - TypeScript already detects unused parameters
 * - It creates inconsistency in the codebase
 *
 * ENFORCES:
 * 1. NO underscore prefix allowed in function parameters (e.g., _request, _error)
 * 2. NO underscore prefix in catch blocks (e.g., catch (_error))
 *
 * SCOPE:
 * - This rule ONLY enforces underscore prefix prohibition
 * - @typescript-eslint/no-unused-vars handles unused parameter detection
 * - custom/no-try-catch-abuse handles catch block logging validation
 * - This separation provides better TypeScript support and fewer false positives
 *
 * EXCEPTIONS:
 * - TypeScript interfaces/types (not implementation)
 * - Test files (mocking purposes)
 *
 * @reviewed 2026-01-17
 */

/** @type {import('eslint').Rule.RuleModule} */
export const noUnderscorePrefixRule = {
  create: (context) => {
    const filename = context.filename || context.getFilename();

    // Skip test files
    const isTestFile = /\.(test|spec)\.(ts|tsx|js|jsx)$/.test(filename);
    if (isTestFile) {
      return {};
    }

    // Skip interfaces/types
    const isTypeFile = /\.(interfaces|types)\.(ts|tsx)$/.test(filename);
    if (isTypeFile) {
      return {};
    }

    return {
      // Check function parameters for underscore prefix ONLY
      'FunctionDeclaration, FunctionExpression, ArrowFunctionExpression': (node) => {
        if (!node.params || node.params.length === 0) return;

        node.params.forEach((param) => {
          // Check for underscore prefix - ONLY enforcement
          if (param.type === 'Identifier' && param.name.startsWith('_')) {
            context.report({
              message:
                'Underscore prefix for unused parameters is forbidden. Either use the parameter or remove it entirely. TypeScript will detect truly unused parameters.',
              node: param,
            });
          }
        });
      },

      // Check catch clauses for underscore prefix ONLY
      CatchClause: (node) => {
        if (node.param) {
          const errorParam = node.param;
          const errorName = errorParam.type === 'Identifier' ? errorParam.name : null;

          if (errorName && errorName.startsWith('_')) {
            context.report({
              message:
                'Underscore prefix for catch error is forbidden. Use a descriptive name or parameterless catch block.',
              node: errorParam,
            });
          }
        }
      },
    };
  },
  meta: {
    docs: {
      description:
        'Forbid underscore prefix for parameters. Works in conjunction with @typescript-eslint/no-unused-vars and custom/no-try-catch-abuse for catch block validation.',
      recommended: true,
    },
    messages: {
      noUnderscorePrefix:
        'Underscore prefix for unused parameters is forbidden. Either use the parameter or remove it entirely. TypeScript will detect truly unused parameters.',
    },
    schema: [],
    type: 'problem',
  },
};
