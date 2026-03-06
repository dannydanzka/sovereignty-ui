/**
 * Modal Stories
 */

import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';
import { Modal } from './Modal';

const meta: Meta<typeof Modal> = {
  component: Modal,
  tags: ['autodocs'],
  title: 'Components/Modal',
};

export default meta;
type Story = StoryObj<typeof Modal>;

const DefaultModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button
        variant='primary'
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Open Modal
      </Button>
      <Modal
        isOpen={isOpen}
        size='md'
        title='Default Modal'
        onClose={() => {
          setIsOpen(false);
        }}
      >
        <p style={{ margin: 0 }}>This is the modal content.</p>
      </Modal>
    </>
  );
};

const ConfirmModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button
        variant='danger'
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Delete item
      </Button>
      <Modal
        confirmText='Delete'
        confirmVariant='danger'
        icon={<AlertTriangle size={24} />}
        isOpen={isOpen}
        message='This action cannot be undone. The item will be permanently deleted.'
        title='Delete item?'
        variant='confirm'
        onClose={() => {
          setIsOpen(false);
        }}
        onConfirm={() => {
          setIsOpen(false);
        }}
      />
    </>
  );
};

export const AllVariants: Story = {
  args: { isOpen: false, onClose: () => {} },
  render: () => (
    <div style={{ display: 'flex', gap: '12px' }}>
      <DefaultModal />
      <ConfirmModal />
    </div>
  ),
};

export const Default: Story = {
  args: {
    children: <p style={{ margin: 0 }}>Modal content goes here.</p>,
    isOpen: true,
    title: 'Modal Title',
    onClose: () => {},
  },
};

export const Confirm: Story = {
  args: {
    confirmText: 'Delete',
    confirmVariant: 'danger',
    icon: <AlertTriangle size={24} />,
    isOpen: true,
    message: 'This action cannot be undone.',
    title: 'Are you sure?',
    variant: 'confirm',
    onClose: () => {},
    onConfirm: () => {},
  },
};

export const Large: Story = {
  args: {
    children: <p style={{ margin: 0 }}>Large modal content.</p>,
    isOpen: true,
    size: 'lg',
    title: 'Large Modal',
    onClose: () => {},
  },
};
