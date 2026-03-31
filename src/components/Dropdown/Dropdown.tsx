/**
 * Dropdown
 */

import { ChevronDown } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { DropdownProps } from './Dropdown.interfaces';

import { Container, IconWrapper, Item, Menu, Trigger } from './Dropdown.styled';

export const Dropdown = ({
  className,
  disabled = false,
  icon,
  onChange,
  options,
  placeholder = 'Select',
  position = 'bottom',
  value,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayText = selectedOption?.label ?? placeholder;

  const handleToggle = useCallback(() => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
    }
  }, [disabled]);

  const handleSelect = useCallback(
    (optionValue: string, optionDisabled?: boolean) => {
      if (optionDisabled) return;
      onChange(optionValue);
      setIsOpen(false);
    },
    [onChange]
  );

  const createSelectHandler = useCallback(
    (optionValue: string, optionDisabled?: boolean) => () =>
      handleSelect(optionValue, optionDisabled),
    [handleSelect]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      } else if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleToggle();
      }
    },
    [handleToggle]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <Container className={className} ref={containerRef}>
      <Trigger
        data-open={isOpen}
        disabled={disabled}
        type='button'
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
      >
        {icon && <IconWrapper>{icon}</IconWrapper>}
        {displayText}
        <ChevronDown size={16} />
      </Trigger>

      {isOpen && (
        <Menu $position={position}>
          {options.map((option) => (
            <Item
              $disabled={option.disabled}
              $selected={option.value === value}
              disabled={option.disabled}
              key={option.value}
              type='button'
              onClick={createSelectHandler(option.value, option.disabled)}
            >
              {option.label}
            </Item>
          ))}
        </Menu>
      )}
    </Container>
  );
};
