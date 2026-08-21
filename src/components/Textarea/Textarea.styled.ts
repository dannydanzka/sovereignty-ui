/**
 * Textarea Styled Components
 */

import styled from 'styled-components';

import { c, s, tf, tl, ts } from '../../tokens/css-variables';
import { FORM_CONTROL_SIZES, formControlFrame } from '../../internal/form-control';
import { TextField } from '../../primitives';

export const TextareaWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${s('micro')};
  width: 100%;
`;

export const TextareaLabel = styled.label`
  color: ${c('textPrimary')};
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
  font-weight: var(--sui-font-weight-medium, 500);
`;

/**
 * The `*` next to a required field's label.
 *
 * `Input` shipped this from the start and `Textarea`/`Select` did not, so a form with a required
 * text field next to a required textarea marked only one of them — the label lied about which
 * answers were mandatory. Keep the three in sync.
 */
export const TextareaRequired = styled.span`
  color: ${c('error')};
  margin-left: ${s('micro')};
`;

export const StyledTextarea = styled(TextField)<{ $hasError: boolean }>`
  ${formControlFrame}
  ${FORM_CONTROL_SIZES.md}
  font-family: ${tf('body')};
  /* A textarea grows by lines, so the scale's min-height is a floor rather than the height. */
  line-height: ${tl('relaxed')};
  resize: vertical;
  width: 100%;
`;

export const TextareaFooter = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const TextareaError = styled.span`
  color: ${c('error')};
  font-family: ${tf('body')};
  font-size: ${ts('xs')};
`;

export const TextareaSpacer = styled.span``;

export const TextareaCount = styled.span<{ $isOver: boolean }>`
  color: ${({ $isOver }) => ($isOver ? c('error') : c('textTertiary'))};
  font-family: ${tf('body')};
  font-size: ${ts('xs')};
  margin-left: auto;
`;
