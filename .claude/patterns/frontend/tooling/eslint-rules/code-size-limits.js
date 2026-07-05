/**
 * ESLint Rule: code-size-limits
 *
 * Unified code size enforcement for maintainable, focused modules.
 * Philosophy: "Small, focused units of code"
 *
 * CONSOLIDATES:
 * - max-lines-per-file (deprecated)
 * - max-lines-per-function (deprecated)
 * - max-jsx-return-lines (deprecated)
 *
 * LIMITS:
 *
 * FILE LIMITS:
 *   - Components (*.tsx): 350 lines
 *   - Logic files (*.ts): 350 lines
 *   - Test files: 350 lines
 *   - Styled files: EXEMPT (declarative)
 *
 * FUNCTION LIMITS:
 *   - Helper functions: 50 lines
 *   - Render functions: 50 lines
 *   - EXEMPT: Components, hooks, use cases, routes, repos, services
 *
 * JSX RETURN LIMITS:
 *   - Component returns: 50 lines
 *   - Split into render functions when exceeded
 *
 * EXEMPTIONS:
 *   - @large-file-justified JSDoc tag
 *   - Repository files (*.repository.ts)
 *   - Mock files (*.mock.ts, /mocks/)
 *   - Styled files (*.styled.ts)
 *
 * @version 1.0.0
 * @reviewed 2026-01-19
 */

/** @type {import('eslint').Rule.RuleModule} */
export const codeSizeLimitsRule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce size limits for files, functions, and JSX returns.',
      category: 'Code Quality',
      recommended: true,
    },
    messages: {
      fileTooLarge: 'File has {{actual}} lines (max {{max}}). Split into focused modules.',
      functionTooLarge: 'Function "{{name}}" has {{actual}} lines (max {{max}}). Extract helpers or split.',
      jsxTooLarge: 'JSX return has {{actual}} lines (max {{max}}). Use render functions pattern.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          maxFileLines: { type: 'integer', minimum: 1, default: 350 },
          maxFunctionLines: { type: 'integer', minimum: 1, default: 50 },
          maxJsxLines: { type: 'integer', minimum: 1, default: 50 },
          skipBlankLines: { type: 'boolean', default: true },
          skipComments: { type: 'boolean', default: true },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const maxFileLines = options.maxFileLines || 350;
    const maxFunctionLines = options.maxFunctionLines || 50;
    const maxJsxLines = options.maxJsxLines || 50;
    const skipBlankLines = options.skipBlankLines !== false;
    const skipComments = options.skipComments !== false;
    const sourceCode = context.getSourceCode();
    const filename = context.getFilename();

    const countLines = (text) => {
      const lines = text.split('\n');
      if (!skipBlankLines && !skipComments) return lines.length;

      return lines.filter((line) => {
        const trimmed = line.trim();
        if (skipBlankLines && trimmed.length === 0) return false;
        if (skipComments) {
          if (trimmed.startsWith('//')) return false;
          if (trimmed.startsWith('/*') || trimmed.startsWith('*') || trimmed.endsWith('*/')) return false;
        }
        return true;
      }).length;
    };

    const shouldSkipFile = () => {
      const fileText = sourceCode.getText();
      if (/@large-file-justified/.test(fileText)) return true;
      if (/\.repository\.ts$/.test(filename)) return true;
      if (/\.mock\.(ts|tsx)$/.test(filename) || /\/mocks\//.test(filename)) return true;
      if (/\.styled\.(ts|tsx)$/.test(filename)) return true;
      return false;
    };

    const shouldSkipFunction = (node, name) => {
      if (/\.styled\.(ts|tsx)$/.test(filename)) return true;

      if (node.parent?.type === 'VariableDeclarator' && node.parent.id && /^[A-Z]/.test(node.parent.id.name)) {
        const body = node.body;
        if (body?.type === 'BlockStatement' && body.body.length >= 1) {
          const lastStmt = body.body[body.body.length - 1];
          if (lastStmt?.type === 'ReturnStatement') return true;
        }
      }

      if (/^(GET|POST|PUT|DELETE|PATCH)$/.test(name)) return true;
      if (/^use[A-Z]/.test(name)) return true;
      if (/^execute[A-Z]/.test(name)) return true;
      if (/^(with[A-Z]|middleware)/.test(name)) return true;
      if (/^(handle[A-Z]|process[A-Z])/.test(name)) return true;
      if (/(Provider|Context)$/.test(name) || /^create[A-Z].*Context/.test(name)) return true;

      if (node.parent?.type === 'Property' && node.parent.parent?.type === 'ObjectExpression' &&
          node.parent.parent.parent?.type === 'VariableDeclarator' &&
          /(Repository|Service)$/.test(node.parent.parent.parent.id?.name)) {
        return true;
      }

      if (node.parent?.type === 'Property' && node.parent.parent?.type === 'ObjectExpression') {
        const grandParent = node.parent.parent.parent;
        if (grandParent?.type === 'Property' && /^(reducers|extraReducers)$/.test(grandParent.key?.name)) return true;
        if (grandParent?.type === 'CallExpression' && grandParent.callee?.name === 'createSlice') return true;
      }

      if (/^(setup|cleanup|mock|stub|spy|create|build|make)/.test(name)) return true;

      if (node.parent?.type === 'CallExpression' && node.parent.callee) {
        const callee = node.parent.callee;
        const calleeName = callee.name || callee.object?.name;
        if (/^(describe|it|test|beforeEach|afterEach|beforeAll|afterAll)$/.test(calleeName)) return true;
        if (callee.type === 'MemberExpression' && /^(describe|it|test)$/.test(callee.object?.name)) return true;
      }

      return false;
    };

    const getFunctionName = (node) => {
      if (node.id?.name) return node.id.name;
      if (node.parent?.type === 'VariableDeclarator' && node.parent.id) return node.parent.id.name;
      if (node.parent?.type === 'Property' && node.parent.key) return node.parent.key.name || node.parent.key.value;
      return 'anonymous';
    };

    const isJSXNode = (node) => {
      if (!node) return false;
      if (node.type === 'JSXElement' || node.type === 'JSXFragment') return true;
      if (node.type === 'ParenthesizedExpression') return isJSXNode(node.expression);
      if (node.type === 'ConditionalExpression') return isJSXNode(node.consequent) || isJSXNode(node.alternate);
      if (node.type === 'LogicalExpression') return isJSXNode(node.left) || isJSXNode(node.right);
      return false;
    };

    const checkFunction = (node) => {
      if (!node.body || node.body.type !== 'BlockStatement') return;
      const name = getFunctionName(node);
      if (shouldSkipFunction(node, name)) return;

      const lineCount = countLines(sourceCode.getText(node.body));
      if (lineCount > maxFunctionLines) {
        context.report({
          node,
          messageId: 'functionTooLarge',
          data: { name, actual: lineCount, max: maxFunctionLines },
        });
      }
    };

    return {
      Program() {
        if (shouldSkipFile()) return;

        const lineCount = countLines(sourceCode.getText());
        if (lineCount > maxFileLines) {
          context.report({
            node: sourceCode.ast,
            messageId: 'fileTooLarge',
            data: { actual: lineCount, max: maxFileLines },
          });
        }
      },

      FunctionDeclaration: checkFunction,
      FunctionExpression: checkFunction,
      ArrowFunctionExpression: checkFunction,

      ReturnStatement(node) {
        if (!isJSXNode(node.argument)) return;
        const lineCount = countLines(sourceCode.getText(node));
        if (lineCount > maxJsxLines) {
          context.report({
            node,
            messageId: 'jsxTooLarge',
            data: { actual: lineCount, max: maxJsxLines },
          });
        }
      },
    };
  },
};
