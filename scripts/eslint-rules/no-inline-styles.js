/**
 * ESLint Rule: no-inline-styles
 *
 * Enforces that inline styles (style={{}}) are NOT used in JSX.
 * All styling must go through styled-components with design tokens.
 *
 * SOVEREIGNTY PRINCIPLE: Self-Sufficiency + Secure Trade
 * Each component manages its own visual presentation through its styled layer.
 * Inline styles bypass the design token system and break SSR-safe patterns.
 *
 * WHY:
 * - Inline styles bypass design-tokens-policy (tokens not reachable from style={{}})
 * - Inline styles can't use responsive breakpoints or theme-aware CSS
 * - Mixing inline styles with styled-components creates two sources of truth
 * - Dynamic styling belongs in styled-component props ($variant, $active, etc.)
 *
 * DETECTS:
 *   style={{ marginRight: '0.5rem' }}      → add margin to styled component
 *   style={{ cursor: 'pointer' }}          → add cursor to styled component or use $clickable prop
 *   style={{ paddingRight: '48px' }}       → styled component with $hasIcon prop
 *
 * EXCEPTIONS:
 * - Email templates (React Email/Resend requires inline styles — no CSS support)
 * - Test files
 *
 * @version 1.0.0
 * @reviewed 2026-03-06
 */

/** @type {import('eslint').Rule.RuleModule} */
export const noInlineStylesRule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow inline styles (style={{}}) in JSX. Use styled-components with design tokens instead.',
      recommended: true,
    },
    messages: {
      noInlineStyle:
        'Inline styles are not allowed. Move this styling to a styled-component. For dynamic values, use transient props ($prop) in the styled definition.',
    },
    schema: [],
  },
  create: (context) => {
    const filename = context.filename || context.getFilename();

    // Only check component files
    if (!/\.(tsx)$/.test(filename)) return {};

    // Skip test files
    if (/\.(test|spec)\./.test(filename)) return {};

    // Skip email templates — React Email/Resend requires inline styles (no CSS support)
    if (/\/email\/templates\//.test(filename)) return {};

    return {
      JSXAttribute: (node) => {
        // Detect style={{ ... }}
        if (node.name?.name !== 'style') return;
        if (node.value?.type !== 'JSXExpressionContainer') return;
        if (node.value.expression?.type !== 'ObjectExpression') return;

        context.report({
          node,
          messageId: 'noInlineStyle',
        });
      },
    };
  },
};
