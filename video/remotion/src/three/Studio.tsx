import React, {useMemo} from 'react';
import * as THREE from 'three';
import {ContactShadows, Environment, Lightformer} from '@react-three/drei';
import {color} from '../brand';

// Dark product-studio lighting built only from in-scene light formers (no HDRI downloads).
export const StudioLights: React.FC<{sweep?: number; lime?: number}> = ({sweep = 0, lime = 0.25}) => (
  <>
    <ambientLight intensity={0.15} />
    <directionalLight position={[4, 6, 5]} intensity={1.6} />
    <directionalLight position={[-6, 3, -4]} intensity={1.1} color="#BFD0FF" />
    <Environment resolution={256} frames={1}>
      <color attach="background" args={['#000000']} />
      {/* Soft top box */}
      <Lightformer form="rect" intensity={2.2} position={[0, 6, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[10, 4, 1]} />
      {/* Moving strip light: gives the paint its travelling highlight */}
      <Lightformer form="rect" intensity={6} position={[-8 + sweep * 16, 2, 5]} rotation={[0, Math.PI, 0]} scale={[0.6, 6, 1]} />
      <Lightformer form="rect" intensity={1.6} position={[6, 1.5, -4]} rotation={[0, -Math.PI / 3, 0]} scale={[3, 3, 1]} color="#BFD0FF" />
      <Lightformer form="ring" intensity={lime * 6} position={[-5, 1, 2]} scale={2} color={color.lime} />
    </Environment>
  </>
);

export const StudioFloor: React.FC<{opacity?: number}> = ({opacity = 1}) => (
  <>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]}>
      <circleGeometry args={[14, 64]} />
      <meshStandardMaterial color="#0D0E0F" metalness={0.7} roughness={0.32} transparent opacity={opacity} />
    </mesh>
    <ContactShadows position={[0, 0.002, 0]} opacity={0.85 * opacity} scale={9} blur={2.6} far={2.5} resolution={512} frames={1} />
  </>
);

// Deterministic thruster exhaust: each particle's position is a pure function of (index, frame).
export const Exhaust: React.FC<{
  origins: [number, number, number][];
  frame: number;
  strength: number;
  count?: number;
}> = ({origins, frame, strength, count = 90}) => {
  const geo = useMemo(() => new THREE.BufferGeometry(), []);
  const n = origins.length * count;
  const pos = new Float32Array(n * 3);
  const col = new Float32Array(n * 3);
  const lime = new THREE.Color(color.lime);
  const white = new THREE.Color('#ffffff');
  origins.forEach((o, k) => {
    for (let i = 0; i < count; i++) {
      const idx = k * count + i;
      const seed = hash(idx * 12.9898);
      const life = ((frame * 0.06 + seed) % 1 + 1) % 1; // 0..1 over ~16 frames
      const spread = 0.06 + life * 0.22;
      const a = hash(idx * 78.233) * Math.PI * 2;
      pos[idx * 3] = o[0] + Math.cos(a) * spread * hash(idx * 3.1);
      pos[idx * 3 + 1] = o[1] - 0.12 - life * 1.4 * strength;
      pos[idx * 3 + 2] = o[2] + Math.sin(a) * spread * hash(idx * 7.7);
      const c = white.clone().lerp(lime, Math.min(1, life * 1.6)).multiplyScalar((1 - life) * strength);
      col[idx * 3] = c.r;
      col[idx * 3 + 1] = c.g;
      col[idx * 3 + 2] = c.b;
    }
  });
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  return (
    <points geometry={geo}>
      <pointsMaterial size={0.07} vertexColors transparent blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation />
    </points>
  );
};

const hash = (x: number) => {
  const s = Math.sin(x) * 43758.5453;
  return s - Math.floor(s);
};
