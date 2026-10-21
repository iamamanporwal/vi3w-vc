import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {clamp, color, ease, font} from '../brand';
import {useLayout} from '../layout';
import {Grain, Vignette} from '../components/Backdrop';
import {Kinetic} from '../components/Kinetic';
import {Grass, NIGHT, Sky} from '../three/Meadow';
import {MEADOW_CAM, MeadowCamera, moonFor} from './Finale';

// Beat 12 (1:13–1:20): the same moonlit meadow, now still. Zzz. Tagline. Lockup.
export const T_END = {chip: 8, zzz: 20, tag: 40, lock: 128, end: 210};

export const End: React.FC<{t?: typeof T_END; frameOffset?: number}> = ({t = T_END, frameOffset = 330}) => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const {u} = L;
  const push = interpolate(frame, [0, t.end], [0, 2.4], {...clamp, easing: ease.inOutSine});
  const chip = interpolate(frame, [t.chip, t.chip + 14, t.tag - 4, t.tag + 6], [0, 1, 1, 0], {...clamp, easing: ease.outExpo});
  const tagUp = interpolate(frame, [t.lock - 10, t.lock + 16], [0, 1], {...clamp, easing: ease.inOutQuint});
  const lock = interpolate(frame, [t.lock, t.lock + 22], [0, 1], {...clamp, easing: ease.outExpo});
  const cta = interpolate(frame, [t.lock + 16, t.lock + 34], [0, 1], {...clamp, easing: ease.outExpo});
  const scrim = interpolate(frame, [t.tag - 10, t.tag + 20], [0, 0.35], clamp);

  return (
    <AbsoluteFill style={{background: NIGHT.zenith}}>
      <ThreeCanvas width={L.width} height={L.height} camera={{fov: L.portrait ? 50 : 34, position: MEADOW_CAM.pos, far: 400}}>
        <fog attach="fog" args={[NIGHT.fog, 18, 120]} />
        <MeadowCamera push={push} />
        <Sky frame={frame + frameOffset} moonPos={moonFor(L.portrait)} moonSize={7} />
        <Grass frame={frame + frameOffset} center={[0, -6]} radius={30} />
      </ThreeCanvas>
      <AbsoluteFill style={{background: `linear-gradient(to bottom, rgba(4,6,11,${scrim}) 0%, rgba(4,6,11,${scrim * 0.4}) 60%, transparent 100%)`}} />
      <Zzz at={t.zzz} u={u} x={L.width * (L.portrait ? 0.7 : 0.66)} y={L.height * 0.62} />

      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: L.portrait ? L.safe.y + 40 * u : 90 * u,
          translate: `-50% ${(1 - chip) * -20 * u}px`,
          opacity: chip,
          display: 'flex',
          alignItems: 'center',
          gap: 12 * u,
          padding: `${12 * u}px ${22 * u}px`,
          borderRadius: 999,
          background: 'rgba(11,11,12,0.7)',
          border: `1px solid ${color.moss3}`,
          fontFamily: font,
          fontWeight: 600,
          fontSize: 24 * u,
          color: color.bone,
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{color: color.lime, fontWeight: 800}}>✓</span> flying_car.glb exported
        <span style={{color: color.moss}}>· 3:21 AM</span>
      </div>

      {/* Tagline sits in the sky below the moon; the lockup lands on the dark grass line. */}
      <div
        style={{
          position: 'absolute',
          left: L.portrait ? 70 : 220,
          right: L.portrait ? 70 : 220,
          top: L.height * (L.portrait ? 0.4 : 0.42),
          translate: `0 ${-tagUp * 30 * u}px`,
        }}
      >
        <Kinetic text="We built Vi3W so 3D artists can *catch* *more* *sleep.*" at={t.tag} size={(L.portrait ? 96 : 92) * u} align="center" stagger={4} />
      </div>

      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 22 * u,
          justifyContent: 'flex-start',
          paddingTop: L.height * (L.portrait ? 0.6 : 0.64),
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 22 * u, opacity: lock, scale: `${0.9 + 0.1 * lock}`}}>
          <Img src={staticFile('brand/logo.png')} style={{width: 110 * u, height: 110 * u}} />
          <div style={{fontFamily: font, fontWeight: 800, fontSize: 100 * u, letterSpacing: '-0.05em', color: color.bone}}>Vi3W</div>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 * u, opacity: cta, translate: `0 ${(1 - cta) * 16 * u}px`}}>
          <div style={{fontFamily: font, fontWeight: 800, fontSize: 32 * u, color: color.ink, background: color.lime, padding: `${14 * u}px ${30 * u}px`, borderRadius: 999}}>
            Start sketching, free
          </div>
          <div style={{fontFamily: font, fontWeight: 600, fontSize: 30 * u, color: color.bone}}>app.vi3w.in</div>
        </div>
      </AbsoluteFill>
      <Vignette strength={0.6} />
      <Grain opacity={0.06} />
    </AbsoluteFill>
  );
};

// Three drifting z's: the visual "sleep" button.
const Zzz: React.FC<{at: number; u: number; x: number; y: number}> = ({at, u, x, y}) => {
  const frame = useCurrentFrame();
  return (
    <>
      {[0, 1, 2].map((i) => {
        const f = frame - at - i * 14;
        if (f < 0) return null;
        const p = (f % 84) / 84;
        const o = interpolate(p, [0, 0.15, 0.7, 1], [0, 1, 0.8, 0]);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x + Math.sin(p * Math.PI * 2 + i) * 18 * u + i * 26 * u,
              top: y - p * 160 * u - i * 34 * u,
              fontFamily: font,
              fontWeight: 800,
              fontSize: (34 + i * 12) * u,
              color: color.lime,
              opacity: o * 0.9,
              rotate: `${-12 + i * 6}deg`,
              textShadow: `0 0 ${18 * u}px ${color.lime}88`,
            }}
          >
            z
          </div>
        );
      })}
    </>
  );
};
