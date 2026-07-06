/**
 * ESLint Rule: no-eslint-disable
 *
 * Forbids the use of linter disable comments in code.
 * The priority is always to fix issues at the root, not suppress them.
 *
 * FORBIDDEN:
 * - // eslint-disable, // eslint-disable-next-line, // eslint-disable-line
 * - /* eslint-disable *\/
 * - // @ts-ignore, // @ts-expect-error, // @ts-nocheck
 * - // prettier-ignore, // prettier-ignore-start, // prettier-ignore-end
 *
 * Philosophy: If a linter complains, fix the code or adjust the rule configuration.
 * Never suppress warnings/errors with disable comments.
 *
 * @reviewed 2025-10-28
 */

/** @type {import('eslint').Rule.RuleModule} */
export const noEslintDisableRule = {
  create: (context) => {
    const sourceCode = context.getSourceCode();

    return {
      Program() {
        const comments = sourceCode.getAllComments();

        comments.forEach((comment) => {
          const commentValue = comment.value.trim();

          const hasEslintDisable =
            commentValue.includes('eslint-disable') ||
            commentValue.includes('eslint-disable-next-line') ||
            commentValue.includes('eslint-disable-line');

          const hasTypeScriptDisable =
            commentValue.includes('@ts-ignore') ||
            commentValue.includes('@ts-expect-error') ||
            commentValue.includes('@ts-nocheck');

          const hasPrettierDisable =
            commentValue.includes('prettier-ignore');

          if (hasEslintDisable) {
            context.report({
              loc: comment.loc,
              message:
                'eslint-disable comments are forbidden. Fix the ESLint issue at the root or adjust the rule configuration in eslint.config.js instead.',
            });
          }

          if (hasTypeScriptDisable) {
            context.report({
              loc: comment.loc,
              message:
                'TypeScript disable comments (@ts-ignore, @ts-expect-error, @ts-nocheck) are forbidden. Fix the TypeScript error at the root or adjust tsconfig.json instead.',
            });
          }

          if (hasPrettierDisable) {
            context.report({
              loc: comment.loc,
              message:
                'prettier-ignore comments are forbidden. Fix the formatting issue or adjust .prettierrc.js instead.',
            });
          }
        });
      },
    };
  },
  meta: {
    docs: {
      description:
        'Forbid linter disable comments (eslint, typescript, prettier). Always fix issues at the root.',
      recommended: true,
    },
    messages: {
      eslintDisableForbidden:
        'eslint-disable comments are forbidden. Fix the ESLint issue at the root or adjust the rule configuration in eslint.config.js instead.',
      typeScriptDisableForbidden:
        'TypeScript disable comments (@ts-ignore, @ts-expect-error, @ts-nocheck) are forbidden. Fix the TypeScript error at the root or adjust tsconfig.json instead.',
      prettierDisableForbidden:
        'prettier-ignore comments are forbidden. Fix the formatting issue or adjust .prettierrc.js instead.',
    },
    schema: [],
    type: 'problem',
  },
};
