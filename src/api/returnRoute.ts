export interface ReturnRouteApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ReturnRouteCityResponse {
  countryName: string;
  cityNameKr: string;
  cityNameEn: string;
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
  status: 'IN_PROGRESS';
  departureCity: ReturnRouteCityResponse;
  currentArrivalCity: ReturnRouteCityResponse;
  days: ReturnRouteDayResponse[];
}

export interface CompleteCurrentSleepResponse {
  routeId: number;
  nextDayNumber: number;
  status: 'IN_PROGRESS';
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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? '';

export const fetchCreateReturnRoute = async (
  resultId: number,
): Promise<ReturnRouteApiResponse<ReturnRouteResultResponse>> => {
  const response = await fetch(`${API_BASE_URL}/api/return-routes/results/${resultId}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to create return route: ${response.status}`);
  }

  return (await response.json()) as ReturnRouteApiResponse<ReturnRouteResultResponse>;
};

export const fetchCompleteCurrentSleep = async (): Promise<
  ReturnRouteApiResponse<CompleteCurrentSleepResponse>
> => {
  const response = await fetch(`${API_BASE_URL}/api/return-routes/current/sleep`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to complete current sleep: ${response.status}`);
  }

  return (await response.json()) as ReturnRouteApiResponse<CompleteCurrentSleepResponse>;
};

export const fetchCurrentReturnRoute = async (): Promise<
  ReturnRouteApiResponse<ReturnRouteResultResponse>
> => {
  const response = await fetch(`${API_BASE_URL}/api/return-routes/current`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load current return route: ${response.status}`);
  }

  return (await response.json()) as ReturnRouteApiResponse<ReturnRouteResultResponse>;
};

export const fetchCurrentBoardingPass = async (): Promise<
  ReturnRouteApiResponse<CurrentBoardingPassResponse>
> => {
  const response = await fetch(`${API_BASE_URL}/api/return-routes/current/boarding-pass`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load current boarding pass: ${response.status}`);
  }

  return (await response.json()) as ReturnRouteApiResponse<CurrentBoardingPassResponse>;
};
