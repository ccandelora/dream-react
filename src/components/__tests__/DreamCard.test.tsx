import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DreamCard from '../DreamCard';

describe('DreamCard', () => {
  const mockDream = {
    id: '1',
    userId: '1',
    content: 'Test dream content',
    tags: ['Flying', 'Lucid'],
    likes: 5,
    comments: 2,
    createdAt: new Date('2024-03-15'),
    clarity: 8,
    privacy: 'public' as const,
    userName: 'Test User',
    avatar: 'https://example.com/avatar.jpg'
  };

  const mockOnLike = vi.fn();

  it('renders dream content correctly', () => {
    render(<DreamCard dream={mockDream} onLike={mockOnLike} />);
    
    expect(screen.getByText('Test dream content')).toBeInTheDocument();
    expect(screen.getByText('#Flying')).toBeInTheDocument();
    expect(screen.getByText('#Lucid')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('handles like interaction', () => {
    render(<DreamCard dream={mockDream} onLike={mockOnLike} />);
    
    const likeButton = screen.getByText('5').closest('button');
    fireEvent.click(likeButton!);
    
    expect(mockOnLike).toHaveBeenCalledTimes(1);
  });

  it('displays correct date format', () => {
    render(<DreamCard dream={mockDream} onLike={mockOnLike} />);
    
    expect(screen.getByText('March 15, 2024')).toBeInTheDocument();
  });
});