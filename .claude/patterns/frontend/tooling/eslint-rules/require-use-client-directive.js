/**
 * ESLint Rule: require-use-client-directive
 *
 * PREVENTS SSR ERRORS IN NEXT.JS 15
 *
 * Auto-detects when 'use client' directive is needed but missing.
 * This is the #1 SSR error in Next.js 15 App Router.
 *
 * REQUIRES 'use client' when file contains:
 * 1. React hooks: useState, useEffect, useCallback, useMemo, useRef, etc.
 * 2. styled-components usage
 * 3. createContext calls
 * 4. Browser APIs: window, document, localStorage, etc.
 * 5. Event handlers: onClick, onChange, etc.
 *
 * EXCEPTIONS:
 * - Server Components (no hooks, no client APIs)
 * - API routes
 * - Server Actions
 * - Middleware
 * - Test files
 *
 * @reviewed 2025-10-28
 */

/** @type {import('eslint').Rule.RuleModule} */
export const requireUseClientDirectiveRule = {
  create: (context) => {
    const filename = context.filename || context.getFilename();
    const sourceCode = context.sourceCode || context.getSourceCode();

    // Skip non-component files
    const isComponentFile = /\.(tsx|jsx)$/.test(filename);
    if (!isComponentFile) {
      return {};
    }

    // Skip API routes, middleware, test files
    const isExemptFile =
      /\/api\/.*\/route\.(tsx|jsx)$/.test(filename) ||
      /\/middleware\.(tsx|jsx)$/.test(filename) ||
      /\.(test|spec)\.(tsx|jsx)$/.test(filename) ||
      /\/actions\//.test(filename);

    if (isExemptFile) {
      return {};
    }

    let hasUseClientDirective = false;
    let requiresUseClient = false;
    const violations = [];

    /**
     * React hooks that require 'use client'
     */
    const clientHooks = [
      'useState',
      'useEffect',
      'useCallback',
      'useMemo',
      'useRef',
      'useContext',
      'useReducer',
      'useLayoutEffect',
      'useImperativeHandle',
      'useDebugValue',
      'useDeferredValue',
      'useTransition',
      'useId',
      'useSyncExternalStore',
    ];

    /**
     * Browser APIs that require 'use client'
     */
    const browserAPIs = ['window', 'document', 'localStorage', 'sessionStorage', 'navigator'];

    return {
      Program: (node) => {
        // Check for 'use client' directive
        const firstStatement = node.body[0];
        if (
          firstStatement &&
          firstStatement.type === 'ExpressionStatement' &&
          firstStatement.expression.type === 'Literal' &&
          firstStatement.expression.value === 'use client'
        ) {
          hasUseClientDirective = true;
        }
      },

      // Check for React hooks usage
      CallExpression: (node) => {
        if (node.callee.type === 'Identifier') {
          const calleeName = node.callee.name;

          // React hooks
          if (clientHooks.includes(calleeName)) {
            requiresUseClient = true;
            violations.push({
              message: `React hook '${calleeName}' requires 'use client' directive.`,
              node,
              reason: `hook: ${calleeName}`,
            });
          }

          // styled-components
          if (calleeName === 'styled' || calleeName.startsWith('styled')) {
            requiresUseClient = true;
            violations.push({
              message: "styled-components require 'use client' directive.",
              node,
              reason: 'styled-components',
            });
          }

          // createContext
          if (calleeName === 'createContext') {
            requiresUseClient = true;
            violations.push({
              message: "createContext requires 'use client' directive.",
              node,
              reason: 'createContext',
            });
          }
        }
      },

      // Check for browser API usage
      MemberExpression: (node) => {
        if (node.object.type === 'Identifier') {
          const objectName = node.object.name;

          if (browserAPIs.includes(objectName)) {
            requiresUseClient = true;
            violations.push({
              message: `Browser API '${objectName}' requires 'use client' directive.`,
              node,
              reason: `browser API: ${objectName}`,
            });
          }
        }
      },

      // Check for event handlers in JSX
      JSXAttribute: (node) => {
        if (node.name && node.name.type === 'JSXIdentifier') {
          const attrName = node.name.name;

          // Event handlers
          if (attrName.startsWith('on') && attrName.length > 2) {
            requiresUseClient = true;
            violations.push({
              message: `JSX event handler '${attrName}' requires 'use client' directive.`,
              node,
              reason: `event handler: ${attrName}`,
            });
          }
        }
      },

      'Program:exit': () => {
        if (requiresUseClient && !hasUseClientDirective) {
          // Report only once at the top of the file
          const firstViolation = violations[0];
          if (firstViolation) {
            const allReasons = [...new Set(violations.map((v) => v.reason))].join(', ');

            context.report({
              message: `Missing 'use client' directive. This file uses client-side features: ${allReasons}. Add 'use client' at the top of the file to prevent SSR errors.`,
              node: firstViolation.node,
            });
          }
        }
      },
    };
  },
  meta: {
    docs: {
      description:
        "Auto-detect when 'use client' directive is needed in Next.js 15 App Router components",
      recommended: true,
    },
    fixable: 'code',
    messages: {
      missingUseClient:
        "Missing 'use client' directive. This file uses client-side features: {{reasons}}. Add 'use client' at the top of the file to prevent SSR errors.",
    },
    schema: [],
    type: 'problem',
  },
};
