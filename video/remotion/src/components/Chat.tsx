import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {clamp, color, ease, font} from '../brand';

export type ChatMsg = {
  at: number;
  from: 'dev' | 'artist';
  text?: string;
  file?: string;
  typing?: number; // frames of "typing…" dots before the message lands
};

// Generic, unbranded team chat. The dev is "R", the artist is "You".
export const ChatCard: React.FC<{
  msgs: ChatMsg[];
  at: number;
  width: number;
  u: number;
  out?: number;
  style?: React.CSSProperties;
}> = ({msgs, at, width, u, out, style}) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [at, at + 16], [0, 1], {...clamp, easing: ease.outBack});
  const exit = out === undefined ? 0 : interpolate(frame, [out, out + 12], [0, 1], {...clamp, easing: ease.inExpo});
  const visible = msgs.filter((m) => frame >= m.at - (m.typing ?? 0));
  return (
    <div
      style={{
        width,
        fontFamily: font,
        background: 'rgba(22,24,23,0.92)',
        border: `1px solid ${color.moss3}`,
        borderRadius: 22 * u,
        padding: 22 * u,
        boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
        backdropFilter: 'blur(14px)',
        opacity: enter * (1 - exit),
        scale: `${0.92 + 0.08 * enter - exit * 0.05}`,
        translate: `0 ${(1 - enter) * 40 * u}px`,
        display: 'flex',
        flexDirection: 'column',
        gap: 14 * u,
        ...style,
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: 10 * u, color: color.moss, fontSize: 18 * u, fontWeight: 600}}>
        <span style={{width: 9 * u, height: 9 * u, borderRadius: 9, background: color.lime}} />
        # level-art
      </div>
      {visible.map((m, i) => {
        const typing = m.typing && frame < m.at;
        const p = interpolate(frame, [m.at, m.at + 12], [0, 1], {...clamp, easing: ease.outBack});
        return (
          <div key={i} style={{display: 'flex', gap: 14 * u, alignItems: 'flex-start'}}>
            <Avatar who={m.from} u={u} />
            <div style={{display: 'flex', flexDirection: 'column', gap: 4 * u}}>
              <div style={{color: color.moss, fontSize: 17 * u, fontWeight: 600}}>
                {m.from === 'dev' ? 'R · Game Dev' : 'You · 3D Artist'}
              </div>
              {typing ? (
                <Dots u={u} />
              ) : m.file ? (
                <FileChip name={m.file} u={u} p={p} />
              ) : (
                <div
                  style={{
                    color: color.bone,
                    fontSize: 30 * u,
                    fontWeight: 600,
                    letterSpacing: '-0.01em',
                    lineHeight: 1.2,
                    opacity: p,
                    translate: `0 ${(1 - p) * 10 * u}px`,
                  }}
                >
                  {m.text}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Avatar: React.FC<{who: 'dev' | 'artist'; u: number}> = ({who, u}) => (
  <div
    style={{
      width: 46 * u,
      height: 46 * u,
      flex: 'none',
      borderRadius: 14 * u,
      display: 'grid',
      placeItems: 'center',
      fontWeight: 800,
      fontSize: 22 * u,
      background: who === 'dev' ? '#2B3140' : color.olive,
      color: who === 'dev' ? '#AFC3FF' : color.lime,
    }}
  >
    {who === 'dev' ? 'R' : 'Y'}
  </div>
);

const Dots: React.FC<{u: number}> = ({u}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{display: 'flex', gap: 6 * u, padding: `${10 * u}px 0`}}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 9 * u,
            height: 9 * u,
            borderRadius: 9,
            background: color.moss,
            opacity: 0.35 + 0.65 * Math.max(0, Math.sin((frame - i * 4) / 4)),
          }}
        />
      ))}
    </div>
  );
};

const FileChip: React.FC<{name: string; u: number; p: number}> = ({name, u, p}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 14 * u,
      padding: `${12 * u}px ${18 * u}px`,
      borderRadius: 14 * u,
      border: `1px solid ${color.moss3}`,
      background: color.ink2,
      opacity: p,
      scale: `${0.9 + 0.1 * p}`,
      transformOrigin: 'left center',
    }}
  >
    <svg width={34 * u} height={34 * u} viewBox="0 0 24 24" fill="none" stroke={color.lime} strokeWidth={1.6}>
      <path d="M12 2 L21 7 L21 17 L12 22 L3 17 L3 7 Z M12 12 L21 7 M12 12 L3 7 M12 12 L12 22" strokeLinejoin="round" />
    </svg>
    <div>
      <div style={{color: color.bone, fontSize: 24 * u, fontWeight: 600}}>{name}</div>
      <div style={{color: color.moss, fontSize: 16 * u}}>3D model · GLB</div>
    </div>
  </div>
);
