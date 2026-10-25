/**
 * Swatches and bars resolved through the native token helpers, so a brand override shows here.
 */

import styled from 'styled-components/native';

import { c, Div, s, sh } from '@dannydanzka/sovereignty-ui';

import type { SpacingBarProps, SwatchProps } from './TokensDemo.interfaces';

export const Swatch = styled(Div)<SwatchProps>`
  background-color: ${({ $color }) => c($color)};
  border-radius: ${sh('md')};
  height: ${s('lg')};
  width: ${s('lg')};
`;

export const SpacingBar = styled(Div)<SpacingBarProps>`
  background-color: ${c('primary500')};
  height: ${s('xs')};
  width: ${({ $size }) => s($size)};
`;
