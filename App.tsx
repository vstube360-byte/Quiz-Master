import React, { useState, useCallback, useRef, useEffect } from 'react';
import Header from './components/Header';
import TopicSelector from './components/TopicSelector';
import QuizCard from './components/QuizCard';
import Loading from './components/Loading';
import { generateQuizQuestion } from './services/gemini';
import { QuizQuestion, QuizState, GameStatus } from './types';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<GameStatus>('idle');
  const [topic, setTopic] = useState<string>('');
  const [difficulty, setDifficulty] = useState<string>('Mixed');
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [quizState, setQuizState] = useState<QuizState>({
    score: 0,
    totalQuestions: 0,
    streak: 0,
  });

  // Theme state management
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Track if the quiz session is active to prevent state updates after exit
  const isQuizActive = useRef(false);

  const fetchQuestion = useCallback(async (selectedTopic: string, selectedDifficulty: string, currentHistory: string[]) => {
    setStatus('loading');
    setError(null);
    try {
      // Pass the last 20 questions to the service to prevent repetition
      const recentHistory = currentHistory.slice(-20);
      const questionData = await generateQuizQuestion(selectedTopic, selectedDifficulty, recentHistory);
      
      // If the user exited while loading, ignore the result
      if (!isQuizActive.current) {
        return;
      }

      setCurrentQuestion(questionData);
      
      // Update history with the new question text
      setHistory(prev => [...prev, questionData.question]);
      
      setStatus('playing');
    } catch (err) {
      // If the user exited while loading, ignore errors too
      if (!isQuizActive.current) {
        return;
      }
      console.error(err);
      setError("Failed to generate a valid question. Please try again or choose a different topic.");
      setStatus('error');
    }
  }, []);

  const handleStart = (selectedTopic: string, selectedDifficulty: string) => {
    isQuizActive.current = true;
    setTopic(selectedTopic);
    setDifficulty(selectedDifficulty);
    // Reset stats and history when starting a new topic
    setQuizState({ score: 0, totalQuestions: 0, streak: 0 });
    setHistory([]);
    fetchQuestion(selectedTopic, selectedDifficulty, []);
  };

  const handleResult = (isCorrect: boolean) => {
    setQuizState(prev => ({
      score: prev.score + (isCorrect ? 1 : 0),
      totalQuestions: prev.totalQuestions + 1,
      streak: isCorrect ? prev.streak + 1 : 0
    }));
  };

  const handleNext = () => {
    if (topic) {
      fetchQuestion(topic, difficulty, history);
    }
  };

  const handleSkip = () => {
    setQuizState(prev => ({
      ...prev,
      totalQuestions: prev.totalQuestions + 1,
      streak: 0 // Skipping breaks the streak
    }));
    if (topic) {
      fetchQuestion(topic, difficulty, history);
    }
  };

  const handleExit = () => {
    isQuizActive.current = false;
    setStatus('idle');
    setTopic('');
    setDifficulty('Mixed');
    setQuizState({ score: 0, totalQuestions: 0, streak: 0 });
    setHistory([]);
    setCurrentQuestion(null);
  };

  return (
    <div className="min-h-screen pb-12 pt-24 px-4 font-sans text-slate-900 dark:text-slate-100 selection:bg-indigo-100 selection:text-indigo-900 dark:selection:bg-indigo-900 dark:selection:text-indigo-100">
      <Header 
        quizState={quizState} 
        topic={status !== 'idle' ? topic : undefined} 
        onExit={handleExit} 
        isDark={isDarkMode}
        toggleTheme={toggleTheme}
      />
      
      <main className="max-w-4xl mx-auto w-full">
        {status === 'idle' && (
          <div className="mt-12 sm:mt-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <TopicSelector onStart={handleStart} />
          </div>
        )}

        {status === 'loading' && (
          <div className="mt-12 sm:mt-24">
            <Loading topic={topic} />
          </div>
        )}

        {status === 'playing' && currentQuestion && (
          <div className="mt-4 sm:mt-12">
            <QuizCard 
              question={currentQuestion} 
              onResult={handleResult} 
              onNext={handleNext} 
              onSkip={handleSkip}
            />
          </div>
        )}

        {status === 'error' && (
          <div className="mt-12 flex flex-col items-center text-center p-8 bg-white/80 dark:bg-slate-800/80 rounded-2xl shadow-lg max-w-md mx-auto border border-red-100 dark:border-red-900/30">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="text-red-500 dark:text-red-400" size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Oops! Something went wrong</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                onClick={() => fetchQuestion(topic, difficulty, history)}
                className="flex items-center justify-center gap-2 bg-indigo-600 dark:bg-indigo-500 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors font-medium shadow-lg hover:shadow-indigo-200 dark:hover:shadow-none"
              >
                <RefreshCw size={18} />
                Try Again
              </button>
              <button
                onClick={handleExit}
                className="flex items-center justify-center gap-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-6 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-indigo-700 dark:hover:text-indigo-400 transition-all font-medium"
              >
                <Home size={18} />
                Change Topic
              </button>
            </div>
          </div>
        )}
      </main>
      
      {/* Background decoration */}
      <div className="fixed top-0 left-0 -z-10 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-200/30 dark:bg-purple-900/20 blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-200/30 dark:bg-indigo-900/20 blur-3xl"></div>
      </div>
    </div>
  );
};

export default App;