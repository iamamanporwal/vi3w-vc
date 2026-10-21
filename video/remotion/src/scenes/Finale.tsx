import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {CameraMotionBlur} from '@remotion/motion-blur';
import {useThree} from '@react-three/fiber';
import {clamp, color, ease} from '../brand';
import {useLayout} from '../layout';
import {Backdrop} from '../components/Backdrop';
import {Car} from '../three/Car';
import {Exhaust, StudioFloor, StudioLights} from '../three/Studio';

// Beat 11 (1:02–1:13): ignition, lift-off, a dive through a tunnel of lime sketch rings, and a pass-by.
export const T_FINALE = {ignite: 14, lift: 34, tunnel: 140, pass: 262, hero: 296, end: 330};

const NOZZLES: [number, number, number][] = [
  [-1.3, 0.32, 0.86],
  [-1.3, 0.32, -0.86],
  [1.25, 0.32, 0.86],
  [1.25, 0.32, -0.86],
];

export const Finale: React.FC<{t?: typeof T_FINALE; blur?: boolean}> = ({t = T_FINALE, blur = true}) => {
  const L = useLayout();
  const frame = useCurrentFrame();
  const scene = <FinaleScene t={t} />;
  // Motion blur renders the 3D scene once per sample, so only pay for it on the fast pass-by.
  const useBlur = blur && frame >= t.pass - 6 && frame <= t.pass + 30;
  return (
    <Backdrop glowAt={[50, 70]} glowOpacity={0.7}>
      <AbsoluteFill>
        {useBlur ? (
          <CameraMotionBlur shutterAngle={180} samples={6}>
            {scene}
          </CameraMotionBlur>
        ) : (
          scene
        )}
      </AbsoluteFill>
      <FlashOut t={t} portrait={L.portrait} />
    </Backdrop>
  );
};

const FinaleScene: React.FC<{t: typeof T_FINALE}> = ({t}) => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const thrust = interpolate(frame, [t.ignite, t.ignite + 6, t.ignite + 10, t.ignite + 22], [0, 1, 0.55, 1], clamp);
  const flicker = 0.9 + 0.1 * Math.sin(frame * 1.7) * Math.sin(frame * 0.63);
  const lift = interpolate(frame, [t.lift, t.lift + 60], [0, 1.4], {...clamp, easing: ease.inOutQuint});
  // Forward flight through the ring tunnel (car travels along +x).
  const fly = interpolate(frame, [t.tunnel - 20, t.pass + 20], [0, 34], {...clamp, easing: ease.inOutSine});
  const bank = Math.sin(interpolate(frame, [t.tunnel, t.pass], [0, Math.PI * 2], clamp)) * 0.14;
  const floor = interpolate(frame, [t.tunnel - 10, t.tunnel + 20], [1, 0], clamp);
  return (
    <AbsoluteFill style={{background: color.ink}}>
      <ThreeCanvas width={L.width} height={L.height} camera={{fov: L.portrait ? 44 : 32, position: [0, 1, 8]}}>
        <color attach="background" args={[color.ink]} />
        <fog attach="fog" args={[color.ink, 10, 34]} />
        <FinaleCamera t={t} fly={fly} lift={lift} portrait={L.portrait} />
        <StudioLights sweep={interpolate(frame, [0, t.end], [0, 1])} lime={0.2 + thrust * 0.6} />
        <StudioFloor opacity={floor} />
        <group position={[fly, lift, 0]} rotation={[bank, 0, -bank * 0.3]}>
          <Car variant="fly" thrust={thrust * flicker} />
          <Exhaust origins={NOZZLES} frame={frame} strength={thrust * flicker * (1 + lift * 0.3)} />
        </group>
        <RingTunnel start={6} count={9} gap={3.4} frame={frame} t={t} />
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

const FinaleCamera: React.FC<{t: typeof T_FINALE; fly: number; lift: number; portrait: boolean}> = ({t, fly, lift, portrait}) => {
  const frame = useCurrentFrame();
  const camera = useThree((s) => s.camera);
  const d = portrait ? 1.3 : 1;
  if (frame < t.tunnel) {
    // Low orbit around the hovering car.
    const a = interpolate(frame, [0, t.tunnel], [0.5, -0.55], {...clamp, easing: ease.inOutSine});
    const r = interpolate(frame, [0, t.tunnel], [7.2, 6.2], clamp) * d;
    camera.position.set(Math.sin(a) * r, 0.7 + lift * 0.4, Math.cos(a) * r);
    camera.lookAt(0, 0.5 + lift * 0.85, 0);
  } else if (frame < t.pass) {
    // Chase cam: behind and above, looking down the tunnel.
    const p = interpolate(frame, [t.tunnel, t.pass], [0, 1], {...clamp, easing: ease.inOutSine});
    camera.position.set(fly - 6.5 * d + p * 1.5, lift + 1.4 - p * 0.4, 2.2 - p * 2.2);
    camera.lookAt(fly + 3, lift + 0.4, 0);
  } else {
    // Locked camera ahead of the car: it rushes past, then we settle on a hero hover.
    const p = interpolate(frame, [t.pass, t.end], [0, 1], {...clamp, easing: ease.outExpo});
    camera.position.set(fly + 5 - p * 2, lift + 0.6, 4.2 * d);
    camera.lookAt(fly, lift + 0.4, 0);
  }
  return null;
};

const FlashOut: React.FC<{t: typeof T_FINALE; portrait: boolean}> = ({t}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [t.end - 8, t.end], [0, 1], {...clamp, easing: ease.inExpo});
  return <AbsoluteFill style={{background: color.ink, opacity: o}} />;
};
