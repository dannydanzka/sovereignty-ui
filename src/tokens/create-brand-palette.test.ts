import { describe, expect, it } from 'vitest';

import { createBrandPalette } from './create-brand-palette';

describe('createBrandPalette', () => {
  it('keeps the base color exactly at the 500 step', () => {
    const { color } = createBrandPalette({ accent: '#8B0000' });
    expect(color?.accent500).toBe('#8B0000');
  });

  it('generates lighter shades below 500 and darker above 500', () => {
    const { color } = createBrandPalette({ primary: '#8B0000' });
    // 50 is near-white-mixed (lightest), 900 is darkest.
    expect(color?.primary50).toBe('#F6EBEB');
    expect(color?.primary900).toBe('#430000');
    // Monotonic-ish: 100 lighter than 500, 700 darker than 500.
    expect(color?.primary100).not.toBe(color?.primary500);
    expect(color?.primary700).not.toBe(color?.primary500);
  });

  it('emits the accent subset (50,100,200,500,600,700) and no 800/900', () => {
    const { color } = createBrandPalette({ accent: '#123456' });
    expect(Object.keys(color ?? {}).sort()).toEqual([
      'accent100',
      'accent200',
      'accent50',
      'accent500',
      'accent600',
      'accent700',
    ]);
  });

  it('emits the full primary scale plus a focus shadow', () => {
    const { color } = createBrandPalette({ primary: '#8B0000' });
    for (const step of [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]) {
      expect(color?.[`primary${step}` as keyof typeof color]).toMatch(/^#[0-9A-F]{6}$/);
    }
    expect(color?.primaryFocusShadow).toBe('rgba(139, 0, 0, 0.1)');
  });

  it('only generates the families it is given', () => {
    const { color } = createBrandPalette({ secondary: '#2196F3' });
    expect(color?.secondary500).toBe('#2196F3');
    expect(color?.accent500).toBeUndefined();
    expect(color?.primary500).toBeUndefined();
  });

  it('accepts shorthand hex and normalizes to 6-digit uppercase', () => {
    const { color } = createBrandPalette({ accent: '#abc' });
    expect(color?.accent500).toBe('#AABBCC');
  });

  it('throws on invalid hex', () => {
    expect(() => createBrandPalette({ accent: 'red' })).toThrow(/invalid hex/);
  });
});
