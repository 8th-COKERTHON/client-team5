import type { Friend } from '../../types/friend';

interface FriendCardProps {
  friend: Friend;
}

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

export const FriendCard = ({ friend }: FriendCardProps) => {
  return (
    <article className="relative h-[6.125rem] rounded-[0.625rem] bg-white px-[1.3125rem] py-5 shadow-[0_4px_20px_rgba(18,18,18,0.05)]">
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
  );
};
