import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, staticFile} from 'remotion';
import {color, font} from '../brand';
import {captures, CaptureId} from '../captures';

// Shows a real app.vi3w.in capture when one exists in public/capture, otherwise a labelled
// placeholder. Placeholders are for storyboards only and must never ship.
export const Capture: React.FC<{id: CaptureId; u: number; fit?: 'cover' | 'contain'; style?: React.CSSProperties}> = ({
  id,
  u,
  fit = 'contain',
  style,
}) => {
  const file = captures[id];
  if (file) {
    const src = staticFile(`capture/${file}`);
    const s: React.CSSProperties = {width: '100%', height: '100%', objectFit: fit, ...style};
    return file.endsWith('.mp4') ? <OffthreadVideo src={src} style={s} muted /> : <Img src={src} style={s} />;
  }
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(${color.moss3} 1px, transparent 1px) 0 0 / ${22 * u}px ${22 * u}px, ${color.ink2}`,
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 16 * u,
          bottom: 14 * u,
          fontFamily: font,
          fontSize: 14 * u,
          fontWeight: 600,
          letterSpacing: '0.12em',
          color: color.moss2,
        }}
      >
        PLACEHOLDER · REAL VI3W CAPTURE: {id}
      </div>
    </AbsoluteFill>
  );
};
