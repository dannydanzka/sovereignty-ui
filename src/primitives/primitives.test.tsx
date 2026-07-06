import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { Div, Span } from './primitives.styled';

describe('primitives (web resolution)', () => {
  it('renders Div as a flex-column div', () => {
    render(<Div data-testid='box'>content</Div>);
    const box = screen.getByTestId('box');
    expect(box.tagName).toBe('DIV');
    expect(box).toHaveStyle({ display: 'flex', flexDirection: 'column' });
  });

  it('renders Span as a span', () => {
    render(<Span data-testid='text'>hello</Span>);
    expect(screen.getByTestId('text').tagName).toBe('SPAN');
    expect(screen.getByText('hello')).toBeInTheDocument();
  });
});
