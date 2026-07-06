/**
 * ESLint Rule: import-strategy
 *
 * Unified import policy based on Code Sovereignty principle.
 * One rule to define all "border crossing" policies for imports.
 *
 * POLICY:
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │  INSIDE a module (@helpers, @components, etc.)              │
 * │  ─────────────────────────────────────────────────────────  │
 * │  ✅ Use relative imports (max 2 levels): ../logger          │
 * │  ❌ DON'T use your own barrel: @helpers (creates cycle!)    │
 * │  ✅ Can use OTHER barrels: @constants, @utils               │
 * └─────────────────────────────────────────────────────────────┘
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │  OUTSIDE a module                                           │
 * │  ─────────────────────────────────────────────────────────  │
 * │  ✅ Use barrel imports: @helpers                            │
 * │  ❌ DON'T use granular: @helpers/logger                     │
 * │  ❌ DON'T use deep relative (3+ levels): ../../../          │
 * └─────────────────────────────────────────────────────────────┘
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │  ALIAS REDIRECTS (use shorter/correct alias)                │
 * │  ─────────────────────────────────────────────────────────  │
 * │  ❌ @domain/interfaces/* → ✅ @interfaces/*                 │
 * │  ❌ @domain/types/*      → ✅ @types/*                      │
 * │  ❌ @redux/state/*       → ✅ @redux/*                      │
 * └─────────────────────────────────────────────────────────────┘
 *
 * EXAMPLES:
 *
 * // File: src/apps/admin/use-cases/create-user.ts (OUTSIDE @helpers)
 * import { logger } from '@helpers';              // ✅ Use barrel
 * import { logger } from '@helpers/logger';       // ❌ No granular from outside
 * import { x } from '../../../../libs/helpers';   // ❌ Too deep, use @helpers
 *
 * // File: src/libs/shared/helpers/http/request.ts (INSIDE @helpers)
 * import { logger } from '../logger';             // ✅ Relative within module
 * import { logger } from '@helpers';              // ❌ Creates dependency cycle!
 * import { HTTP_STATUS } from '@constants';       // ✅ Other barrel is OK
 *
 * // Alias redirects
 * import { User } from '@domain/interfaces/user'; // ❌ Use @interfaces/user
 * import { User } from '@interfaces/user';        // ✅ Correct alias
 *
 * @reviewed 2026-01-19
 */

/** @type {import('eslint').Rule.RuleModule} */
export const importStrategyRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Unified import strategy: barrels from outside, relatives from inside, no self-barrel imports',
      recommended: true,
    },
    messages: {
      selfBarrelImport:
        'Cannot import from "{{alias}}" while inside the {{alias}} module. Use relative import instead (e.g., "../{{suggestion}}") to avoid dependency cycles.',
      useBarrelNotGranular:
        'Use barrel import "{{alias}}" instead of granular "{{granular}}". Import the barrel and destructure what you need.',
      deepRelativeImport:
        'Relative import "{{path}}" is too deep ({{levels}} levels). Use alias "{{suggestion}}" instead.',
      useCorrectAlias: 'Use "{{correct}}" instead of "{{incorrect}}". Prefer shorter aliases.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          maxRelativeLevels: {
            type: 'integer',
            minimum: 1,
            default: 2,
            description: 'Maximum allowed levels of ../ in relative imports',
          },
          aliases: {
            type: 'object',
            description: 'Map of barrel aliases to their source paths',
            additionalProperties: { type: 'string' },
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create: (context) => {
    const filename = context.filename || context.getFilename();
    const options = context.options[0] || {};
    const maxRelativeLevels = options.maxRelativeLevels ?? 2;

    /**
     * GLOBAL aliases (shared libs) - synced with root tsconfig.json
     * These resolve the same in ALL contexts.
     */
    const globalAliases = {
      // Shared
      '@helpers': 'src/libs/shared/helpers',
      '@thunks': 'src/libs/shared/helpers/thunk',
      '@utils': 'src/libs/shared/utils',
      '@constants': 'src/libs/shared/constants',
      '@testing': 'src/libs/shared/testing',
      '@mocks': 'src/libs/shared/testing/mocks',
      // Presentation
      '@components': 'src/libs/presentation/components',
      '@hooks': 'src/libs/presentation/hooks',
      '@providers': 'src/libs/presentation/providers',
      '@layouts': 'src/libs/presentation/layouts',
      '@styles': 'src/libs/presentation/styles',
      '@assets': 'src/libs/presentation/assets',
      // Infrastructure
      '@services': 'src/libs/infrastructure/services',
      '@repositories': 'src/libs/infrastructure/repositories',
      '@redux': 'src/libs/infrastructure/state',
      '@store': 'src/libs/infrastructure/state/store',
      '@middleware': 'src/libs/infrastructure/middleware',
      '@config': 'src/libs/infrastructure/config',
      '@database': 'src/libs/infrastructure/database',
      '@email': 'src/libs/infrastructure/email',
      // Domain
      '@domain': 'src/libs/domain',
      '@entities': 'src/libs/domain/entities',
      '@interfaces': 'src/libs/domain/interfaces',
      '@domain-types': 'src/libs/domain/types',
      '@validation': 'src/libs/domain/validation',
      // API routes
      '@api': 'src/app/api',
    };

    /**
     * Context-specific aliases (v1.9.0) - defined in root tsconfig.json
     * Pattern: @apps/{context}/{type} → src/apps/{context}/presentation/{type}
     * Example: @apps/admin/components → src/apps/admin/presentation/components
     *          @apps/public/hooks → src/apps/public/presentation/hooks
     */
    const contextAliasPatterns = [
      '@apps/admin/',
      '@apps/public/',
      '@apps/auth/',
      '@apps/shared/',
    ];

    const defaultAliases = { ...globalAliases, ...options.aliases };

    /**
     * Alias redirects: incorrect/long alias → correct/short alias
     * Pattern-based: if import starts with key, suggest replacing with value
     * Synced with tsconfig.json paths
     */
    const aliasRedirects = {
      // Domain long paths → short aliases
      '@domain/interfaces': '@interfaces',
      '@domain/types': '@domain-types',
      '@domain/entities': '@entities',
      '@domain/validation': '@validation',
      // Infrastructure long paths
      '@redux/state': '@redux',
      '@infrastructure/repositories': '@repositories',
      '@infrastructure/services': '@services',
      '@infrastructure/middleware': '@middleware',
      '@infrastructure/config': '@config',
      // Shared long paths
      '@shared/helpers': '@helpers',
      '@shared/utils': '@utils',
      '@shared/constants': '@constants',
      '@shared/testing': '@testing',
      '@testing/mocks': '@mocks',
      '@helpers/thunk': '@thunks',
      // Presentation long paths
      '@presentation/components': '@components',
      '@presentation/hooks': '@hooks',
      '@presentation/layouts': '@layouts',
      '@presentation/providers': '@providers',
      '@presentation/styles': '@styles',
      '@presentation/assets': '@assets',
    };

    // === UTILITY FUNCTIONS ===

    const normalizePath = (p) => p.replace(/\\/g, '/');

    const isFileInsideModule = (filePath, modulePath) => {
      const normalizedFile = normalizePath(filePath);
      const normalizedModule = normalizePath(modulePath);
      return normalizedFile.includes(normalizedModule);
    };

    const countRelativeLevels = (importPath) => {
      const matches = importPath.match(/\.\.\//g);
      return matches ? matches.length : 0;
    };

    /**
     * Check if import is a context-specific @apps/* alias
     */
    const isContextAlias = (importPath) => {
      return contextAliasPatterns.some((pattern) => importPath.startsWith(pattern));
    };

    const findModuleForFile = (filePath) => {
      for (const [alias, sourcePath] of Object.entries(defaultAliases)) {
        if (isFileInsideModule(filePath, sourcePath)) {
          return { alias, sourcePath };
        }
      }
      return null;
    };

    /**
     * Image file extensions that should be imported granularly (not via barrel)
     * These files have default exports and cannot be re-exported without aliases.
     */
    const imageExtensions = ['.webp', '.svg', '.png', '.jpg', '.jpeg', '.gif', '.ico', '.avif'];

    const isImageImport = (importPath) => {
      return imageExtensions.some((ext) => importPath.endsWith(ext));
    };

    const findBarrelForGranular = (importPath) => {
      // Skip context-specific @apps/* aliases (they're explicit, not barrel-based)
      if (isContextAlias(importPath)) {
        return null;
      }

      // Skip image imports (they must be granular due to default exports)
      if (isImageImport(importPath)) {
        return null;
      }

      for (const [alias, sourcePath] of Object.entries(defaultAliases)) {
        if (importPath.startsWith(alias + '/')) {
          return { alias, sourcePath, subpath: importPath.slice(alias.length + 1) };
        }
      }
      return null;
    };

    const findAliasRedirect = (importPath) => {
      for (const [incorrect, correct] of Object.entries(aliasRedirects)) {
        if (importPath.startsWith(incorrect + '/') || importPath === incorrect) {
          const subpath = importPath.slice(incorrect.length);
          return { incorrect, correct, suggested: correct + subpath };
        }
      }
      return null;
    };

    const suggestAliasForPath = (importPath) => {
      // Shared
      if (importPath.includes('/helpers/thunk/')) return '@thunks';
      if (importPath.includes('/helpers/')) return '@helpers';
      if (importPath.includes('/constants/')) return '@constants';
      if (importPath.includes('/utils/')) return '@utils';
      if (importPath.includes('/testing/mocks/')) return '@mocks';
      if (importPath.includes('/testing/')) return '@testing';
      // Presentation
      if (importPath.includes('/components/')) return '@components';
      if (importPath.includes('/hooks/')) return '@hooks';
      if (importPath.includes('/providers/')) return '@providers';
      if (importPath.includes('/layouts/')) return '@layouts';
      if (importPath.includes('/styles/')) return '@styles';
      if (importPath.includes('/assets/')) return '@assets';
      // Infrastructure
      if (importPath.includes('/services/')) return '@services';
      if (importPath.includes('/repositories/')) return '@repositories';
      if (importPath.includes('/state/store/')) return '@store';
      if (importPath.includes('/state/') || importPath.includes('/redux/')) return '@redux';
      if (importPath.includes('/middleware/')) return '@middleware';
      if (importPath.includes('/config/')) return '@config';
      if (importPath.includes('/database/')) return '@database';
      if (importPath.includes('/email/')) return '@email';
      // Domain
      if (importPath.includes('/domain/entities/')) return '@entities';
      if (importPath.includes('/domain/interfaces/')) return '@interfaces';
      if (importPath.includes('/domain/types/')) return '@domain-types';
      if (importPath.includes('/domain/validation/')) return '@validation';
      if (importPath.includes('/domain/')) return '@domain';
      return 'appropriate alias';
    };

    // === SKIP CONDITIONS ===

    const isTestFile = /\.(test|spec)\.(ts|tsx|js|jsx)$/.test(filename);
    const isIndexFile = /\/index\.(ts|tsx|js|jsx)$/.test(filename);
    const isMockFile = /\/mocks\//.test(filename) || /\/__mocks__\//.test(filename);

    if (isTestFile || isIndexFile || isMockFile) {
      return {};
    }

    // === MAIN LOGIC ===

    return {
      ImportDeclaration: (node) => {
        const importPath = node.source.value;
        const currentModule = findModuleForFile(filename);

        // --- RULE 0: Alias redirects (use correct/shorter alias) ---
        const redirect = findAliasRedirect(importPath);
        if (redirect) {
          context.report({
            node: node.source,
            messageId: 'useCorrectAlias',
            data: {
              incorrect: importPath,
              correct: redirect.suggested,
            },
          });
          return;
        }

        // --- RULE 1: No self-barrel imports (prevents cycles) ---
        if (currentModule && importPath === currentModule.alias) {
          // Extract what they're trying to import for suggestion
          const importedNames = node.specifiers
            .filter((s) => s.type === 'ImportSpecifier')
            .map((s) => s.imported?.name || s.local?.name)
            .filter(Boolean);

          const suggestion = importedNames.length > 0 ? importedNames[0] : 'module';

          context.report({
            node: node.source,
            messageId: 'selfBarrelImport',
            data: {
              alias: currentModule.alias,
              suggestion,
            },
          });
          return;
        }

        // --- RULE 2: No granular imports from outside module ---
        const granularInfo = findBarrelForGranular(importPath);
        if (granularInfo) {
          const { alias, sourcePath, subpath } = granularInfo;

          // If inside the module, granular is OK (avoids cycles)
          if (isFileInsideModule(filename, sourcePath)) {
            return;
          }

          // Outside the module - must use barrel
          context.report({
            node: node.source,
            messageId: 'useBarrelNotGranular',
            data: {
              alias,
              granular: importPath,
            },
          });
          return;
        }

        // --- RULE 3: No deep relative imports ---
        if (importPath.startsWith('../')) {
          const levels = countRelativeLevels(importPath);

          if (levels > maxRelativeLevels) {
            context.report({
              node: node.source,
              messageId: 'deepRelativeImport',
              data: {
                path: importPath,
                levels,
                suggestion: suggestAliasForPath(importPath),
              },
            });
          }
        }
      },

      // Also check export declarations
      ExportAllDeclaration: (node) => {
        if (!node.source) return;
        const importPath = node.source.value;

        // Deep relative check for re-exports
        if (importPath.startsWith('../')) {
          const levels = countRelativeLevels(importPath);
          if (levels > maxRelativeLevels) {
            context.report({
              node: node.source,
              messageId: 'deepRelativeImport',
              data: {
                path: importPath,
                levels,
                suggestion: suggestAliasForPath(importPath),
              },
            });
          }
        }
      },

      ExportNamedDeclaration: (node) => {
        if (!node.source) return;
        const importPath = node.source.value;

        // Deep relative check for re-exports
        if (importPath.startsWith('../')) {
          const levels = countRelativeLevels(importPath);
          if (levels > maxRelativeLevels) {
            context.report({
              node: node.source,
              messageId: 'deepRelativeImport',
              data: {
                path: importPath,
                levels,
                suggestion: suggestAliasForPath(importPath),
              },
            });
          }
        }
      },
    };
  },
};
