/**
 * TableFooter Stories
 */

import type { Meta, StoryObj } from '@storybook/react';

import { TableFooter } from './TableFooter';
import type { TableFooterProps } from './TableFooter.interfaces';

const meta: Meta<typeof TableFooter> = {
  component: TableFooter,
  tags: ['autodocs'],
  title: 'Patterns/TableFooter',
};

export default meta;
type Story = StoryObj<typeof TableFooter>;

export const Paged: Story = {
  args: {
    currentPage: 1,
    filteredItems: 57,
    onPageChange: () => {},
    onPageSizeChange: () => {},
    pageSize: 20,
    totalItems: 57,
    totalPages: 3,
  },
};

const spanishRange: TableFooterProps['rangeLabel'] = ({ end, filtered, start }) =>
  `Mostrando ${start}–${end} de ${filtered}`;

export const Localized: Story = {
  args: {
    ...Paged.args,
    pageSizeLabel: 'Mostrar',
    perPageLabel: 'por página',
    rangeLabel: spanishRange,
  } as never,
};

export const SinglePage: Story = {
  args: {
    ...Paged.args,
    filteredItems: 8,
    totalItems: 8,
    totalPages: 1,
  } as never,
};
