import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { StepCard } from './StepCard';

describe('StepCard', () => {
  it('renders number, title, and description', () => {
    render(<StepCard description='Do something' number={1} title='Step One' />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Step One')).toBeInTheDocument();
    expect(screen.getByText('Do something')).toBeInTheDocument();
  });
});
