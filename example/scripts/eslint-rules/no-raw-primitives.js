/**
 * Screens and components render styled or sovereignty-ui components, never a bare React Native primitive: the mobile twin of no-native-html, so every visual value goes through the tokens.
 */

const PRIMITIVES = new Set(['Image', 'Pressable', 'Text', 'TextInput', 'TouchableOpacity', 'View']);

/** @type {import('eslint').Rule.RuleModule} */
export const noRawPrimitivesRule = {
  create: (context) => {
    const rawNames = new Set();

    return {
      ImportDeclaration: (node) => {
        if (node.source.value !== 'react-native') return;
        node.specifiers.forEach((spec) => {
          if (spec.type === 'ImportSpecifier' && PRIMITIVES.has(spec.imported.name)) {
            rawNames.add(spec.local.name);
          }
        });
      },
      JSXOpeningElement: (node) => {
        if (node.name.type === 'JSXIdentifier' && rawNames.has(node.name.name)) {
          context.report({ data: { name: node.name.name }, messageId: 'rawPrimitive', node });
        }
      },
    };
  },
  meta: {
    docs: { description: 'No bare React Native primitives in JSX', recommended: true },
    messages: {
      rawPrimitive:
        '<{{name}}> is a bare primitive. Use a sovereignty-ui component, or a styled one in the .styled.ts file.',
    },
    schema: [],
    type: 'problem',
  },
};
