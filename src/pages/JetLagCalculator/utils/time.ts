const MINUTES_PER_HOUR = 60;

export const parseKoreanTime = (label: string): number => {
  const match = label.match(/(오전|오후)\s*(\d{1,2}):(\d{2})/);
  if (!match) return 0;
  const [, period, hourString, minuteString] = match;
  let hour = parseInt(hourString, 10) % 12;
  if (period === '오후') hour += 12;
  return hour * MINUTES_PER_HOUR + parseInt(minuteString, 10);
};

// "오전 3:00" -> "03:00"
export const toApiTimeFormat = (label: string): string => {
  const totalMinutes = parseKoreanTime(label);
  const hour = Math.floor(totalMinutes / MINUTES_PER_HOUR);
  const minute = totalMinutes % MINUTES_PER_HOUR;
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
};
