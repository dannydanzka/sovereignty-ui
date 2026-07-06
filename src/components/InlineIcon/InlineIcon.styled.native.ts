/**
 * InlineIcon Styled Components — React Native resolution
 *
 * Div (View) with directional margins; vertical-align does not exist on RN —
 * place InlineIcon inside a flex-row container to align with text.
 */

import styled from 'styled-components/native';

import { Div } from '../../primitives';
import { s } from '../../tokens/css-variables';
import type { StyledInlineIconProps } from './InlineIcon.interfaces';

export const StyledInlineIcon = styled(Div)<StyledInlineIconProps>`
  margin-bottom: ${({ $position, $tight }) =>
    $position === 'top' ? s($tight ? 'micro' : 'xs') : '0px'};
  margin-right: ${({ $position, $tight }) =>
    $position === 'left' ? s($tight ? 'micro' : 'xs') : '0px'};
`;
