import type {
  CurrentBoardingPassResponse,
  ReturnRouteCityResponse,
  ReturnRouteResultResponse,
} from '@/api/returnRoute';
import { getCountryFlagByCityName } from '@/lib/countryFlag';
import type { City, ReturnRoute } from './types';

export const formatApiTime = (value: string | undefined, fallback: string) => {
  const matchedTime = value?.match(/(\d{2}):(\d{2})/);
  return matchedTime ? `${matchedTime[1]}:${matchedTime[2]}` : fallback;
};

export const mapApiCity = (city: ReturnRouteCityResponse): City => ({
  cityNameKo: `${city.countryName} ${city.cityNameKr}`.trim(),
  cityNameEn: city.cityNameEn,
  airportCode: city.airportCode,
  flagUrl: getCountryFlagByCityName(city.cityNameEn) ?? '',
});

export const mapCurrentRoute = (route: ReturnRouteResultResponse): ReturnRoute => {
  const currentDay =
    route.days.find((day) => day.dayNumber === route.currentDayNumber) ?? route.days[0];

  return {
    routeId: route.routeId,
    currentCity: mapApiCity(route.departureCity),
    destinationCity: mapApiCity(route.currentArrivalCity),
    currentSleep: {
      bedtime: formatApiTime(currentDay?.currentBedtime, '03:00'),
      waketime: formatApiTime(currentDay?.currentWaketime, '10:00'),
    },
    targetSleep: {
      bedtime: formatApiTime(currentDay?.targetBedtime, '14:30'),
      waketime: formatApiTime(currentDay?.targetWaketime, '09:30'),
    },
    dailyAdjustMinutes: route.dailyAdjustMinutes,
    durationDays: route.durationDays,
    departureDate: new Date().toISOString().slice(0, 10),
  };
};

export const getBoardingPassView = (boardingPass?: CurrentBoardingPassResponse) => ({
  date: boardingPass?.boardingDate ?? '2026-07-10',
  departureCity: boardingPass ? mapApiCity(boardingPass.departureCity) : undefined,
  arrivalCity: boardingPass ? mapApiCity(boardingPass.arrivalCity) : undefined,
  currentBedtime: formatApiTime(boardingPass?.currentBedtime, '03:00'),
  currentWaketime: formatApiTime(boardingPass?.currentWaketime, '10:00'),
  targetBedtime: formatApiTime(boardingPass?.targetBedtime, '14:30'),
  targetWaketime: formatApiTime(boardingPass?.targetWaketime, '09:30'),
  caffeineCutoffTime: formatApiTime(boardingPass?.caffeineCutoffTime, '18:30'),
  sleepPrepTime: formatApiTime(boardingPass?.sleepPrepTime, '01:30'),
  bedtimeWindowStart: formatApiTime(boardingPass?.bedtimeWindowStart, '02:10'),
  bedtimeWindowEnd: formatApiTime(boardingPass?.bedtimeWindowEnd, '02:40'),
  dayNumber: boardingPass?.dayNumber ?? 1,
});
