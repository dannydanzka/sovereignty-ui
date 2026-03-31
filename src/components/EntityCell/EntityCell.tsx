/**
 * EntityCell
 */

import type { EntityCellProps } from './EntityCell.interfaces';

import { Container, Description, Id, Name } from './EntityCell.styled';

export const EntityCell = ({ className, description, id, name }: EntityCellProps) => (
  <Container className={className}>
    <Name>{name}</Name>
    {id && <Id>{id}</Id>}
    {description && <Description>{description}</Description>}
  </Container>
);
