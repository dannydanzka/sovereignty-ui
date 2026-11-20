/**
 * Geometry scales: shadow shapes, stroke widths, small offsets, blur radii, and the size and measure
 * scales. Plain values, not CSS variables — geometry is not themed. A product styles with these
 * instead of raw pixels (its `design-tokens-policy` rule); the scales came from the product that
 * measured them (folded from one-off values, no element moved more than 9 %).
 */

/** Shadow geometry (x y blur [spread]); the color is composed where it is used. */
export const shadowShape = {
  diagonalMd: '2px 2px',
  diagonalSm: '1px 1px 4px',
  drop2xl: '0 10px 25px',
  dropLg: '0 4px 8px',
  dropLgSoft: '0 4px 20px',
  dropLgWide: '0 4px 12px',
  dropMd: '0 2px 4px',
  dropMdWide: '0 2px 8px',
  dropSm: '0 1px 3px',
  dropXl: '0 8px 16px',
  dropXlWide: '0 8px 24px',
  dropXs: '0 1px 2px',
  float: '0 25px 50px -12px',
  glowLg: '0 0 28px',
  glowMd: '0 0 16px',
  glowSm: '0 0 12px',
  glowSmWide: '0 0 14px',
  glowXl: '0 0 30px',
  glowXs: '0 0 6px',
  insetHighlight: 'inset 0 1px 0',
  insetSm: 'inset 0 2px 4px',
  pulseLg: '0 0 0 12px',
  pulseMd: '0 0 0 8px',
  ringLg: '0 0 0 4px',
  ringMd: '0 0 0 3px',
  ringSm: '0 0 0 2px',
} as const;

/** Border widths: the 1-2px hairlines plus the 3-4px accent and indicator bars. */
export const stroke = {
  hairline: '1px',
  lg: '4px',
  md: '3px',
  sm: '2px',
} as const;

/** Displacements below the spacing scale: hover lifts, enter transitions, nudges and overlaps. */
export const offset = {
  '2xl': '8px',
  '3xl': '20px',
  lg: '4px',
  md: '3px',
  sm: '2px',
  xl: '6px',
  xs: '1px',
} as const;

export const blur = {
  md: '10px',
  sm: '4px',
} as const;

/**
 * Fixed boxes and block heights up to 300px: avatars, thumbnails, logos, grid tracks, placeholders.
 * Folded from 30 one-off pixel values (plan 2.4c); no element moved more than 9 %.
 */
export const size = {
  '2xl': '120px',
  '2xs': '20px',
  '3xl': '140px',
  '4xl': '160px',
  '5xl': '180px',
  '6xl': '200px',
  '7xl': '240px',
  '8xl': '300px',
  lg: '80px',
  md: '56px',
  sm: '40px',
  xl: '100px',
  xs: '28px',
} as const;

/** Panel and column widths above 300px; page-wide widths are `layout.container`. */
export const measure = {
  '2xl': '900px',
  lg: '600px',
  md: '480px',
  sm: '400px',
  xl: '720px',
  xs: '320px',
} as const;

/** The six scales together, for a consumer that prefers one import. */
export const geometry = { blur, measure, offset, shadowShape, size, stroke } as const;
