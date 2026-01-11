import React, { useState, useEffect } from 'react';
import { Search, Sparkles, BookOpen, Globe, Code, Signal, Tv, Trophy, Zap, Palette, Loader2 } from 'lucide-react';
import { generateTrendingTopics } from '../services/gemini';

interface TopicSelectorProps {
  onStart: (topic: string, difficulty: string) => void;
}

const DIFFICULTIES = ['Easy', 'Medium', 'Hard', 'Mixed'];

const TopicSelector: React.FC<TopicSelectorProps> = ({ onStart }) => {
  const [input, setInput] = useState('');
  const [difficulty, setDifficulty] = useState('Mixed');
  const [trendingTopics, setTrendingTopics] = useState<{ label: string; category: string }[]>([]);
  const [isLoadingTopics, setIsLoadingTopics] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchTopics = async () => {
      try {
        const topics = await generateTrendingTopics();
        if (mounted) {
          if (topics && topics.length > 0) {
            setTrendingTopics(topics);
          } else {
            // Fallback if API fails
            setTrendingTopics([
              { label: "World History", category: "History" },
              { label: "Modern Tech", category: "Technology" },
              { label: "Pop Culture", category: "Entertainment" },
              { label: "Nature & Space", category: "Science" },
            ]);
          }
        }
      } catch (error) {
        if (mounted) {
           setTrendingTopics([
              { label: "World History", category: "History" },
              { label: "JavaScript", category: "Technology" },
              { label: "Literature", category: "Literature" },
              { label: "Space Exploration", category: "Science" },
            ]);
        }
      } finally {
        if (mounted) setIsLoadingTopics(false);
      }
    };

    fetchTopics();

    return () => { mounted = false; };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onStart(input.trim(), difficulty);
    }
  };

  const getIconForCategory = (category: string) => {
    switch (category) {
      case 'History': return <BookOpen size={18} />;
      case 'Geography': return <Globe size={18} />;
      case 'Technology': return <Code size={18} />;
      case 'Science': return <Zap size={18} />;
      case 'Entertainment': return <Tv size={18} />;
      case 'Sports': return <Trophy size={18} />;
      case 'Arts': return <Palette size={18} />;
      case 'Literature': return <BookOpen size={18} />;
      default: return <Sparkles size={18} />;
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
          Test Your Knowledge
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          Choose any topic, select a difficulty, and Quiz Master will generate a unique quiz for you instantly.
        </p>
      </div>

      <div className="glass-panel p-8 rounded-2xl shadow-xl border border-white/50 dark:border-white/5">
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="mb-6">
            <label htmlFor="topic-input" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
              What do you want to learn about?
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors" />
              </div>
              <input
                type="text"
                id="topic-input"
                className="block w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all shadow-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                placeholder="e.g., Quantum Physics, 90s Pop Music..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-2">
              <Signal size={16} /> Select Difficulty
            </label>
            <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              {DIFFICULTIES.map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setDifficulty(level)}
                  className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg transition-all ${
                    difficulty === level
                      ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-sm ring-1 ring-black/5 dark:ring-white/5'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!input.trim()}
            className="w-full py-3.5 bg-indigo-600 dark:bg-indigo-500 text-white font-semibold rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-200 dark:shadow-none"
          >
            Start Quiz
          </button>
        </form>

        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Trending Topics
            </p>
            {isLoadingTopics && <Loader2 size={14} className="animate-spin text-indigo-400" />}
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {isLoadingTopics ? (
              // Skeleton loading state
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-12 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse border border-slate-100 dark:border-slate-800"></div>
              ))
            ) : (
              trendingTopics.map((t, idx) => (
                <button
                  key={`${t.label}-${idx}`}
                  onClick={() => onStart(t.label, difficulty)}
                  className="flex items-center gap-2 p-3 text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-700 dark:hover:text-indigo-300 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-700 transition-all duration-200 text-left"
                >
                  <span className="text-slate-400 dark:text-slate-500 shrink-0">{getIconForCategory(t.category)}</span>
                  <span className="truncate">{t.label}</span>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicSelector;