const MobileStatusBar = () => (
  <div className="mvp3-status-bar" aria-label="현재 시각 오전 9시 41분">
    <span>9:41</span>
    <span aria-hidden="true" className="flex items-center gap-1 text-[13px] tracking-[-0.08em]">
      <span className="tracking-[-0.18em]">▮▮▮▮</span>
      <span className="text-[16px] leading-none">⌁</span>
      <span className="ml-1 inline-block h-[11px] w-[22px] rounded-[3px] border border-[#121212] p-[1px]">
        <span className="block h-full w-full rounded-[1px] bg-[#121212]" />
      </span>
    </span>
  </div>
);

export default MobileStatusBar;
