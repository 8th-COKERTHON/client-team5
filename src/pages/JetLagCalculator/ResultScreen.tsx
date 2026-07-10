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

interface SleepCountryResult {
  countryNameEn: string;
  countryNameKo: string;
  countryCode: string;
  timeDifferenceHour: number;
  isSlowerThanSeoul: boolean;
}

// TODO: 실제 시차/국가 매칭 알고리즘이 준비되면 이 mock을 store 계산 결과로 교체
const MOCK_RESULT: SleepCountryResult = {
  countryNameEn: 'NEW DELHI',
  countryNameKo: '인도 뉴델리',
  countryCode: 'DEL',
  timeDifferenceHour: 3.5,
  isSlowerThanSeoul: true,
};

const WEEKDAY_LABELS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

// 오늘 날짜를 "2026.07.10 · FRI" 형식으로 변환
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

  const currentSleepTime = useSleepStore((state) => state.sleepTime);
  const currentWakeTime = useSleepStore((state) => state.wakeTime);
  const targetSleepTime = useSleepStore((state) => state.desiredSleepTime);
  const targetWakeTime = useSleepStore((state) => state.desiredWakeTime);

  // API 응답 없이 결과 화면에 직접 진입한 경우 방어 (새로고침 등)
  useEffect(() => {
    if (!result) {
      navigate('/jetlag/onboarding', { replace: true });
    }
  }, [result, navigate]);

  const dateLabel = useMemo(() => getCurrentDateLabel(), []);

  if (!result) return null;

  const timeDifferenceHourLabel = Math.floor(result.jetlagMinutes / 60);
  const timeDifferenceMinuteLabel = result.jetlagMinutes % 60;
  const isSlowerThanSeoul = result.direction === 'WEST';

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleCloseClick = () => {
    navigate('/jetlag/onboarding');
  };

  const handleShareClick = () => {
    // TODO: 결과 공유 로직 (예: Web Share API, 이미지 캡처 등)
  };

  const handleRetryClick = () => {
    navigate('/jetlag/current-sleep-time');
  };

  return (
    <div className="flex h-full w-full flex-col items-center overflow-y-auto bg-[#fff] px-[1.5rem] pt-[1rem] pb-[calc(env(safe-area-inset-bottom)+1.5rem)] font-['Pretendard']">
      {/* 상단 헤더 */}
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

      {/* 보딩패스 카드: 342x563 고정, svg가 테두리/라운드까지 전부 그림 */}
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
          {/* DATE 라벨 + 날짜 */}
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
            <IndiaFlagIcon />
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

          {/* 국가명 */}
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
            {result.to.cityNameEn}
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
            {result.to.cityNameKr}
          </p>

          {/* 국가 코드 배지 */}
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
              {result.to.airportCode}
            </span>
          </span>

          {/* CURRENT SLEEP / TARGET SLEEP 라벨 */}
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

          {/* 시간 비교 */}
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

        {/* 바코드: 카드 하단에서 13px 위, 267.64 x 66.91 고정 크기 */}
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

      {/* 하단 버튼 */}
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

const IndiaFlagIcon = () => (
  <svg width="28" height="20" viewBox="0 0 28 20" fill="none">
    <rect width="28" height="20" rx="2" fill="white" />
    <rect width="28" height="6.67" fill="#FF9933" />
    <rect y="13.33" width="28" height="6.67" fill="#138808" />
    <circle cx="14" cy="10" r="2.2" fill="none" stroke="#000080" strokeWidth="0.4" />
  </svg>
);

export default ResultScreen;
