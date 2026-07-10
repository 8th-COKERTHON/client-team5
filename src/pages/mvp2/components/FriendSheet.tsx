import { motion, useDragControls, type PanInfo } from 'framer-motion';
import type { PointerEvent as ReactPointerEvent } from 'react';
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
const CLOSE_VELOCITY = 600;
const DRAG_LIMIT = 180;

export const FriendSheet = ({
  friends,
  onClose,
  onDeleteFriend,
  onInvite,
}: FriendSheetProps) => {
  const dragControls = useDragControls();
  const hasFriends = friends.length > 0;

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    const canClose =
      info.offset.y > CLOSE_THRESHOLD || info.velocity.y > CLOSE_VELOCITY;

    if (canClose) {
      onClose();
    }
  };

  const handleDragHandlePointerDown = (
    event: ReactPointerEvent<HTMLButtonElement>,
  ) => {
    dragControls.start(event);
  };

  return (
    <motion.section
      className="absolute bottom-0 left-0 right-0 z-30 h-[25.4375rem] overflow-hidden rounded-t-[1.875rem] border border-[#e0e0e0] bg-white px-9 pt-[2.8125rem] shadow-[0_4px_20px_rgba(18,18,18,0.05)]"
      drag="y"
      dragControls={dragControls}
      dragConstraints={{ top: 0, bottom: DRAG_LIMIT }}
      dragElastic={{ top: 0, bottom: 0.08 }}
      dragListener={false}
      dragMomentum={false}
      dragSnapToOrigin
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      onDragEnd={handleDragEnd}
      transition={{ type: 'spring', stiffness: 420, damping: 36, mass: 0.8 }}
    >
      <button
        type="button"
        className="absolute left-1/2 top-0 flex h-8 w-[8.875rem] -translate-x-1/2 touch-none items-center justify-center"
        aria-label="친구 바텀시트 닫기"
        onPointerDown={handleDragHandlePointerDown}
      >
        <span className="h-1 w-full rounded-full bg-[#e6e6e6]" />
      </button>

      <div className="flex items-center">
        <h1 className="text-[0.9375rem] font-semibold leading-[1.3] text-[#707070]">
          같이 여행 중인 친구
        </h1>
      </div>

      {hasFriends ? (
        <div className="scrollbar-hidden absolute bottom-[6.5rem] left-0 right-0 top-[5.9375rem] overflow-y-auto overscroll-contain">
          <div className="grid gap-3 px-9 pb-4">
            {friends.map((friend) => (
              <FriendCard
                key={friend.id}
                friend={friend}
                onDelete={onDeleteFriend}
              />
            ))}
          </div>
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
    </motion.section>
  );
};
