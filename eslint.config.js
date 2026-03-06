import path from 'path';
import { fileURLToPath } from 'url';

import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';
import importX from 'eslint-plugin-import-x';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import prettierPlugin from 'eslint-plugin-prettier';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import sortDestructureKeysPlugin from 'eslint-plugin-sort-destructure-keys';
import sortKeysFixPlugin from 'eslint-plugin-sort-keys-fix';
import testingLibraryPlugin from 'eslint-plugin-testing-library';
import globals from 'globals';

import js from '@eslint/js';

import { codeSizeLimitsRule } from './scripts/eslint-rules/code-size-limits.js';
import { commentsPolicyRule } from './scripts/eslint-rules/comments-policy.js';
import { componentOrganizationRule } from './scripts/eslint-rules/component-organization.js';
import { customImportOrderRule } from './scripts/eslint-rules/custom-import-order.js';
import { designTokensPolicyRule } from './scripts/eslint-rules/design-tokens-policy.js';
import { enforceHookCompositionRule } from './scripts/eslint-rules/enforce-hook-composition.js';
import { essentialTestingRule } from './scripts/eslint-rules/essential-testing.js';
import { importStrategyRule } from './scripts/eslint-rules/import-strategy.js';
import { indexBarrelExportsOnlyRule } from './scripts/eslint-rules/index-barrel-exports-only.js';
import { noAliasExportsRule } from './scripts/eslint-rules/no-alias-exports.js';
import { noEmojisInJsxRule } from './scripts/eslint-rules/no-emojis-in-jsx.js';
import { noEslintDisableRule } from './scripts/eslint-rules/no-eslint-disable.js';
import { noInlineStylesRule } from './scripts/eslint-rules/no-inline-styles.js';
import { noMagicLiteralComparisonRule } from './scripts/eslint-rules/no-magic-literal-comparison.js';
import { noNativeHtmlRule } from './scripts/eslint-rules/no-native-html.js';
import { noUnderscorePrefixRule } from './scripts/eslint-rules/no-underscore-prefix.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * ESLint Configuration - sovereignty-ui
 *
 * CUSTOM RULES (16 total — adapted from DearAdry, without framework-specific rules):
 *
 * Styling & Tokens:
 * - design-tokens-policy: No hardcoded colors/spacing (use tokens)
 * - no-native-html: Enforce styled-components only
 * - no-inline-styles: No style={{}} in JSX
 *
 * Code Organization:
 * - code-size-limits: File (350) + function (50) + JSX (50) line limits
 * - comments-policy: No obvious comments, no blanks in objects
 * - component-organization: Types in .interfaces.ts, constants in .constants.ts
 * - index-barrel-exports-only: index.ts files use only export *
 * - no-alias-exports: No re-export aliases
 *
 * React & Components:
 * - enforce-hook-composition: Prevent over-complex hooks
 * - no-emojis-in-jsx: No emojis in JSX
 *
 * Quality:
 * - essential-testing: Prevent verbose testing patterns
 * - no-eslint-disable: Forbid eslint/typescript/prettier disable comments
 * - no-magic-literal-comparison: No magic strings/numbers in comparisons
 * - no-underscore-prefix: Zero tolerance underscore prefix
 *
 * Imports:
 * - import-strategy: Consistent import strategy
 * - import-order: Consistent import organization
 *
 * @version 1.0.0
 * @updated 2026-03-06
 */

export default [
  {
    ignores: [
      '**/dist/**',
      '**/storybook-static/**',
      '**/node_modules/**',
      '**/coverage/**',
      'eslint.config.js',
      'scripts/**/*.js',
    ],
  },
  js.configs.recommended,
  prettierConfig,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        ...globals.browser,
        ...globals.es2020,
        React: 'readonly',
      },
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        project: path.resolve(__dirname, 'tsconfig.json'),
      },
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      custom: {
        rules: {
          'code-size-limits': codeSizeLimitsRule,
          'comments-policy': commentsPolicyRule,
          'component-organization': componentOrganizationRule,
          'design-tokens-policy': designTokensPolicyRule,
          'enforce-hook-composition': enforceHookCompositionRule,
          'essential-testing': essentialTestingRule,
          'import-order': customImportOrderRule,
          'import-strategy': importStrategyRule,
          'index-barrel-exports-only': indexBarrelExportsOnlyRule,
          'no-alias-exports': noAliasExportsRule,
          'no-emojis-in-jsx': noEmojisInJsxRule,
          'no-eslint-disable': noEslintDisableRule,
          'no-inline-styles': noInlineStylesRule,
          'no-magic-literal-comparison': noMagicLiteralComparisonRule,
          'no-native-html': noNativeHtmlRule,
          'no-underscore-prefix': noUnderscorePrefixRule,
        },
      },
      'import-x': importX,
      'jsx-a11y': jsxA11yPlugin,
      prettier: prettierPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'sort-destructure-keys': sortDestructureKeysPlugin,
      'sort-keys-fix': sortKeysFixPlugin,
      'testing-library': testingLibraryPlugin,
    },
    settings: {
      react: {
        version: 'detect',
        runtime: 'automatic',
      },
      'import-x/resolver': {
        typescript: {
          project: path.resolve(__dirname, 'tsconfig.json'),
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
      'import-x/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
      'import-x/extensions': ['.js', '.jsx', '.ts', '.tsx'],
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      ...testingLibraryPlugin.configs.react.rules,
      ...importX.configs.recommended.rules,
      ...jsxA11yPlugin.configs.recommended.rules,
      ...typescriptPlugin.configs.recommended.rules,

      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'react/no-unescaped-entities': 'warn',

      '@typescript-eslint/consistent-type-definitions': ['warn', 'interface'],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',

      '@typescript-eslint/no-explicit-any': [
        'error',
        {
          fixToUnknown: true,
          ignoreRestArgs: false,
        },
      ],

      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          args: 'all',
          varsIgnorePattern: '^_unused',
          argsIgnorePattern: '^_unused',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_unused',
          destructuredArrayIgnorePattern: '^_unused',
          ignoreRestSiblings: true,
        },
      ],

      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/prefer-optional-chain': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',

      'no-unused-vars': 'off',
      'no-use-before-define': 'off',
      'no-shadow': 'off',
      'no-undef': 'off',
      'no-redeclare': 'off',

      '@typescript-eslint/no-use-before-define': 'warn',
      '@typescript-eslint/no-shadow': 'warn',
      '@typescript-eslint/no-redeclare': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/prefer-as-const': 'warn',
      '@typescript-eslint/prefer-readonly': 'warn',
      '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
      '@typescript-eslint/prefer-string-starts-ends-with': 'warn',
      '@typescript-eslint/prefer-includes': 'warn',
      '@typescript-eslint/switch-exhaustiveness-check': 'warn',

      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',

      'consistent-return': 'warn',

      'custom/import-order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index'], 'styled'],
          'newlines-between': 'always',
          pathGroups: [
            { group: 'builtin', pattern: 'react{,/**}', position: 'before' },
            { group: 'styled', pattern: '{./,**/}*.styled', position: 'after' },
          ],
          pathGroupsExcludedImportTypes: ['react'],
        },
      ],

      'custom/code-size-limits': ['warn', { maxFileLines: 350, maxFunctionLines: 50, maxJsxLines: 50, skipBlankLines: true, skipComments: true }],
      'custom/comments-policy': 'warn',
      'custom/component-organization': 'warn',
      'custom/design-tokens-policy': 'warn',
      'custom/enforce-hook-composition': ['warn', { maxCallbacks: 15, maxLines: 350, maxStateVariables: 15 }],
      'custom/essential-testing': 'warn',
      'custom/import-strategy': ['warn', { maxRelativeLevels: 2 }],
      'custom/index-barrel-exports-only': 'warn',
      'custom/no-alias-exports': 'warn',
      'custom/no-emojis-in-jsx': 'warn',
      'custom/no-eslint-disable': 'warn',
      'custom/no-inline-styles': 'warn',
      'custom/no-magic-literal-comparison': 'warn',
      'custom/no-native-html': 'warn',
      'custom/no-underscore-prefix': 'warn',

      'default-param-last': 'off',
      eqeqeq: 'warn',
      'func-names': 'warn',

      'import-x/default': 'off',
      'import-x/named': 'off',
      'import-x/namespace': 'off',
      'import-x/no-cycle': 'warn',
      'import-x/no-dynamic-require': 'warn',
      'import-x/no-extraneous-dependencies': 'warn',
      'import-x/no-mutable-exports': 'warn',
      'import-x/no-named-as-default': 'off',
      'import-x/order': 'off',
      'import-x/no-unresolved': 'off',

      'jsx-a11y/anchor-is-valid': 'warn',
      'jsx-a11y/control-has-associated-label': 'warn',
      'jsx-a11y/label-has-associated-control': 'warn',
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/no-static-element-interactions': 'warn',
      'jsx-a11y/no-noninteractive-element-interactions': 'warn',

      'testing-library/prefer-screen-queries': 'warn',
      'testing-library/no-wait-for-multiple-assertions': 'warn',
      'testing-library/no-wait-for-side-effects': 'warn',
      'testing-library/no-node-access': 'warn',
      'testing-library/no-await-sync-queries': 'off',
      'testing-library/await-async-queries': 'off',
      'testing-library/render-result-naming-convention': 'off',

      'no-alert': 'off',
      'no-await-in-loop': 'warn',
      'no-cond-assign': 'warn',
      'no-console': 'error',
      'no-constant-binary-expression': 'warn',
      'no-control-regex': 'warn',
      'no-func-assign': 'warn',
      'no-implicit-coercion': 'warn',
      'no-nested-ternary': 'off',
      'no-param-reassign': 'warn',
      'no-plusplus': ['warn', { allowForLoopAfterthoughts: true }],
      'no-promise-executor-return': 'warn',
      'no-restricted-exports': ['warn', { restrictedNamedExports: ['default'] }],
      'no-restricted-globals': 'warn',
      'no-restricted-syntax': [
        'warn',
        {
          message: 'Avoid default exports. Use named exports instead.',
          selector: 'ExportDefaultDeclaration',
        },
      ],
      'no-useless-escape': 'warn',
      'no-case-declarations': 'warn',
      'import-x/no-duplicates': 'warn',
      'import-x/newline-after-import': 'warn',
      'import-x/max-dependencies': 'off',

      'react/jsx-no-bind': [
        'warn',
        {
          allowArrowFunctions: false,
          allowBind: false,
          allowFunctions: false,
          ignoreDOMComponents: false,
          ignoreRefs: true,
        },
      ],

      'react/jsx-curly-brace-presence': ['warn', { props: 'never', children: 'never' }],
      'react/self-closing-comp': ['warn', { component: true, html: true }],
      'react/jsx-boolean-value': ['warn', 'never'],
      'no-return-assign': 'warn',
      'no-unsafe-optional-chaining': 'warn',
      'no-useless-catch': 'warn',
      'prefer-destructuring': 'warn',
      'prettier/prettier': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/rules-of-hooks': 'warn',

      'react/destructuring-assignment': ['warn', 'always', { destructureInSignature: 'ignore' }],
      'react/display-name': 'warn',
      'react/forbid-prop-types': ['warn', { checkChildContextTypes: true, checkContextTypes: true, forbid: ['any'] }],
      'react/function-component-definition': [
        'warn',
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
      ],
      'react/jsx-filename-extension': ['warn', { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
      'react/jsx-no-constructed-context-values': 'warn',
      'react/jsx-no-useless-fragment': 'warn',
      'react/jsx-props-no-spreading': 'off',
      'react/jsx-sort-props': [
        'warn',
        {
          callbacksLast: true,
          ignoreCase: true,
          noSortAlphabetically: false,
          reservedFirst: false,
          shorthandFirst: false,
        },
      ],
      'react/no-array-index-key': 'off',
      'react/no-danger': 'warn',
      'react/no-unknown-property': 'warn',
      'react/no-unstable-nested-components': 'warn',
      'react/no-unused-prop-types': 'warn',
      'react/prop-types': 'off',
      'react/require-default-props': 'off',
      'react/sort-prop-types': [
        'warn',
        {
          callbacksLast: false,
          ignoreCase: false,
          requiredFirst: false,
          sortShapeProp: true,
        },
      ],

      'sort-destructure-keys/sort-destructure-keys': ['warn', { caseSensitive: false }],
      'sort-keys-fix/sort-keys-fix': ['warn', 'asc', { caseSensitive: true, natural: false }],

      'prefer-object-spread': 'warn',
      'prefer-spread': 'warn',
      'lines-between-class-members': ['warn', 'always', { exceptAfterSingleLine: true }],
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      'consistent-return': 'off',
      'import-x/extensions': 'off',
      'import-x/no-useless-path-segments': 'warn',
    },
  },
  // Styled files - allow tagged template literals
  {
    files: ['**/*.styled.{ts,tsx}'],
    rules: {
      'no-unused-expressions': 'off',
    },
  },
  // Token files - verbose by nature
  {
    files: ['src/tokens/**/*.{ts,tsx}'],
    rules: {
      'custom/code-size-limits': ['warn', { maxFileLines: 500, maxFunctionLines: 75, maxJsxLines: 50 }],
      'sort-keys-fix/sort-keys-fix': 'off',
    },
  },
  // Type declaration files
  {
    files: ['**/*.d.ts'],
    rules: {
      'import-x/no-default-export': 'off',
      'no-restricted-exports': 'off',
      'no-restricted-syntax': 'off',
      'custom/index-barrel-exports-only': 'off',
    },
  },
  // Storybook files - documentation env, default exports required by Storybook
  {
    files: ['**/*.stories.{ts,tsx}', '.storybook/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-exports': 'off',
      'no-restricted-syntax': 'off',
      'react/jsx-no-bind': 'off',
      'custom/no-native-html': 'off',
      'custom/no-inline-styles': 'off',
      'custom/comments-policy': 'off',
      'custom/component-organization': 'off',
      'react/function-component-definition': 'off',
      'sort-keys-fix/sort-keys-fix': 'off',
    },
  },
  // Config files
  {
    files: ['vite.config.ts', 'vitest.config.ts', 'tsup.config.ts', 'vitest.setup.ts'],
    rules: {
      'custom/index-barrel-exports-only': 'off',
      'no-restricted-exports': 'off',
      'no-restricted-syntax': 'off',
      'no-console': 'off',
    },
  },
  // Test files
  {
    files: ['**/*.test.{ts,tsx}', '**/test-*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'react/display-name': 'off',
      'react/function-component-definition': 'off',
      'react/jsx-no-bind': 'off',
      'testing-library/await-async-queries': 'warn',
      'testing-library/prefer-screen-queries': 'warn',
      'testing-library/render-result-naming-convention': 'warn',
    },
  },
];
