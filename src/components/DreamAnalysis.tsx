import React from 'react';
import { Brain, Sparkles, ThumbsUp, AlertTriangle } from 'lucide-react';

interface DreamAnalysis {
  symbols: string[];
  interpretation: string;
  mood: string;
  themes: string[];
}

interface DreamAnalysisProps {
  content: string;
  onAnalyze: () => void;
  isLoading?: boolean;
  analysis?: DreamAnalysis | null;
}

export default function DreamAnalysis({ content, onAnalyze, isLoading, analysis }: DreamAnalysisProps) {
  if (!analysis && !isLoading) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
        <div className="text-center">
          <Brain className="w-12 h-12 text-purple-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Analyze Your Dream</h3>
          <p className="text-purple-200 mb-4">Get AI-powered insights into your dream's meaning</p>
          <button
            onClick={onAnalyze}
            className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-full flex items-center gap-2 mx-auto transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Start Analysis
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
        <div className="flex items-center justify-center gap-3">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-purple-500 border-t-transparent" />
          <p className="text-purple-200">Analyzing your dream...</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Analysis Failed</h3>
          <p className="text-purple-200 mb-4">Unable to analyze your dream. Please try again.</p>
          <button
            onClick={onAnalyze}
            className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-full flex items-center gap-2 mx-auto transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Retry Analysis
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <Brain className="w-6 h-6" />
        Dream Analysis
      </h3>

      <div className="space-y-6">
        <div>
          <h4 className="text-purple-300 mb-2">Key Symbols</h4>
          <div className="flex flex-wrap gap-2">
            {analysis.symbols.map((symbol) => (
              <span key={symbol} className="px-3 py-1 bg-white/5 rounded-full text-purple-200">
                {symbol}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-purple-300 mb-2">Interpretation</h4>
          <p className="text-purple-100 leading-relaxed">{analysis.interpretation}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-purple-300 mb-2">Emotional Tone</h4>
            <div className="flex items-center gap-2">
              <ThumbsUp className="w-5 h-5 text-purple-300" />
              <span className="text-purple-100 capitalize">{analysis.mood}</span>
            </div>
          </div>

          <div>
            <h4 className="text-purple-300 mb-2">Key Themes</h4>
            <div className="flex flex-wrap gap-2">
              {analysis.themes.map((theme) => (
                <span key={theme} className="text-purple-100">#{theme}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-white/5 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-purple-300 flex-shrink-0 mt-1" />
            <p className="text-sm text-purple-200">
              This analysis is AI-generated and should be considered as one perspective rather than a definitive interpretation. Consider how it resonates with your personal experiences and feelings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}