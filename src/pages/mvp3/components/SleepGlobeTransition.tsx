import { useEffect, useRef } from 'react';
import type { GlobeMethods } from 'react-globe.gl';
import type { ReturnRouteCityResponse } from '@/api/returnRoute';
import GlobeBackground from '@/pages/JetLagCalculator/components/GlobeBackground';

interface SleepGlobeTransitionProps {
  onComplete: () => void;
  departureCity?: ReturnRouteCityResponse;
  arrivalCity?: ReturnRouteCityResponse;
}

const NEW_DELHI = { lat: 28.6139, lng: 77.209 };
const DHAKA = { lat: 23.8103, lng: 90.4125 };
const TRANSITION_DURATION = 15000;

const SleepGlobeTransition = ({
  onComplete,
  departureCity,
  arrivalCity,
}: SleepGlobeTransitionProps) => {
  const motionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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

  const handleGlobeReady = (globe: GlobeMethods) => {
    motionTimerRef.current = setTimeout(() => {
      globe.pointOfView({ ...arrivalPoint, altitude: 1.45 }, 2000);
    }, 250);
  };

  return (
    <main className="relative h-full w-full overflow-hidden bg-[#071846] text-white">
      <GlobeBackground
        focusLat={departurePoint.lat}
        focusLng={departurePoint.lng}
        altitude={1.75}
        autoRotate={false}
        backgroundColor="#071846"
        atmosphereColor="#99B6EF"
        atmosphereAltitude={0.2}
        overlayColor={null}
        pointsData={cityPoints}
        arcsData={routeArcs}
        onGlobeReady={handleGlobeReady}
      />

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
