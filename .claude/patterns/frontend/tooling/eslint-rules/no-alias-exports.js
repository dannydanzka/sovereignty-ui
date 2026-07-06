/**
 * ESLint Rule: no-alias-exports
 *
 * Prevents alias exports that re-export the same value under a different name.
 * Each constant, type, or component should have ONE canonical name.
 *
 * FORBIDDEN:
 * - export const Alias = Original;           // ❌ Alias constant
 * - export type AliasType = OriginalType;    // ❌ Alias type
 * - export { Original as Alias };            // ❌ Named alias export
 *
 * ALLOWED:
 * - export const MyComponent = () => {};     // ✅ New component
 * - export const CONFIG = { ... };           // ✅ New constant
 * - export type MyType = { ... };            // ✅ New type definition
 * - export * from './module';                // ✅ Barrel re-export
 *
 * WHY THIS MATTERS:
 * - Aliases create confusion about which name to use
 * - Increases bundle size unnecessarily
 * - Violates "single source of truth" principle
 * - Makes code harder to grep/search
 * - @deprecated aliases are lies - they never get removed
 *
 * @reviewed 2026-02-04
 */

/** @type {import('eslint').Rule.RuleModule} */
export const noAliasExportsRule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow alias exports (re-exporting with different names)',
      recommended: true,
    },
    messages: {
      aliasConstExport:
        'Alias export detected: "{{alias}}" is just a reference to "{{original}}". Use the original name directly or rename at source.',
      aliasTypeExport:
        'Alias type detected: "{{alias}}" is just an alias for "{{original}}". Use the original type directly.',
      namedAliasExport:
        'Named alias export detected: "{{original}}" exported as "{{alias}}". Export with original name or rename at source.',
    },
    schema: [],
  },

  create: (context) => {
    const filename = context.filename || context.getFilename();

    // Skip test files and index files (barrel exports are OK in index)
    const isTestFile = /\.(test|spec)\.(ts|tsx|js|jsx)$/.test(filename);
    if (isTestFile) {
      return {};
    }

    return {
      /**
       * Detect: export const Alias = Original;
       * Where Original is just an Identifier (not a function call, object literal, etc.)
       */
      ExportNamedDeclaration(node) {
        // Check for named alias exports: export { Original as Alias }
        if (node.specifiers && node.specifiers.length > 0) {
          for (const specifier of node.specifiers) {
            if (specifier.type === 'ExportSpecifier') {
              const localName = specifier.local?.name;
              const exportedName = specifier.exported?.name;

              // If exporting with a different name, it's an alias
              if (localName && exportedName && localName !== exportedName) {
                context.report({
                  node: specifier,
                  messageId: 'namedAliasExport',
                  data: {
                    original: localName,
                    alias: exportedName,
                  },
                });
              }
            }
          }
        }

        // Check for: export const Alias = Original;
        if (node.declaration) {
          const decl = node.declaration;

          // VariableDeclaration: export const X = Y;
          if (decl.type === 'VariableDeclaration') {
            for (const declarator of decl.declarations) {
              if (
                declarator.init &&
                declarator.init.type === 'Identifier' &&
                declarator.id.type === 'Identifier'
              ) {
                const aliasName = declarator.id.name;
                const originalName = declarator.init.name;

                // Skip if it's the same name (unlikely but possible)
                if (aliasName === originalName) continue;

                // This is an alias: export const Alias = Original
                context.report({
                  node: declarator,
                  messageId: 'aliasConstExport',
                  data: {
                    alias: aliasName,
                    original: originalName,
                  },
                });
              }
            }
          }

          // TSTypeAliasDeclaration: export type Alias = Original;
          if (decl.type === 'TSTypeAliasDeclaration') {
            const aliasName = decl.id?.name;
            const typeAnnotation = decl.typeAnnotation;

            // Check if it's just a type reference to another type (not a complex type)
            if (
              typeAnnotation &&
              typeAnnotation.type === 'TSTypeReference' &&
              typeAnnotation.typeName?.type === 'Identifier'
            ) {
              const originalName = typeAnnotation.typeName.name;

              // Skip if it's the same name
              if (aliasName === originalName) return;

              // Skip generic type applications like: type MyList = Array<string>
              if (typeAnnotation.typeParameters) return;

              // This is an alias: export type Alias = Original;
              context.report({
                node: decl,
                messageId: 'aliasTypeExport',
                data: {
                  alias: aliasName,
                  original: originalName,
                },
              });
            }
          }
        }
      },
    };
  },
};
