/**
 * Input
 *
 * Text input with label, error state, and optional password visibility toggle.
 */

import type { ChangeEvent } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useCallback, useState } from 'react';

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

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(event.target.value);
      }
    },
    [onChange]
  );

  const handleTogglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const inputType = isPassword && showPassword ? 'text' : type;

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
          type={inputType}
          value={value}
          onChange={handleChange}
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
