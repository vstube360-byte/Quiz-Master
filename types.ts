export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  difficulty: string;
  hint: string;
}

export interface QuizState {
  score: number;
  totalQuestions: number;
  streak: number;
}

export type GameStatus = 'idle' | 'loading' | 'playing' | 'error';
