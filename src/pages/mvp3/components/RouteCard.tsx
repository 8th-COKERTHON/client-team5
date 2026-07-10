// MVP3-1의 카드
import airplaneBackgroundIcon from '@/assets/images/airplane_bg.svg';
import containerDivider from '@/assets/images/container.svg';
import qrCodeIcon from '@/assets/images/qrcode.svg';
import type { ReturnRoute } from '../types';
import FlagIcon from './FlagIcon';
import SleepSchedule from './SleepSchedule';

interface RouteCardProps {
  route: ReturnRoute;
}

const RouteCard = ({ route }: RouteCardProps) => {
  const departureDate = new Date(`${route.departureDate}T00:00:00`);
  const dayLabel = new Intl.DateTimeFormat('en-US', { weekday: 'short' })
    .format(departureDate)
    .toUpperCase();

  return (
    <article className="rounded-2xl bg-white px-[1.625rem] py-7 shadow-[0_0.75rem_2rem_rgba(34,49,86,0.08)]">
      <header className="flex items-center justify-between pb-5">
        <p className="text-[12.854px] leading-[10.284px] tracking-[1.028px] text-[#8A97B0]">
          DATE
          <strong className="font-space-mono ml-3 text-[12.854px] leading-[11.569px] font-bold tracking-normal text-[#0D2571]">
            {route.departureDate.replaceAll('-', '.')} · {dayLabel}
          </strong>
        </p>
        <img src={qrCodeIcon} alt="" className="h-[1.875rem] w-[1.875rem]" />
      </header>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 pt-3 pb-6">
        {[route.currentCity, route.destinationCity].map((city, index) => (
          <div key={city.airportCode} className={index === 1 ? 'col-start-3' : ''}>
            <FlagIcon src={city.flagUrl} alt={`${city.cityNameKo} 국기`} className="h-4 w-6" />
            <p className="font-noto-sans-kr mt-2 text-[11.519px] leading-[17.278px] text-[#5A6A8A]">
              {city.cityNameKo}
            </p>
            <p className="font-oswald mt-1 text-[23.038px] leading-[34.816px] font-bold text-[#0D2571]">
              <span className="block whitespace-nowrap">{city.cityNameEn}</span>
              <span className="block">{city.airportCode}</span>
            </p>
          </div>
        ))}
        <div className="relative col-start-2 row-start-1 flex h-10 w-[3.4rem] items-center justify-center">
          <img src={airplaneBackgroundIcon} alt="" className="absolute inset-x-0 bottom-0 w-full" />
        </div>
      </div>

      <img src={containerDivider} alt="" className="h-0.5 w-full" />

      <div className="grid grid-cols-2 gap-[2.3rem] pt-7">
        <SleepSchedule label="CURRENT SLEEP" sleep={route.currentSleep} />
        <SleepSchedule label="TARGET SLEEP" sleep={route.targetSleep} isTarget />
      </div>
    </article>
  );
};

export default RouteCard;
