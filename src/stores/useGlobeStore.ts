import { create } from 'zustand';

interface GlobeState {
  isReady: boolean;
  setReady: (ready: boolean) => void;

  focusLat: number;
  focusLng: number;
  altitude: number;
  setFocus: (lat: number, lng: number, altitude?: number) => void;

  reset: () => void;
}

const initialState = {
  isReady: false,
  focusLat: 15,
  focusLng: 10,
  altitude: 1.2,
};

export const useGlobeStore = create<GlobeState>((set) => ({
  ...initialState,

  setReady: (ready) => set({ isReady: ready }),

  setFocus: (lat, lng, altitude) =>
    set((state) => ({
      focusLat: lat,
      focusLng: lng,
      altitude: altitude ?? state.altitude,
    })),

  reset: () => set(initialState),
}));
