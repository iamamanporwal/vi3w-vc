import React, {useMemo} from 'react';
import * as THREE from 'three';

// Night meadow for the finale and end card: gradient sky, deterministic stars, a big moon, swaying grass.
// Everything is a pure function of `frame` so renders never flicker.

const hash = (x: number) => {
  const s = Math.sin(x) * 43758.5453;
  return s - Math.floor(s);
};

export const NIGHT = {
  zenith: '#04060B',
  horizon: '#1B2A45',
  fog: '#0E1626',
  moon: '#F3F0E2',
  grassDark: '#04080A',
  grassTip: '#22341F',
};

const skyMaterial = () =>
  new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    uniforms: {
      zenith: {value: new THREE.Color(NIGHT.zenith)},
      horizon: {value: new THREE.Color(NIGHT.horizon)},
    },
    vertexShader: `varying vec3 vPos; void main(){ vPos = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: `uniform vec3 zenith; uniform vec3 horizon; varying vec3 vPos;
      void main(){ float h = clamp(vPos.y, 0.0, 1.0); vec3 c = mix(horizon, zenith, pow(h, 0.55)); gl_FragColor = vec4(c, 1.0); }`,
  });

const glowMaterial = (c: string, power: number) =>
  new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    fog: false,
    uniforms: {c: {value: new THREE.Color(c)}, power: {value: power}},
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: `uniform vec3 c; uniform float power; varying vec2 vUv;
      void main(){ float d = distance(vUv, vec2(0.5)) * 2.0; float a = pow(clamp(1.0 - d, 0.0, 1.0), power); gl_FragColor = vec4(c * a, a); }`,
  });

export const Sky: React.FC<{frame: number; moonPos?: [number, number, number]; moonSize?: number}> = ({
  frame,
  moonPos = [0, 14, -80],
  moonSize = 9,
}) => {
  const sky = useMemo(skyMaterial, []);
  const halo = useMemo(() => glowMaterial('#C9D6FF', 2.2), []);
  const stars = useMemo(() => {
    const n = 900;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const az = hash(i * 1.37) * Math.PI * 2;
      const el = 0.06 + Math.pow(hash(i * 2.71), 0.7) * 1.45;
      const r = 150;
      pos[i * 3] = Math.cos(az) * Math.cos(el) * r;
      pos[i * 3 + 1] = Math.sin(el) * r;
      pos[i * 3 + 2] = Math.sin(az) * Math.cos(el) * r;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);
  const twinkle = useMemo(() => new Float32Array(900 * 3), []);
  for (let i = 0; i < 900; i++) {
    const b = 0.35 + 0.65 * hash(i * 9.1) * (0.75 + 0.25 * Math.sin(frame * (0.08 + hash(i) * 0.2) + i));
    twinkle[i * 3] = b;
    twinkle[i * 3 + 1] = b;
    twinkle[i * 3 + 2] = b * 1.05;
  }
  stars.setAttribute('color', new THREE.BufferAttribute(twinkle, 3));
  return (
    <group>
      <mesh material={sky}>
        <sphereGeometry args={[160, 32, 16]} />
      </mesh>
      <points geometry={stars}>
        <pointsMaterial size={0.7} vertexColors sizeAttenuation fog={false} transparent depthWrite={false} />
      </points>
      <group position={moonPos}>
        <mesh>
          <circleGeometry args={[moonSize, 64]} />
          <meshBasicMaterial color={NIGHT.moon} fog={false} toneMapped={false} />
        </mesh>
        <mesh position={[0, 0, -0.1]} material={halo}>
          <planeGeometry args={[moonSize * 5.5, moonSize * 5.5]} />
        </mesh>
      </group>
    </group>
  );
};

// Instanced grass blades; each blade sways with a phase from its position.
export const Grass: React.FC<{frame: number; count?: number; radius?: number; center?: [number, number]}> = ({
  frame,
  count = 7000,
  radius = 28,
  center = [0, 0],
}) => {
  const {geo, mat, base} = useMemo(() => {
    const g = new THREE.BufferGeometry();
    // A tapered blade: 5 verts, bent slightly.
    const v = [-0.035, 0, 0, 0.035, 0, 0, -0.022, 0.45, 0.02, 0.022, 0.45, 0.02, 0, 0.9, 0.08];
    g.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
    const dark = new THREE.Color(NIGHT.grassDark);
    const tip = new THREE.Color(NIGHT.grassTip);
    const mid = dark.clone().lerp(tip, 0.5);
    g.setAttribute('color', new THREE.Float32BufferAttribute([dark, dark, mid, mid, tip].flatMap((c) => [c.r, c.g, c.b]), 3));
    g.setIndex([0, 1, 2, 1, 3, 2, 2, 3, 4]);
    g.computeVertexNormals();
    const m = new THREE.MeshBasicMaterial({vertexColors: true, side: THREE.DoubleSide});
    const b = Array.from({length: count}, (_, i) => {
      const r = Math.sqrt(hash(i * 3.3)) * radius;
      const a = hash(i * 7.9) * Math.PI * 2;
      return {
        x: center[0] + Math.cos(a) * r,
        z: center[1] + Math.sin(a) * r,
        rot: hash(i * 5.1) * Math.PI,
        h: 0.6 + hash(i * 1.9) * 0.9,
      };
    });
    return {geo: g, mat: m, base: b};
  }, [count, radius, center]);
  const mesh = useMemo(() => new THREE.InstancedMesh(geo, mat, count), [geo, mat, count]);
  const o = useMemo(() => new THREE.Object3D(), []);
  base.forEach((b, i) => {
    const sway = Math.sin(frame * 0.06 + b.x * 0.35 + b.z * 0.2) * 0.22 + Math.sin(frame * 0.13 + i) * 0.04;
    o.position.set(b.x, 0, b.z);
    o.rotation.set(sway * 0.6, b.rot, sway);
    o.scale.set(1, b.h, 1);
    o.updateMatrix();
    mesh.setMatrixAt(i, o.matrix);
  });
  mesh.instanceMatrix.needsUpdate = true;
  return (
    <group>
      <primitive object={mesh} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[center[0], -0.01, center[1]]}>
        <circleGeometry args={[radius * 1.6, 48]} />
        <meshBasicMaterial color="#07100B" />
      </mesh>
    </group>
  );
};
