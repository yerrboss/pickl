import React, { useState } from 'react';
import App1 from './App1';
import App2 from './App2';
import App3 from './App3';
import App4 from './App4';
import App5 from './App5';
import App6 from './App6';

import { NicknameModal } from './components/NicknameModal';
import { ShareModal } from './components/ShareModal';
import { LegalDisclaimerModal } from './components/LegalDisclaimerModal';
import { setLocalNickname, getLocalNickname, shareCourse } from './utils/courseShare';
import { ShieldAlert, Share2, User, BookmarkCheck } from 'lucide-react';

export default function App() {
  const [currentDesign, setCurrentDesign] = useState('v2');
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  
  const [sharing, setSharing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [nickname, setNickname] = useState(getLocalNickname());
  const [generatedShareUrl, setGeneratedShareUrl] = useState('');

  // 1. [저장 버튼] 클릭 시 동작
  const handleSaveClick = () => {
    const savedName = getLocalNickname();
    if (savedName) {
      executeAction(savedName, 'save');
    } else {
      setIsNicknameModalOpen(true);
    }
  };

  // 2. [코스 공유 버튼] 클릭 시 동작
  const handleShareClick = () => {
    const savedName = getLocalNickname();
    if (savedName) {
      executeAction(savedName, 'share');
    } else {
      setIsNicknameModalOpen(true);
    }
  };

  // 닉네임 입력 완료 후 동작
  const handleNicknameConfirm = (inputName) => {
    setLocalNickname(inputName);
    setNickname(inputName);
    setIsNicknameModalOpen(false);
  };

  // 실제 파이어베이스 저장 및 공유 처리
  const executeAction = async (authorName, actionType) => {
    try {
      if (actionType === 'save') setSaving(true);
      else setSharing(true);

      const mockSpots = [
        { name: "성수 힙스토어", category: "팝업스토어", lat: 37.5445, lng: 127.0560 },
        { name: "서울숲 루프탑 카페", category: "카페", lat: 37.5470, lng: 127.0530 }
      ];
      
      const courseId = await shareCourse(mockSpots, `${authorName}님의 핫플 코스`);
      const shareUrl = `${window.location.origin}?course=${courseId}`;
      setGeneratedShareUrl(shareUrl);

      if (actionType === 'save') {
        alert(`✨ '${authorName}'님 이름으로 코스가 안전하게 저장되었습니다!`);
      } else {
        setIsShareModalOpen(true); // 공유 모달 띄우기
      }
    } catch (e) {
      alert("작업 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
      setSharing(false);
    }
  };

  const getAccentButtonStyle = () => {
    switch (currentDesign) {
      case 'v1':
        return 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20';
      case 'v2':
        return 'bg-lime-400 hover:bg-lime-300 text-black shadow-lime-400/20';
      case 'v3':
        return 'bg-fuchsia-600 hover:bg-fuchsia-500 text-white shadow-fuchsia-600/20';
      case 'v4':
        return 'bg-cyan-400 hover:bg-cyan-300 text-black shadow-cyan-400/20';
      case 'v5':
        return 'bg-amber-100 hover:bg-amber-200 text-stone-900 shadow-amber-100/20';
      case 'v6':
      default:
        return 'bg-amber-400 hover:bg-amber-300 text-stone-950 shadow-amber-400/20';
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Modals */}
      <NicknameModal 
        isOpen={isNicknameModalOpen}
        onClose={() => setIsNicknameModalOpen(false)}
        onConfirm={handleNicknameConfirm}
        theme={currentDesign}
      />
      <ShareModal 
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        shareUrl={generatedShareUrl}
        theme={currentDesign}
      />
      <LegalDisclaimerModal 
        isOpen={isDisclaimerOpen} 
        onClose={() => setIsDisclaimerOpen(false)} 
      />

      {/* 우측 하단 플로팅 캡슐 (저장 버튼 + 코스 공유 버튼 분리) */}
      <div className="fixed bottom-6 right-6 z-[9999] bg-zinc-950/90 backdrop-blur-md border border-zinc-700 p-1.5 rounded-full shadow-2xl flex items-center gap-1.5">
        {nickname && (
          <div className="flex items-center gap-1.5 bg-zinc-800 text-amber-300 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap border border-zinc-700">
            <User className="w-3.5 h-3.5 text-amber-400" />
            <span>{nickname}</span>
          </div>
        )}

        {/* 저장 버튼 */}
        <button
          onClick={handleSaveClick}
          disabled={saving}
          className="flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3 py-1 rounded-full text-xs font-bold transition whitespace-nowrap border border-zinc-700 active:scale-95"
          title="코스 저장하기"
        >
          <BookmarkCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>{saving ? '저장 중...' : '저장'}</span>
        </button>

        {/* 코스 공유 버튼 (모달 호출) */}
        <button
          onClick={handleShareClick}
          disabled={sharing}
          className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black transition whitespace-nowrap active:scale-95 shadow-md ${getAccentButtonStyle()}`}
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{sharing ? '생성 중...' : '코스 공유'}</span>
        </button>

        {/* 법적고지 */}
        <button
          onClick={() => setIsDisclaimerOpen(true)}
          className="flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2.5 py-1 rounded-full text-xs font-bold transition whitespace-nowrap border border-zinc-700"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          <span className="hidden sm:inline">법적고지</span>
        </button>
      </div>

      {/* 하단 디자인 토글 바 (각 버전별 고유 컬러 완벽 복원) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9998] bg-zinc-950/90 backdrop-blur-md border border-zinc-700 p-1.5 rounded-full shadow-2xl flex gap-1 overflow-x-auto max-w-[80vw] md:max-w-none">
        <button
          onClick={() => setCurrentDesign('v1')}
          className={`px-3 py-1 rounded-full text-xs font-bold transition whitespace-nowrap ${
            currentDesign === 'v1' ? 'bg-indigo-600 text-white shadow-[0_0_12px_rgba(79,70,229,0.5)]' : 'text-zinc-400 hover:text-white'
          }`}
        >
          v1 라이트
        </button>
        <button
          onClick={() => setCurrentDesign('v2')}
          className={`px-3 py-1 rounded-full text-xs font-bold transition whitespace-nowrap ${
            currentDesign === 'v2' ? 'bg-lime-400 text-black shadow-[0_0_12px_rgba(163,230,53,0.5)]' : 'text-zinc-400 hover:text-white'
          }`}
        >
          v2 네온다크(Pick;L)
        </button>
        <button
          onClick={() => setCurrentDesign('v3')}
          className={`px-3 py-1 rounded-full text-xs font-bold transition whitespace-nowrap ${
            currentDesign === 'v3' ? 'bg-fuchsia-600 text-white shadow-[0_0_12px_rgba(217,70,239,0.5)]' : 'text-zinc-400 hover:text-white'
          }`}
        >
          v3 숏폼/벤토
        </button>
        <button
          onClick={() => setCurrentDesign('v4')}
          className={`px-3 py-1 rounded-full text-xs font-bold transition whitespace-nowrap ${
            currentDesign === 'v4' ? 'bg-cyan-400 text-black shadow-[0_0_12px_rgba(34,211,238,0.5)]' : 'text-zinc-400 hover:text-white'
          }`}
        >
          v4 Y2K 사이버
        </button>
        <button
          onClick={() => setCurrentDesign('v5')}
          className={`px-3 py-1 rounded-full text-xs font-bold transition whitespace-nowrap ${
            currentDesign === 'v5' ? 'bg-amber-100 text-stone-900 shadow-[0_0_12px_rgba(253,230,138,0.5)]' : 'text-zinc-400 hover:text-white'
          }`}
        >
          v5 에디토리얼
        </button>
        <button
          onClick={() => setCurrentDesign('v6')}
          className={`px-3 py-1 rounded-full text-xs font-bold transition whitespace-nowrap ${
            currentDesign === 'v6' ? 'bg-amber-400 text-stone-950 font-black shadow-[0_0_12px_rgba(251,191,36,0.5)]' : 'text-zinc-400 hover:text-white'
          }`}
        >
          v6 RPG 맵
        </button>
      </div>

      {/* Render Active Design */}
      {currentDesign === 'v1' && <App1 currentDesign="v1" />}
      {currentDesign === 'v2' && <App2 currentDesign="v2" />}
      {currentDesign === 'v3' && <App3 currentDesign="v3" />}
      {currentDesign === 'v4' && <App4 />}
      {currentDesign === 'v5' && <App5 />}
      {currentDesign === 'v6' && <App6 />}
    </div>
  );
}