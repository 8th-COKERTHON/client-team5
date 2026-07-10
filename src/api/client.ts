const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { getOrCreateDeviceId } from '../utils/devideId';

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

export const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};

export const getAuthorizationHeader = (): HeadersInit => {
  const accessToken = getAccessToken();

  if (!accessToken) {
    return {};
  }

  return {
    Authorization: `Bearer ${accessToken}`,
  };
};

const getRequestHeaders = (headers?: HeadersInit) => {
  const requestHeaders = new Headers(headers);

  if (!requestHeaders.has('Content-Type')) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  return requestHeaders;
};

export const apiRequest = async <TResponse>(
  path: string,
  options: RequestInit = {},
): Promise<TResponse> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: getRequestHeaders(options.headers),
  });

  if (!response.ok) {
    const errorResponse = await parseErrorResponse(response);

    throw new ApiError(
      errorResponse?.message ?? '요청을 처리하지 못했습니다.',
      response.status,
      errorResponse?.code,
    );
  }

  const result = (await response.json()) as ApiResponse<TResponse>;

  return result.data;
};

export const authorizedApiRequest = async <TResponse>(
  path: string,
  options: RequestInit = {},
): Promise<TResponse> => {
  const headers = getRequestHeaders(options.headers);
  const authorizationHeader = new Headers(getAuthorizationHeader());
  const authorizationValue = authorizationHeader.get('Authorization');

  if (authorizationValue) {
    headers.set('Authorization', authorizationValue);
  }

  return apiRequest<TResponse>(path, {
    ...options,
    headers,
  });
};

export const apiRequestWithGuestFallback = async <TResponse>(
  path: string,
  options: RequestInit = {},
): Promise<TResponse> => {
  const headers = getRequestHeaders(options.headers);
  const accessToken = getAccessToken();

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  } else {
    headers.set('X-Device-Id', getOrCreateDeviceId());
  }

  return apiRequest<TResponse>(path, {
    ...options,
    headers,
  });
};
