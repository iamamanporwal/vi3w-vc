import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {color} from '../brand';

// Ink background with a soft key glow, vignette and per-frame film grain.
export const Backdrop: React.FC<{
  glow?: string;
  glowAt?: [number, number];
  glowOpacity?: number;
  children?: React.ReactNode;
}> = ({glow = color.olive, glowAt = [50, 45], glowOpacity = 0.55, children}) => (
  <AbsoluteFill style={{backgroundColor: color.ink}}>
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 70% 60% at ${glowAt[0]}% ${glowAt[1]}%, ${glow} 0%, transparent 70%)`,
        opacity: glowOpacity,
      }}
    />
    {children}
    <Vignette />
    <Grain />
  </AbsoluteFill>
);

export const Vignette: React.FC<{strength?: number}> = ({strength = 0.75}) => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      background: `radial-gradient(ellipse 85% 80% at 50% 50%, transparent 55%, rgba(0,0,0,${strength}) 100%)`,
    }}
  />
);

export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.07}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity, mixBlendMode: 'overlay'}}>
      <svg width="100%" height="100%">
        <filter id={`grain-${frame % 24}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={frame % 24} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${frame % 24})`} />
      </svg>
    </AbsoluteFill>
  );
};
