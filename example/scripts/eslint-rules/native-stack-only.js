/**
 * Stacks are native (`@react-navigation/native-stack`): the JS stack animates on the JS thread and renders every screen in the tree.
 */

/** @type {import('eslint').Rule.RuleModule} */
export const nativeStackOnlyRule = {
  create: (context) => ({
    ImportDeclaration: (node) => {
      if (node.source.value === '@react-navigation/stack')
        context.report({ messageId: 'jsStack', node });
    },
  }),
  meta: {
    docs: { description: 'Only the native stack navigator is used', recommended: true },
    messages: {
      jsStack: 'Use @react-navigation/native-stack; the JS stack is not used in this app.',
    },
    schema: [],
    type: 'problem',
  },
};
