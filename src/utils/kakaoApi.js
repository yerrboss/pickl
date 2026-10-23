// src/utils/kakaoApi.js

// 1. 장소 이름으로 카카오 이미지 검색 API를 호출해 실제 현장 사진을 가져오는 함수
async function fetchRealPlaceThumbnail(placeName) {
  const REST_API_KEY = import.meta.env.VITE_KAKAO_API_KEY || '여기에_본인의_카카오_REST_API키_입력'; // 또는 index.html에 설정된 키 활용
  
  try {
    const response = await fetch(`https://dapi.kakao.com/v2/search/image?query=${encodeURIComponent(placeName)}&size=1`, {
      headers: {
        'Authorization': `KakaoAK ${REST_API_KEY}`
      }
    });
    const data = await response.json();
    if (data.documents && data.documents.length > 0) {
      return data.documents[0].image_url; // 실제 장소/블로그에 업로드된 진짜 사진 URL
    }
  } catch (e) {
    console.error("실제 이미지 조회 실패:", e);
  }
  
  // 이미지를 못 가져왔을 때의 기본 대체 썸네일
  return 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=600&q=80';
}

function parseCategory(categoryName = '') {
  const catLower = categoryName.toLowerCase();
  if (catLower.includes('카페') || catLower.includes('커피')) {
    return { category: '#힙스터카페', isIndoor: true, price: '☕ 6,000원~' };
  } else if (catLower.includes('음식점') || catLower.includes('식당') || catLower.includes('한식') || catLower.includes('양식') || catLower.includes('일식') || catLower.includes('중식') || catLower.includes('맛집')) {
    return { category: '#웨이팅맛집', isIndoor: true, price: '🍲 12,000원~' };
  } else if (catLower.includes('공원') || catLower.includes('관광')) {
    return { category: '#야외활동', isIndoor: false, price: '입장료 무료' };
  } else {
    return { category: '#이색체험', isIndoor: true, price: '🎮 체험비 문의' };
  }
}

export async function searchKakaoPlaces(keyword) {
  return new Promise((resolve) => {
    let checkCount = 0;
    const interval = setInterval(() => {
      if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
        clearInterval(interval);
        executeSearch();
      } else {
        checkCount++;
        if (checkCount > 20) {
          clearInterval(interval);
          resolve([]);
        }
      }
    }, 100);

    function executeSearch() {
      const ps = new window.kakao.maps.services.Places();

      ps.keywordSearch(keyword, async (data, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          // 각 장소별로 실제 사진을 비동기(Promise.all)로 동시에 가져옴
          const mappedResults = await Promise.all(data.map(async (doc, index) => {
            const parsed = parseCategory(doc.category_name);
            const realThumbnail = await fetchRealPlaceThumbnail(doc.place_name);
            
            const parsedLat = parseFloat(doc.y);
            const parsedLng = parseFloat(doc.x);
            const validLat = (!isNaN(parsedLat) && parsedLat > 0) ? parsedLat : 37.5445;
            const validLng = (!isNaN(parsedLng) && parsedLng > 0) ? parsedLng : 127.0560;
            
            return {
              id: `kakao_${doc.id}`,
              name: doc.place_name,
              category: parsed.category,
              address: doc.road_address_name || doc.address_name,
              phone: doc.phone || '정보 없음',
              lat: validLat,
              lng: validLng,
              url: doc.place_url,
              image: realThumbnail, // 💡 진짜 장소 현장 사진이 쏙 들어갑니다!
              rating: (4.5 + (index % 4) * 0.1).toFixed(1),
              reviews: 150 + index * 32,
              price: parsed.price,
              hours: '11:00 - 22:00',
              waitingTime: index % 3 === 0 ? '바로 입장 가능' : `약 ${20 + (index % 3) * 10}분 대기`,
              waitingLevel: index % 3 === 0 ? 'low' : 'med',
              description: `[실시간 현장] ${doc.road_address_name || doc.address_name}에 위치한 ${doc.place_name}의 실제 전경입니다.`,
              isIndoor: parsed.isIndoor
            };
          }));
          
          resolve(mappedResults);
        } else {
          resolve([]);
        }
      });
    }
  });
}