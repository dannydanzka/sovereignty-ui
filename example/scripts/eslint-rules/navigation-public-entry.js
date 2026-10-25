/**
 * Modules move only through `@app/navigation`: one place owns React Navigation, so a module names a route and never a navigator, and a navigation upgrade touches one folder.
 */

const OWNERS = [/\/src\/app\//, /\/src\/libs\/testing\//];
const PUBLIC_ENTRY = '@app/navigation';

/** @type {import('eslint').Rule.RuleModule} */
export const navigationPublicEntryRule = {
  create: (context) => {
    const filename = (context.filename ?? context.getFilename()).replace(/\\/g, '/');
    const isOwner = OWNERS.some((pattern) => pattern.test(filename));

    return {
      ImportDeclaration: (node) => {
        const source = node.source.value;
        if (!isOwner && source.startsWith('@react-navigation/')) {
          context.report({ data: { source }, messageId: 'library', node });
        }
        if (!isOwner && source.startsWith(`${PUBLIC_ENTRY}/`)) {
          context.report({ data: { source }, messageId: 'deepImport', node });
        }
      },
    };
  },
  meta: {
    docs: {
      description: 'Modules reach navigation only through @app/navigation',
      recommended: true,
    },
    messages: {
      deepImport: '"{{source}}" reaches inside the navigation: import from "@app/navigation".',
      library:
        '"{{source}}" belongs to src/app/navigation. Use useAppNavigation / useRouteParams from "@app/navigation".',
    },
    schema: [],
    type: 'problem',
  },
};
