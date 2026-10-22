import React, { useState } from 'react';
import { Bookmark, ArrowUpRight, MapPin, Plus, Check, Clock } from 'lucide-react';

const SPOTS = [
  { id: 's1', name: 'LCDC SEOUL', region: '성수', category: '복합문화공간', vibes: '도심 속 조용한 감성과 신진 디자이너 숍의 모음집', price: '커피 6,000원~', waiting: '약 15분', image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&auto=format&fit=crop&q=80' },
  { id: 's2', name: '소문난성수감자탕', region: '성수', category: '웨이팅맛집', vibes: '깊고 진한 육수가 전해주는 아날로그 맛의 정수', price: '28,000원', waiting: '약 40분', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80' },
  { id: 's3', name: '디뮤지엄 / 서울숲', region: '성수', category: '전시관', vibes: '트렌디한 트랜지셔널 아트와 녹음 우거진 숲', price: '12,000원', waiting: '바로 입장', image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=600&auto=format&fit=crop&q=80' }
];

export default function App5() {
  const [selectedSpots, setSelectedSpots] = useState(['s1']);

  const toggleSpot = (id) => {
    if (selectedSpots.includes(id)) {
      setSelectedSpots(selectedSpots.filter(sId => sId !== id));
    } else {
      setSelectedSpots([...selectedSpots, id]);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-stone-900 font-serif p-6 md:p-10 pb-20">
      
      {/* Header */}
      <header className="max-w-5xl mx-auto flex justify-between items-end pb-6 border-b-2 border-stone-900">
        <div>
          <span className="text-[10px] font-sans font-extrabold tracking-widest text-stone-500 uppercase">
            ISSUE N°01 — SEOUL HOTSPOT CURATION
          </span>
          <h1 className="text-4xl font-black tracking-tighter text-stone-950 italic mt-1">
            Pick<span className="text-stone-400 font-normal">;</span>L
          </h1>
        </div>
        <span className="text-xs font-sans font-extrabold tracking-wider border-2 border-stone-900 px-3 py-1 rounded-full uppercase">
          Editorial Mag
        </span>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto py-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left: Main Editorial Feed */}
        <div className="lg:col-span-8 space-y-10">
          <div className="border-b border-stone-300 pb-8 space-y-3 font-sans">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
              FEATURED STORY
            </span>
            <h2 className="text-3xl font-serif font-bold text-stone-900 leading-tight">
              성수동의 숨겨진 감성 조각: <br />도시와 예술이 교차하는 프라이빗 큐레이션
            </h2>
            <p className="text-stone-600 text-sm leading-relaxed font-serif">
              화려한 네온 대신 한 편의 수필처럼 아날로그 잡지의 깊이감을 담았습니다. 천천히 걸으며 공간이 전하는 바이브를 느껴보세요.
            </p>
          </div>

          <div className="space-y-8">
            {SPOTS.map((spot) => {
              const isSelected = selectedSpots.includes(spot.id);
              return (
                <div key={spot.id} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center border-b border-stone-200 pb-8">
                  <div className="md:col-span-5 h-48 overflow-hidden rounded-none border border-stone-900">
                    <img src={spot.image} alt={spot.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition duration-500" />
                  </div>

                  <div className="md:col-span-7 space-y-2 font-sans">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold tracking-widest text-stone-500 uppercase">
                        {spot.region} — {spot.category}
                      </span>
                      <span className="text-xs font-serif italic text-stone-600">{spot.waiting}</span>
                    </div>

                    <h3 className="text-xl font-serif font-bold text-stone-900">{spot.name}</h3>
                    <p className="text-xs font-serif text-stone-600 leading-relaxed">"{spot.vibes}"</p>

                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-800">{spot.price}</span>
                      <button
                        onClick={() => toggleSpot(spot.id)}
                        className={`px-4 py-1.5 text-xs font-bold font-sans uppercase transition border border-stone-900 ${
                          isSelected ? 'bg-stone-900 text-white' : 'bg-transparent text-stone-900 hover:bg-stone-200'
                        }`}
                      >
                        {isSelected ? 'Curated ✓' : '+ Add to List'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Curated List Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 bg-stone-100 border-2 border-stone-900 space-y-4 sticky top-10 font-sans">
            <h3 className="text-sm font-bold font-serif uppercase border-b border-stone-300 pb-2">
              My Curated Route ({selectedSpots.length})
            </h3>

            {selectedSpots.length === 0 ? (
              <p className="text-xs font-serif text-stone-500 py-4">아직 선택된 스팟이 없습니다.</p>
            ) : (
              <div className="space-y-3">
                {selectedSpots.map((id, idx) => {
                  const s = SPOTS.find(item => item.id === id);
                  return (
                    <div key={id} className="flex items-center justify-between border-b border-stone-200 pb-2">
                      <span className="text-xs font-serif font-bold">{idx + 1}. {s?.name}</span>
                      <button onClick={() => toggleSpot(id)} className="text-xs text-stone-400 hover:text-stone-900">Remove</button>
                    </div>
                  );
                })}
              </div>
            )}

            {selectedSpots.length > 0 && (
              <button 
                onClick={() => alert('에디토리얼 코스가 저장되었습니다!')}
                className="w-full py-2.5 bg-stone-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-stone-800 transition"
              >
                Export Route Sheet
              </button>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}