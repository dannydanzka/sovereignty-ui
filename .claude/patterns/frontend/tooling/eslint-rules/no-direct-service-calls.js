/**
 * ESLint Rule: no-direct-service-calls
 *
 * CODE SOVEREIGNTY PRINCIPLE: Trade Agreements
 *
 * Data must flow through defined protocols. In React components:
 * - NO direct fetch/axios calls
 * - NO direct service calls
 * - Data flows through: Component → Redux Hook → Thunk → Service → API
 *
 * This ensures:
 * - Centralized error handling
 * - Consistent loading states
 * - Cacheable data
 * - Testable components
 *
 * DETECTED PATTERNS:
 * ❌ fetch('/api/...')
 * ❌ axios.get('/api/...')
 * ❌ AdminUserService.getAll()
 * ❌ Any *Service.* call in components
 * ❌ handleRequest() in components
 *
 * ALLOWED:
 * ✅ useUsers() - Redux hook
 * ✅ dispatch(fetchUsers()) - Redux thunk
 * ✅ Service calls in /services/ files
 * ✅ Service calls in Redux thunks (slices)
 *
 * AGNOSTIC DESIGN:
 * This rule is project-agnostic. Infrastructure directories (services, slices, etc.)
 * and bridge layer hooks are detected by convention. Project-specific exceptions
 * (screens, modals, providers that legitimately need direct calls) are configured
 * via the `allowedPathPatterns` option in eslint.config.js.
 *
 * @context7 Code Sovereignty - Trade Agreements
 */

/** @type {import('eslint').Rule.RuleModule} */
export const noDirectServiceCallsRule = {
  meta: {
    type: 'problem',
    docs: {
      category: 'Best Practices',
      description:
        'Disallow direct service calls and fetch/axios in React components. Data should flow through Redux hooks and thunks.',
      recommended: true,
    },
    messages: {
      directServiceCall:
        'Direct service call in component is not allowed. Use Redux hooks or thunks.',
      directHttpCall:
        'Direct fetch/axios call in component is not allowed. Use Redux hooks or thunks.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          allowedPathPatterns: {
            type: 'array',
            items: { type: 'string' },
            description:
              'File path substrings where direct service/HTTP calls are allowed. ' +
              'Each entry is matched against the full file path using String.includes(). ' +
              'Use this for project-specific exceptions (auth providers, payment screens, etc.).',
          },
          httpCallNames: {
            type: 'array',
            items: { type: 'string' },
            description:
              'Additional function names to detect as direct HTTP calls (beyond fetch/axios). ' +
              'Example: ["handleRequest", "apiCall"]. Default: ["handleRequest"].',
          },
          serviceSuffix: {
            type: 'string',
            description:
              'Suffix pattern for service class detection. Default: "Service" (matches *Service.method()).',
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create: (context) => {
    const filename = context.filename || context.getFilename();
    const options = context.options[0] || {};

    /** Project-specific exceptions configured in eslint.config.js */
    const allowedPathPatterns = options.allowedPathPatterns || [];

    /** Additional HTTP call function names to detect (project-configurable) */
    const httpCallNames = options.httpCallNames || ['handleRequest'];

    /** Service class suffix pattern (project-configurable) */
    const serviceSuffix = options.serviceSuffix || 'Service';
    const serviceSuffixRegex = new RegExp(`${serviceSuffix}$`);

    // ─── AGNOSTIC INFRASTRUCTURE EXCLUSIONS ───
    // These are universal conventions that apply to any Clean Architecture project.
    const isInfrastructureFile =
      // Service layer files
      filename.includes('/services/') ||
      // State management (Redux, MobX, Zustand, etc.)
      filename.includes('/slices/') ||
      filename.includes('/redux/') ||
      filename.includes('/store/') ||
      // Backend use cases
      filename.includes('/use-cases/') ||
      // API routes (Next.js, Express, etc.)
      filename.includes('/api/') ||
      filename.includes('/app/api/');

    // ─── AGNOSTIC TEST/CONFIG EXCLUSIONS ───
    const isTestOrConfigFile =
      filename.endsWith('.test.ts') ||
      filename.endsWith('.test.tsx') ||
      filename.endsWith('.spec.ts') ||
      filename.endsWith('.spec.tsx') ||
      filename.includes('__tests__') ||
      filename.endsWith('.config.ts') ||
      filename.endsWith('.config.js');

    // ─── AGNOSTIC BRIDGE LAYER DETECTION ───
    // Presentation hooks (.ts, not .tsx) are the bridge layer between
    // components and data. They encapsulate service/HTTP calls — that's
    // their purpose. Only .tsx component files should be flagged.
    // Detection: .ts files in /hooks/ dir OR with use* prefix pattern.
    const isBridgeLayerHook =
      filename.endsWith('.ts') &&
      !filename.endsWith('.tsx') &&
      (filename.includes('/hooks/') || /\/use[A-Z][^/]*\.ts$/.test(filename));

    // ─── PROJECT-SPECIFIC EXCEPTIONS (from eslint.config.js) ───
    const isProjectException = allowedPathPatterns.some((pattern) =>
      filename.includes(pattern)
    );

    if (isInfrastructureFile || isTestOrConfigFile || isBridgeLayerHook || isProjectException) {
      return {};
    }

    // Only check component files and screen files
    const isComponentFile =
      filename.includes('/components/') ||
      filename.includes('/screens/') ||
      filename.includes('/pages/') ||
      filename.endsWith('.tsx');

    if (!isComponentFile) {
      return {};
    }

    /**
     * Check if a call expression is a direct service call.
     * Detects: *Service.method() pattern (suffix configurable).
     */
    function isServiceCall(node) {
      if (
        node.callee.type === 'MemberExpression' &&
        node.callee.object.type === 'Identifier'
      ) {
        const objectName = node.callee.object.name;
        if (serviceSuffixRegex.test(objectName)) {
          return { name: objectName, type: 'service' };
        }
      }
      return null;
    }

    /**
     * Check if a call expression is a direct HTTP call.
     * Detects: fetch(), axios.*, and any configured httpCallNames.
     */
    function isDirectHttpCall(node) {
      if (node.callee.type === 'Identifier') {
        const name = node.callee.name;
        if (name === 'fetch') return { name: 'fetch', type: 'fetch' };
        if (httpCallNames.includes(name)) return { name, type: 'httpCall' };
      }

      if (
        node.callee.type === 'MemberExpression' &&
        node.callee.object.type === 'Identifier' &&
        node.callee.object.name === 'axios'
      ) {
        return { name: 'axios', type: 'axios' };
      }

      return null;
    }

    return {
      CallExpression: (node) => {
        const serviceCall = isServiceCall(node);
        if (serviceCall) {
          context.report({
            data: {
              name: serviceCall.name,
            },
            message:
              'Direct service call "{{name}}" in component is not allowed. Use Redux hooks (useUsers, useEvents) or dispatch thunks instead. Data should flow: Component → Redux Hook → Thunk → Service.',
            node,
          });
          return;
        }

        const httpCall = isDirectHttpCall(node);
        if (httpCall) {
          context.report({
            data: {
              name: httpCall.name,
            },
            message:
              'Direct "{{name}}" call in component is not allowed. Use Redux hooks or dispatch thunks instead. This ensures centralized error handling and loading states.',
            node,
          });
        }
      },
    };
  },
};
