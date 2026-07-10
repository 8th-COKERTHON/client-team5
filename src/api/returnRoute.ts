import { authorizedApiRequest } from './client';

export interface ReturnRouteCityResponse {
  countryName: string;
  cityNameKr: string;
  cityNameEn: string;
  airportCode: string;
  latitude: number;
  longitude: number;
}

export interface ReturnRouteDayResponse {
  dayNumber: number;
  checkpointCity: ReturnRouteCityResponse;
  currentBedtime: string;
  currentWaketime: string;
  targetBedtime: string;
  targetWaketime: string;
  caffeineCutoffTime: string;
  sleepPrepTime: string;
  bedtimeWindowStart: string;
  bedtimeWindowEnd: string;
}

export interface ReturnRouteResultResponse {
  routeId: number;
  dailyAdjustMinutes: number;
  durationDays: number;
  currentDayNumber: number;
  status: 'IN_PROGRESS' | 'COMPLETED';
  departureCity: ReturnRouteCityResponse;
  currentArrivalCity: ReturnRouteCityResponse;
  days: ReturnRouteDayResponse[];
}

export interface CompleteCurrentSleepResponse {
  routeId: number;
  nextDayNumber: number;
  status: 'IN_PROGRESS' | 'COMPLETED';
  arrivedCity: ReturnRouteCityResponse;
}

export interface CurrentBoardingPassResponse {
  routeId: number;
  dayNumber: number;
  boardingDate: string;
  departureCity: ReturnRouteCityResponse;
  arrivalCity: ReturnRouteCityResponse;
  currentBedtime: string;
  currentWaketime: string;
  targetBedtime: string;
  targetWaketime: string;
  caffeineCutoffTime: string;
  sleepPrepTime: string;
  bedtimeWindowStart: string;
  bedtimeWindowEnd: string;
}

export const fetchCreateReturnRoute = async (
  resultId: number,
): Promise<ReturnRouteResultResponse> =>
  authorizedApiRequest<ReturnRouteResultResponse>(`/api/return-routes/results/${resultId}`, {
    method: 'POST',
  });

export const fetchCompleteCurrentSleep = async (): Promise<CompleteCurrentSleepResponse> =>
  authorizedApiRequest<CompleteCurrentSleepResponse>('/api/return-routes/current/sleep', {
    method: 'POST',
  });

export const fetchCurrentReturnRoute = async (): Promise<ReturnRouteResultResponse> =>
  authorizedApiRequest<ReturnRouteResultResponse>('/api/return-routes/current', {
    method: 'GET',
  });

export const fetchCurrentBoardingPass = async (): Promise<CurrentBoardingPassResponse> =>
  authorizedApiRequest<CurrentBoardingPassResponse>('/api/return-routes/current/boarding-pass', {
    method: 'GET',
  });
