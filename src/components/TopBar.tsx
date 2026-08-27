import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { sfx } from '../utils/sound';

interface TopBarProps {
  lang: Language;
  onSetLang: (lang: Language) => void;
  onReset: () => void;
  onEndGame: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  lang,
  onSetLang,
  onReset,
  onEndGame,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const toggleSound = () => {
    sfx.enabled = !sfx.enabled;
    setSoundEnabled(sfx.enabled);
  };

  return (
    <div className="flex justify-between items-center gap-3 flex-wrap mb-2 shrink-0">
      <div className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight select-none flex items-center gap-2">
        <span>🕵️ AI</span>
        <b className="text-amber-400">{lang === 'vi' ? 'THÁM TỬ CÔNG SỞ' : 'OFFICE DETECTIVE'}</b>
      </div>
      <div className="flex gap-2 items-center flex-wrap">
        <button
          id="fullscreenBtn"
          className="badge-btn inline-flex items-center gap-1.5 px-3 py-1.5 md:px-3.5 md:py-2 rounded-full font-black text-xs md:text-sm border border-white/20 bg-white/10 text-white cursor-pointer hover:bg-white/20 transition-all"
          onClick={toggleFullscreen}
        >
          ⛶ <span id="fsText">{isFullscreen ? (lang === 'vi' ? 'Thu nhỏ' : 'Exit Full') : (lang === 'vi' ? 'Toàn màn hình' : 'Fullscreen')}</span>
        </button>

        <button
          id="soundBtn"
          className="badge-btn inline-flex items-center gap-1.5 px-3 py-1.5 md:px-3.5 md:py-2 rounded-full font-black text-xs md:text-sm border border-white/20 bg-white/10 text-white cursor-pointer hover:bg-white/20 transition-all"
          onClick={toggleSound}
        >
          {soundEnabled
            ? (lang === 'vi' ? '🔊 Âm thanh: BẬT' : '🔊 Sound: ON')
            : (lang === 'vi' ? '🔇 Âm thanh: TẮT' : '🔇 Sound: OFF')}
        </button>

        <button
          id="langVI"
          className={`badge-btn inline-flex items-center gap-1.5 px-3 py-1.5 md:px-3.5 md:py-2 rounded-full font-black text-xs md:text-sm border border-white/20 text-white cursor-pointer transition-all ${
            lang === 'vi' ? 'bg-white/25 border-amber-400 shadow-[0_0_10px_rgba(250,204,21,0.3)]' : 'bg-white/10 hover:bg-white/20'
          }`}
          onClick={() => onSetLang('vi')}
        >
          🇻🇳 VI
        </button>

        <button
          id="langEN"
          className={`badge-btn inline-flex items-center gap-1.5 px-3 py-1.5 md:px-3.5 md:py-2 rounded-full font-black text-xs md:text-sm border border-white/20 text-white cursor-pointer transition-all ${
            lang === 'en' ? 'bg-white/25 border-amber-400 shadow-[0_0_10px_rgba(250,204,21,0.3)]' : 'bg-white/10 hover:bg-white/20'
          }`}
          onClick={() => onSetLang('en')}
        >
          🇬🇧 EN
        </button>

        <button
          id="resetBtn"
          className="badge-btn inline-flex items-center gap-1.5 px-3.5 py-1.5 md:px-4 md:py-2 rounded-full font-black text-xs md:text-sm border border-red-500/50 bg-red-500/25 text-white cursor-pointer hover:bg-red-500/35 transition-all shadow-[0_0_10px_rgba(239,68,68,0.2)]"
          onClick={onReset}
        >
          🔄 {lang === 'vi' ? 'Làm mới' : 'Reset'}
        </button>

        <button
          id="endBtn"
          className="badge-btn inline-flex items-center gap-1.5 px-3.5 py-1.5 md:px-4 md:py-2 rounded-full font-black text-xs md:text-sm border border-amber-500/50 bg-amber-500/25 text-white cursor-pointer hover:bg-amber-500/35 transition-all shadow-[0_0_10px_rgba(245,158,11,0.2)]"
          onClick={onEndGame}
        >
          🏁 {lang === 'vi' ? 'Kết thúc' : 'End Game'}
        </button>
      </div>
    </div>
  );
};
