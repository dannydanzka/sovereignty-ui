/**
 * ESLint Rule: no-redux-in-components
 *
 * Enforces that useSelector and useDispatch are ONLY used in custom hooks or providers.
 * Components should use custom hooks (useXxx) as orchestrators.
 *
 * ARCHITECTURE:
 * ```
 * Provider (.tsx in /providers/)  ← useSelector, useDispatch allowed HERE (infrastructure layer)
 *     ↓ provides context
 * Component (.tsx)
 *     ↓ calls
 * Custom Hook (useXxx.ts)  ← useSelector, useDispatch allowed HERE
 *     ↓ dispatches
 * Redux (actions/thunks)
 * ```
 *
 * FORBIDDEN in presentation components:
 * - useSelector() → create a custom hook with selectors
 * - useDispatch() → create a custom hook as orchestrator
 * - useAppSelector() → typed version, same restriction
 * - useAppDispatch() → typed version, same restriction
 * - Direct selector imports in components
 *
 * ALLOWED:
 * - useSelector/useDispatch in files: use*.ts, use*.tsx
 * - useSelector/useDispatch in /hooks/ directory
 * - useSelector/useDispatch in /providers/ directory (infrastructure layer)
 * - Test files
 *
 * Examples:
 *
 * ❌ BAD (in Component.tsx):
 * ```typescript
 * const MyComponent = () => {
 *   const dispatch = useAppDispatch();
 *   const user = useAppSelector(selectUser);
 *   // ...
 * };
 * ```
 *
 * ✅ GOOD (in useUser.ts):
 * ```typescript
 * export const useUser = () => {
 *   const dispatch = useAppDispatch();
 *   const user = useAppSelector(selectUser);
 *   const updateUser = useCallback((data) => {
 *     dispatch(updateUserThunk(data));
 *   }, [dispatch]);
 *   return { user, updateUser };
 * };
 * ```
 *
 * ✅ GOOD (in Component.tsx):
 * ```typescript
 * const MyComponent = () => {
 *   const { user, updateUser } = useUser(); // Custom hook
 *   // ...
 * };
 * ```
 *
 * @reviewed 2026-01-19
 */

/** @type {import('eslint').Rule.RuleModule} */
export const noReduxInComponentsRule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow useSelector and useDispatch in components. Use custom hooks instead.',
      recommended: true,
    },
    messages: {
      noUseSelectorInComponent:
        'useSelector is not allowed in components. Create a custom hook (use{{suggested}}.ts) to encapsulate Redux state access.',
      noUseDispatchInComponent:
        'useDispatch is not allowed in components. Create a custom hook (use{{suggested}}.ts) as orchestrator for actions.',
      noSelectorImportInComponent:
        'Selector "{{name}}" should not be imported in components. Import it in a custom hook instead.',
    },
    schema: [],
  },

  create: (context) => {
    const filename = context.filename || context.getFilename();

    /**
     * Check if file is allowed to use Redux directly
     * Pattern: use*.ts, use*.tsx, /hooks/ directory, or /providers/ directory
     *
     * Providers are infrastructure layer - they connect Redux to the component tree
     * and provide Context. They are NOT presentation components.
     */
    const isAllowedReduxFile = () => {
      // Files named use*.ts or use*.tsx (custom hooks)
      if (/\/use[A-Z][^/]*\.(ts|tsx)$/.test(filename)) {
        return true;
      }

      // Files in /hooks/ directory
      if (filename.includes('/hooks/')) {
        return true;
      }

      // Files in /providers/ directory (infrastructure layer)
      // Providers connect Redux to component tree - they ARE the orchestration layer
      if (filename.includes('/providers/')) {
        return true;
      }

      return false;
    };

    /**
     * Check if file is a test file
     */
    const isTestFile = () => {
      return (
        /\.(test|spec)\.(ts|tsx|js|jsx)$/.test(filename) ||
        filename.includes('__tests__') ||
        filename.includes('__mocks__')
      );
    };

    /**
     * Check if file is a component file
     */
    const isComponentFile = () => {
      // Must be .tsx file
      if (!filename.endsWith('.tsx')) {
        return false;
      }

      // Exclude allowed Redux files (hooks, providers)
      if (isAllowedReduxFile()) {
        return false;
      }

      // Exclude test files
      if (isTestFile()) {
        return false;
      }

      // Exclude styled files
      if (filename.includes('.styled.')) {
        return false;
      }

      // Exclude story files
      if (filename.includes('.stories.')) {
        return false;
      }

      // Exclude interface files
      if (filename.includes('.interfaces.')) {
        return false;
      }

      return true;
    };

    // Only apply rule to component files
    if (!isComponentFile()) {
      return {};
    }

    /**
     * Suggest a hook name based on filename
     */
    const suggestHookName = () => {
      // Extract component name from filename
      const match = filename.match(/\/([A-Z][^/]+)\.(tsx|ts)$/);
      if (match) {
        return match[1]; // e.g., "UserProfile" → useUserProfile
      }

      // Try to extract from path
      const pathMatch = filename.match(/\/([a-z-]+)\/[^/]+\.tsx$/i);
      if (pathMatch) {
        // Convert kebab-case to PascalCase
        const name = pathMatch[1]
          .split('-')
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join('');
        return name;
      }

      return 'Custom';
    };

    // Track imported selectors
    const importedSelectors = new Set();

    return {
      // Track selector imports
      ImportDeclaration: (node) => {
        const importPath = node.source.value;

        // Check if importing from selectors
        if (
          importPath.includes('/selectors') ||
          importPath.includes('.selectors') ||
          importPath.includes('/slice') // Common pattern: selectors in slice files
        ) {
          node.specifiers.forEach((specifier) => {
            if (specifier.type === 'ImportSpecifier') {
              const name = specifier.imported?.name || specifier.local?.name;
              if (name && name.startsWith('select')) {
                importedSelectors.add(name);
                context.report({
                  node: specifier,
                  messageId: 'noSelectorImportInComponent',
                  data: { name },
                });
              }
            }
          });
        }
      },

      // Check for useSelector/useDispatch calls
      CallExpression: (node) => {
        if (node.callee.type !== 'Identifier') {
          return;
        }

        const calleeName = node.callee.name;
        const suggested = suggestHookName();

        // Check for useSelector
        if (calleeName === 'useSelector') {
          context.report({
            node,
            messageId: 'noUseSelectorInComponent',
            data: { suggested },
          });
          return;
        }

        // Check for useDispatch
        if (calleeName === 'useDispatch') {
          context.report({
            node,
            messageId: 'noUseDispatchInComponent',
            data: { suggested },
          });
          return;
        }

        // Check for useAppSelector (typed version)
        if (calleeName === 'useAppSelector') {
          context.report({
            node,
            messageId: 'noUseSelectorInComponent',
            data: { suggested },
          });
          return;
        }

        // Check for useAppDispatch (typed version)
        if (calleeName === 'useAppDispatch') {
          context.report({
            node,
            messageId: 'noUseDispatchInComponent',
            data: { suggested },
          });
          return;
        }
      },
    };
  },
};
