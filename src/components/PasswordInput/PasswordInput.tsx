/**
 * PasswordInput
 */

import type { ClipboardEvent } from 'react';
import { Eye, EyeOff } from 'lucide-react';

import type { PasswordInputProps } from './PasswordInput.interfaces';

import { Input, ToggleButton, Wrapper } from './PasswordInput.styled';

const preventPaste = (e: ClipboardEvent<HTMLInputElement>) => e.preventDefault();

export const PasswordInput = ({
  autoComplete,
  className,
  disabled = false,
  disablePaste = false,
  id,
  name,
  onChange,
  onToggleVisibility,
  placeholder,
  showPassword = false,
  value,
}: PasswordInputProps) => (
  <Wrapper>
    <Input
      $hasIcon={Boolean(onToggleVisibility)}
      autoComplete={autoComplete}
      className={className}
      disabled={disabled}
      id={id}
      name={name}
      placeholder={placeholder}
      type={showPassword ? 'text' : 'password'}
      value={value}
      onChange={onChange}
      onPaste={disablePaste ? preventPaste : undefined}
    />
    {onToggleVisibility && (
      <ToggleButton disabled={disabled} type='button' onClick={onToggleVisibility}>
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </ToggleButton>
    )}
  </Wrapper>
);
