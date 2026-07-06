/**
 * Platform Primitives — web resolution
 *
 * The cross-platform building blocks of every shared component:
 *   Div      → <div>    on web, <View> on native (flexbox column by default, like Yoga)
 *   Span     → <span>   on web, <Text> on native (all raw text must live inside one)
 *   Pressable→ <button> on web, <TouchableOpacity> on native (onClick ↔ onPress)
 *
 * Philosophy: one component for web and mobile — write layout with flexbox
 * only, put every text node inside a Span, every tap target on a Pressable, and
 * styled(Div)/styled(Span)/styled(Pressable) everywhere instead of raw elements.
 *
 * Metro resolves primitives.native.ts instead of this file for React Native.
 */

import styled from 'styled-components';

import type { PressablePrimitiveProps } from './primitives.interfaces';

export const Div = styled.div`
  align-items: stretch;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
`;

export const Span = styled.span``;

export const Pressable = styled.button.attrs<PressablePrimitiveProps>((props) => ({
  type: props.type ?? 'button',
}))<PressablePrimitiveProps>`
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  padding: 0;

  &:disabled {
    cursor: not-allowed;
  }
`;
