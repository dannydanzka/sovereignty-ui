/**
 * FormActions Styled Components
 */

import styled from 'styled-components';

import { spacing } from '../../tokens';
import type { StyledFormActionsProps } from './FormActions.interfaces';

const alignMap = {
  center: 'center',
  left: 'flex-start',
  right: 'flex-end',
} as const;

export const StyledFormActions = styled.div<StyledFormActionsProps>`
  display: flex;
  gap: ${spacing.sm};
  justify-content: ${({ $align }) => alignMap[$align]};
  margin-top: ${spacing.md};
`;
