import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {clamp, color, ease} from '../brand';

export type CursorKey = {f: number; x: number; y: number};

// Custom cursor driven by keyframes (positions in the parent's pixel space), with click ripples.
// Moves ease in and out between keys so the cursor feels like a hand, not a tween.
export const Cursor: React.FC<{keys: CursorKey[]; clicks?: number[]; scale?: number; pen?: boolean}> = ({
  keys,
  clicks = [],
  scale = 1,
  pen = false,
}) => {
  const frame = useCurrentFrame();
  if (frame < keys[0].f) return null;
  let x = keys[keys.length - 1].x;
  let y = keys[keys.length - 1].y;
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (frame >= a.f && frame <= b.f) {
      const p = interpolate(frame, [a.f, b.f], [0, 1], {...clamp, easing: ease.inOutQuint});
      x = a.x + (b.x - a.x) * p;
      y = a.y + (b.y - a.y) * p;
      break;
    }
  }
  const press = clicks.reduce((s, c) => s + interpolate(frame, [c - 2, c, c + 5], [0, 1, 0], clamp), 0);
  return (
    <>
      {clicks.map((c) => {
        const r = interpolate(frame, [c, c + 16], [0, 1], {...clamp, easing: ease.outExpo});
        if (frame < c || frame > c + 16) return null;
        const at = keyAt(keys, c);
        return (
          <div
            key={c}
            style={{
              position: 'absolute',
              left: at.x - 34 * scale,
              top: at.y - 34 * scale,
              width: 68 * scale,
              height: 68 * scale,
              borderRadius: '50%',
              border: `${2 * scale}px solid ${color.lime}`,
              scale: `${0.3 + r}`,
              opacity: 1 - r,
            }}
          />
        );
      })}
      <svg
        width={28 * scale}
        height={28 * scale}
        viewBox="0 0 28 28"
        style={{
          position: 'absolute',
          left: x - (pen ? 3 : 4) * scale,
          top: y - (pen ? 25 : 3) * scale,
          scale: `${1 - press * 0.15}`,
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.55))',
          overflow: 'visible',
        }}
      >
        {pen ? (
          <path d="M3 25 L6 17 L20 3 L25 8 L11 22 Z" fill={color.ink} stroke={color.lime} strokeWidth={1.8} strokeLinejoin="round" />
        ) : (
          <path d="M4 3 L4 23 L9.5 18 L13 26 L16.5 24.5 L13 17 L21 17 Z" fill={color.white} stroke={color.ink} strokeWidth={1.5} strokeLinejoin="round" />
        )}
      </svg>
    </>
  );
};

const keyAt = (keys: CursorKey[], f: number) => {
  for (let i = keys.length - 1; i >= 0; i--) if (keys[i].f <= f) return keys[i];
  return keys[0];
};
