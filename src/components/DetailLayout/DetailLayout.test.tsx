import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import {
  DetailAmount,
  DetailContentBox,
  DetailDivider,
  DetailLabel,
  DetailRow,
  DetailSection,
  DetailValue,
} from './DetailLayout';

describe('DetailLayout', () => {
  it('renders DetailSection with children', () => {
    render(
      <DetailSection>
        <span>Section content</span>
      </DetailSection>
    );
    expect(screen.getByText('Section content')).toBeInTheDocument();
  });

  it('renders DetailLabel', () => {
    render(<DetailLabel>Field Label</DetailLabel>);
    expect(screen.getByText('Field Label')).toBeInTheDocument();
  });

  it('renders DetailValue', () => {
    render(<DetailValue>Field Value</DetailValue>);
    expect(screen.getByText('Field Value')).toBeInTheDocument();
  });

  it('renders DetailValue with mono', () => {
    render(<DetailValue mono>code-value</DetailValue>);
    expect(screen.getByText('code-value')).toBeInTheDocument();
  });

  it('renders DetailRow with columns', () => {
    render(
      <DetailRow columns={3}>
        <div>A</div>
        <div>B</div>
        <div>C</div>
      </DetailRow>
    );
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(screen.getByText('C')).toBeInTheDocument();
  });

  it('renders DetailDivider', () => {
    render(<DetailDivider />);
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('renders DetailAmount', () => {
    render(<DetailAmount>$100</DetailAmount>);
    expect(screen.getByText('$100')).toBeInTheDocument();
  });

  it('renders DetailContentBox with variant', () => {
    render(<DetailContentBox variant='warning'>Warning text</DetailContentBox>);
    expect(screen.getByText('Warning text')).toBeInTheDocument();
  });
});
