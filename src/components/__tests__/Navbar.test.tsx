import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../Navbar';
import { useAuthStore } from '../../store/authStore';

vi.mock('../../store/authStore', () => ({
  useAuthStore: vi.fn()
}));

describe('Navbar', () => {
  const mockOnViewChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login button when user is not authenticated', () => {
    (useAuthStore as any).mockReturnValue({ isAuthenticated: false });
    
    render(
      <BrowserRouter>
        <Navbar onViewChange={mockOnViewChange} currentView="feed" />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('renders user profile when authenticated', () => {
    (useAuthStore as any).mockReturnValue({
      isAuthenticated: true,
      user: {
        name: 'Test User',
        avatar: 'https://example.com/avatar.jpg'
      }
    });
    
    render(
      <BrowserRouter>
        <Navbar onViewChange={mockOnViewChange} currentView="feed" />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('handles view changes correctly', () => {
    (useAuthStore as any).mockReturnValue({ isAuthenticated: true });
    
    render(
      <BrowserRouter>
        <Navbar onViewChange={mockOnViewChange} currentView="feed" />
      </BrowserRouter>
    );
    
    fireEvent.click(screen.getByText('Profile'));
    expect(mockOnViewChange).toHaveBeenCalledWith('profile');
  });
});