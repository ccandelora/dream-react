import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Comment = Database['public']['Tables']['comments']['Row'] & {
  profiles?: {
    name: string;
    avatar_url: string;
  } | null;
};

interface CommentState {
  comments: Record<string, Comment[]>;
  loading: boolean;
  error: Error | null;
  addComment: (dreamId: string, content: string) => Promise<void>;
  likeComment: (commentId: string) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
  fetchComments: (dreamId: string) => Promise<void>;
}

export const useCommentStore = create<CommentState>((set, get) => ({
  comments: {},
  loading: false,
  error: null,

  fetchComments: async (dreamId: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles (
            name,
            avatar_url
          )
        `)
        .eq('dream_id', dreamId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      set((state) => ({
        comments: {
          ...state.comments,
          [dreamId]: data || []
        }
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error : new Error('Failed to fetch comments') });
    } finally {
      set({ loading: false });
    }
  },

  addComment: async (dreamId: string, content: string) => {
    const { user } = await supabase.auth.getUser();
    if (!user?.id) throw new Error('Must be logged in to comment');

    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([{
          dream_id: dreamId,
          user_id: user.id,
          content
        }])
        .select(`
          *,
          profiles (
            name,
            avatar_url
          )
        `)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Failed to create comment');

      set((state) => ({
        comments: {
          ...state.comments,
          [dreamId]: [data, ...(state.comments[dreamId] || [])]
        }
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error : new Error('Failed to add comment') });
      throw error;
    }
  },

  likeComment: async (commentId: string) => {
    try {
      const { error } = await supabase.rpc('increment_comment_likes', {
        comment_id: commentId
      });

      if (error) throw error;

      set((state) => ({
        comments: Object.fromEntries(
          Object.entries(state.comments).map(([dreamId, comments]) => [
            dreamId,
            comments.map((comment) =>
              comment.id === commentId
                ? { ...comment, likes: (comment.likes || 0) + 1 }
                : comment
            )
          ])
        )
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error : new Error('Failed to like comment') });
      throw error;
    }
  },

  deleteComment: async (commentId: string) => {
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      set((state) => ({
        comments: Object.fromEntries(
          Object.entries(state.comments).map(([dreamId, comments]) => [
            dreamId,
            comments.filter((comment) => comment.id !== commentId)
          ])
        )
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error : new Error('Failed to delete comment') });
      throw error;
    }
  }
}));

// Set up real-time subscription
supabase
  .channel('comments')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'comments' },
    async (payload) => {
      const { comments } = useCommentStore.getState();
      const dreamId = payload.new?.dream_id || payload.old?.dream_id;
      
      if (!dreamId || !comments[dreamId]) return;

      if (payload.eventType === 'INSERT') {
        const { data, error } = await supabase
          .from('comments')
          .select(`
            *,
            profiles (
              name,
              avatar_url
            )
          `)
          .eq('id', payload.new.id)
          .single();

        if (!error && data) {
          useCommentStore.setState({
            comments: {
              ...comments,
              [dreamId]: [data, ...comments[dreamId]]
            }
          });
        }
      } else if (payload.eventType === 'UPDATE') {
        useCommentStore.setState({
          comments: {
            ...comments,
            [dreamId]: comments[dreamId].map((comment) =>
              comment.id === payload.new.id
                ? { ...comment, ...payload.new }
                : comment
            )
          }
        });
      } else if (payload.eventType === 'DELETE') {
        useCommentStore.setState({
          comments: {
            ...comments,
            [dreamId]: comments[dreamId].filter(
              (comment) => comment.id !== payload.old.id
            )
          }
        });
      }
    }
  )
  .subscribe();