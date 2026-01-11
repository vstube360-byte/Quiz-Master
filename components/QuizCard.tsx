import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, ArrowRight, HelpCircle, Lightbulb, SkipForward } from 'lucide-react';
import { QuizQuestion } from '../types';
import FormattedText from './FormattedText';

interface QuizCardProps {
  question: QuizQuestion;
  onResult: (isCorrect: boolean) => void;
  onNext: () => void;
  onSkip: () => void;
}

const QuizCard: React.FC<QuizCardProps> = ({ question, onResult, onNext, onSkip }) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Reset local state when question changes
  useEffect(() => {
    setSelectedIdx(null);
    setHasSubmitted(false);
    setShowHint(false);
  }, [question]);

  const handleSelect = (idx: number) => {
    if (hasSubmitted) return;
    setSelectedIdx(idx);
    setHasSubmitted(true);
    const isCorrect = idx === question.correctAnswerIndex;
    onResult(isCorrect);
  };

  const getOptionStyles = (idx: number) => {
    const baseStyle = "relative w-full p-4 text-left border rounded-xl transition-all duration-200 flex items-center justify-between group ";
    
    if (!hasSubmitted) {
      return baseStyle + "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 cursor-pointer shadow-sm hover:shadow dark:shadow-none";
    }

    if (idx === question.correctAnswerIndex) {
      return baseStyle + "bg-green-50 dark:bg-green-900/20 border-green-500 dark:border-green-500 ring-1 ring-green-500 dark:ring-green-500 shadow-md";
    }

    if (idx === selectedIdx && idx !== question.correctAnswerIndex) {
      return baseStyle + "bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-500/50 opacity-75";
    }

    return baseStyle + "bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-50 cursor-default";
  };

  const getOptionIcon = (idx: number) => {
    if (!hasSubmitted) return <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600 group-hover:border-indigo-400 dark:group-hover:border-indigo-400" />;
    
    if (idx === question.correctAnswerIndex) {
      return <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />;
    }
    
    if (idx === selectedIdx) {
      return <XCircle className="w-6 h-6 text-red-500 dark:text-red-400" />;
    }

    return <div className="w-5 h-5 rounded-full border-2 border-slate-200 dark:border-slate-700" />;
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
      <div className="glass-panel p-6 sm:p-8 rounded-2xl shadow-xl border border-white/50 dark:border-white/5">
        <div className="flex items-start justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 leading-tight">
            <FormattedText text={question.question} />
          </h2>
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border uppercase tracking-wide shrink-0 ml-4
            ${question.difficulty.toLowerCase() === 'easy' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800' : 
              question.difficulty.toLowerCase() === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800' : 
              'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800'}`}>
            {question.difficulty}
          </span>
        </div>

        <div className="space-y-3 mb-6">
          {question.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={hasSubmitted}
              className={getOptionStyles(idx)}
            >
              <span className={`font-medium pr-8 ${
                hasSubmitted && idx === question.correctAnswerIndex ? 'text-green-900 dark:text-green-200' : 
                hasSubmitted && idx === selectedIdx ? 'text-red-900 dark:text-red-200' : 'text-slate-700 dark:text-slate-200'
              }`}>
                <FormattedText text={option} />
              </span>
              <div className="shrink-0 ml-2">
                {getOptionIcon(idx)}
              </div>
            </button>
          ))}
        </div>

        {!hasSubmitted && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-start justify-between mb-6 gap-4">
            <div className="flex-1">
              {!showHint ? (
                <button
                  onClick={() => setShowHint(true)}
                  className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium flex items-center gap-2 transition-colors px-1 py-0.5 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 dark:focus:ring-offset-slate-900"
                >
                  <Lightbulb size={16} />
                  Need a hint?
                </button>
              ) : (
                <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800/50 rounded-xl p-4 animate-in fade-in slide-in-from-top-2">
                  <div className="flex gap-3">
                    <div className="p-1.5 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg h-fit shrink-0">
                      <Lightbulb size={16} className="text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-yellow-700 dark:text-yellow-500 uppercase tracking-wide mb-1">Hint</p>
                      <div className="text-sm text-slate-700 dark:text-slate-300">
                        <FormattedText text={question.hint} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={onSkip}
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap"
            >
              Skip Question
              <SkipForward size={16} />
            </button>
          </div>
        )}

        {hasSubmitted && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <div className={`p-4 rounded-xl border mb-6 flex gap-3 ${
              selectedIdx === question.correctAnswerIndex 
                ? 'bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-900/30' 
                : 'bg-indigo-50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-900/30'
            }`}>
              <HelpCircle className={`shrink-0 w-5 h-5 mt-0.5 ${
                selectedIdx === question.correctAnswerIndex ? 'text-green-600 dark:text-green-400' : 'text-indigo-600 dark:text-indigo-400'
              }`} />
              <div>
                <p className={`font-semibold text-sm mb-1 ${
                  selectedIdx === question.correctAnswerIndex ? 'text-green-800 dark:text-green-300' : 'text-indigo-900 dark:text-indigo-300'
                }`}>
                  {selectedIdx === question.correctAnswerIndex ? 'Correct!' : 'Explanation:'}
                </p>
                <div className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                  <FormattedText text={question.explanation} />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={onNext}
                className="group flex items-center gap-2 bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-indigo-200 dark:hover:shadow-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30"
              >
                Next Question
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizCard;