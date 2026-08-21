/**
 * SearchInput Styled Components
 */

import styled from 'styled-components';

import { FORM_CONTROL_SIZES, formControlFrame } from '../../internal/form-control';
import { s, tf } from '../../tokens/css-variables';
import { TextField } from '../../primitives';

export const FilterBar = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: ${s('sm')};
  margin-bottom: ${s('md')};
`;

/** `$hasError` comes with the shared frame; the search field has no error state of its own yet. */
export const StyledSearchInput = styled(TextField)<{ $hasError?: boolean }>`
  ${formControlFrame}
  ${FORM_CONTROL_SIZES.md}
  flex: 1;
  font-family: ${tf('body')};
  min-width: 200px;
`;
