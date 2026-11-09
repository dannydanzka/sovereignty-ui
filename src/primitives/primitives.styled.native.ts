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
 * data-testid: className is ignored, and data-testid becomes `testID`, the iOS accessibility identifier and
 * Android resource-id that E2E drivers (Maestro, Detox) select by.
 *
 * TextField keyboard: an explicit `inputMode` wins over the `type` mapping, so a
 * text field can ask for a numeric keypad without pretending to be a number
 * input. `type="date"` has no native picker — it degrades to a text field with a
 * numbers-and-punctuation keyboard; use `Calendar` for a real native picker.
 */

import { TextInput, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

import type {
  PressablePrimitiveProps,
  TextFieldPrimitiveProps,
  WebCompatProps,
} from './primitives.interfaces';

const KEYBOARD_TYPE = {
  date: 'numbers-and-punctuation',
  email: 'email-address',
  number: 'numeric',
  password: 'default',
  tel: 'phone-pad',
  text: 'default',
} as const;

const INPUT_MODE_KEYBOARD_TYPE = {
  decimal: 'decimal-pad',
  email: 'email-address',
  numeric: 'number-pad',
  search: 'default',
  tel: 'phone-pad',
  text: 'default',
  url: 'url',
} as const;

/** Web-only DOM attributes with no TextInput equivalent — dropped on native. */
const WEB_ONLY_PROPS = ['max', 'min', 'step'];

const testIdAttrs = (props: WebCompatProps) => ({ testID: props['data-testid'] });

export const Div = styled.View.attrs<WebCompatProps>(testIdAttrs)<WebCompatProps>``;

export const Span = styled.Text.attrs<WebCompatProps>(testIdAttrs)<WebCompatProps>``;

export const Pressable = styled(TouchableOpacity).attrs<PressablePrimitiveProps>((props) => ({
  accessibilityLabel: props['aria-label'],
  accessibilityRole: 'button',
  activeOpacity: props.onClick ? 0.7 : 1,
  disabled: props.disabled || !props.onClick,
  onPress: props.onClick ? () => props.onClick?.() : undefined,
  testID: props['data-testid'],
}))<PressablePrimitiveProps>``;

export const TextField = styled(TextInput)
  .withConfig({
    shouldForwardProp: (prop) => !WEB_ONLY_PROPS.includes(prop),
  })
  .attrs<TextFieldPrimitiveProps>((props) => ({
    editable: props.disabled === undefined ? undefined : !props.disabled,
    keyboardType: props.inputMode
      ? INPUT_MODE_KEYBOARD_TYPE[props.inputMode]
      : props.type
        ? KEYBOARD_TYPE[props.type]
        : undefined,
    multiline: props.multiline,
    numberOfLines: props.rows,
    onChangeText: props.onValueChange,
    secureTextEntry: props.secureTextEntry,
    testID: props['data-testid'],
  }))<TextFieldPrimitiveProps>``;
