// components/AirplaneRoute.tsx
import { useEffect, useRef, useState } from 'react';
import { animate, useMotionValue } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import airplaneIcon from '../../../assets/icons/airplane.svg';
import mapLocationIcon from '../../../assets/icons/map-location.svg';

const ROUTE_WIDTH = 220;
const ROUTE_HEIGHT = 30;
const ROUTE_PATH_D = 'M0.369873 34.3123C78.8694 -10.1872 145.869 -10.687 220.37 34.3123';
const ANIMATION_DURATION_SECOND = 2.4;
const ANIMATION_DURATION_MS = ANIMATION_DURATION_SECOND * 1000;
const ROTATION_SAMPLE_DISTANCE = 1;

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
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);
  const progress = useMotionValue(0);
  const [airplaneTransform, setAirplaneTransform] = useState('translate(0px, 0px) rotate(0deg)');

  // path의 전체 길이를 측정
  useEffect(() => {
    if (!pathRef.current) return;
    setPathLength(pathRef.current.getTotalLength());
  }, []);

  // progress(0~1) motion value가 바뀔 때마다 비행기 위치와 각도를 path 위에서 직접 계산
  useEffect(() => {
    const updateAirplanePosition = (value: number) => {
      if (!pathRef.current || pathLength === 0) return;

      const currentDistance = value * pathLength;
      const nextDistance = Math.min(currentDistance + ROTATION_SAMPLE_DISTANCE, pathLength);

      const currentPoint = pathRef.current.getPointAtLength(currentDistance);
      const nextPoint = pathRef.current.getPointAtLength(nextDistance);

      const angleRadian = Math.atan2(nextPoint.y - currentPoint.y, nextPoint.x - currentPoint.x);
      const angleDegree = (angleRadian * 180) / Math.PI;

      setAirplaneTransform(
        `translate(${currentPoint.x - 12}px, ${currentPoint.y - 12}px) rotate(${angleDegree}deg)`,
      );
    };

    const unsubscribe = progress.on('change', updateAirplanePosition);
    return () => unsubscribe();
  }, [progress, pathLength]);

  // Framer Motion으로 progress를 0 → 1까지 애니메이션
  useEffect(() => {
    if (!isAutoPlay || pathLength === 0) return;

    const controls = animate(progress, 1, {
      duration: ANIMATION_DURATION_SECOND,
      ease: 'easeInOut',
    });

    return () => controls.stop();
  }, [isAutoPlay, pathLength, progress]);

  // 애니메이션 종료 후 화면 이동
  useEffect(() => {
    if (!isAutoPlay) return;

    const timer = setTimeout(() => {
      onBeforeNavigate?.();
      navigate(navigateTo);
    }, ANIMATION_DURATION_MS);

    return () => clearTimeout(timer);
  }, [isAutoPlay, navigate, navigateTo, onBeforeNavigate]);

  return (
    <div
      className="relative"
      style={{
        width: `${ROUTE_WIDTH}px`,
        height: `${ROUTE_HEIGHT + 12}px`,
        marginTop: '12px',
      }}
    >
      {/* 점선 경로 (실제 path를 렌더링해서 좌표 계산에 사용) */}
      <svg
        width={ROUTE_WIDTH}
        height={ROUTE_HEIGHT}
        viewBox={`0 0 ${ROUTE_WIDTH} ${ROUTE_HEIGHT}`}
        className="absolute bottom-0 left-0"
      >
        <path
          ref={pathRef}
          d={ROUTE_PATH_D}
          stroke="#6483D3"
          strokeWidth={1.5}
          strokeDasharray="3 3"
          fill="none"
        />
      </svg>

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
        style={{ width: '24px', height: '24px', transform: airplaneTransform }}
      />
    </div>
  );
};
