/**
 * ESLint Rule: index-barrel-exports-only
 *
 * Enforces that index.ts files ONLY contain:
 * - JSDoc comments (block comments)
 * - export * from './module'
 * - export type * from './module.interfaces'
 *
 * FORBIDDEN in index.ts files:
 * - Named exports: export { Something }
 * - Const exports: export const something = ...
 * - Default exports: export default ...
 * - Inline comments: // comment
 *
 * @reviewed 2025-10-28
 */

/** @type {import('eslint').Rule.RuleModule} */
export const indexBarrelExportsOnlyRule = {
  create: (context) => {
    const filename = context.getFilename();
    const isIndexFile = /index\.(ts|tsx)$/.test(filename);

    if (!isIndexFile) {
      return {};
    }

    return {
      ExportNamedDeclaration(node) {
        if (node.source) {
          if (node.specifiers && node.specifiers.length > 0) {
            context.report({
              message:
                'Index files must use "export *" or "export type *" only. Named exports like "export { name }" are forbidden.',
              node,
            });
          }
        } else {
          context.report({
            message:
              'Index files must only re-export from other modules using "export *" or "export type *". Direct exports are forbidden.',
            node,
          });
        }
      },

      ExportDefaultDeclaration(node) {
        context.report({
          message: 'Index files must not contain default exports. Use "export *" only.',
          node,
        });
      },

      ExportAllDeclaration(node) {
        return;
      },

      Line(node) {
        context.report({
          message:
            'Index files must not contain inline comments (//). Use JSDoc block comments (/** */) only.',
          node,
        });
      },
    };
  },
  meta: {
    docs: {
      description:
        'Enforce that index.ts files only contain barrel exports (export *) and JSDoc comments',
      recommended: true,
    },
    messages: {
      namedExportForbidden:
        'Index files must use "export *" or "export type *" only. Named exports like "export { name }" are forbidden.',
      noDirectExports:
        'Index files must only re-export from other modules using "export *" or "export type *". Direct exports are forbidden.',
      noDefaultExports: 'Index files must not contain default exports. Use "export *" only.',
      noInlineComments:
        'Index files must not contain inline comments (//). Use JSDoc block comments (/** */) only.',
    },
    schema: [],
    type: 'problem',
  },
};
