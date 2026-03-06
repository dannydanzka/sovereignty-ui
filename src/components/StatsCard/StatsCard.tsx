/**
 * StatsCard Component
 *
 * Displays a stat value with label, optional icon and sublabel.
 * Variants: default (white), primary (gradient), success (green), warning (orange).
 */

import type { StatsCardProps } from './StatsCard.interfaces';

import { CardContainer, CardIcon, CardLabel, CardSublabel, CardValue } from './StatsCard.styled';

export const StatsCard = ({
  className,
  icon,
  label,
  sublabel,
  value,
  variant = 'default',
}: StatsCardProps) => (
  <CardContainer $variant={variant} className={className}>
    {icon && <CardIcon $variant={variant}>{icon}</CardIcon>}
    <CardValue $variant={variant}>{value}</CardValue>
    <CardLabel $variant={variant}>{label}</CardLabel>
    {sublabel && <CardSublabel $variant={variant}>{sublabel}</CardSublabel>}
  </CardContainer>
);
