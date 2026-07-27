/** Form Styled Components */

import styled from 'styled-components';

import { s } from '../../tokens/css-variables';
import type { StyledFormProps } from './Form.interfaces';

/**
 * `max-height` / `overflow` are vars, not props: a form inside a modal has to scroll, and the value is
 * a layout decision belonging to that modal — not something this pattern should enumerate. Default is
 * `none` / `visible`, so a form in normal page flow is unaffected.
 */
export const StyledForm = styled.form<StyledFormProps>`
  display: flex;
  flex-direction: column;
  gap: ${({ $gap }) => s($gap)};
  max-height: var(--sui-form-max-height, none);
  overflow-y: var(--sui-form-overflow-y, visible);
`;
