import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Brain, ImageIcon, Lock, User, Globe } from 'lucide-react';
import { Dream } from '../store/dreamStore';
import { useAuthStore } from '../store/authStore';
import DreamAnalysis from './DreamAnalysis';
import DreamComments from './DreamComments';
import ShareModal from './ShareModal';
import DreamVisualization from './DreamVisualization';

interface DreamCardProps {
  dream: Dream;
  onLike: () => void;
}

export default function DreamCard({ dream, onLike }: DreamCardProps) {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showVisualization, setShowVisualization] = useState(false);
  const { user } = useAuthStore();

  const formattedDate = new Date(dream.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const PrivacyIcon = {
    public: Globe,
    private: Lock,
    anonymous: User
  }[dream.privacy];

  return (
    <div className="space-y-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
        <div className="flex items-center gap-4 mb-4">
          <img 
            src={dream.avatar || "https://images.unsplash.com/photo-1612994370726-5d4d609fca1b?w=150"}
            alt={dream.userName || "Anonymous"}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex-grow">
            <div className="flex items-center gap-2">
              <h3 className="text-white font-semibold">{dream.userName || "Anonymous Dreamer"}</h3>
              <PrivacyIcon className="w-4 h-4 text-purple-300" />
            </div>
            <p className="text-purple-300 text-sm">{formattedDate}</p>
          </div>
        </div>

        <p className="text-purple-100 mb-4 whitespace-pre-wrap">{dream.content}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {dream.tags.map((tag) => (
            <span 
              key={tag}
              className="px-3 py-1 rounded-full bg-white/5 text-purple-300 text-sm"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-4 text-purple-300">
          <button
            onClick={onLike}
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            <Heart className="w-5 h-5" />
            <span>{dream.likes}</span>
          </button>
          <button 
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{dream.comments}</span>
          </button>
          {dream.privacy !== 'private' && (
            <button 
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <Share2 className="w-5 h-5" />
              <span>Share</span>
            </button>
          )}
          <button
            onClick={() => setShowAnalysis(!showAnalysis)}
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            <Brain className="w-5 h-5" />
            <span>{showAnalysis ? 'Hide Analysis' : 'Show Analysis'}</span>
          </button>
          <button
            onClick={() => setShowVisualization(!showVisualization)}
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            <ImageIcon className="w-5 h-5" />
            <span>{showVisualization ? 'Hide Artwork' : 'Show Artwork'}</span>
          </button>
        </div>
      </div>

      {showAnalysis && dream.analysis && (
        <DreamAnalysis
          content={dream.content}
          analysis={dream.analysis}
          onAnalyze={() => {}}
        />
      )}

      {showVisualization && (
        <DreamVisualization content={dream.content} />
      )}

      {showComments && (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
          <DreamComments dreamId={dream.id} />
        </div>
      )}

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        dreamId={dream.id}
        dreamContent={dream.content}
      />
    </div>
  );
}