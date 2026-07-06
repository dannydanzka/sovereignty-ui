/**
 * ESLint Custom Rule: No Redundant Global Mocks
 *
 * Detects vi.mock()/jest.mock() calls for modules already mocked globally in setup files.
 * These redundant mocks shadow the global setup and can cause subtle bugs.
 * Agnostic: works with both Vitest (vi.mock) and Jest (jest.mock).
 *
 * Global mocks (vitest.setup.ts):
 * - @dannydanzka/sovereignty-ui, uuid, bcryptjs
 * - next/navigation, next/server, next/image, next/dynamic
 * - @database, @logger, @prisma/client, @prisma/adapter-pg
 * - @helpers (partial: validateAndGetUser)
 * - @helpers/use-case/authorization, @helpers/use-case/authorization/authorization
 *
 * NOTE: @helpers is a PARTIAL mock (only validateAndGetUser). Tests that need to mock
 * other @helpers exports (e.g., handleRequest) are allowed to re-mock @helpers.
 * Only FULL re-mocks of already-fully-mocked modules are flagged.
 *
 * @see vitest.setup.ts
 */

/**
 * Modules that are FULLY mocked in global setup with no legitimate override need.
 *
 * EXCLUDED from this list:
 * - @database: Repos need custom prisma model mocks (global only mocks storage client)
 * - @helpers: Partial mock (only validateAndGetUser), tests often need handleRequest mocks
 * - bcryptjs: Repos need custom compare/hash behavior per test
 * - next/navigation: Tests frequently override useRouter/usePathname for specific routes
 * - uuid: Some tests need specific UUID return values
 */
const FULLY_MOCKED_MODULES = new Set([
  '@dannydanzka/sovereignty-ui',
  'next/image',
  'next/dynamic',
  '@logger',
  '@prisma/client',
  '@prisma/adapter-pg',
  '@helpers/use-case/authorization',
  '@helpers/use-case/authorization/authorization',
]);

/** @type {import('eslint').Rule.RuleModule} */
export const noRedundantGlobalMocksRule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow vi.mock() for modules already mocked globally in vitest.setup.ts',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      redundantMock:
        'Redundant mock: "{{module}}" is already mocked globally in test setup. Remove this mock call.',
    },
    schema: [],
  },

  create(context) {
    const filename = context.filename || context.getFilename();

    if (!filename.match(/\.(test|spec)\.(ts|tsx|js|jsx)$/)) {
      return {};
    }

    return {
      CallExpression(node) {
        // Agnostic: detect both vi.mock() and jest.mock()
        if (
          node.callee.type === 'MemberExpression' &&
          node.callee.object.type === 'Identifier' &&
          (node.callee.object.name === 'vi' || node.callee.object.name === 'jest') &&
          node.callee.property.type === 'Identifier' &&
          node.callee.property.name === 'mock'
        ) {
          const firstArg = node.arguments[0];
          if (
            firstArg &&
            firstArg.type === 'Literal' &&
            typeof firstArg.value === 'string'
          ) {
            const moduleName = firstArg.value;
            if (FULLY_MOCKED_MODULES.has(moduleName)) {
              context.report({
                node,
                messageId: 'redundantMock',
                data: { module: moduleName },
              });
            }
          }
        }
      },
    };
  },
};
