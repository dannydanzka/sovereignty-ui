/**
 * Input
 *
 * Text input with label, error state, character counter, and optional password visibility toggle.
 *
 * The counter contract mirrors `Textarea` on purpose (`maxLength` + `showCount`, footer with the
 * error on the left and `current/max` on the right) so a form does not change shape depending on
 * which field type it uses.
 *
 * Dates and numbers are types of this same field, not separate components: `type="date"` (with
 * `min`/`max` for a range) and `type="number"` (with `min`/`max`/`step`) keep the label, error and
 * footer identical to a text field, which is why a form never needs to hand-roll one. Those bounds
 * are browser hints — the schema still owns validation. On native, `date` has no picker and
 * degrades to a text field; use `Calendar` there.
 */

import { useCallback, useState } from 'react';

import { Eye, EyeOff } from '../../internal/icons';
import type { InputProps } from './Input.interfaces';

import {
  InputContainer,
  InputCount,
  InputError,
  InputFooter,
  InputLabel,
  InputRequired,
  InputSpacer,
  InputWrapper,
  PasswordToggle,
  StyledInput,
} from './Input.styled';

export const Input = ({
  autoComplete,
  disabled = false,
  error,
  fullWidth = false,
  hidePasswordLabel = 'Hide password',
  id,
  inputMode,
  label,
  max,
  maxLength,
  min,
  name,
  onBlur,
  onChange,
  placeholder,
  required = false,
  showCount = false,
  showPasswordLabel = 'Show password',
  step,
  type = 'text',
  value,
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const currentLength = value?.length ?? 0;
  const isOver = maxLength ? currentLength > maxLength : false;
  const hasCounter = showCount && Boolean(maxLength);
  const hasFooter = Boolean(error) || hasCounter;

  const handleTogglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const renderFooter = () => (
    <InputFooter>
      {error ? <InputError>{error}</InputError> : <InputSpacer />}
      {hasCounter && (
        <InputCount $isOver={isOver}>
          {currentLength}/{maxLength}
        </InputCount>
      )}
    </InputFooter>
  );

  return (
    <InputWrapper $fullWidth={fullWidth}>
      {label && (
        <InputLabel htmlFor={id}>
          {label}
          {required && <InputRequired>*</InputRequired>}
        </InputLabel>
      )}

      <InputContainer>
        <StyledInput
          $hasError={Boolean(error) || isOver}
          $hasToggle={isPassword}
          autoComplete={autoComplete}
          disabled={disabled}
          id={id}
          inputMode={inputMode}
          max={max}
          maxLength={maxLength}
          min={min}
          name={name}
          placeholder={placeholder}
          required={required}
          secureTextEntry={isPassword && !showPassword}
          step={step}
          type={type}
          value={value}
          onBlur={onBlur}
          onValueChange={onChange}
        />
        {isPassword && (
          <PasswordToggle
            aria-label={showPassword ? hidePasswordLabel : showPasswordLabel}
            type='button'
            onClick={handleTogglePassword}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </PasswordToggle>
        )}
      </InputContainer>

      {hasFooter && renderFooter()}
    </InputWrapper>
  );
};
