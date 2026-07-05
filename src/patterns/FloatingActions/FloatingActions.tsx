/**
 * FloatingActions Pattern
 *
 * Floating action buttons pinned to a screen side (generalization of the
 * per-project floating social media bars). Items are fully injected:
 * icon + label + href (renders a link) or onClick (renders a button).
 */

import type { FloatingActionsProps } from './FloatingActions.interfaces';

import { ActionLink, ActionTrigger, Container } from './FloatingActions.styled';

const STAGGER_SECONDS = 0.1;

export const FloatingActions = ({
  animated = true,
  className,
  items,
  side = 'right',
}: FloatingActionsProps) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <Container $side={side} className={className}>
      {items.map((item, index) => {
        const delay = (index + 1) * STAGGER_SECONDS;

        if (item.href) {
          return (
            <ActionLink
              $animated={animated}
              $delay={delay}
              aria-label={item.label}
              href={item.href}
              key={item.label}
              rel='noopener noreferrer'
              target='_blank'
              title={item.label}
            >
              {item.icon}
            </ActionLink>
          );
        }

        return (
          <ActionTrigger
            $animated={animated}
            $delay={delay}
            aria-label={item.label}
            key={item.label}
            title={item.label}
            type='button'
            onClick={item.onClick}
          >
            {item.icon}
          </ActionTrigger>
        );
      })}
    </Container>
  );
};
