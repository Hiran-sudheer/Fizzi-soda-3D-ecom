"use client";

import { forwardRef, type ReactNode } from "react";
import { Float } from "@react-three/drei";
import { type ThreeElements } from "@react-three/fiber";
import { type Group } from "three";
import { SodaCan, type SodaCanProps } from "@/components/SodaCan";

type FloatingCanProps = Omit<ThreeElements["group"], "ref" | "scale"> & {
  flavor?: SodaCanProps["flavor"];
  scale?: number;
  floatSpeed?: number;
  rotationIntensity?: number;
  floatIntensity?: number;
  floatingRange?: [number, number];
  children?: ReactNode;
};
const FloatingCan = forwardRef<Group, FloatingCanProps>(
  (
    {
      flavor = "blackCherry",
      scale = 2,
      floatSpeed = 1.5,
      rotationIntensity = 1,
      floatIntensity = 1,
      floatingRange = [-0.1, 0.1],
      children,
      ...props
    },
    ref,
  ) => (
    <group ref={ref} {...props}>
      <Float
        speed={floatSpeed}
        rotationIntensity={rotationIntensity}
        floatIntensity={floatIntensity}
        floatingRange={floatingRange}
      >
        {children}
        <SodaCan flavor={flavor} scale={scale} />
      </Float>
    </group>
  ),
);
FloatingCan.displayName = "FloatingCan";
export default FloatingCan;
