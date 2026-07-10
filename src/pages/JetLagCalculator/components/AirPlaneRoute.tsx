// components/AirplaneRoute.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import airplaneIcon from '../../../assets/icons/airplane.svg';
import dottedLineIcon from '../../../assets/icons/dotted-line.svg';
import mapLocationIcon from '../../../assets/icons/map-location.svg';

const ROUTE_WIDTH = 220;
const ROUTE_HEIGHT = 33.562;
const ROUTE_PATH_D = 'M0.369873 34.3123C78.8694 -10.1872 145.869 -10.687 220.37 34.3123';
const ANIMATION_DURATION_MS = 2400;

interface AirplaneRouteProps {
  /** 애니메이션 종료 후 이동할 경로 */
  navigateTo: string;
  /** 애니메이션 자동 재생 여부 (기본: true) */
  isAutoPlay?: boolean;
  /** 화면 이동 전에 실행할 부가 로직 (선택) */
  onBeforeNavigate?: () => void;
}

export const AirplaneRoute = ({
  navigateTo,
  isAutoPlay = true,
  onBeforeNavigate,
}: AirplaneRouteProps) => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(isAutoPlay);

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      setIsPlaying(false);
      onBeforeNavigate?.();
      navigate(navigateTo);
    }, ANIMATION_DURATION_MS);

    return () => clearTimeout(timer);
  }, [isPlaying, navigate, navigateTo, onBeforeNavigate]);

  return (
    <div
      className="relative"
      style={{
        width: `${ROUTE_WIDTH}px`,
        height: `${ROUTE_HEIGHT + 12}px`,
        marginTop: '12px',
      }}
    >
      {/* 점선 경로 (배경) */}
      <img
        src={dottedLineIcon}
        alt=""
        className="absolute bottom-0 left-0"
        style={{ width: `${ROUTE_WIDTH}px`, height: `${ROUTE_HEIGHT}px` }}
      />

      {/* 도착 지점 핀 */}
      <img
        src={mapLocationIcon}
        alt="도착 위치"
        className="absolute"
        style={{
          right: '-4px',
          bottom: `${ROUTE_HEIGHT - 12}px`,
          width: '24px',
          height: '24px',
        }}
      />

      {/* 경로를 따라 이동하는 비행기 */}
      <img
        src={airplaneIcon}
        alt="비행기"
        className="absolute top-0 left-0"
        style={{
          width: '24px',
          height: '24px',
          offsetPath: `path('${ROUTE_PATH_D}')`,
          offsetRotate: 'auto',
          offsetDistance: isPlaying ? '100%' : '0%',
          transition: isPlaying ? `offset-distance ${ANIMATION_DURATION_MS}ms ease-in-out` : 'none',
        }}
      />
    </div>
  );
};
