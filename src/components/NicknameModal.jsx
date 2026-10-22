import React, { useState } from 'react';
import { User, X, Sparkles } from 'lucide-react';

export function NicknameModal({ isOpen, onClose, onConfirm, theme = 'v2' }) {
  const [nameInput, setNameInput] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    onConfirm(nameInput.trim());
    setNameInput('');
  };

  const getThemeStyles = () => {
    switch (theme) {
      case 'v1':
        return {
          bg: 'bg-[#12141F] text-white border-indigo-600',
          accentBg: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30',
          inputBorder: 'focus:border-indigo-500 focus:ring-indigo-500/20',
          iconColor: 'text-indigo-400'
        };
      case 'v3':
        return {
          bg: 'bg-neutral-900 text-white border-fuchsia-500',
          accentBg: 'bg-fuchsia-500 hover:bg-fuchsia-600 text-white shadow-[0_0_15px_rgba(217,70,239,0.4)]',
          inputBorder: 'focus:border-fuchsia-500 focus:ring-fuchsia-500/20',
          iconColor: 'text-fuchsia-400'
        };
      case 'v2':
      default:
        return {
          bg: 'bg-zinc-900 text-white border-lime-400',
          accentBg: 'bg-lime-400 hover:bg-lime-300 text-black shadow-[0_0_15px_rgba(163,230,53,0.3)]',
          inputBorder: 'focus:border-lime-400 focus:ring-lime-400/20',
          iconColor: 'text-lime-400'
        };
    }
  };

  const style = getThemeStyles();

  return (
    <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className={`${style.bg} border-2 max-w-sm w-full p-6 rounded-3xl space-y-4 shadow-2xl relative animate-in fade-in zoom-in duration-200`}>
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="flex items-center gap-1.5 font-black text-base">
            <Sparkles className={`w-4 h-4 ${style.iconColor}`} />
            <span>나만의 코스 공유하기</span>
          </div>
          <p className="text-xs text-zinc-400">
            공유 링크에 표시될 멋진 닉네임을 입력해주세요! (최대 10글자)
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <User className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="예: 힙한지혜"
              maxLength={10}
              className={`w-full pl-9 pr-3 py-2.5 bg-black/40 border border-zinc-700 text-xs font-bold rounded-xl focus:outline-none focus:ring-2 ${style.inputBorder}`}
              autoFocus
            />
          </div>

          <button
            type="submit"
            className={`w-full py-3 font-black text-xs uppercase tracking-wider rounded-xl transition active:scale-95 ${style.accentBg}`}
          >
            링크 생성 및 공유하기 ✨
          </button>
        </form>
      </div>
    </div>
  );
}