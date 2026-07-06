/**
 * ESLint Custom Rule: Prefer i18n Keys in Errors
 *
 * Enforces that error-construction helpers and error response literals in
 * the backend (use-cases, helpers, middleware) emit i18n keys instead of
 * hardcoded user-facing strings.
 *
 * Flagged calls:
 *   - createValidationError('...' as literal non-key)
 *   - createAuthorizationError('...' as literal non-key)
 *   - createBusinessLogicError('...' as literal non-key)
 *   - { error: '...' as literal non-key, success: false } response shape
 *
 * Not flagged:
 *   - createNotFoundError — first arg has dual semantics (resource name OR key),
 *     handled at helper level with `errors.` prefix detection.
 *   - Variables, template literals, or function calls — only string literals.
 *
 * Accepted key shape: /^errors\.[a-zA-Z]+(\.[a-zA-Z]+)+$/
 *
 * @see .claude/plans/PLAN-I18N-ERROR-KEYS.md
 * @see src/libs/shared/i18n/messages/es.json → errors.* namespace
 */

const KEY_REGEX = /^errors\.[a-zA-Z]+(\.[a-zA-Z]+)+$/;

const ENFORCED_HELPERS = new Set([
  'createValidationError',
  'createAuthorizationError',
  'createBusinessLogicError',
]);

const isErrorResponseObject = (node) => {
  if (node.type !== 'ObjectExpression') return false;
  const props = node.properties;
  const hasSuccessFalse = props.some(
    (p) =>
      p.type === 'Property' &&
      p.key.type === 'Identifier' &&
      p.key.name === 'success' &&
      p.value.type === 'Literal' &&
      p.value.value === false
  );
  const hasErrorProp = props.some(
    (p) =>
      p.type === 'Property' &&
      p.key.type === 'Identifier' &&
      p.key.name === 'error'
  );
  return hasSuccessFalse && hasErrorProp;
};

/** @type {import('eslint').Rule.RuleModule} */
export const preferI18nKeysInErrorsRule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Backend error helpers must emit i18n keys (errors.*) instead of hardcoded Spanish/English literals',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      literalInHelper:
        '"{{fn}}" must receive an i18n key matching /^errors\\.[a-zA-Z]+(\\.[a-zA-Z]+)+$/. Got: "{{value}}"',
      literalInErrorResponse:
        'Error response "{ error: \'...\' }" must use an i18n key matching /^errors\\.[a-zA-Z]+(\\.[a-zA-Z]+)+$/. Got: "{{value}}"',
    },
    schema: [],
  },

  create(context) {
    const filename = context.filename || context.getFilename();
    if (filename.match(/\.(test|spec)\.(ts|tsx|js|jsx)$/)) return {};

    const isBackendFile =
      filename.includes('/application/use-cases/') ||
      filename.includes('/libs/shared/helpers/use-case/') ||
      filename.includes('/libs/shared/helpers/error-handling/') ||
      filename.includes('/libs/infrastructure/middleware/');

    if (!isBackendFile) return {};

    return {
      CallExpression(node) {
        if (
          node.callee.type !== 'Identifier' ||
          !ENFORCED_HELPERS.has(node.callee.name)
        ) {
          return;
        }
        const first = node.arguments[0];
        if (!first) return;
        if (first.type === 'TemplateLiteral') {
          context.report({
            node: first,
            messageId: 'literalInHelper',
            data: { fn: node.callee.name, value: '<template literal>' },
          });
          return;
        }
        if (first.type !== 'Literal' || typeof first.value !== 'string') {
          return;
        }
        if (KEY_REGEX.test(first.value)) return;
        context.report({
          node: first,
          messageId: 'literalInHelper',
          data: {
            fn: node.callee.name,
            value: first.value.slice(0, 80),
          },
        });
      },
      ReturnStatement(node) {
        if (!node.argument || !isErrorResponseObject(node.argument)) return;
        const errorProp = node.argument.properties.find(
          (p) =>
            p.type === 'Property' &&
            p.key.type === 'Identifier' &&
            p.key.name === 'error'
        );
        if (
          !errorProp ||
          errorProp.value.type !== 'Literal' ||
          typeof errorProp.value.value !== 'string'
        ) {
          return;
        }
        if (KEY_REGEX.test(errorProp.value.value)) return;
        // When the object already has an `i18n.key`, the `error` field is the human-readable
        // fallback string (used by handleRequest when i18n is unavailable). Do not flag.
        const hasI18nKey = node.argument.properties.some(
          (p) =>
            p.type === 'Property' &&
            p.key.type === 'Identifier' &&
            p.key.name === 'i18n' &&
            p.value.type === 'ObjectExpression' &&
            p.value.properties.some(
              (ip) =>
                ip.type === 'Property' &&
                ip.key.type === 'Identifier' &&
                ip.key.name === 'key'
            )
        );
        if (hasI18nKey) return;
        context.report({
          node: errorProp.value,
          messageId: 'literalInErrorResponse',
          data: { value: errorProp.value.value.slice(0, 80) },
        });
      },
    };
  },
};
