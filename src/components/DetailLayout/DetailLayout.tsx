/**
 * DetailLayout
 *
 * Composable layout primitives for detail views (modals, panels, pages).
 * Provides consistent styling for labels, values, rows, amounts, and content boxes.
 */

import { DETAIL_AMOUNT_SIZE_LARGE } from './DetailLayout.constants';
import type {
  DetailAmountProps,
  DetailContentBoxProps,
  DetailDividerProps,
  DetailLabelProps,
  DetailRowProps,
  DetailSectionProps,
  DetailValueProps,
} from './DetailLayout.interfaces';

import {
  DetailAmountLargeText,
  DetailAmountText,
  DetailContentBoxWrapper,
  DetailDividerLine,
  DetailLabelText,
  DetailRowGrid,
  DetailSectionWrapper,
  DetailValueMonoText,
  DetailValueText,
} from './DetailLayout.styled';

export const DetailSection = ({ children, className }: DetailSectionProps) => (
  <DetailSectionWrapper className={className}>{children}</DetailSectionWrapper>
);

export const DetailLabel = ({ children, className }: DetailLabelProps) => (
  <DetailLabelText className={className}>{children}</DetailLabelText>
);

export const DetailValue = ({ children, className, mono = false }: DetailValueProps) =>
  mono ? (
    <DetailValueMonoText className={className}>{children}</DetailValueMonoText>
  ) : (
    <DetailValueText className={className}>{children}</DetailValueText>
  );

export const DetailRow = ({ children, className, columns = 2 }: DetailRowProps) => (
  <DetailRowGrid $columns={columns} className={className}>
    {children}
  </DetailRowGrid>
);

export const DetailDivider = ({ className }: DetailDividerProps) => (
  <DetailDividerLine className={className} />
);

export const DetailAmount = ({ children, className, size = 'default' }: DetailAmountProps) =>
  size === DETAIL_AMOUNT_SIZE_LARGE ? (
    <DetailAmountLargeText className={className}>{children}</DetailAmountLargeText>
  ) : (
    <DetailAmountText className={className}>{children}</DetailAmountText>
  );

export const DetailContentBox = ({
  children,
  className,
  variant = 'default',
}: DetailContentBoxProps) => (
  <DetailContentBoxWrapper $variant={variant} className={className}>
    {children}
  </DetailContentBoxWrapper>
);
