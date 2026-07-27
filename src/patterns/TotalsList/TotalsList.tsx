/**
 * TotalsList
 *
 * A money summary: label → value lines with one emphasized total. Quotes, carts, checkouts, orders and
 * invoices all render this, which is why five screens of one product had five versions of it under five
 * names (`TotalsLine`, `SummaryRow`, `TotalRow`, `GrandTotal`, `TotalsRow`).
 *
 * Not `DescriptionList`: that stacks an uppercase label above its value for the data of a record. This
 * is a right-aligned ledger where the last line is the answer, so the label and value sit on one line
 * and the total carries the emphasis.
 *
 * Renders a real `<dl>/<dt>/<dd>` so the pairing is in the markup, not implied by adjacent spans.
 */

import type { TotalsListProps } from './TotalsList.interfaces';

import {
  Label,
  Line,
  ListWrapper,
  TotalLabel,
  TotalLine,
  TotalValue,
  Value,
} from './TotalsList.styled';

export const TotalsList = ({ align = 'stretch', className, items, total }: TotalsListProps) => (
  <ListWrapper $align={align} className={className} data-testid='totals-list'>
    {items
      .filter((item) => !item.hidden)
      .map((item) => (
        <Line key={item.id ?? item.label}>
          <Label>{item.label}</Label>
          <Value>{item.value}</Value>
        </Line>
      ))}

    {total && !total.hidden && (
      <TotalLine data-testid='totals-list-total'>
        <TotalLabel>{total.label}</TotalLabel>
        <TotalValue>{total.value}</TotalValue>
      </TotalLine>
    )}
  </ListWrapper>
);
