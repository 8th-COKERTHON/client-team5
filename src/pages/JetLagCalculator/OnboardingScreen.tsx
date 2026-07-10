import GlobeBackground from './GlobeBackground';

export default function OnboardingScreen() {
  return (
    <div className="relative z-0 flex h-full w-full flex-col justify-end">
      {/* 배경 지구본 */}
      <GlobeBackground altitude={1.2} focusLat={10} focusLng={20} />

      <div className="relative z-10 flex flex-1 items-center justify-center px-6">
        <div className="inline-flex flex-col items-start font-['Pretendard']">
          <h1 className="text-center text-[24px] leading-[33.6px] font-bold text-[color:var(--White,#FFF)]">
            내 수면시간
            <br />
            어느 나라에 있을까요?
          </h1>

          <p className="mt-[12px] text-center text-[13px] leading-[22.1px] font-medium text-[color:var(--Gray-200,#E6E6E6)]">
            현재 수면시간과 원하는 수면시간을 비교해
            <br />내 몸의 시간대를 알려드려요.
          </p>
        </div>
      </div>

      <div className="relative z-10 flex justify-center px-6 pb-[calc(env(safe-area-inset-bottom)+60px)]">
        <button
          type="button"
          className="mt-4 flex w-full max-w-[340px] items-center justify-center gap-2 rounded-lg bg-[#0D2571] px-5 py-3.5 text-center font-['Pretendard'] text-[15px] leading-[22.5px] font-medium tracking-[0.15px] text-[color:var(--White,#FFF)]"
        >
          내 수면시차 확인하기
          <span aria-hidden>→</span>
        </button>
      </div>
    </div>
  );
}
