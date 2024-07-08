export interface QuizQuestion {
  quizId: string;
  question: string;
  answerChoices: string[];
  correctChoice: number;
}
