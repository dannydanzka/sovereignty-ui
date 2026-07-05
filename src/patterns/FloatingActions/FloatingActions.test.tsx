import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { FloatingActions } from './FloatingActions';

describe('FloatingActions', () => {
  it('renders nothing for an empty item list', () => {
    render(<FloatingActions items={[]} />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders links for items with href', () => {
    render(
      <FloatingActions
        items={[{ href: 'https://instagram.com/acme', icon: <span>IG</span>, label: 'Instagram' }]}
      />
    );
    const link = screen.getByRole('link', { name: 'Instagram' });
    expect(link).toHaveAttribute('href', 'https://instagram.com/acme');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders buttons for items with onClick and fires them', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<FloatingActions items={[{ icon: <span>?</span>, label: 'Help', onClick }]} />);
    await user.click(screen.getByRole('button', { name: 'Help' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
