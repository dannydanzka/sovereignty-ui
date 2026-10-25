/**
 * Layers point inward: a module (src/apps/mod-*) never imports another module, and libs never import the app or a module. What two modules share moves down to libs.
 */

const MODULE_FILE = /\/src\/apps\/(mod-[^/]+)\//;
const LIBS_FILE = /\/src\/libs\//;

/** @type {import('eslint').Rule.RuleModule} */
export const moduleBoundariesRule = {
  create: (context) => {
    const filename = (context.filename ?? context.getFilename()).replace(/\\/g, '/');
    const ownModule = MODULE_FILE.exec(filename)?.[1];
    const inLibs = LIBS_FILE.test(filename);

    return {
      ImportDeclaration: (node) => {
        const source = node.source.value;
        if (inLibs && (source.startsWith('@app/') || source.startsWith('@apps/'))) {
          context.report({ data: { source }, messageId: 'libsUpward', node });
        }
        if (ownModule && source.startsWith('@apps/')) {
          context.report({ data: { source }, messageId: 'crossModule', node });
        }
        if (ownModule && source.startsWith('@app/') && source !== '@app/navigation') {
          context.report({ data: { source }, messageId: 'appInternals', node });
        }
        if (ownModule && source.startsWith('.') && /\/(mod-[^/]+)\//.test(`${source}/`)) {
          const target = /(mod-[^/]+)/.exec(source)?.[1];
          if (target && target !== ownModule) {
            context.report({ data: { source }, messageId: 'crossModule', node });
          }
        }
      },
    };
  },
  meta: {
    docs: {
      description: 'Modules are isolated; libs never depend on the app or a module',
      recommended: true,
    },
    messages: {
      appInternals: '"{{source}}" is app internals: a module only uses "@app/navigation".',
      crossModule:
        '"{{source}}" reaches another module (or its own through an alias). Move the shared piece to src/libs, or use a relative import inside the module.',
      libsUpward: '"{{source}}" points up: src/libs cannot depend on the app or its modules.',
    },
    schema: [],
    type: 'problem',
  },
};
