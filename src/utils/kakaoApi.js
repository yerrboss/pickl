// src/utils/kakaoApi.js

const THUMBNAIL_POOLS = {
  cafe: [
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80'
  ],
  food: [
    'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=600&q=80'
  ],
  spot: [
    'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80'
  ]
};

const photoCache = new Map();

function parseCategoryAndThumbnail(categoryName = '', index = 0) {
  const catLower = categoryName.toLowerCase();
  let pool = THUMBNAIL_POOLS.spot;
  let categoryTag = '#이색체험';
  let price = '가격 정보 참조';

  if (catLower.includes('카페') || catLower.includes('커피')) {
    pool = THUMBNAIL_POOLS.cafe;
    categoryTag = '#힙스터카페';
    price = '☕ 6,000원~';
  } else if (
    catLower.includes('음식점') ||
    catLower.includes('식당') ||
    catLower.includes('한식') ||
    catLower.includes('양식') ||
    catLower.includes('일식') ||
    catLower.includes('중식') ||
    catLower.includes('맛집')
  ) {
    pool = THUMBNAIL_POOLS.food;
    categoryTag = '#웨이팅맛집';
    price = '🍲 12,000원~';
  } else if (catLower.includes('공원') || catLower.includes('관광')) {
    categoryTag = '#야외활동';
    price = '입장료 무료';
  }

  return { category: categoryTag, price, image: pool[index % pool.length] };
}

export async function getPlaceSuggestions(keyword) {
  const trimmed = (keyword || '').trim();
  if (!trimmed) return [];

  if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
    return new Promise((resolve) => {
      const ps = new window.kakao.maps.services.Places();
      ps.keywordSearch(trimmed, (data, status) => {
        if (status === window.kakao.maps.services.Status.OK && Array.isArray(data)) {
          resolve(data.slice(0, 6));
        } else {
          resolve([]);
        }
      });
    });
  }

  try {
    const res = await fetch(`/api/kakao-search?query=${encodeURIComponent(trimmed)}`);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.documents) ? data.documents.slice(0, 6) : [];
  } catch {
    return [];
  }
}

async function fetchLivePlacePhoto(spot, fallbackImage) {
  const cacheKey = spot.id || `${spot.name}_${spot.address}`;
  if (photoCache.has(cacheKey)) {
    return photoCache.get(cacheKey);
  }

  try {
    const params = new URLSearchParams({
      name: spot.name,
      address: spot.address || ''
    });
    const res = await fetch(`/api/place-photo?${params.toString()}`);
    if (!res.ok) {
      photoCache.set(cacheKey, fallbackImage);
      return fallbackImage;
    }
    const data = await res.json();
    const resolvedUrl = data?.imageUrl || fallbackImage;
    photoCache.set(cacheKey, resolvedUrl);
    return resolvedUrl;
  } catch {
    photoCache.set(cacheKey, fallbackImage);
    return fallbackImage;
  }
}

export async function searchKakaoPlaces(keyword) {
  if (!keyword || !keyword.trim()) return [];

  try {
    const res = await fetch(`/api/kakao-search?query=${encodeURIComponent(keyword.trim())}`);
    if (!res.ok) return [];

    const data = await res.json();
    const docs = Array.isArray(data.documents) ? data.documents : [];

    const mappedResults = docs.map((doc, index) => {
      const parsed = parseCategoryAndThumbnail(doc.category_name, index);
      const parsedLat = parseFloat(doc.y);
      const parsedLng = parseFloat(doc.x);
      const validLat = !isNaN(parsedLat) && parsedLat > 0 ? parsedLat : 37.5445;
      const validLng = !isNaN(parsedLng) && parsedLng > 0 ? parsedLng : 127.0560;

      return {
        id: `kakao_${doc.id}`,
        name: doc.place_name,
        category: parsed.category,
        address: doc.road_address_name || doc.address_name,
        phone: doc.phone || '정보 없음',
        lat: validLat,
        lng: validLng,
        url: doc.place_url,
        image: parsed.image,
        rating: (4.5 + (index % 4) * 0.1).toFixed(1),
        reviews: 150 + index * 32,
        price: parsed.price,
        hours: '11:00 - 22:00',
        waitingTime: index % 3 === 0 ? '바로 입장 가능' : `약 ${20 + (index % 3) * 10}분 대기`,
        waitingLevel: index % 3 === 0 ? 'low' : 'med',
        description: `[실시간 핫플] ${doc.road_address_name || doc.address_name}에 위치한 트렌디한 공간입니다.`,
        isIndoor: !doc.category_name.includes('공원')
      };
    });

    const enrichedResults = await Promise.all(
      mappedResults.map(async (spot) => {
        const liveImage = await fetchLivePlacePhoto(spot, spot.image);
        return { ...spot, image: liveImage };
      })
    );

    return enrichedResults;
  } catch {
    return [];
  }
}