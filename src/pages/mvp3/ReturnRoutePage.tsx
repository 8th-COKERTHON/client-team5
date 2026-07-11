// MVP3-1 화면
import { lazy, Suspense, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  fetchCompleteCurrentSleep,
  fetchCreateReturnRoute,
  fetchCurrentBoardingPass,
  fetchCurrentReturnRoute,
  type CurrentBoardingPassResponse,
  type ReturnRouteResultResponse,
} from '@/api/returnRoute';
import backIcon from '@/assets/icons/back.svg';
import closeIcon from '@/assets/icons/close.svg';
import questionMarkIcon from '@/assets/icons/questionmark.svg';
import BoardingCompletePage from './components/BoardingCompletePage';
import FlightGuidePage from './components/FlightGuidePage';
import MobileStatusBar from './components/MobileStatusBar';
import RouteCard from './components/RouteCard';
import ReturnRouteOverview from './components/ReturnRouteOverview';
import ReturnTicketPage from './components/ReturnTicketPage';
import { MOCK_RETURN_ROUTE } from './mocks/returnRoute';
import { mapCurrentRoute } from './returnRouteAdapter';

const SleepGlobeTransition = lazy(() => import('./components/SleepGlobeTransition'));

const ReturnRoutePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isHelpOpen, setHelpOpen] = useState(false);
  const [routeResponse, setRouteResponse] = useState<ReturnRouteResultResponse>();
  const [boardingPass, setBoardingPass] = useState<CurrentBoardingPassResponse>();
  const [isSubmitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [currentStep, setCurrentStep] = useState<
    'setup' | 'overview' | 'ticket' | 'guide' | 'boarding' | 'sleep-transition'
  >('setup');

  const route = routeResponse ? mapCurrentRoute(routeResponse) : MOCK_RETURN_ROUTE;

  useEffect(() => {
    let isMounted = true;

    const loadCurrentRoute = async () => {
      try {
        const currentRoute = await fetchCurrentReturnRoute();
        if (isMounted) setRouteResponse(currentRoute);
      } catch {
        // 아직 생성된 귀국 루트가 없으면 최초 생성 화면을 그대로 보여줍니다.
      }
    };

    void loadCurrentRoute();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleHelpClick = () => setHelpOpen((isOpen) => !isOpen);
  const handleCreateClick = async () => {
    setApiError('');

    if (routeResponse) {
      setCurrentStep('overview');
      return;
    }

    const storedResultId =
      searchParams.get('resultId') ??
      sessionStorage.getItem('resultId') ??
      localStorage.getItem('resultId');
    const resultId = Number(storedResultId);

    if (!Number.isInteger(resultId) || resultId <= 0) {
      setApiError('수면 시차 계산 결과가 없습니다. 계산 완료 후 다시 시도해주세요.');
      return;
    }

    setSubmitting(true);
    try {
      const createdRoute = await fetchCreateReturnRoute(resultId);
      setRouteResponse(createdRoute);
      setCurrentStep('overview');
    } catch (error) {
      setApiError(error instanceof Error ? error.message : '귀국 루트를 생성하지 못했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmRoute = async () => {
    setApiError('');
    setSubmitting(true);
    try {
      const currentBoardingPass = await fetchCurrentBoardingPass();
      setBoardingPass(currentBoardingPass);
      setCurrentStep('ticket');
    } catch (error) {
      setApiError(error instanceof Error ? error.message : '귀국 항공권을 불러오지 못했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSleep = async () => {
    setApiError('');
    setSubmitting(true);
    try {
      await fetchCompleteCurrentSleep();
      setCurrentStep('sleep-transition');
    } catch (error) {
      setApiError(
        error instanceof Error ? error.message : '다음 경유지 도착을 처리하지 못했습니다.',
      );
    } finally {
      setSubmitting(false);
    }
  };
  const handleClose = () => navigate('/');

  if (currentStep === 'overview') {
    return (
      <ReturnRouteOverview
        onBack={() => setCurrentStep('setup')}
        onConfirm={handleConfirmRoute}
        route={routeResponse}
        isLoading={isSubmitting}
      />
    );
  }

  if (currentStep === 'ticket') {
    return (
      <ReturnTicketPage
        onBack={() => setCurrentStep('overview')}
        onClose={handleClose}
        onPrepare={() => setCurrentStep('guide')}
        boardingPass={boardingPass}
      />
    );
  }

  if (currentStep === 'guide') {
    return (
      <FlightGuidePage
        onBack={() => setCurrentStep('ticket')}
        onClose={handleClose}
        onStart={() => setCurrentStep('boarding')}
        boardingPass={boardingPass}
      />
    );
  }

  if (currentStep === 'boarding') {
    return (
      <BoardingCompletePage
        onBack={() => setCurrentStep('guide')}
        onClose={handleClose}
        onSleep={handleSleep}
        boardingPass={boardingPass}
        isLoading={isSubmitting}
      />
    );
  }

  if (currentStep === 'sleep-transition') {
    return (
      <Suspense fallback={<main className="h-full w-full bg-[#071846]" />}>
        <SleepGlobeTransition
          onComplete={handleClose}
          departureCity={boardingPass?.departureCity}
          arrivalCity={boardingPass?.arrivalCity}
        />
      </Suspense>
    );
  }

  return (
    <main className="h-full w-full overflow-hidden bg-white text-[#101522]">
      <div className="mvp3-screen relative">
        <MobileStatusBar />
        <header className="mvp3-navbar">
          <button
            type="button"
            aria-label="이전 화면"
            onClick={() => navigate('/')}
            className="flex h-11 w-11 items-center justify-center rounded-full text-[#102149] transition hover:bg-[#f2f5fb]"
          >
            <img src={backIcon} alt="" className="h-5 w-5" />
          </button>
          <h1 className="text-center text-[16px] leading-[27px] font-medium text-[#0D2571]">
            서울행 귀국편
          </h1>
          <span aria-hidden="true" className="h-11 w-11" />
        </header>

        <section className="relative mt-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[20px] leading-[27px] font-semibold text-[#121212]">
                지금 나는
                <br />
                <span className="font-semibold text-[#3A55A9]">{route.currentCity.cityNameKo}</span>
                에 있어요.
              </p>
              <p className="mt-3 text-[13px] leading-5 tracking-[0.26px] text-[#707070]">
                현재 수면 리듬을 조정해 서울로 돌아가볼까요?
              </p>
            </div>
            <button
              type="button"
              aria-expanded={isHelpOpen}
              aria-label="귀국편 도움말"
              onClick={handleHelpClick}
              className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#3159b6] transition hover:bg-[#edf2ff]"
            >
              <img src={questionMarkIcon} alt="" className="h-[1.625rem] w-[1.625rem]" />
            </button>
          </div>

          {isHelpOpen && (
            <aside
              role="dialog"
              aria-label="귀국편 안내"
              className="absolute top-[3.7rem] right-0 z-10 h-[11.25rem] w-[min(18.5625rem,calc(100vw-2.5rem))] rounded-[0.9375rem] bg-[#E0EAFF] px-5 pt-9 text-center shadow-[0_0.25rem_1.25rem_rgba(18,18,18,0.1)] before:absolute before:-top-3 before:right-3 before:border-x-[0.75rem] before:border-b-[0.9rem] before:border-x-transparent before:border-b-[#E0EAFF]"
            >
              <button
                type="button"
                aria-label="도움말 닫기"
                onClick={handleHelpClick}
                className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center"
              >
                <img src={closeIcon} alt="" className="h-3 w-3" />
              </button>
              <h2 className="text-sm leading-[21px] font-semibold text-[#121212]">
                서울까지 어떻게 돌아오나요?
              </h2>
              <p className="mt-1 text-xs leading-[18px] text-[#707070]">
                매일 잠드는 시간과 일어나는 시간을
                <br />약 30분씩 당기며 서울 시간에 가까워져요.
              </p>
              <div className="mt-4 grid grid-cols-2 justify-center gap-3 px-[0.325rem]">
                <div className="flex h-12 items-center justify-center rounded-lg border border-[#E5E5E5] bg-white px-2">
                  <div>
                    <p className="text-[7.5px] leading-[11.25px] tracking-[0.75px] text-[#B7B7B7]">
                      DURATION
                    </p>
                    <strong className="mt-0.5 block text-[15px] leading-[22.5px] font-semibold text-[#3A55A9]">
                      약 {route.durationDays}일
                    </strong>
                  </div>
                </div>
                <div className="flex h-12 items-center justify-center rounded-lg border border-[#E5E5E5] bg-white px-2">
                  <div>
                    <p className="text-[7.5px] leading-[11.25px] tracking-[0.75px] text-[#B7B7B7]">
                      DAILY ADJUST
                    </p>
                    <strong className="mt-0.5 block text-[15px] leading-[22.5px] font-semibold text-[#3A55A9]">
                      약 {route.dailyAdjustMinutes}분
                    </strong>
                  </div>
                </div>
              </div>
            </aside>
          )}
        </section>

        <div className="mt-8">
          <RouteCard route={route} />
        </div>

        {apiError && <p className="mt-3 text-center text-xs text-[#DD3232]">{apiError}</p>}

        <div className="mt-auto shrink-0 pt-10">
          <button
            type="button"
            onClick={handleCreateClick}
            disabled={isSubmitting}
            className="h-[52px] w-full rounded-[8px] bg-[#0D2571] px-5 text-[15px] leading-[22.5px] font-medium text-white shadow-[0_4px_20px_rgba(18,18,18,0.05)] transition hover:bg-[#102b77]"
          >
            {isSubmitting ? '귀국 루트 생성 중' : '서울행 귀국편 만들기'}
          </button>
        </div>
      </div>
    </main>
  );
};

export default ReturnRoutePage;
