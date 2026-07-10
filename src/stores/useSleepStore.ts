import { create } from 'zustand';

const DEFAULT_SLEEP_TIME = '오전 3:00';
const DEFAULT_WAKE_TIME = '오전 10:00';
const DEFAULT_DESIRED_SLEEP_TIME = '오후 11:00';
const DEFAULT_DESIRED_WAKE_TIME = '오전 7:00';

interface SleepState {
  sleepTime: string;
  wakeTime: string;
  desiredSleepTime: string;
  desiredWakeTime: string;
  setSleepTime: (sleepTime: string) => void;
  setWakeTime: (wakeTime: string) => void;
  setDesiredSleepTime: (desiredSleepTime: string) => void;
  setDesiredWakeTime: (desiredWakeTime: string) => void;
  resetSleepState: () => void;
}

export const useSleepStore = create<SleepState>((set) => ({
  sleepTime: DEFAULT_SLEEP_TIME,
  wakeTime: DEFAULT_WAKE_TIME,
  desiredSleepTime: DEFAULT_DESIRED_SLEEP_TIME,
  desiredWakeTime: DEFAULT_DESIRED_WAKE_TIME,
  setSleepTime: (sleepTime) => set({ sleepTime }),
  setWakeTime: (wakeTime) => set({ wakeTime }),
  setDesiredSleepTime: (desiredSleepTime) => set({ desiredSleepTime }),
  setDesiredWakeTime: (desiredWakeTime) => set({ desiredWakeTime }),
  resetSleepState: () =>
    set({
      sleepTime: DEFAULT_SLEEP_TIME,
      wakeTime: DEFAULT_WAKE_TIME,
      desiredSleepTime: DEFAULT_DESIRED_SLEEP_TIME,
      desiredWakeTime: DEFAULT_DESIRED_WAKE_TIME,
    }),
}));
