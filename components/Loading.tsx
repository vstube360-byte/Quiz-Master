import React, { useState, useEffect } from 'react';
import { Sparkles, BrainCircuit, Zap } from 'lucide-react';

interface LoadingProps {
  topic: string;
}

const LOADING_MESSAGES = [
  "Consulting Gemini...",
  "Analyzing topic details...",
  "Crafting a challenge...",
  "Verifying facts...",
  "Polishing options..."
];

const Loading: React.FC<LoadingProps> = ({ topic }) => {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-in fade-in zoom-in duration-500">
      {/* Animation Container */}
      <div className="relative mb-10 group">
        
        {/* Outer glowing orbs - pulsing */}
        <div className="absolute -inset-4 bg-indigo-500/20 dark:bg-indigo-400/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute -inset-8 bg-purple-500/10 dark:bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-75"></div>
        
        {/* Spinning Rings */}
        <div className="absolute inset-0 border-4 border-t-indigo-500 border-r-transparent border-b-purple-500 border-l-transparent rounded-full animate-spin"></div>
        <div className="absolute -inset-2 border-2 border-r-indigo-300 border-b-transparent border-l-purple-300 border-t-transparent rounded-full animate-spin [animation-duration:3s]"></div>

        {/* Center Icon Container */}
        <div className="relative w-20 h-20 bg-white dark:bg-slate-800 rounded-full shadow-xl flex items-center justify-center z-10">
          <BrainCircuit size={40} className="text-indigo-600 dark:text-indigo-400 animate-[pulse_2s_ease-in-out_infinite]" />
          
          {/* Floating small icons */}
          <div className="absolute -top-3 -right-3 bg-white dark:bg-slate-700 p-1.5 rounded-full shadow-sm animate-bounce">
            <Sparkles size={16} className="text-yellow-500" />
          </div>
           <div className="absolute -bottom-1 -left-3 bg-white dark:bg-slate-700 p-1.5 rounded-full shadow-sm animate-bounce [animation-delay:0.5s]">
            <Zap size={16} className="text-blue-500" />
          </div>
        </div>
      </div>
      
      {/* Text Content */}
      <div className="space-y-3 max-w-sm mx-auto">
        <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 animate-pulse transition-all duration-300">
          {LOADING_MESSAGES[msgIndex]}
        </h3>
        
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
          Generating a unique question about <span className="font-semibold text-slate-800 dark:text-slate-200">{topic}</span>...
        </p>
      </div>

      {/* Progress bar visual (infinite) */}
      <div className="w-48 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-8 overflow-hidden">
        <div className="h-full bg-indigo-500 dark:bg-indigo-400 rounded-full animate-[progress_1.5s_ease-in-out_infinite] w-1/3"></div>
      </div>
      
      <style>{`
        @keyframes progress {
          0% { transform: translateX(-150%); }
          100% { transform: translateX(350%); }
        }
      `}</style>
    </div>
  );
};

export default Loading;