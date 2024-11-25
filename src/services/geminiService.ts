import { GoogleGenerativeAI } from '@google/generative-ai';
import { getEnvVar, validateEnvVars } from '../lib/env';

interface DreamAnalysis {
  symbols: string[];
  interpretation: string;
  mood: string;
  themes: string[];
}

const defaultAnalysis: DreamAnalysis = {
  symbols: ['Dream', 'Subconscious', 'Memory'],
  interpretation: 'Your dream reflects personal experiences and emotions. Consider how it relates to your current life situation.',
  mood: 'Reflective',
  themes: ['Personal', 'Experience', 'Emotion']
};

let model: ReturnType<typeof GoogleGenerativeAI.prototype.getGenerativeModel> | null = null;

try {
  const apiKey = getEnvVar('GEMINI_API_KEY');
  if (apiKey && apiKey !== 'your_gemini_api_key_here') {
    const genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  }
} catch (error) {
  console.error('Failed to initialize Gemini AI:', error);
}

const DREAM_ANALYSIS_PROMPT = `Analyze this dream and provide detailed insights in the following JSON format:
{
  "symbols": ["symbol1", "symbol2", "symbol3"],
  "interpretation": "A comprehensive interpretation of the dream's meaning, including psychological and emotional aspects",
  "mood": "single word describing the overall emotional tone",
  "themes": ["theme1", "theme2", "theme3"]
}

Provide deep psychological insights and meaningful interpretations. Ensure exactly 3 symbols and 3 themes.

Dream:`;

export async function analyzeDream(dreamContent: string): Promise<DreamAnalysis> {
  if (!validateEnvVars() || !model) {
    console.log('Using default analysis (no valid API key)');
    return defaultAnalysis;
  }

  try {
    const result = await model.generateContent(DREAM_ANALYSIS_PROMPT + '\n' + dreamContent);
    const response = await result.response;
    const text = response.text().trim();
    
    try {
      const analysis = JSON.parse(text);
      
      // Validate and normalize the response
      const normalizedAnalysis: DreamAnalysis = {
        symbols: (analysis.symbols || []).slice(0, 3),
        interpretation: analysis.interpretation || defaultAnalysis.interpretation,
        mood: analysis.mood || defaultAnalysis.mood,
        themes: (analysis.themes || []).slice(0, 3)
      };

      // Ensure required fields have values
      if (normalizedAnalysis.symbols.length === 0) {
        normalizedAnalysis.symbols = defaultAnalysis.symbols;
      }
      if (normalizedAnalysis.themes.length === 0) {
        normalizedAnalysis.themes = defaultAnalysis.themes;
      }
      
      return normalizedAnalysis;
    } catch (parseError) {
      console.error('Failed to parse analysis:', parseError);
      return defaultAnalysis;
    }
  } catch (error) {
    console.error('Dream analysis failed:', error);
    return defaultAnalysis;
  }
}