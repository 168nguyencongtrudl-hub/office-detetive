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
    <div className="hero text-center py-2 sm:py-4 md:py-6 flex flex-col justify-center items-center h-full max-w-4xl mx-auto overflow-y-auto sm:overflow-hidden">
      <div className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl mb-2 sm:mb-3 md:mb-4 animate-bounce drop-shadow-[0_0_25px_rgba(250,204,21,0.4)] select-none">
        🕵️‍♂️
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-2 sm:mb-3 tracking-tight drop-shadow-md">
        {lang === 'vi' ? (
          <>
            AI THÁM TỬ <span className="text-amber-400">CÔNG SỞ</span>
          </>
        ) : (
          <>
            AI OFFICE <span className="text-amber-400">DETECTIVE</span>
          </>
        )}
      </h1>
      <p className="text-slate-200 text-sm sm:text-lg md:text-xl font-bold mb-4 sm:mb-6 max-w-2xl leading-relaxed">
        {lang === 'vi'
          ? 'Nhìn tình huống → Tìm manh mối → Phá bẫy → Đoán đúng nhân vật!'
          : 'Observe situations → Spot clues → Avoid traps → Pick the right role!'}
      </p>

      <div className="flex justify-center gap-3 sm:gap-4 md:gap-6 mb-5 sm:mb-7 md:mb-8 flex-wrap">
        <button
          className={`px-5 py-3 sm:px-6 sm:py-3.5 md:px-8 md:py-4 rounded-2xl border-2 font-black text-xs sm:text-sm md:text-base cursor-pointer transition-all duration-200 shadow-lg ${
            gameMode === 'solo'
              ? 'border-amber-400 bg-gradient-to-br from-amber-400/30 to-orange-500/30 shadow-[0_0_20px_rgba(250,204,21,0.4)] text-white scale-105'
              : 'border-white/20 bg-white/5 text-slate-300 hover:bg-white/15 hover:scale-102'
          }`}
          onClick={() => onSetMode('solo')}
        >
          👤 {lang === 'vi' ? 'Chơi Đơn (1 Người)' : 'Solo Mode (1 Player)'}
        </button>
        <button
          className={`px-5 py-3 sm:px-6 sm:py-3.5 md:px-8 md:py-4 rounded-2xl border-2 font-black text-xs sm:text-sm md:text-base cursor-pointer transition-all duration-200 shadow-lg ${
            gameMode === 'versus'
              ? 'border-amber-400 bg-gradient-to-br from-amber-400/30 to-orange-500/30 shadow-[0_0_20px_rgba(250,204,21,0.4)] text-white scale-105'
              : 'border-white/20 bg-white/5 text-slate-300 hover:bg-white/15 hover:scale-102'
          }`}
          onClick={() => onSetMode('versus')}
        >
          ⚔️ {lang === 'vi' ? 'Thách Đấu (2 Đội Đỏ - Xanh)' : '2-Team Versus (Red vs Blue)'}
        </button>
      </div>

      <button
        className="btn-gold border-0 rounded-full px-8 py-3.5 sm:px-10 sm:py-4 md:px-12 md:py-4.5 text-base sm:text-lg md:text-xl font-black cursor-pointer bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-slate-950 shadow-[0_8px_30px_rgba(250,204,21,0.5)] hover:-translate-y-1 hover:shadow-[0_12px_35px_rgba(250,204,21,0.7)] transition-all active:scale-98"
        onClick={onStart}
      >
        🚨 {lang === 'vi' ? 'BẮT ĐẦU VỤ ÁN NGAY' : 'START INVESTIGATION'}
      </button>
    </div>
  );
};
