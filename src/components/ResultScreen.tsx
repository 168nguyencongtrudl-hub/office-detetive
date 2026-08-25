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
      <div className="text-center p-2.5 flex flex-col justify-center items-center h-full">
        <div className="text-6xl mb-1.5 animate-bounce">{accuracy >= 75 ? '🏆' : '🤣'}</div>
        <h2 className="text-xl sm:text-2xl font-black mb-2 text-white">
          {lang === 'vi' ? 'TỔNG KẾT HỒ SƠ PHÁ ÁN' : 'INVESTIGATION SUMMARY'}
        </h2>
        <div className="flex justify-center gap-2.5 flex-wrap my-3.5">
          <div className="min-w-[100px] border border-white/15 p-2.5 rounded-2xl bg-white/5">
            <strong className="block text-2xl font-black text-amber-400">{stats.score}</strong>
            <span className="text-xs text-slate-300">
              {lang === 'vi' ? 'Tổng điểm' : 'Total Score'}
            </span>
          </div>
          <div className="min-w-[100px] border border-white/15 p-2.5 rounded-2xl bg-white/5">
            <strong className="block text-2xl font-black text-emerald-400">
              {stats.right}/{totalQ}
            </strong>
            <span className="text-xs text-slate-300">
              {lang === 'vi' ? 'Câu đúng' : 'Correct'}
            </span>
          </div>
          <div className="min-w-[100px] border border-white/15 p-2.5 rounded-2xl bg-white/5">
            <strong className="block text-2xl font-black text-sky-400">{accuracy}%</strong>
            <span className="text-xs text-slate-300">
              {lang === 'vi' ? 'Chính xác' : 'Accuracy'}
            </span>
          </div>
          <div className="min-w-[100px] border border-cyan-400/30 p-2.5 rounded-2xl bg-cyan-950/20">
            <strong className="block text-2xl font-black text-cyan-300 font-mono">
              {formatTime(stats.elapsedSeconds)}
            </strong>
            <span className="text-xs text-slate-300">
              {lang === 'vi' ? '⏱️ Thời gian' : '⏱️ Total Time'}
            </span>
          </div>
        </div>
        <div className="text-lg font-black my-2.5 text-amber-300 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30">
          {rankTitle}
        </div>
        <button
          className="btn-gold border-0 rounded-full px-6 py-2.5 text-sm font-black cursor-pointer bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 shadow-lg hover:brightness-105 transition-all mt-2"
          onClick={onPlayAgain}
        >
          🔄 {lang === 'vi' ? 'PHÁ LẠI TỪ ĐẦU' : 'PLAY AGAIN'}
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
    <div className="text-center p-2.5 flex flex-col justify-center items-center h-full">
      <div className="text-6xl mb-1.5 animate-bounce">{winnerEmoji}</div>
      <h2 className="text-xl sm:text-2xl font-black mb-2 text-white">{winnerText}</h2>
      <div className="flex justify-center gap-3 flex-wrap my-3.5">
        <div className="min-w-[130px] border border-red-400/40 p-3 rounded-2xl bg-gradient-to-b from-red-950/40 to-black/20">
          <strong className="block text-3xl font-black text-rose-400">{stats.scoreRed}</strong>
          <span className="text-xs text-rose-200 font-bold">
            🔴 {lang === 'vi' ? 'Đội Đỏ' : 'Red Team'} ({stats.rightRed}/{totalQ} {lang === 'vi' ? 'đúng' : 'correct'})
          </span>
        </div>
        <div className="min-w-[130px] border border-blue-400/40 p-3 rounded-2xl bg-gradient-to-b from-blue-950/40 to-black/20">
          <strong className="block text-3xl font-black text-blue-400">{stats.scoreBlue}</strong>
          <span className="text-xs text-blue-200 font-bold">
            🔵 {lang === 'vi' ? 'Đội Xanh' : 'Blue Team'} ({stats.rightBlue}/{totalQ} {lang === 'vi' ? 'đúng' : 'correct'})
          </span>
        </div>
      </div>
      <div className="text-xs sm:text-sm font-black text-cyan-300 bg-cyan-950/40 border border-cyan-400/30 px-3.5 py-1.5 rounded-full inline-block mb-3 font-mono">
        ⏱️ {lang === 'vi' ? 'Tổng thời gian trận đấu:' : 'Total Match Time:'} {formatTime(stats.elapsedSeconds)}
      </div>
      <div>
        <button
          className="btn-gold border-0 rounded-full px-6 py-2.5 text-sm font-black cursor-pointer bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 shadow-lg hover:brightness-105 transition-all"
          onClick={onPlayAgain}
        >
          🔄 {lang === 'vi' ? 'THÁCH ĐẤU LẠI' : 'REMATCH'}
        </button>
      </div>
    </div>
  );
};
