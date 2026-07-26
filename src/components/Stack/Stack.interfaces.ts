/**
 * Stack Interfaces
 */

import type { ReactNode } from 'react';

import type { SpacingToken } from '../../tokens';

export type StackAlign = 'baseline' | 'center' | 'end' | 'start' | 'stretch';

export type StackDirection = 'column' | 'row';

export type StackJustify = 'between' | 'center' | 'end' | 'start';

export interface StackProps {
  align?: StackAlign;
  children?: ReactNode;
  className?: string;
  direction?: StackDirection;
  /** Spacing token between children. Default `md`. */
  gap?: SpacingToken;
  justify?: StackJustify;
  /** Row stacks that must wrap on narrow viewports. Ignored for `column`. */
  wrap?: boolean;
}

export interface StyledStackProps {
  $align?: StackAlign;
  $direction: StackDirection;
  $gap: SpacingToken;
  $justify?: StackJustify;
  $wrap?: boolean;
}
