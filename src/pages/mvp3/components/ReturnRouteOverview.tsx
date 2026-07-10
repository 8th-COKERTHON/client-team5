import arriveIcon from '@/assets/icons/arrive.svg';
import backIcon from '@/assets/icons/back.svg';
import nowIcon from '@/assets/icons/now.svg';
import pinIcon from '@/assets/icons/pin.svg';
import type { ReturnRouteResultResponse } from '@/api/returnRoute';
import { getCountryFlagByCityName } from '@/lib/countryFlag';
import { FLAG_URLS } from '../mocks/flagUrls';
import FlagIcon from './FlagIcon';
import MobileStatusBar from './MobileStatusBar';

interface ReturnRouteOverviewProps {
  onBack: () => void;
  onConfirm: () => void;
  route?: ReturnRouteResultResponse;
  isLoading?: boolean;
}

const ROUTE_STOPS = [
  {
    cityName: 'NEW DELHI',
    airportCode: 'DEL',
    cityNameKo: '인도 뉴델리',
    flagUrl: FLAG_URLS.india,
    gapLabel: '-3시간 30분',
  },
  {
    cityName: 'DHAKA',
    airportCode: 'DAC',
    cityNameKo: '방글라데시 다카',
    flagUrl: FLAG_URLS.bangladesh,
    gapLabel: '-3시간',
  },
  {
    cityName: 'YANGON',
    airportCode: 'RGN',
    cityNameKo: '미얀마 양곤',
    flagUrl: FLAG_URLS.myanmar,
    gapLabel: '-2시간 30분',
  },
  {
    cityName: 'BANGKOK',
    airportCode: 'BKK',
    cityNameKo: '태국 방콕',
    flagUrl: FLAG_URLS.thailand,
    gapLabel: '-2시간',
  },
  {
    cityName: 'TAIPEI',
    airportCode: 'TPE',
    cityNameKo: '대만 타이베이',
    flagUrl: FLAG_URLS.taiwan,
    gapLabel: '-1시간',
  },
] as const;

const ReturnRouteOverview = ({ onBack, onConfirm, route, isLoading }: ReturnRouteOverviewProps) => {
  const routeStops = route
    ? [route.departureCity, ...route.days.map((day) => day.checkpointCity)].filter(
        (city, index, cities) =>
          cities.findIndex((candidate) => candidate.airportCode === city.airportCode) === index,
      ).map((city, index) => ({
        cityName: city.cityNameEn,
        airportCode: city.airportCode,
        cityNameKo: `${city.countryName} ${city.cityNameKr}`,
        flagUrl: getCountryFlagByCityName(city.cityNameEn),
        gapLabel: index === 0 ? `-${Math.round(route.dailyAdjustMinutes * route.durationDays / 60)}시간` : `-${Math.max(1, Math.round((route.durationDays - index) * route.dailyAdjustMinutes / 60))}시간`,
      }))
    : ROUTE_STOPS;

  return (
    <main className="h-full w-full overflow-hidden bg-white text-[#121212]">
      <div className="mvp3-screen">
        <MobileStatusBar />
        <header className="mvp3-navbar">
          <button
            type="button"
            aria-label="귀국편 화면으로 돌아가기"
            onClick={onBack}
            className="flex h-11 w-11 items-center justify-center rounded-full transition hover:bg-[#f2f5fb]"
          >
            <img src={backIcon} alt="" className="h-5 w-5" />
          </button>
          <h1 className="text-center text-[16px] leading-[27px] font-medium text-[#0D2571]">
            전체 귀국 루트
          </h1>
          <span aria-hidden="true" className="h-11 w-11" />
        </header>

        <section className="mt-7">
          <h2 className="text-[20px] leading-[27px] font-semibold">
            <span className="text-[#3A55A9]">서울</span>까지 가는 루트를
            <br />
            확인해보세요.
          </h2>
          <p className="mt-3 text-[13px] leading-5 tracking-[0.26px] text-[#707070]">
            수면시간이 서울에 가까워질수록 새로운 도시를 경유해요.
          </p>
        </section>

        <ol className="mt-8 space-y-6">
          {routeStops.map((stop, index) => {
            const isCurrent = index === 0;
            const isArrival = index === routeStops.length - 1;

            return (
              <li
                key={stop.airportCode}
                className="grid grid-cols-[2.375rem_1fr] items-center gap-[1.0625rem]"
              >
                <div className="relative flex h-[4.625rem] flex-col items-center justify-center">
                  {isCurrent || isArrival ? (
                    <>
                      <img
                        src={isCurrent ? nowIcon : arriveIcon}
                        alt=""
                        className="h-[1.625rem] w-[1.1875rem]"
                      />
                      <span
                        className={`mt-1 text-xs leading-[15px] font-medium ${isArrival ? 'text-[#DD3232]' : 'text-[#0D2571]'}`}
                      >
                        {isCurrent ? '현재' : '도착'}
                      </span>
                    </>
                  ) : (
                    <img src={pinIcon} alt="" className="h-5 w-5" />
                  )}
                </div>

                <article
                  className={`flex h-[4.625rem] items-center justify-between rounded-[0.625rem] pt-[1.0625rem] pr-5 pb-[1.125rem] pl-6 shadow-[0_0.25rem_1.25rem_rgba(18,18,18,0.05)] ${isCurrent ? 'bg-[#0D2571] text-white' : isArrival ? 'bg-[#E0EAFF]' : 'bg-white'}`}
                >
                  <div className="min-w-0">
                    <p
                      className={`font-oswald flex items-center gap-2 text-[17px] leading-[22.5px] font-bold whitespace-nowrap ${isCurrent ? 'text-white' : 'text-[#0D2571]'}`}
                    >
                      <FlagIcon src={stop.flagUrl} alt={`${stop.cityNameKo} 국기`} />
                      {stop.cityName} · {stop.airportCode}
                    </p>
                    <p
                      className={`font-noto-sans-kr mt-0.5 pl-7 text-[10px] leading-[15px] ${isCurrent ? 'text-[#E6E6E6]' : 'text-[#707070]'}`}
                    >
                      {stop.cityNameKo}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 text-[13px] leading-[15px] font-medium ${isCurrent ? 'text-[#CBDAF8]' : 'text-[#3A55A9]'}`}
                  >
                    {stop.gapLabel}
                  </span>
                </article>
              </li>
            );
          })}
        </ol>

        <button
          type="button"
          onClick={onConfirm}
          disabled={isLoading}
          className="mt-auto h-[52px] w-full shrink-0 rounded-[8px] bg-[#0D2571] px-5 text-[15px] leading-[22.5px] font-medium text-white shadow-[0_4px_20px_rgba(18,18,18,0.05)] transition hover:bg-[#102b77]"
        >
          {isLoading ? '귀국 항공권 불러오는 중' : '귀국 항공권 확인하기'}
        </button>
      </div>
    </main>
  );
};

export default ReturnRouteOverview;
