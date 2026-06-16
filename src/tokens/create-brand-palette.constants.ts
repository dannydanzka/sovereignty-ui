/** Brand Palette Factory constants. */

/** Shade step → mix amount. Positive = lighten (toward white), negative = darken (toward black). */
export const SHADE_AMOUNT: Record<number, number> = {
  50: 0.92,
  100: 0.8,
  200: 0.6,
  300: 0.4,
  400: 0.2,
  500: 0,
  600: -0.12,
  700: -0.24,
  800: -0.38,
  900: -0.52,
};

/** Which steps each family exposes in the default token set. */
export const FULL_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;
export const ACCENT_STEPS = [50, 100, 200, 500, 600, 700] as const;
