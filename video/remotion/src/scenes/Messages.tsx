import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {clamp, ease} from '../brand';
import {useLayout} from '../layout';
import {Backdrop} from '../components/Backdrop';
import {ChatCard} from '../components/Chat';
import {Kinetic} from '../components/Kinetic';

const chatWidth = (portrait: boolean, u: number) => (portrait ? 960 : 860) * u;

// Beat 8 (0:44–0:47): the artist sends the GLB, the dev is happy.
export const Delivery: React.FC<{end?: number}> = ({end = 90}) => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const exit = interpolate(frame, [end - 10, end], [0, 1], {...clamp, easing: ease.inExpo});
  return (
    <Backdrop glowAt={[50, 50]} glowOpacity={0.5}>
      <AbsoluteFill style={{display: 'grid', placeItems: 'center', opacity: 1 - exit}}>
        <ChatCard
          at={0}
          width={chatWidth(L.portrait, L.u)}
          u={L.u * 1.15}
          msgs={[
            {at: 4, from: 'artist', file: 'sports_car.glb'},
            {at: 40, from: 'dev', text: '🔥 perfect.', typing: 14},
          ]}
        />
      </AbsoluteFill>
    </Backdrop>
  );
};

// Beat 9 (0:47–0:50): music drops out; the plot twist.
export const Twist: React.FC<{end?: number}> = ({end = 90}) => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const chatOut = interpolate(frame, [44, 54], [0, 1], {...clamp, easing: ease.inExpo});
  const shake = frame >= 52 && frame < 60 ? Math.sin(frame * 3.1) * 6 * L.u * (60 - frame) / 8 : 0;
  return (
    <Backdrop glowOpacity={0.25}>
      <AbsoluteFill style={{display: 'grid', placeItems: 'center', opacity: 1 - chatOut, scale: `${1 - chatOut * 0.05}`}}>
        <ChatCard
          at={-20}
          width={chatWidth(L.portrait, L.u)}
          u={L.u * 1.15}
          msgs={[{at: 26, from: 'dev', text: '…ok, one more thing.', typing: 22}]}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{display: 'grid', placeItems: 'center', translate: `${shake}px 0`}}>
        <Kinetic
          text="It needs to *fly.* 😅"
          at={50}
          out={end - 8}
          size={(L.portrait ? 150 : 170) * L.u}
          align="center"
          stagger={4}
          style={{width: L.width * 0.86}}
        />
      </AbsoluteFill>
    </Backdrop>
  );
};
