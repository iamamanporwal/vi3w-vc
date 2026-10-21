import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {clamp, color, ease, font} from '../brand';

// Word-by-word masked slide-up headline. Words wrapped in *asterisks* render in lime.
export const Kinetic: React.FC<{
  text: string;
  at: number;
  size: number;
  out?: number;
  stagger?: number;
  weight?: number;
  align?: 'left' | 'center' | 'right';
  lineHeight?: number;
  style?: React.CSSProperties;
}> = ({text, at, size, out, stagger = 3, weight = 800, align = 'left', lineHeight = 1.02, style}) => {
  const frame = useCurrentFrame();
  const words = text.split(' ');
  const exit = out === undefined ? 0 : interpolate(frame, [out, out + 10], [0, 1], {...clamp, easing: ease.inExpo});
  return (
    <div
      style={{
        fontFamily: font,
        fontWeight: weight,
        fontSize: size,
        lineHeight,
        letterSpacing: '-0.035em',
        color: color.bone,
        textAlign: align,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
        columnGap: '0.24em',
        opacity: 1 - exit,
        translate: `0 ${-exit * size * 0.35}px`,
        ...style,
      }}
    >
      {words.map((w, i) => {
        const lime = w.startsWith('*') || w.endsWith('*');
        const clean = w.replace(/\*/g, '');
        const p = interpolate(frame, [at + i * stagger, at + i * stagger + 14], [0, 1], {...clamp, easing: ease.outExpo});
        return (
          <span key={i} style={{display: 'inline-block', overflow: 'hidden', paddingBottom: '0.08em', marginBottom: '-0.08em'}}>
            <span
              style={{
                display: 'inline-block',
                translate: `0 ${(1 - p) * 105}%`,
                rotate: `${(1 - p) * 4}deg`,
                color: lime ? color.lime : undefined,
              }}
            >
              {clean}
            </span>
          </span>
        );
      })}
    </div>
  );
};

// Monospace-free typewriter for prompts and URLs, with a blinking caret.
export const Typewriter: React.FC<{
  text: string;
  at: number;
  cps?: number;
  caret?: boolean;
  style?: React.CSSProperties;
}> = ({text, at, cps = 38, caret = true, style}) => {
  const frame = useCurrentFrame();
  const n = Math.max(0, Math.min(text.length, Math.floor(((frame - at) / 30) * cps)));
  const typing = frame >= at && n < text.length;
  const showCaret = caret && frame >= at - 10 && (typing || Math.floor(frame / 8) % 2 === 0);
  return (
    <span style={{fontFamily: font, ...style}}>
      {text.slice(0, n)}
      <span style={{opacity: showCaret ? 1 : 0, color: color.lime, marginLeft: 1}}>|</span>
    </span>
  );
};
