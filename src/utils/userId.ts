const USER_ID_STORAGE_KEY = 'userId';

export const getOrCreateUserId = (): string => {
  const existingUserId = localStorage.getItem(USER_ID_STORAGE_KEY);

  if (existingUserId) {
    return existingUserId;
  }

  const newUserId = crypto.randomUUID();
  localStorage.setItem(USER_ID_STORAGE_KEY, newUserId);
  return newUserId;
};

export const setUserId = (userId: string): void => {
  localStorage.setItem(USER_ID_STORAGE_KEY, userId);
};

export const clearUserId = (): void => {
  localStorage.removeItem(USER_ID_STORAGE_KEY);
};
