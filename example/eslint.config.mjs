/**
 * Every custom rule is `error` and lint runs with --max-warnings 0; an exception lives here with its reason.
 */

import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import importX from 'eslint-plugin-import-x';
import prettierPlugin from 'eslint-plugin-prettier';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import sortDestructureKeysPlugin from 'eslint-plugin-sort-destructure-keys';
import sortKeysFixPlugin from 'eslint-plugin-sort-keys-fix';
import testingLibraryPlugin from 'eslint-plugin-testing-library';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import { codeSizeLimitsRule } from '../scripts/eslint-rules/code-size-limits.js';
import { commentsPolicyRule } from '../scripts/eslint-rules/comments-policy.js';
import { componentOrganizationRule } from '../scripts/eslint-rules/component-organization.js';
import { customImportOrderRule } from '../scripts/eslint-rules/custom-import-order.js';
import { designTokensPolicyRule } from '../scripts/eslint-rules/design-tokens-policy.js';
import { enforceHookCompositionRule } from '../scripts/eslint-rules/enforce-hook-composition.js';
import { indexBarrelExportsOnlyRule } from '../scripts/eslint-rules/index-barrel-exports-only.js';
import { lazyScreenRegistrationRule } from './scripts/eslint-rules/lazy-screen-registration.js';
import { moduleBoundariesRule } from './scripts/eslint-rules/module-boundaries.js';
import { nativeStackOnlyRule } from './scripts/eslint-rules/native-stack-only.js';
import { navigationPublicEntryRule } from './scripts/eslint-rules/navigation-public-entry.js';
import { noAliasExportsRule } from '../scripts/eslint-rules/no-alias-exports.js';
import { noEmojisInJsxRule } from '../scripts/eslint-rules/no-emojis-in-jsx.js';
import { noEslintDisableRule } from '../scripts/eslint-rules/no-eslint-disable.js';
import { noInlineStylesRule } from '../scripts/eslint-rules/no-inline-styles.js';
import { noJsxInNonComponentFilesRule } from '../scripts/eslint-rules/no-jsx-in-non-component-files.js';
import { noMagicLiteralComparisonRule } from '../scripts/eslint-rules/no-magic-literal-comparison.js';
import { noRawPrimitivesRule } from './scripts/eslint-rules/no-raw-primitives.js';
import { noRedundantClearMocksRule } from '../scripts/eslint-rules/no-redundant-clear-mocks.js';
import { noUnderscorePrefixRule } from '../scripts/eslint-rules/no-underscore-prefix.js';
import { noUtilityTypeCastRule } from '../scripts/eslint-rules/no-utility-type-cast.js';
import { preferMockedHelperRule } from '../scripts/eslint-rules/prefer-mocked-helper.js';

const custom = {
  rules: {
    'code-size-limits': codeSizeLimitsRule,
    'comments-policy': commentsPolicyRule,
    'component-organization': componentOrganizationRule,
    'design-tokens-policy': designTokensPolicyRule,
    'enforce-hook-composition': enforceHookCompositionRule,
    'import-order': customImportOrderRule,
    'index-barrel-exports-only': indexBarrelExportsOnlyRule,
    'lazy-screen-registration': lazyScreenRegistrationRule,
    'module-boundaries': moduleBoundariesRule,
    'native-stack-only': nativeStackOnlyRule,
    'navigation-public-entry': navigationPublicEntryRule,
    'no-alias-exports': noAliasExportsRule,
    'no-emojis-in-jsx': noEmojisInJsxRule,
    'no-eslint-disable': noEslintDisableRule,
    'no-inline-styles': noInlineStylesRule,
    'no-jsx-in-non-component-files': noJsxInNonComponentFilesRule,
    'no-magic-literal-comparison': noMagicLiteralComparisonRule,
    'no-raw-primitives': noRawPrimitivesRule,
    'no-redundant-clear-mocks': noRedundantClearMocksRule,
    'no-underscore-prefix': noUnderscorePrefixRule,
    'no-utility-type-cast': noUtilityTypeCastRule,
    'prefer-mocked-helper': preferMockedHelperRule,
  },
};

const INTERNAL_ALIASES = ['@app', '@apps', '@testing'];

export default tseslint.config(
  {
    ignores: [
      'android/**',
      'ios/**',
      'node_modules/**',
      'coverage/**',
      'vendor/**',
      '.claude/**',
      'scripts/eslint-rules/**',
      'build/**',
      '*.config.js',
      'eslint.config.mjs',
      'index.js',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: { ...globals.node, __DEV__: 'readonly' },
      parserOptions: { ecmaFeatures: { jsx: true }, projectService: true },
    },
    plugins: {
      custom,
      'import-x': importX,
      prettier: prettierPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'sort-destructure-keys': sortDestructureKeysPlugin,
      'sort-keys-fix': sortKeysFixPlugin,
    },
    settings: {
      'import-x/resolver': { typescript: { project: './tsconfig.json' } },
      react: { version: 'detect' },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      'react/jsx-boolean-value': ['error', 'never'],
      'react/jsx-curly-brace-presence': ['error', { children: 'never', props: 'never' }],
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/self-closing-comp': 'error',

      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      // Lazy screens are `require`d inside getComponent on purpose (custom/lazy-screen-registration).
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],

      'import-x/newline-after-import': 'error',
      'import-x/no-cycle': 'error',
      'import-x/no-duplicates': 'error',

      'no-console': 'error',
      'no-restricted-syntax': [
        'error',
        { message: 'Use named exports.', selector: 'ExportDefaultDeclaration' },
        {
          message: 'Use logError/logInfo from @core; only the logger touches the console.',
          selector:
            'CallExpression[callee.object.object.name="globalThis"][callee.object.property.name="console"]',
        },
      ],
      'prettier/prettier': 'error',
      'sort-destructure-keys/sort-destructure-keys': 'error',
      'sort-keys-fix/sort-keys-fix': 'error',

      'custom/code-size-limits': [
        'error',
        {
          maxFileLines: 300,
          maxFunctionLines: 50,
          maxJsxLines: 50,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
      'custom/comments-policy': 'error',
      'custom/component-organization': 'error',
      'custom/design-tokens-policy': 'error',
      'custom/enforce-hook-composition': [
        'error',
        { maxCallbacks: 15, maxLines: 300, maxStateVariables: 10 },
      ],
      'custom/import-order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index'], 'styled'],
          'newlines-between': 'always',
          pathGroups: [
            { group: 'builtin', pattern: 'react{,/**}', position: 'before' },
            ...INTERNAL_ALIASES.map((alias) => ({
              group: 'internal',
              pattern: `${alias}{,/**}`,
              position: 'after',
            })),
            { group: 'styled', pattern: '{./,**/}*.styled', position: 'after' },
          ],
          pathGroupsExcludedImportTypes: ['react'],
        },
      ],
      'custom/index-barrel-exports-only': 'error',
      'custom/lazy-screen-registration': 'error',
      'custom/module-boundaries': 'error',
      'custom/native-stack-only': 'error',
      'custom/navigation-public-entry': 'error',
      'custom/no-alias-exports': 'error',
      'custom/no-emojis-in-jsx': 'error',
      'custom/no-eslint-disable': 'error',
      'custom/no-inline-styles': 'error',
      'custom/no-jsx-in-non-component-files': 'error',
      'custom/no-magic-literal-comparison': 'error',
      'custom/no-raw-primitives': 'error',
      'custom/no-underscore-prefix': 'error',
      'custom/no-utility-type-cast': 'error',
    },
  },
  {
    files: ['**/*.test.{ts,tsx}', 'jest.setup.ts', 'src/libs/testing/**/*.{ts,tsx}'],
    languageOptions: { globals: { ...globals.jest } },
    plugins: { 'testing-library': testingLibraryPlugin },
    rules: {
      ...testingLibraryPlugin.configs.react.rules,
      // RNTL 14 made fireEvent async; the plugin still assumes the sync API of RNTL 12.
      'testing-library/no-await-sync-events': 'off',
      'custom/code-size-limits': [
        'error',
        { maxFileLines: 600, maxFunctionLines: 80, maxJsxLines: 80 },
      ],
      'custom/component-organization': 'off',
      'custom/no-magic-literal-comparison': 'off',
      'custom/no-redundant-clear-mocks': 'error',
      'custom/prefer-mocked-helper': 'error',
    },
  }
);
