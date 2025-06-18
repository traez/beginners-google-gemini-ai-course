// src/store/index.ts
import { createStore } from "zustand/vanilla";
import { devtools, persist } from "zustand/middleware";
import { createGeminiSlice, GeminiSliceType } from "./slices/geminiSlice";

export type BoundStoreType = GeminiSliceType;

export const createBoundStore = () => {
  const store = createStore<BoundStoreType>()(
    persist(
      devtools((set, get, store) => ({
        ...createGeminiSlice(set, get, store),
      })),
      {
        name: "bound-store",
        partialize: (state) => ({
          sessionId: state.sessionId,
        }),
      }
    )
  );

  return store;
};
