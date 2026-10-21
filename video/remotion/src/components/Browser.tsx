import React from 'react';
import {color, font} from '../brand';

// Minimal browser frame drawn by us (real page captures are recorded without browser chrome).
export const BrowserFrame: React.FC<{
  width: number;
  height: number;
  u: number;
  url?: React.ReactNode;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({width, height, u, url = 'app.vi3w.in', style, children}) => {
  const bar = 46 * u;
  return (
    <div
      style={{
        width,
        height,
        borderRadius: 18 * u,
        overflow: 'hidden',
        background: color.ink2,
        border: `1px solid ${color.moss3}`,
        boxShadow: `0 60px 120px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.03), 0 0 80px ${color.olive}66`,
        position: 'relative',
        ...style,
      }}
    >
      <div
        style={{
          height: bar,
          display: 'flex',
          alignItems: 'center',
          gap: 8 * u,
          padding: `0 ${16 * u}px`,
          borderBottom: `1px solid ${color.moss3}`,
          background: '#141615',
        }}
      >
        {['#3A3F36', '#3A3F36', '#3A3F36'].map((c, i) => (
          <span key={i} style={{width: 12 * u, height: 12 * u, borderRadius: 12, background: c}} />
        ))}
        <div
          style={{
            marginLeft: 18 * u,
            flex: 1,
            maxWidth: 520 * u,
            height: 28 * u,
            borderRadius: 8 * u,
            background: color.ink,
            color: color.moss,
            fontFamily: font,
            fontSize: 15 * u,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            padding: `0 ${12 * u}px`,
          }}
        >
          {url}
        </div>
      </div>
      <div style={{position: 'absolute', top: bar, left: 0, right: 0, bottom: 0}}>{children}</div>
    </div>
  );
};
