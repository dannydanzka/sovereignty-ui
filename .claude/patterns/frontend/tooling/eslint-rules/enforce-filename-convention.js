/**
 * ESLint Rule: enforce-filename-convention
 *
 * Enforces consistent filename naming across Clean Architecture layers.
 * Two complementary checks run on every file:
 *
 *  1. REQUIRED SEGMENT — files in a known directory must contain the expected
 *     dot-segment so they are immediately identifiable by name alone.
 *
 *  2. WRONG FORM — any file using a misspelled, singular-when-plural, or
 *     plural-when-singular segment is flagged regardless of directory.
 *
 * ┌──────────────────────┬────────────────────┬──────────────────────────────┐
 * │  Directory           │  Required segment  │  Cross-cutting wrong forms   │
 * ├──────────────────────┼────────────────────┼──────────────────────────────┤
 * │  /repositories/      │  .repository.      │  .helper.    → .helpers.     │
 * │  /use-cases/         │  .use-case.        │  .interface. → .interfaces.  │
 * │  /slices/            │  .slice.           │  .constant.  → .constants.   │
 * │  /entities/          │  .entity.          │                              │
 * └──────────────────────┴────────────────────┴──────────────────────────────┘
 *
 * ADAPTED from BN3 (Redux-Saga). Removed saga-specific dirs (reducers/sagas/
 * actions/selectors) and /pages→.screen. Excluded /services/ on purpose: it
 * holds heterogeneous files (.processor./.validator./.utils.) so a single
 * required segment would produce false positives. RTK uses /slices/ → .slice.
 *
 * Exempt files (never checked for required segment):
 *   index.*  |  *.test.*  |  *.spec.*  |  *.styled.*  |  *.interfaces.*
 *   *.helpers.*  |  *.constants.*  |  *.factory.*  |  *.mock.*  |  *.mocks.*
 *   *.types.*  |  *.slice.*  |  *.repository.*  |  *.use-case.*  |  *.entity.*
 *
 * ESLINT VERSION: requires ESLint 9+ (uses context.filename property API).
 *
 * @version 2.0.0 (dearadry-adapted)
 * @reviewed 2026-06-19
 */

// ─── Convention map ──────────────────────────────────────────────────────────

const DIRECTORY_RULES = [
  { dirPattern: /\/repositories\//, required: '.repository.' },
  { dirPattern: /\/use-cases\//, required: '.use-case.' },
  { dirPattern: /\/slices\//, required: '.slice.' },
  { dirPattern: /\/entities\//, required: '.entity.' },
];

// Wrong forms that apply to ANY file regardless of directory (singular → plural)
const GLOBAL_WRONG_FORMS = [
  { pattern: /\.helper\./, correct: '.helpers.' },
  { pattern: /\.interface\./, correct: '.interfaces.' },
  { pattern: /\.constant\./, correct: '.constants.' },
];

// ─── Exempt patterns ─────────────────────────────────────────────────────────

const EXEMPT_BASENAME_PATTERNS = [/^index\.(ts|tsx|js|jsx)$/];

const EXEMPT_SEGMENT_PATTERNS = [
  /\.test\./,
  /\.spec\./,
  /\.styled\./,
  /\.interfaces\./,
  /\.helpers\./,
  /\.constants\./,
  /\.factory\./,
  /\.mock\./,
  /\.mocks\./,
  /\.types\./,
  /\.config\./,
  /\.slice\./,
  /\.repository\./,
  /\.use-case\./,
  /\.entity\./,
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const isExempt = (basename) => {
  if (EXEMPT_BASENAME_PATTERNS.some((p) => p.test(basename))) return true;
  if (EXEMPT_SEGMENT_PATTERNS.some((p) => p.test(basename))) return true;
  return false;
};

const buildSuggestion = (basename, currentSegment, correctSegment) =>
  basename.replace(currentSegment, correctSegment);

const buildMissingSuggestion = (basename, requiredSegment) => {
  const ext = basename.match(/\.(tsx?|jsx?)$/)?.[0] ?? '.ts';
  const stem = basename.replace(/\.(tsx?|jsx?)$/, '');
  return `${stem}${requiredSegment}${ext.replace(/^\./, '')}`;
};

// ─── Rule ────────────────────────────────────────────────────────────────────

/** @type {import('eslint').Rule.RuleModule} */
export const enforceFilenameConventionRule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforce dot-segment naming conventions for Clean Architecture layers (repository, use-case, slice, entity) and singular→plural cross-cutting forms.',
      recommended: true,
    },
    messages: {
      missingSegment:
        '"{{basename}}" in {{dirType}} must contain "{{required}}" (e.g. "{{suggestion}}").',
      wrongForm:
        '"{{basename}}" uses "{{wrong}}" — should be "{{correct}}" (e.g. "{{suggestion}}").',
    },
    schema: [],
  },

  create(context) {
    return {
      Program(node) {
        const filename = context.filename.replace(/\\/g, '/');
        const basename = filename.split('/').at(-1) ?? '';

        // ── 1. Global wrong-form checks (any file, any directory) ──────────
        for (const { pattern, correct } of GLOBAL_WRONG_FORMS) {
          const match = basename.match(pattern);
          if (match) {
            context.report({
              node,
              messageId: 'wrongForm',
              data: {
                basename,
                wrong: match[0],
                correct,
                suggestion: buildSuggestion(basename, match[0], correct),
              },
            });
          }
        }

        // ── 2. Directory-based required-segment checks ─────────────────────
        if (isExempt(basename)) return;

        for (const rule of DIRECTORY_RULES) {
          if (!rule.dirPattern.test(filename)) continue;
          if (basename.includes(rule.required)) return;

          const dirLabel = rule.dirPattern.source.replace(/[/\\^$]/g, '');
          context.report({
            node,
            messageId: 'missingSegment',
            data: {
              basename,
              dirType: `/${dirLabel}/`,
              required: rule.required,
              suggestion: buildMissingSuggestion(basename, rule.required),
            },
          });
          return;
        }
      },
    };
  },
};
