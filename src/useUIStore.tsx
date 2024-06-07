import { create } from "zustand";

export const useUIStore = create<{
  red: number;
  green: number;
  blue: number;
  setRed: (red: number) => void;
  setGreen: (green: number) => void;
  setBlue: (blue: number) => void;
}>((set) => {
  return {
    red: 255,
    green: 0,
    blue: 0,
    setRed: (red: number) => set({ red }),
    setGreen: (green: number) => set({ green }),
    setBlue: (blue: number) => set({ blue }),
  };
});

export const getUIState = () => useUIStore.getState();
