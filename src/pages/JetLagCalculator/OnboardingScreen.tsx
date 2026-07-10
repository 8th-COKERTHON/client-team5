import GlobeBackground from './components/GlobeBackground';
import { PrimaryButton } from './components/PrimaryButton';

const GLOBE_ALTITUDE = 1.2;
const GLOBE_FOCUS_LAT = 10;
const GLOBE_FOCUS_LNG = 20;

const OnboardingScreen = () => {
  return (
    <div className="relative z-0 flex h-full w-full flex-col justify-end">
      {/* 배경 지구본 */}
      <GlobeBackground
        altitude={GLOBE_ALTITUDE}
        focusLat={GLOBE_FOCUS_LAT}
        focusLng={GLOBE_FOCUS_LNG}
      />

      <div className="relative z-10 flex flex-1 items-center justify-center px-[1.5rem]">
        <div className="inline-flex flex-col items-start font-['Pretendard']">
          <h1 className="text-center text-[1.5rem] leading-[2.1rem] font-bold text-[color:var(--White,#FFF)]">
            내 수면시간
            <br />
            어느 나라에 있을까요?
          </h1>

          <p className="mt-[0.75rem] text-center text-[0.8125rem] leading-[1.38125rem] font-medium text-[color:var(--Gray-200,#E6E6E6)]">
            현재 수면시간과 원하는 수면시간을 비교해
            <br />내 몸의 시간대를 알려드려요.
          </p>
        </div>
      </div>

      <PrimaryButton
        navigateTo="/jetlag/current-sleep-time"
        wrapperClassName="fixed bottom-0 left-0 right-0 z-20 flex justify-center px-[1.25rem] pb-[calc(env(safe-area-inset-bottom)+3.75rem)]"
        icon="→"
      >
        내 수면시차 확인하기
      </PrimaryButton>
    </div>
  );
};

export default OnboardingScreen;
