/**
 * ESLint Rule: architecture-boundaries
 *
 * Unified Code Sovereignty enforcement for Clean Architecture.
 * Philosophy: "Each layer has sovereignty over its domain"
 *
 * CONSOLIDATES:
 * - no-cross-context-imports (deprecated)
 * - no-cross-layer-imports (deprecated)
 * - no-domain-framework-deps (deprecated)
 *
 * THREE SOVEREIGNTY PRINCIPLES:
 *
 * 1. CONTEXT ISOLATION (admin ↔ public ↔ auth):
 *    - Contexts CANNOT import from each other
 *    - Shared code MUST be in libs/
 *
 * 2. LAYER HIERARCHY (domain → application → infrastructure → presentation):
 *    - Inner layers CANNOT import outer layers
 *    - Domain is pure (NO framework dependencies)
 *
 * 3. DOMAIN PURITY:
 *    - NO React, Next.js, Prisma, Redux in domain
 *    - Allowed: Pure TypeScript, types, zod (in /validation/)
 *
 * @version 1.0.0
 * @reviewed 2026-01-19
 */

/** Framework dependencies forbidden in domain layer */
const FORBIDDEN_DOMAIN_DEPS = [
  { pattern: /^react$/, category: 'React' },
  { pattern: /^react-dom/, category: 'React' },
  { pattern: /^react-/, category: 'React' },
  { pattern: /^next$/, category: 'Next.js' },
  { pattern: /^next\//, category: 'Next.js' },
  { pattern: /^@next\//, category: 'Next.js' },
  { pattern: /^@prisma\//, category: 'ORM' },
  { pattern: /^prisma$/, category: 'ORM' },
  { pattern: /^pg$/, category: 'Database' },
  { pattern: /^zod$/, category: 'Validation', allowInValidation: true },
  { pattern: /^yup$/, category: 'Validation', allowInValidation: true },
  { pattern: /^@reduxjs\/toolkit/, category: 'State Management' },
  { pattern: /^redux/, category: 'State Management' },
  { pattern: /^styled-components$/, category: 'Styling' },
  { pattern: /^@emotion\//, category: 'Styling' },
  { pattern: /^@supabase\//, category: 'Infrastructure' },
  { pattern: /^stripe$/, category: 'Payment' },
  { pattern: /^bcryptjs$/, category: 'Crypto' },
  { pattern: /^jose$/, category: 'JWT' },
  { pattern: /^sharp$/, category: 'Image Processing' },
  { pattern: /^lucide-react$/, category: 'UI Icons' },
  { pattern: /^@testing-library\//, category: 'Testing' },
  { pattern: /^vitest$/, category: 'Testing' },
];

/** @type {import('eslint').Rule.RuleModule} */
export const architectureBoundariesRule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce Code Sovereignty: context isolation, layer hierarchy, and domain purity.',
      category: 'Clean Architecture',
      recommended: true,
    },
    messages: {
      crossContext: 'Cross-context import forbidden ({{from}} ↔ {{to}}). Move shared code to libs/.',
      crossLayer: '{{currentLayer}} cannot import {{importLayer}}. Inner layers cannot know about outer layers.',
      domainFramework: "Domain layer cannot import '{{source}}' ({{category}}). Domain must be pure.",
      directPath: 'Direct path imports forbidden. Use aliases: {{suggestion}}',
    },
    schema: [],
  },

  create(context) {
    const filename = context.filename || context.getFilename();

    const isTestFile = /\.(test|spec)\.(ts|tsx)$/.test(filename) || filename.includes('__tests__');
    if (isTestFile) return {};

    /**
     * Dynamically detect current context from file path.
     * AGNOSTIC: Works with any context under /apps/ (admin, public, auth, organizer, etc.)
     */
    const getCurrentContext = () => {
      const appsMatch = filename.match(/\/apps\/([^/]+)\//);
      if (appsMatch) return appsMatch[1];
      if (filename.includes('/libs/')) return 'libs';
      return null;
    };

    const getCurrentLayer = () => {
      if (filename.includes('/use-cases/') || filename.endsWith('.use-case.ts')) return 'application';
      if (filename.includes('/entities/') || filename.endsWith('.entity.ts')) return 'domain';
      if (filename.includes('/infrastructure/') || filename.includes('/repositories/') ||
          filename.includes('/services/') || filename.includes('/redux/') || filename.includes('/slices/')) {
        return 'infrastructure';
      }
      if (filename.includes('/presentation/') || filename.includes('/components/') ||
          filename.includes('/screens/') || filename.includes('/pages/')) {
        return 'presentation';
      }
      return null;
    };

    const isDomainFile = () => {
      if (filename.includes('/presentation/')) return false;
      return /\/libs\/domain\//.test(filename) || /\/apps\/\w+\/domain\//.test(filename);
    };

    const isValidationFile = /\/domain\/validation\//.test(filename);
    const currentContext = getCurrentContext();
    const currentLayer = getCurrentLayer();

    /**
     * AGNOSTIC context violation detection.
     * Detects imports from any other app context dynamically.
     * Pattern: /apps/{otherContext}/ or @apps/{otherContext}
     *
     * RULES:
     * - apps/{context} CANNOT import from apps/{otherContext} (cross-context)
     * - libs/ CANNOT import from apps/* (dependency inversion: apps → libs, never libs → apps)
     * - src/app/ (null context) CAN import from apps/* (App Router delegation)
     * - shared context is always allowed as import target
     */
    const checkContextViolation = (importPath) => {
      if (!currentContext || currentContext === 'shared') {
        return null;
      }

      /** libs CANNOT import from apps — dependency flows apps → libs */
      if (currentContext === 'libs') {
        const pathMatch = importPath.match(/\/apps\/([^/]+)\//);
        const aliasMatch = importPath.match(/^@apps\/([^/]+)/);
        const targetContext = pathMatch?.[1] || aliasMatch?.[1];
        if (targetContext) {
          return { from: 'libs', to: targetContext };
        }
        return null;
      }

      /** Detect direct path imports to other contexts: /apps/{context}/ */
      const pathMatch = importPath.match(/\/apps\/([^/]+)\//);
      if (pathMatch) {
        const targetContext = pathMatch[1];
        if (targetContext !== currentContext && targetContext !== 'shared') {
          return { from: currentContext, to: targetContext };
        }
      }

      /** Detect @apps/{context} alias imports */
      const aliasMatch = importPath.match(/^@apps\/([^/]+)/);
      if (aliasMatch) {
        const targetContext = aliasMatch[1];
        if (targetContext !== currentContext && targetContext !== 'shared') {
          return { from: currentContext, to: targetContext };
        }
      }

      return null;
    };

    const getImportLayer = (source) => {
      if (source.includes('/constants') || source.endsWith('/constants')) return 'shared';
      if (source.includes('/presentation/') || source.includes('/components/') ||
          source.includes('/screens/') || source.startsWith('@components') ||
          source.match(/^@apps\/[^/]+\/(components|screens|hooks|layouts)/)) {
        return 'presentation';
      }
      if (source.includes('/infrastructure/') || source.includes('/repositories/') ||
          source.includes('/services/') || source.includes('/redux/') || source.includes('/slices/') ||
          source.startsWith('@repositories') || source.startsWith('@services') || source.startsWith('@redux')) {
        return 'infrastructure';
      }
      if (source.includes('/use-cases/') || source.endsWith('.use-case')) return 'application';
      if (source.includes('/domain/') || source.includes('/entities/') ||
          source.startsWith('@entities') || source.startsWith('@domain-types')) {
        return 'domain';
      }
      if (source.startsWith('@helpers') || source.startsWith('@utils') ||
          source.startsWith('@shared') || source.startsWith('@testing') || source.startsWith('@mocks')) {
        return 'shared';
      }
      if (!source.startsWith('.') && !source.startsWith('@')) return 'external';
      return null;
    };

    const isLayerViolation = (importLayer) => {
      if (importLayer === 'shared' || importLayer === null) return false;
      if (currentLayer === 'application' && importLayer === 'infrastructure') return false;
      const layerOrder = { domain: 0, application: 1, infrastructure: 2, presentation: 3 };
      const currentOrder = layerOrder[currentLayer];
      const importOrder = layerOrder[importLayer];
      if (currentOrder === undefined || importOrder === undefined) return false;
      return importOrder > currentOrder;
    };

    const checkDomainDep = (source) => {
      for (const dep of FORBIDDEN_DOMAIN_DEPS) {
        if (dep.pattern.test(source)) {
          if (isValidationFile && dep.allowInValidation) return null;
          return dep.category;
        }
      }
      return null;
    };

    return {
      ImportDeclaration(node) {
        const source = node.source.value;

        const isTypeOnly = node.importKind === 'type' ||
          (node.specifiers.length > 0 && node.specifiers.every(
            (spec) => spec.type === 'ImportSpecifier' && spec.importKind === 'type'
          ));

        if (currentContext) {
          const contextViolation = checkContextViolation(source);
          if (contextViolation) {
            context.report({
              node,
              messageId: 'crossContext',
              data: contextViolation,
            });
            return;
          }
        }

        if (currentLayer && !isTypeOnly) {
          const importLayer = getImportLayer(source);
          if (isLayerViolation(importLayer)) {
            context.report({
              node,
              messageId: 'crossLayer',
              data: { currentLayer, importLayer },
            });
            return;
          }
        }

        if (isDomainFile() && !isTypeOnly) {
          if (source.startsWith('.') || source.startsWith('..')) return;
          if (source.startsWith('@helpers') || source.startsWith('@utils') ||
              source.startsWith('@constants') || source.startsWith('@domain')) return;

          const category = checkDomainDep(source);
          if (category) {
            context.report({
              node,
              messageId: 'domainFramework',
              data: { source, category },
            });
          }
        }

        if (source.startsWith('src/apps/') || source.includes('/src/apps/')) {
          context.report({
            node,
            messageId: 'directPath',
            data: { suggestion: '@apps/admin/*, @apps/public/*, @apps/auth/*' },
          });
        }

        if (source.startsWith('src/libs/') || source.includes('/src/libs/')) {
          context.report({
            node,
            messageId: 'directPath',
            data: { suggestion: '@components/*, @helpers/*, @repositories/*, @entities/*' },
          });
        }

        const deepRelativePattern = /\.\.\/(\.\.\/){2,}/;
        if (deepRelativePattern.test(source)) {
          context.report({
            node,
            messageId: 'directPath',
            data: { suggestion: 'Use aliases instead of deep relative imports (3+ levels)' },
          });
        }
      },
    };
  },
};
