import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GlobeBackground from './components/GlobeBackground';
import { AirplaneRoute } from './components/AirplaneRoute';
import { useSleepStore } from '../../stores/useSleepStore';
import { fetchJetlagResult } from '../../api/jetlagApi';
import { toApiTimeFormat } from './utils/time';
import { ApiError } from '@/api/client';

const GLOBE_ALTITUDE = 1.2;
const GLOBE_FOCUS_LAT = 10;
const GLOBE_FOCUS_LNG = 20;
const MIN_LOADING_MS = 3000; // 최소 3초는 로딩 화면 유지

type LoadingOutcome = 'success' | 'error' | 'guestExhausted';

const SleepCountryLoadingScreen = () => {
  const navigate = useNavigate();
  const sleepTime = useSleepStore((state) => state.sleepTime);
  const wakeTime = useSleepStore((state) => state.wakeTime);
  const desiredSleepTime = useSleepStore((state) => state.desiredSleepTime);
  const desiredWakeTime = useSleepStore((state) => state.desiredWakeTime);
  const setJetlagResult = useSleepStore((state) => state.setJetlagResult);

  const [error, setError] = useState<string | null>(null);
  const [isGuestTrialExhausted, setIsGuestTrialExhausted] = useState(false);
  const pendingOutcomeRef = useRef<LoadingOutcome | null>(null);

  useEffect(() => {
    const startedAt = Date.now();

    const applyOutcome = () => {
      const outcome = pendingOutcomeRef.current;

      if (outcome === 'success') {
        navigate('/jetlag/result', { replace: true });
        return;
      }

      if (outcome === 'guestExhausted') {
        setIsGuestTrialExhausted(true);
        return;
      }

      setError('결과를 불러오지 못했어요. 다시 시도해주세요.');
    };

    const finishLoading = () => {
      const elapsed = Date.now() - startedAt;
      const remaining = Math.max(MIN_LOADING_MS - elapsed, 0);

      setTimeout(applyOutcome, remaining);
    };

    fetchJetlagResult({
      currentBedtime: toApiTimeFormat(sleepTime),
      currentWaketime: toApiTimeFormat(wakeTime),
      targetBedtime: toApiTimeFormat(desiredSleepTime),
      targetWaketime: toApiTimeFormat(desiredWakeTime),
    })
      .then((result) => {
        setJetlagResult(result);
        pendingOutcomeRef.current = 'success';
      })
      .catch((err) => {
        if (err instanceof ApiError && err.code === 'GUEST_TRIAL_EXHAUSTED') {
          pendingOutcomeRef.current = 'guestExhausted';
          return;
        }
        pendingOutcomeRef.current = 'error';
      })
      .finally(() => {
        finishLoading();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isGuestTrialExhausted) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-[1rem] bg-white px-[1.5rem]">
        <p className="text-center text-[0.9375rem] text-[#1A1A1A]">
          무료 체험은 1회만 가능해요.
          <br />
          회원가입하고 계속 이용해보세요.
        </p>
        <button
          type="button"
          onClick={() => navigate('/signup')}
          className="rounded-[0.75rem] bg-[#0D2571] px-[1.5rem] py-[0.75rem] text-white"
        >
          회원가입하기
        </button>
      </div>
    );
  }

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
      {/* 배경 지구본 */}
      <GlobeBackground
        altitude={GLOBE_ALTITUDE}
        focusLat={GLOBE_FOCUS_LAT}
        focusLng={GLOBE_FOCUS_LNG}
      />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-[1.5rem]">
        {/* 비행기 애니메이션 (로딩이 길어져도 자연스럽도록 반복 재생) */}
        <AirplaneRoute />

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
