import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

export default function EmailConfirmation() {
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        const hash = window.location.hash;
        if (!hash) {
          setStatus('error');
          setError('Invalid confirmation link');
          return;
        }

        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        const type = params.get('type');

        if (!accessToken || !refreshToken || type !== 'signup') {
          setStatus('error');
          setError('Invalid confirmation link');
          return;
        }

        // Set the session
        const { data: { session }, error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (sessionError) throw sessionError;

        if (session?.user) {
          // Get user profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            setUser({
              id: session.user.id,
              email: session.user.email!,
              name: profile.name,
              avatar: profile.avatar_url,
              bio: profile.bio,
              joinedDate: new Date(profile.created_at)
            });
          }
        }

        setStatus('success');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } catch (err) {
        console.error('Confirmation error:', err);
        setStatus('error');
        setError(err instanceof Error ? err.message : 'Failed to confirm email');
      }
    };

    handleEmailConfirmation();
  }, [navigate, setUser]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 max-w-md w-full">
        {status === 'processing' && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Confirming Your Email</h2>
            <p className="text-purple-200">Please wait while we verify your email address...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-6 h-6 text-green-400" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Email Confirmed!</h2>
            <p className="text-purple-200">
              Your email has been successfully verified. You'll be redirected to start exploring dreams...
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Confirmation Failed</h2>
            <p className="text-red-300">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
            >
              Return to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}