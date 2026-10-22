// src/components/ShareModal.jsx
import React, { useState } from 'react';
import { X, Copy, Check, Share2, Sparkles } from 'lucide-react';

export function ShareModal({ isOpen, onClose, shareUrl, theme = 'v2' }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const getThemeStyles = () => {
    switch (theme) {
      case 'v1':
        return {
          bg: 'bg-[#12141F] text-white border-indigo-600',
          btn: 'bg-indigo-600 hover:bg-indigo-500 text-white',
          accent: 'text-indigo-400'
        };
      case 'v3':
        return {
          bg: 'bg-neutral-900 text-white border-fuchsia-500',
          btn: 'bg-fuchsia-500 hover:bg-fuchsia-600 text-white',
          accent: 'text-fuchsia-400'
        };
      case 'v2':
      default:
        return {
          bg: 'bg-zinc-900 text-white border-lime-400',
          btn: 'bg-lime-400 hover:bg-lime-300 text-black',
          accent: 'text-lime-400'
        };
    }
  };

  const style = getThemeStyles();

  return (
    <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className={`${style.bg} border-2 max-w-md w-full p-6 rounded-3xl space-y-5 shadow-2xl relative animate-in fade-in zoom-in duration-200`}>
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="flex items-center gap-1.5 font-black text-base">
            <Share2 className={`w-5 h-5 ${style.accent}`} />
            <span>나만의 핫플 코스 공유하기</span>
          </div>
          <p className="text-xs text-zinc-400">
            생성된 공유 링크를 통해 친구들과 코스를 실시간으로 공유할 수 있습니다.
          </p>
        </div>

        {/* 링크 표시 및 복사 박스 */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-zinc-400">공유 전용 링크</label>
          <div className="flex items-center gap-2 bg-black/50 border border-zinc-700 rounded-xl p-2">
            <input 
              type="text" 
              readOnly 
              value={shareUrl} 
              className="bg-transparent text-xs text-zinc-200 flex-1 px-2 focus:outline-none truncate"
            />
            <button
              onClick={handleCopy}
              className={`px-4 py-2 rounded-lg font-black text-xs flex items-center gap-1.5 transition shrink-0 ${style.btn}`}
            >
              {copied ? <><Check className="w-3.5 h-3.5" /> 복사됨</> : <><Copy className="w-3.5 h-3.5" /> 링크 복사</>}
            </button>
          </div>
        </div>

        <div className="pt-2 text-center">
          <p className="text-[10px] text-zinc-500">
            💡 친구가 이 링크를 누르면 저장된 핫플 코스 동선이 그대로 열립니다!
          </p>
        </div>
      </div>
    </div>
  );
}