/**
 * ESLint Rule: use-case-policy
 *
 * Unified Use Case enforcement for Clean Architecture compliance.
 * Philosophy: "Pure business logic in stateless arrow functions"
 *
 * CONSOLIDATES:
 * - enforce-use-case-pattern (deprecated)
 * - enforce-use-case-isolation (deprecated)
 *
 * PATTERN ENFORCEMENT:
 *   - REQUIRED: Exported async arrow functions
 *   - FORBIDDEN: Classes, function keyword, this, new (custom)
 *   - ALLOWED: Built-in constructors (Date, Error, Map, Set)
 *
 * ISOLATION ENFORCEMENT:
 *   - FORBIDDEN: Direct repository imports (use interfaces)
 *   - FORBIDDEN: Prisma/database imports (use repository pattern)
 *   - ALLOWED: Type-only imports from anywhere
 *
 * CORRECT PATTERN:
 *   export const executeLogin = async (params): Promise<Response> => {
 *     // Business logic via injected interfaces
 *     return { success: true, data: ... };
 *   };
 *
 * @version 1.0.0
 * @reviewed 2026-01-19
 */

/** Forbidden import patterns for use cases */
const FORBIDDEN_IMPORTS = [
  { pattern: /\.repository$/, message: 'Use repository interfaces, not implementations.' },
  { pattern: /prisma/i, message: 'Use repository pattern, not Prisma directly.' },
  { pattern: /@infrastructure\/database/, message: 'Use repository pattern, not database directly.' },
  { pattern: /@prisma\/client/, message: 'Use repository pattern, not ORM directly.' },
];

/** Built-in constructors allowed with 'new' */
const ALLOWED_CONSTRUCTORS = ['Date', 'Error', 'Map', 'Set', 'Promise', 'RegExp', 'URL'];

/** @type {import('eslint').Rule.RuleModule} */
export const useCasePolicyRule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce Use Case pattern and isolation: arrow functions only, no direct dependencies.',
      category: 'Clean Architecture',
      recommended: true,
    },
    messages: {
      noClasses: 'Classes forbidden in Use Cases. Use: export const execute = async () => {}',
      noFunctionKeyword: 'Function keyword forbidden for exports. Use: export const execute = async () => {}',
      noThis: "'this' forbidden in Use Cases. Use stateless arrow functions.",
      noNew: "'new' forbidden for custom classes. Use factory functions or object literals.",
      notAsync: 'Use case functions should be async for proper error handling.',
      missingExport: 'Use Case must export an arrow function (export const execute = async () => {}).',
      directImport: '{{message}} Importing: "{{source}}"',
    },
    schema: [],
  },

  create(context) {
    const filename = context.filename || context.getFilename();

    const isUseCaseFile = /\/use-cases\/.*\.use-case\.(ts|tsx)$/.test(filename);
    if (!isUseCaseFile) return {};

    if (filename.endsWith('.interfaces.ts')) return {};

    let hasExportedArrowFunction = false;

    return {
      ClassDeclaration(node) {
        context.report({ node, messageId: 'noClasses' });
      },

      FunctionDeclaration(node) {
        if (node.parent?.type === 'ExportNamedDeclaration') {
          context.report({ node, messageId: 'noFunctionKeyword' });
        }
      },

      ExportNamedDeclaration(node) {
        if (node.declaration?.type === 'VariableDeclaration') {
          node.declaration.declarations.forEach((declarator) => {
            if (declarator.init?.type === 'ArrowFunctionExpression' ||
                (declarator.init?.type === 'CallExpression' && declarator.init.callee?.name === 'async')) {
              hasExportedArrowFunction = true;

              const isAsync = declarator.init.async === true ||
                (declarator.init.type === 'CallExpression' && declarator.init.callee?.name === 'async');

              if (!isAsync && declarator.id?.name?.startsWith('execute')) {
                context.report({ node: declarator, messageId: 'notAsync' });
              }
            }
          });
        }
      },

      ThisExpression(node) {
        context.report({ node, messageId: 'noThis' });
      },

      NewExpression(node) {
        const isBuiltIn = node.callee?.type === 'Identifier' && ALLOWED_CONSTRUCTORS.includes(node.callee.name);
        if (!isBuiltIn) {
          context.report({ node, messageId: 'noNew' });
        }
      },

      ImportDeclaration(node) {
        const source = node.source.value;

        const isTypeOnly = node.importKind === 'type' ||
          (node.specifiers.length > 0 && node.specifiers.every(
            (spec) => spec.type === 'ImportSpecifier' && spec.importKind === 'type'
          ));

        if (isTypeOnly) return;

        for (const forbidden of FORBIDDEN_IMPORTS) {
          if (forbidden.pattern.test(source)) {
            context.report({
              node,
              messageId: 'directImport',
              data: { message: forbidden.message, source },
            });
            return;
          }
        }
      },

      'Program:exit'() {
        if (!hasExportedArrowFunction) {
          context.report({
            loc: { line: 1, column: 0 },
            messageId: 'missingExport',
          });
        }
      },
    };
  },
};
