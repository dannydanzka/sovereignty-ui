/**
 * Spacer Styled Components — React Native resolution
 *
 * Same API as Spacer.styled.ts built on the Div primitive (View). RN-safe:
 * no `display: block` (View layout already behaves as a sized box).
 */

import styled, { css } from 'styled-components/native';

import { Div } from '../../primitives';
import { s } from '../../tokens/css-variables';
import type { SpacerSize, StyledSpacerProps } from './Spacer.interfaces';

const sizeMap: Record<SpacerSize, string> = {
  '2xl': s('2xl'),
  '3xl': s('3xl'),
  lg: s('lg'),
  md: s('md'),
  sm: s('sm'),
  xl: s('xl'),
  xs: s('xs'),
};

const getSpacing = (size?: SpacerSize): string => (size ? sizeMap[size] : '0px');

export const StyledSpacer = styled(Div)<StyledSpacerProps>`
  ${({ $horizontal, $isWrapper, $mode, $vertical }) => {
    const verticalValue = getSpacing($vertical);
    const horizontalValue = getSpacing($horizontal);

    if ($isWrapper) {
      if ($mode === 'padding') {
        return css`
          padding: ${$vertical ? verticalValue : '0px'} ${$horizontal ? horizontalValue : '0px'};
        `;
      }
      return css`
        margin: ${$vertical ? verticalValue : '0px'} ${$horizontal ? horizontalValue : '0px'};
      `;
    }

    return css`
      height: ${$vertical ? verticalValue : '0px'};
      width: ${$horizontal ? horizontalValue : '0px'};
    `;
  }}
`;
