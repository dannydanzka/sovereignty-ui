/** BackLink Styled Components */

import styled from 'styled-components';

import { c, tf, ts, tw } from '../../tokens/css-variables';

export const BackLinkAnchor = styled.a`
  align-self: flex-start;
  color: var(--sui-back-link-color, ${c('primary500')});
  cursor: pointer;
  font-family: ${tf('body')};
  font-size: ${ts('sm')};
  font-weight: ${tw('semibold')};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
