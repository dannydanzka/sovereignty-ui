/**
 * StatItem, StatsBar, StatsGrid
 *
 * Compact stat display with color-coded variants.
 * StatsBar: horizontal flex layout for inline stats.
 * StatsGrid: responsive grid layout for stat cards.
 */

import type { StatItemProps, StatsBarProps, StatsGridProps } from './StatItem.interfaces';

import {
  StatContent,
  StatIconWrapper,
  StatLabel,
  StatValue,
  StyledStatItem,
  StyledStatsBar,
  StyledStatsGrid,
} from './StatItem.styled';

export const StatItem = ({ className, icon, label, value, variant = 'default' }: StatItemProps) => (
  <StyledStatItem $variant={variant} className={className}>
    {icon && <StatIconWrapper>{icon}</StatIconWrapper>}
    <StatContent>
      <StatLabel>{label}</StatLabel>
      <StatValue>{value}</StatValue>
    </StatContent>
  </StyledStatItem>
);

export const StatsBar = ({ children, className }: StatsBarProps) => (
  <StyledStatsBar className={className}>{children}</StyledStatsBar>
);

export const StatsGrid = ({ children, className, columns = 4 }: StatsGridProps) => (
  <StyledStatsGrid $columns={columns} className={className}>
    {children}
  </StyledStatsGrid>
);
