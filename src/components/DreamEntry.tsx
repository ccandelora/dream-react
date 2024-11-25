import React, { useState } from 'react';
import { Send, Image, Calendar, Moon, Lock, Globe, UserCircle2 } from 'lucide-react';
import { useDreamStore } from '../store/dreamStore';
import { useAuthStore } from '../store/authStore';
import DreamAnalysis from './DreamAnalysis';
import VoiceInput from './VoiceInput';
import { formatDreamText } from '../utils/textFormatting';
import { analyzeDream } from '../services/geminiService';
import { generateDreamImage } from '../services/imageService';

type PrivacyOption = 'public' | 'anonymous' | 'private';

export default function DreamEntry() {
  const [content, setContent] = useState('');
  const [dreamDate, setDreamDate] = useState(new Date().toISOString().split('T')[0]);
  const [dreamClarity, setDreamClarity] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [privacy, setPrivacy] = useState<PrivacyOption>('public');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  
  const { user } = useAuthStore();
  const addDream = useDreamStore((state) => state.addDream);

  const commonTags = ['Lucid', 'Nightmare', 'Adventure', 'Romance', 'Flying', 'Chase', 'Water', 'Family'];

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleVoiceTranscript = (transcript: string) => {
    setContent(prev => prev + (prev ? ' ' : '') + transcript);
  };

  const handleSubmit = async () => {
    if (!content.trim() || !user) return;

    const formattedContent = formatDreamText(content);
    
    let dreamAnalysis = null;
    let dreamImage = null;

    setIsAnalyzing(true);
    try {
      dreamAnalysis = await analyzeDream(formattedContent);
      setAnalysis(dreamAnalysis);
    } catch (error) {
      console.error('Analysis failed:', error);
    }
    setIsAnalyzing(false);

    setIsGeneratingImage(true);
    try {
      const result = await generateDreamImage(formattedContent);
      dreamImage = result.url;
      setGeneratedImage(result.url);
    } catch (error) {
      console.error('Image generation failed:', error);
    }
    setIsGeneratingImage(false);

    addDream({
      userId: user.id,
      content: formattedContent,
      tags: selectedTags,
      likes: 0,
      comments: 0,
      createdAt: new Date(dreamDate),
      clarity: dreamClarity,
      analysis: dreamAnalysis,
      privacy,
      imageUrl: dreamImage
    });

    // Reset form
    setContent('');
    setSelectedTags([]);
    setAnalysis(null);
    setDreamClarity(5);
    setDreamDate(new Date().toISOString().split('T')[0]);
    setPrivacy('public');
    setGeneratedImage(null);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleAnalyze = async () => {
    if (!content.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const dreamAnalysis = await analyzeDream(content);
      setAnalysis(dreamAnalysis);
    } catch (error) {
      console.error('Analysis failed:', error);
      setAnalysis(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-8 text-center">
        <h2 className="text-2xl font-semibold text-white mb-4">Sign in to Share Your Dreams</h2>
        <p className="text-purple-200">Join our community to record and analyze your dreams.</p>
      </div>
    );
  }

  const privacyOptions: { value: PrivacyOption; icon: React.ReactNode; label: string }[] = [
    { value: 'public', icon: <Globe className="w-4 h-4" />, label: 'Public' },
    { value: 'anonymous', icon: <UserCircle2 className="w-4 h-4" />, label: 'Anonymous' },
    { value: 'private', icon: <Lock className="w-4 h-4" />, label: 'Private' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
        <h2 className="text-2xl font-semibold text-white mb-4">Record Your Dream</h2>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-purple-200 mb-2">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-300" />
                <input
                  type="date"
                  value={dreamDate}
                  onChange={(e) => setDreamDate(e.target.value)}
                  className="w-full bg-white/5 border border-purple-300/20 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                />
              </div>
            </div>
            <div>
              <label className="block text-purple-200 mb-2">Dream Clarity (1-10)</label>
              <div className="relative">
                <Moon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-300" />
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={dreamClarity}
                  onChange={(e) => setDreamClarity(Number(e.target.value))}
                  className="w-full bg-white/5 border border-purple-300/20 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                />
              </div>
            </div>
            <div>
              <label className="block text-purple-200 mb-2">Privacy</label>
              <div className="flex gap-2">
                {privacyOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => setPrivacy(option.value)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-colors ${
                      privacy === option.value
                        ? 'bg-purple-500 text-white'
                        : 'bg-white/5 text-purple-300 hover:bg-white/10'
                    }`}
                  >
                    {option.icon}
                    <span className="text-sm">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="relative">
            <textarea
              value={content}
              onChange={handleContentChange}
              className="w-full h-32 bg-white/5 border border-purple-300/20 rounded-lg p-4 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
              placeholder="Describe your dream..."
            />
          </div>
          
          <div className="flex items-center gap-4">
            <VoiceInput 
              onTranscript={handleVoiceTranscript}
              disabled={isAnalyzing || isGeneratingImage}
            />
            
            <button 
              className={`p-3 rounded-full ${
                isGeneratingImage
                  ? 'bg-purple-500 text-white'
                  : 'bg-white/5 text-purple-300 hover:bg-white/10'
              } transition-colors`}
              onClick={() => generateDreamImage(content)}
              disabled={!content.trim() || isGeneratingImage}
            >
              <Image className="w-5 h-5" />
            </button>
            
            <div className="flex-grow" />
            
            <button
              onClick={handleSubmit}
              disabled={!content.trim()}
              className="px-6 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-500/50 disabled:cursor-not-allowed text-white rounded-full flex items-center gap-2 transition-colors"
            >
              <Send className="w-4 h-4" />
              Share Dream
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {commonTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full ${
                  selectedTags.includes(tag)
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/5 text-purple-300 hover:bg-white/10'
                } transition-colors`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {content && (
        <DreamAnalysis
          content={content}
          onAnalyze={handleAnalyze}
          isLoading={isAnalyzing}
          analysis={analysis}
        />
      )}

      {generatedImage && (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Dream Visualization</h3>
          <img
            src={generatedImage}
            alt="AI-generated dream visualization"
            className="w-full rounded-lg"
          />
        </div>
      )}
    </div>
  );
}