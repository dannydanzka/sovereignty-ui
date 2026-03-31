import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { Avatar } from './Avatar';

describe('Avatar', () => {
  it('renders initials when no src', () => {
    render(<Avatar name='John Doe' />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('renders single initial for single name', () => {
    render(<Avatar name='John' />);
    expect(screen.getByText('J')).toBeInTheDocument();
  });

  it('renders ? when no name', () => {
    render(<Avatar />);
    expect(screen.getByText('?')).toBeInTheDocument();
  });

  it('renders image when src is provided', () => {
    render(<Avatar alt='User' name='John' src='avatar.jpg' />);
    expect(screen.getByAltText('User')).toBeInTheDocument();
  });
});
