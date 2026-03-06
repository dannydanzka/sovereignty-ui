/**
 * ESLint Rule: no-emojis-in-jsx
 *
 * Prevents emoji characters in JSX text content.
 * Emojis should be replaced with Lucide React icons for consistency.
 *
 * Allowed in:
 * - Console.log statements
 * - Comments
 * - Documentation files
 * - Test files (mocks)
 *
 * @example
 * // Bad
 * <Icon>🔔</Icon>
 * <span>Hello 👋</span>
 *
 * // Good
 * <Icon><Bell size={20} /></Icon>
 * <span>Hello <WaveIcon /></span>
 */

// Emoji regex - excludes arrows and common symbols, focuses on actual emojis
// Includes: faces, animals, food, objects, symbols (not arrows/technical symbols)
const EMOJI_REGEX =
  /[\u{1F300}-\u{1F5FF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F700}-\u{1F77F}]|[\u{1F780}-\u{1F7FF}]|[\u{1F800}-\u{1F8FF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA00}-\u{1FA6F}]|[\u{1FA70}-\u{1FAFF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{2B50}]/u;

export const noEmojisInJsxRule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow emoji characters in JSX. Use Lucide React icons instead.',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      noEmoji:
        'Emoji "{{emoji}}" found in JSX. Use Lucide React icons instead (e.g., <Bell />, <Calendar />, <AlertTriangle />).',
    },
    schema: [],
  },

  create(context) {
    const filename = context.getFilename();

    // Skip test files and email templates
    if (filename.includes('.test.') || filename.includes('/email/')) {
      return {};
    }

    return {
      JSXText(node) {
        const text = node.value;
        const match = text.match(EMOJI_REGEX);

        if (match) {
          context.report({
            node,
            messageId: 'noEmoji',
            data: {
              emoji: match[0],
            },
          });
        }
      },

      // Also check template literals in JSX expressions
      TemplateLiteral(node) {
        // Only check if inside JSX
        let parent = node.parent;
        let isInJSX = false;

        while (parent) {
          if (parent.type === 'JSXExpressionContainer') {
            isInJSX = true;
            break;
          }
          parent = parent.parent;
        }

        if (!isInJSX) return;

        node.quasis.forEach((quasi) => {
          const text = quasi.value.raw;
          const match = text.match(EMOJI_REGEX);

          if (match) {
            context.report({
              node: quasi,
              messageId: 'noEmoji',
              data: {
                emoji: match[0],
              },
            });
          }
        });
      },

      // Check string literals in JSX attributes and expressions
      Literal(node) {
        if (typeof node.value !== 'string') return;

        // Check if inside JSX
        let parent = node.parent;
        let isInJSX = false;

        while (parent) {
          if (
            parent.type === 'JSXExpressionContainer' ||
            parent.type === 'JSXAttribute'
          ) {
            isInJSX = true;
            break;
          }
          // Stop at function/object boundaries
          if (
            parent.type === 'FunctionDeclaration' ||
            parent.type === 'FunctionExpression' ||
            parent.type === 'ArrowFunctionExpression' ||
            parent.type === 'ObjectExpression' ||
            parent.type === 'ArrayExpression'
          ) {
            break;
          }
          parent = parent.parent;
        }

        if (!isInJSX) return;

        const match = node.value.match(EMOJI_REGEX);

        if (match) {
          context.report({
            node,
            messageId: 'noEmoji',
            data: {
              emoji: match[0],
            },
          });
        }
      },
    };
  },
};
