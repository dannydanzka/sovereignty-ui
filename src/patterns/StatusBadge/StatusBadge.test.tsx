import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { StatusBadge } from './StatusBadge';

describe('StatusBadge', () => {
  it('renders the active label when active', () => {
    render(<StatusBadge isActive />);
    expect(screen.getByText('Activo')).toBeInTheDocument();
  });

  it('renders the inactive label when not active', () => {
    render(<StatusBadge isActive={false} />);
    expect(screen.getByText('Inactivo')).toBeInTheDocument();
  });

  it('accepts localized labels', () => {
    render(<StatusBadge activeLabel='Activo' inactiveLabel='Inactivo' isActive />);
    expect(screen.getByText('Activo')).toBeInTheDocument();
  });
});
