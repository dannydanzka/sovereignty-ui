/// <reference types="vite/client" />
import { describe, expect, it } from 'vitest';

import type { BreakpointToken } from './tokens.types';
import { layout } from './tokens';
import { media } from './media';

const edge = (query: string): number => Number(/(\d+(?:\.\d+)?)px/.exec(query)?.[1]);

const STYLED_SOURCES = import.meta.glob<string>('../**/*.styled.ts', {
  eager: true,
  import: 'default',
  query: '?raw',
});

describe('media', () => {
  it.each(Object.keys(layout.breakpoint) as BreakpointToken[])(
    'below(%s) ends before atLeast(%s) begins, so a width matches exactly one',
    (bp) => {
      const width = edge(layout.breakpoint[bp]);
      expect(edge(media.below(bp))).toBeLessThan(width);
      expect(edge(media.atLeast(bp))).toBe(width);
    }
  );

  it('no styled file writes an inclusive max-width breakpoint by hand', () => {
    const offenders = Object.entries(STYLED_SOURCES)
      .filter(([, source]) => /max-width:\s*\$\{layout\.breakpoint/.test(source))
      .map(([path]) => path);
    expect(Object.keys(STYLED_SOURCES).length).toBeGreaterThan(10);
    expect(offenders).toEqual([]);
  });
});
