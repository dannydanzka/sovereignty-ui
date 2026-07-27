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

  /* A payment bar reads "$400 / $1,200", not "33%". Without this the caller renders its own row next
     to the bar and the screen ends up showing the same progress twice. */
  it('shows valueLabel instead of the percentage when given', () => {
    render(<ProgressBar value={33} valueLabel='$400 / $1,200' />);
    expect(screen.getByText('$400 / $1,200')).toBeInTheDocument();
    expect(screen.queryByText('33%')).not.toBeInTheDocument();
  });

  it('renders no header at all when there is nothing to read', () => {
    render(<ProgressBar showPercentage={false} value={50} />);
    expect(screen.queryByText('50%')).not.toBeInTheDocument();
    expect(screen.queryByText('%')).not.toBeInTheDocument();
  });

  it('calculates percentage from custom max', () => {
    render(<ProgressBar max={200} value={100} />);
    expect(screen.getByText('50%')).toBeInTheDocument();
  });
});
