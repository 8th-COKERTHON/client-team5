import { useRef } from 'react';
import Globe, { type GlobeMethods } from 'react-globe.gl';
import { useElementSize } from '../../hooks/useElementSize';
import { useGlobeStore } from '../../stores/useGlobeStore';

interface GlobeBackgroundProps {
  altitude?: number;
  focusLat?: number;
  focusLng?: number;
}

export default function GlobeBackground({ altitude, focusLat, focusLng }: GlobeBackgroundProps) {
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
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.35;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableRotate = false;

    setReady(true);
  };

  return (
    <div ref={ref} className="absolute inset-0 -z-10 overflow-hidden">
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
              backgroundColor="rgba(0,0,0,0)"
              globeImageUrl="https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
              showAtmosphere
              atmosphereColor="#3a7bd5"
              atmosphereAltitude={0.22}
              animateIn={false}
              onGlobeReady={handleGlobeReady}
            />
          </div>

          <div className="absolute inset-0" style={{ backgroundColor: 'rgba(18, 18, 18, 0.30)' }} />
        </>
      )}
    </div>
  );
}
