import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Tables = Database['public']['Tables'];
type Row<T extends keyof Tables> = Tables[T]['Row'];

export function useDreams(userId?: string) {
  const [dreams, setDreams] = useState<Row<'dreams'>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchDreams = async () => {
      try {
        let query = supabase
          .from('dreams')
          .select('*, profiles(name, avatar_url)')
          .order('created_at', { ascending: false });

        if (userId) {
          query = query.eq('user_id', userId);
        } else {
          query = query.eq('privacy', 'public');
        }

        const { data, error: err } = await query;

        if (err) throw err;
        setDreams(data || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch dreams'));
      } finally {
        setLoading(false);
      }
    };

    fetchDreams();

    // Subscribe to changes
    const subscription = supabase
      .channel('dreams')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'dreams' }, 
        payload => {
          if (payload.eventType === 'INSERT') {
            setDreams(prev => [payload.new as Row<'dreams'>, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setDreams(prev => prev.map(dream => 
              dream.id === payload.new.id ? payload.new as Row<'dreams'> : dream
            ));
          } else if (payload.eventType === 'DELETE') {
            setDreams(prev => prev.filter(dream => dream.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  return { dreams, loading, error };
}