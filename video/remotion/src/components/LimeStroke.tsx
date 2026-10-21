import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {evolvePath} from '@remotion/paths';
import {clamp, color, ease} from '../brand';

export type StrokeCue = {d: string; from: number; dur: number};

// Lays a list of paths out back to back starting at `start`, each taking time proportional to its length.
export const sequenceStrokes = (paths: string[], start: number, total: number): StrokeCue[] => {
  const weights = paths.map((d) => Math.max(1, d.length));
  const sum = weights.reduce((a, b) => a + b, 0);
  let t = start;
  return paths.map((d, i) => {
    const dur = Math.max(4, Math.round((weights[i] / sum) * total));
    const cue = {d, from: t, dur};
    t += dur;
    return cue;
  });
};

// Hand-drawn lime strokes in the 1000x500 sketch space. Drawn with ease-in-out so each stroke accelerates like a real pen.
export const LimeStrokes: React.FC<{
  cues: StrokeCue[];
  stroke?: string;
  width?: number;
  glow?: boolean;
  dash?: string;
  opacity?: number;
  style?: React.CSSProperties;
}> = ({cues, stroke = color.lime, width = 5, glow = true, dash, opacity = 1, style}) => {
  const frame = useCurrentFrame();
  return (
    <svg
      viewBox="0 0 1000 500"
      style={{position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', opacity, ...style}}
    >
      <g
        style={{filter: glow ? `drop-shadow(0 0 6px ${stroke}aa) drop-shadow(0 0 18px ${stroke}55)` : undefined}}
        fill="none"
        stroke={stroke}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {cues.map(({d, from, dur}, i) => {
          const p = interpolate(frame, [from, from + dur], [0, 1], {...clamp, easing: ease.inOutSine});
          if (p <= 0) return null;
          if (dash) {
            return <path key={i} d={d} strokeDasharray={dash} opacity={p} />;
          }
          const {strokeDasharray, strokeDashoffset} = evolvePath(p, d);
          return <path key={i} d={d} strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset} />;
        })}
      </g>
    </svg>
  );
};
