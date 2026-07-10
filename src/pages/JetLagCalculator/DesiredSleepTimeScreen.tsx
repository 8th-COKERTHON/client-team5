import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSleepStore } from '../../stores/useSleepStore';
import arrowLeftIcon from '../../assets/icons/arrow-left.svg';
import arrowDownIcon from '../../assets/icons/arrow-down.svg';
import { PrimaryButton } from './components/PrimaryButton';
import { TimePickerBottomSheet } from './components/TimePickerBottomSheet';

const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;

// "오전 3:00" 같은 한국어 시간 라벨을 분(minute) 단위로 변환
const parseKoreanTime = (label: string): number => {
  const match = label.match(/(오전|오후)\s*(\d{1,2}):(\d{2})/);
  if (!match) return 0;
  const [, period, hourString, minuteString] = match;
  let hour = parseInt(hourString, 10) % 12;
  if (period === '오후') hour += 12;
  return hour * MINUTES_PER_HOUR + parseInt(minuteString, 10);
};

const getSleepDurationLabel = (sleepTime: string, wakeTime: string): string => {
  const sleepMinutes = parseKoreanTime(sleepTime);
  const wakeMinutes = parseKoreanTime(wakeTime);
  const diffMinutes =
    wakeMinutes >= sleepMinutes
      ? wakeMinutes - sleepMinutes
      : HOURS_PER_DAY * MINUTES_PER_HOUR - sleepMinutes + wakeMinutes;
  const hours = Math.round(diffMinutes / MINUTES_PER_HOUR);
  return `${hours}시간`;
};

const DesiredSleepTimeScreen = () => {
  const navigate = useNavigate();
  const desiredSleepTime = useSleepStore((state) => state.desiredSleepTime);
  const desiredWakeTime = useSleepStore((state) => state.desiredWakeTime);
  const setDesiredSleepTime = useSleepStore((state) => state.setDesiredSleepTime);
  const setDesiredWakeTime = useSleepStore((state) => state.setDesiredWakeTime);

  const [isSleepTimeSheetOpen, setIsSleepTimeSheetOpen] = useState(false);
  const [isWakeTimeSheetOpen, setIsWakeTimeSheetOpen] = useState(false);

  const duration = useMemo(
    () => getSleepDurationLabel(desiredSleepTime, desiredWakeTime),
    [desiredSleepTime, desiredWakeTime],
  );

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleSleepTimeClick = () => setIsSleepTimeSheetOpen(true);
  const handleWakeTimeClick = () => setIsWakeTimeSheetOpen(true);

  const handleSleepTimeConfirm = (value: string) => {
    setDesiredSleepTime(value);
    setIsSleepTimeSheetOpen(false);
  };

  const handleWakeTimeConfirm = (value: string) => {
    setDesiredWakeTime(value);
    setIsWakeTimeSheetOpen(false);
  };

  return (
    <div className="flex h-full w-full flex-col overflow-x-hidden overflow-y-auto bg-white px-[1.5rem] pt-[1rem] pb-[7rem] font-['Pretendard']">
      {/* 상단 헤더: 뒤로가기 + 진행바 + 스텝 표시 */}
      <div className="flex h-[42px] w-full flex-shrink-0 items-center justify-between pb-[20px]">
        <button
          type="button"
          onClick={handleBackClick}
          aria-label="뒤로가기"
          className="flex h-[2.25rem] w-[2.25rem] items-center justify-center"
        >
          <img src={arrowLeftIcon} alt="" width={20} height={20} />
        </button>

        <div className="flex flex-1 gap-[0.375rem] px-[0.75rem]">
          <span className="h-[4px] w-[32px] rounded-[2px] bg-[var(--main-500,#0D2571)]" />
          <span className="h-[4px] w-[32px] rounded-[2px] bg-[var(--main-500,#0D2571)]" />
        </div>

        <span
          style={{
            color: 'var(--Gray-400, #707070)',
            fontFamily: 'Pretendard',
            fontSize: '12px',
            fontStyle: 'normal',
            fontWeight: 600,
            lineHeight: '18px',
          }}
        >
          2/2
        </span>
      </div>

      {/* 타이틀 */}
      <h1 className="mt-[2rem] text-2xl leading-snug font-bold text-[#1A1A1A]">
        어떤 시간에 자고
        <br />
        일어나고 싶나요?
      </h1>

      <p className="mt-[0.75rem] text-sm leading-relaxed text-gray-500">
        내가 희망하는
        <br />
        수면시간을 입력해주세요.
      </p>

      {/* 잠드는 시간 / 일어나는 시간 / 총 수면시간 컨테이너 */}
      <div
        className="mt-[2rem] flex flex-1 flex-col items-start justify-between self-stretch rounded-[10px] border border-[var(--Gray-100,#F3F3F3)] bg-white px-[20px] pt-[20px] pb-[16px]"
        style={{ boxShadow: '0 4px 20px 0 rgba(18, 18, 18, 0.05)' }}
      >
        {/* 상단: 잠드는 시간 + 구분선 + 일어나는 시간 */}
        <div className="flex w-full flex-col gap-[0.5rem]">
          {/* 잠드는 시간 */}
          <div className="flex w-full flex-col gap-[0.5rem]">
            <span
              style={{
                color: 'var(--Gray-400, #707070)',
                fontFamily: 'Pretendard',
                fontSize: '11px',
                fontStyle: 'normal',
                fontWeight: 700,
                lineHeight: '16.5px',
                letterSpacing: '1.1px',
                textTransform: 'uppercase',
              }}
            >
              희망 잠들기 시간
            </span>
            <button
              type="button"
              onClick={handleSleepTimeClick}
              className="flex items-center justify-between self-stretch rounded-[12px] border border-[var(--Gray-200,#E6E6E6)] bg-white px-[16px] py-[14px]"
            >
              <span
                style={{
                  color: 'var(--Black, #121212)',
                  fontFamily: 'Pretendard',
                  fontSize: '20px',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  lineHeight: '30px',
                }}
              >
                {desiredSleepTime}
              </span>
              <ChevronDownIcon />
            </button>
          </div>

          {/* 구분자: 직선 + 화살표 아이콘 */}
          <div className="flex flex-col items-center justify-center gap-[2px] py-[0.25rem]">
            <span className="h-[18px] w-[1.5px] bg-[var(--Gray-300,#B7B7B7)]" />
            <img src={arrowDownIcon} alt="" width={16} height={16} />
          </div>

          {/* 일어나는 시간 */}
          <div className="flex w-full flex-col gap-[0.5rem]">
            <span
              style={{
                color: 'var(--Gray-400, #707070)',
                fontFamily: 'Pretendard',
                fontSize: '11px',
                fontStyle: 'normal',
                fontWeight: 700,
                lineHeight: '16.5px',
                letterSpacing: '1.1px',
                textTransform: 'uppercase',
              }}
            >
              희망 기상 시간
            </span>
            <button
              type="button"
              onClick={handleWakeTimeClick}
              className="flex items-center justify-between self-stretch rounded-[12px] border border-[var(--Gray-200,#E6E6E6)] bg-white px-[16px] py-[14px]"
            >
              <span
                style={{
                  color: 'var(--Black, #121212)',
                  fontFamily: 'Pretendard',
                  fontSize: '20px',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  lineHeight: '30px',
                }}
              >
                {desiredWakeTime}
              </span>
              <ChevronDownIcon />
            </button>
          </div>
        </div>

        {/* 총 수면시간 */}
        <div className="flex w-full items-center justify-between self-stretch border-t border-dashed border-gray-200 pt-[1rem]">
          <span className="text-sm text-gray-500">목표 수면시간</span>
          <span className="text-lg font-bold text-[#0D2571]">{duration}</span>
        </div>
      </div>

      {/* 다음 버튼 */}
      <PrimaryButton
        navigateTo="/jetlag/sleep-country-loading"
        wrapperClassName="fixed bottom-0 left-0 right-0 z-20 flex justify-center px-[1.25rem] pb-[calc(env(safe-area-inset-bottom)+3.75rem)]"
      >
        다음
      </PrimaryButton>

      <TimePickerBottomSheet
        isOpen={isSleepTimeSheetOpen}
        title="희망 잠들기 시간 선택"
        initialValue={desiredSleepTime}
        onConfirm={handleSleepTimeConfirm}
        onClose={() => setIsSleepTimeSheetOpen(false)}
      />

      <TimePickerBottomSheet
        isOpen={isWakeTimeSheetOpen}
        title="희망 기상 시간 선택"
        initialValue={desiredWakeTime}
        onConfirm={handleWakeTimeConfirm}
        onClose={() => setIsWakeTimeSheetOpen(false)}
      />
    </div>
  );
};

const ChevronDownIcon = () => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M4 6L8 10L12 6"
        stroke="#9CA3AF"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default DesiredSleepTimeScreen;
