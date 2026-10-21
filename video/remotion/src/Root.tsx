import React from 'react';
import {Composition} from 'remotion';
import {FPS} from './brand';
import {FORMATS, Format} from './layout';
import {Hero, HERO_FRAMES} from './films/Hero';
import {Test3D} from './Test3D';

const formats = Object.keys(FORMATS) as Format[];

export const RemotionRoot: React.FC = () => (
  <>
    {formats.map((f) => (
      <Composition
        key={`Hero-${f}`}
        id={`Hero-${f}`}
        component={Hero}
        durationInFrames={HERO_FRAMES}
        fps={FPS}
        width={FORMATS[f].width}
        height={FORMATS[f].height}
        defaultProps={{music: 'audio/guide.wav' as string | null}}
      />
    ))}
    <Composition id="Test3D" component={Test3D} durationInFrames={60} fps={FPS} width={1920} height={1080} defaultProps={{variant: 'sport' as const}} />
  </>
);
