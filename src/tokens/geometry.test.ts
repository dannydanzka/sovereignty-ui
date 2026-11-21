import { describe, expect, it } from 'vitest';

import { geometry, measure, size, stroke } from './geometry';

describe('geometry scales', () => {
  it('exposes each scale on its own and together', () => {
    expect(geometry.size).toBe(size);
    expect(geometry.measure).toBe(measure);
    expect(stroke.hairline).toBe('1px');
  });

  it('keeps every value a pixel length, ascending within the size scale', () => {
    const order = [
      '2xs',
      'xs',
      'sm',
      'md',
      'lg',
      'xl',
      '2xl',
      '3xl',
      '4xl',
      '5xl',
      '6xl',
      '7xl',
      '8xl',
    ] as const;
    const pixels = order.map((key) => Number.parseInt(size[key], 10));

    expect(Object.values(size).every((value) => /^\d+px$/.test(value))).toBe(true);
    expect(pixels).toEqual([...pixels].sort((a, b) => a - b));
  });
});
