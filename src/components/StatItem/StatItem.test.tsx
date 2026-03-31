import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { StatItem, StatsBar, StatsGrid } from './StatItem';

describe('StatItem', () => {
  it('renders label and value', () => {
    render(<StatItem label='Users' value={100} />);
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    render(<StatItem icon={<span data-testid='icon'>I</span>} label='Test' value={1} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });
});

describe('StatsBar', () => {
  it('renders children', () => {
    render(
      <StatsBar>
        <span>Child</span>
      </StatsBar>
    );
    expect(screen.getByText('Child')).toBeInTheDocument();
  });
});

describe('StatsGrid', () => {
  it('renders children', () => {
    render(
      <StatsGrid columns={2}>
        <span>A</span>
        <span>B</span>
      </StatsGrid>
    );
    expect(screen.getByText('A')).toBeInTheDocument();
  });
});
