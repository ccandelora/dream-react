import { GoogleGenerativeAI } from '@google/generative-ai';
import { getEnvVar, validateEnvVars } from '../lib/env';

interface ImageGenerationResult {
  url: string;
  mood: string;
  error?: string;
}

// Carefully curated dream-themed images organized by mood/theme
const DREAM_IMAGES = {
  peaceful: [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80', // Serene beach
    'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=1200&q=80', // Misty mountains
    'https://images.unsplash.com/photo-1506477331477-33d5d8b3dc85?w=1200&q=80', // Calm lake
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&q=80'  // Sunset clouds
  ],
  mystical: [
    'https://images.unsplash.com/photo-1518066000714-58c45f1a2c0a?w=1200&q=80', // Northern lights
    'https://images.unsplash.com/photo-1502581827181-9cf3c3ee0106?w=1200&q=80', // Starry sky
    'https://images.unsplash.com/photo-1505506874110-6a7a69069a08?w=1200&q=80', // Enchanted forest
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80'  // Mountain stars
  ],
  surreal: [
    'https://images.unsplash.com/photo-1536152470836-b943b246224c?w=1200&q=80', // Abstract light
    'https://images.unsplash.com/photo-1566808907623-57c6d5b1e640?w=1200&q=80', // Mirror reflection
    'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=1200&q=80', // Spiral stairs
    'https://images.unsplash.com/photo-1512686096451-a15c19314d59?w=1200&q=80'  // Infinity mirror
  ],
  ethereal: [
    'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1200&q=80', // Floating particles
    'https://images.unsplash.com/photo-1479267658415-f47a5f0c9861?w=1200&q=80', // Light beams
    'https://images.unsplash.com/photo-1502581827181-9cf3c3ee0106?w=1200&q=80', // Galaxy
    'https://images.unsplash.com/photo-1507499739999-097706ad8914?w=1200&q=80'  // Nebula
  ],
  dark: [
    'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1200&q=80', // Dark forest
    'https://images.unsplash.com/photo-1499988921418-b7df40ff03f9?w=1200&q=80', // Storm clouds
    'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=1200&q=80', // Dark water
    'https://images.unsplash.com/photo-1504123010103-b1f3fe484a32?w=1200&q=80'  // Night sky
  ]
};

let model: ReturnType<typeof GoogleGenerativeAI.prototype.getGenerativeModel> | null = null;

try {
  const apiKey = getEnvVar('GEMINI_API_KEY');
  if (validateEnvVars() && apiKey !== 'your_gemini_api_key_here') {
    const genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  }
} catch (error) {
  console.error('Failed to initialize Gemini AI:', error);
}

const MOOD_ANALYSIS_PROMPT = `
Analyze this dream and return ONLY ONE of these moods: peaceful, mystical, surreal, ethereal, dark.
Consider the emotional tone, imagery, symbolism, and overall atmosphere of the dream.
Base your choice on these mood definitions:
- peaceful: calming, serene, tranquil scenes
- mystical: magical, enchanted, otherworldly
- surreal: strange, dreamlike, abstract
- ethereal: heavenly, delicate, light
- dark: mysterious, shadowy, intense

Dream: "{dream}"
Return only the mood word, nothing else.
`;

export async function generateDreamImage(dreamContent: string): Promise<ImageGenerationResult> {
  // Use default mood if no API key or invalid setup
  if (!model || !validateEnvVars()) {
    const moods = Object.keys(DREAM_IMAGES) as Array<keyof typeof DREAM_IMAGES>;
    const defaultMood = 'mystical';
    const moodImages = DREAM_IMAGES[defaultMood];
    return {
      url: moodImages[Math.floor(Math.random() * moodImages.length)],
      mood: defaultMood,
      error: 'Using default visualization (demo mode)'
    };
  }

  try {
    // Analyze dream mood
    const prompt = MOOD_ANALYSIS_PROMPT.replace('{dream}', dreamContent);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const mood = response.text().toLowerCase().trim() as keyof typeof DREAM_IMAGES;
    
    // Validate mood
    if (!DREAM_IMAGES[mood]) {
      throw new Error(`Invalid mood: ${mood}`);
    }
    
    // Select random image for mood
    const moodImages = DREAM_IMAGES[mood];
    const randomIndex = Math.floor(Math.random() * moodImages.length);
    
    return {
      url: moodImages[randomIndex],
      mood: mood
    };
  } catch (error) {
    console.error('Dream visualization error:', error);
    // Fallback to mystical mood
    const fallbackMood = 'mystical';
    const fallbackImages = DREAM_IMAGES[fallbackMood];
    return {
      url: fallbackImages[Math.floor(Math.random() * fallbackImages.length)],
      mood: fallbackMood,
      error: 'Using fallback visualization'
    };
  }
}