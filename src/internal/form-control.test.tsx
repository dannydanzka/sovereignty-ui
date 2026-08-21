/**
 * The regression floor for the shared form-control metric.
 *
 * The defect this closes was measured in a consumer's admin: an `Input` and a `Select` side by side
 * in one row rendered **55px / 16px / 2px** against **35px / 14px / 1px**. Four components each
 * owned their own copy of that decision, so the fix is that there is now ONE copy — and the way to
 * keep it one is to assert that they still agree, rather than to assert any particular number.
 *
 * Note what is deliberately NOT asserted: the pixel values. Pinning `14px` here would make every
 * future density decision fail this file for the wrong reason; what must never come back is the
 * DISAGREEMENT.
 */

import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Textarea } from '../components/Textarea';

/**
 * Only the three properties jsdom actually resolves. **Padding is deliberately absent**: it is set
 * through the `padding` shorthand, which jsdom does not expand, so reading `paddingTop` returns an
 * empty string and `expect('').toBe('')` would pass no matter how far the two controls diverged.
 * An assertion that cannot fail is worse than no assertion — padding is guarded by there being one
 * `FORM_CONTROL_SIZES` map, not by this file.
 */
const metricsOf = (element: HTMLElement) => {
  const style = getComputedStyle(element);
  return {
    borderWidth: style.borderTopWidth,
    fontSize: style.fontSize,
    minHeight: style.minHeight,
  };
};

describe('shared form-control metric', () => {
  it('renders an Input and a Select with the same frame and size', () => {
    render(
      <>
        <Input id='name' label='Name' name='name' />
        <Select id='kind' label='Kind' name='kind' options={[{ label: 'One', value: '1' }]} />
      </>
    );

    const input = metricsOf(screen.getByLabelText('Name'));
    const select = metricsOf(screen.getByLabelText('Kind'));

    expect(input.borderWidth).toBe(select.borderWidth);
    expect(input.fontSize).toBe(select.fontSize);
    expect(input.minHeight).toBe(select.minHeight);
  });

  it('puts a Textarea on the same frame as an Input', () => {
    render(
      <>
        <Input id='name' label='Name' name='name' />
        <Textarea id='notes' label='Notes' name='notes' />
      </>
    );

    const input = metricsOf(screen.getByLabelText('Name'));
    const textarea = metricsOf(screen.getByLabelText('Notes'));

    expect(input.borderWidth).toBe(textarea.borderWidth);
    expect(input.fontSize).toBe(textarea.fontSize);
  });

  it('moves an Input up and down the shared scale with `size`', () => {
    render(
      <>
        <Input id='small' label='Small' name='small' size='sm' />
        <Input id='large' label='Large' name='large' size='lg' />
      </>
    );

    const small = metricsOf(screen.getByLabelText('Small'));
    const large = metricsOf(screen.getByLabelText('Large'));

    expect(small.fontSize).not.toBe(large.fontSize);
    expect(small.minHeight).not.toBe(large.minHeight);
  });

  it('sizes an Input like a Select asked for the same step', () => {
    render(
      <>
        <Input id='name' label='Name' name='name' size='lg' />
        <Select
          id='kind'
          label='Kind'
          name='kind'
          options={[{ label: 'One', value: '1' }]}
          size='lg'
        />
      </>
    );

    expect(metricsOf(screen.getByLabelText('Name')).minHeight).toBe(
      metricsOf(screen.getByLabelText('Kind')).minHeight
    );
  });
});
