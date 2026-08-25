import React from 'react';
import { Language } from '../types';

interface ConfirmModalProps {
  type: 'reset' | 'end';
  lang: Language;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  type,
  lang,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-5 backdrop-blur-xs">
      <div className="w-[min(420px,90vw)] bg-slate-900 border border-white/20 rounded-2xl p-6 text-center shadow-2xl">
        <div className="text-5xl mb-2">{type === 'reset' ? '🔄' : '🏁'}</div>
        <h3 className={`text-xl font-black my-2.5 ${type === 'reset' ? 'text-amber-400' : 'text-rose-400'}`}>
          {type === 'reset'
            ? (lang === 'vi' ? 'RESET GAME?' : 'RESET GAME?')
            : (lang === 'vi' ? 'KẾT THÚC TRÒ CHƠI?' : 'END GAME EARLY?')}
        </h3>
        <p className="text-slate-300 text-sm mb-5 leading-relaxed">
          {type === 'reset'
            ? (lang === 'vi'
                ? 'Bạn muốn chơi lại từ đầu? Mọi điểm số hiện tại sẽ bị hủy.'
                : 'Start over from beginning? Current score will be reset.')
            : (lang === 'vi'
                ? 'Dừng cuộc chơi và tổng kết điểm số ngay bây giờ?'
                : 'Stop game and see final results right now?')}
        </p>
        <div className="flex gap-2.5 justify-center">
          <button
            className={`btn-gold font-black px-5 py-2.5 rounded-full text-sm cursor-pointer transition-all shadow-lg ${
              type === 'end'
                ? 'bg-gradient-to-r from-rose-500 to-rose-700 text-white hover:brightness-110 shadow-rose-500/30'
                : 'bg-gradient-to-r from-amber-400 to-orange-400 text-slate-900 hover:brightness-105 shadow-amber-400/30'
            }`}
            onClick={onConfirm}
          >
            {type === 'reset'
              ? (lang === 'vi' ? 'ĐỒNG Ý' : 'YES')
              : (lang === 'vi' ? 'KẾT THÚC' : 'END NOW')}
          </button>
          <button
            className="px-5 py-2.5 rounded-full text-sm font-bold bg-white/15 text-white hover:bg-white/25 cursor-pointer transition-all"
            onClick={onCancel}
          >
            {type === 'reset'
              ? (lang === 'vi' ? 'HỦY' : 'CANCEL')
              : (lang === 'vi' ? 'TIẾP TỤC' : 'CONTINUE')}
          </button>
        </div>
      </div>
    </div>
  );
};
