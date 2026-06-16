/** Brand Palette Factory interfaces. */

export interface BrandPaletteInput {
  /** Main action color — drives accent family (Button, Pagination, Tabs). */
  accent?: string;
  /** Primary family base (Badge "primary", focus rings, StatItem). */
  primary?: string;
  /** Secondary family base. */
  secondary?: string;
}
