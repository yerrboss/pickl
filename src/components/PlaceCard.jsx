// src/components/PlaceCard.jsx
import React from 'react';
import { Clock, Plus, Check } from 'lucide-react';

export default function PlaceCard({ place, onSelect, onToggleCourse, isAdded }) {
  return (
    <div 
      onClick={() => onSelect(place)}
      className="group relative bg-[#12141F] hover:bg-[#181A28] border border-white/10 hover:border-[#CCFF00]/50 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-xl cursor-pointer"
    >
      {/* 💡 썸네일 이미지 영역 (실제 사진/이미지 렌더링) */}
      <div className="relative h-48 w-full overflow-hidden bg-[#1a1c29]">
        <img 
          src={place.image} 
          alt={place.name} 
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=600&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#12141F] via-black/20 to-transparent" />
        
        {/* 카테고리 태그 뱃지 */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
          <span className="bg-black/60 backdrop-blur-md text-[#CCFF00] text-[11px] font-bold px-2.5 py-1 rounded-full border border-[#CCFF00]/30 shadow-md">
            {place.category}
          </span>
        </div>

        {/* 코스 추가/제거 버튼 */}
        <button
          onClick={(e) => { 
            e.stopPropagation(); 
            onToggleCourse(place); 
          }}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all z-10 ${
            isAdded 
              ? 'bg-[#FF007F] text-white shadow-[0_0_12px_rgba(255,0,127,0.6)] scale-110' 
              : 'bg-black/50 hover:bg-black/80 text-white border border-white/20'
          }`}
        >
          {isAdded ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </button>

        {/* 장소 이름 및 가격/주소 정보 */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between z-10">
          <div>
            <h3 className="text-base font-extrabold text-white drop-shadow-md group-hover:text-[#CCFF00] transition-colors truncate max-w-[180px]">
              {place.name}
            </h3>
            <p className="text-xs text-gray-200 font-mono drop-shadow">{place.price || place.address}</p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-xs font-bold text-amber-400 bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-sm">★ {place.rating}</span>
          </div>
        </div>
      </div>

      {/* 카드 하단 텍스트 정보 영역 */}
      <div className="p-3.5 flex flex-col justify-between flex-1 gap-2 bg-[#12141F]">
        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{place.description || place.address}</p>
        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400">
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-[#CCFF00]" />{place.hours}</span>
          <span className="text-gray-400">{place.waitingTime || '바로 입장'}</span>
        </div>
      </div>
    </div>
  );
}