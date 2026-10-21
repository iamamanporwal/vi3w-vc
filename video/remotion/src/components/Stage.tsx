import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {clamp, color, ease, font} from '../brand';
import {Layout} from '../layout';
import {BrowserFrame} from './Browser';
import {GoButton} from './Sketch';

// Where the headline and the product browser sit, per format. Re-composes rather than crops.
export const stageRects = (L: Layout) => {
  const {format, u} = L;
  if (format === '16x9') {
    return {
      head: {x: 110, y: 330, w: 520, size: 112, align: 'left' as const},
      browser: {x: 650, y: 170, w: 1180, h: 740},
      prompt: {x: 650 + 590, y: 950, w: 1000},
    };
  }
  if (format === '9x16') {
    return {
      head: {x: 60, y: 250, w: 900, size: 132 * u, align: 'left' as const},
      browser: {x: 40, y: 640, w: 1000, h: 760},
      prompt: {x: 540, y: 1440, w: 920},
    };
  }
  if (format === '4x5') {
    return {
      head: {x: 70, y: 80, w: 940, size: 104 * u, align: 'left' as const},
      browser: {x: 50, y: 330, w: 980, h: 720},
      prompt: {x: 540, y: 1110, w: 920},
    };
  }
  return {
    head: {x: 90, y: 70, w: 1170, size: 100 * u, align: 'left' as const},
    browser: {x: 100, y: 230, w: 1150, h: 680},
    prompt: {x: 675, y: 960, w: 1000},
  };
};

// The tilted, slowly-dollying product browser that every Imagine scene lives in.
export const ProductBrowser: React.FC<{
  L: Layout;
  enter?: number;
  exit?: number;
  tilt?: number;
  children?: React.ReactNode;
}> = ({L, enter = 0, exit, tilt = 1, children}) => {
  const frame = useCurrentFrame();
  const {browser} = stageRects(L);
  const p = interpolate(frame, [enter, enter + 24], [0, 1], {...clamp, easing: ease.outExpo});
  const e = exit === undefined ? 0 : interpolate(frame, [exit, exit + 14], [0, 1], {...clamp, easing: ease.inExpo});
  const drift = interpolate(frame, [enter, enter + 400], [0, 1], clamp);
  const rx = (L.portrait ? 4 : 6) * tilt * (1 - drift * 0.6);
  const ry = (L.portrait ? 0 : -9) * tilt * (1 - drift * 0.5);
  return (
    <div style={{position: 'absolute', left: browser.x, top: browser.y, perspective: 2400}}>
      <div
        style={{
          transform: `rotateX(${rx}deg) rotateY(${ry}deg) translateY(${(1 - p) * 120 * L.u}px) scale(${(0.9 + 0.1 * p) * (1 + drift * 0.03) * (1 - e * 0.06)})`,
          opacity: p * (1 - e),
          transformOrigin: '50% 60%',
        }}
      >
        <BrowserFrame width={browser.w} height={browser.h} u={L.u}>
          {children}
        </BrowserFrame>
      </div>
    </div>
  );
};

// Centered 2:1 box inside the browser where the Imagine canvas / generated image lives.
export const CanvasBox: React.FC<{children?: React.ReactNode; pad?: number}> = ({children, pad = 0.06}) => (
  <div style={{position: 'absolute', inset: 0, display: 'grid', placeItems: 'center'}}>
    <div style={{width: `${(1 - pad * 2) * 100}%`, aspectRatio: '2 / 1', position: 'relative'}}>{children}</div>
  </div>
);

// Our own floating prompt callout (a graphic layer, not product UI): shows what the artist typed.
export const PromptPill: React.FC<{
  L: Layout;
  at: number;
  children: React.ReactNode;
  out?: number;
  label?: string;
  go?: number;
  goLabel?: string;
}> = ({L, at, children, out, label = 'Prompt', go, goLabel}) => {
  const frame = useCurrentFrame();
  const {prompt} = stageRects(L);
  const p = interpolate(frame, [at, at + 16], [0, 1], {...clamp, easing: ease.outBack});
  const e = out === undefined ? 0 : interpolate(frame, [out, out + 10], [0, 1], {...clamp, easing: ease.inExpo});
  const u = L.u;
  return (
    <div
      style={{
        position: 'absolute',
        left: prompt.x - prompt.w / 2,
        top: prompt.y,
        width: prompt.w,
        display: 'flex',
        alignItems: 'center',
        gap: 16 * u,
        padding: `${18 * u}px ${24 * u}px`,
        borderRadius: 999,
        background: 'rgba(18,19,20,0.94)',
        border: `1px solid ${color.moss3}`,
        boxShadow: `0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px ${color.lime}22`,
        fontFamily: font,
        fontSize: 26 * u,
        fontWeight: 600,
        color: color.bone,
        opacity: p * (1 - e),
        translate: `0 ${(1 - p) * 30 * u}px`,
        scale: `${0.94 + 0.06 * p}`,
      }}
    >
      <span
        style={{
          flex: 'none',
          fontSize: 15 * u,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: color.ink,
          background: color.lime,
          borderRadius: 999,
          padding: `${6 * u}px ${12 * u}px`,
          fontWeight: 800,
        }}
      >
        {label}
      </span>
      <span style={{lineHeight: 1.25}}>{children}</span>
      {go !== undefined && <GoButton at={go} u={u} label={goLabel} />}
    </div>
  );
};

// A light sweep across a freshly generated image.
export const Sheen: React.FC<{at: number; dur?: number}> = ({at, dur = 24}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + dur], [-0.4, 1.4], {...clamp, easing: ease.inOutSine});
  if (frame < at || frame > at + dur) return null;
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(105deg, transparent ${p * 100 - 18}%, rgba(255,255,255,0.22) ${p * 100}%, transparent ${p * 100 + 18}%)`,
        mixBlendMode: 'screen',
      }}
    />
  );
};
