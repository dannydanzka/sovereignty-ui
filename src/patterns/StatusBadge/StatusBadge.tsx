/**
 * StatusBadge
 *
 * The binary active/inactive state of a record, as a `Badge` with a fixed colour pair. Any list that
 * shows "enabled or not" should use this rather than pick its own green/amber, so the same state
 * never reads as a different colour between two screens.
 */

import { Badge } from '../../components/Badge';
import type { StatusBadgeProps } from './StatusBadge.interfaces';

export const StatusBadge = ({
  activeLabel = 'Active',
  className,
  inactiveLabel = 'Inactive',
  isActive,
}: StatusBadgeProps) => (
  <Badge className={className} size='sm' variant={isActive ? 'success' : 'warning'}>
    {isActive ? activeLabel : inactiveLabel}
  </Badge>
);
