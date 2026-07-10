import type { ReturnRoute } from '../types';
import { FLAG_URLS } from './flagUrls';

export const MOCK_RETURN_ROUTE: ReturnRoute = {
  routeId: 301,
  currentCity: {
    cityNameKo: '인도 뉴델리',
    cityNameEn: 'NEW DELHI',
    airportCode: 'DEL',
    flagUrl: FLAG_URLS.india,
  },
  destinationCity: {
    cityNameKo: '대한민국 서울',
    cityNameEn: 'SEOUL',
    airportCode: 'ICN',
    flagUrl: FLAG_URLS.korea,
  },
  currentSleep: { bedtime: '03:00', waketime: '10:00' },
  targetSleep: { bedtime: '23:00', waketime: '07:00' },
  dailyAdjustMinutes: 30,
  durationDays: 8,
  departureDate: '2026-07-10',
};
