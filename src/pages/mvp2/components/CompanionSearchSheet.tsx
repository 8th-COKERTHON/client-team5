import { useState, type PointerEvent } from 'react';
import type { Friend } from '../types/friend';

interface CompanionSearchSheetProps {
  result: Friend;
  onAddCompanion: (friend: Friend) => void;
  onClose: () => void;
}

const CLOSE_THRESHOLD = 72;

const getOffsetLabel = (offsetFromSeoul: number) => {
  const absoluteOffset = Math.abs(offsetFromSeoul);

  if (offsetFromSeoul === 0) {
    return '서울과 같은 시간이에요.';
  }

  if (offsetFromSeoul < 0) {
    return `서울보다 ${absoluteOffset}시간 느려요.`;
  }

  return `서울보다 ${absoluteOffset}시간 빨라요.`;
};

export const CompanionSearchSheet = ({
  result,
  onAddCompanion,
  onClose,
}: CompanionSearchSheetProps) => {
  const [companionId, setCompanionId] = useState('meangg');
  const [hasSearched, setHasSearched] = useState(true);
  const [startY, setStartY] = useState<number | null>(null);
  const [dragY, setDragY] = useState(0);
  const translateY = Math.max(0, dragY);

  const handleSearch = () => {
    setHasSearched(companionId.trim().length > 0);
  };

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    setStartY(event.clientY);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (startY === null) {
      return;
    }

    setDragY(event.clientY - startY);
  };

  const handlePointerUp = () => {
    if (dragY > CLOSE_THRESHOLD) {
      onClose();
    }

    setStartY(null);
    setDragY(0);
  };

  return (
    <section
      className="absolute bottom-0 left-0 right-0 z-30 h-[22.8125rem] rounded-t-[1.875rem] border border-[#e0e0e0] bg-white px-9 pt-[3.1875rem] shadow-[0_4px_20px_rgba(18,18,18,0.05)] transition-transform duration-200"
      style={{ transform: `translateY(${translateY}px)` }}
    >
      <button
        type="button"
        className="absolute left-1/2 top-0 flex h-8 w-[8.875rem] -translate-x-1/2 items-center justify-center"
        aria-label="동행자 찾기 바텀시트 닫기"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerCancel={handlePointerUp}
        onPointerUp={handlePointerUp}
      >
        <span className="h-1 w-full rounded-full bg-[#e6e6e6]" />
      </button>

      <h1 className="text-[0.9375rem] font-semibold leading-[1.3] text-[#707070]">
        동행자 찾기
      </h1>

      <div className="mt-3 h-[6.25rem] rounded-[0.625rem] bg-white p-[0.875rem] shadow-[0_4px_10px_rgba(18,18,18,0.05)]">
        <label
          htmlFor="companion-id"
          className="block text-[0.75rem] leading-[1.4] text-[#99a1af]"
        >
          아이디 입력
        </label>
        <div className="mt-1 flex items-center gap-[0.4375rem]">
          <input
            id="companion-id"
            type="text"
            value={companionId}
            onChange={(event) => setCompanionId(event.target.value)}
            className="h-[2.8125rem] min-w-0 flex-1 rounded-[0.625rem] bg-[#f3f3f3] px-[0.875rem] text-[1rem] font-semibold tracking-[0.0625rem] text-[#121212] outline-none"
            placeholder="아이디"
          />
          <button
            type="button"
            className="h-[2.8125rem] rounded-[0.6875rem] border border-[#e6e6e6] px-[0.8rem] text-[0.78125rem] font-medium text-[#b7b7b7]"
            onClick={handleSearch}
          >
            검색
          </button>
        </div>
      </div>

      {hasSearched && (
        <article className="relative mt-4 h-[6.125rem] rounded-[0.625rem] bg-white px-[1.3125rem] py-5 shadow-[0_4px_20px_rgba(18,18,18,0.05)]">
          <div className="flex items-start gap-[0.6875rem]">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#f3f3f3] text-[1.6875rem] leading-none shadow-[0_4px_20px_rgba(18,18,18,0.05)]">
              <span aria-hidden="true">{result.avatar}</span>
            </div>
            <div className="min-w-0">
              <h2 className="text-[0.9375rem] font-semibold leading-[1.1] text-[#0d2571]">
                {result.name}
              </h2>
              <p className="mt-1 truncate text-[0.625rem] leading-[0.875rem] tracking-[0.014rem] text-[#b7b7b7]">
                {result.cityCode} / {result.countryName} {result.cityName}
              </p>
              <p className="text-[0.625rem] leading-[0.875rem] text-[#b7b7b7]">
                {getOffsetLabel(result.offsetFromSeoul)}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="absolute right-[1.5625rem] top-1/2 h-[1.875rem] w-[4.9375rem] -translate-y-1/2 rounded-[0.4375rem] bg-[#cbdaf8] text-[0.75rem] font-medium text-[#121212]"
            onClick={() => onAddCompanion(result)}
          >
            추가하기
          </button>
        </article>
      )}
    </section>
  );
};
