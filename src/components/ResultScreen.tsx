import React, { useEffect } from 'react';
import { GameMode, Language } from '../types';
import { FinalGameStats } from './GameScreen';
import { sfx } from '../utils/sound';

interface ResultScreenProps {
  stats: FinalGameStats;
  gameMode: GameMode;
  lang: Language;
  onPlayAgain: () => void;
  triggerFireworks: (x: number, y: number, count?: number) => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  stats,
  gameMode,
  lang,
  onPlayAgain,
  triggerFireworks,
}) => {
  useEffect(() => {
    sfx.playFanfare();
    sfx.playFireworksSound();
    triggerFireworks(window.innerWidth / 2, window.innerHeight / 2, 120);
    setTimeout(() => {
      triggerFireworks(window.innerWidth / 3, window.innerHeight / 3, 70);
    }, 400);
    setTimeout(() => {
      triggerFireworks((window.innerWidth * 2) / 3, window.innerHeight / 3, 70);
    }, 800);
  }, [triggerFireworks]);

  const formatTime = (secs = 0) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (gameMode === 'solo') {
    const totalQ = stats.totalQuestions || 20;
    const accuracy = Math.round((stats.right / totalQ) * 100);
    const rankTitle =
      accuracy >= 90
        ? lang === 'vi'
          ? '🏆 THÁM TỬ HUYỀN THOẠI'
          : '🏆 LEGENDARY DETECTIVE'
        : accuracy >= 75
        ? lang === 'vi'
          ? '🔥 CAO THỦ PHÁ ÁN'
          : '🔥 MASTER DETECTIVE'
        : accuracy >= 55
        ? lang === 'vi'
          ? '😎 THÁM TỬ TIỀM NĂNG'
          : '😎 PROMISING DETECTIVE'
        : lang === 'vi'
        ? '😂 TÂN BINH THỰC TẬP'
        : '😂 ROOKIE DETECTIVE';

    return (
      <div className="text-center p-3 sm:p-5 md:p-8 flex flex-col justify-center items-center h-full max-w-4xl mx-auto overflow-y-auto sm:overflow-hidden">
        <div className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl mb-2 sm:mb-3 md:mb-4 animate-bounce drop-shadow-[0_0_30px_rgba(250,204,21,0.5)] select-none">
          {accuracy >= 75 ? '🏆' : '🤣'}
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-2 sm:mb-3 text-white tracking-tight">
          {lang === 'vi' ? 'TỔNG KẾT HỒ SƠ PHÁ ÁN' : 'INVESTIGATION SUMMARY'}
        </h2>
        <div className="flex justify-center gap-2.5 sm:gap-4 md:gap-6 flex-wrap my-3 sm:my-4 md:my-6 w-full">
          <div className="min-w-[120px] sm:min-w-[140px] md:min-w-[170px] border-2 border-white/20 p-2.5 sm:p-3.5 md:p-5 rounded-2xl md:rounded-3xl bg-white/5 shadow-lg">
            <strong className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-amber-400">{stats.score}</strong>
            <span className="text-xs sm:text-sm md:text-base text-slate-200 font-bold mt-1 block">
              {lang === 'vi' ? 'Tổng điểm' : 'Total Score'}
            </span>
          </div>
          <div className="min-w-[120px] sm:min-w-[140px] md:min-w-[170px] border-2 border-white/20 p-2.5 sm:p-3.5 md:p-5 rounded-2xl md:rounded-3xl bg-white/5 shadow-lg">
            <strong className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-emerald-400">
              {stats.right}/{totalQ}
            </strong>
            <span className="text-xs sm:text-sm md:text-base text-slate-200 font-bold mt-1 block">
              {lang === 'vi' ? 'Câu đúng' : 'Correct'}
            </span>
          </div>
          <div className="min-w-[120px] sm:min-w-[140px] md:min-w-[170px] border-2 border-white/20 p-2.5 sm:p-3.5 md:p-5 rounded-2xl md:rounded-3xl bg-white/5 shadow-lg">
            <strong className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-sky-400">{accuracy}%</strong>
            <span className="text-xs sm:text-sm md:text-base text-slate-200 font-bold mt-1 block">
              {lang === 'vi' ? 'Chính xác' : 'Accuracy'}
            </span>
          </div>
          <div className="min-w-[120px] sm:min-w-[140px] md:min-w-[170px] border-2 border-cyan-400/40 p-2.5 sm:p-3.5 md:p-5 rounded-2xl md:rounded-3xl bg-cyan-950/30 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
            <strong className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-cyan-300 font-mono">
              {formatTime(stats.elapsedSeconds)}
            </strong>
            <span className="text-xs sm:text-sm md:text-base text-slate-200 font-bold mt-1 block">
              {lang === 'vi' ? '⏱️ Thời gian' : '⏱️ Total Time'}
            </span>
          </div>
        </div>
        <div className="text-base sm:text-xl md:text-2xl lg:text-3xl font-black my-2 sm:my-3 md:my-4 text-amber-300 px-5 sm:px-8 py-1.5 sm:py-2 md:py-2.5 rounded-full bg-amber-400/20 border-2 border-amber-400/40 shadow-md">
          {rankTitle}
        </div>
        <button
          className="btn-gold border-0 rounded-full px-7 py-3 sm:px-9 sm:py-3.5 md:px-11 md:py-4 text-sm sm:text-base md:text-lg font-black cursor-pointer bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 shadow-xl hover:brightness-110 transition-all mt-2 active:scale-98"
          onClick={onPlayAgain}
        >
          🔄 {lang === 'vi' ? 'PHÁ ÁN LẠI TỪ ĐẦU' : 'PLAY AGAIN'}
        </button>
      </div>
    );
  }

  // Versus Mode Results
  const totalQ = stats.totalQuestions || 20;
  let winnerText = '';
  let winnerEmoji = '🏆';
  if (stats.scoreRed > stats.scoreBlue) {
    winnerText = lang === 'vi' ? '🔴 ĐỘI ĐỎ CHIẾN THẮNG!' : '🔴 RED TEAM WINS!';
  } else if (stats.scoreBlue > stats.scoreRed) {
    winnerText = lang === 'vi' ? '🔵 ĐỘI XANH CHIẾN THẮNG!' : '🔵 BLUE TEAM WINS!';
  } else {
    winnerText = lang === 'vi' ? '🤝 HAI ĐỘI HÒA NHAU!' : "🤝 IT'S A TIE!";
    winnerEmoji = '⚔️';
  }

  return (
    <div className="text-center p-3 sm:p-5 md:p-8 flex flex-col justify-center items-center h-full max-w-4xl mx-auto overflow-y-auto sm:overflow-hidden">
      <div className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl mb-2 sm:mb-3 md:mb-4 animate-bounce drop-shadow-[0_0_30px_rgba(250,204,21,0.5)] select-none">
        {winnerEmoji}
      </div>
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-2 sm:mb-3 text-white tracking-tight">
        {winnerText}
      </h2>
      <div className="flex justify-center gap-3 sm:gap-5 md:gap-7 flex-wrap my-3 sm:my-4 md:my-6 w-full">
        <div className="min-w-[140px] sm:min-w-[180px] md:min-w-[220px] border-2 border-red-400/50 p-3 sm:p-4 md:p-5 rounded-2xl md:rounded-3xl bg-gradient-to-b from-red-950/60 to-black/40 shadow-xl">
          <strong className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-rose-400">{stats.scoreRed}</strong>
          <span className="text-xs sm:text-sm md:text-base text-rose-200 font-black mt-1.5 block">
            🔴 {lang === 'vi' ? 'Đội Đỏ' : 'Red Team'} ({stats.rightRed}/{totalQ} {lang === 'vi' ? 'đúng' : 'correct'})
          </span>
        </div>
        <div className="min-w-[140px] sm:min-w-[180px] md:min-w-[220px] border-2 border-blue-400/50 p-3 sm:p-4 md:p-5 rounded-2xl md:rounded-3xl bg-gradient-to-b from-blue-950/60 to-black/40 shadow-xl">
          <strong className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-blue-400">{stats.scoreBlue}</strong>
          <span className="text-xs sm:text-sm md:text-base text-blue-200 font-black mt-1.5 block">
            🔵 {lang === 'vi' ? 'Đội Xanh' : 'Blue Team'} ({stats.rightBlue}/{totalQ} {lang === 'vi' ? 'đúng' : 'correct'})
          </span>
        </div>
      </div>
      <div className="text-xs sm:text-sm md:text-base font-black text-cyan-300 bg-cyan-950/50 border border-cyan-400/40 px-4 py-1.5 rounded-full inline-block mb-3 font-mono shadow-md">
        ⏱️ {lang === 'vi' ? 'Tổng thời gian trận đấu:' : 'Total Match Time:'} {formatTime(stats.elapsedSeconds)}
      </div>
      <div>
        <button
          className="btn-gold border-0 rounded-full px-7 py-3 sm:px-9 sm:py-3.5 md:px-11 md:py-4 text-sm sm:text-base md:text-lg font-black cursor-pointer bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 shadow-xl hover:brightness-110 transition-all active:scale-98"
          onClick={onPlayAgain}
        >
          🔄 {lang === 'vi' ? 'THÁCH ĐẤU LẠI' : 'REMATCH'}
        </button>
      </div>
    </div>
  );
};
