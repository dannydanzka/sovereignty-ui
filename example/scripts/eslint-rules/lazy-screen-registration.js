/**
 * A screen loads on first visit: a module registers it with `getComponent: () => require('<file>').<Screen>`, so the navigator draws without evaluating every screen behind it (Jafra measurement, 2026-10-19).
 */

const MODULE_ROUTES = /\/src\/apps\/[^/]+\/navigation\/[^/]+\.constants\.ts$/;

const isLazyRequire = (node) =>
  node?.type === 'ArrowFunctionExpression' &&
  node.body.type === 'MemberExpression' &&
  node.body.object.type === 'CallExpression' &&
  node.body.object.callee.type === 'Identifier' &&
  node.body.object.callee.name === 'require' &&
  node.body.object.arguments[0]?.type === 'Literal' &&
  String(node.body.object.arguments[0].value).startsWith('.');

const isScreenElement = (name) =>
  name.type === 'JSXMemberExpression' && name.property.name === 'Screen';

/** @type {import('eslint').Rule.RuleModule} */
export const lazyScreenRegistrationRule = {
  create: (context) => {
    const filename = (context.filename ?? context.getFilename()).replace(/\\/g, '/');
    const inModuleRoutes = MODULE_ROUTES.test(filename);

    return {
      JSXAttribute: (node) => {
        const element = node.parent;
        if (node.name.name !== 'component' || !isScreenElement(element.name)) return;
        const value = node.value?.expression;
        if (value?.type === 'Identifier' && /Screen$/.test(value.name)) {
          context.report({ data: { name: value.name }, messageId: 'eagerScreen', node });
        }
      },
      Property: (node) => {
        if (!inModuleRoutes || node.key.type !== 'Identifier' || node.key.name !== 'getComponent')
          return;
        if (!isLazyRequire(node.value)) context.report({ messageId: 'notLazy', node });
      },
    };
  },
  meta: {
    docs: {
      description: 'Screens are registered lazily through getComponent + require',
      recommended: true,
    },
    messages: {
      eagerScreen:
        '`component={{{name}}}` loads the screen with the navigator. Register it in its module routes with getComponent.',
      notLazy:
        "getComponent must be `() => require('<relative screen file>').<Screen>`: an import at the top loads the screen with the navigator.",
    },
    schema: [],
    type: 'problem',
  },
};
