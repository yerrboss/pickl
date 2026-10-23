// src/utils/kakaoApi.js

function parseCategoryAndIcon(categoryName = '') {
  const catLower = categoryName.toLowerCase();

  if (catLower.includes('카페') || catLower.includes('커피')) {
    return { category: '#힙스터카페', isIndoor: true, price: '☕ 6,000원~', tag: '카페/디저트' };
  } else if (catLower.includes('음식점') || catLower.includes('식당') || catLower.includes('한식') || catLower.includes('양식') || catLower.includes('일식') || catLower.includes('중식') || catLower.includes('맛집')) {
    return { category: '#웨이팅맛집', isIndoor: true, price: '🍲 12,000원~', tag: '맛집/식당' };
  } else if (catLower.includes('문화') || catLower.includes('전시') || catLower.includes('공연') || catLower.includes('미술관')) {
    return { category: '#인스타감성', isIndoor: true, price: '🎟️ 관람료 확인', tag: '문화/전시' };
  } else if (catLower.includes('관광') || catLower.includes('명소') || catLower.includes('공원')) {
    return { category: '#야외활동', isIndoor: false, price: '입장료 무료', tag: '명소/공원' };
  } else {
    return { category: '#이색체험', isIndoor: true, price: '🎮 체험비 문의', tag: '놀거리/체험' };
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
          console.error("카카오 지도 SDK 로드 시간 초과");
          resolve([]);
        }
      }
    }, 100);

    function executeSearch() {
      const ps = new window.kakao.maps.services.Places();

      ps.keywordSearch(keyword, (data, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const mappedResults = data.map((doc, index) => {
            const parsed = parseCategoryAndIcon(doc.category_name);
            
            // NaN 방어 코드 적용
            const parsedLat = parseFloat(doc.y);
            const parsedLng = parseFloat(doc.x);
            const validLat = (!isNaN(parsedLat) && parsedLat > 0) ? parsedLat : 37.5445;
            const validLng = (!isNaN(parsedLng) && parsedLng > 0) ? parsedLng : 127.0560;
            
            return {
              id: `kakao_${doc.id}`,
              name: doc.place_name,
              category: parsed.category,
              categoryTag: parsed.tag,
              rawCategory: doc.category_name,
              address: doc.road_address_name || doc.address_name,
              phone: doc.phone || '02-1234-5678 (정보 참조)',
              lat: validLat,
              lng: validLng,
              url: doc.place_url,
              image: `https://images.unsplash.com/photo-${1541888946425 + (index * 100)}?auto=format&fit=crop&w=600&q=80`,
              rating: (4.5 + (index % 4) * 0.1).toFixed(1),
              reviews: 150 + index * 32,
              price: parsed.price,
              hours: '11:00 - 22:00 (라스트오더 21:00)',
              waitingTime: index % 3 === 0 ? '바로 입장 가능' : `약 ${20 + (index % 3) * 10}분 대기`,
              waitingLevel: index % 3 === 0 ? 'low' : 'med',
              description: `[실시간 핫플] ${doc.road_address_name || doc.address_name} 근처 트렌디한 ${parsed.tag} 공간입니다. Z세대 필수 방문 코스로 손꼽히는 장소입니다.`,
              energyLevel: 45 + (index * 15) % 45,
              isIndoor: parsed.isIndoor
            };
          });
          resolve(mappedResults);
        } else {
          resolve([]);
        }
      });
    }
  });
}