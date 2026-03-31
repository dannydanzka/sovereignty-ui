import { describe, expect, it } from 'vitest';

import { injectSuiTokens } from './inject';

describe('injectSuiTokens', () => {
  it('generates CSS variable declarations with defaults', () => {
    const result = injectSuiTokens();

    expect(result).toContain('--sui-text-primary:');
    expect(result).toContain('--sui-primary-500:');
    expect(result).toContain('--sui-spacing-md:');
    expect(result).toContain('--sui-font-family-body:');
    expect(result).toContain('--sui-font-size-sm:');
    expect(result).toContain('--sui-font-weight-bold:');
    expect(result).toContain('--sui-shape-md:');
    expect(result).toContain('--sui-elevation-md:');
    expect(result).toContain('--sui-motion-normal:');
  });

  it('applies color overrides', () => {
    const result = injectSuiTokens({
      color: { primary500: '#FF0000' },
    });

    expect(result).toContain('--sui-primary-500: #FF0000;');
  });

  it('applies typography family overrides', () => {
    const result = injectSuiTokens({
      typography: { family: { body: 'Comic Sans MS' } },
    });

    expect(result).toContain('--sui-font-family-body: Comic Sans MS;');
  });

  it('returns a string with all token categories', () => {
    const result = injectSuiTokens();

    expect(result).toContain('--sui-leading-');
    expect(result).toContain('--sui-tracking-');
  });

  it('generates valid CSS syntax (key: value;)', () => {
    const result = injectSuiTokens();
    const lines = result.split('\n').filter((line) => line.trim().length > 0);

    for (const line of lines) {
      expect(line.trim()).toMatch(/^--sui-[\w-]+:\s*.+;$/);
    }
  });
});
