// pages/JetLagCalculator/components/TimePickerBottomSheet.tsx
import { useEffect, useState } from 'react';
import { motion, type PanInfo } from 'framer-motion';

const PERIOD_OPTIONS = ['오전', '오후'] as const;
const HOUR_OPTIONS = Array.from({ length: 12 }, (_, index) => index + 1);
const MINUTE_OPTIONS = ['00', '10', '20', '30', '40', '50'];
const DRAG_CLOSE_THRESHOLD_PX = 120;
const DRAG_CLOSE_VELOCITY = 500;

type Period = (typeof PERIOD_OPTIONS)[number];

interface ParsedTime {
  period: Period;
  hour: number;
  minute: string;
}

const parseTimeLabel = (label: string): ParsedTime => {
  const match = label.match(/(오전|오후)\s*(\d{1,2}):(\d{2})/);
  if (!match) return { period: '오전', hour: 12, minute: '00' };

  const [, period, hourString, minuteString] = match;
  return {
    period: period as Period,
    hour: parseInt(hourString, 10),
    minute: minuteString,
  };
};

const formatTimeLabel = (period: Period, hour: number, minute: string): string => {
  return `${period} ${hour}:${minute}`;
};

interface TimePickerBottomSheetProps {
  isOpen: boolean;
  title: string;
  initialValue: string;
  onConfirm: (value: string) => void;
  onClose: () => void;
}

export const TimePickerBottomSheet = ({
  isOpen,
  title,
  initialValue,
  onConfirm,
  onClose,
}: TimePickerBottomSheetProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('오전');
  const [selectedHour, setSelectedHour] = useState<number>(3);
  const [selectedMinute, setSelectedMinute] = useState<string>('00');

  useEffect(() => {
    if (!isOpen) return;
    const parsed = parseTimeLabel(initialValue);
    setSelectedPeriod(parsed.period);
    setSelectedHour(parsed.hour);
    setSelectedMinute(parsed.minute);
  }, [isOpen, initialValue]);

  const handleConfirmClick = () => {
    onConfirm(formatTimeLabel(selectedPeriod, selectedHour, selectedMinute));
  };

  const handlePeriodSelect = (period: Period) => {
    setSelectedPeriod(period);
  };

  const handleHourSelect = (hour: number) => {
    setSelectedHour(hour);
  };

  const handleMinuteSelect = (minute: string) => {
    setSelectedMinute(minute);
  };

  // 드래그를 놓았을 때, 충분히 아래로 내렸거나 빠르게 내렸으면 닫기
  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const shouldClose =
      info.offset.y > DRAG_CLOSE_THRESHOLD_PX || info.velocity.y > DRAG_CLOSE_VELOCITY;

    if (shouldClose) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-30 flex flex-col justify-end">
      {/* 배경 딤 처리 */}
      <div
        role="button"
        tabIndex={-1}
        aria-label="닫기"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />

      {/* 바텀시트 본문 */}
      <motion.div
        className="relative z-10 mx-auto flex w-full flex-col items-start"
        style={{
          maxWidth: '390px',
          height: '509px',
          padding: '12px 24px 32px 24px',
          borderRadius: '24px 24px 0 0',
          background: 'var(--White, #FFF)',
          boxShadow: '0 -4px 24px 0 rgba(0, 0, 0, 0.15)',
        }}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.6 }}
        onDragEnd={handleDragEnd}
      >
        {/* 드래그 핸들 */}
        <div className="flex w-full cursor-grab justify-center pb-[1rem] active:cursor-grabbing">
          <span className="h-[4px] w-[36px] rounded-full bg-[#E6E6E6]" />
        </div>

        <h2 className="w-full text-center text-[1rem] font-bold text-[#1A1A1A]">{title}</h2>

        {/* 오전/오후 · 시 · 분 3단 선택 */}
        <div className="mt-[1.25rem] grid w-full grid-cols-3 gap-[0.5rem]">
          <div>
            <p className="mb-[0.5rem] text-center text-[0.75rem] text-[#9CA3AF]">오전/오후</p>
            <div className="flex flex-col gap-[0.375rem]">
              {PERIOD_OPTIONS.map((period) => (
                <TimePickerOptionButton
                  key={period}
                  label={period}
                  isSelected={selectedPeriod === period}
                  onClick={() => handlePeriodSelect(period)}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="mb-[0.5rem] text-center text-[0.75rem] text-[#9CA3AF]">시</p>
            <div className="flex max-h-[12.5rem] flex-col gap-[0.375rem] overflow-y-auto">
              {HOUR_OPTIONS.map((hour) => (
                <TimePickerOptionButton
                  key={hour}
                  label={String(hour)}
                  isSelected={selectedHour === hour}
                  onClick={() => handleHourSelect(hour)}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="mb-[0.5rem] text-center text-[0.75rem] text-[#9CA3AF]">분</p>
            <div className="flex max-h-[12.5rem] flex-col gap-[0.375rem] overflow-y-auto">
              {MINUTE_OPTIONS.map((minute) => (
                <TimePickerOptionButton
                  key={minute}
                  label={minute}
                  isSelected={selectedMinute === minute}
                  onClick={() => handleMinuteSelect(minute)}
                />
              ))}
            </div>
          </div>
        </div>

        <p className="mt-[0.75rem] w-full text-center text-[0.75rem] text-[#9CA3AF]">
          10분 단위 선택
        </p>

        <button
          type="button"
          onClick={handleConfirmClick}
          className="mt-auto flex w-full items-center justify-center rounded-lg bg-[#0D2571] py-[0.875rem] text-[0.9375rem] font-medium text-white"
        >
          선택 완료
        </button>
      </motion.div>
    </div>
  );
};

interface TimePickerOptionButtonProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

const TimePickerOptionButton = ({ label, isSelected, onClick }: TimePickerOptionButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[0.5rem] py-[0.5rem] text-center text-[0.9375rem] transition-colors ${
        isSelected
          ? 'bg-[#0D2571] font-bold text-white'
          : 'bg-transparent font-medium text-[#1A1A1A] hover:bg-[#F3F3F3]'
      }`}
    >
      {label}
    </button>
  );
};
