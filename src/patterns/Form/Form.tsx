/**
 * Form
 *
 * The `<form>` element as a stack of fields — `display: flex; flex-direction: column; gap: <token>`.
 *
 * Three lines, which is exactly why it gets retyped: the product that drove this pattern had **ten
 * copies** of it (`Form` in seven modals/screens, `FormWrapper` in five admin forms), and they had
 * already drifted — most at `gap: md`, one at `lg`, one carrying its own `max-height`/scroll.
 *
 * Why not `Stack` with `as="form"`: `Stack` neither accepts `as` nor forwards props, so it cannot
 * receive `onSubmit`, `noValidate` or an `id` — the things that make a form a form. This spreads every
 * native form attribute through, so the element keeps its semantics and its submit handling.
 *
 * To scroll a form inside a modal, set `--sui-form-max-height` / `--sui-form-overflow-y` — see
 * `Form.styled.ts`.
 */

import type { FormProps } from './Form.interfaces';

import { StyledForm } from './Form.styled';

export const Form = ({ children, className, gap = 'md', ...rest }: FormProps) => (
  <StyledForm $gap={gap} className={className} data-testid='form' {...rest}>
    {children}
  </StyledForm>
);
