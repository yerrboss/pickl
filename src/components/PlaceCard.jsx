// App.jsx 내부 일부 예시
import React, { useState, useEffect } from 'react';
import { searchKakaoPlaces } from './utils/kakaoApi';
import PlaceCard from './components/PlaceCard';
import PlaceDetailModal from './components/PlaceDetailModal';

export default function App() {
  const [selectedLocation, setSelectedLocation] = useState('성수');
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null); // 모달용
  const [courseList, setCourseList] = useState([]);

  // 위치 선택 변경 시 자동으로 맛집/놀거리 데이터 검색
  useEffect(() => {
    const fetchDefaultPlaces = async () => {
      const results = await searchKakaoPlaces(`${selectedLocation} 맛집 놀거리`);
      if (results && results.length > 0) {
        setPlaces(results);
      }
    };
    fetchDefaultPlaces();
  }, [selectedLocation]);

  const handleToggleCourse = (place) => {
    setCourseList(prev => 
      prev.some(item => item.id === place.id)
        ? prev.filter(item => item.id === place.id)
        : [...prev, place]
    );
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* 장소 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {places.map(place => (
          <PlaceCard 
            key={place.id}
            place={place}
            onSelect={(item) => setSelectedPlace(item)}
            onToggleCourse={handleToggleCourse}
            isAdded={courseList.some(item => item.id === place.id)}
          />
        ))}
      </div>

      {/* 상세 정보 모달 */}
      {selectedPlace && (
        <PlaceDetailModal 
          place={selectedPlace}
          onClose={() => setSelectedPlace(null)}
          onToggleCourse={handleToggleCourse}
          isAdded={courseList.some(item => item.id === selectedPlace.id)}
        />
      )}
    </div>
  );
}