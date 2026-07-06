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

import type { ChangeEvent } from 'react';
import styled from 'styled-components';

import type { PressablePrimitiveProps, TextFieldPrimitiveProps } from './primitives.interfaces';

const TEXT_FIELD_INTERNAL_PROPS = ['multiline', 'onValueChange', 'secureTextEntry'];

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

export const TextField = styled.input
  .withConfig({
    shouldForwardProp: (prop) => !TEXT_FIELD_INTERNAL_PROPS.includes(prop),
  })
  .attrs<TextFieldPrimitiveProps>((props) => ({
    as: props.multiline ? 'textarea' : undefined,
    onChange: (event: ChangeEvent<HTMLInputElement>) =>
      props.onValueChange?.(event.currentTarget.value),
    type: props.multiline
      ? undefined
      : props.secureTextEntry
        ? 'password'
        : props.type === 'password'
          ? 'text'
          : (props.type ?? 'text'),
  }))<TextFieldPrimitiveProps>`
  font-family: inherit;
`;
