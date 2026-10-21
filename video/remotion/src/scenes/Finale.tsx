import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {CameraMotionBlur} from '@remotion/motion-blur';
import {useThree} from '@react-three/fiber';
import {clamp, color, ease} from '../brand';
import {useLayout} from '../layout';
import {Car} from '../three/Car';
import {Exhaust, StudioFloor, StudioLights} from '../three/Studio';
import {Grass, NIGHT, Sky} from '../three/Meadow';

// Beat 11 (1:02–1:13): ignition and lift-off in the studio, a dive through a tunnel of lime sketch rings,
// then the car bursts out into a moonlit meadow and crosses the moon in silhouette.
export const T_FINALE = {ignite: 14, lift: 34, tunnel: 120, burst: 220, end: 330};

const NOZZLES: [number, number, number][] = [
  [-1.3, 0.32, 0.86],
  [-1.3, 0.32, -0.86],
  [1.25, 0.32, 0.86],
  [1.25, 0.32, -0.86],
];

// The meadow camera, shared with the end card so the cut is seamless.
export const MEADOW_CAM = {pos: [0, 1.3, 10] as [number, number, number]};
// Moon sits upper-right so the tagline never lands on it; tighter in for portrait frames.
export const moonFor = (portrait: boolean): [number, number, number] => (portrait ? [9, 30, -80] : [22, 22, -80]);

export const Finale: React.FC<{t?: typeof T_FINALE; blur?: boolean}> = ({t = T_FINALE, blur = true}) => {
  const frame = useCurrentFrame();
  const scene = <FinaleScene t={t} />;
  // Motion blur renders the 3D scene once per sample, so only pay for it on the fastest moves.
  const useBlur = blur && frame >= t.burst + 4 && frame <= t.end - 10;
  const flash = interpolate(frame, [t.burst - 6, t.burst, t.burst + 10], [0, 1, 0], clamp);
  return (
    <AbsoluteFill style={{background: color.ink}}>
      {useBlur ? (
        <CameraMotionBlur shutterAngle={160} samples={5}>
          {scene}
        </CameraMotionBlur>
      ) : (
        scene
      )}
      <AbsoluteFill style={{background: `radial-gradient(circle at 50% 50%, #ffffff, ${color.lime})`, opacity: flash * 0.85}} />
    </AbsoluteFill>
  );
};

const FinaleScene: React.FC<{t: typeof T_FINALE}> = ({t}) => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const meadow = frame >= t.burst;
  const thrust = interpolate(frame, [t.ignite, t.ignite + 6, t.ignite + 10, t.ignite + 22], [0, 1, 0.55, 1], clamp);
  const flicker = 0.9 + 0.1 * Math.sin(frame * 1.7) * Math.sin(frame * 0.63);
  const lift = interpolate(frame, [t.lift, t.lift + 60], [0, 1.4], {...clamp, easing: ease.inOutQuint});
  const fly = interpolate(frame, [t.tunnel - 20, t.burst], [0, 28], {...clamp, easing: ease.inExpo});
  const bank = Math.sin(interpolate(frame, [t.tunnel, t.burst], [0, Math.PI * 2], clamp)) * 0.14;
  const floor = interpolate(frame, [t.tunnel - 10, t.tunnel + 20], [1, 0], clamp);

  // Meadow flight: left to right, crossing the moon's disc (at z=-20 the camera->moon line is 1/3 of the way).
  const moon = moonFor(L.portrait);
  const cross = {x: moon[0] / 3, y: MEADOW_CAM.pos[1] + (moon[1] - MEADOW_CAM.pos[1]) / 3};
  const k = interpolate(frame, [t.burst, t.end], [0, 1], {...clamp, easing: ease.inOutSine});
  const mx = cross.x + (k - 0.55) * 52;
  const my = cross.y + (k - 0.55) * 4.5;
  return (
    <AbsoluteFill style={{background: color.ink}}>
      <ThreeCanvas width={L.width} height={L.height} camera={{fov: L.portrait ? 50 : 34, position: [0, 1, 8], far: 400}}>
        {meadow ? (
          <>
            <fog attach="fog" args={[NIGHT.fog, 18, 120]} />
            <ambientLight intensity={0.25} color="#9FB3E0" />
            <directionalLight position={[0, 14, -80]} intensity={1.6} color="#DDE6FF" />
            <MeadowCamera />
            <Sky frame={frame} moonPos={moon} moonSize={7} />
            <Grass frame={frame} center={[0, -6]} radius={30} />
            <group position={[mx, my, -20]} rotation={[0, 0, 0.08]}>
              <Car variant="fly" thrust={flicker} />
              <Exhaust origins={NOZZLES} frame={frame} strength={flicker * 1.3} />
            </group>
          </>
        ) : (
          <>
            <color attach="background" args={[color.ink]} />
            <fog attach="fog" args={[color.ink, 10, 34]} />
            <StudioCamera t={t} fly={fly} lift={lift} portrait={L.portrait} />
            <StudioLights sweep={interpolate(frame, [0, t.burst], [0, 1])} lime={0.2 + thrust * 0.6} />
            <StudioFloor opacity={floor} />
            <group position={[fly, lift, 0]} rotation={[bank, 0, -bank * 0.3]}>
              <Car variant="fly" thrust={thrust * flicker} />
              <Exhaust origins={NOZZLES} frame={frame} strength={thrust * flicker * (1 + lift * 0.3)} />
            </group>
            <RingTunnel start={6} count={7} gap={3.4} frame={frame} t={t} />
          </>
        )}
      </ThreeCanvas>
    </AbsoluteFill>
  );
};

// Hand-drawn-looking lime rings the car threads through: the sketch line, now in 3D.
const RingTunnel: React.FC<{start: number; count: number; gap: number; frame: number; t: typeof T_FINALE}> = ({
  start,
  count,
  gap,
  frame,
  t,
}) => (
  <>
    {Array.from({length: count}, (_, i) => {
      const draw = interpolate(frame, [t.tunnel - 40 + i * 6, t.tunnel - 10 + i * 6], [0.001, Math.PI * 2], {...clamp, easing: ease.outExpo});
      return (
        <mesh key={i} position={[start + i * gap, 2.0, 0]} rotation={[0, Math.PI / 2, i * 0.7]}>
          <torusGeometry args={[1.9 + (i % 2) * 0.12, 0.022, 8, 96, draw]} />
          <meshBasicMaterial color={color.lime} toneMapped={false} />
        </mesh>
      );
    })}
  </>
);

const StudioCamera: React.FC<{t: typeof T_FINALE; fly: number; lift: number; portrait: boolean}> = ({t, fly, lift, portrait}) => {
  const frame = useCurrentFrame();
  const camera = useThree((s) => s.camera);
  const d = portrait ? 1.3 : 1;
  if (frame < t.tunnel) {
    // Low orbit around the hovering car.
    const a = interpolate(frame, [0, t.tunnel], [0.5, -0.55], {...clamp, easing: ease.inOutSine});
    const r = interpolate(frame, [0, t.tunnel], [7.2, 6.2], clamp) * d;
    camera.position.set(Math.sin(a) * r, 0.7 + lift * 0.4, Math.cos(a) * r);
    camera.lookAt(0, 0.5 + lift * 0.85, 0);
  } else {
    // Chase cam: behind and above, looking down the tunnel.
    const p = interpolate(frame, [t.tunnel, t.burst], [0, 1], {...clamp, easing: ease.inOutSine});
    camera.position.set(fly - 6.5 * d + p * 1.5, lift + 1.4 - p * 0.4, 2.2 - p * 2.2);
    camera.lookAt(fly + 3, lift + 0.4, 0);
  }
  return null;
};

export const MeadowCamera: React.FC<{push?: number}> = ({push = 0}) => {
  const camera = useThree((s) => s.camera);
  camera.position.set(MEADOW_CAM.pos[0], MEADOW_CAM.pos[1], MEADOW_CAM.pos[2] - push);
  camera.lookAt(0, 7, -40);
  return null;
};
