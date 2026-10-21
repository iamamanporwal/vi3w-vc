import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {Night} from '../scenes/Night';
import {Title} from '../scenes/Title';
import {ModScene, SketchScene, ThrusterScene} from '../scenes/Imagine';
import {Model3DScene} from '../scenes/Model3D';
import {Delivery, Twist} from '../scenes/Messages';
import {Finale} from '../scenes/Finale';
import {End} from '../scenes/End';
import {HERO_VO} from '../vo';

// 80 s hero film at 30 fps. Every boundary sits on a beat of the 120 BPM guide (15 frames).
export const HERO = [
  {name: 'Night', d: 240, el: <Night />},
  {name: 'Title', d: 90, el: <Title />},
  {name: 'Sketch', d: 270, el: <SketchScene />},
  {name: 'Mod', d: 420, el: <ModScene />},
  {name: 'To 3D', d: 300, el: <Model3DScene variant="sport" image="sport-image" />},
  {name: 'Delivery', d: 90, el: <Delivery />},
  {name: 'Twist', d: 90, el: <Twist />},
  {name: 'Thrusters', d: 270, el: <ThrusterScene />},
  {
    name: 'Fly 3D',
    d: 90,
    el: (
      <Model3DScene
        variant="fly"
        image="fly-image"
        showBrowser={false}
        headline=""
        t={{go: -99, lift: -30, wireEnd: 50, head: 999, export: 999, end: 90}}
      />
    ),
  },
  {name: 'Finale', d: 330, el: <Finale />},
  {name: 'End', d: 210, el: <End />},
];

export const HERO_FRAMES = HERO.reduce((s, x) => s + x.d, 0);

export const Hero: React.FC<{music?: string | null}> = ({music}) => {
  let from = 0;
  return (
    <AbsoluteFill style={{backgroundColor: '#0B0B0C'}}>
      {HERO.map((s) => {
        const seq = (
          <Sequence key={s.name} name={s.name} from={from} durationInFrames={s.d}>
            {s.el}
          </Sequence>
        );
        from += s.d;
        return seq;
      })}
      {music && <Audio src={staticFile(music)} volume={0.7} />}
      {HERO_VO.filter((v) => v.file).map((v) => (
        <Sequence key={v.id} name={v.id} from={v.at}>
          <Audio src={staticFile(`audio/vo/${v.file}`)} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
