import React from 'react';

export function LegalDisclaimerModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white text-stone-900 border-4 border-stone-900 max-w-md w-full p-6 space-y-4 shadow-[6px_6px_0px_#292524] font-sans">
        <div className="border-b-2 border-stone-900 pb-3">
          <h3 className="font-extrabold text-base flex items-center gap-2">
            🛡️ 서비스 이용 및 법적 면책 고지
          </h3>
        </div>
        
        <div className="text-xs text-stone-600 space-y-2.5 max-h-56 overflow-y-auto leading-relaxed pr-1">
          <p>
            1. <strong>Pick;L(픽클)</strong>은 사용자 간 핫플레이스 코스 추천 및 공유를 위해 최선의 정보를 제공하나, 앱 내 제공되는 영업시간, 위치, 가격 등의 정보는 실제와 차이가 있을 수 있습니다.
          </p>
          <p>
            2. 본 서비스는 사용자 개인이 생성한 동선 코스 및 UGC(사용자 생성 콘텐츠)로 인해 발생하는 민·형사상 손해에 대해 어떠한 법적 책임도 지지 않습니다.
          </p>
          <p>
            3. 본 서비스는 로그인 없는 간편 서비스를 제공하며, 사용자가 직접 설정한 닉네임 및 생성한 코스 정보 외의 어떠한 민감 개인정보도 수집·저장하지 않습니다. (개인정보보호법 준수)
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-stone-900 text-amber-300 font-black text-xs uppercase tracking-wider hover:bg-stone-800 transition shadow-[2px_2px_0px_#fde047]"
        >
          동의하고 계속하기
        </button>
      </div>
    </div>
  );
}