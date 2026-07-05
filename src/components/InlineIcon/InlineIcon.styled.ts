/**
 * InlineIcon Styled Components
 *
 * Aligns an icon with surrounding text without inline styles.
 * left = gap to the right of the icon | top = gap below (stacked over a value).
 * tight = compact gap for small badges/meta rows.
 */

import styled from 'styled-components';

import { s } from '../../tokens/css-variables';
import type { StyledInlineIconProps } from './InlineIcon.interfaces';

export const StyledInlineIcon = styled.span<StyledInlineIconProps>`
  display: inline-flex;
  margin-bottom: ${({ $position, $tight }) =>
    $position === 'top' ? s($tight ? 'micro' : 'xs') : '0'};
  margin-right: ${({ $position, $tight }) =>
    $position === 'left' ? s($tight ? 'micro' : 'xs') : '0'};
  vertical-align: middle;
`;
