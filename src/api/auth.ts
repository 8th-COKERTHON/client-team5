import { ApiError, apiRequest } from '@/api/client';

export { ApiError };

interface City {
  countryName: string;
  cityNameKr: string;
  cityNameEn: string;
  airportCode: string;
  latitude: number;
  longitude: number;
}

export interface SignupRequest {
  id: string;
  password: string;
  nickname: string;
}

export interface SignupResponse {
  memberId: number;
  id: string;
  nickname: string;
  city: City;
  jetlagMinutes: number;
  jetlagLabel: string;
  direction: string;
  lastRecordedAt: string;
}

export interface LoginRequest {
  id: string;
  password: string;
}

export interface LoginResponse {
  grantType: string;
  accessToken: string;
}

const postAuth = async <TRequest, TResponse>(
  path: string,
  body: TRequest,
): Promise<TResponse> => {
  return apiRequest<TResponse>(path, {
    method: 'POST',
    body: JSON.stringify(body),
  });
};

export const signup = async (body: SignupRequest) => {
  return postAuth<SignupRequest, SignupResponse>('/api/auth/signup', body);
};

export const login = async (body: LoginRequest) => {
  return postAuth<LoginRequest, LoginResponse>('/api/auth/login', body);
};
