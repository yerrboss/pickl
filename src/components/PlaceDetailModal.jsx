// src/components/PlaceDetailModal.jsx
import React from 'react';

export default function PlaceDetailModal({ place, onClose, onToggleCourse, isAdded }) {
  if (!place) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#18181b] border border-zinc-700/80 rounded-3xl overflow-hidden shadow-2xl text-white">
        
        {/* 닫기 버튼 */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 bg-black/60 hover:bg-black text-zinc-300 rounded-full flex items-center justify-center transition-colors"
        >
          ✕
        </button>

        {/* 상단 이미지 영역 */}
        <div className="relative h-64 w-full">
          <img src={place.image} alt={place.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#18181b] via-transparent to-black/40" />
          <div className="absolute bottom-4 left-5 right-5">
            <div className="flex gap-2 mb-2">
              <span className="px-3 py-1 bg-lime-400 text-black text-xs font-bold rounded-full">
                {place.category}
              </span>
              <span className="px-3 py-1 bg-zinc-800/90 text-zinc-200 text-xs font-medium rounded-full">
                {place.categoryTag || '핫플레이스'}
              </span>
            </div>
            <h2 className="text-2xl font-black text-white">{place.name}</h2>
          </div>
        </div>

        {/* 상세 본문 콘텐츠 */}
        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto custom-scrollbar">
          
          {/* 평점 / 리뷰 / 대기시간 요약 바 */}
          <div className="grid grid-cols-3 gap-2 bg-zinc-900/80 p-3 rounded-2xl text-center border border-zinc-800">
            <div>
              <p className="text-[10px] text-zinc-400">평점</p>
              <p className="text-sm font-bold text-amber-400">★ {place.rating}</p>
            </div>
            <div>
              <p className="text-[10px] text-zinc-400">대기 상태</p>
              <p className="text-sm font-bold text-lime-400">{place.waitingTime}</p>
            </div>
            <div>
              <p className="text-[10px] text-zinc-400">리뷰 수</p>
              <p className="text-sm font-bold text-zinc-200">{place.reviews}개</p>
            </div>
          </div>

          {/* 소개글 */}
          <div>
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">소개</h4>
            <p className="text-sm text-zinc-200 leading-relaxed">{place.description}</p>
          </div>

          {/* 주요 정보 목록 */}
          <div className="space-y-2.5 text-sm">
            <div className="flex items-start gap-3">
              <span className="text-zinc-400 w-16 shrink-0">📍 주소</span>
              <span className="text-zinc-200 font-medium">{place.address}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-zinc-400 w-16 shrink-0">📞 전화</span>
              <span className="text-zinc-200">{place.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-zinc-400 w-16 shrink-0">⏰ 영업시간</span>
              <span className="text-zinc-200">{place.hours}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-zinc-400 w-16 shrink-0">💵 예상가격</span>
              <span className="text-lime-400 font-semibold">{place.price}</span>
            </div>
            {place.rawCategory && (
              <div className="flex items-center gap-3">
                <span className="text-zinc-400 w-16 shrink-0">🏷️ 분류</span>
                <span className="text-zinc-400 text-xs">{place.rawCategory}</span>
              </div>
            )}
          </div>

          {/* 카카오 지도 상세 링크 */}
          {place.url && (
            <div className="pt-2">
              <a 
                href={place.url} 
                target="_blank" 
                rel="noreferrer" 
                className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 underline font-medium"
              >
                카카오맵에서 지도로 위치 및 실시간 길찾기 보기 ↗
              </a>
            </div>
          )}
        </div>

        {/* 하단 액션 버튼 */}
        <div className="p-4 bg-zinc-900 border-t border-zinc-800 flex gap-3">
          <button
            onClick={() => onToggleCourse(place)}
            className={`flex-1 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 ${
              isAdded 
                ? 'bg-zinc-800 text-lime-400 border border-lime-400/40' 
                : 'bg-lime-400 hover:bg-lime-300 text-black shadow-lg shadow-lime-400/20'
            }`}
          >
            {isAdded ? '✓ 코스에서 제거하기' : '+ 코스에 추가하기'}
          </button>
        </div>

      </div>
    </div>
  );
}