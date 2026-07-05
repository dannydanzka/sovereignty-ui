export default {
  customSyntax: 'postcss-styled-syntax',
  extends: ['stylelint-config-standard'],
  overrides: [
    {
      files: ['**/*.styled.{ts,tsx}'],
      customSyntax: 'postcss-styled-syntax',
      defaultSeverity: 'warning',
      rules: {
        // Reglas específicas para styled-components
        'value-keyword-case': null,
        'function-no-unknown': null,
        'property-no-unknown': null,
        'no-empty-source': null,
        'no-invalid-double-slash-comments': null,
        'at-rule-no-unknown': null,
        'selector-pseudo-element-colon-notation': null,
        'function-name-case': null,
      }
    },
    {
      files: ['src/libs/presentation/styles/**/*.{ts,tsx}', 'src/libs/ui/styles/**/*.{ts,tsx}'],
      customSyntax: 'postcss-styled-syntax',
      defaultSeverity: 'warning',
    }
  ],
  plugins: ['stylelint-order'],
  rules: {
    'alpha-value-notation': 'number',
    'at-rule-no-unknown': null,
    'color-function-notation': 'modern',
    'declaration-block-no-duplicate-properties': true,
    'declaration-block-no-redundant-longhand-properties': true,
    'declaration-block-no-shorthand-property-overrides': true,
    'font-family-name-quotes': 'always-where-required',
    'font-family-no-missing-generic-family-keyword': true,
    'function-name-case': null,
    'function-no-unknown': null,

    // === PREMIOSFLOW: FLAT MAPS ENFORCEMENT (SSR-safe) ===
    // Prevent theme context usage (causes SSR crash)
    'function-disallowed-list': [
      [/theme\./],
      {
        message:
          '❌ Theme context forbidden (SSR crash). Use flat maps: colorsFlatMap.primary500, spacingFlatMap.md, typographyFlatMap.h1',
      },
    ],
    'length-zero-no-unit': true,
    'media-query-no-invalid': null,
    'no-descending-specificity': null,
    'no-empty-source': null,
    'no-invalid-double-slash-comments': null,
    'number-max-precision': 3,
    'order/order': [
      'custom-properties',
      'declarations',
      {
        type: 'at-rule',
        name: 'media',
      },
      'rules',
    ],
    'order/properties-alphabetical-order': true,
    'property-no-unknown': null,
    'property-no-vendor-prefix': true,
    'selector-class-pattern': null,
    'selector-pseudo-element-colon-notation': null,
    'shorthand-property-no-redundant-values': true,
    'value-keyword-case': null,
  },
  ignoreFiles: [
    'node_modules/**',
    '.next/**',
    'out/**',
    'dist/**',
    'build/**',
    '*.min.css',
    'coverage/**',
    '**/*.js',
    '**/*.jsx',
    '!**/*.styled.{ts,tsx}',
  ],
};
