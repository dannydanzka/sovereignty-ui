/**
 * Alert Component
 *
 * Status alert banner with icon, title, message, and dismiss.
 */

import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from '../../internal/icons';
import type { AlertProps } from './Alert.interfaces';

import {
  AlertBody,
  AlertContainer,
  AlertDismiss,
  AlertIcon,
  AlertMessage,
  AlertTitle,
} from './Alert.styled';

const DEFAULT_ICONS = {
  error: <AlertCircle size={20} />,
  info: <Info size={20} />,
  success: <CheckCircle size={20} />,
  warning: <AlertTriangle size={20} />,
} as const;

/**
 * The live-region role follows the variant, and it matters.
 *
 * `role="alert"` is an ASSERTIVE live region: a screen reader interrupts whatever it is saying. That is
 * right for an error or a warning and wrong for "we sent your link" — a confirmation should wait its
 * turn (`role="status"`, polite). This component used to hardcode `alert` for all four variants, which
 * silently downgraded any consumer that had the distinction right.
 */
const VARIANT_ROLES = {
  error: 'alert',
  info: 'status',
  success: 'status',
  warning: 'alert',
} as const;

export const Alert = ({
  children,
  className,
  icon,
  onDismiss,
  role,
  title,
  variant = 'info',
}: AlertProps) => (
  <AlertContainer
    $variant={variant}
    className={className}
    data-testid='alert'
    role={role ?? VARIANT_ROLES[variant]}
  >
    <AlertIcon $variant={variant}>{icon ?? DEFAULT_ICONS[variant]}</AlertIcon>
    <AlertBody>
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertMessage>{children}</AlertMessage>
    </AlertBody>
    {onDismiss && (
      <AlertDismiss aria-label='Dismiss' onClick={onDismiss}>
        <X size={16} />
      </AlertDismiss>
    )}
  </AlertContainer>
);
