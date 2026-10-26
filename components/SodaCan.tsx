"use client";

import { useGLTF, useTexture } from "@react-three/drei";
import { useLayoutEffect } from "react";
import * as THREE from "three";

const flavorTextures = {
  lemonLime: "/labels/lemon-lime.png",
  grape: "/labels/grape.png",
  blackCherry: "/labels/cherry.png",
  strawberryLemonade: "/labels/strawberry.png",
  watermelon: "/labels/watermelon.png",
};
const metalMaterial = new THREE.MeshStandardMaterial({
  roughness: 0.3,
  metalness: 1,
  color: "#bbbbbb",
});
export type SodaCanProps = {
  flavor?: keyof typeof flavorTextures;
  scale?: number;
};

export function SodaCan({ flavor = "blackCherry", scale = 2 }: SodaCanProps) {
  const { nodes } = useGLTF("/Soda-can.gltf", "/draco/");
  const label = useTexture(flavorTextures[flavor]);
  useLayoutEffect(() => {
    label.flipY = false;
    label.colorSpace = THREE.SRGBColorSpace;
    label.needsUpdate = true;
  }, [label]);
  return (
    <group dispose={null} scale={scale} rotation={[0, -Math.PI, 0]}>
      <mesh
        geometry={(nodes.cylinder as THREE.Mesh).geometry}
        material={metalMaterial}
      />
      <mesh geometry={(nodes.cylinder_1 as THREE.Mesh).geometry}>
        <meshStandardMaterial roughness={0.32} metalness={0.35} map={label} />
      </mesh>
      <mesh
        geometry={(nodes.Tab as THREE.Mesh).geometry}
        material={metalMaterial}
      />
    </group>
  );
}
