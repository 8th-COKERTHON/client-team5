import GlobeBackground from './components/GlobeBackground';
import { AirPlaneAnimation } from './components/AirPlaneAnimation';

const GLOBE_ALTITUDE = 1.2;
const GLOBE_FOCUS_LAT = 10;
const GLOBE_FOCUS_LNG = 20;

const SleepCountryLoadingScreen = () => {
  return (
    <div className="relative z-0 flex h-full w-full flex-col justify-end">
      {/* 배경 지구본 */}
      <GlobeBackground
        altitude={GLOBE_ALTITUDE}
        focusLat={GLOBE_FOCUS_LAT}
        focusLng={GLOBE_FOCUS_LNG}
      />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-[1.5rem]">
        {/* 비행기 애니메이션 */}
        <AirPlaneAnimation navigateTo="/jetlag/result" />

        <div className="mt-[2rem] inline-flex flex-col items-start font-['Pretendard']">
          <h1 className="text-center text-[1.5rem] leading-[2.1rem] font-bold text-[color:var(--White,#FFF)]">
            나의 수면 국가를
            <br />
            찾고 있어요
          </h1>

          <p className="mt-[0.75rem] text-center text-[0.8125rem] leading-[1.38125rem] font-medium text-[color:var(--Gray-200,#E6E6E6)]">
            현재 수면과 목표 수면의
            <br />
            시간 차이를 계산하고 있어요
          </p>
        </div>
      </div>
    </div>
  );
};

export default SleepCountryLoadingScreen;
