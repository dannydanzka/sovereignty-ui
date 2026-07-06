/**
 * Input
 *
 * Text input with label, error state, and optional password visibility toggle.
 */

import { useCallback, useState } from 'react';

import { Eye, EyeOff } from '../../internal/icons';
import type { InputProps } from './Input.interfaces';

import {
  InputContainer,
  InputError,
  InputLabel,
  InputRequired,
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
  label,
  name,
  onChange,
  placeholder,
  required = false,
  showPasswordLabel = 'Show password',
  type = 'text',
  value,
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  const handleTogglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

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
          $hasError={Boolean(error)}
          $hasToggle={isPassword}
          autoComplete={autoComplete}
          disabled={disabled}
          id={id}
          name={name}
          placeholder={placeholder}
          required={required}
          secureTextEntry={isPassword && !showPassword}
          type={type}
          value={value}
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

      {error && <InputError>{error}</InputError>}
    </InputWrapper>
  );
};
