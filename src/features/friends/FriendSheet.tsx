import type { Friend } from '../../types/friend';
import { FriendCard } from './FriendCard';
import { FriendEmptyState } from './FriendEmptyState';

interface FriendSheetProps {
  friends: Friend[];
  onInvite?: () => void;
}

export const FriendSheet = ({ friends, onInvite }: FriendSheetProps) => {
  const hasFriends = friends.length > 0;

  return (
    <section className="absolute bottom-0 left-0 right-0 h-[27.3125rem] rounded-t-[1.875rem] border border-[#e0e0e0] bg-white px-9 pt-[2.8125rem] shadow-[0_4px_20px_rgba(18,18,18,0.05)]">
      <div className="absolute left-1/2 top-4 h-1 w-[8.875rem] -translate-x-1/2 rounded-full bg-[#e6e6e6]" />
      <div className="flex items-center justify-between">
        <h1 className="text-[0.9375rem] font-semibold leading-[1.3] text-[#707070]">
          같이 여행 중인 친구
        </h1>
        <button
          type="button"
          className="flex size-[1.375rem] items-center justify-center text-[1.35rem] leading-none text-[#707070]"
          aria-label="친구 설정"
        >
          ⚙
        </button>
      </div>

      {hasFriends ? (
        <div className="mt-6 grid gap-[0.6875rem]">
          {friends.map((friend) => (
            <FriendCard key={friend.id} friend={friend} />
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
