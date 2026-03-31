import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Tabs } from './Tabs';

const TABS = [
  { content: <p>Tab 1 content</p>, id: 'tab1', label: 'Tab 1' },
  { content: <p>Tab 2 content</p>, id: 'tab2', label: 'Tab 2' },
  { content: <p>Disabled</p>, disabled: true, id: 'tab3', label: 'Tab 3' },
];

describe('Tabs', () => {
  it('renders all tab labels', () => {
    render(<Tabs activeTabId='tab1' tabs={TABS} onTabChange={vi.fn()} />);
    expect(screen.getByRole('tab', { name: 'Tab 1' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Tab 2' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Tab 3' })).toBeInTheDocument();
  });

  it('renders active tab content', () => {
    render(<Tabs activeTabId='tab1' tabs={TABS} onTabChange={vi.fn()} />);
    expect(screen.getByText('Tab 1 content')).toBeInTheDocument();
  });

  it('calls onTabChange when clicking a tab', async () => {
    const handleChange = vi.fn();
    render(<Tabs activeTabId='tab1' tabs={TABS} onTabChange={handleChange} />);
    await userEvent.click(screen.getByRole('tab', { name: 'Tab 2' }));
    expect(handleChange).toHaveBeenCalledWith('tab2');
  });

  it('does not call onTabChange for disabled tab', async () => {
    const handleChange = vi.fn();
    render(<Tabs activeTabId='tab1' tabs={TABS} onTabChange={handleChange} />);
    await userEvent.click(screen.getByRole('tab', { name: 'Tab 3' }));
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('renders badge when provided', () => {
    const tabs = [{ badge: 5, content: <p>C</p>, id: 't1', label: 'With Badge' }];
    render(<Tabs activeTabId='t1' tabs={tabs} onTabChange={vi.fn()} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});
