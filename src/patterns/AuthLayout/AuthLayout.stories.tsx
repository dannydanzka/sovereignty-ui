/**
 * AuthLayout Stories
 */

import type { Meta, StoryObj } from '@storybook/react';

import { AuthCard, AuthLayout } from './AuthLayout';
import { Button } from '../../components/Button';
import { TextField } from '../FormFields';

const meta: Meta<typeof AuthLayout> = {
  component: AuthLayout,
  tags: ['autodocs'],
  title: 'Patterns/AuthLayout',
};

export default meta;
type Story = StoryObj<typeof AuthLayout>;

export const Login: Story = {
  render: () => (
    <AuthLayout subtitle='Sign in to continue' title='Welcome back'>
      <AuthCard>
        <TextField id='email' label='Email' placeholder='you@example.com' type='email' />
        <TextField id='password' label='Password' type='password' />
        <Button fullWidth>Sign in</Button>
      </AuthCard>
    </AuthLayout>
  ),
};

export const WithIllustration: Story = {
  render: () => (
    <AuthLayout
      rightSlot={<img alt='Illustration' src='https://picsum.photos/300/420' />}
      title='Create account'
    >
      <AuthCard>
        <TextField id='name' label='Full name' />
        <TextField id='email2' label='Email' type='email' />
        <Button fullWidth>Sign up</Button>
      </AuthCard>
    </AuthLayout>
  ),
};
