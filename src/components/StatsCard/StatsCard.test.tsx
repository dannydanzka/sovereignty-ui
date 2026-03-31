import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { StatsCard } from './StatsCard';

describe('StatsCard', () => {
  it('renders value and label', () => {
    render(<StatsCard label='Users' value='1,234' />);
    expect(screen.getByText('1,234')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
  });

  it('renders sublabel when provided', () => {
    render(<StatsCard label='Users' sublabel='+12%' value='100' />);
    expect(screen.getByText('+12%')).toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    render(<StatsCard icon={<span data-testid='icon'>I</span>} label='Test' value='0' />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });
});
