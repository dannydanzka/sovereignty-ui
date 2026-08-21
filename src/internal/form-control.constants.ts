/**
 * Form control constants — the size scale `Input`, `Select`, `Textarea` and `SearchInput` share.
 *
 * The values are the ones the majority of them already used, so aligning the outlier (`Input`)
 * changed `Input` and left the others rendering exactly as before. See `form-control.ts` for why
 * this is one definition instead of four.
 */

import { css } from 'styled-components';

import { s, ts } from '../tokens/css-variables';

export const FORM_CONTROL_SIZES = {
  lg: css`
    font-size: ${ts('base')};
    min-height: ${s('lg')};
    padding: ${s('xs')} ${s('md')};
  `,
  md: css`
    font-size: ${ts('sm')};
    min-height: ${s('md')};
    padding: ${s('xs')} ${s('sm')};
  `,
  sm: css`
    font-size: ${ts('xs')};
    min-height: ${s('sm')};
    padding: ${s('micro')} ${s('sm')};
  `,
} as const;
