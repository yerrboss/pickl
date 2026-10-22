import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ThemeMap } from './components/ThemeMap';
import { NicknameModal } from './components/NicknameModal';
import { getLocalNickname, setLocalNickname, shareCourse } from './utils/courseShare';
import { searchKakaoPlaces } from './utils/kakaoApi';
import { 
  MapPin, Sparkles, Navigation, Clock, Compass, Shuffle, Share2, 
  Plus, Check, X, Coffee, Utensils, Camera, Heart, Zap, Sun, CloudRain,
  ChevronRight, Calendar, DollarSign, Users, Award, Download, AlertCircle, Search 
} from 'lucide-react';

const REGIONS = ['성수 (Seongsu)', '연남 (Yeonnam)', '홍대 (Hongdae)', '이태원 (Itaewon)', '강남 (Gangnam)'];

const TAG_FILTERS = [
  '전체', '#인스타감성', '#웨이팅맛집', '#이색체험', '#힙스터카페', '#야외활동', '#실내데이트'
];

const INITIAL_SPOTS = [
  {
    id: 's1',
    name: '디올 성수',
    category: '#인스타감성',
    type: 'spot',
    icon: Camera,
    region: '성수 (Seongsu)',
    rating: '4.8',
    reviews: 1240,
    address: '서울 성동구 연무장5길 7',
    price: '무료 (외관/전시)',
    hours: '11:00 - 20:00',
    isOpen: true,
    waitingTime: '약 25분 대기',
    waitingLevel: 'high',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=600&q=80',
    lat: 37.5445, 
    lng: 127.0560,
    description: '프랑스 명품 하우스 디올의 팝업 스토어. 파리 플래그십을 오마주한 파사드가 화려한 포토존.',
    menuTip: '예약 필수 / 미예약 시 현장 대기 등록 가능',
    energyLevel: 40,
    isIndoor: false,
  },
  {
    id: 's2',
    name: '아모르나폴리 성수',
    category: '#힙스터카페',
    type: 'cafe',
    icon: Coffee,
    region: '성수 (Seongsu)',
    rating: '4.7',
    reviews: 890,
    address: '서울 성동구 아차산로 5길 12',
    price: '☕ 6,500원~',
    hours: '09:00 - 22:00',
    isOpen: true,
    waitingTime: '바로 입장',
    waitingLevel: 'low',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80',
    lat: 37.5470, 
    lng: 127.0530,
    description: '이탈리아 남부 감성의 베이커리 카페. 시그니처 에스프레소와 피스타치오 크림 카놀리 인기.',
    menuTip: '추천: 나폴리 에스프레소 & 루스티코 빵',
    energyLevel: 60,
    isIndoor: true,
  },
  {
    id: 's3',
    name: '소문난성수감자탕',
    category: '#웨이팅맛집',
    type: 'food',
    icon: Utensils,
    region: '성수 (Seongsu)',
    rating: '4.9',
    reviews: 3520,
    address: '서울 성동구 연무장길 45',
    price: '🍲 11,000원~',
    hours: '00:00 - 24:00 (24시)',
    isOpen: true,
    waitingTime: '약 40분 대기',
    waitingLevel: 'high',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
    lat: 37.5430, 
    lng: 127.0580,
    description: '성수동의 터줏대감 감자탕. 진하고 깊은 국물과 부드러운 살코기로 연일 긴 줄이 늘어서는 곳.',
    menuTip: '볶음밥 추가 필수! 라면사리 강추.',
    energyLevel: 80,
    isIndoor: true,
  },
  {
    id: 's4',
    name: '리얼월드 성수',
    category: '#이색체험',
    type: 'spot',
    icon: Zap,
    region: '성수 (Seongsu)',
    rating: '4.6',
    reviews: 510,
    address: '서울 성동구 연무장7길 16 2층',
    price: '🎮 15,000원~',
    hours: '12:00 - 21:00',
    isOpen: true,
    waitingTime: '약 10분 대기',
    waitingLevel: 'med',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80',
    lat: 37.5420, 
    lng: 127.0550,
    description: '모바일 앱과 오프라인 공간이 연동되는 XR 방탈출 게임 카페 & 라운지.',
    menuTip: '친구들과 팀을 이루어 추리 미션 수행!',
    energyLevel: 95,
    isIndoor: true,
  },
  {
    id: 's5',
    name: '서울숲 산책로',
    category: '#야외활동',
    type: 'spot',
    icon: Sun,
    region: '성수 (Seongsu)',
    rating: '4.9',
    reviews: 4800,
    address: '서울 성동구 뚝섬로 273',
    price: '입장료 무료',
    hours: '24시간 운영',
    isOpen: true,
    waitingTime: '원활',
    waitingLevel: 'low',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80',
    lat: 37.5490, 
    lng: 127.0430,
    description: '도심 속 대형 생태공원. 거울연못, 사슴사육장, 튜울립 정원 등 피크닉 명소.',
    menuTip: '돗자리 챙겨서 피크닉 라운지 이용하기',
    energyLevel: 50,
    isIndoor: false,
  },
  {
    id: 's6',
    name: 'LCDC SEOUL',
    category: '#실내데이트',
    type: 'spot',
    icon: Heart,
    region: '성수 (Seongsu)',
    rating: '4.5',
    reviews: 730,
    address: '서울 성동구 연무장17길 10',
    price: '무료 구경',
    hours: '11:00 - 20:00',
    isOpen: true,
    waitingTime: '바로 입장',
    waitingLevel: 'low',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
    lat: 37.5455, 
    lng: 127.0600,
    description: '다양한 브랜드를 한눈에 만나보는 복합문화공간. 3층 소품샵거리와 Cafe Ephemera가 유명.',
    menuTip: '팝업 전시 스케줄 사전 확인',
    energyLevel: 30,
    isIndoor: true,
  }
];

export default function App1({ currentDesign = 'v1' }) {
  const [selectedRegion, setSelectedRegion] = useState('성수 (Seongsu)');
  const [activeTag, setActiveTag] = useState('전체');
  const [energyFilter, setEnergyFilter] = useState(50);
  const [isRainMode, setIsRainMode] = useState(false);
  const [spots, setSpots] = useState(INITIAL_SPOTS);
  
  // 실시간 검색 및 자동완성 추천(Suggestions) 상태
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchBarRef = useRef(null);

  const [viewMode, setViewMode] = useState('split');
  const [course, setCourse] = useState([]);
  const [transportMode, setTransportMode] = useState('transit');
  const [routePlannerMode, setRoutePlannerMode] = useState('ai');

  const [activeSpotDetail, setActiveSpotDetail] = useState(null);
  const [isRandomModalOpen, setIsRandomModalOpen] = useState(false);
  const [randomResult, setRandomResult] = useState([]);
  const [isShaking, setIsShaking] = useState(false);
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);
  const [shareToastOpen, setShareToastOpen] = useState(false);

  // 글자 타이핑할 때마다 추천 검색어 실시간 페치 (2글자 이상)
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        try {
          const results = await searchKakaoPlaces(searchQuery);
          setSuggestions(results.slice(0, 5));
          setShowSuggestions(true);
        } catch (e) {
          console.error("추천 검색어 조회 오류:", e);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 외부 클릭 시 추천 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchBarRef.current && !searchBarRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 검색 실행 및 카드 목록 즉시 반영 핸들러
  const handleKakaoSearch = async (queryToSearch) => {
    const targetQuery = queryToSearch || searchQuery;
    if (!targetQuery.trim()) return;
    
    setIsSearching(true);
    setShowSuggestions(false);
    try {
      const results = await searchKakaoPlaces(targetQuery);
      if (results && results.length > 0) {
        setSpots(results); // 카카오 검색 결과로 핫플 카드 전면 자동 생성 및 교체!
      } else {
        alert('검색 결과가 없습니다. 다른 키워드로 검색해 보세요!');
      }
    } catch (error) {
      console.error('카카오 검색 실패:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const filteredSpots = useMemo(() => {
    return spots.filter(spot => {
      // 카카오 검색 결과인 경우엔 region 필터를 유연하게 패스하고 태그/날씨/에너지 필터만 적용
      if (spots === INITIAL_SPOTS && spot.region !== selectedRegion) return false;
      if (activeTag !== '전체' && spot.category !== activeTag) return false;
      if (isRainMode && !spot.isIndoor) return false;
      const diff = Math.abs(spot.energyLevel - energyFilter);
      if (spots === INITIAL_SPOTS && diff > 40) return false;
      return true;
    });
  }, [spots, selectedRegion, activeTag, isRainMode, energyFilter]);

  const toggleCourseSpot = (spot) => {
    if (course.some(item => item.id === spot.id)) {
      setCourse(course.filter(item => item.id !== spot.id));
    } else {
      setCourse([...course, spot]);
    }
  };

  const optimizeAIRoute = () => {
    if (course.length < 2) return;
    const unvisited = [...course];
    const optimized = [unvisited.shift()];

    while (unvisited.length > 0) {
      const current = optimized[optimized.length - 1];
      let nearestIdx = 0;
      let minDistance = Infinity;

      unvisited.forEach((item, idx) => {
        const dx = item.lat - current.lat;
        const dy = item.lng - current.lng;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < minDistance) {
          minDistance = dist;
          nearestIdx = idx;
        }
      });

      optimized.push(unvisited.splice(nearestIdx, 1)[0]);
    }
    setCourse(optimized);
  };

  const routeStats = useMemo(() => {
    if (course.length < 2) return { distanceKm: 0, timeMin: 0, cost: 0 };
    let totalDistDeg = 0;
    for (let i = 0; i < course.length - 1; i++) {
      const p1 = course[i];
      const p2 = course[i + 1];
      totalDistDeg += Math.sqrt(Math.pow(p2.lat - p1.lat, 2) + Math.pow(p2.lng - p1.lng, 2));
    }
    
    const distanceKm = Number((totalDistDeg * 111).toFixed(1));
    let timeMin = 0;
    let cost = 0;

    if (transportMode === 'walk') {
      timeMin = Math.round(distanceKm * 14);
      cost = 0;
    } else if (transportMode === 'transit') {
      timeMin = Math.round(distanceKm * 6 + course.length * 4);
      cost = 1400;
    } else {
      timeMin = Math.round(distanceKm * 3 + 3);
      cost = Math.round(4800 + distanceKm * 1200);
    }

    return { distanceKm, timeMin, cost };
  }, [course, transportMode]);

  const handleRandomPick = () => {
    setIsShaking(true);
    setTimeout(() => {
      const pool = spots.filter(s => s.region === selectedRegion);
      const shuffled = [...pool].sort(() => 0.5 - Math.random());
      const picked = shuffled.slice(0, 3);
      setRandomResult(picked);
      setIsShaking(false);
    }, 800);
  };

  const handleShareClick = () => {
    if (course.length === 0) return;
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
      const courseId = await shareCourse(course, `${authorName}님의 코스`);
      const shareUrl = `${window.location.origin}?course=${courseId}`;
      await navigator.clipboard.writeText(shareUrl);
      
      setShareToastOpen(true);
      setTimeout(() => setShareToastOpen(false), 3000);
    } catch (e) {
      console.error("공유 실패:", e);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0B10] text-gray-100 font-sans selection:bg-[#CCFF00] selection:text-black pb-12">
      
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-[#0A0B10]/80 backdrop-blur-xl border-b border-white/10 px-4 lg:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#CCFF00] via-[#FF007F] to-[#8A2BE2] p-0.5 flex items-center justify-center shadow-[0_0_20px_rgba(204,255,0,0.3)]">
            <div className="w-full h-full bg-[#0A0B10] rounded-[14px] flex items-center justify-center">
              <Zap className="w-5 h-5 text-[#CCFF00] fill-[#CCFF00]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-2xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#CCFF00] via-white to-[#FF007F]">
                Pick;L
              </span>
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-[#FF007F]/20 text-[#FF007F] border border-[#FF007F]/40">
                v1 라이트
              </span>
            </div>
            <p className="text-xs text-gray-400 font-medium hidden sm:block">Z세대의 힙한 핫플 & 동선 큐레이터</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="relative">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-[#161822] text-sm font-bold text-[#CCFF00] border border-[#CCFF00]/30 rounded-xl px-3 sm:px-4 py-2 pr-8 appearance-none focus:outline-none focus:border-[#CCFF00] cursor-pointer shadow-lg hover:border-[#CCFF00]/60 transition"
            >
              {REGIONS.map(reg => (
                <option key={reg} value={reg} className="bg-[#161822] text-white">
                  📍 {reg}
                </option>
              ))}
            </select>
            <ChevronRight className="w-4 h-4 text-[#CCFF00] absolute right-2.5 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
          </div>

          <button
            onClick={() => { setIsRandomModalOpen(true); handleRandomPick(); }}
            className="flex items-center gap-1.5 bg-gradient-to-r from-[#8A2BE2] to-[#FF007F] hover:opacity-90 text-white text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 rounded-xl transition shadow-[0_0_15px_rgba(255,0,127,0.4)]"
          >
            <Shuffle className="w-4 h-4" />
            <span className="hidden sm:inline">랜덤 픽 🎲</span>
          </button>

          <button
            onClick={handleShareClick}
            disabled={course.length === 0}
            className="p-2 bg-[#161822] hover:bg-white/10 disabled:opacity-40 rounded-xl border border-white/10 text-gray-300 hover:text-white transition"
            title="공유 링크 복사"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* CONTROL BAR & KAKAO SEARCH WITH SUGGESTIONS */}
      <section className="px-4 lg:px-8 py-4 border-b border-white/5 bg-[#10121B]/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
          
          {/* 실시간 검색창 + 추천 드롭다운 (Suggestions) */}
          <div className="relative flex items-center gap-2 w-full lg:w-96" ref={searchBarRef}>
            <form 
              onSubmit={(e) => { e.preventDefault(); handleKakaoSearch(); }} 
              className="flex items-center gap-2 w-full"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                  placeholder="카카오 실시간 장소 검색 (예: 연남동 카페)"
                  className="w-full bg-[#181A26] text-sm text-white placeholder-gray-500 px-4 py-2.5 pl-9 rounded-xl border border-white/10 focus:outline-none focus:border-[#CCFF00] transition"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className="bg-[#CCFF00] hover:bg-[#bce600] text-black font-extrabold text-xs px-4 py-3 rounded-xl transition shrink-0 disabled:opacity-50 shadow-md"
              >
                {isSearching ? '검색 중...' : '검색'}
              </button>
            </form>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-14 mt-2 bg-[#161822] border border-white/15 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl">
                <div className="px-3 py-2 text-[10px] text-gray-400 font-bold border-b border-white/5 flex items-center justify-between">
                  <span>💡 실시간 추천 장소</span>
                  <span>클릭 시 카드 생성</span>
                </div>
                {suggestions.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSearchQuery(item.name);
                      handleKakaoSearch(item.name);
                    }}
                    className="px-4 py-2.5 hover:bg-white/5 cursor-pointer flex items-center justify-between transition border-b border-white/5 last:border-none"
                  >
                    <div>
                      <p className="text-xs font-bold text-white flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#CCFF00]" />
                        {item.name}
                      </p>
                      <p className="text-[10px] text-gray-400 truncate max-w-[220px]">{item.address}</p>
                    </div>
                    <span className="text-[10px] font-bold text-[#FF007F] bg-[#FF007F]/10 px-2 py-0.5 rounded-full">
                      {item.category}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {spots !== INITIAL_SPOTS && (
              <button
                type="button"
                onClick={() => { setSpots(INITIAL_SPOTS); setSearchQuery(''); }}
                className="text-xs text-gray-400 hover:text-white underline shrink-0 px-1"
              >
                초기화
              </button>
            )}
          </div>

          {/* 태그 필터 영역 */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {TAG_FILTERS.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`text-xs font-bold px-3.5 py-2 rounded-full whitespace-nowrap transition-all ${
                  activeTag === tag
                    ? 'bg-[#CCFF00] text-black shadow-[0_0_12px_rgba(204,255,0,0.5)] scale-105'
                    : 'bg-[#181A26] text-gray-300 hover:bg-[#222536] border border-white/5'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* SPOTS LIST */}
        <section className={`lg:col-span-7 flex flex-col gap-4 ${viewMode === 'map' ? 'hidden lg:flex' : ''}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#CCFF00]" />
                <span>핫플레이스 추천</span>
              </h2>
              <span className="text-xs bg-white/10 text-gray-300 px-2 py-0.5 rounded-full font-mono">
                {filteredSpots.length}개
              </span>
            </div>

            <div className="flex bg-[#161822] p-1 rounded-xl border border-white/10 text-xs font-bold">
              <button
                onClick={() => setViewMode('split')}
                className={`px-3 py-1.5 rounded-lg transition ${viewMode === 'split' ? 'bg-[#CCFF00] text-black' : 'text-gray-400 hover:text-white'}`}
              >
                분할 뷰
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-lg transition ${viewMode === 'grid' ? 'bg-[#CCFF00] text-black' : 'text-gray-400 hover:text-white'}`}
              >
                피드 카드
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-3 py-1.5 rounded-lg transition ${viewMode === 'map' ? 'bg-[#CCFF00] text-black' : 'text-gray-400 hover:text-white'}`}
              >
                지도 전용
              </button>
            </div>
          </div>

          {filteredSpots.length === 0 ? (
            <div className="bg-[#12141F] rounded-3xl p-12 text-center border border-white/5">
              <AlertCircle className="w-10 h-10 text-gray-500 mx-auto mb-3" />
              <p className="text-gray-300 font-bold">조건에 맞는 핫플이 없습니다!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredSpots.map(spot => {
                const isAdded = course.some(c => c.id === spot.id);
                const SpotIcon = spot.icon || MapPin;

                return (
                  <div
                    key={spot.id}
                    className="group relative bg-[#12141F] hover:bg-[#181A28] border border-white/10 hover:border-[#CCFF00]/50 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-xl"
                  >
                    <div className="relative h-44 overflow-hidden">
                      <img src={spot.image} alt={spot.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#12141F] via-transparent to-black/30" />
                      
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="bg-black/60 backdrop-blur-md text-[#CCFF00] text-[11px] font-bold px-2.5 py-1 rounded-full border border-[#CCFF00]/30">
                          {spot.category}
                        </span>
                        {spot.waitingTime && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md ${
                            spot.waitingLevel === 'high' ? 'bg-red-500/80 text-white' :
                            spot.waitingLevel === 'med' ? 'bg-amber-500/80 text-white' : 'bg-emerald-500/80 text-white'
                          }`}>
                            {spot.waitingTime}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={(e) => { e.stopPropagation(); toggleCourseSpot(spot); }}
                        className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                          isAdded 
                            ? 'bg-[#FF007F] text-white shadow-[0_0_12px_rgba(255,0,127,0.6)] scale-110' 
                            : 'bg-black/50 hover:bg-black/80 text-white border border-white/20'
                        }`}
                      >
                        {isAdded ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                      </button>

                      <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between">
                        <div>
                          <h3 className="text-base font-extrabold text-white group-hover:text-[#CCFF00] transition-colors flex items-center gap-1.5">
                            <SpotIcon className="w-4 h-4 text-[#CCFF00]" />
                            {spot.name}
                          </h3>
                          <p className="text-xs text-gray-300 font-mono">{spot.price || spot.address}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-amber-400">★ {spot.rating}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 flex flex-col justify-between flex-1 gap-2">
                      <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{spot.description || spot.address}</p>
                      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400">
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-[#CCFF00]" />{spot.hours}</span>
                        <button onClick={() => setActiveSpotDetail(spot)} className="text-[#CCFF00] hover:underline font-bold flex items-center gap-0.5">
                          상세보기 <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* MAP & ROUTE PLANNER */}
        <section className={`lg:col-span-5 flex flex-col gap-4 ${viewMode === 'grid' ? 'hidden lg:flex' : ''}`}>
          <div className="bg-[#12141F] border border-white/10 rounded-3xl overflow-hidden relative shadow-2xl flex flex-col h-[380px] lg:h-[440px]">
            <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
              <div className="bg-[#0A0B10]/80 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/10 text-xs font-bold text-white flex items-center gap-2 pointer-events-auto">
                <MapPin className="w-4 h-4 text-[#FF007F]" />
                <span>{selectedRegion} 라이트 지도</span>
              </div>
            </div>

            <div className="w-full h-full relative z-0">
              <ThemeMap version={currentDesign} spots={course.length > 0 ? course : filteredSpots} />
            </div>
          </div>

          <div className="bg-[#12141F] border border-white/10 rounded-3xl p-5 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Navigation className="w-5 h-5 text-[#CCFF00]" />
                <h3 className="font-bold text-base text-white">나만의 놀코스 동선</h3>
              </div>

              <div className="flex bg-[#181A26] p-1 rounded-xl text-xs font-bold border border-white/10">
                <button
                  onClick={() => setRoutePlannerMode('ai')}
                  className={`px-3 py-1 rounded-lg transition ${routePlannerMode === 'ai' ? 'bg-[#FF007F] text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                >
                  AI 자동 최적
                </button>
                <button
                  onClick={() => setRoutePlannerMode('custom')}
                  className={`px-3 py-1 rounded-lg transition ${routePlannerMode === 'custom' ? 'bg-[#FF007F] text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                >
                  직접 순서
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between bg-[#181A26] p-2 rounded-2xl border border-white/5 text-xs font-medium">
              <span className="text-gray-400 pl-2">이동 수단:</span>
              <div className="flex items-center gap-1">
                {[
                  { id: 'walk', label: '🚶 도보' },
                  { id: 'transit', label: '🚌 대중교통' },
                  { id: 'taxi', label: '🚕 택시' },
                ].map(mode => (
                  <button
                    key={mode.id}
                    onClick={() => setTransportMode(mode.id)}
                    className={`px-3 py-1 rounded-xl transition font-bold ${
                      transportMode === mode.id ? 'bg-[#CCFF00] text-black shadow-md' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {course.length === 0 ? (
              <div className="py-8 text-center text-gray-500 text-xs border border-dashed border-white/10 rounded-2xl">
                장소 카드의 <span className="text-[#CCFF00] font-bold">+ 버튼</span>을 눌러 코스에 담아보세요!
              </div>
            ) : (
              <div className="flex flex-col gap-2 max-h-52 overflow-y-auto pr-1">
                {course.map((spot, idx) => (
                  <div key={spot.id} className="flex items-center justify-between bg-[#181A26] p-2.5 rounded-2xl border border-white/5 text-xs">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <span className="w-5 h-5 rounded-full bg-[#CCFF00] text-black font-extrabold text-[11px] flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-white truncate">{spot.name}</span>
                    </div>
                    <button onClick={() => toggleCourseSpot(spot)} className="text-gray-400 hover:text-red-400 p-1">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {course.length > 0 && (
              <div className="bg-gradient-to-r from-[#181A26] to-[#221733] p-3 rounded-2xl border border-white/10 flex items-center justify-between text-xs">
                <div>
                  <span className="text-gray-400 block text-[10px]">총 이동거리/소요시간</span>
                  <span className="font-extrabold text-[#CCFF00] text-sm">{routeStats.distanceKm}km ({routeStats.timeMin}분)</span>
                </div>
                <div className="text-right">
                  <span className="text-gray-400 block text-[10px]">예상 교통비</span>
                  <span className="font-bold text-white">{routeStats.cost === 0 ? '무료' : `${routeStats.cost.toLocaleString()}원`}</span>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              {routePlannerMode === 'ai' && course.length >= 2 && (
                <button
                  onClick={optimizeAIRoute}
                  className="flex-1 py-2.5 bg-gradient-to-r from-[#8A2BE2] to-[#FF007F] text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-1"
                >
                  <Sparkles className="w-4 h-4" /> AI 최적 재배열
                </button>
              )}
              <button
                disabled={course.length === 0}
                onClick={handleShareClick}
                className="flex-1 py-2.5 bg-[#CCFF00] disabled:opacity-40 text-black font-extrabold text-xs rounded-2xl flex items-center justify-center gap-1 hover:bg-[#bce600] transition active:scale-95"
              >
                <Share2 className="w-4 h-4" /> 코스 공유 링크 복사
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* MODALS */}
      <NicknameModal
        isOpen={isNicknameModalOpen}
        onClose={() => setIsNicknameModalOpen(false)}
        onConfirm={handleNicknameConfirm}
        theme="v1"
      />

      {activeSpotDetail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#12141F] border border-white/20 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative">
            <button onClick={() => setActiveSpotDetail(null)} className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center">
              <X className="w-5 h-5" />
            </button>
            <div className="relative h-56">
              <img src={activeSpotDetail.image} alt={activeSpotDetail.name} className="w-full h-full object-cover" />
              <div className="absolute bottom-4 left-5 right-5">
                <h2 className="text-2xl font-black text-white">{activeSpotDetail.name}</h2>
              </div>
            </div>
            <div className="p-5 flex flex-col gap-4 text-xs">
              <p className="text-gray-300">{activeSpotDetail.description || activeSpotDetail.address}</p>
              <button onClick={() => { toggleCourseSpot(activeSpotDetail); setActiveSpotDetail(null); }} className="w-full py-3 bg-[#CCFF00] text-black font-black rounded-2xl">
                코스 추가/제거
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Share Toast */}
      {shareToastOpen && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[99999] bg-[#12141F] border border-[#CCFF00] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <div className="w-6 h-6 rounded-full bg-[#CCFF00] text-black flex items-center justify-center font-bold text-xs">✓</div>
          <div className="text-xs">
            <p className="font-bold text-[#CCFF00]">공유 링크 복사 완료!</p>
            <p className="text-zinc-400 text-[10px]">클립보드에 저장되었습니다. 친구에게 공유해보세요.</p>
          </div>
        </div>
      )}
    </div>
  );
}