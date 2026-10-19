/** Breakpoint queries that never overlap: `below(bp)` ends just before `atLeast(bp)` begins. */
import type { BreakpointToken } from './tokens.types';
import { layout } from './tokens';

/** Both edges inclusive hid the header's nav AND its menu button at exactly 1024px. */
const EDGE_PX = 0.02;

export const media = {
  atLeast: (bp: BreakpointToken): string => `@media (min-width: ${layout.breakpoint[bp]})`,
  below: (bp: BreakpointToken): string =>
    `@media (max-width: ${Number.parseFloat(layout.breakpoint[bp]) - EDGE_PX}px)`,
} as const;
