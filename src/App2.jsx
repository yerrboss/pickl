import React, { useState } from 'react';
import { ThemeMap } from './components/ThemeMap';
import { NicknameModal } from './components/NicknameModal';
import { getLocalNickname, setLocalNickname, shareCourse } from './utils/courseShare';
import { 
  MapPin, Compass, Flame, Sparkles, Navigation, Clock, 
  Share2, Plus, Check, Trash2, X, Search 
} from 'lucide-react';

const INITIAL_SPOTS = [
  {
    id: 's1',
    name: 'LCDC SEOUL',
    region: '성수',
    category: '복합문화공간',
    tags: ['#인스타감성', '#이색체험', '#힙스터카페'],
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&auto-format&fit=crop&q=80',
    address: '서울 성동구 연무장길 6',
    phone: '02-3409-5971',
    price: '커피 6,000원~',
    openHours: '11:00 - 20:00 (월 휴무)',
    waitingTime: '약 15분',
    vibes: '감성적인 숍들과 카페가 모인 힙스터들의 성지',
    rating: 4.8,
    reviews: 730,
    lat: 37.5445,
    lng: 127.0560,
  },
  {
    id: 's2',
    name: '소문난성수감자탕',
    region: '성수',
    category: '웨이팅맛집',
    tags: ['#웨이팅맛집', '#해장성지', '#성수필수'],
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto-format&fit=crop&q=80',
    address: '서울 성동구 연무장길 45',
    phone: '02-465-6580',
    price: '감자탕(소) 28,000원',
    openHours: '24시간 영업',
    waitingTime: '약 40분 (피크타임)',
    vibes: '줄 서서 먹는 깊고 진한 국물의 감자탕 맛집',
    rating: 4.6,
    reviews: 3520,
    lat: 37.5470,
    lng: 127.0530,
  },
  {
    id: 's3',
    name: '디뮤지엄 / 서울숲',
    region: '성수',
    category: '전시/야외',
    tags: ['#전시회', '#야외산책', '#데이트코스'],
    image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=600&auto-format&fit=crop&q=80',
    address: '서울 성동구 왕십리로 83-21',
    phone: '02-6233-1500',
    price: '입장료 12,000원',
    openHours: '11:00 - 18:00',
    waitingTime: '바로 입장 가능',
    vibes: '트렌디한 트랜시절 아트 전시와 힐링 스팟',
    rating: 4.9,
    reviews: 4800,
    lat: 37.5430,
    lng: 127.0580,
  },
  {
    id: 's4',
    name: '클럽 은에어 성수',
    region: '성수',
    category: '이색체험',
    tags: ['#이색체험', '#팝업스토어', '#야간스팟'],
    image: 'https://images.unsplash.com/photo-1574391884720-bbc3640e0286?w=600&auto-format&fit=crop&q=80',
    address: '서울 성동구 연무장길 20',
    phone: '02-555-1234',
    price: '무료 입장',
    openHours: '13:00 - 21:00',
    waitingTime: '약 10분',
    vibes: '네온 조명 아래 음악과 함께 텐션 올리는 플레이스',
    rating: 4.7,
    reviews: 510,
    lat: 37.5420,
    lng: 127.0550,
  }
];

export default function App2() {
  const [selectedSpots, setSelectedSpots] = useState([INITIAL_SPOTS[0], INITIAL_SPOTS[1]]);
  const [activeTab, setActiveTab] = useState('ALL');
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);
  const [shareToastOpen, setShareToastOpen] = useState(false);
  const [activeSpotDetail, setActiveSpotDetail] = useState(null); // PC 카드 클릭 / 모바일 상세 모달용

  const toggleSpot = (spot) => {
    if (selectedSpots.some(s => s.id === spot.id)) {
      setSelectedSpots(selectedSpots.filter(s => s.id !== spot.id));
    } else {
      setSelectedSpots([...selectedSpots, spot]);
    }
  };

  const removeSpot = (id) => {
    setSelectedSpots(selectedSpots.filter(s => s.id !== id));
  };

  const handleShareClick = () => {
    if (selectedSpots.length === 0) return;
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
      const courseId = await shareCourse(selectedSpots, `${authorName}님의 성수 네온 코스`);
      const shareUrl = `${window.location.origin}?course=${courseId}`;
      await navigator.clipboard.writeText(shareUrl);
      
      setShareToastOpen(true);
      setTimeout(() => setShareToastOpen(false), 3000);
    } catch (e) {
      console.error("공유 오류:", e);
    }
  };

  return (
    <div className="w-full h-screen bg-zinc-950 text-white flex flex-col overflow-hidden font-sans pt-16 pb-20">
      
      <header className="px-6 py-3 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/80 backdrop-blur shrink-0">
        <div className="flex items-center gap-2">
          <div className="bg-lime-400 text-black font-black px-2.5 py-1 rounded-lg text-sm shadow-[0_0_15px_rgba(163,230,53,0.3)]">
            Pick;L
          </div>
          <span className="text-xs text-zinc-400 hidden sm:inline">Pick & Local — 놀 곳을 Pick하다 (v2 네온)</span>
        </div>
        <div className="flex gap-2">
          {['성수', '연남', '홍대', '이태원', '압구정'].map((region, idx) => (
            <button key={region} className={`px-3 py-1 rounded-full text-xs font-bold transition ${idx === 0 ? 'bg-zinc-800 text-lime-400 border border-zinc-700' : 'text-zinc-500 hover:text-white'}`}>
              {region}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden p-4 gap-4">
        
        <div className="w-full lg:w-[380px] flex flex-col gap-3 overflow-y-auto pr-1">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-300">성수 핫플 큐레이션 ({INITIAL_SPOTS.length})</h3>
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {['ALL', '#인스타감성', '#웨이팅맛집', '#전시회', '#이색체험'].map((tag) => (
              <button 
                key={tag} 
                onClick={() => setActiveTab(tag)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition ${activeTab === tag ? 'bg-lime-400 text-black' : 'bg-zinc-900 text-zinc-400 border border-zinc-800'}`}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {INITIAL_SPOTS.map((spot) => {
              const isSelected = selectedSpots.some(s => s.id === spot.id);
              return (
                <div 
                  key={spot.id} 
                  onClick={() => setActiveSpotDetail(spot)}
                  className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-3 flex gap-3 hover:border-zinc-700 transition cursor-pointer"
                >
                  <img src={spot.image} alt={spot.name} className="w-20 h-20 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-800 text-lime-400">{spot.category}</span>
                        <span className="text-xs text-amber-400 font-bold">★ {spot.rating}</span>
                      </div>
                      <h4 className="font-bold text-sm text-white truncate mt-1">{spot.name}</h4>
                      <p className="text-[11px] text-zinc-400 truncate">{spot.address}</p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] text-zinc-500">⏳ {spot.waitingTime}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveSpotDetail(spot);
                          }}
                          className="md:hidden text-xs text-lime-400 font-bold hover:underline"
                        >
                          상세보기 &gt;
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSpot(spot);
                          }}
                          className={`px-3 py-1 rounded-full text-xs font-black transition flex items-center gap-1 ${
                            isSelected 
                              ? 'bg-zinc-800 text-lime-400 border border-lime-400/40' 
                              : 'bg-lime-400 text-black hover:bg-lime-300'
                          }`}
                        >
                          {isSelected ? <><Check className="w-3 h-3"/> 담김</> : <><Plus className="w-3 h-3"/> 코스 추가</>}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex-1 h-[400px] lg:h-full relative rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl">
          <ThemeMap version="v2" spots={selectedSpots} />
        </div>

        <div className="w-full lg:w-[320px] bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <h3 className="text-xs font-black text-lime-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> 오늘의 Pick;L 동선
            </h3>
            <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded-full text-zinc-300 font-bold">
              {selectedSpots.length}곳 선택됨
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {selectedSpots.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-zinc-500 text-xs p-6">
                <MapPin className="w-8 h-8 mb-2 opacity-30 text-lime-400" />
                왼쪽 목록에서 핫플을 골라<br />나만의 코스를 만들어보세요!
              </div>
            ) : (
              selectedSpots.map((spot, index) => (
                <div key={spot.id} className="bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-2.5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-5 h-5 rounded-full bg-lime-400 text-black font-black text-[11px] flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <h5 className="text-xs font-bold text-white truncate">{spot.name}</h5>
                      <span className="text-[10px] text-zinc-400">{spot.category}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeSpot(spot.id)}
                    className="text-zinc-500 hover:text-rose-400 p-1 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {selectedSpots.length > 0 && (
            <button
              onClick={handleShareClick}
              className="w-full py-3 bg-lime-400 hover:bg-lime-300 text-black font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(163,230,53,0.3)] transition active:scale-95"
            >
              <Share2 className="w-4 h-4" />
              <span>코스 공유 링크 복사</span>
            </button>
          )}
        </div>

      </div>

      {/* v2 네온 테마 풍부한 상세 모달 */}
      {activeSpotDetail && (
  <div 
    onClick={() => setActiveSpotDetail(null)}
    className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
  >
    <div 
      onClick={(e) => e.stopPropagation()}
      className="bg-zinc-900 border border-zinc-700 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative text-white cursor-default"
    >
      <button onClick={() => setActiveSpotDetail(null)} className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black">
        <X className="w-5 h-5" />
      </button>
      <div className="relative h-60">
        <img src={activeSpotDetail.image} alt={activeSpotDetail.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-black/40" />
        <div className="absolute bottom-4 left-5 right-5">
          <span className="px-3 py-1 bg-lime-400 text-black text-xs font-bold rounded-full mb-2 inline-block">
            {activeSpotDetail.category}
          </span>
          <h2 className="text-2xl font-black">{activeSpotDetail.name}</h2>
        </div>
      </div>
      <div className="p-6 space-y-4 max-h-[50vh] overflow-y-auto">
        <div className="grid grid-cols-3 gap-2 bg-zinc-950 p-3 rounded-2xl text-center border border-zinc-800">
          <div>
            <p className="text-[10px] text-zinc-400">평점</p>
            <p className="text-sm font-bold text-amber-400">★ {activeSpotDetail.rating}</p>
          </div>
          <div>
            <p className="text-[10px] text-zinc-400">대기 상태</p>
            <p className="text-sm font-bold text-lime-400">{activeSpotDetail.waitingTime}</p>
          </div>
          <div>
            <p className="text-[10px] text-zinc-400">리뷰 수</p>
            <p className="text-sm font-bold text-zinc-200">{activeSpotDetail.reviews || 200}개</p>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold text-zinc-400 uppercase mb-1">상세 특징</h4>
          <p className="text-xs text-zinc-200 leading-relaxed">{activeSpotDetail.vibes || activeSpotDetail.description}</p>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-zinc-400 w-16 shrink-0">📍 주소</span>
            <span className="text-zinc-200">{activeSpotDetail.address}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-zinc-400 w-16 shrink-0">📞 전화번호</span>
            <span className="text-zinc-200">{activeSpotDetail.phone || '02-1234-5678'}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-zinc-400 w-16 shrink-0">⏰ 영업시간</span>
            <span className="text-zinc-200">{activeSpotDetail.openHours}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-zinc-400 w-16 shrink-0">💵 가격/입장</span>
            <span className="text-lime-400 font-semibold">{activeSpotDetail.price}</span>
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-zinc-950 border-t border-zinc-800">
        <button 
          onClick={() => { toggleSpot(activeSpotDetail); setActiveSpotDetail(null); }} 
          className="w-full py-3 bg-lime-400 hover:bg-lime-300 text-black font-black text-xs rounded-2xl shadow-md transition"
        >
          {selectedSpots.some(s => s.id === activeSpotDetail.id) ? '✓ 코스에서 제거하기' : '+ 코스에 추가하기'}
        </button>
      </div>
    </div>
  </div>
)}

      <NicknameModal
        isOpen={isNicknameModalOpen}
        onClose={() => setIsNicknameModalOpen(false)}
        onConfirm={handleNicknameConfirm}
        theme="v2"
      />

      {shareToastOpen && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[99999] bg-zinc-900 border border-lime-400/50 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <div className="w-6 h-6 rounded-full bg-lime-400 text-black flex items-center justify-center font-bold text-xs">✓</div>
          <div className="text-xs">
            <p className="font-bold text-lime-400">공유 링크 복사 완료!</p>
            <p className="text-zinc-400 text-[10px]">클립보드에 저장되었습니다. 친구에게 공유해보세요.</p>
          </div>
        </div>
      )}
    </div>
  );
}