"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getProduct, MAX_QUANTITY, type ProductId } from "@/lib/products";

export type CartItem = { id: ProductId; quantity: number };
type CartState = {
  items: CartItem[];
  open: boolean;
  add: (id: ProductId, quantity?: number) => void;
  update: (id: ProductId, quantity: number) => void;
  setOpen: (open: boolean) => void;
  clear: () => void;
};
export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      open: false,
      add: (id, quantity = 1) =>
        set((state) => {
          if (!getProduct(id) || !Number.isInteger(quantity) || quantity < 1)
            return state;
          const existing = state.items.find((item) => item.id === id);
          return {
            open: true,
            items: existing
              ? state.items.map((item) =>
                  item.id === id
                    ? {
                        ...item,
                        quantity: Math.min(
                          MAX_QUANTITY,
                          item.quantity + quantity,
                        ),
                      }
                    : item,
                )
              : [
                  ...state.items,
                  { id, quantity: Math.min(MAX_QUANTITY, quantity) },
                ],
          };
        }),
      update: (id, quantity) =>
        set((state) =>
          !Number.isFinite(quantity)
            ? state
            : {
                items: state.items.flatMap((item) =>
                  item.id !== id
                    ? [item]
                    : quantity <= 0
                      ? []
                      : [
                          {
                            ...item,
                            quantity: Math.min(
                              MAX_QUANTITY,
                              Math.max(1, Math.trunc(quantity)),
                            ),
                          },
                        ],
                ),
              },
        ),
      setOpen: (open) => set({ open }),
      clear: () => set({ items: [] }),
    }),
    {
      name: "fizzi-cart-v1",
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          try {
            const value = localStorage.getItem(name);
            if (value) JSON.parse(value);
            return value;
          } catch {
            return null;
          }
        },
        setItem: (name, value) => {
          try {
            localStorage.setItem(name, value);
          } catch {
            /* Shopping still works when storage is unavailable. */
          }
        },
        removeItem: (name) => {
          try {
            localStorage.removeItem(name);
          } catch {
            /* Storage may be disabled by the browser. */
          }
        },
      })),
      skipHydration: true,
      partialize: (state) => ({ items: state.items }),
      merge: (persisted, current) => {
        const saved = persisted as { items?: unknown } | undefined;
        const items: CartItem[] = [];
        if (Array.isArray(saved?.items))
          for (const item of saved.items) {
            if (
              item &&
              getProduct(item.id) &&
              Number.isInteger(item.quantity) &&
              item.quantity > 0 &&
              !items.some((entry) => entry.id === item.id)
            ) {
              items.push({
                id: item.id,
                quantity: Math.min(MAX_QUANTITY, item.quantity),
              });
            }
          }
        return { ...current, items };
      },
    },
  ),
);
