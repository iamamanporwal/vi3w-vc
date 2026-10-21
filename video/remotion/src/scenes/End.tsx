import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {clamp, color, ease, font} from '../brand';
import {useLayout} from '../layout';
import {Backdrop} from '../components/Backdrop';
import {Kinetic} from '../components/Kinetic';

// Beat 12 (1:13–1:20): the quiet room at 3:21 AM, the tagline, the lockup.
export const T_END = {room: 0, tag: 50, lock: 128, end: 210};

export const End: React.FC<{t?: typeof T_END}> = ({t = T_END}) => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const {u} = L;
  const room = interpolate(frame, [t.room, t.room + 14, t.tag - 6, t.tag + 8], [0, 1, 1, 0.12], clamp);
  const dimLights = interpolate(frame, [20, 44], [1, 0.35], {...clamp, easing: ease.inOutSine});
  const tagUp = interpolate(frame, [t.lock - 10, t.lock + 16], [0, 1], {...clamp, easing: ease.inOutQuint});
  const lock = interpolate(frame, [t.lock, t.lock + 22], [0, 1], {...clamp, easing: ease.outExpo});
  const cta = interpolate(frame, [t.lock + 16, t.lock + 34], [0, 1], {...clamp, easing: ease.outExpo});
  const tagSize = (L.portrait ? 96 : 100) * u;

  return (
    <Backdrop glowOpacity={0.5 * dimLights + lock * 0.4}>
      {/* The room: empty chair glow, monitor reads Exported, clock says 3:21 */}
      <AbsoluteFill style={{display: 'grid', placeItems: 'center', opacity: room}}>
        <div
          style={{
            width: (L.portrait ? 900 : 1100) * u,
            height: (L.portrait ? 560 : 600) * u,
            borderRadius: 18 * u,
            background: '#16181A',
            border: '1px solid #2A2D30',
            boxShadow: `0 0 ${200 * dimLights}px rgba(212,247,124,${0.12 * dimLights})`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 18 * u,
            fontFamily: font,
            filter: `brightness(${0.4 + 0.6 * dimLights})`,
          }}
        >
          <div style={{fontSize: 60 * u, fontWeight: 800, color: color.lime}}>✓ Exported</div>
          <div style={{fontSize: 28 * u, fontWeight: 600, color: color.moss}}>flying_car.glb</div>
          <div style={{position: 'absolute', marginTop: -(L.portrait ? 470 : 500) * u, marginLeft: (L.portrait ? 640 : 860) * u, fontSize: 24 * u, fontWeight: 600, color: color.bone}}>
            3:21 AM
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: `0 ${L.portrait ? 70 : 220}px`,
          translate: `0 ${-tagUp * (L.portrait ? 300 : 200) * u}px`,
          scale: `${1 - tagUp * 0.3}`,
        }}
      >
        <Kinetic text="We built Vi3W so 3D artists can *catch* *more* *sleep.*" at={t.tag} size={tagSize} align="center" stagger={4} />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 22 * u,
          translate: `0 ${(L.portrait ? 120 : 120) * u}px`,
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 22 * u, opacity: lock, scale: `${0.9 + 0.1 * lock}`}}>
          <Img src={staticFile('brand/logo.png')} style={{width: 110 * u, height: 110 * u}} />
          <div style={{fontFamily: font, fontWeight: 800, fontSize: 100 * u, letterSpacing: '-0.05em', color: color.bone}}>Vi3W</div>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 * u, opacity: cta, translate: `0 ${(1 - cta) * 16 * u}px`}}>
          <div
            style={{
              fontFamily: font,
              fontWeight: 800,
              fontSize: 32 * u,
              color: color.ink,
              background: color.lime,
              padding: `${14 * u}px ${30 * u}px`,
              borderRadius: 999,
            }}
          >
            Start sketching, free
          </div>
          <div style={{fontFamily: font, fontWeight: 600, fontSize: 30 * u, color: color.moss}}>app.vi3w.in</div>
        </div>
      </AbsoluteFill>
    </Backdrop>
  );
};
