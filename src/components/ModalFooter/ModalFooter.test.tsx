import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { ModalFooter } from './ModalFooter';

describe('ModalFooter', () => {
  it('renders children', () => {
    render(
      <ModalFooter>
        <button>Save</button>
      </ModalFooter>
    );
    expect(screen.getByText('Save')).toBeInTheDocument();
  });
});
