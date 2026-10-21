import React, {useMemo} from 'react';
import * as THREE from 'three';
import {color} from '../brand';

// Look-dev stand-in built from the sketch profile. It exists so lighting, camera and particles can be
// developed before Vi3W's real GLBs are exported. It must be replaced by the real models before release.

const S = 1 / 200; // sketch units -> metres-ish
const X = (x: number) => (x - 510) * S;
const Y = (y: number) => (400 - y) * S;

const lowerBody = () => {
  const s = new THREE.Shape();
  s.moveTo(X(90), Y(330));
  s.lineTo(X(90), Y(285));
  s.bezierCurveTo(X(95), Y(260), X(120), Y(245), X(160), Y(240));
  s.lineTo(X(300), Y(234));
  s.lineTo(X(740), Y(234));
  s.lineTo(X(870), Y(240));
  s.bezierCurveTo(X(905), Y(245), X(925), Y(265), X(930), Y(295));
  s.lineTo(X(930), Y(335));
  s.lineTo(X(830), Y(340));
  s.absarc(X(760), Y(340), 70 * S, 0, Math.PI, false);
  s.lineTo(X(320), Y(340));
  s.absarc(X(250), Y(340), 70 * S, 0, Math.PI, false);
  s.lineTo(X(90), Y(330));
  return s;
};

const glasshouse = () => {
  const s = new THREE.Shape();
  s.moveTo(X(296), Y(238));
  s.bezierCurveTo(X(340), Y(180), X(380), Y(150), X(450), Y(145));
  s.lineTo(X(610), Y(145));
  s.bezierCurveTo(X(660), Y(150), X(700), Y(185), X(744), Y(238));
  s.lineTo(X(296), Y(238));
  return s;
};

const extrude = (shape: THREE.Shape, depth: number, bevel: number) => {
  const g = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel * 0.8,
    bevelSegments: 8,
    curveSegments: 32,
  });
  g.translate(0, 0, -depth / 2);
  g.computeVertexNormals();
  return g;
};

export type CarVariant = 'sedan' | 'sport' | 'fly';

export const ProxyCar: React.FC<{
  variant: CarVariant;
  wire?: number; // 0 = solid, 1 = lime wireframe
  thrust?: number; // 0..1 thruster glow
}> = ({variant, wire = 0, thrust = 0}) => {
  const body = useMemo(() => extrude(lowerBody(), 1.55, 0.14), []);
  const glass = useMemo(() => extrude(glasshouse(), 1.3, 0.1), []);
  const paint = variant === 'sedan' ? '#9AA0A6' : '#24282C';
  const solid = 1 - wire;
  const Paint = (
    <meshPhysicalMaterial color={paint} metalness={0.6} roughness={0.28} clearcoat={1} clearcoatRoughness={0.06} transparent opacity={solid} />
  );
  const Wire = <meshBasicMaterial color={color.lime} wireframe transparent opacity={wire} />;
  return (
    <group>
      <mesh geometry={body}>{Paint}</mesh>
      <mesh geometry={glass}>
        <meshPhysicalMaterial color="#0A0C0E" metalness={0.2} roughness={0.04} clearcoat={1} transparent opacity={solid} />
      </mesh>
      {wire > 0 && (
        <>
          <mesh geometry={body}>{Wire}</mesh>
          <mesh geometry={glass}>{Wire}</mesh>
        </>
      )}
      {variant !== 'sedan' && <SportKit solid={solid} />}
      {[X(250), X(760)].flatMap((x) =>
        [-0.86, 0.86].map((z) =>
          variant === 'fly' ? (
            <Thruster key={`${x}${z}`} position={[x, Y(340) + 0.02, z]} thrust={thrust} solid={solid} />
          ) : (
            <Wheel key={`${x}${z}`} position={[x, Y(340), z]} sport={variant === 'sport'} solid={solid} />
          ),
        ),
      )}
    </group>
  );
};

const SportKit: React.FC<{solid: number}> = ({solid}) => (
  <group>
    {/* Rear wing and struts */}
    <mesh position={[X(166), Y(194), 0]} rotation={[0, 0, 0.04]}>
      <boxGeometry args={[0.72, 0.035, 1.7]} />
      <meshPhysicalMaterial color="#111315" metalness={0.4} roughness={0.35} clearcoat={1} transparent opacity={solid} />
    </mesh>
    {[-0.5, 0.5].map((z) => (
      <mesh key={z} position={[X(170), Y(216), z]}>
        <boxGeometry args={[0.08, 0.2, 0.04]} />
        <meshStandardMaterial color="#111315" transparent opacity={solid} />
      </mesh>
    ))}
    {/* Twin racing stripes over hood, roof and deck */}
    {[-0.16, 0.16].map((z) => (
      <mesh key={z} position={[0, Y(148) + 0.012, z]}>
        <boxGeometry args={[0.85, 0.01, 0.16]} />
        <meshStandardMaterial color={color.bone} roughness={0.3} transparent opacity={solid} />
      </mesh>
    ))}
    {[-0.16, 0.16].map((z) => (
      <mesh key={`h${z}`} position={[X(805), Y(237) + 0.12, z]} rotation={[0, 0, -0.05]}>
        <boxGeometry args={[0.66, 0.01, 0.16]} />
        <meshStandardMaterial color={color.bone} roughness={0.3} transparent opacity={solid} />
      </mesh>
    ))}
    {/* Front splitter */}
    <mesh position={[X(900), Y(345), 0]}>
      <boxGeometry args={[0.45, 0.03, 1.7]} />
      <meshStandardMaterial color="#0E0F10" transparent opacity={solid} />
    </mesh>
  </group>
);

const Wheel: React.FC<{position: [number, number, number]; sport: boolean; solid: number}> = ({position, sport, solid}) => (
  <group position={position} rotation={[Math.PI / 2, 0, 0]}>
    <mesh>
      <cylinderGeometry args={[0.31, 0.31, 0.26, 40]} />
      <meshStandardMaterial color="#0C0C0C" roughness={0.85} transparent opacity={solid} />
    </mesh>
    <mesh position={[0, 0.001, 0]}>
      <cylinderGeometry args={[0.2, 0.2, 0.27, 5]} />
      <meshStandardMaterial
        color={sport ? '#141414' : '#B8BCC0'}
        metalness={0.9}
        roughness={sport ? 0.35 : 0.2}
        transparent
        opacity={solid}
      />
    </mesh>
  </group>
);

const Thruster: React.FC<{position: [number, number, number]; thrust: number; solid: number}> = ({position, thrust, solid}) => (
  <group position={position}>
    <mesh>
      <cylinderGeometry args={[0.3, 0.22, 0.32, 40, 1, true]} />
      <meshPhysicalMaterial color="#1B1E21" metalness={0.95} roughness={0.25} side={THREE.DoubleSide} transparent opacity={solid} />
    </mesh>
    <mesh position={[0, -0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[0.21, 40]} />
      <meshBasicMaterial color={new THREE.Color(color.lime).lerp(new THREE.Color('#ffffff'), 0.35 * thrust)} transparent opacity={0.15 + 0.85 * thrust * solid} />
    </mesh>
    {thrust > 0 && <pointLight position={[0, -0.3, 0]} color={color.lime} intensity={6 * thrust} distance={2.2} />}
  </group>
);
