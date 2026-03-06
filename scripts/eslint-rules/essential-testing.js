/**
 * ESLint Custom Rule: Essential Testing Enforcement
 *
 * Prevents verbose testing patterns and enforces essential testing philosophy.
 * Detects redundant test cases, artificial edge cases, and anti-patterns.
 *
 * Features:
 * - Verbose pattern detection (Spanish/English)
 * - Redundant describe block detection
 * - Constants testing detection
 * - Nesting depth limits
 * - .only/.skip detection (CI blockers)
 * - Empty test detection
 * - Tests without assertions detection
 * - Excessive snapshots detection
 * - Configurable options
 *
 * @see ~/.claude/patterns/eslint-custom-rules-patterns.md (essential-testing section)
 * @see ~/.claude/patterns/testing-essential-philosophy.md
 * @see ~/.claude/standards/TESTING-STANDARDS.md
 * @reviewed 2026-01-19
 */

const VERBOSE_PATTERNS = [
  /durante\s+la\s+carga|while\s+loading/i,
  /cuando\s+hay\s+error|when\s+error/i,
  /con\s+propiedades\s+faltantes|with\s+missing\s+properties/i,
  /undefined\s+correctamente|undefined\s+correctly/i,
  /case\s+sensitivity|sensibilidad\s+de\s+mayúsculas/i,
  /estados\s+inconsistentes|inconsistent\s+states/i,
  /role\s+undefined|role\s+no\s+definido/i,
  /propiedades\s+adicionales|additional\s+properties/i,
  /should\s+handle\s+null/i,
  /should\s+handle\s+undefined/i,
  /debe\s+manejar\s+null/i,
  /debe\s+manejar\s+undefined/i,
];

const REDUNDANT_DESCRIBES = [
  /^edge\s+cases$/i,
  /^casos\s+límite$/i,
  /^error\s+scenarios$/i,
  /^escenarios\s+de\s+error$/i,
  /^boundary\s+conditions$/i,
  /^constants$/i,
  /^constantes$/i,
  /^negative\s+cases$/i,
  /^casos\s+negativos$/i,
  /^validation$/i,
  /^validación$/i,
];

const ASSERTION_METHODS = new Set([
  'expect',
  'assert',
  'should',
  'toHaveBeenCalled',
  'toHaveBeenCalledWith',
  'toHaveBeenCalledTimes',
  'toBe',
  'toEqual',
  'toMatchSnapshot',
  'toMatchInlineSnapshot',
  'toThrow',
  'rejects',
  'resolves',
]);

const SNAPSHOT_METHODS = new Set([
  'toMatchSnapshot',
  'toMatchInlineSnapshot',
]);

const DEFAULT_OPTIONS = {
  maxDescribeDepth: 3,
  maxSnapshotsPerFile: 5,
  maxTestsPerDescribe: 10,
  maxTestsPerFile: 30,
};

/**
 * Check if a node contains any assertion calls
 */
function hasAssertions(node, sourceCode) {
  const text = sourceCode.getText(node);
  return ASSERTION_METHODS.has('expect') && text.includes('expect(');
}

/**
 * Check if a function body is empty or only has comments
 */
function isEmptyBody(node) {
  if (!node.body) return true;

  if (node.body.type === 'BlockStatement') {
    const statements = node.body.body.filter(
      (s) => s.type !== 'EmptyStatement'
    );
    return statements.length === 0;
  }

  return false;
}

/**
 * Count snapshot assertions in text
 */
function countSnapshots(text) {
  const snapshotRegex = /toMatchSnapshot|toMatchInlineSnapshot/g;
  const matches = text.match(snapshotRegex);
  return matches ? matches.length : 0;
}

/** @type {import('eslint').Rule.RuleModule} */
export const essentialTestingRule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce essential testing patterns and prevent verbose testing',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      verboseTest:
        'Verbose test detected: "{{description}}". Focus on essential behavior, not edge cases.',
      redundantDescribe:
        'Redundant describe block: "{{description}}". Group by feature, not by test type.',
      deepNesting:
        'Nesting too deep ({{depth}} levels, max {{max}}). Flatten test structure.',
      constantsTest:
        'Constants test detected. Testing constant values provides no value - test behavior instead.',
      onlyDetected:
        '.only() detected - this will skip other tests. Remove before committing.',
      skipDetected:
        '.skip() detected - this test is disabled. Remove or fix the test.',
      emptyTest:
        'Empty test detected. Add assertions or remove the test.',
      noAssertions:
        'Test has no assertions. Every test must verify something with expect().',
      tooManyTests:
        'Too many tests in describe block ({{count}}, max {{max}}). Split into smaller groups.',
      tooManyTestsInFile:
        'Too many tests in file ({{count}}, max {{max}}). Split into multiple test files.',
      tooManySnapshots:
        'Too many snapshots in file ({{count}}, max {{max}}). Prefer explicit assertions.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          maxDescribeDepth: {
            type: 'number',
            description: 'Maximum nesting depth for describe blocks',
          },
          maxTestsPerDescribe: {
            type: 'number',
            description: 'Maximum tests allowed in a single describe block',
          },
          maxTestsPerFile: {
            type: 'number',
            description: 'Maximum tests allowed in a single file',
          },
          maxSnapshotsPerFile: {
            type: 'number',
            description: 'Maximum snapshot assertions per file',
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = { ...DEFAULT_OPTIONS, ...context.options[0] };
    const sourceCode = context.sourceCode || context.getSourceCode();
    const filename = context.filename || context.getFilename();

    // Only apply to test files
    if (!filename.match(/\.(test|spec)\.(ts|tsx|js|jsx)$/)) {
      return {};
    }

    let describeDepth = 0;
    let totalTestsInFile = 0;
    let totalSnapshotsInFile = 0;
    const describeStack = [];

    function checkVerbosePatterns(node, text) {
      for (const pattern of VERBOSE_PATTERNS) {
        if (pattern.test(text)) {
          context.report({
            node,
            messageId: 'verboseTest',
            data: { description: text.slice(0, 60) },
          });
          return;
        }
      }
    }

    function checkRedundantDescribe(node, text) {
      for (const pattern of REDUNDANT_DESCRIBES) {
        if (pattern.test(text)) {
          context.report({
            node,
            messageId: 'redundantDescribe',
            data: { description: text },
          });
          return;
        }
      }
    }

    function checkConstantsTest(node) {
      const nodeText = sourceCode.getText(node);
      const constantsPatterns = [
        /CONSTANTS\s*\.\s*\w+.*toBe\(/i,
        /UI_TEXT\s*\.\s*\w+.*toBe\(/i,
        /expect\s*\(\s*\w+_CONSTANTS/i,
        /expect\s*\(\s*\w+_TEXT/i,
      ];

      for (const pattern of constantsPatterns) {
        if (pattern.test(nodeText)) {
          context.report({
            node,
            messageId: 'constantsTest',
          });
          return;
        }
      }
    }

    function checkOnlyOrSkip(node) {
      // Check for it.only, test.only, describe.only
      if (
        node.callee.type === 'MemberExpression' &&
        node.callee.property.type === 'Identifier'
      ) {
        const method = node.callee.property.name;

        if (method === 'only') {
          context.report({
            node,
            messageId: 'onlyDetected',
          });
        } else if (method === 'skip') {
          context.report({
            node,
            messageId: 'skipDetected',
          });
        }
      }
    }

    function checkEmptyTest(node, callback) {
      if (!callback) return;

      if (isEmptyBody(callback)) {
        context.report({
          node,
          messageId: 'emptyTest',
        });
        return true;
      }
      return false;
    }

    function checkNoAssertions(node, callback) {
      if (!callback) return;

      const callbackText = sourceCode.getText(callback);

      // Check if there are any expect() calls
      if (!callbackText.includes('expect(') && !callbackText.includes('assert')) {
        context.report({
          node,
          messageId: 'noAssertions',
        });
      }

      // Count snapshots
      const snapshotCount = countSnapshots(callbackText);
      totalSnapshotsInFile += snapshotCount;
    }

    function getCalleeName(node) {
      if (node.callee.type === 'Identifier') {
        return node.callee.name;
      }
      if (
        node.callee.type === 'MemberExpression' &&
        node.callee.object.type === 'Identifier'
      ) {
        return node.callee.object.name;
      }
      return null;
    }

    return {
      CallExpression(node) {
        const calleeName = getCalleeName(node);

        // Check for .only() or .skip()
        checkOnlyOrSkip(node);

        // Handle describe/context blocks
        if (calleeName === 'describe' || calleeName === 'context') {
          describeDepth++;

          // Check nesting depth
          if (describeDepth > options.maxDescribeDepth) {
            context.report({
              node,
              messageId: 'deepNesting',
              data: {
                depth: describeDepth,
                max: options.maxDescribeDepth,
              },
            });
          }

          // Check for redundant describe patterns
          const firstArg = node.arguments[0];
          if (firstArg && firstArg.type === 'Literal' && typeof firstArg.value === 'string') {
            checkRedundantDescribe(node, firstArg.value);
          }

          // Track describe block
          describeStack.push({
            node,
            testCount: 0,
            depth: describeDepth,
          });
        }

        // Handle it/test blocks
        if (calleeName === 'it' || calleeName === 'test') {
          totalTestsInFile++;

          // Increment test count in current describe
          if (describeStack.length > 0) {
            describeStack[describeStack.length - 1].testCount++;
          }

          const firstArg = node.arguments[0];
          const callback = node.arguments[1];

          // Check for verbose test patterns
          if (firstArg && firstArg.type === 'Literal' && typeof firstArg.value === 'string') {
            checkVerbosePatterns(node, firstArg.value);
          }

          // Check for empty tests
          if (callback && (callback.type === 'ArrowFunctionExpression' || callback.type === 'FunctionExpression')) {
            const isEmpty = checkEmptyTest(node, callback);

            // Only check for assertions if not empty
            if (!isEmpty) {
              checkNoAssertions(node, callback);
              checkConstantsTest(callback);
            }
          }
        }
      },

      'CallExpression:exit'(node) {
        const calleeName = getCalleeName(node);

        if (calleeName === 'describe' || calleeName === 'context') {
          // Check tests per describe before popping
          if (describeStack.length > 0) {
            const currentBlock = describeStack[describeStack.length - 1];

            if (currentBlock.testCount > options.maxTestsPerDescribe) {
              context.report({
                node: currentBlock.node,
                messageId: 'tooManyTests',
                data: {
                  count: currentBlock.testCount,
                  max: options.maxTestsPerDescribe,
                },
              });
            }
          }

          describeDepth--;
          describeStack.pop();
        }
      },

      'Program:exit'(node) {
        // Check total tests in file
        if (totalTestsInFile > options.maxTestsPerFile) {
          context.report({
            node,
            messageId: 'tooManyTestsInFile',
            data: {
              count: totalTestsInFile,
              max: options.maxTestsPerFile,
            },
          });
        }

        // Check total snapshots in file
        if (totalSnapshotsInFile > options.maxSnapshotsPerFile) {
          context.report({
            node,
            messageId: 'tooManySnapshots',
            data: {
              count: totalSnapshotsInFile,
              max: options.maxSnapshotsPerFile,
            },
          });
        }
      },
    };
  },
};
