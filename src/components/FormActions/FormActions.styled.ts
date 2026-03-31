/**
 * FormActions Styled Components
 */

import styled from 'styled-components';

import { s } from '../../tokens/css-variables';
import type { StyledFormActionsProps } from './FormActions.interfaces';

const alignMap = {
  center: 'center',
  left: 'flex-start',
  right: 'flex-end',
} as const;

export const StyledFormActions = styled.div<StyledFormActionsProps>`
  display: flex;
  gap: ${s('sm')};
  justify-content: ${({ $align }) => alignMap[$align]};
  margin-top: ${s('md')};
`;
