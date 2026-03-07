/**
 * Alert Styled Components
 */

import styled from 'styled-components';

import { color, shape, spacing, typography } from '../../tokens';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

const VARIANT_COLORS: Record<AlertVariant, { bg: string; border: string; icon: string }> = {
  error: { bg: color.errorBackground, border: color.errorBorder, icon: color.error },
  info: { bg: color.secondary50, border: color.secondary200, icon: color.info },
  success: { bg: color.successBackground, border: color.successLight, icon: color.success },
  warning: { bg: color.warningBackground, border: color.warningLight, icon: color.warning },
};

export const AlertContainer = styled.div<{ $variant: AlertVariant }>`
  border: 1px solid ${({ $variant }) => VARIANT_COLORS[$variant].border};
  border-left: 4px solid ${({ $variant }) => VARIANT_COLORS[$variant].icon};
  border-radius: ${shape.md};
  background-color: ${({ $variant }) => VARIANT_COLORS[$variant].bg};
  display: flex;
  gap: ${spacing.sm};
  padding: ${spacing.sm} ${spacing.md};
`;

export const AlertIcon = styled.div<{ $variant: AlertVariant }>`
  color: ${({ $variant }) => VARIANT_COLORS[$variant].icon};
  flex-shrink: 0;
  margin-top: 2px;
`;

export const AlertBody = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: ${spacing.micro};
`;

export const AlertTitle = styled.strong`
  color: ${color.textPrimary};
  font-family: ${typography.family.body};
  font-size: ${typography.size.sm};
  font-weight: ${typography.weight.semibold};
`;

export const AlertMessage = styled.div`
  color: ${color.textSecondary};
  font-family: ${typography.family.body};
  font-size: ${typography.size.sm};
  line-height: ${typography.leading.relaxed};
`;

export const AlertDismiss = styled.button`
  background: none;
  border: none;
  color: ${color.textTertiary};
  cursor: pointer;
  flex-shrink: 0;
  padding: 0;
  transition: color 0.15s ease;

  &:hover {
    color: ${color.textPrimary};
  }
`;
