/** Form props. */

import type { FormHTMLAttributes, ReactNode } from 'react';

import type { SpacingToken } from '../../tokens';

export interface FormProps extends Omit<FormHTMLAttributes<HTMLFormElement>, 'children'> {
  children?: ReactNode;
  className?: string;
  /** Spacing token between fields. Default `md`. */
  gap?: SpacingToken;
}

export interface StyledFormProps {
  $gap: SpacingToken;
}
