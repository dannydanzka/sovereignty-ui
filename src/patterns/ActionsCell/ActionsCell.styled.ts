/** ActionsCell Styled Components */

import styled from 'styled-components';

import { s } from '../../tokens/css-variables';

export const ActionsCellWrapper = styled.div`
  align-items: center;
  display: inline-flex;
  gap: ${s('xs')};
  justify-content: flex-end;
`;
