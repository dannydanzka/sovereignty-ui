/**
 * Platform Primitives — React Native resolution
 *
 * Div → View, Span → Text, Pressable → TouchableOpacity. View already defaults
 * to flex-direction: column (Yoga), matching the web Div defaults, so shared
 * styled(Div) declarations lay out identically on both platforms.
 *
 * Pressable maps the web `onClick`/`disabled` props to TouchableOpacity's
 * `onPress`/`disabled`, so shared component files keep passing `onClick`
 * unchanged. WebCompatProps lets shared files keep passing className and
 * data-testid; React Native simply ignores them at runtime.
 */

import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

import type { PressablePrimitiveProps, WebCompatProps } from './primitives.interfaces';

export const Div = styled.View<WebCompatProps>``;

export const Span = styled.Text<WebCompatProps>``;

export const Pressable = styled(TouchableOpacity).attrs<PressablePrimitiveProps>((props) => ({
  accessibilityLabel: props['aria-label'],
  accessibilityRole: 'button',
  activeOpacity: props.onClick ? 0.7 : 1,
  disabled: props.disabled || !props.onClick,
  onPress: props.onClick ? () => props.onClick?.() : undefined,
}))<PressablePrimitiveProps>``;
