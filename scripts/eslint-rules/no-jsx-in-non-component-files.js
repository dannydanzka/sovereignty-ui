/**
 * ESLint Rule: no-jsx-in-non-component-files
 *
 * Enforces the artifact boundary: JSX may only live in component/screen/layout
 * files. Helper, constant, interface, type and styled files must stay JSX-free
 * so that business logic, hardcoded values, type declarations and style
 * definitions never smuggle in rendering concerns.
 *
 * Rationale (Code Sovereignty):
 * - `.helpers.*`    → pure logic ONLY (no side effects, no JSX)
 * - `.constants.*`  → hardcoded values ONLY
 * - `.interfaces.*` → type declarations ONLY
 * - `.types.*`      → type declarations ONLY
 * - `.styled.*`     → styled-component definitions ONLY (tagged templates, no JSX)
 *
 * A styled-component is authored with the `styled.X``` tagged-template syntax,
 * which produces NO JSX nodes — so banning JSX in `.styled.*` is safe.
 *
 * NOTE (adapted from BN3): `.mock.*` / `.mocks.*` are intentionally NOT listed —
 * mock factories legitimately return JSX (mock components).
 *
 * @example
 * // Bad — JSX in a helpers file
 * // file: foo.helpers.tsx
 * export const renderRow = (item) => <Row>{item.name}</Row>;
 *
 * // Good — helper returns data; the component renders it
 * // file: foo.helpers.ts
 * export const buildRowProps = (item) => ({ label: item.name });
 *
 * @version 1.1.0
 * @reviewed 2026-06-19
 */

const NON_COMPONENT_SUFFIXES = ['.helpers.', '.constants.', '.interfaces.', '.types.', '.styled.'];

const getViolatedSuffix = (filename) =>
  NON_COMPONENT_SUFFIXES.find((suffix) => filename.includes(suffix));

export const noJsxInNonComponentFilesRule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow JSX in helper, constant, interface, type and styled files. JSX belongs in component/screen/layout files only.',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      noJsx:
        'JSX is not allowed in "{{suffix}}" files. Move rendering to a component/screen/layout file; keep this file JSX-free ({{kind}}).',
    },
    schema: [],
  },

  create(context) {
    const filename = context.filename;
    const suffix = getViolatedSuffix(filename);

    if (!suffix) {
      return {};
    }

    const kindBySuffix = {
      '.helpers.': 'pure logic only',
      '.constants.': 'hardcoded values only',
      '.interfaces.': 'type declarations only',
      '.types.': 'type declarations only',
      '.styled.': 'styled-component definitions only',
    };

    const report = (node) => {
      context.report({
        node,
        messageId: 'noJsx',
        data: {
          suffix: suffix.replace(/\./g, ''),
          kind: kindBySuffix[suffix],
        },
      });
    };

    return {
      JSXElement: report,
      JSXFragment: report,
    };
  },
};
