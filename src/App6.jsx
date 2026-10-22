import React, { useState } from 'react';
import { Compass, Trophy, Star, MapPin, Footprints, Sparkles, Flame, X } from 'lucide-react';

const MAPLE_SPOTS = [
  {
    id: 's1',
    name: '성수 헤네시스 (LCDC)',
    region: '성수',
    category: '복합문화공간',
    vibes: '아기자기한 숍과 감성 카페가 가득한 1채널 메인 스트리트',
    rating: 4.8,
    exp: '+1,500 EXP',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&auto=format&fit=crop&q=80',
    mapX: 35, mapY: 30
  },
  {
    id: 's2',
    name: '성수 감자탕 슬라임굴',
    region: '성수',
    category: '웨이팅맛집',
    vibes: '줄을 서서 잡아야 하는 전설의 진한국물 맛집',
    rating: 4.6,
    exp: '+2,300 EXP',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80',
    mapX: 70, mapY: 60
  },
  {
    id: 's3',
    name: '서울숲 오르비디움',
    region: '성수',
    category: '전시/야외',
    vibes: '초록빛 풀잎과 퀘스트 NPC가 출몰하는 힐링 필드',
    rating: 4.9,
    exp: '+1,800 EXP',
    image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=600&auto=format&fit=crop&q=80',
    mapX: 50, mapY: 75
  }
];

export default function App6() {
  const [selectedSpots, setSelectedSpots] = useState(['s1']);
  const [activeSpot, setActiveSpot] = useState(MAPLE_SPOTS[0]); // 현재 캐릭터가 향하거나 선택된 스팟
  const [userLevel] = useState(15);

  const toggleSpot = (id) => {
    if (selectedSpots.includes(id)) {
      setSelectedSpots(selectedSpots.filter(sId => sId !== id));
    } else {
      setSelectedSpots([...selectedSpots, id]);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden font-mono bg-[#E8F5E9] flex flex-col md:flex-row select-none">
      
      {/* 1. [왼쪽 사이드 패널] 추천 핫플 리스트 & 퀘스트 인벤토리 */}
      <div className="w-full md:w-[400px] h-full bg-white/95 backdrop-blur-md border-r-4 border-stone-800 p-4 flex flex-col justify-between z-20 shadow-[4px_0px_0px_#292524] overflow-y-auto">
        
        {/* 상단 프로필 및 타이틀 */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 bg-amber-50 border-2 border-stone-800 p-3 shadow-sm">
            <div className="w-10 h-10 bg-white border-2 border-stone-800 flex items-center justify-center text-xl">
              🧙‍♀️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-amber-600 font-black text-xs">Lv.{userLevel}</span>
                <h1 className="text-xs font-black text-stone-900">지혜공주님의 픽플 퀘스트</h1>
              </div>
              <p className="text-[9px] text-stone-500">성수 필드 핫플레이스 큐레이션</p>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-xs font-black text-stone-900 flex items-center gap-1.5 uppercase">
              <Flame className="w-4 h-4 text-amber-600" /> 추천 퀘스트 스팟 리스트
            </h2>
            <p className="text-[10px] text-stone-500">카드를 누르면 지도 위 캐릭터가 해당 위치로 이동합니다!</p>
          </div>

          {/* 추천 스팟 카드 리스트 */}
          <div className="space-y-3">
            {MAPLE_SPOTS.map((spot) => {
              const isSelected = selectedSpots.includes(spot.id);
              const isCurrentTarget = activeSpot?.id === spot.id;

              return (
                <div 
                  key={spot.id}
                  onClick={() => setActiveSpot(spot)}
                  className={`p-3 border-2 transition-all cursor-pointer bg-white ${
                    isCurrentTarget ? 'border-amber-500 shadow-[3px_3px_0px_#f59e0b]' : 'border-stone-800 hover:bg-amber-50/50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 font-black border border-amber-300">
                      {spot.exp}
                    </span>
                    <span className="text-xs font-bold text-stone-600">★ {spot.rating}</span>
                  </div>

                  <h3 className="font-black text-sm text-stone-900 mt-1">{spot.name}</h3>
                  <p className="text-[11px] text-stone-500 mt-0.5 leading-tight">{spot.vibes}</p>

                  <div className="mt-3 pt-2 border-t-2 border-stone-100 flex items-center justify-between">
                    <span className="text-[10px] text-stone-400 font-bold">#{spot.region}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSpot(spot.id);
                      }}
                      className={`px-3 py-1 text-[10px] font-black border-2 border-stone-800 transition ${
                        isSelected ? 'bg-amber-300 text-stone-900 shadow-[2px_2px_0px_#292524]' : 'bg-stone-100 text-stone-700 hover:bg-amber-200'
                      }`}
                    >
                      {isSelected ? '등록됨 ✓' : '+ 퀘스트 수주'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 하단 동선 확정 버튼 */}
        <div className="pt-4 border-t-2 border-stone-200 space-y-2">
          <div className="flex justify-between text-xs font-black text-stone-900">
            <span>선택된 퀘스트 루트</span>
            <span className="text-amber-600">{selectedSpots.length}개 스팟</span>
          </div>
          <button 
            disabled={selectedSpots.length === 0}
            onClick={() => alert('파티 퀘스트 동선이 확정되었습니다! 모험을 떠나요! 🚀')}
            className="w-full py-2.5 bg-amber-300 text-stone-900 font-black text-xs border-2 border-stone-800 shadow-[2px_2px_0px_#292524] hover:bg-amber-400 disabled:opacity-50 transition"
          >
            🚀 퀘스트 출발하기
          </button>
        </div>

      </div>

      {/* 2. [오른쪽 메인 배경] 픽셀 타일 맵 & 움직이는 메이플 캐릭터 */}
      <div className="flex-1 h-full relative overflow-hidden bg-[#E8F5E9]">
        
        {/* 타일 패턴 그리드 백드롭 */}
        <div className="absolute inset-0 bg-[#C8E6C9] grid grid-cols-12 grid-rows-12 opacity-80 pointer-events-none">
          {Array.from({ length: 144 }).map((_, i) => (
            <div key={i} className="border-[0.5px] border-[#A5D6A7]/60 flex items-center justify-center text-[10px] text-[#81C784]">
              ✦
            </div>
          ))}
        </div>

        {/* 맵 필드 장식 요소들 */}
        <div className="absolute top-[10%] left-[15%] text-3xl pointer-events-none">🌲 🌳</div>
        <div className="absolute top-[70%] left-[75%] text-3xl pointer-events-none">🏡 🌾</div>
        <div className="absolute top-[20%] left-[80%] text-3xl pointer-events-none">⛺ 🌲</div>

        {/* 지도 위에 표시되는 핫플 핀들 */}
        {MAPLE_SPOTS.map((spot) => {
          const isSelected = selectedSpots.includes(spot.id);
          const isTarget = activeSpot?.id === spot.id;

          return (
            <button
              key={spot.id}
              onClick={() => setActiveSpot(spot)}
              className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 group flex flex-col items-center transition-all focus:outline-none ${
                isTarget ? 'scale-125' : 'hover:scale-110'
              }`}
              style={{ left: `${spot.mapX}%`, top: `${spot.mapY}%` }}
            >
              <div className={`w-10 h-10 border-3 rounded-none flex items-center justify-center text-lg shadow-[3px_3px_0px_#292524] ${
                isSelected ? 'bg-amber-300 border-stone-900' : 'bg-white border-stone-800'
              }`}>
                {isSelected ? '🚩' : '📍'}
              </div>
              <span className={`mt-1 px-2 py-0.5 text-[10px] font-black whitespace-nowrap border-2 shadow-md ${
                isTarget ? 'bg-amber-400 text-stone-900 border-stone-900' : 'bg-stone-900 text-white border-stone-700'
              }`}>
                {spot.name.split(' ')[0]}
              </span>
            </button>
          );
        })}

        {/* ★ [핵심] 지도 위를 실제로 걸어 다니는 메이플 스타일 픽셀 캐릭터 아바타! */}
        {activeSpot && (
          <div 
            className="absolute z-20 -translate-x-1/2 -translate-y-full flex flex-col items-center transition-all duration-700 ease-in-out pointer-events-none"
            style={{ left: `${activeSpot.mapX}%`, top: `${activeSpot.mapY}%` }}
          >
            {/* 캐릭터 말풍선 */}
            <div className="mb-1 px-2 py-0.5 bg-white border-2 border-stone-800 text-stone-900 text-[9px] font-black shadow-sm animate-bounce">
              "여기서 탐험 중! ✨"
            </div>

            {/* 메이플 스타일 캐릭터 도트 아바타 (통통 튀는 애니메이션 적용) */}
            <div className="w-12 h-12 bg-amber-200 border-3 border-stone-900 rounded-full flex items-center justify-center text-2xl shadow-[3px_3px_0px_#292524] animate-pulse">
              🧙‍♀️
            </div>
          </div>
        )}

      </div>

    </div>
  );
}