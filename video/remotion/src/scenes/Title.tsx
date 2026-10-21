import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {evolvePath} from '@remotion/paths';
import {clamp, color, ease, font} from '../brand';
import {useLayout} from '../layout';
import {Backdrop} from '../components/Backdrop';

// Beat 4 (0:08–0:11): the URL collapses into the Vi3W mark, a lime line draws the frame open.
export const Title: React.FC<{dur?: number}> = ({dur = 90}) => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const {u} = L;
  const urlOut = interpolate(frame, [0, 10], [0, 1], {...clamp, easing: ease.inExpo});
  const mark = interpolate(frame, [6, 28], [0, 1], {...clamp, easing: ease.outBack});
  const markSpin = interpolate(frame, [6, 40], [-120, 0], {...clamp, easing: ease.outExpo});
  const word = interpolate(frame, [16, 34], [0, 1], {...clamp, easing: ease.outExpo});
  const sub = interpolate(frame, [30, 46], [0, 1], {...clamp, easing: ease.outExpo});
  const line = interpolate(frame, [4, 40], [0, 1], {...clamp, easing: ease.inOutQuint});
  const exit = interpolate(frame, [dur - 14, dur], [0, 1], {...clamp, easing: ease.inExpo});
  const markSize = (L.portrait ? 200 : 190) * u;
  const lineY = L.height / 2 + markSize * 0.95;
  const d = `M -40 ${lineY} C ${L.width * 0.3} ${lineY - 30 * u}, ${L.width * 0.7} ${lineY + 30 * u}, ${L.width + 40} ${lineY}`;
  const {strokeDasharray, strokeDashoffset} = evolvePath(line, d);

  return (
    <Backdrop glowAt={[50, 50]} glowOpacity={0.9 * mark}>
      <AbsoluteFill style={{display: 'grid', placeItems: 'center'}}>
        <div
          style={{
            fontFamily: font,
            fontSize: 56 * u,
            fontWeight: 600,
            color: color.bone,
            letterSpacing: `${-0.02 + urlOut * 0.4}em`,
            opacity: 1 - urlOut,
            filter: `blur(${urlOut * 12}px)`,
          }}
        >
          app.vi3w.in
        </div>
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 26 * u,
          opacity: 1 - exit,
          scale: `${1 + exit * 0.08}`,
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 34 * u}}>
          <Img
            src={staticFile('brand/logo.png')}
            style={{
              width: markSize,
              height: markSize,
              scale: `${mark}`,
              rotate: `${markSpin}deg`,
              filter: `drop-shadow(0 0 ${40 * u}px rgba(120,160,255,0.35))`,
            }}
          />
          <div
            style={{
              fontFamily: font,
              fontWeight: 800,
              fontSize: markSize * 0.92,
              letterSpacing: '-0.05em',
              color: color.bone,
              clipPath: `inset(0 ${(1 - word) * 100}% 0 0)`,
              translate: `${(1 - word) * -30 * u}px 0`,
            }}
          >
            Vi3W
          </div>
        </div>
        <div
          style={{
            fontFamily: font,
            fontWeight: 600,
            fontSize: 46 * u,
            letterSpacing: '-0.01em',
            color: color.moss,
            opacity: sub,
            translate: `0 ${(1 - sub) * 16 * u}px`,
          }}
        >
          Sketch to <span style={{color: color.lime}}>3D</span>.
        </div>
      </AbsoluteFill>
      <svg width={L.width} height={L.height} style={{position: 'absolute', inset: 0}}>
        <path
          d={d}
          fill="none"
          stroke={color.lime}
          strokeWidth={5 * u}
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          style={{filter: `drop-shadow(0 0 10px ${color.lime}aa)`, opacity: 1 - exit}}
        />
      </svg>
    </Backdrop>
  );
};
