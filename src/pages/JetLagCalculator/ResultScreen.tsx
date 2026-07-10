// pages/JetLagCalculator/ResultScreen.tsx
import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSleepStore } from '../../stores/useSleepStore';
import arrowLeftIcon from '../../assets/icons/arrow-left.svg';
import ticketBackgroundImage from '../../assets/images/ticket-background.svg';

const BARCODE_WIDTH = 267.64;
const BARCODE_HEIGHT = 66.91;
const BARCODE_BOTTOM_OFFSET = 13;

const BARCODE_BAR_WIDTH_RATIOS = [
  2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 1, 2, 4, 1, 3, 2, 1, 2, 1, 4, 2, 1, 3, 1, 2,
];

const WEEKDAY_LABELS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const getCurrentDateLabel = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const weekday = WEEKDAY_LABELS[today.getDay()];
  return `${year}.${month}.${day} · ${weekday}`;
};

const ResultScreen = () => {
  const navigate = useNavigate();

  const result = useSleepStore((state) => state.jetlagResult);
  const errorMessage = useSleepStore((state) => state.jetlagError);

  const currentSleepTime = useSleepStore((state) => state.sleepTime);
  const currentWakeTime = useSleepStore((state) => state.wakeTime);
  const targetSleepTime = useSleepStore((state) => state.desiredSleepTime);
  const targetWakeTime = useSleepStore((state) => state.desiredWakeTime);

  // 결과도 에러도 없이 이 화면에 직접 진입한 경우(새로고침 등)만 온보딩으로 되돌림
  useEffect(() => {
    if (!result && !errorMessage) {
      navigate('/jetlag/onboarding', { replace: true });
    }
  }, [result, errorMessage, navigate]);

  const dateLabel = useMemo(() => getCurrentDateLabel(), []);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleCloseClick = () => {
    localStorage.removeItem('deviceId');
    navigate('/');
  };

  const handleShareClick = () => {
    // TODO: 결과 공유 로직 (예: Web Share API, 이미지 캡처 등)
  };

  const handleRetryClick = () => {
    navigate('/jetlag/current-sleep-time');
  };

  if (!result && !errorMessage) return null;

  // 공통 헤더 (에러/정상 상태 모두 동일)
  const header = (
    <div className="flex h-[2.75rem] w-full flex-shrink-0 items-center justify-between">
      <button
        type="button"
        onClick={handleBackClick}
        aria-label="뒤로가기"
        className="flex h-[2.25rem] w-[2.25rem] items-center justify-center"
      >
        <img src={arrowLeftIcon} alt="" width={20} height={20} />
      </button>

      <span className="text-[1rem] leading-[1.5rem] font-bold text-[#1A1A1A]">오늘의 항공권</span>

      <button
        type="button"
        onClick={handleCloseClick}
        aria-label="닫기"
        className="flex h-[2.25rem] w-[2.25rem] items-center justify-center"
      >
        <CloseIcon />
      </button>
    </div>
  );

  // 공통 하단 버튼 (에러/정상 상태 모두 동일)
  const bottomButtons = (
    <div className="mt-[1.5rem] flex w-full gap-[0.75rem]">
      <button
        type="button"
        onClick={handleShareClick}
        className="flex flex-1 items-center justify-center gap-[0.5rem] rounded-[0.75rem] bg-[#0D2571] py-[0.875rem] text-[0.9375rem] font-semibold text-white"
      >
        <ShareIcon />
        결과 공유하기
      </button>
      <button
        type="button"
        onClick={handleRetryClick}
        className="flex flex-1 items-center justify-center gap-[0.5rem] rounded-[0.75rem] border border-[#E6E6E6] bg-white py-[0.875rem] text-[0.9375rem] font-semibold text-[#1A1A1A]"
      >
        <RefreshIcon />
        다시 측정하기
      </button>
    </div>
  );

  // API 에러 상태: 보딩패스 카드 없이 안내 문구만 노출
  if (errorMessage) {
    return (
      <div className="flex h-full w-full flex-col items-center overflow-y-auto bg-[#fff] px-[1.5rem] pt-[1rem] pb-[calc(env(safe-area-inset-bottom)+1.5rem)] font-['Pretendard']">
        {header}

        <div className="mt-[1rem] w-full">
          <p className="text-[0.8125rem] leading-[1.25rem] text-[#707070]">현재 수면 리듬은</p>
          <p className="mt-[0.25rem] text-[1.25rem] leading-[1.75rem] font-bold text-[#1A1A1A]">
            {errorMessage}
          </p>
        </div>

        <div className="flex-1" />

        {bottomButtons}
      </div>
    );
  }

  // 정상 결과 상태 (여기서부터는 result가 확실히 존재)
  const timeDifferenceHourLabel = Math.floor(result!.jetlagMinutes / 60);
  const timeDifferenceMinuteLabel = result!.jetlagMinutes % 60;
  const isSlowerThanSeoul = result!.direction === 'WEST';

  return (
    <div className="flex h-full w-full flex-col items-center overflow-y-auto bg-[#fff] px-[1.5rem] pt-[1rem] pb-[calc(env(safe-area-inset-bottom)+1.5rem)] font-['Pretendard']">
      {header}

      {/* 상단 설명 텍스트 */}
      <div className="mt-[1rem] w-full">
        <p className="text-[0.8125rem] leading-[1.25rem] text-[#707070]">현재 수면 리듬은</p>
        <p className="mt-[0.25rem] text-[1.25rem] leading-[1.75rem] font-bold text-[#1A1A1A]">
          서울보다{' '}
          <span className="text-[#0D2571]">
            {timeDifferenceHourLabel}시간 {timeDifferenceMinuteLabel}분
          </span>{' '}
          {isSlowerThanSeoul ? '느려요.' : '빨라요.'}
        </p>
      </div>

      {/* 보딩패스 카드 */}
      <div
        className="relative mx-auto w-full"
        style={{
          maxWidth: '346px',
          aspectRatio: '346 / 583',
        }}
      >
        <img
          src={ticketBackgroundImage}
          alt=""
          className="absolute inset-0 h-full w-full"
          style={{ objectFit: 'fill' }}
        />

        <div className="relative z-10 flex h-full flex-col px-[2rem] pt-[1.75rem]">
          <div className="flex items-center justify-between">
            <span
              style={{
                color: '#8A97B0',
                fontFamily: 'Pretendard',
                fontSize: '15px',
                fontStyle: 'normal',
                fontWeight: 400,
                lineHeight: '12px',
                letterSpacing: '1.2px',
              }}
            >
              DATE
            </span>
          </div>

          <span
            className="mt-[0.5rem]"
            style={{
              color: '#0F1C3F',
              fontFamily: "'Space Mono'",
              fontSize: '15px',
              fontStyle: 'normal',
              fontWeight: 700,
              lineHeight: '13.5px',
            }}
          >
            {dateLabel}
          </span>

          <p
            className="mt-[1.25rem]"
            style={{
              color: '#0F1C3F',
              fontFamily: 'Oswald',
              fontSize: '70px',
              fontStyle: 'normal',
              fontWeight: 700,
              lineHeight: '76px',
              letterSpacing: '0.9px',
            }}
          >
            {result!.to.cityNameEn}
          </p>

          <p
            className="mt-[0.5rem]"
            style={{
              color: '#5A6A8A',
              fontFamily: 'Pretendard',
              fontSize: '15px',
              fontStyle: 'normal',
              fontWeight: 400,
              lineHeight: '18px',
            }}
          >
            {result!.to.cityNameKr}
          </p>

          <span
            className="mt-[1rem] inline-flex w-fit items-center justify-center"
            style={{
              padding: '4.442px 8.884px',
              borderRadius: '5.923px',
              background: '#0F1C3F',
            }}
          >
            <span
              style={{
                color: '#FFF',
                fontFamily: 'Oswald',
                fontSize: '16.287px',
                fontStyle: 'normal',
                fontWeight: 700,
                lineHeight: '24.431px',
                letterSpacing: '0.977px',
              }}
            >
              {result!.to.airportCode}
            </span>
          </span>

          <div className="mt-[1.5rem] flex gap-[0.5rem]">
            <span
              className="flex-1 rounded-[0.5rem] bg-[#F3F3F3] py-[0.375rem] text-center uppercase"
              style={{
                color: 'var(--Gray-400, #707070)',
                fontFamily: 'Pretendard',
                fontSize: '10px',
                fontStyle: 'normal',
                fontWeight: 500,
                lineHeight: '10.5px',
                letterSpacing: '0.7px',
              }}
            >
              Current Sleep
            </span>
            <span
              className="flex-1 rounded-[0.5rem] bg-[#E8EBFA] py-[0.375rem] text-center uppercase"
              style={{
                color: 'var(--Gray-400, #707070)',
                fontFamily: 'Pretendard',
                fontSize: '10px',
                fontStyle: 'normal',
                fontWeight: 500,
                lineHeight: '10.5px',
                letterSpacing: '0.7px',
              }}
            >
              Target Sleep
            </span>
          </div>

          <div className="mt-[0.75rem] flex gap-[0.5rem]">
            <div className="flex flex-1 flex-col gap-[0.75rem]">
              <div>
                <p
                  style={{
                    color: 'var(--Gray-400, #707070)',
                    fontFamily: 'Pretendard',
                    fontSize: '10px',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    lineHeight: '10.5px',
                  }}
                >
                  잠들기
                </p>
                <p
                  className="mt-[0.25rem]"
                  style={{
                    color: 'var(--Black, #121212)',
                    fontFamily: "'Space Mono'",
                    fontSize: '20px',
                    fontStyle: 'normal',
                    fontWeight: 700,
                    lineHeight: '21px',
                  }}
                >
                  {currentSleepTime}
                </p>
              </div>
              <div>
                <p
                  style={{
                    color: 'var(--Gray-400, #707070)',
                    fontFamily: 'Pretendard',
                    fontSize: '10px',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    lineHeight: '10.5px',
                  }}
                >
                  기상
                </p>
                <p
                  className="mt-[0.25rem]"
                  style={{
                    color: 'var(--Black, #121212)',
                    fontFamily: "'Space Mono'",
                    fontSize: '20px',
                    fontStyle: 'normal',
                    fontWeight: 700,
                    lineHeight: '21px',
                  }}
                >
                  {currentWakeTime}
                </p>
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-[0.75rem]">
              <div>
                <p
                  style={{
                    color: 'var(--Gray-400, #707070)',
                    fontFamily: 'Pretendard',
                    fontSize: '10px',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    lineHeight: '10.5px',
                  }}
                >
                  잠들기
                </p>
                <p
                  className="mt-[0.25rem]"
                  style={{
                    color: 'var(--Black, #121212)',
                    fontFamily: "'Space Mono'",
                    fontSize: '20px',
                    fontStyle: 'normal',
                    fontWeight: 700,
                    lineHeight: '21px',
                  }}
                >
                  {targetSleepTime}
                </p>
              </div>
              <div>
                <p
                  style={{
                    color: 'var(--Gray-400, #707070)',
                    fontFamily: 'Pretendard',
                    fontSize: '10px',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    lineHeight: '10.5px',
                  }}
                >
                  기상
                </p>
                <p
                  className="mt-[0.25rem]"
                  style={{
                    color: 'var(--Black, #121212)',
                    fontFamily: "'Space Mono'",
                    fontSize: '20px',
                    fontStyle: 'normal',
                    fontWeight: 700,
                    lineHeight: '21px',
                  }}
                >
                  {targetWakeTime}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          className="absolute left-1/2 flex items-center justify-center gap-[0.125rem] overflow-hidden"
          style={{
            bottom: `${BARCODE_BOTTOM_OFFSET}px`,
            width: `${BARCODE_WIDTH}px`,
            height: `${BARCODE_HEIGHT}px`,
            transform: 'translateX(-50%)',
          }}
        >
          {BARCODE_BAR_WIDTH_RATIOS.map((ratio, barIndex) => (
            <span
              key={barIndex}
              className="h-full bg-[#0D2571]"
              style={{
                width: `${(ratio / BARCODE_BAR_WIDTH_RATIOS.reduce((a, b) => a + b, 0)) * BARCODE_WIDTH}px`,
              }}
            />
          ))}
        </div>
      </div>

      {bottomButtons}
    </div>
  );
};

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M15 5L5 15M5 5L15 15" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const ShareIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path
      d="M13.5 6.75C14.7426 6.75 15.75 5.74264 15.75 4.5C15.75 3.25736 14.7426 2.25 13.5 2.25C12.2574 2.25 11.25 3.25736 11.25 4.5C11.25 4.62311 11.2598 4.74396 11.2787 4.86193L6.6963 7.35839C6.27834 6.96509 5.71766 6.75 5.14286 6.75C3.90022 6.75 2.89286 7.75736 2.89286 9C2.89286 10.2426 3.90022 11.25 5.14286 11.25C5.71766 11.25 6.27834 11.0349 6.6963 10.6416L11.2787 13.1381C11.2598 13.256 11.25 13.3769 11.25 13.5C11.25 14.7426 12.2574 15.75 13.5 15.75C14.7426 15.75 15.75 14.7426 15.75 13.5C15.75 12.2574 14.7426 11.25 13.5 11.25C12.9252 11.25 12.3645 11.4651 11.9466 11.8584L7.36415 9.36193C7.38302 9.24396 7.39286 9.12311 7.39286 9C7.39286 8.87689 7.38302 8.75604 7.36415 8.63807L11.9466 6.1416C12.3645 6.53491 12.9252 6.75 13.5 6.75Z"
      fill="white"
    />
  </svg>
);

const RefreshIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path
      d="M15.75 9C15.75 12.7279 12.7279 15.75 9 15.75C6.51004 15.75 4.33574 14.4043 3.16637 12.4032M2.25 9C2.25 5.27208 5.27208 2.25 9 2.25C11.7002 2.25 14.0272 3.83836 15.1108 6.13043M15.1108 6.13043V2.8125M15.1108 6.13043H11.8125M2.88919 11.8696V15.1875M2.88919 11.8696H6.1875"
      stroke="#1A1A1A"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default ResultScreen;
