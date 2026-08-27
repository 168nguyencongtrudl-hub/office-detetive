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
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-5 backdrop-blur-sm">
      <div className="w-[min(500px,92vw)] bg-slate-900 border-2 border-white/20 rounded-3xl p-6 sm:p-8 text-center shadow-2xl">
        <div className="text-6xl mb-3">{type === 'reset' ? '🔄' : '🏁'}</div>
        <h3 className={`text-2xl sm:text-3xl font-black my-3 ${type === 'reset' ? 'text-amber-400' : 'text-rose-400'}`}>
          {type === 'reset'
            ? (lang === 'vi' ? 'LÀM MỚI TRÒ CHƠI?' : 'RESET GAME?')
            : (lang === 'vi' ? 'KẾT THÚC TRÒ CHƠI?' : 'END GAME EARLY?')}
        </h3>
        <p className="text-slate-200 text-sm sm:text-base md:text-lg mb-6 leading-relaxed font-semibold">
          {type === 'reset'
            ? (lang === 'vi'
                ? 'Bạn muốn bắt đầu lại từ đầu? Mọi điểm số hiện tại sẽ được thiết lập lại.'
                : 'Start over from the beginning? Current score will be reset.')
            : (lang === 'vi'
                ? 'Dừng cuộc chơi và chuyển ngay đến bảng tổng kết điểm số?'
                : 'Stop game and see final investigation summary right now?')}
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            className={`btn-gold font-black px-7 py-3 rounded-full text-base cursor-pointer transition-all shadow-xl active:scale-95 ${
              type === 'end'
                ? 'bg-gradient-to-r from-rose-500 to-rose-700 text-white hover:brightness-110 shadow-rose-500/30'
                : 'bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 hover:brightness-110 shadow-amber-400/30'
            }`}
            onClick={onConfirm}
          >
            {type === 'reset'
              ? (lang === 'vi' ? 'ĐỒNG Ý' : 'YES')
              : (lang === 'vi' ? 'KẾT THÚC' : 'END NOW')}
          </button>
          <button
            className="px-7 py-3 rounded-full text-base font-black bg-white/15 text-white hover:bg-white/25 cursor-pointer transition-all border border-white/20 active:scale-95"
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
