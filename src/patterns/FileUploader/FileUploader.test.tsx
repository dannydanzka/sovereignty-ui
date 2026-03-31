import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import { FileUploader } from './FileUploader';

describe('FileUploader', () => {
  it('renders dropzone text', () => {
    render(<FileUploader onChange={vi.fn()} />);
    expect(screen.getByText('browse')).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    render(<FileUploader label='Upload documents' onChange={vi.fn()} />);
    expect(screen.getByText('Upload documents')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<FileUploader description='Max 10MB' onChange={vi.fn()} />);
    expect(screen.getByText('Max 10MB')).toBeInTheDocument();
  });

  it('renders error message', () => {
    render(<FileUploader error='File too large' onChange={vi.fn()} />);
    expect(screen.getByText('File too large')).toBeInTheDocument();
  });

  it('renders file list', () => {
    const files = [
      { file: new File(['content'], 'test.pdf', { type: 'application/pdf' }), id: '1' },
    ];
    render(<FileUploader value={files} onChange={vi.fn()} />);
    expect(screen.getByText('test.pdf')).toBeInTheDocument();
  });
});
