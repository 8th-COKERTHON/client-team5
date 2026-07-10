import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSleepStore } from '../../stores/useSleepStore';

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

const CurrentSleepTimeScreen = () => {
  const navigate = useNavigate();
  const sleepTime = useSleepStore((state) => state.sleepTime);
  const wakeTime = useSleepStore((state) => state.wakeTime);

  const duration = useMemo(() => getSleepDurationLabel(sleepTime, wakeTime), [sleepTime, wakeTime]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleNextClick = () => {
    navigate('/jetlag/desired-sleep-time');
  };

  const handleSleepTimeClick = () => {
    // TODO: TimePickerBottomSheet 오픈 (setSleepTime 호출)
  };

  const handleWakeTimeClick = () => {
    // TODO: TimePickerBottomSheet 오픈 (setWakeTime 호출)
  };

  return (
    <div className="flex h-full w-full flex-col bg-white px-[1.5rem] pt-[1rem] font-['Pretendard']">
      <div className="flex items-center gap-[0.75rem]">
        <button
          type="button"
          onClick={handleBackClick}
          aria-label="뒤로가기"
          className="-ml-[0.5rem] flex h-[2.25rem] w-[2.25rem] items-center justify-center"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M12.5 15L7.5 10L12.5 5"
              stroke="#1A1A1A"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="flex flex-1 gap-[0.375rem]">
          <span className="h-[0.25rem] flex-1 rounded-full bg-[#0D2571]" />
          <span className="h-[0.25rem] flex-1 rounded-full bg-gray-200" />
        </div>

        <span className="text-xs font-medium text-gray-400">1/2</span>
      </div>

      <h1 className="mt-[2rem] text-2xl leading-snug font-bold text-[#1A1A1A]">
        요즘 몇 시에 자고
        <br />몇 시에 일어나나요?
      </h1>

      <p className="mt-[0.75rem] text-sm leading-relaxed text-gray-500">
        정확하지 않아도 괜찮아요.
        <br />
        평소의 수면시간을 입력해주세요.
      </p>

      <div className="mt-[2rem] rounded-2xl border border-gray-200 px-[1.25rem] py-[1.25rem]">
        <button
          type="button"
          onClick={handleSleepTimeClick}
          className="flex w-full flex-col items-start gap-[0.375rem] text-left"
        >
          <span className="text-sm text-gray-500">잠드는 시간</span>
          <div className="flex w-full items-center justify-between">
            <span className="text-lg font-semibold text-[#1A1A1A]">{sleepTime}</span>
            <ChevronDownIcon />
          </div>
        </button>

        <div className="flex justify-center py-[0.75rem]">
          <span className="text-gray-300">↓</span>
        </div>

        <button
          type="button"
          onClick={handleWakeTimeClick}
          className="flex w-full flex-col items-start gap-[0.375rem] text-left"
        >
          <span className="text-sm text-gray-500">일어나는 시간</span>
          <div className="flex w-full items-center justify-between">
            <span className="text-lg font-semibold text-[#1A1A1A]">{wakeTime}</span>
            <ChevronDownIcon />
          </div>
        </button>
      </div>

      <div className="mt-[1rem] flex items-center justify-between border-t border-gray-100 pt-[1rem]">
        <span className="text-sm text-gray-500">총 수면시간</span>
        <span className="text-lg font-bold text-[#0D2571]">{duration}</span>
      </div>

      <div className="mt-auto pb-[calc(env(safe-area-inset-bottom)+1.5rem)]">
        <button
          type="button"
          onClick={handleNextClick}
          className="flex w-full items-center justify-center rounded-lg bg-[#0D2571] px-[1.25rem] py-[0.875rem] text-[15px] leading-[22.5px] font-medium tracking-[0.15px] text-white"
        >
          다음
        </button>
      </div>
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

export default CurrentSleepTimeScreen;
