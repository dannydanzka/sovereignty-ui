/**
 * ESLint Rule: comments-policy
 *
 * Unified comment policy based on Clean Code principles.
 * Philosophy: "Only code that needs explanation needs documentation"
 *
 * POLICY SUMMARY:
 *
 * FILE HEADERS:
 *   - REQUIRED: JSDoc header at top of file (context is always needed)
 *   - After 'use client'/'use server' if present
 *   - EXEMPT: index.ts, .d.ts, config files, test files, mocks
 *
 * SINGLE-LINE COMMENTS:
 *   - FORBIDDEN: All // comments (AI over-documents with these)
 *   - ALLOWED: Pragmas (TODO, FIXME, HACK, NOTE, XXX, @ts-ignore, @ts-expect-error)
 *   - NO disable pragmas - handled by no-eslint-disable rule
 *
 * INLINE DOCS: Use JSDoc block comments for inline documentation
 *
 * OBJECT PROPERTIES:
 *   - FORBIDDEN: Blank lines between properties
 *   - FORBIDDEN: Comments ABOVE properties (breaks sorting)
 *   - ALLOWED: JSDoc inline AFTER value
 *
 * @version 1.1.0
 * @reviewed 2026-01-19
 */

/** @type {import('eslint').Rule.RuleModule} */
export const commentsPolicyRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Unified comment policy: file headers required, no obvious comments, no comments above object properties',
      recommended: true,
    },
    fixable: 'whitespace',
    messages: {
      missingFileHeader: 'File is missing a JSDoc header comment. Add /** ... */ at the top of the file.',
      obviousComment: 'Single-line comments (//) are forbidden. Use JSDoc /** */ for documentation or remove if code is self-explanatory.',
      blankLineBetweenProps: 'Blank lines between object properties are not allowed. Keep objects compact.',
      commentAboveProp: 'Comments above object properties break alphabetical sorting. Use inline comment after the value instead: `key: value, /** comment */`',
    },
    schema: [
      {
        type: 'object',
        properties: {
          requireFileHeader: {
            type: 'boolean',
            default: true,
            description: 'Require JSDoc header at top of file',
          },
          allowInlineComments: {
            type: 'boolean',
            default: true,
            description: 'Allow inline comments after object property values',
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create: (context) => {
    const filename = context.filename || context.getFilename();
    const sourceCode = context.sourceCode || context.getSourceCode();
    const options = context.options[0] || {};
    const requireFileHeader = options.requireFileHeader !== false;
    const allowInlineComments = options.allowInlineComments !== false;

    // === FILE TYPE DETECTION ===

    const isTestFile = /\.(test|spec)\.(ts|tsx|js|jsx)$/.test(filename);
    const isIndexFile = /\/index\.(ts|tsx|js|jsx)$/.test(filename);
    const isMockFile = /\/mocks\//.test(filename) || /\/__mocks__\//.test(filename);
    const isDeclarationFile = /\.d\.ts$/.test(filename);
    const isConfigFile =
      /\.(config|setup)\.(ts|js|mjs|cjs)$/.test(filename) ||
      /eslint\.config\.js/.test(filename) ||
      /vitest\.(config|setup)\.ts/.test(filename) ||
      /next\.config\.(js|mjs|ts)/.test(filename);
    const isConstantsFile = /\.constants\.(ts|js)$/.test(filename);

    const isExemptFromHeader = isTestFile || isIndexFile || isMockFile || isDeclarationFile || isConfigFile;
    const isExemptFromCommentRules = isTestFile || isMockFile || isConfigFile;

    // === PRAGMA PATTERNS ===
    // Only development pragmas allowed, NO disable comments (handled by no-eslint-disable rule)

    const pragmaPatterns = [
      /^\s*TODO:/i,
      /^\s*FIXME:/i,
      /^\s*HACK:/i,
      /^\s*NOTE:/i,
      /^\s*XXX:/i,
      /^\s*@ts-ignore/,
      /^\s*@ts-expect-error/,
      /^\s*MIGRATE TO PRISMA/i,
      /^\s*DOCUMENTED:/i,
    ];

    const isPragmaComment = (text) => pragmaPatterns.some((pattern) => pattern.test(text));

    // === FILE HEADER CHECK ===

    let hasCheckedFileHeader = false;

    const checkFileHeader = () => {
      if (hasCheckedFileHeader || !requireFileHeader || isExemptFromHeader) {
        return;
      }
      hasCheckedFileHeader = true;

      const comments = sourceCode.getAllComments();
      const firstToken = sourceCode.getFirstToken(sourceCode.ast, { includeComments: false });

      // Find if there's a JSDoc comment before any code
      const hasJSDocHeader = comments.some((comment) => {
        if (comment.type !== 'Block' || !comment.value.startsWith('*')) {
          return false;
        }
        // Must be before first token or at very start
        if (firstToken && comment.range[1] <= firstToken.range[0]) {
          return true;
        }
        // Or be the first thing in file (after directives)
        return comment.loc.start.line <= 10;
      });

      if (!hasJSDocHeader) {
        context.report({
          loc: { line: 1, column: 0 },
          messageId: 'missingFileHeader',
        });
      }
    };

    // === SINGLE-LINE COMMENT CHECK ===
    // ALL // comments are forbidden except pragmas
    // Use /** */ for inline documentation: key: value, /** comment */

    const checkSingleLineComment = (comment) => {
      if (isExemptFromCommentRules) return;
      if (comment.type !== 'Line') return;
      if (isPragmaComment(comment.value)) return;

      // No exceptions for inline // comments - use /** */ instead
      context.report({
        loc: comment.loc,
        messageId: 'obviousComment',
      });
    };

    // === OBJECT PROPERTIES CHECK ===

    const checkObjectExpression = (node) => {
      if (isExemptFromCommentRules) return;

      const properties = node.properties;
      if (properties.length < 2) return;

      for (let i = 0; i < properties.length - 1; i++) {
        const currentProp = properties[i];
        const nextProp = properties[i + 1];

        // Skip spread elements
        if (nextProp.type === 'SpreadElement') continue;

        const currentLine = currentProp.loc.end.line;
        const nextLine = nextProp.loc.start.line;

        // Check for comments between properties
        const comments = sourceCode.getCommentsBefore(nextProp);
        const commentsBetween = comments.filter(
          (comment) => comment.loc.start.line > currentLine && comment.loc.end.line < nextLine
        );

        // Check for comments directly above the next property (not inline with current)
        const commentsAbove = comments.filter(
          (comment) => comment.loc.start.line >= currentLine && comment.loc.end.line < nextLine
        );

        for (const comment of commentsAbove) {
          // Is this comment on its own line (not inline with previous prop)?
          const commentLineText = sourceCode.lines[comment.loc.start.line - 1] || '';
          const textBeforeComment = commentLineText.substring(0, comment.loc.start.column).trim();

          // If the comment is alone on its line (not after code), it's above the property
          if (!textBeforeComment || textBeforeComment.endsWith(',')) {
            // Check if it's truly between props (not inline)
            if (comment.loc.start.line > currentProp.loc.end.line) {
              context.report({
                loc: comment.loc,
                messageId: 'commentAboveProp',
                node,
              });
            }
          }
        }

        // Check for blank lines (when no comments)
        if (nextLine - currentLine > 1 && commentsBetween.length === 0) {
          // Check there's no inline comment on current line
          const commentsOnCurrentLine = comments.filter(
            (c) => c.loc.start.line === currentLine
          );

          if (commentsOnCurrentLine.length === 0) {
            context.report({
              fix: (fixer) => {
                const endOfCurrent = currentProp.range[1];
                const startOfNext = nextProp.range[0];
                const indent = ' '.repeat(currentProp.loc.start.column);
                return fixer.replaceTextRange([endOfCurrent, startOfNext], `,\n${indent}`);
              },
              loc: {
                end: nextProp.loc.start,
                start: currentProp.loc.end,
              },
              messageId: 'blankLineBetweenProps',
              node,
            });
          }
        }
      }
    };

    return {
      Program: () => {
        checkFileHeader();

        // Check all comments
        const comments = sourceCode.getAllComments();
        for (const comment of comments) {
          checkSingleLineComment(comment);
        }
      },

      ObjectExpression: checkObjectExpression,
    };
  },
};
