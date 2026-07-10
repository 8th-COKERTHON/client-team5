import { authorizedApiRequest } from '@/api/client';

interface CompanionCity {
  countryName: string;
  cityNameKr: string;
  cityNameEn: string;
  airportCode: string;
  latitude: number;
  longitude: number;
}

export interface Companion {
  companionMemberId: number;
  nickname: string;
  profileImageUrl: string | null;
  city: CompanionCity | null;
  jetlagMinutes: number | null;
  jetlagLabel: string | null;
  direction: string | null;
  lastRecordedAt: string | null;
}

export interface CompanionSearchResult {
  memberId: number;
  loginId: string;
  nickname: string;
  profileImageUrl: string | null;
  alreadyCompanion: boolean;
}

export const fetchCompanions = async () => {
  return authorizedApiRequest<Companion[]>('/api/companions');
};

export const searchCompanion = async (loginId: string) => {
  const searchParams = new URLSearchParams({ loginId });

  return authorizedApiRequest<CompanionSearchResult>(
    `/api/companions/search?${searchParams.toString()}`,
  );
};

export const addCompanion = async (loginId: string) => {
  return authorizedApiRequest<Companion>('/api/companions', {
    method: 'POST',
    body: JSON.stringify({ loginId }),
  });
};

export const deleteCompanion = async (companionMemberId: number) => {
  return authorizedApiRequest<string>(`/api/companions/${companionMemberId}`, {
    method: 'DELETE',
  });
};
