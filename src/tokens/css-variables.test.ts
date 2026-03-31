import { describe, expect, it } from 'vitest';

import { c, el, mo, s, sh, tf, tl, toKebab, ts, tt, tw } from './css-variables';
import { color, elevation, motion, shape, spacing, typography } from './tokens';

describe('toKebab', () => {
  it('converts camelCase to kebab-case', () => {
    expect(toKebab('textPrimary')).toBe('text-primary');
    expect(toKebab('errorBackground')).toBe('error-background');
  });

  it('converts numeric suffixes', () => {
    expect(toKebab('primary500')).toBe('primary-500');
    expect(toKebab('neutral50')).toBe('neutral-50');
    expect(toKebab('accent200')).toBe('accent-200');
  });

  it('handles combined camelCase and numbers', () => {
    expect(toKebab('secondary300')).toBe('secondary-300');
    expect(toKebab('primary100')).toBe('primary-100');
  });

  it('handles simple lowercase strings', () => {
    expect(toKebab('white')).toBe('white');
    expect(toKebab('error')).toBe('error');
  });
});

describe('c (color helper)', () => {
  it('wraps color token in CSS variable with fallback', () => {
    const result = c('textPrimary');
    expect(result).toBe(`var(--sui-text-primary, ${color.textPrimary})`);
  });

  it('handles numeric color tokens', () => {
    const result = c('primary500');
    expect(result).toBe(`var(--sui-primary-500, ${color.primary500})`);
  });
});

describe('s (spacing helper)', () => {
  it('wraps spacing token in CSS variable with fallback', () => {
    const result = s('md');
    expect(result).toBe(`var(--sui-spacing-md, ${spacing.md})`);
  });

  it('handles numeric spacing keys', () => {
    const result = s('2xl');
    expect(result).toBe(`var(--sui-spacing-2xl, ${spacing['2xl']})`);
  });
});

describe('sh (shape helper)', () => {
  it('wraps shape token in CSS variable with fallback', () => {
    const result = sh('md');
    expect(result).toBe(`var(--sui-shape-md, ${shape.md})`);
  });
});

describe('typography helpers', () => {
  it('tf wraps font family', () => {
    const result = tf('body');
    expect(result).toBe(`var(--sui-font-family-body, ${typography.family.body})`);
  });

  it('ts wraps font size', () => {
    const result = ts('sm');
    expect(result).toBe(`var(--sui-font-size-sm, ${typography.size.sm})`);
  });

  it('tw wraps font weight', () => {
    const result = tw('bold');
    expect(result).toBe(`var(--sui-font-weight-bold, ${typography.weight.bold})`);
  });

  it('tl wraps line height', () => {
    const result = tl('relaxed');
    expect(result).toBe(`var(--sui-leading-relaxed, ${typography.leading.relaxed})`);
  });

  it('tt wraps letter spacing', () => {
    const result = tt('wide');
    expect(result).toBe(`var(--sui-tracking-wide, ${typography.tracking.wide})`);
  });
});

describe('el (elevation helper)', () => {
  it('wraps elevation token in CSS variable with fallback', () => {
    const result = el('md');
    expect(result).toBe(`var(--sui-elevation-md, ${elevation.md})`);
  });
});

describe('mo (motion helper)', () => {
  it('wraps motion token in CSS variable with fallback', () => {
    const result = mo('normal');
    expect(result).toBe(`var(--sui-motion-normal, ${motion.normal})`);
  });
});
