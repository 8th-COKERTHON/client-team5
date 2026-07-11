import { Component, type ReactNode, useEffect, useRef, useState } from 'react';
import Globe, { type GlobeMethods } from 'react-globe.gl';
import type { ReturnRouteCityResponse } from '@/api/returnRoute';

interface SleepGlobeTransitionProps {
  onComplete: () => void;
  departureCity?: ReturnRouteCityResponse;
  arrivalCity?: ReturnRouteCityResponse;
}

const NEW_DELHI = { lat: 28.6139, lng: 77.209 };
const DHAKA = { lat: 23.8103, lng: 90.4125 };
const TRANSITION_DURATION = 15000;

let cachedWebglSupport: boolean | null = null;

// 하드웨어 가속이 꺼져있거나 샌드박스 정책으로 WebGL이 막힌 환경이 실제로 있어서,
// three-globe가 던지는 에러로 화면이 죽기 전에 미리 감지해 건너뛴다.
const isWebglAvailable = () => {
  if (cachedWebglSupport !== null) return cachedWebglSupport;

  try {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
    cachedWebglSupport = Boolean(context);
  } catch {
    cachedWebglSupport = false;
  }

  return cachedWebglSupport;
};

class GlobeErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

const useGlobeContainerSize = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // 마운트 직후 크기를 한 번 동기적으로 반영해, StrictMode의
    // mount→cleanup→mount 사이에 ResizeObserver 최초 콜백이 유실되는 것을 방지한다.
    const rect = el.getBoundingClientRect();
    setSize({ width: rect.width, height: rect.height });

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, size };
};

const SleepGlobeTransition = ({
  onComplete,
  departureCity,
  arrivalCity,
}: SleepGlobeTransitionProps) => {
  const { ref: containerRef, size } = useGlobeContainerSize();
  const globeEl = useRef<GlobeMethods | undefined>(undefined);
  const motionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isGlobeReady, setGlobeReady] = useState(false);

  const departurePoint = departureCity
    ? { lat: departureCity.latitude, lng: departureCity.longitude }
    : NEW_DELHI;
  const arrivalPoint = arrivalCity
    ? { lat: arrivalCity.latitude, lng: arrivalCity.longitude }
    : DHAKA;
  const cityPoints = [
    { ...departurePoint, color: '#CBDAF8', radius: 0.28 },
    { ...arrivalPoint, color: '#FFFFFF', radius: 0.34 },
  ];
  const routeArcs = [
    {
      startLat: departurePoint.lat,
      startLng: departurePoint.lng,
      endLat: arrivalPoint.lat,
      endLng: arrivalPoint.lng,
      color: ['#CBDAF8', '#FFFFFF'],
    },
  ];

  useEffect(() => {
    const completeTimer = window.setTimeout(onComplete, TRANSITION_DURATION);

    return () => {
      window.clearTimeout(completeTimer);
      if (motionTimerRef.current) clearTimeout(motionTimerRef.current);
    };
  }, [onComplete]);

  const handleGlobeReady = () => {
    if (!globeEl.current) return;

    // 출발지와 도착지가 둘 다 보이도록 멀리서 시작한 뒤, 도착지 쪽으로 확실히 줌인한다.
    globeEl.current.pointOfView({ ...departurePoint, altitude: 2.2 }, 0);

    const controls = globeEl.current.controls();
    controls.autoRotate = false;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableRotate = false;

    setGlobeReady(true);

    motionTimerRef.current = setTimeout(() => {
      globeEl.current?.pointOfView({ ...arrivalPoint, altitude: 0.9 }, 2500);
    }, 400);
  };

  const canRenderGlobe = size.width > 0 && isWebglAvailable();
  const fallback = <div className="absolute inset-0 bg-[#071846]" />;

  return (
    <main className="relative z-0 h-full w-full overflow-hidden bg-[#071846] text-white">
      <div ref={containerRef} className="absolute inset-0 -z-10 overflow-hidden">
        {canRenderGlobe ? (
          <GlobeErrorBoundary fallback={fallback}>
            <div style={{ opacity: isGlobeReady ? 1 : 0, transition: 'opacity 0.25s ease' }}>
              <Globe
                ref={globeEl}
                width={size.width}
                height={size.height}
                backgroundColor="#071846"
                globeImageUrl="https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                showAtmosphere
                atmosphereColor="#99B6EF"
                atmosphereAltitude={0.2}
                pointsData={cityPoints}
                pointLat="lat"
                pointLng="lng"
                pointColor="color"
                pointRadius="radius"
                pointAltitude={0.03}
                arcsData={routeArcs}
                arcColor="color"
                arcStroke={0.7}
                arcAltitude={0.14}
                arcDashLength={0.35}
                arcDashGap={0.12}
                arcDashAnimateTime={900}
                animateIn={false}
                onGlobeReady={handleGlobeReady}
              />
            </div>
          </GlobeErrorBoundary>
        ) : (
          fallback
        )}
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(7,24,70,0.15),rgba(7,24,70,0.62))]" />
      <section className="pointer-events-none absolute inset-x-0 bottom-[72px] z-10 text-center">
        <p className="text-[13px] leading-5 text-[#CBDAF8]">
          {departureCity?.cityNameEn ?? 'NEW DELHI'} → {arrivalCity?.cityNameEn ?? 'DHAKA'}
        </p>
        <h1 className="mt-2 text-[20px] leading-7 font-semibold">
          {arrivalCity?.cityNameKr ?? '다카'} 시간에 맞춰 이동하고 있어요
        </h1>
      </section>
    </main>
  );
};

export default SleepGlobeTransition;
