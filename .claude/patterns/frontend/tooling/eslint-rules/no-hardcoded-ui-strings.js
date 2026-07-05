/**
 * ESLint Rule: no-hardcoded-ui-strings
 *
 * Detects hardcoded user-facing strings in JSX that should be externalized
 * to i18n translation files (next-intl JSON messages).
 *
 * Philosophy: "UI text belongs in translation files, not scattered across
 * component logic. Externalized strings enable internationalization,
 * centralized text management, and consistent terminology."
 *
 * WHY:
 * - Enables future multi-language support without code changes
 * - Centralizes all UI text for easy review and consistency
 * - Makes text changes possible without developer intervention
 * - Aligns with Sovereignty Principle #6: Independencia Tecnológica
 *
 * SCOPE:
 * - Component files (.tsx)
 * - Only JSX context (text children and string props)
 *
 * DETECTS:
 *   <Title>Mis Retos</Title>                    → use t('challenges.title')
 *   <Label>Nombre</Label>                       → use t('form.name')
 *   placeholder="Escribe tu mensaje"            → use t('form.placeholder')
 *   title="Configuración"                       → use t('settings.title')
 *   { label: 'Crear Usuario', value: 'create' } → use t('users.create')
 *
 * IGNORES:
 * - Test files, styled files, interface files, constant files, entity files
 * - Strings < 2 characters
 * - Strings that are ALL_UPPERCASE (constants/enums)
 * - Technical strings (URLs, emails, CSS values, file paths)
 * - data-testid, className, key, type, htmlFor, id, name attributes
 * - aria-* attributes with non-text values
 * - Strings inside UI_TEXT/LABELS/MESSAGES constant references
 * - Template literals with expressions
 * - Strings in import/export statements
 * - Numbers-only strings
 * - Strings used in comparisons (=== / !==)
 *
 * @version 1.0.0
 * @reviewed 2026-03-04
 */

/** @type {import('eslint').Rule.RuleModule} */
export const noHardcodedUiStringsRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Enforce i18n translation functions instead of hardcoded UI strings in JSX. Move strings to translation JSON files.',
      recommended: true,
    },
    messages: {
      hardcodedString:
        'Hardcoded UI string "{{value}}" should use a translation function: t(\'{{suggestedKey}}\'). Move this string to the i18n messages JSON file.',
      hardcodedJsxText:
        'Hardcoded JSX text "{{value}}" should use a translation function. Move this string to the i18n messages JSON file.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          allowedStrings: {
            type: 'array',
            items: { type: 'string' },
            description: 'Additional strings to allow without translation',
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create: (context) => {
    const filename = context.filename || context.getFilename();

    // Only check .tsx files (JSX components)
    if (!/\.tsx$/.test(filename)) return {};

    // Skip files that don't contain UI strings
    const skipPatterns = [
      /\.(test|spec)\./,
      /\.(interfaces|types)\./,
      /\.(constants)\./,
      /\.(styled)\./,
      /\.(entity)\./,
      /\.mock\./,
      /\/mocks?\//,
      /__tests__\//,
      /\.config\./,
      // Legal pages: static content specific to Mexico, no i18n needed
      /PrivacyScreen\//,
      /TermsScreen\//,
      /CookiesScreen\//,
    ];
    if (skipPatterns.some((p) => p.test(filename))) return {};

    const options = context.options[0] || {};
    const extraAllowed = options.allowedStrings || [];

    // Strings that are safe to use inline (not user-facing)
    const ALLOWED_STRINGS = new Set([
      '',
      ' ',
      '.',
      ',',
      ':',
      ';',
      '-',
      '|',
      '/',
      '•',
      '…',
      '→',
      '←',
      '↑',
      '↓',
      '×',
      '+',
      '*',
      '#',
      '&',
      '@',
      '!',
      '?',
      '%',
      '$',
      '©',
      '®',
      ...extraAllowed,
    ]);

    // Props that are technical (not user-facing text)
    const TECHNICAL_PROPS = new Set([
      'className',
      'data-testid',
      'data-cy',
      'data-test',
      'htmlFor',
      'id',
      'key',
      'name',
      'type',
      'role',
      'href',
      'src',
      'alt', // alt IS user-facing but often dynamic
      'action',
      'method',
      'target',
      'rel',
      'as',
      'crossOrigin',
      'referrerPolicy',
      'sizes',
      'media',
      'accept',
      'autoComplete',
      'inputMode',
      'pattern',
      'xmlns',
      'viewBox',
      'fill',
      'stroke',
      'strokeWidth',
      'd',
      'transform',
      'variant',
      'size',
      'color',
      '$color',
      '$variant',
      '$size',
      '$direction',
      '$align',
      '$gap',
      '$padding',
      '$margin',
    ]);

    // Props that ARE user-facing (should be translated)
    const UI_PROPS = new Set([
      'placeholder',
      'title',
      'label',
      'description',
      'message',
      'errorMessage',
      'successMessage',
      'helperText',
      'tooltip',
      'confirmText',
      'cancelText',
      'submitText',
      'emptyMessage',
      'loadingText',
      'ariaLabel',
      'aria-label',
    ]);

    /**
     * Check if a string looks like technical content (not user-facing)
     */
    const isTechnicalString = (value) => {
      // Numbers only
      if (/^\d+(\.\d+)?$/.test(value)) return true;

      // ALL_UPPERCASE (constants/enums)
      if (/^[A-Z][A-Z0-9_]+$/.test(value)) return true;

      // URLs and paths
      if (/^(https?:|\/|\.\/|\.\.\/)/.test(value)) return true;

      // Email addresses
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return true;

      // CSS values (hex colors, dimensions, etc.)
      if (/^#[0-9a-fA-F]{3,8}$/.test(value)) return true;
      if (/^\d+(px|rem|em|%|vh|vw|deg|ms|s)$/.test(value)) return true;

      // camelCase or snake_case identifiers (technical IDs)
      if (/^[a-z][a-zA-Z0-9]*$/.test(value) && value.length <= 20) return true;
      if (/^[a-z][a-z0-9_]*$/.test(value) && value.length <= 30) return true;

      // kebab-case identifiers
      if (/^[a-z][a-z0-9-]*$/.test(value) && value.length <= 30) return true;

      // File extensions and MIME types
      if (/^\.[a-z]+$/.test(value)) return true;
      if (/^(image|video|audio|application)\//.test(value)) return true;

      // Date/time formats
      if (/^[YMDHhms/\-:.\s]+$/.test(value)) return true;

      // JSON-like or code-like
      if (/^[{[\]()}]/.test(value)) return true;

      return false;
    };

    /**
     * Check if a string contains Spanish/human-readable text
     * (words with spaces, accented chars, or common Spanish patterns)
     */
    const isHumanReadableText = (value) => {
      const trimmed = value.trim();

      // Too short to be meaningful UI text
      if (trimmed.length < 2) return false;

      // Contains spaces (likely a phrase/sentence)
      if (/\s/.test(trimmed) && trimmed.length >= 3) return true;

      // Contains accented characters (Spanish text)
      if (/[áéíóúñüÁÉÍÓÚÑÜ¿¡]/.test(trimmed)) return true;

      // Capitalized word >= 3 chars that isn't ALL_CAPS
      // (likely a UI label like "Nombre", "Guardar", "Eliminar")
      if (/^[A-ZÁÉÍÓÚÑÜ][a-záéíóúñü]{2,}/.test(trimmed)) return true;

      // Ends with common Spanish punctuation patterns
      if (/[.!?…]$/.test(trimmed) && trimmed.length >= 5) return true;

      return false;
    };

    /**
     * Check if node is inside a constant definition (UI_TEXT, LABELS, etc.)
     */
    const isInConstantObject = (node) => {
      let current = node.parent;
      while (current) {
        if (
          current.type === 'VariableDeclarator' &&
          current.id?.type === 'Identifier' &&
          /^[A-Z_][A-Z0-9_]*$/.test(current.id.name)
        ) {
          return true;
        }
        if (current.type === 'VariableDeclaration') break;
        if (current.type === 'ExportNamedDeclaration') break;
        current = current.parent;
      }
      return false;
    };

    /**
     * Check if node is in a comparison expression
     */
    const isInComparison = (node) => {
      const parent = node.parent;
      if (!parent) return false;
      if (parent.type === 'BinaryExpression' &&
        (parent.operator === '===' || parent.operator === '!==' ||
         parent.operator === '==' || parent.operator === '!=')) {
        return true;
      }
      return false;
    };

    /**
     * Check if node is inside a switch case
     */
    const isInSwitchCase = (node) => {
      let current = node.parent;
      while (current) {
        if (current.type === 'SwitchCase') return true;
        current = current.parent;
      }
      return false;
    };

    /**
     * Check if node is inside a console.log/warn/error call
     */
    const isInConsoleCall = (node) => {
      let current = node.parent;
      while (current) {
        if (
          current.type === 'CallExpression' &&
          current.callee?.type === 'MemberExpression' &&
          current.callee.object?.name === 'console'
        ) {
          return true;
        }
        current = current.parent;
      }
      return false;
    };

    /**
     * Check if node is inside a throw/Error expression
     */
    const isInErrorExpression = (node) => {
      let current = node.parent;
      while (current) {
        if (current.type === 'ThrowStatement') return true;
        if (
          current.type === 'NewExpression' &&
          current.callee?.type === 'Identifier' &&
          /Error$/.test(current.callee.name)
        ) {
          return true;
        }
        if (
          current.type === 'CallExpression' &&
          current.callee?.type === 'Identifier' &&
          /^(createAppError|handleUseCaseError)$/.test(current.callee.name)
        ) {
          return true;
        }
        current = current.parent;
      }
      return false;
    };

    /**
     * Suggest a translation key from the string value
     */
    const suggestKey = (value) => {
      const simplified = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/[^a-z0-9\s]/g, '')     // Remove special chars
        .trim()
        .split(/\s+/)
        .slice(0, 4)                      // Max 4 words
        .join('_');

      return simplified || 'key';
    };

    /**
     * Get prop name from a JSXAttribute parent
     */
    const getJsxPropName = (node) => {
      let current = node.parent;
      while (current) {
        if (current.type === 'JSXAttribute' && current.name) {
          return current.name.name || (current.name.namespace?.name + ':' + current.name.name?.name);
        }
        if (current.type === 'JSXElement' || current.type === 'JSXFragment') break;
        current = current.parent;
      }
      return null;
    };

    /**
     * Check if inside a JSX context
     */
    const isInJsxContext = (node) => {
      let current = node.parent;
      while (current) {
        if (
          current.type === 'JSXElement' ||
          current.type === 'JSXFragment' ||
          current.type === 'JSXAttribute' ||
          current.type === 'JSXExpressionContainer'
        ) {
          return true;
        }
        current = current.parent;
      }
      return false;
    };

    /**
     * Check if node is a label/text property in an object inside JSX
     * e.g., { label: 'Todos los roles', value: '' }
     */
    const isUiPropertyInObject = (node) => {
      const parent = node.parent;
      if (!parent || parent.type !== 'Property') return false;

      const propName = parent.key?.name || parent.key?.value;
      const uiObjectProps = new Set([
        'label', 'title', 'description', 'message', 'text',
        'placeholder', 'tooltip', 'helperText', 'errorMessage',
        'successMessage', 'confirmText', 'cancelText', 'header',
        'subtitle', 'heading', 'caption', 'hint',
      ]);

      return uiObjectProps.has(propName);
    };

    return {
      // Detect hardcoded text as JSX children: <Tag>Text here</Tag>
      JSXText: (node) => {
        const value = node.value.trim();

        if (!value) return;
        if (ALLOWED_STRINGS.has(value)) return;
        if (isTechnicalString(value)) return;
        if (!isHumanReadableText(value)) return;
        if (isInConstantObject(node)) return;

        context.report({
          node,
          messageId: 'hardcodedJsxText',
          data: { value: value.length > 40 ? value.substring(0, 40) + '...' : value },
        });
      },

      // Detect hardcoded strings in JSX props and object properties
      Literal: (node) => {
        if (typeof node.value !== 'string') return;

        const value = node.value.trim();
        if (!value) return;
        if (ALLOWED_STRINGS.has(value)) return;
        if (isTechnicalString(value)) return;
        if (!isHumanReadableText(value)) return;

        // Skip non-JSX contexts unless it's a UI property in an object
        if (!isInJsxContext(node) && !isUiPropertyInObject(node)) return;

        // Skip constant definitions
        if (isInConstantObject(node)) return;

        // Skip comparisons, switch cases, console, errors
        if (isInComparison(node)) return;
        if (isInSwitchCase(node)) return;
        if (isInConsoleCall(node)) return;
        if (isInErrorExpression(node)) return;

        // Check if it's a JSX prop
        const propName = getJsxPropName(node);
        if (propName) {
          // Skip technical props
          if (TECHNICAL_PROPS.has(propName)) return;

          // Skip data-* and aria-* (except aria-label)
          if (/^data-/.test(propName)) return;
          if (/^aria-/.test(propName) && propName !== 'aria-label') return;

          // Skip transient props ($prefix — styled-components)
          if (/^\$/.test(propName)) return;

          // Only warn on known UI props or if the string looks clearly human-readable
          if (UI_PROPS.has(propName) || isHumanReadableText(value)) {
            context.report({
              node,
              messageId: 'hardcodedString',
              data: {
                value: value.length > 40 ? value.substring(0, 40) + '...' : value,
                suggestedKey: suggestKey(value),
              },
            });
          }
          return;
        }

        // Object property with UI label
        if (isUiPropertyInObject(node)) {
          context.report({
            node,
            messageId: 'hardcodedString',
            data: {
              value: value.length > 40 ? value.substring(0, 40) + '...' : value,
              suggestedKey: suggestKey(value),
            },
          });
          return;
        }

        // String in JSX expression container (e.g., {'Some text'})
        if (node.parent?.type === 'JSXExpressionContainer') {
          context.report({
            node,
            messageId: 'hardcodedString',
            data: {
              value: value.length > 40 ? value.substring(0, 40) + '...' : value,
              suggestedKey: suggestKey(value),
            },
          });
        }
      },

      // Detect template literals in JSX that contain hardcoded text
      TemplateLiteral: (node) => {
        // Only check template literals without expressions (pure strings)
        if (node.expressions.length > 0) return;
        if (node.quasis.length !== 1) return;

        const value = node.quasis[0].value.raw.trim();
        if (!value) return;
        if (ALLOWED_STRINGS.has(value)) return;
        if (isTechnicalString(value)) return;
        if (!isHumanReadableText(value)) return;

        // Only in JSX context or UI properties
        if (!isInJsxContext(node) && !isUiPropertyInObject(node)) return;

        // Skip constants, comparisons, console, errors
        if (isInConstantObject(node)) return;
        if (isInConsoleCall(node)) return;
        if (isInErrorExpression(node)) return;

        const propName = getJsxPropName(node);
        if (propName && TECHNICAL_PROPS.has(propName)) return;

        context.report({
          node,
          messageId: 'hardcodedString',
          data: {
            value: value.length > 40 ? value.substring(0, 40) + '...' : value,
            suggestedKey: suggestKey(value),
          },
        });
      },
    };
  },
};
