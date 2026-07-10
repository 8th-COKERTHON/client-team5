import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GlobeBackground from './components/GlobeBackground';
import { AirplaneRoute } from './components/AirplaneRoute';
import { useSleepStore } from '../../stores/useSleepStore';
import { fetchJetlagResult } from '../../api/jetlagApi';
import { toApiTimeFormat } from './utils/time';

const GLOBE_ALTITUDE = 1.2;
const GLOBE_FOCUS_LAT = 10;
const GLOBE_FOCUS_LNG = 20;
const MIN_LOADING_MS = 2500; // 애니메이션이 너무 빨리 끝나는 걸 방지

const SleepCountryLoadingScreen = () => {
  console.log('API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);

  const navigate = useNavigate();
  const sleepTime = useSleepStore((state) => state.sleepTime);
  const wakeTime = useSleepStore((state) => state.wakeTime);
  const desiredSleepTime = useSleepStore((state) => state.desiredSleepTime);
  const desiredWakeTime = useSleepStore((state) => state.desiredWakeTime);
  const setJetlagResult = useSleepStore((state) => state.setJetlagResult);

  const [error, setError] = useState<string | null>(null);
  const hasNavigatedRef = useRef(false);

  useEffect(() => {
    const startedAt = Date.now();

    const run = async () => {
      try {
        const result = await fetchJetlagResult({
          currentBedtime: toApiTimeFormat(sleepTime),
          currentWaketime: toApiTimeFormat(wakeTime),
          targetBedtime: toApiTimeFormat(desiredSleepTime),
          targetWaketime: toApiTimeFormat(desiredWakeTime),
        });

        setJetlagResult(result);

        const elapsed = Date.now() - startedAt;
        const remaining = Math.max(MIN_LOADING_MS - elapsed, 0);

        setTimeout(() => {
          if (!hasNavigatedRef.current) {
            hasNavigatedRef.current = true;
            navigate('/jetlag/result', { replace: true });
          }
        }, remaining);
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했어요.');
      }
    };

    run();
  }, [sleepTime, wakeTime, desiredSleepTime, desiredWakeTime, navigate, setJetlagResult]);

  if (error) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-[1rem] bg-white px-[1.5rem]">
        <p className="text-center text-[0.9375rem] text-[#1A1A1A]">{error}</p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-[0.75rem] bg-[#0D2571] px-[1.5rem] py-[0.75rem] text-white"
        >
          다시 시도하기
        </button>
      </div>
    );
  }

  return (
    <div className="relative z-0 flex h-full w-full flex-col justify-end">
      <GlobeBackground
        altitude={GLOBE_ALTITUDE}
        focusLat={GLOBE_FOCUS_LAT}
        focusLng={GLOBE_FOCUS_LNG}
      />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-[1.5rem]">
        {/* navigateTo는 더이상 여기서 이동을 담당하지 않으므로, AirplaneRoute가
           navigateTo prop 없이도 애니메이션만 재생 가능한지 확인이 필요합니다.
           만약 AirplaneRoute 내부에서 반드시 navigateTo가 필요하다면,
           의미 없는 더미 경로를 주고 실제 이동은 위 useEffect가 처리하도록 두면 됩니다. */}
        <AirplaneRoute navigateTo="/jetlag/result" />

        <div className="mt-[2rem] inline-flex flex-col items-start font-['Pretendard']">
          <h1 className="text-center text-[1.5rem] leading-[2.1rem] font-bold text-[color:var(--White,#FFF)]">
            나의 수면 국가를
            <br />
            찾고 있어요
          </h1>
          <p className="mt-[0.75rem] text-center text-[0.8125rem] leading-[1.38125rem] font-medium text-[color:var(--Gray-200,#E6E6E6)]">
            현재 수면과 목표 수면의
            <br />
            시간 차이를 계산하고 있어요
          </p>
        </div>
      </div>
    </div>
  );
};

export default SleepCountryLoadingScreen;
