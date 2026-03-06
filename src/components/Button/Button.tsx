/**
 * Button Component
 *
 * Unified button component with multiple variants and sizes.
 * Supports icons, loading state, and full width option.
 *
 * Replaces all admin local buttons:
 * - CancelButton    → <Button variant="secondary">
 * - SaveButton      → <Button variant="primary">
 * - ConfirmButton   → <Button variant="danger|success|warning">
 * - CreateButton    → <Button variant="outline" icon={<Plus />}>
 * - IconButton      → <Button variant="ghost" iconOnly icon={<Pencil />}>
 * - CloseButton     → <Button variant="ghost" iconOnly icon={<X />} size="sm">
 */

'use client';

import type { ButtonProps } from './Button.interfaces';

import { ButtonIcon, ButtonLoader, StyledButton } from './Button.styled';

export const Button = ({
  'aria-label': ariaLabel,
  children,
  className,
  disabled = false,
  fullWidth = false,
  icon,
  iconOnly = false,
  iconPosition = 'left',
  loading = false,
  loadingIcon,
  onClick,
  shape,
  size = 'md',
  title,
  type = 'button',
  variant = 'primary',
}: ButtonProps) => {
  const hasIcon = Boolean(icon) || loading;

  const renderIcon = () => {
    if (!icon) return null;
    return <ButtonIcon>{icon}</ButtonIcon>;
  };

  const renderLoadingIcon = () => {
    if (loadingIcon) {
      return <ButtonIcon>{loadingIcon}</ButtonIcon>;
    }
    return <ButtonLoader />;
  };

  const renderContent = () => {
    if (loading) {
      if (iconOnly) {
        return renderLoadingIcon();
      }
      return (
        <>
          {iconPosition === 'left' && renderLoadingIcon()}
          {children}
          {iconPosition === 'right' && renderLoadingIcon()}
        </>
      );
    }

    if (iconOnly) {
      return renderIcon();
    }

    return (
      <>
        {iconPosition === 'left' && renderIcon()}
        {children}
        {iconPosition === 'right' && renderIcon()}
      </>
    );
  };

  void hasIcon;

  return (
    <StyledButton
      $fullWidth={fullWidth}
      $iconOnly={iconOnly}
      $shape={shape}
      $size={size}
      $variant={variant}
      aria-label={ariaLabel}
      className={className}
      disabled={disabled || loading}
      title={title}
      type={type}
      onClick={onClick}
    >
      {renderContent()}
    </StyledButton>
  );
};
