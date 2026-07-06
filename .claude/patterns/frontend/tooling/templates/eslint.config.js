import path from 'path';
import { fileURLToPath } from 'url';

import nextPlugin from '@next/eslint-plugin-next';
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
import vitestPlugin from '@vitest/eslint-plugin';
import globals from 'globals';

import js from '@eslint/js';

import { customImportOrderRule } from './scripts/eslint-rules/custom-import-order.js';
import { enforceHookCompositionRule } from './scripts/eslint-rules/enforce-hook-composition.js';
import { essentialTestingRule } from './scripts/eslint-rules/essential-testing.js';
import { indexBarrelExportsOnlyRule } from './scripts/eslint-rules/index-barrel-exports-only.js';
import { commentsPolicyRule } from './scripts/eslint-rules/comments-policy.js';
import { noDirectServiceCallsRule } from './scripts/eslint-rules/no-direct-service-calls.js';
import { noEslintDisableRule } from './scripts/eslint-rules/no-eslint-disable.js';
import { noNativeHtmlRule } from './scripts/eslint-rules/no-native-html.js';
import { noTryCatchAbuseRule } from './scripts/eslint-rules/no-try-catch-abuse.js';
import { noUnderscorePrefixRule } from './scripts/eslint-rules/no-underscore-prefix.js';
import { requireUseClientDirectiveRule } from './scripts/eslint-rules/require-use-client-directive.js';
import { noEmojisInJsxRule } from './scripts/eslint-rules/no-emojis-in-jsx.js';
import { noReduxInComponentsRule } from './scripts/eslint-rules/no-redux-in-components.js';
import { importStrategyRule } from './scripts/eslint-rules/import-strategy.js';
import { designTokensPolicyRule } from './scripts/eslint-rules/design-tokens-policy.js';
import { architectureBoundariesRule } from './scripts/eslint-rules/architecture-boundaries.js';
import { codeSizeLimitsRule } from './scripts/eslint-rules/code-size-limits.js';
import { useCasePolicyRule } from './scripts/eslint-rules/use-case-policy.js';
import { componentOrganizationRule } from './scripts/eslint-rules/component-organization.js';
import { reduxNamingPolicyRule } from './scripts/eslint-rules/redux-naming-policy.js';
import { noAliasExportsRule } from './scripts/eslint-rules/no-alias-exports.js';
import { noHardcodedUiStringsRule } from './scripts/eslint-rules/no-hardcoded-ui-strings.js';
import { noMagicLiteralComparisonRule } from './scripts/eslint-rules/no-magic-literal-comparison.js';
import { noInlineStylesRule } from './scripts/eslint-rules/no-inline-styles.js';
import { noRawSupabaseClientRule } from './scripts/eslint-rules/no-raw-supabase-client.js';
import { enforceZodFormsRule } from './scripts/eslint-rules/enforce-zod-forms.js';
import { noRedundantGlobalMocksRule } from './scripts/eslint-rules/no-redundant-global-mocks.js';
import { noRedundantClearMocksRule } from './scripts/eslint-rules/no-redundant-clear-mocks.js';
import { preferMockedHelperRule } from './scripts/eslint-rules/prefer-mocked-helper.js';
import { preferCentralizedAssertionsRule } from './scripts/eslint-rules/prefer-centralized-assertions.js';
import { preferUserHelperRule } from './scripts/eslint-rules/prefer-user-helper.js';
import { noAwaitImportInBeforeEachRule } from './scripts/eslint-rules/no-await-import-in-beforeeach.js';
import { noEnglishInMockErrorsRule } from './scripts/eslint-rules/no-english-in-mock-errors.js';
import { noInlineHookMockFactoryRule } from './scripts/eslint-rules/no-inline-hook-mock-factory.js';
import { preferOnceInTestRule } from './scripts/eslint-rules/prefer-once-in-test.js';
import { e2eTestingPolicyRule } from './scripts/eslint-rules/e2e-testing-policy.js';
import { preferI18nKeysInErrorsRule } from './scripts/eslint-rules/prefer-i18n-keys-in-errors.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * ESLint Configuration - DearAdry Platform
 *
 * CUSTOM RULES (29 total):
 *
 * Architecture & Boundaries:
 * - architecture-boundaries: Context isolation + layer hierarchy + domain purity
 * - import-strategy: No deep relative imports, prefer aliases
 * - use-case-policy: Arrow functions only, no direct repo imports
 *
 * Code Organization:
 * - code-size-limits: File (350) + function (50) + JSX (50) line limits
 * - comments-policy: File headers + no obvious comments + no blanks in objects
 * - component-organization: Types in .interfaces.ts, constants in .constants.ts
 * - index-barrel-exports-only: index.ts files use only export *
 * - no-alias-exports: No re-export aliases
 *
 * React & Components:
 * - design-tokens-policy: No hardcoded colors/spacing (use tokens)
 * - enforce-hook-composition: Prevent over-complex hooks
 * - no-emojis-in-jsx: No emojis in JSX (use styled-components)
 * - no-native-html: Enforce styled-components only
 * - require-use-client-directive: Auto-detect missing 'use client'
 *
 * Redux & Services:
 * - no-direct-service-calls: Use Redux thunks, not services directly
 * - no-redux-in-components: Use useAuth hook, not redux directly
 * - redux-naming-policy: Consistent Redux naming conventions
 *
 * Quality & Testing:
 * - essential-testing: Prevent verbose testing patterns + English mock data
 * - no-redundant-global-mocks: Detect vi.mock() for globally mocked modules
 * - no-redundant-clear-mocks: Detect vi.clearAllMocks()/restoreAllMocks() (already global)
 * - prefer-mocked-helper: Prefer mocked() helper over `as Mock` casts
 * - prefer-centralized-assertions: Prefer assertText/assertRole over inline expect
 * - prefer-user-helper: Prefer @testing user over @testing-library/user-event
 * - no-await-import-in-beforeeach: No dynamic import() in beforeEach
 * - no-english-in-mock-errors: No English strings in new Error() inside test files
 * - no-inline-hook-mock-factory: No inline object/array literals in vi.mock() factories (OOM risk)
 * - prefer-once-in-test: Prefer *Once mock variants inside it()/test() for isolation
 * - no-eslint-disable: Forbid eslint/typescript/prettier disable comments
 * - no-try-catch-abuse: Require error handlers in UI
 * - no-underscore-prefix: Zero tolerance underscore prefix
 *
 * Imports:
 * - import-order: Consistent import organization
 *
 * @version 2.1.0
 * @updated 2026-02-04
 */

export default [
  {
    ignores: [
      '**/dist/**',
      '**/.next/**',
      '**/build/**',
      '**/out/**',
      '**/node_modules/**',
      '**/coverage/**',
      'eslint.config.js',
      '.stylelintrc.js',
      'next-env.d.ts',
      'scripts/**/*.cjs',
      'scripts/**/*.js',
      'scripts/eslint-rules/**',
      'src/libs/shared/testing/mocks/external/**/*.js',
      'prisma/**/*.ts',
      'src/libs/presentation/pages/index.ts',
      'playwright-report/**',
    ],
  },
  js.configs.recommended,
  prettierConfig,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.es2020,
        config: 'readonly',
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
      '@next/next': nextPlugin,
      custom: {
        rules: {
          'architecture-boundaries': architectureBoundariesRule,
          'code-size-limits': codeSizeLimitsRule,
          'comments-policy': commentsPolicyRule,
          'component-organization': componentOrganizationRule,
          'design-tokens-policy': designTokensPolicyRule,
          'enforce-hook-composition': enforceHookCompositionRule,
          'enforce-zod-forms': enforceZodFormsRule,
          'essential-testing': essentialTestingRule,
          'import-order': customImportOrderRule,
          'import-strategy': importStrategyRule,
          'index-barrel-exports-only': indexBarrelExportsOnlyRule,
          'no-alias-exports': noAliasExportsRule,
          'no-await-import-in-beforeeach': noAwaitImportInBeforeEachRule,
          'no-direct-service-calls': noDirectServiceCallsRule,
          'no-english-in-mock-errors': noEnglishInMockErrorsRule,
          'no-inline-hook-mock-factory': noInlineHookMockFactoryRule,
          'no-emojis-in-jsx': noEmojisInJsxRule,
          'no-raw-supabase-client': noRawSupabaseClientRule,
          'no-redundant-clear-mocks': noRedundantClearMocksRule,
          'no-redundant-global-mocks': noRedundantGlobalMocksRule,
          'no-eslint-disable': noEslintDisableRule,
          'no-hardcoded-ui-strings': noHardcodedUiStringsRule,
          'no-inline-styles': noInlineStylesRule,
          'no-magic-literal-comparison': noMagicLiteralComparisonRule,
          'no-native-html': noNativeHtmlRule,
          'no-redux-in-components': noReduxInComponentsRule,
          'no-try-catch-abuse': noTryCatchAbuseRule,
          'no-underscore-prefix': noUnderscorePrefixRule,
          'prefer-centralized-assertions': preferCentralizedAssertionsRule,
          'prefer-once-in-test': preferOnceInTestRule,
          'prefer-user-helper': preferUserHelperRule,
          'prefer-mocked-helper': preferMockedHelperRule,
          'redux-naming-policy': reduxNamingPolicyRule,
          'require-use-client-directive': requireUseClientDirectiveRule,
          'use-case-policy': useCasePolicyRule,
          'e2e-testing-policy': e2eTestingPolicyRule,
          'prefer-i18n-keys-in-errors': preferI18nKeysInErrorsRule,
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

      // Critical Next.js rules (error) - affect performance/routing
      '@next/next/no-head-element': 'error',
      '@next/next/no-html-link-for-pages': 'error',
      '@next/next/no-img-element': 'error',
      '@next/next/no-sync-scripts': 'error',
      '@next/next/no-document-import-in-page': 'error',
      '@next/next/no-head-import-in-document': 'error',
      // Non-critical Next.js rules (warn)
      '@next/next/google-font-display': 'warn',
      '@next/next/google-font-preconnect': 'warn',
      '@next/next/next-script-for-ga': 'warn',
      '@next/next/no-async-client-component': 'warn',
      '@next/next/no-before-interactive-script-outside-document': 'warn',
      '@next/next/no-css-tags': 'warn',
      '@next/next/no-page-custom-font': 'warn',
      '@next/next/no-styled-jsx-in-document': 'warn',
      '@next/next/no-title-in-document-head': 'warn',
      '@next/next/no-typos': 'warn',
      '@next/next/no-unwanted-polyfillio': 'warn',
      '@next/next/inline-script-id': 'warn',
      '@next/next/no-assign-module-variable': 'warn',
      '@next/next/no-script-component-in-head': 'warn',

      // Import policies enforced by custom rules:
      // - custom/architecture-boundaries: context isolation, layer hierarchy, domain purity
      // - custom/import-strategy: barrel vs granular, alias redirects, deep relative imports

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
          // NO underscore patterns - custom/no-underscore-prefix enforces Rule 89
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
            { group: 'external', pattern: 'next/**', position: 'before' },
            { group: 'internal', pattern: '@apps/admin/**', position: 'after' },
            { group: 'internal', pattern: '@apps/auth/**', position: 'after' },
            { group: 'internal', pattern: '@apps/public/**', position: 'after' },
            { group: 'internal', pattern: '@apps/shared/**', position: 'after' },
            { group: 'internal', pattern: '@api/**', position: 'after' },
            { group: 'internal', pattern: '@components{,/**}', position: 'after' },
            { group: 'internal', pattern: '@hooks{,/**}', position: 'after' },
            { group: 'internal', pattern: '@utils{,/**}', position: 'after' },
            { group: 'internal', pattern: '@testing{,/**}', position: 'after' },
            { group: 'internal', pattern: '@mocks{,/**}', position: 'after' },
            { group: 'internal', pattern: '@styles{,/**}', position: 'after' },
            { group: 'internal', pattern: '@domain{,/**}', position: 'after' },
            { group: 'internal', pattern: '@interfaces{,/**}', position: 'after' },
            { group: 'internal', pattern: '@entities{,/**}', position: 'after' },
            { group: 'internal', pattern: '@validation{,/**}', position: 'after' },
            { group: 'internal', pattern: '@types{,/**}', position: 'after' },
            { group: 'internal', pattern: '@redux{,/**}', position: 'after' },
            { group: 'internal', pattern: '@store', position: 'after' },
            { group: 'internal', pattern: '@middleware{,/**}', position: 'after' },
            { group: 'internal', pattern: '@config{,/**}', position: 'after' },
            { group: 'internal', pattern: '@services{,/**}', position: 'after' },
            { group: 'internal', pattern: '@repositories{,/**}', position: 'after' },
            { group: 'internal', pattern: '@constants{,/**}', position: 'after' },
            { group: 'internal', pattern: '@helpers{,/**}', position: 'after' },
            { group: 'internal', pattern: '@thunks{,/**}', position: 'after' },
            { group: 'internal', pattern: '@providers{,/**}', position: 'after' },
            { group: 'internal', pattern: '@pages{,/**}', position: 'after' },
            { group: 'internal', pattern: '@layouts{,/**}', position: 'after' },
            { group: 'styled', pattern: '{./,**/}*.styled', position: 'after' },
          ],
          pathGroupsExcludedImportTypes: ['react'],
        },
      ],
      'custom/architecture-boundaries': 'warn',
      'custom/code-size-limits': ['warn', { maxFileLines: 350, maxFunctionLines: 50, maxJsxLines: 50, skipBlankLines: true, skipComments: true }],
      'custom/comments-policy': 'warn',
      'custom/component-organization': 'warn',
      'custom/design-tokens-policy': 'warn',
      'custom/enforce-hook-composition': ['warn', { maxCallbacks: 15, maxLines: 350, maxStateVariables: 15 }],
      'custom/enforce-zod-forms': 'warn',
      'custom/import-strategy': ['warn', { maxRelativeLevels: 2 }],
      'custom/index-barrel-exports-only': 'warn',
      'custom/no-alias-exports': 'warn',
      'custom/no-direct-service-calls': ['warn', {
        /**
         * Project-specific exceptions for DearAdry.
         * Each pattern is matched via String.includes() against the full file path.
         *
         * IMPORTANT: When replicating this rule in another project, configure YOUR
         * project-specific exceptions here. The rule itself is agnostic.
         *
         * Categories:
         * 1. Auth bootstrap (runs before state management is ready)
         * 2. Payment integrations (external API redirects, one-time operations)
         * 3. Multi-step flows (wizards, CSV imports — local state by design)
         * 4. Screens without matching state thunks (TODO: create thunks to remove)
         */
        allowedPathPatterns: [
          // Auth bootstrap — runs before Redux store is ready
          '/providers/AuthProvider/',
          // Stripe payment flows — external API redirect, no cache needed
          '/PaymentScreen/',
          '/EnrollCompanionsModal/',
          '/AddEditCompanionModal/',
          // Multi-step flows with local state
          '/steps/',
          'Wizard',
          // Stripe/billing integration
          '/Billing/',
          'Billing',
          // File upload/export — one-time operations
          '/CSV/',
          'Import',
          'Export',
          // Screens without matching public thunks (TODO: create thunks)
          '/MyPaymentsScreen/',
          '/GalleryScreen/',
          '/MyTeamSection',
          '/ManualEnrollmentModal/',
          '/ChallengeStoriesScreen/',
          // Auth password reset — one-time operations, no cache needed
          '/ForgotPasswordScreen/',
          '/ResetPasswordScreen/',
        ],
        httpCallNames: ['handleRequest'],
      }],
      'custom/no-emojis-in-jsx': 'warn',
      'custom/no-raw-supabase-client': 'warn',
      'custom/prefer-i18n-keys-in-errors': 'warn',
      'custom/no-eslint-disable': 'warn',
      'custom/no-hardcoded-ui-strings': 'warn',
      'custom/no-inline-styles': 'warn',
      'custom/no-magic-literal-comparison': 'warn',
      'custom/no-native-html': 'warn',
      'custom/no-redux-in-components': 'warn',
      'custom/no-try-catch-abuse': 'warn',
      'custom/no-underscore-prefix': 'warn',
      'custom/redux-naming-policy': 'warn',
      'custom/require-use-client-directive': 'warn',
      'custom/use-case-policy': 'warn',

      // Built-in max-* rules disabled - custom/code-size-limits handles this

      'default-param-last': 'off',
      eqeqeq: 'warn',
      'func-names': 'warn',
      'global-require': 'warn',

      'import-x/default': 'off',
      'import-x/named': 'off',
      'import-x/namespace': 'off',
      'import-x/no-cycle': 'warn',
      'import-x/no-dynamic-require': 'warn',
      'import-x/no-extraneous-dependencies': 'warn',
      'import-x/no-mutable-exports': 'warn',
      'import-x/no-named-as-default': 'off',
      'import-x/order': 'off', // Using custom/import-order instead
      'import-x/no-unresolved': ['warn', { ignore: ['^@'] }], // Ignore aliases (TypeScript handles them)

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

      'no-plusplus': [
        'warn',
        {
          allowForLoopAfterthoughts: true,
        },
      ],

      'no-promise-executor-return': 'warn',
      'no-restricted-exports': [
        'warn',
        {
          restrictedNamedExports: ['default'],
        },
      ],
      'no-restricted-globals': 'warn',
      'no-restricted-syntax': [
        'warn',
        {
          message: 'Avoid default exports. Use named exports instead.',
          selector: 'ExportDefaultDeclaration',
        },
        {
          message:
            'Use logError/logWarning from @logger instead of globalThis.console. ' +
            'Only the logger module may access globalThis.console directly.',
          selector:
            'CallExpression[callee.object.object.name="globalThis"][callee.object.property.name="console"]',
        },
      ],
      'no-warning-comments': ['warn', { terms: ['TODO', 'FIXME', 'HACK'], location: 'start' }],
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

      'react/jsx-curly-brace-presence': [
        'warn',
        {
          props: 'never',
          children: 'never',
        },
      ],
      'react/self-closing-comp': [
        'warn',
        {
          component: true,
          html: true,
        },
      ],
      'react/jsx-boolean-value': ['warn', 'never'],
      'no-return-assign': 'warn',
      'no-unsafe-optional-chaining': 'warn',
      'no-useless-catch': 'warn',
      'prefer-destructuring': 'warn',
      'prettier/prettier': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/rules-of-hooks': 'warn',

      'react/destructuring-assignment': [
        'warn',
        'always',
        {
          destructureInSignature: 'ignore',
        },
      ],
      'react/display-name': 'warn',
      'react/forbid-prop-types': [
        'warn',
        {
          checkChildContextTypes: true,
          checkContextTypes: true,
          forbid: ['any'],
        },
      ],
      'react/function-component-definition': [
        'warn',
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
      ],
      'react/jsx-filename-extension': [
        'warn',
        {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      ],
      'react/jsx-no-constructed-context-values': 'warn',
      'react/jsx-no-useless-fragment': 'warn',

      // Props spreading allowed - custom/no-native-html enforces styled-components
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
      'sort-keys-fix/sort-keys-fix': [
        'warn',
        'asc',
        {
          caseSensitive: true,
          natural: false,
        },
      ],

      // testing-library rules only apply to test files (see test files override)
      // Disabled globally to avoid false positives (e.g., repository.findByRole)
      'testing-library/await-async-queries': 'off',
      'testing-library/render-result-naming-convention': 'off',
      'testing-library/prefer-screen-queries': 'off',

      // Formatting rules handled by Prettier (prettierConfig) - removed redundant:
      // no-trailing-spaces, no-multi-spaces, eol-last, no-multiple-empty-lines, no-mixed-spaces-and-tabs

      'prefer-object-spread': 'warn',
      'prefer-spread': 'warn',

      // Formatting rules removed - handled by Prettier (prettierConfig)
      'lines-between-class-members': ['warn', 'always', { exceptAfterSingleLine: true }],
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      // @typescript-eslint/prefer-readonly already set in main config
      'consistent-return': 'off',
      'import-x/extensions': 'off',
      'import-x/no-useless-path-segments': 'warn',
    },
  },
    {
    files: ['**/*.cjs'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        ...globals.node,
      },
      sourceType: 'commonjs',
    },
    plugins: {
      'import-x': importX,
      prettier: prettierPlugin,
      'sort-keys-fix': sortKeysFixPlugin,
    },
    rules: {
      'consistent-return': 'warn',
      'default-param-last': 'off',
      eqeqeq: 'warn',
      'func-names': 'warn',
      'global-require': 'off',
      'import-x/no-dynamic-require': 'off',
      'import-x/order': 'off',
      'no-alert': 'warn',
      'no-console': 'off',
      'no-param-reassign': 'warn',
      'no-shadow': 'warn',
      'no-unused-vars': 'warn',
      'no-use-before-define': 'warn',
      'prettier/prettier': 'warn',
      'sort-keys-fix/sort-keys-fix': [
        'warn',
        'asc',
        {
          caseSensitive: true,
          natural: false,
        },
      ],
    },
  },
  // Config files - allow default exports and relaxed syntax
  {
    files: [
      'next.config.{js,ts,mjs}',
      'middleware.{js,ts}',
      'eslint.config.js',
      '.prettierrc.js',
      'stylelint.config.js',
    ],
    rules: {
      'custom/index-barrel-exports-only': 'off',
      'import-x/no-default-export': 'off',
      'no-restricted-exports': 'off',
      'no-restricted-syntax': 'off',
    },
  },
  {
    files: ['**/*.styled.{ts,tsx}'],
    rules: {
      'no-unused-expressions': 'off',
    },
  },
  {
    files: ['src/libs/infrastructure/email/templates/**/*.{ts,tsx}'],
    rules: {
      'custom/no-native-html': 'off',
      'custom/no-emojis-in-jsx': 'off',
      'custom/no-hardcoded-ui-strings': 'off',
      'custom/design-tokens-policy': 'off',
      'custom/code-size-limits': 'off',
    },
  },
  {
    files: [
      'src/libs/infrastructure/email/**/*.{ts,tsx}',
      'src/libs/infrastructure/config/resend/**/*.{ts,tsx}',
    ],
    rules: {
      // Disable testing-library rule for email services (using @react-email/render, not testing-library)
      'testing-library/render-result-naming-convention': 'off',
    },
  },
  // Type declaration files - relaxed rules for .d.ts
  {
    files: ['**/*.d.ts'],
    rules: {
      'import-x/no-default-export': 'off',
      'no-restricted-exports': 'off',
      'no-restricted-syntax': 'off',
      'custom/index-barrel-exports-only': 'off',
    },
  },
  // Theme file - design tokens are verbose
  {
    files: ['src/libs/presentation/styles/theme.ts'],
    rules: {
      'custom/code-size-limits': ['warn', { maxFileLines: 500, maxFunctionLines: 75, maxJsxLines: 50 }],
    },
  },
  // useFileUpload - Sequential uploads for granular progress tracking
  {
    files: ['src/libs/presentation/hooks/useFileUpload/useFileUpload.ts'],
    rules: {
      'no-await-in-loop': 'off',
    },
  },
  // Middleware - Silent catch blocks for expected auth scenarios (invalid/expired tokens)
  {
    files: ['middleware.ts'],
    rules: {
      'custom/no-try-catch-abuse': 'off',
    },
  },
  // Next.js App Router files - MUST use default exports (framework requirement)
  // Also allows function declaration for async page components
  {
    files: [
      'src/app/**/page.tsx',
      'src/app/**/layout.tsx',
      'src/app/**/error.tsx',
      'src/app/**/loading.tsx',
      'src/app/**/not-found.tsx',
      'src/app/**/template.tsx',
      'src/app/global-error.tsx',
    ],
    rules: {
      'no-restricted-exports': 'off',
      'no-restricted-syntax': 'off',
      'react/function-component-definition': 'off',
    },
  },
  // Logger module — only file allowed to use globalThis.console directly
  {
    files: ['src/libs/shared/helpers/error-handling/logger/logger.ts'],
    rules: {
      'no-restricted-syntax': [
        'warn',
        {
          message: 'Avoid default exports. Use named exports instead.',
          selector: 'ExportDefaultDeclaration',
        },
      ],
    },
  },
  // Vitest config files - console needed for test output configuration
  {
    files: ['vitest.setup.ts', 'vitest.config.ts'],
    rules: {
      'custom/no-eslint-disable': 'off',
      'no-console': 'off',
    },
  },
  // Test utilities - sequential operations needed for deterministic test setup
  {
    files: ['src/libs/shared/testing/utils/**/*.ts'],
    rules: {
      'no-await-in-loop': 'off',
      'testing-library/no-node-access': 'off',
    },
  },
  // Prisma mock - must export 'prisma' name to match production for vi.mock
  {
    files: ['src/libs/shared/testing/mocks/database/prisma.mock.ts'],
    rules: {
      'custom/no-alias-exports': 'off',
    },
  },
  // ═══════════════════════════════════════════════════════════════════
  // TEST FILES — Sovereignty in Testing
  //
  // Philosophy: Focused, essential tests. Not testing for testing's sake.
  // If it's hard to test → the production code needs refactoring.
  //
  // RELAXED: Format constraints (size, inline data, literals)
  // ENFORCED: Quality constraints (assertions, no dead tests, structure)
  // ADDED: @vitest/eslint-plugin for Vitest-specific best practices
  // ═══════════════════════════════════════════════════════════════════
  {
    files: [
      '**/*.test.{ts,tsx}',
      '**/test-*.{ts,tsx}',
      'src/libs/shared/testing/**/*.{ts,tsx}',
    ],
    plugins: {
      vitest: vitestPlugin,
    },
    rules: {
      // ── RELAXED: Format constraints ──────────────────────────────
      // Tests are naturally longer than production code (setup + arrange + act + assert)
      '@typescript-eslint/no-explicit-any': 'off',
      'custom/code-size-limits': ['warn', { maxFileLines: 500, maxFunctionLines: 80, maxJsxLines: 80, skipBlankLines: true, skipComments: true }],
      'custom/component-organization': 'off',
      'custom/no-hardcoded-ui-strings': 'off',
      'custom/no-magic-literal-comparison': 'off',
      'react/display-name': 'off',
      'react/function-component-definition': 'off',
      'react/jsx-no-bind': 'off',

      // ── ENFORCED: Testing Library best practices ─────────────────
      'testing-library/await-async-queries': 'warn',
      'testing-library/no-node-access': 'off',
      'testing-library/prefer-screen-queries': 'warn',
      'testing-library/render-result-naming-convention': 'warn',

      // ── ENFORCED: Vitest plugin — quality over quantity ──────────
      // Structure & consistency
      'vitest/consistent-test-it': ['warn', { fn: 'it', withinDescribe: 'it' }],
      'vitest/no-identical-title': 'error',
      'vitest/require-top-level-describe': 'warn',
      'vitest/no-duplicate-hooks': 'warn',

      // No dead or forgotten tests (CI safety)
      'vitest/no-focused-tests': 'error',
      'vitest/no-disabled-tests': 'warn',

      // Every test MUST assert something (no empty tests)
      'vitest/expect-expect': ['warn', { assertFunctionNames: ['expect', 'modal.assert*', 'form.assert*', 'assertText', 'assertTexts', 'assertNoText', 'assertTestId', 'assertTestIds', 'assertRole', 'assertNoRole', 'assertEmpty', 'assertEmptyContainer', 'assertSelector', 'assertNoSelector', 'assertMinElements', 'assertTextCount', 'assertRoleCount', 'expectSuccess', 'expectFailure', 'itRejectsUnauthorized', 'assertSuccess', 'assertFailure'] }],
      'vitest/no-standalone-expect': 'warn',
      'vitest/no-conditional-expect': 'off',

      // Cleaner assertions (prefer idiomatic matchers)
      'vitest/prefer-to-be': 'warn',
      'vitest/prefer-to-have-length': 'warn',
      'vitest/prefer-equality-matcher': 'warn',

      // Prevent test code smells
      'vitest/no-test-return-statement': 'warn',
      'vitest/prefer-hooks-on-top': 'warn',

      // ── ENFORCED: Custom testing rules ──────────────────────────────
      'custom/no-redundant-global-mocks': 'error',
      'custom/no-redundant-clear-mocks': 'warn',
      'custom/prefer-mocked-helper': 'warn',
      'custom/prefer-centralized-assertions': 'warn',
      'custom/prefer-user-helper': 'warn',
      'custom/no-await-import-in-beforeeach': 'error',
      // Phase 2 additions (audit 2026-04-06)
      'custom/no-english-in-mock-errors': 'warn',
      'custom/no-inline-hook-mock-factory': 'error',
      'custom/prefer-once-in-test': 'warn',

      // ── ENFORCED: Vitest plugin — additional quality rules ───────────
      'vitest/valid-expect-in-promise': 'error',     // expect() inside .then() without await/return
      'vitest/no-alias-methods': 'warn',             // toBeCalled → toHaveBeenCalled (autofix)
      'vitest/prefer-comparison-matcher': 'warn',    // expect(x > 5).toBe(true) → toBeGreaterThan (autofix)
      'vitest/prefer-mock-promise-shorthand': 'warn', // mockImplementation(()=>Promise.resolve()) → mockResolvedValue (autofix)
      'vitest/prefer-called-once': 'warn',           // toHaveBeenCalledTimes(1) → toHaveBeenCalledOnce (autofix)

      // ── ENFORCED: Testing Library — additional query rules ───────────
      'testing-library/prefer-find-by': 'warn',         // waitFor+getBy → findBy (autofix)
      'testing-library/no-unnecessary-act': 'warn',     // act() wrapping sync queries
      'testing-library/prefer-presence-queries': 'warn', // queryBy for presence → getBy
    },
  },
  // Repository tests - no testing-library (false positives for findByRole method)
  {
    files: ['src/libs/infrastructure/repositories/**/*.test.ts'],
    rules: {
      'testing-library/prefer-screen-queries': 'off',
    },
  },
  // Test helpers - expect() in utility functions (not test blocks) is intentional
  // Centralized assertions disabled to avoid circular deps (these files ARE the helpers)
  {
    files: ['src/libs/shared/testing/utils/**/*.{ts,tsx}'],
    rules: {
      'vitest/no-standalone-expect': 'off',
      'custom/prefer-centralized-assertions': 'off',
    },
  },
  // userEvent re-export - centralized testing-library import
  {
    files: ['src/libs/shared/testing/user-event.ts'],
    rules: {
      'custom/no-alias-exports': 'off',
    },
  },
  // Redux typed hooks - official Redux Toolkit pattern for TypedUseSelectorHook
  {
    files: ['src/libs/presentation/hooks/useRedux/useRedux.ts'],
    rules: {
      'custom/no-alias-exports': 'off',
    },
  },
  // Redux store config - official Redux Toolkit pattern for RootState/AppDispatch type exports
  {
    files: ['src/libs/infrastructure/state/store/store.config.ts'],
    rules: {
      'custom/no-alias-exports': 'off',
    },
  },
  // API config - JSON default re-export as named for better DX
  {
    files: ['src/libs/infrastructure/config/api.config.ts'],
    rules: {
      'custom/no-alias-exports': 'off',
    },
  },
  // Interface files - type aliases for complex types are standard TypeScript practice
  {
    files: ['**/*.interfaces.ts'],
    rules: {
      'custom/no-alias-exports': 'off',
    },
  },
  // Error handler tests - intentionally test English error string detection
  {
    files: [
      'src/libs/infrastructure/middleware/error-handler/**/*.test.ts',
      'src/libs/shared/helpers/error-handling/**/*.test.ts',
    ],
    rules: {
      'custom/no-english-in-mock-errors': 'off',
    },
  },
  // Test helper tests - directly import userEvent to test helper internals
  {
    files: ['src/libs/shared/testing/utils/test-helpers/**/*.{ts,tsx}'],
    rules: {
      'custom/prefer-user-helper': 'off',
    },
  },
  // Test helper generators - it() calls are inside generator functions, not module scope
  {
    files: ['src/libs/shared/testing/helpers/**/*.ts'],
    rules: {
      'vitest/require-top-level-describe': 'off',
      'custom/no-english-in-mock-errors': 'off',
    },
  },
  // ═══════════════════════════════════════════════════════════════════
  // E2E TEST FILES (Playwright .spec.ts)
  //
  // DIFFERENT from unit tests (.test.ts):
  // - No Vitest (vi.mock, vi.fn) — uses real services
  // - No Testing Library — uses Playwright locators
  // - No centralized assert helpers — uses Playwright expect()
  // - Enforced: Playwright best practices (semantic locators, no sleeps, no hardcoded creds)
  // ═══════════════════════════════════════════════════════════════════
  {
    files: ['e2e/**/*.{ts,tsx}'],
    rules: {
      // ── DISABLE unit testing rules (not applicable to E2E) ────────
      'custom/essential-testing': 'off',
      'custom/no-redundant-global-mocks': 'off',
      'custom/no-redundant-clear-mocks': 'off',
      'custom/prefer-mocked-helper': 'off',
      'custom/prefer-centralized-assertions': 'off',
      'custom/prefer-user-helper': 'off',
      'custom/no-await-import-in-beforeeach': 'off',
      'custom/no-english-in-mock-errors': 'off',
      'custom/no-inline-hook-mock-factory': 'off',
      'custom/prefer-once-in-test': 'off',
      'custom/architecture-boundaries': 'off',
      'custom/import-strategy': 'off',
      'custom/import-order': 'off',
      'custom/no-native-html': 'off',
      'custom/design-tokens-policy': 'off',
      'custom/no-direct-service-calls': 'off',
      'custom/require-use-client-directive': 'off',
      'custom/component-organization': 'off',
      'custom/no-hardcoded-ui-strings': 'off',
      'testing-library/prefer-screen-queries': 'off',
      'testing-library/no-wait-for-multiple-assertions': 'off',
      'testing-library/no-wait-for-side-effects': 'off',
      'testing-library/no-node-access': 'off',
      'testing-library/await-async-queries': 'off',
      'testing-library/render-result-naming-convention': 'off',
      'testing-library/prefer-find-by': 'off',
      'testing-library/no-unnecessary-act': 'off',
      'testing-library/prefer-presence-queries': 'off',
      'testing-library/await-async-utils': 'off',

      // ── ENFORCE E2E best practices ────────────────────────────────
      'custom/e2e-testing-policy': 'error',

      // ── RELAX format constraints for E2E ──────────────────────────
      'custom/code-size-limits': 'off',
      'custom/comments-policy': 'off',
      'custom/no-magic-literal-comparison': 'off',
      'no-await-in-loop': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
  // ═══════════════════════════════════════════════════════════════════
  // DEMO TOUR specs (e2e/specs/demo/**)
  // - Not real tests; presentation tours through the app
  // - Allow waitForTimeout for narrated pauses
  // - Allow console for cleanup logging
  // ═══════════════════════════════════════════════════════════════════
  {
    files: ['e2e/specs/demo/**/*.{ts,tsx}'],
    rules: {
      'custom/e2e-testing-policy': 'off',
      'no-console': 'off',
      'no-empty-pattern': 'off',
    },
  },
];
