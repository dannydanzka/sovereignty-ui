import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { Stack } from './Stack';

describe('Stack', () => {
  it('stacks children in a column with token spacing by default', () => {
    render(
      <Stack>
        <span>uno</span>
        <span>dos</span>
      </Stack>
    );
    const stack = screen.getByTestId('stack');
    expect(stack).toHaveStyle({ display: 'flex', flexDirection: 'column' });
    expect(stack).toHaveStyle({ gap: 'var(--sui-spacing-md, 1.5rem)' });
  });

  it('lays out a row and only wraps when asked', () => {
    const { rerender } = render(
      <Stack direction='row'>
        <span>uno</span>
      </Stack>
    );
    expect(screen.getByTestId('stack')).not.toHaveStyle({ flexWrap: 'wrap' });

    rerender(
      <Stack direction='row' wrap>
        <span>uno</span>
      </Stack>
    );
    expect(screen.getByTestId('stack')).toHaveStyle({ flexWrap: 'wrap' });
  });

  it('ignores wrap on a column, where it would only hide overflow bugs', () => {
    render(
      <Stack wrap>
        <span>uno</span>
      </Stack>
    );
    expect(screen.getByTestId('stack')).not.toHaveStyle({ flexWrap: 'wrap' });
  });

  it('maps align and justify to their flex values', () => {
    render(
      <Stack align='center' justify='between'>
        <span>uno</span>
      </Stack>
    );
    expect(screen.getByTestId('stack')).toHaveStyle({
      alignItems: 'center',
      justifyContent: 'space-between',
    });
  });
});
