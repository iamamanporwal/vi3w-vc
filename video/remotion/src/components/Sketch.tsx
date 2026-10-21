import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {getLength, getPointAtLength} from '@remotion/paths';
import {clamp, color, ease, font} from '../brand';
import {LimeStrokes, StrokeCue} from './LimeStroke';
import {Cursor} from './Cursor';

// Lime strokes plus a pen cursor that rides the tip of whichever stroke is being drawn.
// `w` is the pixel width of the 2:1 canvas box the layer fills.
export const SketchLayer: React.FC<{
  cues: StrokeCue[];
  w: number;
  u: number;
  opacity?: number;
  stroke?: string;
  width?: number;
}> = ({cues, w, u, opacity = 1, stroke, width}) => {
  const frame = useCurrentFrame();
  const k = w / 1000;
  const first = cues[0];
  const last = cues[cues.length - 1];
  const keys = [];
  if (first && last) {
    for (let f = first.from - 8; f <= last.from + last.dur + 10; f += 1) {
      const cue = cues.find((c) => f >= c.from && f <= c.from + c.dur) ?? [...cues].reverse().find((c) => f > c.from + c.dur) ?? first;
      const p = interpolate(f, [cue.from, cue.from + cue.dur], [0, 1], {...clamp, easing: ease.inOutSine});
      const pt = getPointAtLength(cue.d, getLength(cue.d) * p);
      if (pt) keys.push({f, x: pt.x * k, y: pt.y * k});
    }
  }
  const penOut = last ? interpolate(frame, [last.from + last.dur + 4, last.from + last.dur + 14], [1, 0], clamp) : 0;
  return (
    <div style={{position: 'absolute', inset: 0, opacity}}>
      <LimeStrokes cues={cues} stroke={stroke} width={width} />
      {keys.length > 0 && (
        <div style={{position: 'absolute', inset: 0, opacity: penOut}}>
          <Cursor keys={keys} pen scale={1.4 * u} />
        </div>
      )}
    </div>
  );
};

// Before/after wipe driven by `w` in 0..1 (0 = all before, 1 = all after), with a lime divider.
export const Wipe: React.FC<{w: number; before: React.ReactNode; after: React.ReactNode; labels?: number; u: number}> = ({
  w,
  before,
  after,
  labels = 0,
  u,
}) => (
  <div style={{position: 'absolute', inset: 0}}>
    <div style={{position: 'absolute', inset: 0}}>{before}</div>
    <div style={{position: 'absolute', inset: 0, clipPath: `inset(0 ${(1 - w) * 100}% 0 0)`}}>{after}</div>
    {w > 0.001 && w < 0.999 && (
      <div
        style={{
          position: 'absolute',
          top: '-4%',
          bottom: '-4%',
          left: `${w * 100}%`,
          width: 4 * u,
          marginLeft: -2 * u,
          background: color.lime,
          boxShadow: `0 0 ${24 * u}px ${color.lime}`,
        }}
      />
    )}
    {labels > 0 && (
      <>
        <Chip text="Before" u={u} style={{left: 14 * u, opacity: labels * (1 - w * 0.6)}} />
        <Chip text="After" u={u} lime style={{right: 14 * u, opacity: labels * (0.4 + w * 0.6)}} />
      </>
    )}
  </div>
);

const Chip: React.FC<{text: string; u: number; lime?: boolean; style?: React.CSSProperties}> = ({text, u, lime, style}) => (
  <div
    style={{
      position: 'absolute',
      top: 14 * u,
      padding: `${7 * u}px ${14 * u}px`,
      borderRadius: 999,
      fontFamily: font,
      fontWeight: 800,
      fontSize: 16 * u,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: lime ? color.ink : color.bone,
      background: lime ? color.lime : 'rgba(11,11,12,0.8)',
      border: lime ? 'none' : `1px solid ${color.moss3}`,
      ...style,
    }}
  >
    {text}
  </div>
);

// Lime "Generate" button that sits on the right of a PromptPill and gets pressed at `at`.
export const GoButton: React.FC<{at: number; u: number; label?: string}> = ({at, u, label = 'Generate'}) => {
  const frame = useCurrentFrame();
  const press = interpolate(frame, [at - 3, at, at + 8], [0, 1, 0], clamp);
  const glow = interpolate(frame, [at, at + 20], [1, 0], clamp);
  return (
    <span
      style={{
        marginLeft: 'auto',
        flex: 'none',
        padding: `${10 * u}px ${20 * u}px`,
        borderRadius: 999,
        background: color.lime,
        color: color.ink,
        fontWeight: 800,
        fontSize: 20 * u,
        scale: `${1 - press * 0.12}`,
        boxShadow: frame >= at ? `0 0 ${50 * glow * u}px ${color.lime}` : 'none',
      }}
    >
      {label} →
    </span>
  );
};
