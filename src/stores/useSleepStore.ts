import { create } from 'zustand';

const DEFAULT_SLEEP_TIME = '오전 3:00';
const DEFAULT_WAKE_TIME = '오전 10:00';
const DEFAULT_DESIRED_SLEEP_TIME = '오후 11:00';
const DEFAULT_DESIRED_WAKE_TIME = '오전 7:00';

export interface JetlagCity {
  countryName: string;
  cityNameKr: string;
  cityNameEn: string;
  airportCode: string;
  latitude: number;
  longitude: number;
}

export interface JetlagSleepInfo {
  bedtime: string;
  waketime: string;
  sleepMinutes: number;
}

export interface JetlagResult {
  resultId: number;
  from: JetlagCity;
  to: JetlagCity;
  currentSleep: JetlagSleepInfo;
  targetSleep: JetlagSleepInfo;
  jetlagMinutes: number;
  jetlagLabel: string;
  direction: 'EAST' | 'WEST';
  resultDate: string;
}

interface SleepState {
  sleepTime: string;
  wakeTime: string;
  desiredSleepTime: string;
  desiredWakeTime: string;
  jetlagResult: JetlagResult | null;
  setSleepTime: (sleepTime: string) => void;
  setWakeTime: (wakeTime: string) => void;
  setDesiredSleepTime: (desiredSleepTime: string) => void;
  setDesiredWakeTime: (desiredWakeTime: string) => void;
  setJetlagResult: (result: JetlagResult) => void;
  resetSleepState: () => void;
}

export const useSleepStore = create<SleepState>((set) => ({
  sleepTime: DEFAULT_SLEEP_TIME,
  wakeTime: DEFAULT_WAKE_TIME,
  desiredSleepTime: DEFAULT_DESIRED_SLEEP_TIME,
  desiredWakeTime: DEFAULT_DESIRED_WAKE_TIME,
  jetlagResult: null,
  setSleepTime: (sleepTime) => set({ sleepTime }),
  setWakeTime: (wakeTime) => set({ wakeTime }),
  setDesiredSleepTime: (desiredSleepTime) => set({ desiredSleepTime }),
  setDesiredWakeTime: (desiredWakeTime) => set({ desiredWakeTime }),
  setJetlagResult: (jetlagResult) => set({ jetlagResult }),
  resetSleepState: () =>
    set({
      sleepTime: DEFAULT_SLEEP_TIME,
      wakeTime: DEFAULT_WAKE_TIME,
      desiredSleepTime: DEFAULT_DESIRED_SLEEP_TIME,
      desiredWakeTime: DEFAULT_DESIRED_WAKE_TIME,
      jetlagResult: null,
    }),
}));
