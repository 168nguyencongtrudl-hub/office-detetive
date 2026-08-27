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
    <div className="hero text-center py-4 md:py-8 flex flex-col justify-center items-center h-full max-w-4xl mx-auto">
      <div className="text-7xl sm:text-8xl md:text-9xl mb-3 md:mb-5 animate-bounce drop-shadow-[0_0_25px_rgba(250,204,21,0.4)] select-none">
        🕵️‍♂️
      </div>
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-3 tracking-tight drop-shadow-md">
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
      <p className="text-slate-200 text-base sm:text-xl md:text-2xl font-bold mb-6 md:mb-8 max-w-2xl leading-relaxed">
        {lang === 'vi'
          ? 'Nhìn tình huống → Tìm manh mối → Phá bẫy → Đoán đúng nhân vật!'
          : 'Observe situations → Spot clues → Avoid traps → Pick the right role!'}
      </p>

      <div className="flex justify-center gap-4 md:gap-6 mb-8 md:mb-10 flex-wrap">
        <button
          className={`px-6 py-3.5 md:px-8 md:py-4 rounded-2xl border-2 font-black text-sm sm:text-base md:text-lg cursor-pointer transition-all duration-200 shadow-lg ${
            gameMode === 'solo'
              ? 'border-amber-400 bg-gradient-to-br from-amber-400/30 to-orange-500/30 shadow-[0_0_20px_rgba(250,204,21,0.4)] text-white scale-105'
              : 'border-white/20 bg-white/5 text-slate-300 hover:bg-white/15 hover:scale-102'
          }`}
          onClick={() => onSetMode('solo')}
        >
          👤 {lang === 'vi' ? 'Chơi Đơn (1 Người)' : 'Solo Mode (1 Player)'}
        </button>
        <button
          className={`px-6 py-3.5 md:px-8 md:py-4 rounded-2xl border-2 font-black text-sm sm:text-base md:text-lg cursor-pointer transition-all duration-200 shadow-lg ${
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
        className="btn-gold border-0 rounded-full px-10 py-4 md:px-14 md:py-5 text-lg sm:text-xl md:text-2xl font-black cursor-pointer bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-slate-950 shadow-[0_8px_30px_rgba(250,204,21,0.5)] hover:-translate-y-1 hover:shadow-[0_12px_35px_rgba(250,204,21,0.7)] transition-all active:scale-98"
        onClick={onStart}
      >
        🚨 {lang === 'vi' ? 'BẮT ĐẦU VỤ ÁN NGAY' : 'START INVESTIGATION'}
      </button>
    </div>
  );
};
