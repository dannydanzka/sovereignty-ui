/**
 * ESLint Custom Rule: no-native-html
 *
 * Enforces that ALL JSX elements must be styled-components imported from .styled.ts files.
 * NO native HTML elements (div, span, button, etc.) are allowed in implementation files.
 * NO inline styled-component declarations in .tsx files.
 *
 * Purpose: Maintains 100% styled-components architecture for consistent theming,
 * better component composition, and centralized styling in dedicated .styled.ts files.
 *
 * Violations Detected:
 * 1. Native HTML elements in .tsx files (div, span, button, input, etc.)
 * 2. Elements with className prop (indicates inline styling)
 * 3. Inline styled-component declarations (const X = styled.div`...`)
 *
 * Exceptions:
 * - Test files (.test.tsx, .spec.tsx) - Can use native elements for testing
 * - .styled.ts files - Can define styled-components
 * - Framework components (Next.js: Image, Link; Gatsby: Link, etc.)
 * - SVG elements (svg, path, circle, etc.)
 * - Fragment (<>, <Fragment>)
 *
 * Allowed Pattern:
 * ✅ // Component.styled.ts
 * ✅ export const Container = styled.div`...`;
 * ✅ // Component.tsx
 * ✅ import { Container, Title, Button } from './Component.styled';
 * ✅ <Container><Title>Text</Title><Button>Click</Button></Container>
 *
 * Forbidden Patterns:
 * ❌ <div className="container"><h1>Title</h1><button>Click</button></div>
 * ❌ const Container = styled.div`padding: 20px;`;  // Must be in .styled.ts
 *
 * Agnostic Design:
 * - Works with any React + styled-components project
 * - Framework-agnostic (supports Next.js, Gatsby, Create React App, etc.)
 * - No hardcoded paths or project-specific references
 * - Configurable exceptions via standard patterns
 *
 * @reviewed 2025-10-18 00:00
 */

/**
 * @typedef {import('eslint').Rule.RuleModule} RuleModule
 * @typedef {import('eslint').Rule.RuleContext} RuleContext
 * @typedef {import('eslint').Rule.Node} Node
 */

const NATIVE_HTML_ELEMENTS = new Set([
  // Text content
  'div',
  'span',
  'p',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'strong',
  'em',
  'small',
  'mark',
  'del',
  'ins',
  'sub',
  'sup',
  'blockquote',
  'pre',
  'code',
  'kbd',
  'samp',
  'var',
  'abbr',
  'cite',
  'dfn',
  'time',
  'address',

  // Lists
  'ul',
  'ol',
  'li',
  'dl',
  'dt',
  'dd',

  // Forms
  'form',
  'input',
  'button',
  'select',
  'option',
  'textarea',
  'label',
  'fieldset',
  'legend',
  'datalist',
  'output',
  'progress',
  'meter',

  // Semantic
  'header',
  'footer',
  'main',
  'section',
  'article',
  'aside',
  'nav',
  'figure',
  'figcaption',

  // Tables
  'table',
  'thead',
  'tbody',
  'tfoot',
  'tr',
  'th',
  'td',
  'caption',
  'colgroup',
  'col',

  // Media
  'img',
  'video',
  'audio',
  'source',
  'track',
  'canvas',
  'picture',

  // Interactive
  'a',
  'details',
  'summary',
  'dialog',
  'menu',

  // Embedded
  'iframe',
  'embed',
  'object',
  'param',

  // Other
  'hr',
  'br',
  'wbr',
]);

const NEXT_JS_COMPONENTS = new Set([
  'Image',
  'Link',
  'Script',
  'Head',
  'Html',
  'Body',
  'Main',
  'NextScript',
]);

const ALLOWED_ELEMENTS = new Set([
  // React
  'Fragment',

  // SVG elements
  'svg',
  'path',
  'circle',
  'rect',
  'line',
  'polyline',
  'polygon',
  'ellipse',
  'g',
  'text',
  'tspan',
  'defs',
  'linearGradient',
  'radialGradient',
  'stop',
  'pattern',
  'mask',
  'clipPath',
  'use',
  'symbol',
]);

/**
 * ESLint rule enforcing styled-components only (no native HTML elements)
 *
 * @type {RuleModule}
 */
/** @type {import('eslint').Rule.RuleModule} */
export const noNativeHtmlRule = {
  /**
   * Create the rule visitor
   *
   * @param {RuleContext} context - The rule context provided by ESLint
   * @returns {Object} The visitor object with node handlers
   */
  create(context) {
    const filename = context.getFilename();

    // Skip test files - they can use native elements for testing
    const isTestFile =
      filename.endsWith('.test.tsx') ||
      filename.endsWith('.test.ts') ||
      filename.endsWith('.spec.tsx') ||
      filename.endsWith('.spec.ts') ||
      filename.includes('__tests__') ||
      filename.includes('/testing/');

    if (isTestFile) {
      return {};
    }

    // Skip .styled.ts files - they define styled components
    const isStyledFile = filename.endsWith('.styled.ts') || filename.endsWith('.styled.tsx');

    if (isStyledFile) {
      return {};
    }

    return {
      // Detect inline styled-component declarations
      VariableDeclarator(node) {
        // Check if this is a styled-component declaration: const X = styled.div`...`
        if (
          node.init &&
          node.init.type === 'TaggedTemplateExpression' &&
          node.init.tag &&
          node.init.tag.type === 'MemberExpression' &&
          node.init.tag.object &&
          node.init.tag.object.name === 'styled'
        ) {
          const componentName = node.id.name;
          const styledElement = node.init.tag.property.name;

          context.report({
            data: {
              component: componentName,
              element: styledElement,
            },
            message:
              'Styled-component "{{component}}" (styled.{{element}}) must be in a .styled.ts file, not inline in component file. Move to co-located .styled.ts file.',
            node,
          });
        }
      },

      JSXElement(node) {
        const elementName = node.openingElement.name;

        // Handle JSXIdentifier (simple elements like <div>)
        if (elementName.type === 'JSXIdentifier') {
          const name = elementName.name;

          // Skip if it's an allowed element
          if (ALLOWED_ELEMENTS.has(name) || NEXT_JS_COMPONENTS.has(name)) {
            return;
          }

          // Check if it's a native HTML element
          if (NATIVE_HTML_ELEMENTS.has(name)) {
            // Check if element has className prop (strong indicator of inline styling)
            const hasClassName = node.openingElement.attributes.some(
              (attr) => attr.type === 'JSXAttribute' && attr.name && attr.name.name === 'className'
            );

            const message = hasClassName
              ? `Native HTML element "<${name}>" with className is forbidden. Use styled-components from .styled.ts file instead. Example: import { ${
                  name.charAt(0).toUpperCase() + name.slice(1)
                } } from './*.styled'`
              : `Native HTML element "<${name}>" is forbidden. All elements must be styled-components from .styled.ts files.`;

            context.report({
              data: {
                element: name,
              },
              message,
              node,
            });
          }
        }

        // Handle JSXMemberExpression (e.g., <motion.div>)
        if (elementName.type === 'JSXMemberExpression') {
          // Allow for now - these are usually third-party components
          return;
        }
      },
    };
  },
  meta: {
    docs: {
      category: 'Best Practices',
      description:
        'Enforce that all JSX elements are styled-components, no native HTML elements allowed',
      recommended: true,
    },
    fixable: null,
    messages: {
      nativeElement: 'Native HTML element "<{{element}}>" is forbidden. Use styled-components.',
      nativeWithClassName:
        'Native HTML element "<{{element}}>" with className detected. Use styled-components.',
    },
    schema: [],
    type: 'problem',
  },
};
