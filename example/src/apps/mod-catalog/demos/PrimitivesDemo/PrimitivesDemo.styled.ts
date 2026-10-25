/**
 * A visible box for the Div primitive.
 */

import styled from 'styled-components/native';

import { c, Div, s, sh } from '@dannydanzka/sovereignty-ui';

export const Box = styled(Div)`
  background-color: ${c('primary100')};
  border-radius: ${sh('md')};
  padding: ${s('sm')};
`;
