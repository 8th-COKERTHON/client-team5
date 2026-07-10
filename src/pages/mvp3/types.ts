export interface SleepTime {
  bedtime: string;
  waketime: string;
}

export interface City {
  cityNameKo: string;
  cityNameEn: string;
  airportCode: string;
  flagUrl: string;
}

export interface ReturnRoute {
  routeId: number;
  currentCity: City;
  destinationCity: City;
  currentSleep: SleepTime;
  targetSleep: SleepTime;
  dailyAdjustMinutes: number;
  durationDays: number;
  departureDate: string;
}
