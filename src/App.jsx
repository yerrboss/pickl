import React, { useState, useEffect } from 'react';
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
import { searchKakaoPlaces } from './utils/kakaoApi';
import { ShieldAlert, Share2, User, BookmarkCheck } from 'lucide-react';

export default function App() {
  const [currentDesign, setCurrentDesign] = useState('v1');
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  
  const [sharing, setSharing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [nickname, setNickname] = useState(getLocalNickname());
  const [generatedShareUrl, setGeneratedShareUrl] = useState('');

  // 🌍 [중앙 집중식 데이터 및 실시간 검색 제어]
  const [selectedRegion, setSelectedRegion] = useState('성수');
  const [searchQuery, setSearchQuery] = useState('');
  const [spots, setSpots] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [courseList, setCourseList] = useState([]);

  // 실시간 카카오 API 검색 및 자동 카테고리화 (NaN 방어 코드 적용)
  // 실시간 카카오 API 검색 및 자동 카테고리화 (장소 카드 자동 생성)
  const handleSearchSubmit = async (queryOverride) => {
    const targetQuery = queryOverride || searchQuery || `${selectedRegion} 맛집 놀거리`;
    setIsSearching(true);
    try {
      const results = await searchKakaoPlaces(targetQuery);
      if (results && results.length > 0) {
        const formatted = results.map((doc, idx) => {
          // 카테고리 자동 파싱 로직
          const catName = doc.category_name || '';
          let assignedCategory = '#인스타감성';
          if (catName.includes('카페') || catName.includes('커피')) {
            assignedCategory = '#힙스터카페';
          } else if (catName.includes('음식점') || catName.includes('식당') || catName.includes('한식') || catName.includes('양식') || catName.includes('일식') || catName.includes('중식')) {
            assignedCategory = '#웨이팅맛집';
          } else if (catName.includes('문화') || catName.includes('관광') || catName.includes('체험')) {
            assignedCategory = '#이색체험';
          } else if (catName.includes('공원')) {
            assignedCategory = '#야외활동';
          } else {
            assignedCategory = '#실내데이트';
          }

          return {
            id: `kakao_${doc.id}`,
            name: doc.place_name,
            category: assignedCategory,
            region: selectedRegion,
            address: doc.road_address_name || doc.address_name,
            phone: doc.phone || '정보 없음',
            price: '가격 정보 참조',
            hours: '11:00 - 21:00',
            rating: (4.5 + (idx % 4) * 0.1).toFixed(1),
            reviews: 120 + idx * 15,
            image: `https://images.unsplash.com/photo-${1541888946425 + (idx * 100)}?auto=format&fit=crop&w=600&q=80`,
            lat: parseFloat(doc.y) || 37.5445,
            lng: parseFloat(doc.x) || 127.0560,
            url: doc.place_url,
            description: `[실시간 검색] ${doc.road_address_name || doc.address_name} 인근의 트렌디한 핫플레이스입니다.`,
            isIndoor: !catName.includes('공원')
          };
        });
        setSpots(formatted); // 💡 이 코드가 실행되는 순간 카드들이 촤르르륵 자동 생성됩니다!
      } else {
        setSpots([]); // 결과가 없을 경우 빈 배열 처리 (alert 없음)
      }
    } catch (e) {
      console.error("카카오 검색 오류:", e);
      setSpots([]);
    } finally {
      setIsSearching(false);
    }
  };

  // 지역 변경 시 자동 검색
  useEffect(() => {
    handleSearchSubmit(`${selectedRegion} 맛집 핫플`);
  }, [selectedRegion]);

  // 코스 추가/제거 핸들러
  const handleToggleCourse = (spot) => {
    setCourseList(prev => 
      prev.some(item => item.id === spot.id)
        ? prev.filter(item => item.id !== spot.id)
        : [...prev, spot]
    );
  };

  const handleSaveClick = () => {
    const savedName = getLocalNickname();
    if (savedName) executeAction(savedName, 'save');
    else setIsNicknameModalOpen(true);
  };

  const handleShareClick = () => {
    const savedName = getLocalNickname();
    if (savedName) executeAction(savedName, 'share');
    else setIsNicknameModalOpen(true);
  };

  const handleNicknameConfirm = (inputName) => {
    setLocalNickname(inputName);
    setNickname(inputName);
    setIsNicknameModalOpen(false);
  };

  const executeAction = async (authorName, actionType) => {
    try {
      if (actionType === 'save') setSaving(true);
      else setSharing(true);
      
      const targets = courseList.length > 0 ? courseList : spots.slice(0, 2);
      const courseId = await shareCourse(targets, `${authorName}님의 핫플 코스`);
      const shareUrl = `${window.location.origin}?course=${courseId}`;
      setGeneratedShareUrl(shareUrl);

      if (actionType === 'save') {
        alert(`✨ '${authorName}'님 이름으로 코스가 안전하게 저장되었습니다!`);
      } else {
        setIsShareModalOpen(true);
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
      case 'v1': return 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20';
      case 'v2': return 'bg-lime-400 hover:bg-lime-300 text-black shadow-lime-400/20';
      case 'v3': return 'bg-fuchsia-600 hover:bg-fuchsia-500 text-white shadow-fuchsia-600/20';
      case 'v4': return 'bg-cyan-400 hover:bg-cyan-300 text-black shadow-cyan-400/20';
      case 'v5': return 'bg-amber-100 hover:bg-amber-200 text-stone-900 shadow-amber-100/20';
      case 'v6':
      default: return 'bg-amber-400 hover:bg-amber-300 text-stone-950 shadow-amber-400/20';
    }
  };

  const sharedProps = {
    currentDesign,
    selectedRegion,
    setSelectedRegion,
    searchQuery,
    setSearchQuery,
    spots,
    isSearching,
    onSearchSubmit: handleSearchSubmit,
    courseList,
    onToggleCourse: handleToggleCourse
  };

  return (
    <div className="relative min-h-screen">
      <NicknameModal isOpen={isNicknameModalOpen} onClose={() => setIsNicknameModalOpen(false)} onConfirm={handleNicknameConfirm} theme={currentDesign} />
      <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} shareUrl={generatedShareUrl} theme={currentDesign} />
      <LegalDisclaimerModal isOpen={isDisclaimerOpen} onClose={() => setIsDisclaimerOpen(false)} />

      {/* 우측 하단 플로팅 캡슐 */}
      <div className="fixed bottom-6 right-6 z-[9999] bg-zinc-950/90 backdrop-blur-md border border-zinc-700 p-1.5 rounded-full shadow-2xl flex items-center gap-1.5">
        {nickname && (
          <div className="flex items-center gap-1.5 bg-zinc-800 text-amber-300 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap border border-zinc-700">
            <User className="w-3.5 h-3.5 text-amber-400" />
            <span>{nickname}</span>
          </div>
        )}
        <button onClick={handleSaveClick} disabled={saving} className="flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3 py-1 rounded-full text-xs font-bold transition whitespace-nowrap border border-zinc-700 active:scale-95">
          <BookmarkCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>{saving ? '저장 중...' : '저장'}</span>
        </button>
        <button onClick={handleShareClick} disabled={sharing} className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black transition whitespace-nowrap active:scale-95 shadow-md ${getAccentButtonStyle()}`}>
          <Share2 className="w-3.5 h-3.5" />
          <span>{sharing ? '생성 중...' : '코스 공유'}</span>
        </button>
        <button onClick={() => setIsDisclaimerOpen(true)} className="flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2.5 py-1 rounded-full text-xs font-bold transition whitespace-nowrap border border-zinc-700">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          <span className="hidden sm:inline">법적고지</span>
        </button>
      </div>

      {/* 하단 디자인 토글 바 */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9998] bg-zinc-950/90 backdrop-blur-md border border-zinc-700 p-1.5 rounded-full shadow-2xl flex gap-1 overflow-x-auto max-w-[80vw] md:max-w-none">
        {[
          { id: 'v1', label: 'v1 라이트', color: 'bg-indigo-600 text-white' },
          { id: 'v2', label: 'v2 네온다크', color: 'bg-lime-400 text-black' },
          { id: 'v3', label: 'v3 숏폼/벤토', color: 'bg-fuchsia-600 text-white' },
          { id: 'v4', label: 'v4 Y2K 사이버', color: 'bg-cyan-400 text-black' },
          { id: 'v5', label: 'v5 에디토리얼', color: 'bg-amber-100 text-stone-900' },
          { id: 'v6', label: 'v6 RPG 맵', color: 'bg-amber-400 text-stone-950 font-black' },
        ].map(v => (
          <button
            key={v.id}
            onClick={() => setCurrentDesign(v.id)}
            className={`px-3 py-1 rounded-full text-xs font-bold transition whitespace-nowrap ${
              currentDesign === v.id ? `${v.color} shadow-md` : 'text-zinc-400 hover:text-white'
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* Render Active Design */}
      {currentDesign === 'v1' && <App1 {...sharedProps} />}
      {currentDesign === 'v2' && <App2 {...sharedProps} />}
      {currentDesign === 'v3' && <App3 {...sharedProps} />}
      {currentDesign === 'v4' && <App4 {...sharedProps} />}
      {currentDesign === 'v5' && <App5 {...sharedProps} />}
      {currentDesign === 'v6' && <App6 {...sharedProps} />}
    </div>
  );
}