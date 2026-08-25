import React from 'react';
import { GameMode, Language } from '../types';

interface HeroScreenProps {
  lang: Language;
  gameMode: GameMode;
  onSetMode: (mode: GameMode) => void;
  onStart: () => void;
}

export const HeroScreen: React.FC<HeroScreenProps> = ({
  lang,
  gameMode,
  onSetMode,
  onStart,
}) => {
  return (
    <div className="hero text-center py-2 flex flex-col justify-center items-center h-full">
      <div className="text-[50px] mb-1.5 animate-bounce">🕵️‍♂️</div>
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-1.5 tracking-tight">
        AI THÁM TỬ <span className="text-amber-400">CÔNG SỞ</span>
      </h1>
      <p className="text-slate-300 text-sm sm:text-base mb-4 max-w-lg">
        {lang === 'vi'
          ? 'Nhìn tình huống → Tìm manh mối → Phá bẫy → Trả lời đúng!'
          : 'Observe → Find clues → Avoid traps → Choose right!'}
      </p>

      <div className="flex justify-center gap-3 mb-5 flex-wrap">
        <button
          className={`px-4 py-2 rounded-xl border-2 font-extrabold text-[13px] cursor-pointer transition-all ${
            gameMode === 'solo'
              ? 'border-amber-400 bg-gradient-to-br from-amber-400/25 to-orange-500/25 shadow-[0_0_15px_rgba(250,204,21,0.3)] text-white'
              : 'border-white/20 bg-white/5 text-slate-300 hover:bg-white/10'
          }`}
          onClick={() => onSetMode('solo')}
        >
          👤 {lang === 'vi' ? 'Chơi Đơn (1 Người)' : 'Solo Mode'}
        </button>
        <button
          className={`px-4 py-2 rounded-xl border-2 font-extrabold text-[13px] cursor-pointer transition-all ${
            gameMode === 'versus'
              ? 'border-amber-400 bg-gradient-to-br from-amber-400/25 to-orange-500/25 shadow-[0_0_15px_rgba(250,204,21,0.3)] text-white'
              : 'border-white/20 bg-white/5 text-slate-300 hover:bg-white/10'
          }`}
          onClick={() => onSetMode('versus')}
        >
          ⚔️ {lang === 'vi' ? 'Thách Đấu (2 Đội)' : '2-Team Versus'}
        </button>
      </div>

      <button
        className="btn-gold border-0 rounded-full px-7 py-2.5 text-sm sm:text-base font-black cursor-pointer bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-slate-900 shadow-[0_6px_20px_rgba(250,204,21,0.35)] hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(250,204,21,0.5)] transition-all"
        onClick={onStart}
      >
        🚨 {lang === 'vi' ? 'BẮT ĐẦU VỤ ÁN' : 'START GAME'}
      </button>
    </div>
  );
};
