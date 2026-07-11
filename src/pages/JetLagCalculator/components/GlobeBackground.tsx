import { useRef } from 'react';
import Globe, { type GlobeMethods } from 'react-globe.gl';
import { useElementSize } from '../../../hooks/useElementSize';
import { useGlobeStore } from '../../../stores/useGlobeStore';

interface GlobePoint {
  lat: number;
  lng: number;
  color: string;
  radius: number;
}

interface GlobeArc {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: string[];
}

interface GlobeBackgroundProps {
  altitude?: number;
  focusLat?: number;
  focusLng?: number;
  autoRotate?: boolean;
  className?: string;
  backgroundColor?: string;
  atmosphereColor?: string;
  atmosphereAltitude?: number;
  overlayColor?: string | null;
  pointsData?: GlobePoint[];
  arcsData?: GlobeArc[];
  onGlobeReady?: (globe: GlobeMethods) => void;
}

export default function GlobeBackground({
  altitude,
  focusLat,
  focusLng,
  autoRotate = true,
  className = 'absolute inset-0 -z-10 overflow-hidden',
  backgroundColor = 'rgba(0,0,0,0)',
  atmosphereColor = '#3a7bd5',
  atmosphereAltitude = 0.22,
  overlayColor = 'rgba(18, 18, 18, 0.50)',
  pointsData,
  arcsData,
  onGlobeReady,
}: GlobeBackgroundProps) {
  const { ref, size } = useElementSize<HTMLDivElement>();
  const globeEl = useRef<GlobeMethods | undefined>(undefined);

  const isReady = useGlobeStore((state) => state.isReady);
  const setReady = useGlobeStore((state) => state.setReady);
  const storeLat = useGlobeStore((state) => state.focusLat);
  const storeLng = useGlobeStore((state) => state.focusLng);
  const storeAltitude = useGlobeStore((state) => state.altitude);

  // prop으로 넘어온 값이 있으면 우선 사용, 없으면 store 기본값 사용
  const finalLat = focusLat ?? storeLat;
  const finalLng = focusLng ?? storeLng;
  const finalAltitude = altitude ?? storeAltitude;

  const handleGlobeReady = () => {
    if (!globeEl.current) return;

    globeEl.current.pointOfView({ lat: finalLat, lng: finalLng, altitude: finalAltitude }, 0);

    const controls = globeEl.current.controls();
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 0.35;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableRotate = false;

    setReady(true);
    onGlobeReady?.(globeEl.current);
  };

  return (
    <div ref={ref} className={className}>
      {size.width > 0 && (
        <>
          <div
            style={{
              opacity: isReady ? 1 : 0,
              transition: 'opacity 0.25s ease',
            }}
          >
            <Globe
              ref={globeEl}
              width={size.width}
              height={size.height}
              backgroundColor={backgroundColor}
              globeImageUrl="https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
              showAtmosphere
              atmosphereColor={atmosphereColor}
              atmosphereAltitude={atmosphereAltitude}
              pointsData={pointsData}
              pointLat="lat"
              pointLng="lng"
              pointColor="color"
              pointRadius="radius"
              pointAltitude={0.03}
              arcsData={arcsData}
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

          {overlayColor && (
            <div className="absolute inset-0" style={{ backgroundColor: overlayColor }} />
          )}
        </>
      )}
    </div>
  );
}
