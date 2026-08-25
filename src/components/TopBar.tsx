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
    <div className="flex justify-between items-center gap-2.5 flex-wrap mb-1 shrink-0">
      <div className="text-[18px] font-black tracking-tight select-none">
        🕵️ AI <b className="text-amber-400">{lang === 'vi' ? 'THÁM TỬ CÔNG SỞ' : 'OFFICE DETECTIVE'}</b>
      </div>
      <div className="flex gap-1.5 items-center flex-wrap">
        <button
          id="fullscreenBtn"
          className="badge-btn inline-flex items-center gap-1 px-2 py-1 rounded-full font-extrabold text-[11px] border border-white/20 bg-white/10 text-white cursor-pointer hover:bg-white/20 transition-all"
          onClick={toggleFullscreen}
        >
          ⛶ <span id="fsText">{isFullscreen ? (lang === 'vi' ? 'Thu nhỏ' : 'Exit Full') : (lang === 'vi' ? 'Toàn màn hình' : 'Fullscreen')}</span>
        </button>

        <button
          id="soundBtn"
          className="badge-btn inline-flex items-center gap-1 px-2 py-1 rounded-full font-extrabold text-[11px] border border-white/20 bg-white/10 text-white cursor-pointer hover:bg-white/20 transition-all"
          onClick={toggleSound}
        >
          {soundEnabled ? '🔊 Sound ON' : '🔇 Sound OFF'}
        </button>

        <button
          id="langVI"
          className={`badge-btn inline-flex items-center gap-1 px-2 py-1 rounded-full font-extrabold text-[11px] border border-white/20 text-white cursor-pointer transition-all ${
            lang === 'vi' ? 'bg-white/25 border-amber-400/50' : 'bg-white/10 hover:bg-white/20'
          }`}
          onClick={() => onSetLang('vi')}
        >
          🇻🇳 VI
        </button>

        <button
          id="langEN"
          className={`badge-btn inline-flex items-center gap-1 px-2 py-1 rounded-full font-extrabold text-[11px] border border-white/20 text-white cursor-pointer transition-all ${
            lang === 'en' ? 'bg-white/25 border-amber-400/50' : 'bg-white/10 hover:bg-white/20'
          }`}
          onClick={() => onSetLang('en')}
        >
          🇬🇧 EN
        </button>

        <button
          id="resetBtn"
          className="badge-btn inline-flex items-center gap-1 px-2 py-1 rounded-full font-extrabold text-[11px] border border-red-500/40 bg-red-500/20 text-white cursor-pointer hover:bg-red-500/30 transition-all"
          onClick={onReset}
        >
          🔄 Reset
        </button>

        <button
          id="endBtn"
          className="badge-btn inline-flex items-center gap-1 px-2 py-1 rounded-full font-extrabold text-[11px] border border-amber-500/40 bg-amber-500/20 text-white cursor-pointer hover:bg-amber-500/30 transition-all"
          onClick={onEndGame}
        >
          🏁 {lang === 'vi' ? 'Kết thúc' : 'End Game'}
        </button>
      </div>
    </div>
  );
};
