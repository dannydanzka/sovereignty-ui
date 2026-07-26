/** PageHeader props. */

import type { ReactNode } from 'react';

export interface PageHeaderProps {
  /** Right-hand slot: the screen's primary CTA, a filter, a menu. */
  actions?: ReactNode;
  className?: string;
  /** One line under the title. Plain text so the pattern owns its typography. */
  description?: string;
  /**
   * The title itself, as a node — a product may style its own heading (brand colour, scale) while
   * this pattern keeps owning the layout. Pass a string to get the library `PageTitle`.
   */
  title: ReactNode;
}
