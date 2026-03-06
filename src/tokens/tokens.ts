/**
 * Design System Tokens
 *
 * Unified design token system following:
 * - Material Design 3 (Google)
 * - Apple Human Interface Guidelines
 * - 8-Point Grid System
 * - Tailwind CSS naming conventions
 *
 * SSR-safe: All exports are flat objects (no theme context required)
 *
 * @see ~/.claude/standards/DESIGN-SYSTEM-STANDARDS.md
 * @see ~/.claude/patterns/design-system-patterns.md
 */

export const spacing = {
  '2xl': '3rem',
  '3xl': '3.5rem',
  '4xl': '4rem',
  '5xl': '4.5rem',
  '6xl': '5rem',
  '7xl': '6rem',
  lg: '2rem',
  md: '1.5rem',
  micro: '0.25rem',
  sm: '1rem',
  xl: '2.5rem',
  xs: '0.5rem',
} as const;

/**
 * Agnostic Color Tokens
 *
 * Framework-level colors that can be reused across any project.
 * Includes: palettes, status colors, semantic colors, neutrals.
 */
export const color = {
  accent100: '#F8BBD9',
  accent200: '#F48FB1',
  accent50: '#FCE4EC',
  accent500: '#FF4081',
  accent600: '#D81B60',
  accent700: '#C2185B',
  background: '#FFFFFF',
  backgroundAlt: '#FFF9E6',
  backgroundDark: '#F5F7FA',
  backgroundInverse: '#1A237E',
  black: '#000000',
  blackRgb: '0, 0, 0',
  border: '#E4E9F0',
  borderDark: '#C5D0DE',
  borderLight: '#F5F7FA',
  cyan400: '#22D3EE',
  cyan500: '#06B6D4',
  cyan600: '#0891B2',
  dark100: '#374151',
  dark200: '#1F2937',
  dark300: '#111827',
  error: '#F44336',
  errorBackground: '#FFEBEE',
  errorBorder: '#FFCDD2',
  errorDark: '#D32F2F',
  errorLight: '#E57373',
  info: '#2196F3',
  infoDark: '#1976D2',
  infoLight: '#64B5F6',
  magenta400: '#F472B6',
  magenta500: '#EC4899',
  neutral0: '#FFFFFF',
  neutral100: '#E4E9F0',
  neutral200: '#C5D0DE',
  neutral300: '#A6B7CB',
  neutral400: '#8FA3BC',
  neutral50: '#F5F7FA',
  neutral500: '#7890AD',
  neutral600: '#6583A0',
  neutral700: '#4D7190',
  neutral800: '#3B5F80',
  neutral900: '#1E3A5F',
  overlay: 'rgba(26, 35, 126, 0.5)',
  overlayDark: 'rgba(26, 35, 126, 0.7)',
  overlayLight: 'rgba(26, 35, 126, 0.3)',
  primary100: '#FFF9C4',
  primary200: '#FFF176',
  primary300: '#FFEE58',
  primary400: '#FDD835',
  primary50: '#FFFBEB',
  primary500: '#FFC107',
  primary600: '#FFB300',
  primary700: '#FFA000',
  primary800: '#FF8F00',
  primary900: '#FF6F00',
  purple400: '#A78BFA',
  purple500: '#8B5CF6',
  purple600: '#7C3AED',
  secondary100: '#BBDEFB',
  secondary200: '#90CAF9',
  secondary300: '#64B5F6',
  secondary400: '#42A5F5',
  secondary50: '#E3F2FD',
  secondary500: '#2196F3',
  secondary600: '#1E88E5',
  secondary700: '#1976D2',
  secondary800: '#1565C0',
  secondary900: '#0D47A1',
  success: '#4CAF50',
  successBackground: '#E8F5E9',
  successDark: '#388E3C',
  successLight: '#81C784',
  surface: '#FFFFFF',
  teal500: '#00C4AD',
  tealRgb: '0, 196, 173',
  tertiary100: '#F8BBD9',
  tertiary200: '#F48FB1',
  tertiary300: '#F06292',
  tertiary400: '#EC407A',
  tertiary50: '#FCE4EC',
  tertiary500: '#FF4081',
  tertiary600: '#D81B60',
  tertiary700: '#C2185B',
  tertiary800: '#AD1457',
  tertiary900: '#880E4F',
  textAccent: '#FF4081',
  textDisabled: '#A0AEC0',
  textInverse: '#FFFFFF',
  textPrimary: '#1A237E',
  textSecondary: '#4A5568',
  textTertiary: '#718096',
  transparent: 'transparent',
  warning: '#FF9800',
  warningBackground: '#FFF8E1',
  warningDark: '#F57C00',
  warningLight: '#FFB74D',
  white: '#FFFFFF',
  whiteRgb: '255, 255, 255',
} as const;

/**
 * Brand Color Tokens
 *
 * Business-specific colors for DearAdry project.
 * Includes: landing page, categories, FAQ, alerts, pricing, etc.
 */
export const brandColor = {
  alertBg: '#FFF5CC',
  alertIconBg: '#FFB300',
  alertIconFg: '#FFFFFF',
  bgButtonsCta: '#FDFFD8',
  bgCauseYellow: '#FFEE91',
  bgFooterCTA: '#FDFFD8',
  bgHeader: '#FFEBB5',
  bgMissionBlue: '#3B8DFF',
  bgPricingBody: '#FFF6BA',
  bgPricingHeader: '#645CFF',
  bgStepsPink: '#FCE4EC',
  categoryComunidad: '#FFC107',
  categoryComunidadBg: '#FFF8E1',
  categoryEquipo: '#4CAF50',
  categoryEquipoBg: '#E8F5E9',
  categoryEventos: '#1565C0',
  categoryEventosBg: '#E3F2FD',
  categoryKits: '#E91E63',
  categoryKitsBg: '#FCE4EC',
  faqEventos: '#1565C0',
  faqEventosBg: '#E3F2FD',
  faqGeneral: '#6366F1',
  faqGeneralBg: '#EEF2FF',
  faqKits: '#E91E63',
  faqKitsBg: '#FCE4EC',
  faqPagos: '#4CAF50',
  faqPagosBg: '#E8F5E9',
  landingBgCream: '#FFF3E0',
  landingBgSkyBlue: '#4FC3F7',
  landingBgYellow: '#FFEB8B',
  landingBlueDark: '#1A237E',
  landingBlueLight: '#81D4FA',
  landingPinkLight: '#FFB8E8',
  landingPinkVibrant: '#FF00B2',
  landingTextGray: '#4A5568',
  landingYellowIntense: '#FFF176',
  signupSuccessBg: '#E8F5E9',
} as const;

export const typography = {
  family: {
    body: "'Inter', sans-serif",
    display: "'Lato', sans-serif",
    mono: "'Courier New', monospace",
  },
  leading: {
    normal: 1.5,
    relaxed: 1.75,
    tight: 1.2,
  },
  size: {
    '2xl': '1.5rem',
    '3xl': '1.75rem',
    '4xl': '2rem',
    '5xl': '2.25rem',
    '6xl': '2.5rem',
    '7xl': '3rem',
    '8xl': '4rem',
    base: '1rem',
    lg: '1.125rem',
    sm: '0.875rem',
    xl: '1.25rem',
    xs: '0.75rem',
  },
  tracking: {
    normal: '0',
    tight: '-0.02em',
    wide: '0.02em',
  },
  weight: {
    black: 900,
    bold: 700,
    medium: 500,
    regular: 400,
    semibold: 600,
  },
} as const;

export const elevation = {
  card: '0px 4px 4px 0px rgba(0, 0, 0, 0.3), 0px 8px 12px 6px rgba(0, 0, 0, 0.15)',
  lg: '0 20px 40px rgba(30, 58, 95, 0.12)',
  md: '0 8px 24px rgba(30, 58, 95, 0.12)',
  none: 'none',
  sm: '0 2px 8px rgba(30, 58, 95, 0.08)',
  xl: '0 30px 60px rgba(30, 58, 95, 0.16)',
} as const;

export const shape = {
  '2xl': '2rem',
  full: '9999px',
  lg: '0.75rem',
  md: '0.5rem',
  none: '0',
  sm: '0.25rem',
  xl: '1rem',
} as const;

export const motion = {
  fast: '150ms ease-in-out',
  normal: '250ms ease-in-out',
  slow: '400ms ease-in-out',
} as const;

export const layout = {
  breakpoint: {
    '2xl': '1536px',
    lg: '1024px',
    md: '768px',
    sm: '640px',
    xl: '1280px',
  },
  container: {
    lg: '1200px',
    md: '1000px',
    sm: '800px',
  },
  contentMaxWidth: '600px',
  heroMinHeight: '500px',
  heroMinHeightLg: '600px',
  icon: {
    lg: '24px',
    md: '20px',
    sm: '16px',
    xl: '32px',
  },
  illustrationMaxHeightSm: '300px',
  sectionMaxWidth: '1200px',
  zIndex: {
    base: 0,
    dropdown: 100,
    fixed: 300,
    modal: 500,
    overlay: 400,
    popover: 600,
    sticky: 200,
    toast: 700,
  },
} as const;
