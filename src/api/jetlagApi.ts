// src/services/jetlagApi.ts
import { apiRequestWithGuestFallback } from '@/api/client';
import type { JetlagResult } from '../stores/useSleepStore';

export interface JetlagRequest {
  currentBedtime: string;
  currentWaketime: string;
  targetBedtime: string;
  targetWaketime: string;
}

export const fetchJetlagResult = async (body: JetlagRequest): Promise<JetlagResult> => {
  return apiRequestWithGuestFallback<JetlagResult>('/api/sleep/jetlag', {
    method: 'POST',
    body: JSON.stringify(body),
  });
};
