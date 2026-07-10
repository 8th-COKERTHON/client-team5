import { useState, type PointerEvent } from 'react';
import deleteIcon from '@/assets/icons/delete.svg';
import type { Friend } from '../types/friend';

interface FriendCardProps {
  friend: Friend;
  onDelete: (friendId: string) => void;
}

const DELETE_ACTION_WIDTH = 89;
const DELETE_ICON_SIZE = 36;
const SWIPE_OPEN_THRESHOLD = -40;
const SWIPE_CLOSE_THRESHOLD = 24;

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

export const FriendCard = ({ friend, onDelete }: FriendCardProps) => {
  const [startX, setStartX] = useState<number | null>(null);
  const [dragX, setDragX] = useState(0);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const currentX = isDeleteOpen ? -DELETE_ACTION_WIDTH + dragX : dragX;
  const clampedX = Math.min(0, Math.max(-DELETE_ACTION_WIDTH, currentX));

  const handlePointerDown = (event: PointerEvent<HTMLElement>) => {
    setStartX(event.clientX);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (startX === null) {
      return;
    }

    setDragX(event.clientX - startX);
  };

  const handlePointerUp = () => {
    if (dragX < SWIPE_OPEN_THRESHOLD) {
      setIsDeleteOpen(true);
    }

    if (dragX > SWIPE_CLOSE_THRESHOLD) {
      setIsDeleteOpen(false);
    }

    setStartX(null);
    setDragX(0);
  };

  return (
    <div className="relative h-[6.125rem] overflow-hidden rounded-[0.625rem]">
      <button
        type="button"
        className="absolute right-0 top-0 flex h-full w-[5.5625rem] items-center justify-center rounded-lg bg-[#f3f3f3] shadow-[0_4px_20px_rgba(18,18,18,0.05)]"
        onClick={() => onDelete(friend.id)}
        aria-label={`${friend.name} 삭제`}
      >
        <img
          src={deleteIcon}
          alt=""
          className="block"
          style={{ width: DELETE_ICON_SIZE, height: DELETE_ICON_SIZE }}
        />
      </button>

      <article
        className="absolute inset-0 touch-pan-y rounded-[0.625rem] bg-white px-[1.3125rem] py-5 shadow-[0_4px_20px_rgba(18,18,18,0.05)] transition-transform duration-200"
        style={{ transform: `translateX(${clampedX}px)` }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerCancel={handlePointerUp}
        onPointerUp={handlePointerUp}
      >
        <div className="flex items-start gap-[0.6875rem]">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#f3f3f3] text-[1.6875rem] leading-none shadow-[0_4px_20px_rgba(18,18,18,0.05)]">
            <span aria-hidden="true">{friend.avatar}</span>
          </div>
          <div className="min-w-0">
            <h2 className="text-[0.9375rem] font-semibold leading-[1.1] text-[#1e2939]">
              {friend.name}
            </h2>
            <p className="mt-1 truncate text-[0.625rem] leading-[0.875rem] tracking-[0.014rem] text-[#b7b7b7]">
              {friend.cityCode} / {friend.countryName} {friend.cityName}
            </p>
            <p className="text-[0.625rem] leading-[0.875rem] text-[#b7b7b7]">
              {getOffsetLabel(friend.offsetFromSeoul)}
            </p>
          </div>
        </div>
        <p className="absolute bottom-3 right-4 text-[0.56rem] leading-none text-[#b7b7b7]">
          {friend.lastRecordedAtLabel}
        </p>
      </article>
    </div>
  );
};
