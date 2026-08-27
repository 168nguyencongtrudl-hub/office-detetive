import React, { useState, useEffect, useRef, useMemo } from 'react';
import { GameMode, Language } from '../types';
import { getQuestion, getTotalQuestions } from '../data/questions';
import { sfx } from '../utils/sound';

export interface FinalGameStats {
  score: number;
  right: number;
  scoreRed: number;
  scoreBlue: number;
  rightRed: number;
  rightBlue: number;
  totalQuestions: number;
  elapsedSeconds: number;
}

interface GameScreenProps {
  gameMode: GameMode;
  lang: Language;
  onFinishGame: (finalStats: FinalGameStats) => void;
  onScoreUpdate: (stats: FinalGameStats) => void;
  triggerFireworks: (x: number, y: number, count?: number) => void;
  isPaused: boolean;
}

function shuffleArray<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export const GameScreen: React.FC<GameScreenProps> = ({
  gameMode,
  lang,
  onFinishGame,
  onScoreUpdate,
  triggerFireworks,
  isPaused,
}) => {
  const [caseIndex, setCaseIndex] = useState(0);

  // Overall cumulative game statistics
  const [score, setScore] = useState(0);
  const [right, setRight] = useState(0);

  const [scoreRed, setScoreRed] = useState(0);
  const [scoreBlue, setScoreBlue] = useState(0);
  const [rightRed, setRightRed] = useState(0);
  const [rightBlue, setRightBlue] = useState(0);

  // Overall game running stopwatch
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const formattedElapsedTime = useMemo(() => {
    const mins = Math.floor(elapsedSeconds / 60);
    const secs = elapsedSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, [elapsedSeconds]);

  // Per-case countdown (15s total)
  const [time, setTime] = useState(15);
  const [locked, setLocked] = useState(false);
  const [manualClueUnlock, setManualClueUnlock] = useState(false);
  const [manualAnswerUnlock, setManualAnswerUnlock] = useState(false);
  const [revealDone, setRevealDone] = useState(false);

  // Calculated seconds elapsed in current case: 0 to 15
  const caseElapsed = 15 - time;

  // Phase logic:
  // Phase 1 (0s - 5s): Icon only
  // Phase 2 (5s - 10s): Clue revealed
  // Phase 3 (10s+): Answer choices revealed
  const isClueRevealed = caseElapsed >= 5 || manualClueUnlock || manualAnswerUnlock;
  const isAnswerRevealed = caseElapsed >= 10 || manualAnswerUnlock;

  // Per-case picks
  const [pickRed, setPickRed] = useState<string | null>(null);
  const [pickBlue, setPickBlue] = useState<string | null>(null);
  const [timeRed, setTimeRed] = useState<number>(0);
  const [timeBlue, setTimeBlue] = useState<number>(0);
  const [pickOrderRed, setPickOrderRed] = useState<number>(0);
  const [pickOrderBlue, setPickOrderBlue] = useState<number>(0);
  const currentPickCountRef = useRef<number>(0);

  // Feedback content
  const [feedbackHtml, setFeedbackHtml] = useState<{
    status: 'correct' | 'wrong';
    title: string;
    pointsMsg?: string;
    detailHtml?: React.ReactNode;
    explanation: string;
    funFact?: string;
  } | null>(null);

  const totalQuestions = useMemo(() => getTotalQuestions(lang), [lang]);
  const q = useMemo(() => getQuestion(caseIndex, lang), [caseIndex, lang]);
  const shuffledAnswers = useMemo(() => shuffleArray(q.options), [q.options, caseIndex]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync latest stats to parent
  useEffect(() => {
    onScoreUpdate({
      score,
      right,
      scoreRed,
      scoreBlue,
      rightRed,
      rightBlue,
      totalQuestions,
      elapsedSeconds,
    });
  }, [score, right, scoreRed, scoreBlue, rightRed, rightBlue, totalQuestions, elapsedSeconds, onScoreUpdate]);

  // Reset per-case state whenever caseIndex changes
  useEffect(() => {
    setTime(15);
    setLocked(false);
    setManualClueUnlock(false);
    setManualAnswerUnlock(false);
    setRevealDone(false);
    setPickRed(null);
    setPickBlue(null);
    setTimeRed(0);
    setTimeBlue(0);
    setPickOrderRed(0);
    setPickOrderBlue(0);
    currentPickCountRef.current = 0;
    setFeedbackHtml(null);
  }, [caseIndex]);

  // 1-second countdown timer with stage chimes
  useEffect(() => {
    if (locked || revealDone || isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }

        const nextVal = prev - 1;
        const currentElapsed = 15 - nextVal;

        // Stage 2 transition at 5s elapsed (time becomes 10)
        if (currentElapsed === 5) {
          sfx.playPhaseChime();
        }
        // Stage 3 transition at 10s elapsed (time becomes 5)
        else if (currentElapsed === 10) {
          sfx.playPhaseChime();
        } else {
          sfx.playTick();
        }

        return nextVal;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [locked, revealDone, isPaused, caseIndex]);

  const unlockClueManually = () => {
    sfx.playPhaseChime();
    setManualClueUnlock(true);
  };

  const unlockAnswersManually = () => {
    sfx.playPhaseChime();
    setManualClueUnlock(true);
    setManualAnswerUnlock(true);
  };

  const handlePickSolo = (val: string) => {
    if (locked || !isAnswerRevealed || revealDone) return;
    setLocked(true);
    if (timerRef.current) clearInterval(timerRef.current);

    setPickRed(val);
    setTimeRed(Math.max(0, time));
    currentPickCountRef.current = 1;
    setPickOrderRed(1);
  };

  const handlePickTeam = (team: 'red' | 'blue', val: string) => {
    if (locked || !isAnswerRevealed || revealDone) return;

    let newPickRed = pickRed;
    let newPickBlue = pickBlue;

    if (team === 'red' && !pickRed) {
      currentPickCountRef.current += 1;
      setPickOrderRed(currentPickCountRef.current);
      setPickRed(val);
      setTimeRed(Math.max(0, time));
      newPickRed = val;
    }

    if (team === 'blue' && !pickBlue) {
      currentPickCountRef.current += 1;
      setPickOrderBlue(currentPickCountRef.current);
      setPickBlue(val);
      setTimeBlue(Math.max(0, time));
      newPickBlue = val;
    }

    if (newPickRed && newPickBlue) {
      setLocked(true);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const revealCorrectAnswer = () => {
    setRevealDone(true);
    setLocked(true);
    if (timerRef.current) clearInterval(timerRef.current);

    const correctVal = q.correctAnswer;

    if (gameMode === 'solo') {
      const val = pickRed;
      if (val === correctVal) {
        setRight((r) => r + 1);
        const pts = timeRed > 0 ? 20 + timeRed * 2 : 10;
        setScore((s) => s + pts);

        sfx.playCorrect();
        sfx.playFireworksSound();
        triggerFireworks(window.innerWidth / 2, window.innerHeight / 2, 80);

        const timeBonusText = timeRed > 0
          ? (lang === 'vi' ? ` (+${timeRed * 2}đ thưởng tốc độ)` : ` (+${timeRed * 2} speed bonus)`)
          : (lang === 'vi' ? ' (10đ)' : ' (10 pts)');
        setFeedbackHtml({
          status: 'correct',
          title: lang === 'vi' ? 'ĐÚNG! Chính xác!' : 'CORRECT! Exactly!',
          pointsMsg: `+${pts} ${lang === 'vi' ? 'điểm' : 'points'}${timeBonusText}`,
          explanation: q.explanation,
          funFact: q.funFact,
        });
      } else {
        sfx.playWrong();
        setFeedbackHtml({
          status: 'wrong',
          title: lang === 'vi' ? 'SAI!' : 'WRONG!',
          pointsMsg: `${lang === 'vi' ? 'Bạn chọn:' : 'You chose:'} ${val || (lang === 'vi' ? 'Chưa chọn' : 'None')} • ${lang === 'vi' ? 'Đáp án đúng:' : 'Correct answer:'} ${correctVal}`,
          explanation: q.explanation,
          funFact: q.funFact,
        });
      }
    } else {
      // Versus Mode
      const redCorrect = pickRed === correctVal;
      const blueCorrect = pickBlue === correctVal;

      let ptsRed = 0;
      let ptsBlue = 0;

      if (redCorrect) {
        setRightRed((r) => r + 1);
        if (pickOrderRed === 1) {
          ptsRed = (timeRed > 0 ? 20 + timeRed * 2 : 10) + 10;
        } else {
          ptsRed = timeRed > 0 ? 15 + timeRed * 2 : 5;
        }
        setScoreRed((s) => s + ptsRed);
      }

      if (blueCorrect) {
        setRightBlue((b) => b + 1);
        if (pickOrderBlue === 1) {
          ptsBlue = (timeBlue > 0 ? 20 + timeBlue * 2 : 10) + 10;
        } else {
          ptsBlue = timeBlue > 0 ? 15 + timeBlue * 2 : 5;
        }
        setScoreBlue((s) => s + ptsBlue);
      }

      if (redCorrect || blueCorrect) {
        sfx.playCorrect();
        sfx.playFireworksSound();
        triggerFireworks(window.innerWidth / 2, window.innerHeight / 2, 90);
      } else {
        sfx.playWrong();
      }

      const redOrderText = pickOrderRed
        ? pickOrderRed === 1
          ? lang === 'vi'
            ? '⚡ Chốt THỨ 1 (+10đ tốc độ)'
            : '⚡ Picked 1st (+10 speed bonus)'
          : lang === 'vi'
          ? '🐢 Chốt THỨ 2'
          : '🐢 Picked 2nd'
        : lang === 'vi'
        ? 'Chưa chọn'
        : 'No pick';

      const blueOrderText = pickOrderBlue
        ? pickOrderBlue === 1
          ? lang === 'vi'
            ? '⚡ Chốt THỨ 1 (+10đ tốc độ)'
            : '⚡ Picked 1st (+10 speed bonus)'
          : lang === 'vi'
          ? '🐢 Chốt THỨ 2'
          : '🐢 Picked 2nd'
        : lang === 'vi'
        ? 'Chưa chọn'
        : 'No pick';

      let resultHeader = '';
      if (redCorrect && blueCorrect) {
        const winnerFirst = pickOrderRed < pickOrderBlue
          ? (lang === 'vi' ? '🔴 Đội Đỏ' : '🔴 Red Team')
          : (lang === 'vi' ? '🔵 Đội Xanh' : '🔵 Blue Team');
        resultHeader = `🎉 ${lang === 'vi' ? 'CẢ 2 ĐỘI ĐỀU ĐÚNG!' : 'BOTH TEAMS CORRECT!'} (${winnerFirst} ${lang === 'vi' ? 'chốt trước!' : 'picked first!'})`;
      } else if (redCorrect) {
        resultHeader = `🔴 ${lang === 'vi' ? 'ĐỘI ĐỎ GIÀNH ĐIỂM!' : 'RED TEAM SCORED!'} (+${ptsRed} ${lang === 'vi' ? 'điểm' : 'pts'})`;
      } else if (blueCorrect) {
        resultHeader = `🔵 ${lang === 'vi' ? 'ĐỘI XANH GIÀNH ĐIỂM!' : 'BLUE TEAM SCORED!'} (+${ptsBlue} ${lang === 'vi' ? 'điểm' : 'pts'})`;
      } else {
        resultHeader = `❌ ${lang === 'vi' ? 'KHÔNG ĐỘI NÀO ĐÚNG!' : 'NO TEAM SCORED!'}`;
      }

      setFeedbackHtml({
        status: redCorrect || blueCorrect ? 'correct' : 'wrong',
        title: resultHeader,
        detailHtml: (
          <div className="text-xs my-1 p-2 bg-white/5 rounded-lg text-left">
            🔴 <b>{lang === 'vi' ? 'Đỏ' : 'Red'}:</b> {pickRed || (lang === 'vi' ? 'Chưa chọn' : 'No pick')} ({redCorrect ? `+${ptsRed}${lang === 'vi' ? 'đ' : 'pts'}` : `0${lang === 'vi' ? 'đ' : 'pts'}`}) • <span className="text-slate-300">{redOrderText}</span>
            <br />
            🔵 <b>{lang === 'vi' ? 'Xanh' : 'Blue'}:</b> {pickBlue || (lang === 'vi' ? 'Chưa chọn' : 'No pick')} ({blueCorrect ? `+${ptsBlue}${lang === 'vi' ? 'đ' : 'pts'}` : `0${lang === 'vi' ? 'đ' : 'pts'}`}) • <span className="text-slate-300">{blueOrderText}</span>
          </div>
        ),
        explanation: `${lang === 'vi' ? 'Đáp án đúng:' : 'Correct answer:'} ${correctVal}. ${q.explanation}`,
        funFact: q.funFact,
      });
    }
  };

  const handleNextCase = () => {
    if (caseIndex < totalQuestions - 1) {
      setCaseIndex((idx) => idx + 1);
    } else {
      onFinishGame({
        score,
        right,
        scoreRed,
        scoreBlue,
        rightRed,
        rightBlue,
        totalQuestions,
        elapsedSeconds,
      });
    }
  };

  const handleSkipCase = () => {
    sfx.playClick();
    if (caseIndex < totalQuestions - 1) {
      setCaseIndex((idx) => idx + 1);
    } else {
      onFinishGame({
        score,
        right,
        scoreRed,
        scoreBlue,
        rightRed,
        rightBlue,
        totalQuestions,
        elapsedSeconds,
      });
    }
  };

  const showRevealButton = (locked || time === 0) && !revealDone;

  return (
    <div className="flex-1 flex flex-col justify-between min-h-0 overflow-hidden gap-1.5 md:gap-2.5">
      {/* Top Case Meta Header */}
      <div className="flex justify-between items-center font-black shrink-0 text-sm sm:text-base md:text-lg gap-2">
        <div className="min-w-0 shrink-0">
          <span className="text-amber-400 text-xs sm:text-sm md:text-base uppercase tracking-wider font-black block">
            {q.level}
          </span>
          <span className="text-base sm:text-lg md:text-2xl font-black text-white">
            {lang === 'vi' ? 'VỤ ÁN ' : 'CASE '}
            <span className="text-amber-400">{caseIndex + 1}</span>/{totalQuestions}
          </span>
        </div>

        {/* Question 15s Countdown Timer Circle */}
        <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 flex items-center justify-center shrink-0">
          <div
            id="tm"
            className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full grid place-items-center relative transition-all shadow-lg ${
              time <= 5
                ? 'bg-radial from-rose-400 to-rose-600 shadow-[0_0_24px_rgba(244,63,94,0.95)] animate-pulse'
                : 'bg-radial from-amber-400 to-amber-600 shadow-[0_0_18px_rgba(250,204,21,0.6)]'
            }`}
          >
            <div className="absolute inset-[3px] md:inset-[4px] bg-slate-900 rounded-full z-10" />
            <span
              id="tmNum"
              className={`relative z-20 font-black text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white ${
                time <= 5
                  ? 'drop-shadow-[0_0_12px_#f43f5e]'
                  : 'drop-shadow-[0_0_12px_#facc15]'
              }`}
            >
              {time}
            </span>
          </div>
        </div>

        {/* Score, Running Game Clock & Skip Question Button */}
        <div className="font-black text-sm sm:text-base md:text-lg flex items-center gap-2 sm:gap-3 justify-end flex-wrap shrink-0">
          {/* Running Game Stopwatch */}
          <div
            id="gameStopwatch"
            title={lang === 'vi' ? 'Thời gian chơi game' : 'Total elapsed game time'}
            className="inline-flex items-center gap-1.5 bg-slate-800/90 hover:bg-slate-800 px-3 md:px-4 py-1.5 md:py-2 rounded-xl border border-cyan-400/40 text-cyan-300 font-mono font-black text-xs sm:text-sm md:text-base shadow-[0_0_12px_rgba(34,211,238,0.25)] select-none"
          >
            <span className="text-sm md:text-base">⏱️</span>
            <span>{formattedElapsedTime}</span>
          </div>

          {/* Points badge */}
          <div className="bg-white/10 px-3 md:px-4 py-1.5 md:py-2 rounded-xl border border-white/20 text-xs sm:text-sm md:text-base">
            {gameMode === 'solo' ? (
              <span className="text-amber-400 font-black">⭐ {score}</span>
            ) : (
              <span className="font-black">
                <span className="text-rose-400">🔴 {scoreRed}</span> |{' '}
                <span className="text-blue-400">🔵 {scoreBlue}</span>
              </span>
            )}
          </div>

          {/* Skip Question Button */}
          <button
            id="skipQuestionBtn"
            type="button"
            title={lang === 'vi' ? 'Bỏ qua câu hỏi hiện tại để sang câu tiếp theo' : 'Skip current question to next'}
            onClick={handleSkipCase}
            className="inline-flex items-center gap-1.5 px-3 md:px-4 py-1.5 md:py-2 rounded-xl font-black text-xs sm:text-sm md:text-base border border-amber-400/60 bg-gradient-to-r from-amber-500/25 to-orange-500/25 text-amber-300 hover:text-white hover:bg-amber-500/40 hover:border-amber-400 cursor-pointer transition-all active:scale-95 shadow-[0_0_12px_rgba(245,158,11,0.2)]"
          >
            <span>{lang === 'vi' ? 'Bỏ qua' : 'Skip'}</span>
            <span className="text-sm md:text-base">⏭️</span>
          </button>
        </div>
      </div>

      {/* Progress Bar with Phase Markers (0-5s: Icon, 5-10s: Clue, 10-15s: Answers) */}
      <div className="space-y-1.5 shrink-0">
        <div className="h-2 sm:h-2.5 md:h-3 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-400 via-sky-400 to-rose-400 transition-all duration-300"
            style={{ width: `${((caseIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
        
        {/* Phase Timeline Stepper */}
        <div className="flex items-center justify-between text-xs sm:text-sm md:text-base font-extrabold px-1">
          <div className={`flex items-center gap-1.5 transition-colors ${!isClueRevealed ? 'text-amber-300 font-black' : 'text-emerald-400'}`}>
            <span>{isClueRevealed ? '✓' : '1️⃣'}</span>
            <span>{lang === 'vi' ? '0s-5s: Icon nhân vật' : '0s-5s: Role Icons'}</span>
          </div>
          <div className={`flex items-center gap-1.5 transition-colors ${isClueRevealed && !isAnswerRevealed ? 'text-amber-300 font-black animate-pulse' : isAnswerRevealed ? 'text-emerald-400' : 'text-slate-400'}`}>
            <span>{isAnswerRevealed ? '✓' : '2️⃣'}</span>
            <span>{lang === 'vi' ? '5s-10s: Manh mối' : '5s-10s: Clues'}</span>
          </div>
          <div className={`flex items-center gap-1.5 transition-colors ${isAnswerRevealed ? 'text-amber-300 font-black animate-pulse' : 'text-slate-400'}`}>
            <span>3️⃣</span>
            <span>{lang === 'vi' ? '10s+: Mở đáp án' : '10s+: Answers'}</span>
          </div>
        </div>
      </div>

      {/* Scene Box: Progressive Reveal (0-5s: Large Icon only, 5s+: Clue Card) */}
      <div className="rounded-2xl sm:rounded-3xl border border-white/25 bg-gradient-to-br from-indigo-950/90 via-slate-900/90 to-slate-950/90 flex items-center justify-center p-4 sm:p-6 md:p-8 my-1 flex-1 shadow-[inset_0_0_30px_rgba(0,0,0,0.5),0_8px_30px_rgba(0,0,0,0.5)] min-h-0 relative overflow-hidden">
        {/* Phase 1: 0s - 5s -> Emphasized Large Icon Guessing */}
        {!isClueRevealed ? (
          <div className="flex flex-col items-center justify-center text-center w-full py-3 md:py-6 animate-fade-in">
            <div className="inline-block px-4 py-1.5 md:px-6 md:py-2 rounded-full bg-amber-400/25 border border-amber-400/60 text-amber-300 text-xs sm:text-sm md:text-base font-black mb-3 tracking-wider animate-bounce shadow-md">
              🕵️ {lang === 'vi' ? 'GIAI ĐOẠN 1: ĐOÁN NHÂN VẬT QUA BỘ 3 BIỂU TƯỢNG' : 'STAGE 1: GUESS ROLE FROM 3 EMOJI ICONS'}
            </div>
            <div className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[110px] leading-none my-3 md:my-5 bg-white/10 p-5 sm:p-7 md:p-10 rounded-3xl border-2 border-amber-300/50 shadow-[0_0_40px_rgba(250,204,21,0.6)] select-none">
              {q.emojis}
            </div>
            <div className="text-sm sm:text-base md:text-lg text-slate-200 font-bold mt-3 flex items-center gap-2.5">
              <span className="inline-block w-3 h-3 rounded-full bg-amber-400 animate-ping" />
              <span>
                {lang === 'vi'
                  ? `Hồ sơ manh mối chi tiết sẽ tự động mở sau: ${Math.max(0, 5 - caseElapsed)} giây...`
                  : `Detailed case clue will auto-reveal in: ${Math.max(0, 5 - caseElapsed)}s...`}
              </span>
            </div>
            <button
              onClick={unlockClueManually}
              className="mt-3 text-xs sm:text-sm md:text-base font-bold text-amber-300 hover:text-amber-200 underline cursor-pointer bg-transparent border-0"
            >
              ⚡ {lang === 'vi' ? 'Xem manh mối ngay' : 'Show clues now'}
            </button>
          </div>
        ) : (
          /* Phase 2 & 3: 5s+ -> Full Clue Card Revealed */
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 lg:gap-8 items-center w-full justify-center animate-fade-in">
            <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-center leading-none shrink-0 bg-white/10 p-3 sm:p-5 md:p-6 rounded-3xl border-2 border-white/25 shadow-[0_0_30px_rgba(250,204,21,0.5)] select-none">
              {q.emojis}
            </div>
            <div className="bg-black/60 border border-white/20 rounded-2xl p-4 sm:p-6 md:p-7 flex-1 min-w-0 shadow-xl">
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="bg-amber-400 text-slate-950 px-3.5 py-1 rounded-full text-xs sm:text-sm font-black inline-block tracking-wide">
                  {lang === 'vi' ? 'MANH MỐI VỤ ÁN' : 'CASE CLUE'}
                </span>
                {!isAnswerRevealed && (
                  <span className="text-xs sm:text-sm md:text-base text-amber-300 font-black">
                    ⏳ {lang === 'vi' ? `Đáp án mở sau: ${Math.max(0, 10 - caseElapsed)}s` : `Choices unlock in: ${Math.max(0, 10 - caseElapsed)}s`}
                  </span>
                )}
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-white my-1 leading-snug drop-shadow-sm">
                {q.title}
              </h3>
              <p className="text-slate-100 text-sm sm:text-base md:text-lg lg:text-xl font-bold leading-relaxed m-0">
                {q.clue}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Question (Appears after 5s or with clue) */}
      <div className="text-center text-base sm:text-lg md:text-xl lg:text-2xl font-black my-1 text-amber-300 shrink-0 drop-shadow-md min-h-[32px] flex items-center justify-center">
        {isClueRevealed ? (
          <span className="animate-fade-in">❓ {q.question}</span>
        ) : (
          <span className="text-slate-400 text-xs sm:text-sm md:text-base font-semibold italic">
            ❓ {lang === 'vi' ? 'Câu hỏi và manh mối chi tiết sẽ xuất hiện ở giây thứ 5...' : 'Question and detailed clue will appear at 5s...'}
          </span>
        )}
      </div>

      {/* Hint / Status Notice */}
      <div
        id="hintText"
        className="text-center text-xs sm:text-sm md:text-base font-black my-0.5 shrink-0"
      >
        {!isClueRevealed ? (
          <span className="text-amber-300">
            🔍 {lang === 'vi' ? 'Giai đoạn 1 (0s-5s): Đoán nhân sự qua bộ 3 Biểu Tượng!' : 'Stage 1 (0s-5s): Guess the role from the 3 Emojis!'}
          </span>
        ) : !isAnswerRevealed ? (
          <span className="text-amber-400">
            🧠{' '}
            {lang === 'vi'
              ? `Giai đoạn 2 (5s-10s): Đọc manh mối! Bảng đáp án mở sau ${Math.max(0, 10 - caseElapsed)} giây...`
              : `Stage 2 (5s-10s): Read clues! Choices unlock in ${Math.max(0, 10 - caseElapsed)}s...`}
          </span>
        ) : !locked ? (
          <span className="text-emerald-400 animate-pulse">
            ⚡{' '}
            {lang === 'vi'
              ? 'Giai đoạn 3 (10s+): BẢNG ĐÁP ÁN ĐÃ MỞ! HÃY CHỌN NGAY:'
              : 'Stage 3 (10s+): CHOICES UNLOCKED! PICK QUICKLY:'}
          </span>
        ) : (
          <span className="text-amber-300">
            🔒{' '}
            {gameMode === 'solo'
              ? lang === 'vi'
                ? 'ĐÃ CHỐT ĐÁP ÁN! BẤM "HIỆN ĐÁP ÁN ĐÚNG" ĐỂ XEM PHÁ ÁN.'
                : 'ANSWER LOCKED! PRESS REVEAL TO SEE RESULT.'
              : lang === 'vi'
              ? 'CẢ 2 ĐỘI ĐÃ CHỐT ĐÁP ÁN! BẤM NÚT ĐỂ PHÁ ÁN:'
              : 'BOTH TEAMS LOCKED IN! CLICK REVEAL TO SEE RESULT:'}
          </span>
        )}
      </div>

      {/* Solo Mode Area */}
      {gameMode === 'solo' && (
        <div className="shrink-0 mb-1">
          {!isAnswerRevealed && (
            <div className="text-center mb-1">
              <button
                className="btn-gold border-0 rounded-full px-6 py-2.5 md:px-8 md:py-3 text-xs sm:text-sm md:text-base font-black cursor-pointer bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 shadow-lg hover:brightness-105"
                onClick={unlockAnswersManually}
              >
                🔓 {lang === 'vi' ? 'MỞ BẢNG ĐÁP ÁN NGAY' : 'UNLOCK CHOICES NOW'}
              </button>
            </div>
          )}

          {isAnswerRevealed && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-1 animate-fade-in">
              {shuffledAnswers.map((opt, idx) => {
                let extraClass = 'border-white/20 bg-white/10 text-white hover:bg-white/20';
                if (revealDone) {
                  if (opt === q.correctAnswer) {
                    extraClass = '!bg-emerald-700 !border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.6)] text-white scale-[1.02]';
                  } else if (opt === pickRed) {
                    extraClass = '!bg-rose-800 !border-rose-400 text-white';
                  }
                } else if (pickRed === opt) {
                  extraClass = 'border-amber-400 bg-amber-400/30 text-white shadow-[0_0_15px_rgba(250,204,21,0.4)]';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={locked || revealDone}
                    className={`border-2 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-4.5 text-left text-sm sm:text-base md:text-lg lg:text-xl font-black cursor-pointer transition-all duration-150 disabled:cursor-default shadow-md ${extraClass}`}
                    onClick={() => handlePickSolo(opt)}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Versus Mode Area */}
      {gameMode === 'versus' && (
        <div className="shrink-0 mb-1">
          {!isAnswerRevealed && (
            <div className="text-center mb-1">
              <button
                className="btn-gold border-0 rounded-full px-6 py-2.5 md:px-8 md:py-3 text-xs sm:text-sm md:text-base font-black cursor-pointer bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 shadow-lg hover:brightness-105"
                onClick={unlockAnswersManually}
              >
                🔓 {lang === 'vi' ? '2 ĐỘI BẮT ĐẦU CHỌN NGAY' : 'TEAMS CHOOSE NOW'}
              </button>
            </div>
          )}

          {isAnswerRevealed && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-1 animate-fade-in">
              {/* Red Team Panel */}
              <div className="rounded-2xl p-2.5 sm:p-3.5 md:p-4 border-2 border-red-400/40 bg-gradient-to-b from-red-950/50 to-black/40 shadow-lg">
                <div className="flex justify-between items-center mb-1.5 pb-1 border-b border-white/10">
                  <span className="font-black text-sm sm:text-base md:text-lg text-rose-400">
                    🔴 {lang === 'vi' ? 'ĐỘI ĐỎ' : 'RED TEAM'}
                  </span>
                  <span className="font-black text-xs sm:text-sm md:text-base px-2.5 py-0.5 rounded-full bg-white/15">
                    {scoreRed} {lang === 'vi' ? 'điểm' : 'pts'}
                  </span>
                </div>
                <div className={`text-xs sm:text-sm font-black mb-1.5 min-h-[18px] ${pickRed ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {pickRed
                    ? `${lang === 'vi' ? `Chốt #${pickOrderRed}! 🔒` : `Locked #${pickOrderRed}! 🔒`}`
                    : lang === 'vi'
                    ? 'Sẵn sàng chốt...'
                    : 'Ready to pick...'}
                </div>
                <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                  {shuffledAnswers.map((opt, idx) => {
                    let btnClass = 'border-white/20 bg-white/10 text-white hover:bg-white/20';
                    if (revealDone) {
                      if (opt === q.correctAnswer) {
                        btnClass = '!bg-emerald-700 !border-emerald-400 text-white shadow-[0_0_12px_rgba(52,211,153,0.5)]';
                      } else if (opt === pickRed && pickRed !== q.correctAnswer) {
                        btnClass = '!bg-rose-800 !border-rose-400 text-white';
                      }
                    } else if (pickRed === opt) {
                      btnClass = 'border-amber-400 bg-amber-400/30 text-white';
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={!!pickRed || revealDone}
                        className={`w-full text-left p-2 sm:p-2.5 md:p-3 rounded-xl border font-black text-xs sm:text-sm md:text-base truncate cursor-pointer transition-all duration-150 ${btnClass}`}
                        onClick={() => handlePickTeam('red', opt)}
                      >
                        🔴 {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Blue Team Panel */}
              <div className="rounded-2xl p-2.5 sm:p-3.5 md:p-4 border-2 border-blue-400/40 bg-gradient-to-b from-blue-950/50 to-black/40 shadow-lg">
                <div className="flex justify-between items-center mb-1.5 pb-1 border-b border-white/10">
                  <span className="font-black text-sm sm:text-base md:text-lg text-blue-400">
                    🔵 {lang === 'vi' ? 'ĐỘI XANH' : 'BLUE TEAM'}
                  </span>
                  <span className="font-black text-xs sm:text-sm md:text-base px-2.5 py-0.5 rounded-full bg-white/15">
                    {scoreBlue} {lang === 'vi' ? 'điểm' : 'pts'}
                  </span>
                </div>
                <div className={`text-xs sm:text-sm font-black mb-1.5 min-h-[18px] ${pickBlue ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {pickBlue
                    ? `${lang === 'vi' ? `Chốt #${pickOrderBlue}! 🔒` : `Locked #${pickOrderBlue}! 🔒`}`
                    : lang === 'vi'
                    ? 'Sẵn sàng chốt...'
                    : 'Ready to pick...'}
                </div>
                <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                  {shuffledAnswers.map((opt, idx) => {
                    let btnClass = 'border-white/20 bg-white/10 text-white hover:bg-white/20';
                    if (revealDone) {
                      if (opt === q.correctAnswer) {
                        btnClass = '!bg-emerald-700 !border-emerald-400 text-white shadow-[0_0_12px_rgba(52,211,153,0.5)]';
                      } else if (opt === pickBlue && pickBlue !== q.correctAnswer) {
                        btnClass = '!bg-rose-800 !border-rose-400 text-white';
                      }
                    } else if (pickBlue === opt) {
                      btnClass = 'border-amber-400 bg-amber-400/30 text-white';
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={!!pickBlue || revealDone}
                        className={`w-full text-left p-2 sm:p-2.5 md:p-3 rounded-xl border font-black text-xs sm:text-sm md:text-base truncate cursor-pointer transition-all duration-150 ${btnClass}`}
                        onClick={() => handlePickTeam('blue', opt)}
                      >
                        🔵 {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Reveal Answer Button */}
      {showRevealButton && (
        <div className="text-center my-1.5 shrink-0 animate-fade-in">
          <button
            className="btn-gold border-0 rounded-full px-8 py-3 md:px-12 md:py-4 text-sm sm:text-base md:text-xl font-black cursor-pointer bg-gradient-to-r from-sky-400 to-indigo-500 text-white shadow-xl hover:brightness-110 active:scale-98"
            onClick={revealCorrectAnswer}
          >
            🔍 {lang === 'vi' ? 'HIỆN ĐÁP ÁN ĐÚNG & TÍNH ĐIỂM' : 'REVEAL ANSWER & SCORE'}
          </button>
        </div>
      )}

      {/* Feedback Area */}
      {feedbackHtml && (
        <div className="text-center my-1 font-black shrink-0 leading-tight animate-fade-in bg-black/40 border border-white/15 rounded-2xl p-2.5 sm:p-3.5 md:p-4">
          <div className="text-base sm:text-lg md:text-2xl font-black mb-1">
            <span
              className={
                feedbackHtml.status === 'correct'
                  ? 'text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]'
                  : 'text-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.5)]'
              }
            >
              {feedbackHtml.title}
            </span>{' '}
            {feedbackHtml.pointsMsg && <span className="text-amber-300 ml-1">{feedbackHtml.pointsMsg}</span>}
          </div>

          {feedbackHtml.detailHtml}

          <div className="text-xs sm:text-sm md:text-base lg:text-lg text-slate-200 font-semibold mt-1 leading-relaxed">
            {feedbackHtml.explanation}
            {feedbackHtml.funFact && (
              <span className="block text-amber-300 font-bold mt-1">{feedbackHtml.funFact}</span>
            )}
          </div>
        </div>
      )}

      {/* Next Case Button */}
      {revealDone && (
        <div className="flex justify-center mt-1 shrink-0 animate-fade-in">
          <button
            className="border-0 rounded-full px-8 py-2.5 sm:px-10 sm:py-3.5 md:px-12 md:py-4 font-black text-sm sm:text-base md:text-xl cursor-pointer bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 shadow-[0_6px_25px_rgba(52,211,153,0.5)] hover:brightness-110 active:scale-98"
            onClick={handleNextCase}
          >
            {caseIndex < totalQuestions - 1
              ? lang === 'vi'
                ? 'VỤ ÁN TIẾP ➜'
                : 'NEXT CASE ➜'
              : lang === 'vi'
              ? 'TỔNG KẾT HỒ SƠ 🏆'
              : 'SEE SUMMARY 🏆'}
          </button>
        </div>
      )}
    </div>
  );
};
