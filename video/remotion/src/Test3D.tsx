import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {Car} from './three/Car';
import {Exhaust, StudioFloor, StudioLights} from './three/Studio';
import {color} from './brand';

export const Test3D: React.FC<{variant: 'sedan' | 'sport' | 'fly'}> = ({variant}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const lift = variant === 'fly' ? 0.6 : 0;
  return (
    <AbsoluteFill style={{background: color.ink}}>
      <ThreeCanvas width={width} height={height} camera={{position: [4.2, 1.6, 4.8], fov: 32}} onCreated={({camera}) => camera.lookAt(0, 0.5, 0)}>
        <StudioLights sweep={0.5} />
        <StudioFloor />
        <group position={[0, lift, 0]} rotation={[0, frame * 0.01, 0]}>
          <Car variant={variant} thrust={1} />
          {variant === 'fly' && (
            <Exhaust frame={frame} strength={1} origins={[[-1.3, 0.3, 0.86], [-1.3, 0.3, -0.86], [1.25, 0.3, 0.86], [1.25, 0.3, -0.86]]} />
          )}
        </group>
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
