import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {clamp, color, ease, font} from '../brand';
import {useLayout} from '../layout';
import {Backdrop} from '../components/Backdrop';
import {ChatCard} from '../components/Chat';
import {Kinetic, Typewriter} from '../components/Kinetic';
import {Cursor} from '../components/Cursor';

// Beats 1–3 (0:00–0:08): 2:47 AM, the default cube, the "one hour" ask, and the escape to app.vi3w.in.
export const T_NIGHT = {clock: 6, chat: 92, msg1: 104, msg2: 134, hour: 150, hourOut: 176, chatOut: 172, cursor: 176, url: 206, type: 212, enter: 232, end: 240};

export const Night: React.FC<{t?: typeof T_NIGHT; clockText?: string}> = ({t = T_NIGHT, clockText = '2:47 AM'}) => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const {u, format} = L;
  const panel =
    format === '16x9'
      ? {x: 150, y: 100, w: 1620, h: 880}
      : format === '9x16'
        ? {x: 40, y: 300, w: 1000, h: 760}
        : format === '4x5'
          ? {x: 40, y: 50, w: 1000, h: 640}
          : {x: 60, y: 60, w: 1230, h: 700};
  const chat =
    format === '16x9'
      ? {x: 1130, y: 480, w: 640}
      : format === '9x16'
        ? {x: 40, y: 1110, w: 1000}
        : format === '4x5'
          ? {x: 40, y: 730, w: 1000}
          : {x: 640, y: 520, w: 650};

  const push = interpolate(frame, [0, t.end], [1, 1.1], {...clamp, easing: ease.inOutSine});
  const dim = interpolate(frame, [t.hour - 4, t.hour + 4, t.hourOut, t.hourOut + 6], [0, 0.72, 0.72, 0.25], clamp);
  const urlP = interpolate(frame, [t.url, t.url + 12], [0, 1], {...clamp, easing: ease.outBack});
  const flash = interpolate(frame, [t.enter, t.enter + 3, t.end], [0, 0.9, 0], clamp);
  const fadeIn = interpolate(frame, [0, 18], [0, 1], clamp);
  const bar = 44 * u;

  return (
    <Backdrop glow="#1B2433" glowAt={[50, 40]} glowOpacity={0.8}>
      <AbsoluteFill style={{scale: `${push}`, opacity: fadeIn}}>
        {/* Generic 3D viewport: grey grid, default cube, no product branding */}
        <div
          style={{
            position: 'absolute',
            left: panel.x,
            top: panel.y,
            width: panel.w,
            height: panel.h,
            borderRadius: 14 * u,
            overflow: 'hidden',
            background: '#2A2B2D',
            border: '1px solid #3B3D40',
            boxShadow: '0 0 160px rgba(120,150,220,0.18)',
          }}
        >
          <div
            style={{
              height: bar,
              display: 'flex',
              alignItems: 'center',
              gap: 26 * u,
              padding: `0 ${18 * u}px`,
              background: '#1F2022',
              color: '#9A9DA3',
              fontFamily: font,
              fontSize: 17 * u,
              fontWeight: 600,
            }}
          >
            {['File', 'Edit', 'Render', 'Window', 'Help'].map((m) => (
              <span key={m}>{m}</span>
            ))}
            <span style={{marginLeft: 'auto', color: color.bone, fontSize: 19 * u}}>
              <Typewriter text={clockText} at={t.clock} cps={12} caret={false} />
            </span>
          </div>
          <ThreeCanvas
            width={panel.w}
            height={panel.h - bar}
            camera={{position: [6, 4.4, 7], fov: 32}}
            onCreated={({camera}) => camera.lookAt(0, 0.4, 0)}
          >
            <color attach="background" args={['#333437']} />
            <ambientLight intensity={0.7} />
            <directionalLight position={[4, 8, 6]} intensity={1.4} />
            <gridHelper args={[40, 40, '#4A4C50', '#3E4044']} />
            <mesh position={[0, 1, 0]} rotation={[0, frame * 0.004 + 0.3, 0]}>
              <boxGeometry args={[2, 2, 2]} />
              <meshStandardMaterial color="#8C8F94" roughness={0.6} />
            </mesh>
            <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[40, 0.03]} />
              <meshBasicMaterial color="#B5524A" />
            </mesh>
            <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
              <planeGeometry args={[40, 0.03]} />
              <meshBasicMaterial color="#6E9A3E" />
            </mesh>
          </ThreeCanvas>
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{background: '#000', opacity: dim}} />

      <div style={{position: 'absolute', left: chat.x, top: chat.y}}>
        <ChatCard
          at={t.chat}
          out={t.chatOut}
          width={chat.w}
          u={u}
          msgs={[
            {at: t.msg1, from: 'dev', text: 'Need a car model for the level.', typing: 10},
            {at: t.msg2, from: 'dev', text: 'In one hour. 🙏', typing: 10},
          ]}
        />
      </div>

      <AbsoluteFill style={{display: 'grid', placeItems: 'center'}}>
        <Kinetic text="*One* *hour.*" at={t.hour} out={t.hourOut} size={(L.portrait ? 190 : 210) * u} align="center" stagger={5} />
      </AbsoluteFill>

      {/* The escape: a fresh tab and a URL */}
      {frame >= t.url && (
        <AbsoluteFill style={{display: 'grid', placeItems: 'center'}}>
          <div
            style={{
              width: (L.portrait ? 900 : 980) * u,
              padding: `${30 * u}px ${40 * u}px`,
              borderRadius: 999,
              background: 'rgba(16,17,18,0.96)',
              border: `1px solid ${color.moss3}`,
              boxShadow: `0 40px 120px rgba(0,0,0,0.7), 0 0 0 1px ${color.lime}33`,
              display: 'flex',
              alignItems: 'center',
              gap: 22 * u,
              opacity: urlP,
              scale: `${0.85 + 0.15 * urlP}`,
              fontFamily: font,
              fontSize: 56 * u,
              fontWeight: 600,
              letterSpacing: '-0.02em',
              color: color.bone,
            }}
          >
            <svg width={44 * u} height={44 * u} viewBox="0 0 24 24" fill="none" stroke={color.moss} strokeWidth={2}>
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20 L16 16" strokeLinecap="round" />
            </svg>
            <Typewriter text="app.vi3w.in" at={t.type} cps={22} />
          </div>
        </AbsoluteFill>
      )}

      <Cursor
        scale={1.3 * u}
        keys={[
          {f: t.cursor, x: L.width * 0.82, y: L.height * 0.86},
          {f: t.cursor + 18, x: L.width * 0.5 + 30 * u, y: L.height * (L.portrait ? 0.36 : 0.5)},
          {f: t.cursor + 24, x: L.width * 0.5 + 10 * u, y: L.height * (L.portrait ? 0.355 : 0.49)},
          {f: t.cursor + 30, x: L.width * 0.5 + 34 * u, y: L.height * (L.portrait ? 0.362 : 0.505)},
        ]}
      />
      <AbsoluteFill style={{background: color.bone, opacity: flash * 0.25, mixBlendMode: 'screen'}} />
    </Backdrop>
  );
};
