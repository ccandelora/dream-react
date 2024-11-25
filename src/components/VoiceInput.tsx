import React, { useState, useEffect } from 'react';
import { Mic } from 'lucide-react';
import { formatDreamText } from '../utils/textFormatting';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

export default function VoiceInput({ onTranscript, disabled }: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      
      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript) {
          onTranscript(formatDreamText(finalTranscript));
        }
        setInterimTranscript(interimTranscript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      setRecognition(recognition);
      setIsSupported(true);
    }
  }, [onTranscript]);

  const handleToggleRecording = () => {
    if (!recognition || disabled) return;

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
      setInterimTranscript('');
    } else {
      recognition.start();
      setIsRecording(true);
    }
  };

  if (!isSupported) return null;

  return (
    <div className="relative">
      <button
        onClick={handleToggleRecording}
        disabled={disabled}
        className={`p-3 rounded-full ${
          isRecording 
            ? 'bg-red-500 text-white' 
            : 'bg-white/5 text-purple-300 hover:bg-white/10'
        } transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
        title={isRecording ? 'Stop recording' : 'Start recording'}
      >
        <Mic className="w-5 h-5" />
      </button>
      
      {interimTranscript && (
        <div className="absolute left-0 right-0 -bottom-12 bg-white/10 backdrop-blur-sm rounded-lg p-2 text-purple-200 text-sm z-10">
          {interimTranscript}
        </div>
      )}
    </div>
  );
}