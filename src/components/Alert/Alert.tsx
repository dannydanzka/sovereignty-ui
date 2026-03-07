/**
 * Alert Component
 *
 * Status alert banner with icon, title, message, and dismiss.
 */

import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';

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

export const Alert = ({
  children,
  className,
  icon,
  onDismiss,
  title,
  variant = 'info',
}: AlertProps) => (
  <AlertContainer $variant={variant} className={className} data-testid='alert' role='alert'>
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
