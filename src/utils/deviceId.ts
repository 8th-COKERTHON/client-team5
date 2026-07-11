// src/utils/deviceId.ts
const DEVICE_ID_STORAGE_KEY = 'deviceId';

export const getOrCreateDeviceId = (): string => {
  const existing = localStorage.getItem(DEVICE_ID_STORAGE_KEY);
  if (existing) return existing;

  const newDeviceId = crypto.randomUUID();
  localStorage.setItem(DEVICE_ID_STORAGE_KEY, newDeviceId);
  return newDeviceId;
};
