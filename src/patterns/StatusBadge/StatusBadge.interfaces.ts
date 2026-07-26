/** StatusBadge props. */

export interface StatusBadgeProps {
  /** Label for the active state. Default `'Active'`. */
  activeLabel?: string;
  className?: string;
  /** Label for the inactive state. Default `'Inactive'`. */
  inactiveLabel?: string;
  isActive: boolean;
}
