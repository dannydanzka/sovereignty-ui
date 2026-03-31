import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { Image } from './Image';

describe('Image', () => {
  it('renders fallback when src is missing', () => {
    render(<Image alt='Test' />);
    expect(screen.getByText('No image')).toBeInTheDocument();
  });

  it('renders custom fallback text', () => {
    render(<Image alt='Test' fallbackText='Sin imagen' />);
    expect(screen.getByText('Sin imagen')).toBeInTheDocument();
  });

  it('renders img element when src is provided', () => {
    render(<Image alt='Photo' src='test.jpg' />);
    expect(screen.getByAltText('Photo')).toBeInTheDocument();
  });
});
