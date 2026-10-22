import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// 버전별 테마 컬러 및 스타일 클래스 설정
const MAP_THEMES = {
  v1: {
    accentColor: '#4f46e5',
    textColor: '#ffffff',
    tileClass: 'map-tiles-light'
  },
  v2: {
    accentColor: '#a3e635',
    textColor: '#000000',
    tileClass: 'map-tiles-dark'
  },
  v3: {
    accentColor: '#c026d3',
    textColor: '#ffffff',
    tileClass: 'map-tiles-dark'
  },
  v4: {
    accentColor: '#22d3ee',
    textColor: '#000000',
    tileClass: 'map-tiles-cyber'
  },
  v5: {
    accentColor: '#d97706',
    textColor: '#ffffff',
    tileClass: 'map-tiles-sepia'
  },
  v6: {
    accentColor: '#fbbf24',
    textColor: '#000000',
    tileClass: 'map-tiles-retro'
  }
};

// 동적 HTML 숫자가 박힌 커스텀 마커 생성 함수
const createCustomIcon = (number, themeConfig) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background-color: ${themeConfig.accentColor};
        color: ${themeConfig.textColor};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 900;
        font-size: 13px;
        border: 2px solid #000;
        box-shadow: 0 4px 10px rgba(0,0,0,0.5);
      ">
        ${number}
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });
};

export function ThemeMap({ version = 'v2', spots = [] }) {
  const theme = MAP_THEMES[version] || MAP_THEMES.v2;

  // 기본 중심점 (성수동 연무장길 근처)
  const defaultCenter = [37.5445, 127.0560];
  const center = spots.length > 0 ? [spots[0].lat, spots[0].lng] : defaultCenter;

  // 장소들을 순서대로 잇는 위도/경도 배열
  const polylineCoords = spots.map(s => [s.lat, s.lng]);

  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden border border-zinc-800 shadow-xl">
      {/* API 키 없이 100% 무료 OpenStreetMap 타일을 다크/사이버/세피아로 변환하는 CSS */}
      <style>{`
        /* v2, v3: 다크 모드 */
        .map-tiles-dark .leaflet-tile {
          filter: brightness(0.6) invert(1) contrast(3) hue-rotate(200deg) saturate(0.3) !important;
        }
        /* v4: 사이버 모드 */
        .map-tiles-cyber .leaflet-tile {
          filter: brightness(0.7) invert(1) contrast(2) hue-rotate(160deg) saturate(1.5) !important;
        }
        /* v5: 에디토리얼 세피아 */
        .map-tiles-sepia .leaflet-tile {
          filter: sepia(0.5) contrast(1.1) brightness(0.9) !important;
        }
        /* v6: 레트로 */
        .map-tiles-retro .leaflet-tile {
          filter: contrast(1.2) saturate(1.4) !important;
        }
        /* v1: 라이트 모드 (원본 그대로) */
        .map-tiles-light .leaflet-tile {
          filter: none !important;
        }
      `}</style>

      <MapContainer
        center={center}
        zoom={15}
        scrollWheelZoom={true}
        className="w-full h-full z-10"
      >
        {/* API 키가 아예 존재하지 않는 순수 OpenStreetMap 타일만 사용 */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className={theme.tileClass}
        />

        {/* 장소 간 연결선 */}
        {polylineCoords.length > 1 && (
          <Polyline
            positions={polylineCoords}
            color={theme.accentColor}
            weight={4}
            opacity={0.8}
            dashArray="8, 8"
          />
        )}

        {/* 장소 마커 */}
        {spots.map((spot, index) => (
          <Marker
            key={spot.id || index}
            position={[spot.lat, spot.lng]}
            icon={createCustomIcon(index + 1, theme)}
          >
            <Popup className="custom-popup">
              <div className="p-1 font-sans">
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-800 text-amber-300">
                  {spot.category || '핫플'}
                </span>
                <h4 className="font-bold text-sm text-zinc-900 mt-1">{spot.name}</h4>
                <p className="text-xs text-zinc-600 mt-0.5">{spot.address}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}