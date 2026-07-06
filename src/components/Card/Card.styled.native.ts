/**
 * Card Styled Components — React Native resolution
 *
 * Built on the Pressable primitive (TouchableOpacity): it maps the shared
 * `onClick` prop to `onPress` and disables the touch feedback when the card is
 * not clickable, so the shared Card.tsx passes `onClick` unchanged. No
 * hover/transition on native; the elevation token resolves to a native shadow.
 */

import styled from 'styled-components/native';

import { c, el, s } from '../../tokens/css-variables';
import { Pressable } from '../../primitives';

const getPaddingStyles = (padding: 'large' | 'medium' | 'none' | 'small') => {
  switch (padding) {
    case 'none':
      return '0px';
    case 'small':
      return s('sm');
    case 'medium':
      return s('md');
    case 'large':
      return s('lg');
  }
};

export const StyledCard = styled(Pressable)<{
  $clickable?: boolean;
  $padding: 'large' | 'medium' | 'none' | 'small';
}>`
  background-color: ${c('white')};
  border-radius: 12px;
  box-shadow: ${el('sm')};
  padding: ${({ $padding }) => getPaddingStyles($padding)};
`;
