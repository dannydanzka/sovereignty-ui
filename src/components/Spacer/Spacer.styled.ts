/**
 * Spacer Styled Components
 */

import styled, { css } from 'styled-components';

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

const getSpacing = (size?: SpacerSize): string => (size ? sizeMap[size] : '0');

export const StyledSpacer = styled.div<StyledSpacerProps>`
  ${({ $horizontal, $isWrapper, $mode, $vertical }) => {
    const verticalValue = getSpacing($vertical);
    const horizontalValue = getSpacing($horizontal);

    if ($isWrapper) {
      if ($mode === 'padding') {
        return css`
          padding: ${$vertical ? verticalValue : '0'} ${$horizontal ? horizontalValue : '0'};
        `;
      }
      return css`
        margin: ${$vertical ? verticalValue : '0'} ${$horizontal ? horizontalValue : '0'};
      `;
    }

    return css`
      display: block;
      height: ${$vertical ? verticalValue : '0'};
      width: ${$horizontal ? horizontalValue : '0'};
    `;
  }}
`;
