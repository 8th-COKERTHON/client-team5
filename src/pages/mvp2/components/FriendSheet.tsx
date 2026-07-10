import { useState, type PointerEvent } from 'react';
import type { Friend } from '../types/friend';
import { FriendCard } from './FriendCard';
import { FriendEmptyState } from './FriendEmptyState';

interface FriendSheetProps {
  friends: Friend[];
  onClose: () => void;
  onDeleteFriend: (friendId: string) => void;
  onInvite?: () => void;
}

const CLOSE_THRESHOLD = 72;

export const FriendSheet = ({
  friends,
  onClose,
  onDeleteFriend,
  onInvite,
}: FriendSheetProps) => {
  const [startY, setStartY] = useState<number | null>(null);
  const [dragY, setDragY] = useState(0);
  const hasFriends = friends.length > 0;
  const translateY = Math.max(0, dragY);

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
      className="absolute bottom-0 left-0 right-0 h-[27.3125rem] rounded-t-[1.875rem] border border-[#e0e0e0] bg-white px-9 pt-[2.8125rem] shadow-[0_4px_20px_rgba(18,18,18,0.05)] transition-transform duration-200"
      style={{ transform: `translateY(${translateY}px)` }}
    >
      <button
        type="button"
        className="absolute left-1/2 top-0 flex h-8 w-[8.875rem] -translate-x-1/2 items-center justify-center"
        aria-label="친구 바텀시트 닫기"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerCancel={handlePointerUp}
        onPointerUp={handlePointerUp}
      >
        <span className="h-1 w-full rounded-full bg-[#e6e6e6]" />
      </button>

      <div className="flex items-center">
        <h1 className="text-[0.9375rem] font-semibold leading-[1.3] text-[#707070]">
          같이 여행 중인 친구
        </h1>
      </div>

      {hasFriends ? (
        <div className="mt-6 grid gap-[0.6875rem]">
          {friends.map((friend) => (
            <FriendCard
              key={friend.id}
              friend={friend}
              onDelete={onDeleteFriend}
            />
          ))}
        </div>
      ) : (
        <FriendEmptyState />
      )}

      <button
        type="button"
        className="absolute bottom-[1.4375rem] left-9 right-9 h-[3.25rem] rounded-lg bg-[#0d2571] text-[0.9375rem] font-semibold text-white"
        onClick={onInvite}
      >
        동행자 초대하기
      </button>
    </section>
  );
};
