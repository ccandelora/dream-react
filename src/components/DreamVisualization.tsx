import React, { useState, useEffect } from 'react';
import { ImageIcon, AlertCircle, Loader2, RefreshCw, Sparkles } from 'lucide-react';
import { generateDreamImage } from '../services/imageService';

interface DreamVisualizationProps {
  content: string;
  onImageGenerated?: (imageUrl: string) => void;
}

export default function DreamVisualization({ content, onImageGenerated }: DreamVisualizationProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [mood, setMood] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    async function generateVisualization() {
      if (!content.trim()) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const result = await generateDreamImage(content);
        setImageUrl(result.url);
        setMood(result.mood);
        onImageGenerated?.(result.url);
        
        if (result.error) {
          setError(result.error);
        }
      } catch (err) {
        setError('Unable to generate dream visualization');
        console.error('Visualization error:', err);
      } finally {
        setIsLoading(false);
      }
    }

    generateVisualization();
  }, [content, retryCount, onImageGenerated]);

  const handleRetry = () => {
    setRetryCount(c => c + 1);
    setError(null);
  };

  if (isLoading) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
        <div className="flex items-center justify-center gap-3 py-8">
          <Loader2 className="w-6 h-6 text-purple-300 animate-spin" />
          <p className="text-purple-200">Creating visualization...</p>
        </div>
      </div>
    );
  }

  if (!imageUrl) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
        <div className="flex flex-col items-center gap-4 py-6">
          <AlertCircle className="w-8 h-8 text-red-400" />
          <p className="text-purple-200">{error || 'Failed to generate visualization'}</p>
          <button
            onClick={handleRetry}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Dream Visualization
          </h3>
          <button
            onClick={handleRetry}
            className="p-2 text-purple-300 hover:text-white transition-colors"
            title="Generate new visualization"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        
        <div className="relative aspect-video rounded-lg overflow-hidden group">
          <img
            src={imageUrl}
            alt="Dream visualization"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => {
              setError('Failed to load image');
              setImageUrl(null);
            }}
          />
          {mood && (
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/50 to-transparent">
              <div className="flex items-center gap-2 text-white">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm capitalize">{mood} Atmosphere</span>
              </div>
            </div>
          )}
        </div>
        
        {error && (
          <p className="text-sm text-yellow-200 bg-yellow-500/10 rounded-lg p-2">
            Note: {error}
          </p>
        )}
        
        <p className="text-sm text-purple-200 text-center italic">
          AI-analyzed visualization based on your dream's emotional tone and imagery
        </p>
      </div>
    </div>
  );
}