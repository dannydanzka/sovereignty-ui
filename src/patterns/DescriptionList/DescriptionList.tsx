/**
 * DescriptionList
 *
 * Label → value rows for detail screens. This is the shape every detail page rebuilds under a
 * different name (`SummaryLabel`/`SummaryValue`, `MetaLabel`/`MetaValue`, `StatLabel`/`StatValue`) and
 * it is not a KPI: `StatsCard`/`StatItem` exist for figures with icons and semantic colour, while this
 * is the data of one record. Renders a real `<dl>/<dt>/<dd>`, so the pairing is in the markup rather
 * than implied by two adjacent spans.
 */

import type { DescriptionListProps } from './DescriptionList.interfaces';

import { Label, ListWrapper, Row, Value } from './DescriptionList.styled';

export const DescriptionList = ({ className, columns = 'auto', items }: DescriptionListProps) => (
  <ListWrapper $columns={columns} className={className} data-testid='description-list'>
    {items
      .filter((item) => !item.hidden)
      .map((item) => (
        <Row key={item.label}>
          <Label>{item.label}</Label>
          <Value>{item.value}</Value>
        </Row>
      ))}
  </ListWrapper>
);
