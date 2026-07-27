/**
 * Textarea Component
 *
 * Multi-line text input with label, error, and character count.
 */

import type { TextareaProps } from './Textarea.interfaces';

import {
  StyledTextarea,
  TextareaCount,
  TextareaError,
  TextareaFooter,
  TextareaLabel,
  TextareaRequired,
  TextareaSpacer,
  TextareaWrapper,
} from './Textarea.styled';

export const Textarea = ({
  className,
  disabled = false,
  error,
  id,
  label,
  maxLength,
  name,
  onChange,
  placeholder,
  required = false,
  rows = 4,
  showCount = false,
  value = '',
}: TextareaProps) => {
  const textareaId = id ?? name;
  const currentLength = value.length;
  const isOver = maxLength ? currentLength > maxLength : false;
  const hasFooter = error || (showCount && maxLength);

  return (
    <TextareaWrapper className={className}>
      {label && (
        <TextareaLabel htmlFor={textareaId}>
          {label}
          {required && <TextareaRequired>*</TextareaRequired>}
        </TextareaLabel>
      )}
      <StyledTextarea
        $hasError={Boolean(error) || isOver}
        disabled={disabled}
        id={textareaId}
        maxLength={maxLength}
        multiline
        name={name}
        placeholder={placeholder}
        required={required}
        rows={rows}
        value={value}
        onValueChange={onChange}
      />
      {hasFooter && (
        <TextareaFooter>
          {error ? <TextareaError>{error}</TextareaError> : <TextareaSpacer />}
          {showCount && maxLength && (
            <TextareaCount $isOver={isOver}>
              {currentLength}/{maxLength}
            </TextareaCount>
          )}
        </TextareaFooter>
      )}
    </TextareaWrapper>
  );
};
