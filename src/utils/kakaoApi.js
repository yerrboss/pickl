// src/utils/kakaoApi.js

function parseCategoryAndIcon(categoryName = '') {
  const catLower = categoryName.toLowerCase();

  if (catLower.includes('카페') || catLower.includes('커피')) {
    return { category: '#힙스터카페', isIndoor: true, price: '☕ 6,000원~' };
  } else if (catLower.includes('음식점') || catLower.includes('식당') || catLower.includes('한식') || catLower.includes('양식') || catLower.includes('일식') || catLower.includes('중식') || catLower.includes('맛집')) {
    return { category: '#웨이팅맛집', isIndoor: true, price: '🍲 12,000원~' };
  } else if (catLower.includes('문화') || catLower.includes('전시') || catLower.includes('공연') || catLower.includes('미술관')) {
    return { category: '#인스타감성', isIndoor: true, price: '🎟️ 관람료 확인' };
  } else if (catLower.includes('관광') || catLower.includes('명소') || catLower.includes('공원')) {
    return { category: '#야외활동', isIndoor: false, price: '입장료 무료' };
  } else {
    return { category: '#이색체험', isIndoor: true, price: '🎮 체험비 문의' };
  }
}

export async function searchKakaoPlaces(keyword) {
  const KAKAO_JS_KEY = "c351775970e2a4f35089aba5d51d01c6";

  return new Promise((resolve) => {
    // 이미 SDK가 로드되어 있는지 확인
    if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
      const script = document.createElement('script');
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${KAKAO_JS_KEY}&libraries=services`;
      script.onload = () => {
        window.kakao.maps.load(() => {
          executeSearch(keyword, resolve);
        });
      };
      script.onerror = () => {
        console.error("카카오 맵 SDK 로드 실패");
        resolve([]);
      };
      document.head.appendChild(script);
    } else {
      executeSearch(keyword, resolve);
    }
  });
}

function executeSearch(keyword, resolve) {
  const ps = new window.kakao.maps.services.Places();
  
  ps.keywordSearch(keyword, (data, status) => {
    if (status === window.kakao.maps.services.Status.OK) {
      const results = data.map((doc, index) => {
        const parsed = parseCategoryAndIcon(doc.category_name);
        
        return {
          id: `kakao_${doc.id}`,
          name: doc.place_name,
          category: parsed.category,
          address: doc.road_address_name || doc.address_name,
          phone: doc.phone || '정보 없음',
          lat: parseFloat(doc.y),
          lng: parseFloat(doc.x),
          url: doc.place_url,
          image: `https://images.unsplash.com/photo-${1541888946425 + index * 100}?auto=format&fit=crop&w=600&q=80`,
          rating: (4.5 + (index % 4) * 0.1).toFixed(1),
          reviews: 150 + index * 32,
          price: parsed.price,
          hours: '11:00 - 21:00 (정보 참조)',
          waitingTime: index % 3 === 0 ? '바로 입장' : '약 20분 대기',
          waitingLevel: index % 3 === 0 ? 'low' : 'med',
          description: `[카카오 실시간] ${doc.road_address_name || doc.address_name}에 위치한 ${doc.place_name}입니다.`,
          energyLevel: 45 + (index * 15) % 45,
          isIndoor: parsed.isIndoor
        };
      });
      resolve(results);
    } else {
      resolve([]);
    }
  });
}