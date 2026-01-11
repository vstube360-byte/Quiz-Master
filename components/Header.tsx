import React from 'react';
import { BrainCircuit, Sun, Moon } from 'lucide-react';
import { QuizState } from '../types';

interface HeaderProps {
  quizState: QuizState;
  topic?: string;
  onExit: () => void;
  isDark: boolean;
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ onExit, isDark, toggleTheme }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-10 glass-panel border-b border-indigo-100 dark:border-indigo-900/30 shadow-sm transition-all duration-300">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <button 
          onClick={onExit}
          className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-200 transition-colors group"
        >
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800/50 transition-colors">
            <BrainCircuit size={24} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <span className="font-bold text-lg hidden sm:block">Quiz Master</span>
        </button>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  );
};

export default Header;