import React, { useState, useMemo } from 'react';
import { ThemeMap } from './components/ThemeMap';
import { NicknameModal } from './components/NicknameModal';
import { getLocalNickname, setLocalNickname, shareCourse } from './utils/courseShare';
import { 
  Flame, Sparkles, Navigation, Clock, Share2, Plus, Check, Trash2, 
  CloudRain, Eye, X, Heart, MapPin, Compass, Shuffle, Map
} from 'lucide-react';

const INITIAL_SPOTS = [
  {
    id: 's1',
    name: 'LCDC SEOUL',
    region: '성수',
    category: '복합문화공간',
    tags: ['#인스타감성', '#이색체험', '#힙스터카페'],
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&auto-format&fit=crop&q=80',
    address: '서울 성동구 연무장5길 6',
    price: '커피 6,000원~',
    openHours: '11:00 - 20:00 (월 휴무)',
    waitingTime: '약 15분',
    vibes: '감성적인 숍들과 카페가 모인 힙스터들의 성지',
    rating: 4.8,
    lat: 37.5445,
    lng: 127.0560,
    indoor: true,
    minTension: 20
  },
  {
    id: 's2',
    name: '소문난성수감자탕',
    region: '성수',
    category: '웨이팅맛집',
    tags: ['#웨이팅맛집', '#해장성지', '#성수필수'],
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto-format&fit=crop&q=80',
    address: '서울 성동구 연무장길 45',
    price: '감자탕(소) 28,000원',
    openHours: '24시간 영업',
    waitingTime: '약 40분 (피크타임)',
    vibes: '줄 서서 먹는 깊고 진한 국물의 감자탕 맛집',
    rating: 4.6,
    lat: 37.5470,
    lng: 127.0530,
    indoor: true,
    minTension: 10
  },
  {
    id: 's3',
    name: '디뮤지엄 / 서울숲',
    region: '성수',
    category: '전시/야외',
    tags: ['#전시회', '#야외산책', '#데이트코스'],
    image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=600&auto-format&fit=crop&q=80',
    address: '서울 성동구 왕십리로 83-21',
    price: '입장료 12,000원',
    openHours: '11:00 - 18:00',
    waitingTime: '바로 입장 가능',
    vibes: '트렌디한 트랜지셔널 아트 전시와 힐링 스팟',
    rating: 4.9,
    lat: 37.5430,
    lng: 127.0580,
    indoor: false,
    minTension: 50
  },
  {
    id: 's4',
    name: '클럽 온에어 성수',
    region: '성수',
    category: '이색체험',
    tags: ['#이색체험', '#고텐션', '#라이브펍'],
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto-format&fit=crop&q=80',
    address: '서울 성동구 아차산로 113',
    price: '칵테일 12,000원~',
    openHours: '18:00 - 02:00',
    waitingTime: '약 10분',
    vibes: '네온 조명 아래 음악과 함께 텐션 올리는 플레이스',
    rating: 4.7,
    lat: 37.5420,
    lng: 127.0550,
    indoor: true,
    minTension: 80
  },
  {
    id: 's5',
    name: '연남동 연남방간',
    region: '연남',
    category: '힙스터카페',
    tags: ['#인스타감성', '#힙스터카페', '#디저트'],
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&auto-format&fit=crop&q=80',
    address: '서울 마포구 동교로29길 34',
    price: '참깨라떼 6,500원',
    openHours: '12:00 - 21:00',
    waitingTime: '약 20분',
    vibes: '참기름과 고소한 라떼의 미친 컬래버',
    rating: 4.7,
    lat: 37.5620,
    lng: 126.9240,
    indoor: true,
    minTension: 30
  }
];

export default function App3({ currentDesign = 'v3' }) {
  const [region, setRegion] = useState('성수');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedSpots, setSelectedSpots] = useState(['s1', 's2']);
  const [activeModalSpot, setActiveModalSpot] = useState(null);
  const [tension, setTension] = useState(50);
  const [isRainy, setIsRainy] = useState(false);
  const [isRandomModalOpen, setIsRandomModalOpen] = useState(false);
  const [randomResult, setRandomResult] = useState([]);
  const [likedSpots, setLikedSpots] = useState([]);
  const [showMapPanel, setShowMapPanel] = useState(true);

  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);
  const [shareToastOpen, setShareToastOpen] = useState(false);

  const regions = ['성수', '연남', '홍대', '이태원', '압구정'];

  const filteredSpots = useMemo(() => {
    return INITIAL_SPOTS.filter(spot => {
      if (spot.region !== region) return false;
      if (selectedCategory !== 'ALL' && !spot.tags.includes(selectedCategory)) return false;
      if (isRainy && !spot.indoor) return false;
      if (spot.minTension > tension + 30) return false;
      return true;
    });
  }, [region, selectedCategory, isRainy, tension]);

  const myCourseSpots = useMemo(() => {
    return selectedSpots.map(id => INITIAL_SPOTS.find(s => s.id === id)).filter(Boolean);
  }, [selectedSpots]);

  const toggleSelectSpot = (id) => {
    if (selectedSpots.includes(id)) {
      setSelectedSpots(selectedSpots.filter(sId => sId !== id));
    } else {
      setSelectedSpots([...selectedSpots, id]);
    }
  };

  const toggleLike = (id) => {
    setLikedSpots(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSpinRandom = () => {
    const currentRegionSpots = INITIAL_SPOTS.filter(s => s.region === region);
    const shuffled = [...currentRegionSpots].sort(() => 0.5 - Math.random());
    setRandomResult(shuffled.slice(0, 3));
    setIsRandomModalOpen(true);
  };

  const handleShareClick = () => {
    if (myCourseSpots.length === 0) return;
    const savedName = getLocalNickname();
    if (savedName) {
      executeShare(savedName);
    } else {
      setIsNicknameModalOpen(true);
    }
  };

  const handleNicknameConfirm = (inputName) => {
    setLocalNickname(inputName);
    setIsNicknameModalOpen(false);
    executeShare(inputName);
  };

  const executeShare = async (authorName) => {
    try {
      const courseId = await shareCourse(myCourseSpots, `${authorName}님의 ${region} 숏폼 코스`);
      const shareUrl = `${window.location.origin}?course=${courseId}`;
      await navigator.clipboard.writeText(shareUrl);
      
      setShareToastOpen(true);
      setTimeout(() => setShareToastOpen(false), 3000);
    } catch (e) {
      console.error("공유 오류:", e);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-fuchsia-500 selection:text-white pb-20 md:pb-0 pt-14">
      
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-lg border-b border-neutral-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl font-black italic tracking-widest text-fuchsia-500">Pick;L</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30 uppercase">
            v3 숏폼 & 벤토
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowMapPanel(!showMapPanel)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition ${
              showMapPanel 
                ? 'bg-fuchsia-500 text-white border-fuchsia-400 shadow-[0_0_12px_rgba(217,70,239,0.5)]' 
                : 'bg-neutral-900 border-neutral-700 text-neutral-300 hover:border-fuchsia-500'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>{showMapPanel ? '지도 닫기' : '라이브 지도'}</span>
          </button>

          <button 
            onClick={handleSpinRandom}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-700 text-xs font-bold text-neutral-200 hover:border-fuchsia-500 transition"
          >
            <Shuffle className="w-3.5 h-3.5 text-fuchsia-400" />
            <span>랜덤 픽</span>
          </button>
        </div>
      </header>

      {/* Region Switcher & Filters */}
      <div className="bg-neutral-950 border-b border-neutral-800 px-4 py-3 space-y-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {regions.map(r => (
            <button
              key={r}
              onClick={() => setRegion(r)}
              className={`px-4 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition ${
                region === r 
                  ? 'bg-fuchsia-500 text-white shadow-[0_0_15px_rgba(217,70,239,0.5)]' 
                  : 'bg-neutral-900 text-neutral-400 border border-neutral-800'
              }`}
            >
              #{r}
            </button>
          ))}
        </div>

        {/* Tension & Rain Tuner Bar */}
        <div className="flex items-center justify-between gap-4 pt-1">
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-300 flex-1">
            <Flame className="w-4 h-4 text-fuchsia-500 shrink-0" />
            <span>텐션 {tension}%</span>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={tension}
              onChange={(e) => setTension(Number(e.target.value))}
              className="w-full accent-fuchsia-500 bg-neutral-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <button 
            onClick={() => setIsRainy(!isRainy)}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition shrink-0 ${
              isRainy ? 'bg-blue-600 text-white' : 'bg-neutral-900 text-neutral-400 border border-neutral-800'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span>실내만</span>
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Shorts Feed */}
        <div className={`${showMapPanel ? 'lg:col-span-5' : 'lg:col-span-8'} transition-all duration-300 space-y-4`}>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-neutral-400">
              🔥 <span className="text-fuchsia-400 font-extrabold">{region}</span> 핫플레이스 피드
            </h2>
          </div>

          {filteredSpots.length === 0 ? (
            <div className="p-12 text-center text-neutral-500 text-sm bg-neutral-950 rounded-3xl border border-neutral-800">
              필터에 맞는 핫플이 없어! 텐션을 변경해보세요 ⚡
            </div>
          ) : (
            <div className={`grid grid-cols-1 ${showMapPanel ? 'sm:grid-cols-1' : 'sm:grid-cols-2'} gap-4`}>
              {filteredSpots.map((spot, idx) => {
                const isSelected = selectedSpots.includes(spot.id);
                const isLiked = likedSpots.includes(spot.id);
                const isFeatured = idx === 0 && !showMapPanel;

                return (
                  <div 
                    key={spot.id}
                    className={`group relative rounded-3xl overflow-hidden border transition-all duration-300 bg-neutral-900 flex flex-col justify-between ${
                      isFeatured ? 'sm:col-span-2 h-80' : 'h-72'
                    } ${
                      isSelected ? 'border-fuchsia-500 shadow-[0_0_20px_rgba(217,70,239,0.3)]' : 'border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <img 
                      src={spot.image} 
                      alt={spot.name} 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700 opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                    <div className="relative z-10 p-4 flex justify-between items-start">
                      <div className="flex gap-1.5 flex-wrap">
                        <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold text-fuchsia-400">
                          ★ {spot.rating}
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold text-neutral-300">
                          {spot.category}
                        </span>
                      </div>

                      <button 
                        onClick={() => toggleLike(spot.id)}
                        className="p-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white hover:text-fuchsia-400 transition"
                      >
                        <Heart className={`w-4 h-4 ${isLiked ? 'fill-fuchsia-500 text-fuchsia-500' : ''}`} />
                      </button>
                    </div>

                    <div className="relative z-10 p-5 space-y-2">
                      <h3 className="text-xl font-black tracking-tight text-white group-hover:text-fuchsia-400 transition">
                        {spot.name}
                      </h3>
                      <p className="text-xs text-neutral-300 line-clamp-1">{spot.vibes}</p>

                      <div className="flex items-center justify-between pt-2 border-t border-white/10">
                        <div className="flex items-center gap-1 text-[11px] text-neutral-400">
                          <Clock className="w-3.5 h-3.5 text-fuchsia-400" />
                          <span>{spot.waitingTime}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setActiveModalSpot(spot)}
                            className="px-3 py-1.5 rounded-full bg-neutral-800/80 backdrop-blur-md text-xs font-bold text-neutral-300 hover:text-white"
                          >
                            상세보기
                          </button>
                          <button
                            onClick={() => toggleSelectSpot(spot.id)}
                            className={`px-4 py-1.5 rounded-full text-xs font-black transition ${
                              isSelected
                                ? 'bg-fuchsia-500 text-white shadow-md'
                                : 'bg-white text-black hover:bg-neutral-200'
                            }`}
                          >
                            {isSelected ? '담김 ✓' : '+ 코스 담기'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Dynamic Map Panel */}
        {showMapPanel && (
          <div className="lg:col-span-4 bg-neutral-950 border border-neutral-800 rounded-3xl p-4 flex flex-col justify-between min-h-[380px]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-fuchsia-400 flex items-center gap-1">
                <Compass className="w-4 h-4 animate-spin" style={{ animationDuration: '8s' }} />
                {region} Live Radar Map
              </span>
              <button onClick={() => setShowMapPanel(false)} className="text-neutral-500 hover:text-white text-xs">✕ 닫기</button>
            </div>
            
            <div className="relative w-full h-full min-h-[320px] rounded-2xl overflow-hidden border border-neutral-800">
              <ThemeMap version={currentDesign} spots={myCourseSpots.length > 0 ? myCourseSpots : filteredSpots} />
            </div>
          </div>
        )}

        {/* Route Summary Panel */}
        <div className={`${showMapPanel ? 'lg:col-span-3' : 'lg:col-span-4'} space-y-4 transition-all duration-300`}>
          <div className="p-5 rounded-3xl bg-neutral-950 border border-neutral-800 space-y-4 sticky top-20">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-fuchsia-500" />
                <h3 className="font-extrabold text-sm">Pick;L 숏폼 코스</h3>
              </div>
              <span className="text-xs font-bold text-fuchsia-400">{myCourseSpots.length}개 스팟</span>
            </div>

            <div className="space-y-2.5">
              {myCourseSpots.length === 0 ? (
                <div className="py-8 text-center text-xs text-neutral-600">
                  피드 카드에서 <span className="text-neutral-400 font-bold">[+ 코스 담기]</span>를 눌러 <br />나만의 하루 동선을 완성하세요!
                </div>
              ) : (
                myCourseSpots.map((spot, idx) => (
                  <div key={spot.id} className="p-3 bg-neutral-900 rounded-2xl border border-neutral-800 flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-6 h-6 rounded-full bg-fuchsia-500 text-white text-xs font-black flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <div className="truncate">
                        <h4 className="text-xs font-bold text-neutral-200 truncate">{spot.name}</h4>
                        <p className="text-[10px] text-neutral-500">{spot.category}</p>
                      </div>
                    </div>

                    <button 
                      onClick={() => toggleSelectSpot(spot.id)}
                      className="p-1 text-neutral-500 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {myCourseSpots.length > 0 && (
              <button 
                onClick={handleShareClick}
                className="w-full py-3 rounded-2xl bg-fuchsia-500 text-white font-black text-xs shadow-[0_0_20px_rgba(217,70,239,0.4)] hover:bg-fuchsia-600 transition active:scale-95 flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                <span>코스 공유 링크 복사</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <NicknameModal
        isOpen={isNicknameModalOpen}
        onClose={() => setIsNicknameModalOpen(false)}
        onConfirm={handleNicknameConfirm}
        theme="v3"
      />

      {/* Detail Modal */}
      {activeModalSpot && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl space-y-4 p-5">
            <div className="relative h-48 rounded-2xl overflow-hidden">
              <img src={activeModalSpot.image} className="w-full h-full object-cover" />
              <button 
                onClick={() => setActiveModalSpot(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h3 className="text-lg font-black text-white">{activeModalSpot.name}</h3>
              <p className="text-xs text-fuchsia-400 font-bold mt-0.5">{activeModalSpot.region} · {activeModalSpot.category}</p>
            </div>

            <p className="text-xs text-neutral-300 bg-neutral-950 p-3 rounded-xl border border-neutral-800">
              "{activeModalSpot.vibes}"
            </p>

            <div className="space-y-1 text-xs text-neutral-400">
              <p>📍 {activeModalSpot.address}</p>
              <p>💰 {activeModalSpot.price}</p>
              <p>⏰ {activeModalSpot.openHours}</p>
            </div>

            <button
              onClick={() => {
                toggleSelectSpot(activeModalSpot.id);
                setActiveModalSpot(null);
              }}
              className="w-full py-3 rounded-2xl bg-fuchsia-500 text-white font-black text-xs"
            >
              {selectedSpots.includes(activeModalSpot.id) ? '코스에서 제거' : '코스에 담기'}
            </button>
          </div>
        </div>
      )}

      {/* Random Modal */}
      {isRandomModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-fuchsia-500/40 rounded-3xl max-w-sm w-full p-6 text-center space-y-4">
            <Sparkles className="w-8 h-8 text-fuchsia-400 mx-auto animate-bounce" />
            <h3 className="font-black text-lg text-white">랜덤 핫플 픽!</h3>

            <div className="space-y-2 text-left my-3">
              {randomResult.map((spot, i) => (
                <div key={spot.id} className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center gap-3">
                  <span className="text-xs font-black text-fuchsia-400">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-neutral-200 truncate">{spot.name}</h4>
                    <p className="text-[10px] text-neutral-500">{spot.category}</p>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => {
                setSelectedSpots(randomResult.map(s => s.id));
                setIsRandomModalOpen(false);
              }}
              className="w-full py-2.5 rounded-xl bg-fuchsia-500 text-white font-extrabold text-xs"
            >
              이 코스로 담기
            </button>
          </div>
        </div>
      )}

      {shareToastOpen && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[99999] bg-neutral-900 border border-fuchsia-500/50 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <div className="w-6 h-6 rounded-full bg-fuchsia-500 text-white flex items-center justify-center font-bold text-xs">✓</div>
          <div className="text-xs">
            <p className="font-bold text-fuchsia-400">공유 링크 복사 완료!</p>
            <p className="text-zinc-400 text-[10px]">클립보드에 저장되었습니다. 친구에게 공유해보세요.</p>
          </div>
        </div>
      )}

    </div>
  );
}