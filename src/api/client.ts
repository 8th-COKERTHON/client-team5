const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { getOrCreateDeviceId } from '../utils/deviceId';
import { getOrCreateUserId, setUserId } from '../utils/userId';

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

// data에 userId가 실려오면 로컬 저장소 값을 서버 확정 값으로 갱신
const syncUserIdFromResponseData = (data: unknown): void => {
  if (data && typeof data === 'object' && 'userId' in data) {
    const responseUserId = (data as { userId?: unknown }).userId;
    if (typeof responseUserId === 'string' && responseUserId.length > 0) {
      setUserId(responseUserId);
    }
  }
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

  syncUserIdFromResponseData(result.data);

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

  // userId는 로그인 여부와 무관하게 항상 전송 (없으면 새로 생성해서 전송)
  headers.set('X-User-Id', getOrCreateUserId());

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
