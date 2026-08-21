/**
 * Form control frame — ONE definition of what a form control looks like.
 *
 * Why this exists: `Input`, `Select`, `Textarea` and `SearchInput` each owned their own height,
 * font size, padding, border and focus treatment. Three of them happened to agree and `Input` did
 * not, so an `Input` and a `Select` side by side in one `FormGrid` row visibly misaligned —
 * measured in a consumer's admin at 1512px: **55px / 16px / 2px** against **35px / 14px / 1px**.
 * Four private copies of the same decision means the next divergence is a matter of time, so the
 * decision lives here and the components consume it.
 *
 * The size scale is in `form-control.constants.ts`; the regression floor is `form-control.test.tsx`,
 * which asserts that the controls AGREE rather than asserting any particular number — pinning the
 * pixels would make every future density decision fail for the wrong reason.
 *
 * Internal on purpose — not exported from any barrel. Consumers theme through `--sui-*` tokens.
 */

import { css } from 'styled-components';

import { c, sh } from '../tokens/css-variables';

export { FORM_CONTROL_SIZES } from './form-control.constants';
export type { FormControlSize } from './form-control.interfaces';

/**
 * Frame and states. A control that misses this fragment is a control whose focus ring, hover and
 * disabled treatment will drift from its neighbour's — which is the same defect as the metrics,
 * one layer up.
 */
export const formControlFrame = css<{ $hasError?: boolean }>`
  background-color: ${c('white')};
  /*
   * Longhand, not the border shorthand, and deliberately so: jsdom does not expand shorthands, so
   * a computed-style test can read border-top-width but never border. Written this way the
   * "these two controls agree" invariant is checkable in form-control.test.tsx instead of being a
   * claim in a comment. (It is also what the native styling rules require.)
   */
  border-color: ${({ $hasError }) => ($hasError ? c('error') : c('border'))};
  border-radius: ${sh('md')};
  border-style: solid;
  border-width: 1px;
  color: ${c('textPrimary')};
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &::placeholder {
    color: ${c('textTertiary')};
  }

  &:hover:not(:disabled) {
    border-color: ${({ $hasError }) => ($hasError ? c('errorDark') : c('borderDark'))};
  }

  &:focus,
  &:focus-visible {
    border-color: ${({ $hasError }) => ($hasError ? c('error') : c('primary500'))};
    box-shadow: 0 0 0 3px
      ${({ $hasError }) => ($hasError ? c('errorFocusShadow') : c('primaryFocusShadow'))};
    outline: none;
  }

  &:disabled {
    background-color: ${c('neutral50')};
    color: ${c('textDisabled')};
    cursor: not-allowed;
  }
`;
