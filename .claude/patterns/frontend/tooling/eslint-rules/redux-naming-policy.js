/**
 * ESLint Rule: redux-naming-policy
 *
 * Enforces Redux naming conventions from Betterware migration patterns.
 * Prevents import aliases with Action/Selector suffixes - names should be correct at source.
 *
 * POLICY:
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │  NO IMPORT ALIASES for Redux (names should be correct)     │
 * │  ─────────────────────────────────────────────────────────  │
 * │  ❌ import { fetchEvents as fetchEventsAction }            │
 * │  ✅ import { fetchEventsAction } (name correct at source)  │
 * │  ❌ import { selectUsers as selectAllUsers }               │
 * │  ✅ import { selectAllUsers } (name correct at source)     │
 * └─────────────────────────────────────────────────────────────┘
 *
 * NAMING CONVENTION:
 *
 * | Layer            | Suffix    | Pattern              | Example              |
 * |------------------|-----------|----------------------|----------------------|
 * | Trigger Action   | Action    | verbNounAction       | fetchEventsAction    |
 * | Selector         | (none)    | selectNoun           | selectEvents         |
 * | Reducer          | Reducer   | domainReducer        | eventsReducer        |
 *
 * @see Betterware migration: redux-rtk-patterns.md
 * @reviewed 2026-01-30
 */

/** @type {import('eslint').Rule.RuleModule} */
export const reduxNamingPolicyRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Enforce Redux naming policy: no import aliases for thunks/selectors, names should be correct at source',
      recommended: true,
    },
    messages: {
      noReduxAlias:
        'Import alias "{{original}} as {{alias}}" is forbidden. Rename the export at source to "{{alias}}" instead of using an alias. See: redux-naming-policy.',
      noTypeCastAlias:
        'Type cast alias "{{value}} as {{type}}" should be avoided. Use proper typing at source.',
    },
    schema: [],
  },

  create: (context) => {
    const filename = context.filename || context.getFilename();

    // Skip test files and mock files
    const isTestFile = /\.(test|spec)\.(ts|tsx|js|jsx)$/.test(filename);
    const isMockFile = /\/mocks\//.test(filename) || /\/__mocks__\//.test(filename);

    if (isTestFile || isMockFile) {
      return {};
    }

    /**
     * Suffixes that indicate Redux-related imports
     * These should be named correctly at source, not aliased
     */
    const reduxSuffixes = ['Action', 'Actions', 'Reducer', 'Selector', 'Selectors'];

    /**
     * Check if alias ends with a Redux suffix
     */
    const hasReduxSuffix = (name) => {
      return reduxSuffixes.some((suffix) => name.endsWith(suffix));
    };

    /**
     * Import paths that are exempt from this rule
     * (e.g., styled-components, type imports, etc.)
     */
    const exemptPaths = [
      'styled-components',
      '@reduxjs/toolkit',
      'react-redux',
      '@testing-library',
    ];

    const isExemptPath = (importPath) => {
      return exemptPaths.some((exempt) => importPath.includes(exempt));
    };

    return {
      ImportDeclaration: (node) => {
        const importPath = node.source.value;

        // Skip exempt paths
        if (isExemptPath(importPath)) {
          return;
        }

        // Check each import specifier for forbidden aliases
        node.specifiers.forEach((specifier) => {
          // Only check named imports with aliases
          if (specifier.type !== 'ImportSpecifier') {
            return;
          }

          const original = specifier.imported?.name;
          const alias = specifier.local?.name;

          // Skip if no alias (imported name equals local name)
          if (!original || !alias || original === alias) {
            return;
          }

          // Check if alias has Redux suffix (forbidden pattern)
          // Only flag if the original doesn't already have the suffix
          if (hasReduxSuffix(alias) && !hasReduxSuffix(original)) {
            context.report({
              node: specifier,
              messageId: 'noReduxAlias',
              data: {
                original,
                alias,
              },
            });
          }

          // NOTE: Styled-component aliases (e.g., FormActions as StyledFormActions)
          // are legitimate for avoiding naming conflicts with component names.
          // This rule focuses only on Redux naming conventions.
        });
      },
    };
  },
};
