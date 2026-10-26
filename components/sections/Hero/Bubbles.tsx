"use client";

import { useRef, useLayoutEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { DynamicDrawUsage, InstancedMesh, Object3D } from "three";
import { useExperience } from "@/components/experience/ExperienceContext";

const transform = new Object3D();
export function Bubbles({
  count = 90,
  speed = 1.5,
  bubbleSize = 0.025,
  opacity = 0.28,
  repeat = true,
}) {
  const mesh = useRef<InstancedMesh>(null);
  const { reducedMotion } = useExperience();
  const speeds = useRef<Float32Array>(new Float32Array(count));
  useLayoutEffect(() => {
    const instance = mesh.current;
    if (!instance) return;
    instance.instanceMatrix.setUsage(DynamicDrawUsage);
    for (let index = 0; index < count; index++) {
      transform.position.set(
        Math.random() * 8 - 4,
        Math.random() * 8 - 4,
        -2 - Math.random() * 3,
      );
      transform.updateMatrix();
      instance.setMatrixAt(index, transform.matrix);
      speeds.current[index] = 0.1 + Math.random() * 0.22;
    }
    instance.instanceMatrix.needsUpdate = true;
  }, [count]);
  useFrame((_, delta) => {
    if (!mesh.current || reducedMotion) return;
    for (let index = 0; index < count; index++) {
      mesh.current.getMatrixAt(index, transform.matrix);
      transform.position.setFromMatrixPosition(transform.matrix);
      transform.position.y +=
        speeds.current[index] * speed * Math.min(delta, 0.05);
      if (transform.position.y > 4 && repeat) transform.position.y = -4;
      transform.updateMatrix();
      mesh.current.setMatrixAt(index, transform.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh
      ref={mesh}
      args={[undefined, undefined, count]}
      frustumCulled={false}
    >
      <sphereGeometry args={[bubbleSize, 8, 8]} />
      <meshBasicMaterial
        color="#ffffff"
        transparent
        opacity={opacity}
        depthWrite={false}
      />
    </instancedMesh>
  );
}
