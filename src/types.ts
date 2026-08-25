export type Language = 'vi' | 'en';
export type GameMode = 'solo' | 'versus';
export type Screen = 'home' | 'game' | 'result';

export interface QuestionData {
  level: string;
  emojis: string;
  title: string;
  clue: string;
  question: string;
  correctAnswer: string;
  options: string[];
  explanation: string;
  funFact: string;
}

export type RawQuestionTuple = [
  string, // level
  string, // emojis
  string, // title
  string, // clue description
  string, // question
  string, // correctAnswer
  string[], // options
  string, // explanation
  string // funFact
];
