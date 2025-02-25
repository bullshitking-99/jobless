import { create } from "zustand";
import { memo, useState } from "react";
import { Button, message } from "antd";

interface BearState {
  bears: number;
  cats: number;
  increaseB: (count?: number) => void;
  decreaseB: (count?: number) => void;
  increaseC: (count?: number) => void;
  decreaseC: (count?: number) => void;
  reset: () => void;
}

const useZooStore = create<BearState>((set) => ({
  bears: 0,
  cats: 0,
  increaseB: (count = 1) => set((state) => ({ bears: state.bears + count })),
  decreaseB: (count = 1) =>
    set((state) => ({ bears: Math.max(0, state.bears - count) })),
  increaseC: (count = 1) => set((state) => ({ cats: state.cats + count })),
  decreaseC: (count = 1) =>
    set((state) => ({ cats: Math.max(0, state.cats - count) })),
  reset: () => set({ bears: 0, cats: 0 }),
}));

const Bears = memo(() => {
  const bears = useZooStore((state) => state.bears);
  message.warning("Bears render");

  return (
    <div>
      <h3>Bears: {bears}</h3>
    </div>
  );
});

const Cats = memo(() => {
  const cats = useZooStore((state) => state.cats);
  message.info("Cats render");

  return (
    <div>
      <h3>Cats: {cats}</h3>
    </div>
  );
});

export const Zoo = () => {
  const bearsStore = useZooStore();
  const { increaseB, increaseC, reset } = bearsStore;

  return (
    <div>
      <h2>Zoo</h2>

      <div style={{ display: "flex", gap: "8px" }}>
        <Button type="primary" onClick={() => increaseB()}>
          increaseBears
        </Button>
        <Button type="primary" onClick={() => increaseC()}>
          increaseCats
        </Button>
        <Button onClick={() => reset()}>Reset</Button>
      </div>

      <Bears />
      <Cats />
    </div>
  );
};
