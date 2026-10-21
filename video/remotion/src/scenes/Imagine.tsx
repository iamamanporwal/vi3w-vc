import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {clamp, color, ease} from '../brand';
import {Layout, useLayout} from '../layout';
import {Backdrop} from '../components/Backdrop';
import {Capture} from '../components/Capture';
import {Kinetic, Typewriter} from '../components/Kinetic';
import {sequenceStrokes} from '../components/LimeStroke';
import {SketchLayer, Wipe} from '../components/Sketch';
import {CanvasBox, ProductBrowser, PromptPill, Sheen, stageRects} from '../components/Stage';
import {eraseStrokes, modStrokes, sedanStrokes, thrusterStrokes} from '../sketches';

const PAD = 0.06;
const boxWidth = (L: Layout) => stageRects(L).browser.w * (1 - PAD * 2);

const Headline: React.FC<{L: Layout; lines: {text: string; at: number; out?: number}[]}> = ({L, lines}) => {
  const {head} = stageRects(L);
  return (
    <div style={{position: 'absolute', left: head.x, top: head.y, width: head.w}}>
      {lines.map((l) => (
        <div key={l.text} style={{position: 'absolute', left: 0, top: 0, width: head.w}}>
          <Kinetic text={l.text} at={l.at} out={l.out} size={head.size} />
        </div>
      ))}
    </div>
  );
};

// Beat 5 (0:11–0:20): sketch a sedan, prompt, generate the basic car.
export const T_SKETCH = {draw: 22, drawDur: 124, prompt: 150, type: 156, go: 204, reveal: 212, end: 270};

export const SketchScene: React.FC<{t?: typeof T_SKETCH; enter?: number}> = ({t = T_SKETCH, enter = 0}) => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const w = boxWidth(L);
  const reveal = interpolate(frame, [t.reveal, t.reveal + 26], [0, 1], {...clamp, easing: ease.inOutQuint});
  return (
    <Backdrop glowAt={[65, 55]}>
      <Headline L={L} lines={[{text: 'Sketch it.', at: t.draw - 6}]} />
      <ProductBrowser L={L} enter={enter}>
        <Capture id="imagine-empty" u={L.u} />
        <CanvasBox pad={PAD}>
          <div style={{position: 'absolute', inset: 0, clipPath: `inset(0 ${(1 - reveal) * 100}% 0 0)`}}>
            <Capture id="sedan-image" u={L.u} />
            <Sheen at={t.reveal + 16} />
          </div>
          <SketchLayer cues={sequenceStrokes(sedanStrokes, t.draw, t.drawDur)} w={w} u={L.u} opacity={1 - reveal * 0.9} />
        </CanvasBox>
      </ProductBrowser>
      <PromptPill L={L} at={t.prompt} go={t.go}>
        <Typewriter text="Sports sedan, grey paint, clean studio shot" at={t.type} />
      </PromptPill>
    </Backdrop>
  );
};

// Beat 6 (0:20–0:34): sketch on the generated image, describe the mod, before/after.
export const T_MOD = {spoiler: 16, stripes: 64, rims: 100, splitter: 150, prompt: 168, type: 174, go: 252, wipe: 262, after: 296, end: 420};

export const ModScene: React.FC<{t?: typeof T_MOD}> = ({t = T_MOD}) => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const w = boxWidth(L);
  const a = t.wipe;
  const wipe = interpolate(
    frame,
    [a, a + 30, a + 64, a + 82, a + 98, a + 116],
    [0, 1, 1, 0.12, 0.12, 1],
    {...clamp, easing: ease.inOutQuint},
  );
  const labels = interpolate(frame, [a + 30, a + 40], [0, 1], clamp);
  const cues = [
    ...sequenceStrokes(modStrokes.spoiler, t.spoiler, t.stripes - t.spoiler - 4),
    ...sequenceStrokes(modStrokes.stripes, t.stripes, t.rims - t.stripes - 4),
    ...sequenceStrokes(modStrokes.rims, t.rims, t.splitter - t.rims - 4),
    ...sequenceStrokes(modStrokes.splitter, t.splitter, 12),
  ];
  const strokesOut = interpolate(frame, [a, a + 20], [1, 0], clamp);
  return (
    <Backdrop glowAt={[65, 55]}>
      <Headline
        L={L}
        lines={[
          {text: 'Mod it.', at: 6, out: t.after - 14},
          {text: 'Sketch on *anything.*', at: t.after},
        ]}
      />
      <ProductBrowser L={L} enter={-60}>
        <Capture id="imagine-empty" u={L.u} />
        <CanvasBox pad={PAD}>
          <Wipe
            w={wipe}
            u={L.u}
            labels={labels}
            before={<Capture id="sedan-image" u={L.u} />}
            after={
              <>
                <Capture id="sport-image" u={L.u} />
                <Sheen at={a + 14} />
              </>
            }
          />
          <SketchLayer cues={cues} w={w} u={L.u} opacity={strokesOut} />
        </CanvasBox>
      </ProductBrowser>
      <PromptPill L={L} at={t.prompt} go={t.go} out={t.after + 30}>
        <Typewriter text="Mod it: big rear spoiler, twin racing stripes, black rims, lower stance. Track-ready." at={t.type} cps={44} />
      </PromptPill>
    </Backdrop>
  );
};

// Beat 10, 2D half (0:50–0:59): erase the wheels, sketch thrusters, generate.
export const T_THRUST = {erase: 18, thrust: 62, prompt: 140, type: 146, go: 210, wipe: 220, end: 270};

export const ThrusterScene: React.FC<{t?: typeof T_THRUST}> = ({t = T_THRUST}) => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const w = boxWidth(L);
  const wipe = interpolate(frame, [t.wipe, t.wipe + 30], [0, 1], {...clamp, easing: ease.inOutQuint});
  const strokesOut = interpolate(frame, [t.wipe, t.wipe + 20], [1, 0], clamp);
  const exit = interpolate(frame, [t.end - 12, t.end], [0, 1], {...clamp, easing: ease.inExpo});
  return (
    <Backdrop glowAt={[65, 55]}>
      <Headline L={L} lines={[{text: 'Change *anything.*', at: 10}]} />
      <AbsoluteFill style={{opacity: 1 - exit, scale: `${1 - exit * 0.04}`}}>
        <ProductBrowser L={L} enter={-4}>
          <Capture id="imagine-empty" u={L.u} />
          <CanvasBox pad={PAD}>
            <Wipe w={wipe} u={L.u} labels={0} before={<Capture id="sport-image" u={L.u} />} after={<><Capture id="fly-image" u={L.u} /><Sheen at={t.wipe + 14} /></>} />
            <SketchLayer cues={sequenceStrokes(eraseStrokes, t.erase, t.thrust - t.erase - 6)} w={w} u={L.u} opacity={strokesOut * 0.85} stroke={color.moss2} width={22} />
            <SketchLayer cues={sequenceStrokes(thrusterStrokes, t.thrust, t.prompt - t.thrust - 8)} w={w} u={L.u} opacity={strokesOut} />
          </CanvasBox>
        </ProductBrowser>
        <PromptPill L={L} at={t.prompt} go={t.go}>
          <Typewriter text="Remove all four wheels. A glowing jet thruster where each wheel was." at={t.type} cps={48} />
        </PromptPill>
      </AbsoluteFill>
    </Backdrop>
  );
};
