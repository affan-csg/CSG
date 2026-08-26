import { Canvas } from "@react-three/fiber";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import type { Points } from "three";

import { PARTICLE_HEX } from "@/lib/theme-colors";

// PERF: drives rendering at ~30fps instead of the default continuous 60fps
// auto-loop (paired with `frameloop="demand"` on the Canvas below). The
// rotation is slow (0.055 rad/s), so halving the draw-call rate is
// imperceptible while roughly halving WebGL rasterization cost - the
// dominant main-thread cost of this component under CPU throttling.
function ThrottledInvalidate() {
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    const id = window.setInterval(invalidate, 1000 / 30);
    return () => window.clearInterval(id);
  }, [invalidate]);
  return null;
}

function ParticleField() {
  const ref = useRef<Points>(null);

  const positions = useMemo(() => {
    const count = 2000;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const radius = 3.4 + Math.random() * 4.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.55;
      arr[i * 3 + 2] = radius * Math.cos(phi);
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.y = t * 0.055;
    ref.current.rotation.x = Math.sin(t * 0.12) * 0.12;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={positions.length / 3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.027}
        sizeAttenuation
        color={PARTICLE_HEX}
        transparent
        opacity={1}
        depthWrite={false}
      />
    </points>
  );
}

function Ring() {
  const ref = useRef<Points>(null);
  const positions = useMemo(() => {
    const count = 1200;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const a = (i / count) * Math.PI * 2;
      const r = 6.1;
      const spread = 0.6;
      arr[i * 3] = Math.cos(a) * r + (Math.random() - 0.5) * spread;
      arr[i * 3 + 1] = Math.sin(a) * r * 0.35 + (Math.random() - 0.5) * spread * 0.5;
      arr[i * 3 + 2] = Math.sin(a * 3) * 0.9 + (Math.random() - 0.5) * spread;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = state.clock.getElapsedTime() * 0.15;
  });

  return (
    <points ref={ref} rotation={[0.5, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={positions.length / 3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        sizeAttenuation
        color="#a8cfff"
        transparent
        opacity={1}
        depthWrite={false}
      />
    </points>
  );
}

export default function HeroCanvas({ showRing = true }: { showRing?: boolean }) {
  return (
    <Canvas
      frameloop="demand"
      // PERF: capped at 1x (was up to 1.75x) - retina/high-DPI screens render
      // this slightly less crisp, but pixel-fill cost drops ~3x.
      dpr={1}
      camera={{ position: [0, 0, 10], fov: 45 }}
      gl={
        // clearColor isn't in @react-three/fiber's GLProps type, but three.js's
        // WebGLRenderer accepts it at runtime — cast bypasses the excess-property check.
        {
          // PERF: antialiasing is typically the single most expensive WebGL
          // setting (especially under software rendering) - disabled since
          // these are small, soft, glowing points where the smoothing isn't
          // meaningfully visible.
          antialias: false,
          alpha: true,
          clearColor: "#0f172a",
        } as unknown as Exclude<React.ComponentProps<typeof Canvas>["gl"], undefined>
      }
      style={{ pointerEvents: "none" }}
    >
      <ThrottledInvalidate />
      <ParticleField />
      {showRing && <Ring />}
    </Canvas>
  );
}
