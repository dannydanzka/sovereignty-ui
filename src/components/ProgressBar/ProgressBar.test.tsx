import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { ProgressBar } from './ProgressBar';

describe('ProgressBar', () => {
  it('renders label', () => {
    render(<ProgressBar label='Progress' value={50} />);
    expect(screen.getByText('Progress')).toBeInTheDocument();
  });

  it('shows percentage by default', () => {
    render(<ProgressBar value={75} />);
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('hides percentage when showPercentage is false', () => {
    render(<ProgressBar showPercentage={false} value={50} />);
    expect(screen.queryByText('50%')).not.toBeInTheDocument();
  });

  it('calculates percentage from custom max', () => {
    render(<ProgressBar max={200} value={100} />);
    expect(screen.getByText('50%')).toBeInTheDocument();
  });
});
