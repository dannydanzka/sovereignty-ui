import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import { FileUploader } from './FileUploader';

const makeFile = (name: string, type: string): File => new File(['content'], name, { type });

const drop = (files: File[]) =>
  fireEvent.drop(screen.getByTestId('dropzone'), { dataTransfer: { files } });

describe('FileUploader', () => {
  it('renders the default dropzone text', () => {
    render(<FileUploader onChange={vi.fn()} />);
    expect(screen.getByText('Drag files here or browse')).toBeInTheDocument();
  });

  it('renders custom copy when texts is provided', () => {
    render(
      <FileUploader
        texts={{
          browse: 'Elegir archivos',
          placeholder: 'Arrastra los archivos aquí',
          removeFile: (name) => `Quitar ${name}`,
          tooBig: (name, mb) => `${name} pesa más de ${mb} MB`,
          tooMany: (max) => `Máximo ${max}`,
          wrongType: (name) => `${name} no es un tipo permitido`,
        }}
        onChange={vi.fn()}
      />
    );
    expect(screen.getByText('Arrastra los archivos aquí')).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    render(<FileUploader label='Upload documents' onChange={vi.fn()} />);
    expect(screen.getByText('Upload documents')).toBeInTheDocument();
  });

  it('renders description as the zone hint', () => {
    render(<FileUploader description='Max 10MB' onChange={vi.fn()} />);
    expect(screen.getByText('Max 10MB')).toBeInTheDocument();
  });

  it('renders error message', () => {
    render(<FileUploader error='File too large' onChange={vi.fn()} />);
    expect(screen.getByText('File too large')).toBeInTheDocument();
  });

  it('renders file list with an accessible remove button', () => {
    const files = [{ file: makeFile('test.pdf', 'application/pdf'), id: '1' }];
    render(<FileUploader value={files} onChange={vi.fn()} />);
    expect(screen.getByText('test.pdf')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remove test.pdf' })).toBeInTheDocument();
  });

  it('appends a dropped file to the value', () => {
    const onChange = vi.fn();
    const existing = [{ file: makeFile('a.pdf', 'application/pdf'), id: '1' }];
    render(<FileUploader multiple value={existing} onChange={onChange} />);
    drop([makeFile('b.pdf', 'application/pdf')]);
    expect(onChange).toHaveBeenCalledTimes(1);
    const next = onChange.mock.calls[0]?.[0] as { file: File }[];
    expect(next).toHaveLength(2);
    expect(next[1]?.file.name).toBe('b.pdf');
  });

  /** The defect that motivated the recomposition: `accept` used to filter the picker only. */
  it('refuses a dropped file whose type accept does not allow', () => {
    const onChange = vi.fn();
    render(<FileUploader accept='image/*' onChange={onChange} />);
    drop([makeFile('sheet.pdf', 'application/pdf')]);
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByText('File "sheet.pdf" is not an accepted type')).toBeInTheDocument();
  });

  it('disables the zone once the cumulative maxFiles is reached', () => {
    const onChange = vi.fn();
    const full = [
      { file: makeFile('a.pdf', 'application/pdf'), id: '1' },
      { file: makeFile('b.pdf', 'application/pdf'), id: '2' },
    ];
    render(<FileUploader maxFiles={2} multiple value={full} onChange={onChange} />);
    expect(screen.getByTestId('dropzone')).toBeDisabled();
    drop([makeFile('c.pdf', 'application/pdf')]);
    expect(onChange).not.toHaveBeenCalled();
  });
});
