import { afterEach, describe, expect, it } from 'vitest';

import { c, mo, s, tf, ts, tw } from './css-variables.native';
import { resetSuiTokens, setSuiTokens } from './native-values';

describe('native token helpers', () => {
  afterEach(() => {
    resetSuiTokens();
  });

  it('resolves raw px values instead of CSS variables', () => {
    expect(s('md')).toBe('24px');
    expect(ts('sm')).toBe('14px');
    expect(tw('bold')).toBe('700');
    expect(c('white')).toBe('#FFFFFF');
    expect(s('md')).not.toContain('var(');
  });

  it('returns zero-duration motion (no transitions on native)', () => {
    expect(mo('fast')).toBe('0ms');
  });

  it('applies brand overrides through setSuiTokens', () => {
    setSuiTokens({
      color: { primary500: '#8B0000' },
      typography: { family: { body: 'Inter' }, size: { sm: '15px' } },
    });
    expect(c('primary500')).toBe('#8B0000');
    expect(tf('body')).toBe('Inter');
    expect(ts('sm')).toBe('15px');
  });

  it('resets to defaults', () => {
    setSuiTokens({ color: { primary500: '#8B0000' } });
    resetSuiTokens();
    expect(c('primary500')).not.toBe('#8B0000');
  });
});
