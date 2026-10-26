"use client";

import { createContext, useContext, type MutableRefObject } from "react";
export type Chapter = "hero" | "sky" | "showcase" | "story";
export type ExperienceState = {
  enabled: boolean;
  reducedMotion: boolean;
  ready: Partial<Record<Chapter, boolean>>;
  markReady: (chapter: Chapter) => void;
  pointer: MutableRefObject<{ x: number; y: number }>;
};
export const ExperienceContext = createContext<ExperienceState | null>(null);
export function useExperience() {
  const context = useContext(ExperienceContext);
  if (!context)
    throw new Error("Experience scenes must be inside the storefront.");
  return context;
}
