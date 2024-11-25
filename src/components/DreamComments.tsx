import React, { useState } from 'react';
import { Heart, Send, Trash2 } from 'lucide-react';
import { useCommentStore, Comment } from '../store/commentStore';
import { useAuthStore } from '../store/authStore';

interface DreamCommentsProps {
  dreamId: string;
}

export default function DreamComments({ dreamId }: DreamCommentsProps) {
  const [newComment, setNewComment] = useState('');
  const { user } = useAuthStore();
  const { comments, addComment, likeComment, deleteComment } = useCommentStore();
  const dreamComments = comments[dreamId] || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    addComment(dreamId, newComment.trim(), {
      id: user.id,
      name: user.name,
      avatar: user.avatar,
    });
    setNewComment('');
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      {user && (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-grow bg-white/5 border border-purple-300/20 rounded-lg py-2 px-4 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
          />
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-500/50 disabled:cursor-not-allowed text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            <Send className="w-4 h-4" />
            Post
          </button>
        </form>
      )}

      <div className="space-y-4">
        {dreamComments.map((comment: Comment) => (
          <div
            key={comment.id}
            className="bg-white/5 rounded-lg p-4 space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={comment.userAvatar}
                  alt={comment.userName}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <div className="text-white font-medium">{comment.userName}</div>
                  <div className="text-purple-300 text-sm">
                    {formatTimeAgo(comment.createdAt)}
                  </div>
                </div>
              </div>
              {user?.id === comment.userId && (
                <button
                  onClick={() => deleteComment(dreamId, comment.id)}
                  className="text-purple-300 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <p className="text-purple-100">{comment.content}</p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => likeComment(dreamId, comment.id)}
                className="flex items-center gap-1 text-purple-300 hover:text-white transition-colors"
              >
                <Heart className="w-4 h-4" />
                <span className="text-sm">{comment.likes}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}