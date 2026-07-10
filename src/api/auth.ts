const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface ApiResponse<TData> {
  success: boolean;
  message: string;
  data: TData;
}

interface ApiErrorResponse {
  success?: boolean;
  message?: string;
  code?: string;
}

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

export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

const parseErrorResponse = async (response: Response) => {
  try {
    return (await response.json()) as ApiErrorResponse;
  } catch {
    return null;
  }
};

const postAuth = async <TRequest, TResponse>(
  path: string,
  body: TRequest,
): Promise<TResponse> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorResponse = await parseErrorResponse(response);

    throw new ApiError(
      errorResponse?.message ?? '요청을 처리하지 못했어요.',
      response.status,
      errorResponse?.code,
    );
  }

  const result = (await response.json()) as ApiResponse<TResponse>;

  return result.data;
};

export const signup = async (body: SignupRequest) => {
  return postAuth<SignupRequest, SignupResponse>('/api/auth/signup', body);
};

export const login = async (body: LoginRequest) => {
  return postAuth<LoginRequest, LoginResponse>('/api/auth/login', body);
};
