/**
 * ESLint Rule: design-tokens-policy
 *
 * Unified design token enforcement for consistent UI across the application.
 * Philosophy: "Design system compliance through static analysis"
 *
 * CONSOLIDATES:
 * - no-hardcoded-colors (deprecated)
 * - no-hardcoded-spacing (deprecated)
 *
 * POLICY SUMMARY:
 *
 * COLORS:
 *   - FORBIDDEN: Hex (#fff), RGB, RGBA, HSL, named colors (red, blue)
 *   - REQUIRED: ${color.primary500}, rgb(${color.neutralRgb} / 0.5)
 *   - ALLOWED: transparent, currentColor, inherit
 *
 * SPACING:
 *   - FORBIDDEN: Hardcoded px values (16px, 24px) for spacing properties
 *   - REQUIRED: ${spacing.sm}, ${spacing.md}, ${layout.icon.md}
 *   - ALLOWED: 0, 1-4px (borders), 100px+ (layout), %, vh/vw
 *
 * EXEMPTIONS:
 *   - Test files, mock files
 *   - Values using token interpolation
 *   - Font-size (uses typography tokens)
 *   - Box-shadow blur/spread values
 *
 * @version 1.0.0
 * @reviewed 2026-01-19
 */

/** CSS Named Colors */
const NAMED_COLORS = new Set([
  'aliceblue', 'antiquewhite', 'aqua', 'aquamarine', 'azure', 'beige', 'bisque',
  'black', 'blanchedalmond', 'blue', 'blueviolet', 'brown', 'burlywood', 'cadetblue',
  'chartreuse', 'chocolate', 'coral', 'cornflowerblue', 'cornsilk', 'crimson', 'cyan',
  'darkblue', 'darkcyan', 'darkgoldenrod', 'darkgray', 'darkgrey', 'darkgreen',
  'darkkhaki', 'darkmagenta', 'darkolivegreen', 'darkorange', 'darkorchid', 'darkred',
  'darksalmon', 'darkseagreen', 'darkslateblue', 'darkslategray', 'darkslategrey',
  'darkturquoise', 'darkviolet', 'deeppink', 'deepskyblue', 'dimgray', 'dimgrey',
  'dodgerblue', 'firebrick', 'floralwhite', 'forestgreen', 'fuchsia', 'gainsboro',
  'ghostwhite', 'gold', 'goldenrod', 'gray', 'grey', 'green', 'greenyellow', 'honeydew',
  'hotpink', 'indianred', 'indigo', 'ivory', 'khaki', 'lavender', 'lavenderblush',
  'lawngreen', 'lemonchiffon', 'lightblue', 'lightcoral', 'lightcyan',
  'lightgoldenrodyellow', 'lightgray', 'lightgrey', 'lightgreen', 'lightpink',
  'lightsalmon', 'lightseagreen', 'lightskyblue', 'lightslategray', 'lightslategrey',
  'lightsteelblue', 'lightyellow', 'lime', 'limegreen', 'linen', 'magenta', 'maroon',
  'mediumaquamarine', 'mediumblue', 'mediumorchid', 'mediumpurple', 'mediumseagreen',
  'mediumslateblue', 'mediumspringgreen', 'mediumturquoise', 'mediumvioletred',
  'midnightblue', 'mintcream', 'mistyrose', 'moccasin', 'navajowhite', 'navy',
  'oldlace', 'olive', 'olivedrab', 'orange', 'orangered', 'orchid', 'palegoldenrod',
  'palegreen', 'paleturquoise', 'palevioletred', 'papayawhip', 'peachpuff', 'peru',
  'pink', 'plum', 'powderblue', 'purple', 'rebeccapurple', 'red', 'rosybrown',
  'royalblue', 'saddlebrown', 'salmon', 'sandybrown', 'seagreen', 'seashell', 'sienna',
  'silver', 'skyblue', 'slateblue', 'slategray', 'slategrey', 'snow', 'springgreen',
  'steelblue', 'tan', 'teal', 'thistle', 'tomato', 'turquoise', 'violet', 'wheat',
  'white', 'whitesmoke', 'yellow', 'yellowgreen',
]);

/** Allowed CSS keywords */
const ALLOWED_KEYWORDS = new Set([
  'transparent', 'currentColor', 'inherit', 'initial', 'unset', 'revert', 'auto', 'none',
]);

/** CSS properties that accept spacing values */
const SPACING_PROPERTIES = new Set([
  'width', 'height', 'min-width', 'max-width', 'min-height', 'max-height',
  'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
  'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
  'top', 'right', 'bottom', 'left', 'gap', 'row-gap', 'column-gap', 'grid-gap',
  'flex-basis', 'inset',
]);

/** Small pixel values allowed for borders */
const ALLOWED_SMALL_PX = new Set(['1px', '2px', '3px', '4px']);

/** 8-Point Grid spacing map */
const EIGHT_POINT_GRID = {
  4: 'micro', 8: 'xs', 16: 'sm', 24: 'md', 32: 'lg', 40: 'xl',
  48: "'2xl'", 56: "'3xl'", 64: "'4xl'", 72: "'5xl'", 80: "'6xl'", 96: "'7xl'",
};

/** @type {import('eslint').Rule.RuleModule} */
export const designTokensPolicyRule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce design tokens for colors and spacing. No hardcoded values allowed.',
      category: 'Design System',
      recommended: true,
    },
    messages: {
      hardcodedHex: 'Hardcoded hex color "{{color}}" detected. Use: ${color.tokenName}',
      hardcodedRgb: 'Hardcoded rgb/rgba detected. Use: rgb(${color.tokenRgb} / alpha)',
      hardcodedHsl: 'Hardcoded hsl/hsla detected. Use: ${color.tokenName}',
      hardcodedNamed: 'Hardcoded named color "{{color}}" detected. Use: ${color.{{color}}}',
      hardcodedSpacing: 'Hardcoded spacing "{{value}}" detected. Use: ${spacing.{{suggestion}}}',
    },
    schema: [],
  },

  create(context) {
    const filename = context.getFilename();

    const isTestFile =
      filename.endsWith('.test.tsx') || filename.endsWith('.test.ts') ||
      filename.endsWith('.spec.tsx') || filename.endsWith('.spec.ts') ||
      filename.includes('__tests__') || filename.includes('/testing/');

    if (isTestFile) return {};

    const isStyledFile = filename.endsWith('.styled.ts') || filename.endsWith('.styled.tsx');

    const hasColorToken = (value) => /\$\{color\.\w+\}/.test(value) || /hexToRgba\s*\(\s*color\./.test(value);
    const hasSpacingToken = (value) => /\$\{spacing\.\w+\}/.test(value) || /\$\{layout\.\w+\}/.test(value);

    const detectHexColor = (value) => value.match(/#([0-9a-fA-F]{3,8})\b/);
    const detectRgbColor = (value) => {
      if (/rgba?\([^)]*color\./.test(value) || /hexToRgba\s*\(/.test(value)) return null;
      return value.match(/rgba?\(\s*\d+/);
    };
    const detectHslColor = (value) => value.match(/hsla?\(\s*\d+/);

    const detectNamedColor = (value) => {
      const words = value.toLowerCase().match(/\b[a-z]+\b/g);
      if (!words) return null;
      for (const word of words) {
        if (ALLOWED_KEYWORDS.has(word)) continue;
        if (['solid', 'dotted', 'dashed', 'double', 'groove', 'ridge', 'inset', 'outset', 'px', 'rem', 'em', 'vw', 'vh'].includes(word)) continue;
        if (NAMED_COLORS.has(word)) return word;
      }
      return null;
    };

    const isSpacingProperty = (value) => {
      const lower = value.toLowerCase();
      for (const prop of SPACING_PROPERTIES) {
        if (lower.includes(`${prop}:`)) return true;
      }
      return false;
    };

    const getSpacingSuggestion = (px) => {
      if (EIGHT_POINT_GRID[px]) return EIGHT_POINT_GRID[px];
      const validValues = Object.keys(EIGHT_POINT_GRID).map(Number);
      const nearest = validValues.reduce((prev, curr) => Math.abs(curr - px) < Math.abs(prev - px) ? curr : prev);
      return `${EIGHT_POINT_GRID[nearest]} (nearest to ${px}px)`;
    };

    const checkColors = (node, value) => {
      if (hasColorToken(value)) return;
      if (/font-family\s*:/i.test(value) || /['\"][^'\"]*\b(Ops|Sans|Serif|Mono)\b/i.test(value)) return;
      if (/\b(white-space|color-scheme|overflow-wrap|word-break)\s*:/i.test(value)) return;

      const hexMatch = detectHexColor(value);
      if (hexMatch) {
        context.report({ node, messageId: 'hardcodedHex', data: { color: hexMatch[0] } });
        return;
      }

      const rgbMatch = detectRgbColor(value);
      if (rgbMatch) {
        context.report({ node, messageId: 'hardcodedRgb' });
        return;
      }

      const hslMatch = detectHslColor(value);
      if (hslMatch) {
        context.report({ node, messageId: 'hardcodedHsl' });
        return;
      }

      const namedColor = detectNamedColor(value);
      if (namedColor) {
        context.report({ node, messageId: 'hardcodedNamed', data: { color: namedColor } });
      }
    };

    const checkSpacing = (node, value) => {
      if (!isStyledFile) return;
      if (hasSpacingToken(value)) return;
      if (!isSpacingProperty(value)) return;

      const pxPattern = /\b(\d+)px\b/g;
      let match;

      while ((match = pxPattern.exec(value)) !== null) {
        const numericValue = parseInt(match[1], 10);
        if (numericValue === 0) continue;
        if (numericValue >= 100) continue;
        if (ALLOWED_SMALL_PX.has(match[0])) continue;
        if (/box-shadow\s*:/i.test(value) && numericValue <= 10) continue;

        context.report({
          node,
          messageId: 'hardcodedSpacing',
          data: { value: match[0], suggestion: getSpacingSuggestion(numericValue) },
        });
      }
    };

    return {
      TemplateElement(node) {
        const value = node.value.raw;
        if (!value.trim()) return;
        checkColors(node, value);
        checkSpacing(node, value);
      },

      'Property Literal[value]'(node) {
        if (!node.key) return;
        const propertyName = node.key.name || node.key.value;
        if (!propertyName) return;
        if (/color|background|border|shadow|fill|stroke|outline|text/i.test(propertyName)) {
          const value = node.value;
          if (typeof value === 'string') checkColors(node, value);
        }
      },
    };
  },
};
