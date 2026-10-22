import React, { useState } from 'react';
import { Zap, MapPin, Shuffle, Clock, Check, Plus, Trash2, Navigation } from 'lucide-react';

const SPOTS = [
  { id: 's1', name: 'LCDC SEOUL', region: '성수', vibes: '사이버 복합 공간 & 힙스터 스팟', rating: 4.8, x: 35, y: 40 },
  { id: 's2', name: '소문난성수감자탕', region: '성수', vibes: '24HR 레트로 감자탕 본점', rating: 4.6, x: 60, y: 55 },
  { id: 's3', name: '디뮤지엄 / 서울숲', region: '성수', vibes: '네온 인터랙티브 전시관', rating: 4.9, x: 25, y: 75 },
  { id: 's4', name: '클럽 온에어 성수', region: '성수', vibes: '하드코어 비트 라이브 펍', rating: 4.7, x: 75, y: 30 }
];

export default function App4() {
  const [selectedSpots, setSelectedSpots] = useState(['s1', 's2']);
  const [tension, setTension] = useState(80);

  const toggleSpot = (id) => {
    if (selectedSpots.includes(id)) {
      setSelectedSpots(selectedSpots.filter(sId => sId !== id));
    } else {
      setSelectedSpots([...selectedSpots, id]);
    }
  };

  return (
    <div className="min-h-screen bg-black text-cyan-300 font-mono p-4 md:p-6 pb-20">
      
      {/* Header */}
      <header className="max-w-6xl mx-auto flex justify-between items-center pb-4 border-b-2 border-dashed border-cyan-500/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-cyan-400 text-black font-black flex items-center justify-center text-xl shadow-[2px_2px_0px_#ff007f]">
            P;
          </div>
          <h1 className="text-2xl font-black italic tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-yellow-300">
            PICK;L [Y2K_VER]
          </h1>
        </div>
        <span className="px-3 py-1 bg-fuchsia-600/30 border border-fuchsia-500 text-fuchsia-300 text-xs font-bold shadow-[3px_3px_0px_#00ffff]">
          ARCADE_MODE v4.0
        </span>
      </header>

      {/* Main Grid */}
      <main className="max-w-6xl mx-auto py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Spot Cards & Arcade Controls */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 bg-zinc-950 border-2 border-cyan-400 shadow-[5px_5px_0px_#ff007f] relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-yellow-300 font-bold flex items-center gap-1">
                <Zap className="w-4 h-4 text-fuchsia-400" /> TENSION_TUNER: {tension}%
              </span>
              <span className="text-[10px] bg-fuchsia-500 text-black px-2 py-0.5 font-black">HIGH_ENERGY</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={tension}
              onChange={(e) => setTension(Number(e.target.value))}
              className="w-full accent-cyan-400 bg-zinc-800 h-2 cursor-pointer"
            />
          </div>

          <div className="space-y-3">
            {SPOTS.map((spot) => {
              const isSelected = selectedSpots.includes(spot.id);
              return (
                <div 
                  key={spot.id} 
                  className={`p-4 bg-zinc-950 border-2 transition-all ${
                    isSelected 
                      ? 'border-yellow-300 shadow-[4px_4px_0px_#ff007f]' 
                      : 'border-zinc-800 hover:border-cyan-500'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] bg-cyan-400 text-black px-1.5 py-0.5 font-bold uppercase">
                        #{spot.region}
                      </span>
                      <h3 className="font-extrabold text-lg text-white mt-1">{spot.name}</h3>
                      <p className="text-xs text-zinc-400 mt-0.5 font-sans">{spot.vibes}</p>
                    </div>
                    <span className="text-xs font-bold text-yellow-300">★ {spot.rating}</span>
                  </div>

                  <button
                    onClick={() => toggleSpot(spot.id)}
                    className={`mt-3 w-full py-2 font-black text-xs transition ${
                      isSelected 
                        ? 'bg-yellow-300 text-black shadow-[2px_2px_0px_#ffffff]' 
                        : 'bg-zinc-800 text-cyan-300 border border-cyan-500/50 hover:bg-cyan-500 hover:text-black'
                    }`}
                  >
                    {isSelected ? '[ SELECTED ✓ ]' : '[ + ADD TO COURSE ]'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Retro Map & Route Radar */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 bg-zinc-950 border-2 border-fuchsia-500 shadow-[5px_5px_0px_#00ffff]">
            <h3 className="text-xs font-black text-fuchsia-400 mb-3 uppercase flex items-center gap-1">
              <Navigation className="w-4 h-4" /> [ RADAR_MAP_GRID ]
            </h3>
            
            <div className="relative w-full h-56 bg-black border border-cyan-500/40 overflow-hidden flex items-center justify-center">
              <svg className="w-full h-full">
                <defs>
                  <pattern id="grid4" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#ff007f" strokeWidth="0.3" opacity="0.4" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid4)" />

                {SPOTS.map((s, idx) => {
                  const isSel = selectedSpots.includes(s.id);
                  return (
                    <g key={s.id} transform={`translate(${(s.x / 100) * 260 + 20}, ${(s.y / 100) * 180 + 20})`}>
                      <circle r={isSel ? "10" : "5"} fill={isSel ? "#ff007f" : "#00ffff"} />
                      <text x="0" y="20" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">
                        {s.name}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="mt-4 pt-3 border-t border-dashed border-zinc-800 space-y-2">
              <span className="text-xs font-bold text-yellow-300">[ SELECTED ROUTE ]</span>
              {selectedSpots.map((id, idx) => {
                const s = SPOTS.find(item => item.id === id);
                return (
                  <div key={id} className="text-xs flex items-center justify-between bg-zinc-900 p-2 border border-zinc-800">
                    <span className="text-cyan-300 font-bold">{idx + 1}. {s?.name}</span>
                    <button onClick={() => toggleSpot(id)} className="text-fuchsia-400 hover:text-red-400">✕</button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}