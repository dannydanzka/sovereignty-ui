/**
 * ESLint Rule: component-organization
 *
 * Unified file organization enforcement for Clean Architecture.
 * Philosophy: "Separation of concerns at the file level"
 *
 * CONSOLIDATES:
 * - no-inline-types (deprecated)
 * - no-inline-constants (deprecated)
 *
 * TYPES POLICY:
 *   - FORBIDDEN: interface/type in implementation files
 *   - REQUIRED: Types in .interfaces.ts or .types.ts
 *   - ALLOWED: Simple primitives (string | number unions)
 *
 * CONSTANTS POLICY:
 *   - FORBIDDEN: SCREAMING_SNAKE_CASE in implementation files
 *   - REQUIRED: Constants in .constants.ts
 *   - ALLOWED: Component-specific (INITIAL_*, DEFAULT_*, *_OPTIONS, etc.)
 *
 * HELPERS POLICY:
 *   - FORBIDDEN: Pure transformation functions (normalize*, sort*, transform*,
 *     format*, parse*, filter*, compute*, calculate*, extract*) in implementation files
 *   - REQUIRED: Pure helpers in .helpers.ts
 *   - RATIONALE: Service/component files contain orchestration; pure transformation
 *     logic belongs in helpers, keeping each file's responsibility singular
 *
 * FILE EXEMPTIONS:
 *   - .interfaces.ts, .types.ts, .d.ts
 *   - .constants.ts, .config.ts, .helpers.ts
 *   - .test.ts, .mock.ts, /mocks/
 *   - .entity.ts, .styled.ts
 *
 * @version 1.1.0
 * @reviewed 2026-06-19
 */

/** Patterns for constants allowed inline (component-specific) */
const ALLOWED_CONSTANT_PATTERNS = [
  /^INITIAL_/, /^DEFAULT_/, /^FALLBACK_/, /^MOCK_/,
  /_OPTIONS$/, /_LABELS$/, /_MODAL$/, /_ITEMS$/, /_ACTIONS$/,
  /_ICONS$/, /_ICON_MAP$/, /_MAP$/, /_MAPPINGS?$/, /_CATEGORIES$/,
  /_IDS$/, /_TABS$/, /^SPANISH_/, /^ENGLISH_/, /^REGEX$/, /^PATTERN$/,
  /_REGEX$/, /_PATTERN$/, /_MS$/, /_SECONDS$/, /_MINUTES$/,
  /^MAX_/, /^MIN_/, /_PERMISSIONS$/, /_DURATIONS?$/, /_NAMES$/,
  /^MIME_TYPE/, /_MIME_TYPES$/, /_URLS?$/, /_ENDPOINTS?$/,
  /_VALUES$/, /_ROUTES?$/, /_ROLES$/, /^ALLOWED_/, /_TRANSITIONS$/,
  /_COLORS?$/, /_STATUS(ES)?$/, /_PROVIDERS?$/, /_TYPES?$/,
  /_LIMITS?$/, /_CONFIGS?$/, /_PLANS?$/, /^REFRESH_/, /^CACHE_/,
  /^AUTH_/, /^PARTICIPANT_/, /^RESERVED_/, /_RULES?$/,
  /_TOAST_LABELS$/, /_NAVIGATION_ITEMS$/,
];

/**
 * Naming prefixes that identify pure transformation/utility functions.
 * Functions matching these patterns must live in .helpers.ts files.
 * The [A-Z] suffix ensures camelCase — avoids false positives on short names.
 */
const HELPER_NAMING_PATTERNS = [
  /^normalize[A-Z]/,
  /^transform[A-Z]/,
  /^sort[A-Z]/,
  /^format[A-Z]/,
  /^parse[A-Z]/,
  /^filter[A-Z]/,
  /^compute[A-Z]/,
  /^calculate[A-Z]/,
  /^extract[A-Z]/,
];

/** @type {import('eslint').Rule.RuleModule} */
export const componentOrganizationRule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce file organization: types in .interfaces.ts, constants in .constants.ts.',
      category: 'Code Organization',
      recommended: true,
    },
    messages: {
      inlineInterface: 'Interface "{{name}}" must be in .interfaces.ts file.',
      inlineType: 'Type "{{name}}" must be in .interfaces.ts or .types.ts file.',
      inlineConstant: 'Constant "{{name}}" must be in .constants.ts file (e.g., {{suggestedFile}}).',
      inlineHelper:
        'Helper function "{{name}}" must be in .helpers.ts file (e.g., {{suggestedFile}}). ' +
        'Pure transformation functions (normalize*, sort*, transform*, format*, parse*, ' +
        'filter*, compute*, calculate*, extract*) belong in .helpers.ts.',
    },
    schema: [],
  },

  create(context) {
    const filename = context.getFilename();

    const isAllowedFile =
      filename.endsWith('.interfaces.ts') ||
      filename.endsWith('.types.ts') ||
      filename.endsWith('.d.ts') ||
      filename.endsWith('.entity.ts') ||
      filename.endsWith('.constants.ts') ||
      filename.endsWith('.constants.tsx') ||
      filename.endsWith('.helpers.ts') ||
      filename.endsWith('.helpers.tsx') ||
      filename.endsWith('.config.ts') ||
      filename.endsWith('.config.js') ||
      filename.endsWith('.test.ts') ||
      filename.endsWith('.test.tsx') ||
      filename.endsWith('.spec.ts') ||
      filename.endsWith('.spec.tsx') ||
      filename.endsWith('.mock.ts') ||
      filename.endsWith('.mock.tsx') ||
      filename.endsWith('.styled.ts') ||
      filename.endsWith('.styled.tsx') ||
      filename.includes('/mocks/') ||
      filename.includes('/__tests__/') ||
      filename.includes('/testing/') ||
      filename.includes('/seeds/') ||
      filename.includes('/scripts/') ||
      filename.includes('jest.setup') ||
      filename.includes('vitest.setup');

    if (isAllowedFile) return {};

    const isScreamingSnakeCase = (name) => /^[A-Z][A-Z0-9]*(_[A-Z0-9]+)+$/.test(name);

    const isComponentOrHook = (name) => {
      if (/^use[A-Z]/.test(name)) return true;
      if (/^[A-Z]/.test(name) && /[a-z]/.test(name)) return true;
      return false;
    };

    const isAllowedConstantPattern = (name) => ALLOWED_CONSTANT_PATTERNS.some((pattern) => pattern.test(name));

    const isHelperNaming = (name) => HELPER_NAMING_PATTERNS.some((pattern) => pattern.test(name));

    const isFunction = (init) =>
      init && (init.type === 'ArrowFunctionExpression' || init.type === 'FunctionExpression');

    const isSimplePrimitive = (init) => {
      if (!init) return true;
      if (init.type === 'Literal') {
        return typeof init.value === 'number' || typeof init.value === 'boolean';
      }
      return false;
    };

    const isSimpleType = (typeAnnotation) => {
      const simpleTypes = [
        'TSLiteralType', 'TSStringKeyword', 'TSNumberKeyword',
        'TSBooleanKeyword', 'TSNullKeyword', 'TSUndefinedKeyword',
      ];
      if (simpleTypes.includes(typeAnnotation.type)) return true;
      if (typeAnnotation.type === 'TSUnionType') {
        return typeAnnotation.types.every((t) => simpleTypes.includes(t.type));
      }
      return false;
    };

    return {
      TSInterfaceDeclaration(node) {
        context.report({
          node,
          messageId: 'inlineInterface',
          data: { name: node.id.name },
        });
      },

      TSTypeAliasDeclaration(node) {
        if (isSimpleType(node.typeAnnotation)) return;
        context.report({
          node,
          messageId: 'inlineType',
          data: { name: node.id.name },
        });
      },

      VariableDeclaration(node) {
        if (node.kind !== 'const') return;

        node.declarations.forEach((declarator) => {
          if (!declarator.id || declarator.id.type !== 'Identifier') return;
          const name = declarator.id.name;

          if (isComponentOrHook(name)) return;

          const baseFilename = filename.split('/').pop()?.replace(/\.(ts|tsx)$/, '') || 'file';

          if (isFunction(declarator.init) && isHelperNaming(name)) {
            context.report({
              node: declarator,
              messageId: 'inlineHelper',
              data: { name, suggestedFile: `${baseFilename}.helpers.ts` },
            });
            return;
          }

          if (!isScreamingSnakeCase(name)) return;
          if (isAllowedConstantPattern(name)) return;
          if (isSimplePrimitive(declarator.init)) return;

          context.report({
            node: declarator,
            messageId: 'inlineConstant',
            data: { name, suggestedFile: `${baseFilename}.constants.ts` },
          });
        });
      },
    };
  },
};
