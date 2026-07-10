export const FriendEmptyState = () => {
  return (
    <div className="flex flex-col items-center pt-[3.25rem] text-center">
      <div className="flex size-[4.875rem] items-center justify-center rounded-full border-2 border-dashed border-[#b7b7b7] text-[1.75rem] text-[#b7b7b7]">
        ♙
      </div>
      <strong className="mt-4 text-[1.0625rem] font-medium leading-[1.6] text-[#121212]">
        아직 함께하는 친구가 없어요.
      </strong>
      <p className="text-[0.875rem] leading-[1.45] text-[#b7b7b7]">
        동행자를 초대하고 수면 나라를 비교해보세요!
      </p>
    </div>
  );
};
