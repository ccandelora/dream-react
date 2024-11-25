import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DreamEntry from '../DreamEntry';
import { useAuthStore } from '../../store/authStore';

vi.mock('../../store/authStore', () => ({
  useAuthStore: vi.fn()
}));

describe('DreamEntry', () => {
  const mockUser = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    avatar: 'https://example.com/avatar.jpg',
    joinedDate: new Date()
  };

  beforeEach(() => {
    (useAuthStore as any).mockReturnValue({ user: mockUser });
  });

  it('renders dream entry form when user is logged in', () => {
    render(<DreamEntry />);
    
    expect(screen.getByPlaceholderText('Describe your dream...')).toBeInTheDocument();
    expect(screen.getByText('Share Dream')).toBeInTheDocument();
  });

  it('shows sign in message when user is not logged in', () => {
    (useAuthStore as any).mockReturnValue({ user: null });
    render(<DreamEntry />);
    
    expect(screen.getByText('Sign in to Share Your Dreams')).toBeInTheDocument();
  });

  it('handles dream submission', async () => {
    const user = userEvent.setup();
    render(<DreamEntry />);
    
    const textarea = screen.getByPlaceholderText('Describe your dream...');
    await user.type(textarea, 'Test dream content');
    
    const submitButton = screen.getByText('Share Dream');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(textarea).toHaveValue('');
    });
  });

  it('validates dream content before submission', () => {
    render(<DreamEntry />);
    
    const submitButton = screen.getByText('Share Dream');
    expect(submitButton).toBeDisabled();
  });
});