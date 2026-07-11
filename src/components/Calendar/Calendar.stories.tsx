import type { Meta, StoryObj } from '@storybook/react';

import { Calendar } from './Calendar';

const meta: Meta<typeof Calendar> = {
  component: Calendar,
  tags: ['autodocs'],
  title: 'Components/Calendar',
};

export default meta;

type Story = StoryObj<typeof Calendar>;

const JUNE_2026 = new Date(2026, 5, 1);

export const Single: Story = {
  args: { defaultMonth: JUNE_2026, mode: 'single', value: new Date(2026, 5, 12) },
};

export const Range: Story = {
  args: {
    defaultMonth: JUNE_2026,
    mode: 'range',
    rangeValue: { end: new Date(2026, 5, 18), start: new Date(2026, 5, 12) },
  },
};

export const WithUnavailableDays: Story = {
  args: {
    defaultMonth: JUNE_2026,
    isDateDisabled: (date) => [13, 14, 15].includes(date.getDate()),
    mode: 'range',
  },
};

export const WeekStartsSunday: Story = {
  args: { defaultMonth: JUNE_2026, weekStartsOn: 0 },
};
