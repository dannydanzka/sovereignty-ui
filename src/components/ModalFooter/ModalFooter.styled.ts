/**
 * ModalFooter Styled Components
 */

import styled from 'styled-components';

import { spacing } from '../../tokens';
import type { StyledModalFooterProps } from './ModalFooter.interfaces';

const alignMap = {
  left: 'flex-start',
  right: 'flex-end',
  'space-between': 'space-between',
} as const;

export const StyledModalFooter = styled.div<StyledModalFooterProps>`
  display: flex;
  gap: ${spacing.sm};
  justify-content: ${({ $align }) => alignMap[$align]};
  margin-top: ${spacing.md};
`;
