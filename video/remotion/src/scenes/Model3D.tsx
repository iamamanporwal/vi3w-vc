import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {clamp, color, ease, font} from '../brand';
import {useLayout} from '../layout';
import {Backdrop} from '../components/Backdrop';
import {Capture} from '../components/Capture';
import {Kinetic} from '../components/Kinetic';
import {CanvasBox, ProductBrowser, PromptPill, stageRects} from '../components/Stage';
import {Car} from '../three/Car';
import {CarVariant} from '../three/ProxyCar';
import {StudioFloor, StudioLights} from '../three/Studio';

// Beat 7 (0:34–0:44) and the 3D half of beat 10: the image lifts off the screen as a lime wireframe,
// fills in to a solid model and turns on a studio turntable.
export const T_3D = {go: 12, lift: 26, wireEnd: 130, head: 70, export: 228, end: 300};

export const Model3DScene: React.FC<{
  variant: CarVariant;
  image: 'sport-image' | 'fly-image';
  t?: typeof T_3D;
  headline?: string;
  file?: string;
  showBrowser?: boolean;
}> = ({variant, image, t = T_3D, headline = 'Ship it in *3D.*', file = 'sports_car.glb', showBrowser = true}) => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const {u} = L;
  const lift = interpolate(frame, [t.lift, t.lift + 30], [0, 1], {...clamp, easing: ease.inOutQuint});
  const wire = interpolate(frame, [t.lift + 10, t.wireEnd], [1, 0], {...clamp, easing: ease.inOutSine});
  const orbit = interpolate(frame, [t.lift, t.end], [0, 1], {...clamp, easing: ease.inOutSine});
  const toast = interpolate(frame, [t.export, t.export + 14], [0, 1], {...clamp, easing: ease.outBack});
  const {head} = stageRects(L);

  // Camera starts square to the side (matching the 2D image), then swings to a hero three-quarter.
  const ang = orbit * 0.95;
  const dist = (L.portrait ? 9.2 : 6.6) - orbit * 0.6;
  const camY = 0.9 + orbit * 0.7;
  const scanX = interpolate(wire, [0, 1], [2.4, -2.4]);
  const carX = L.format === '16x9' ? 0.55 : 0;

  return (
    <Backdrop glowAt={[60, 60]} glowOpacity={0.6 + lift * 0.3}>
      <AbsoluteFill style={{opacity: lift}}>
        <ThreeCanvas
          width={L.width}
          height={L.height}
          camera={{fov: 30, position: [0, 1, 7]}}
          onCreated={({camera}) => camera.lookAt(0, 0.5, 0)}
        >
          <CameraRig angle={ang} dist={dist} y={camY} />
          <StudioLights sweep={orbit} lime={0.3} />
          <StudioFloor opacity={lift} />
          <group position={[carX, 0, 0]}>
            <Car variant={variant} wire={wire} />
            {wire > 0.02 && wire < 0.98 && (
              <mesh position={[scanX, 0.65, 0]}>
                <boxGeometry args={[0.02, 1.6, 2.2]} />
                <meshBasicMaterial color={color.lime} transparent opacity={0.85} />
              </mesh>
            )}
          </group>
        </ThreeCanvas>
      </AbsoluteFill>

      {showBrowser && (
        <AbsoluteFill style={{opacity: 1 - lift, scale: `${1 + lift * 0.15}`, filter: `blur(${lift * 8}px)`}}>
          <ProductBrowser L={L} enter={-60}>
            <Capture id="imagine-empty" u={u} />
            <CanvasBox pad={0.06}>
              <Capture id={image} u={u} />
            </CanvasBox>
          </ProductBrowser>
          <PromptPill L={L} at={-20} go={t.go} goLabel="Generate 3D" label="Image → 3D">
            <span style={{color: color.moss}}>Turn this image into a 3D model</span>
          </PromptPill>
        </AbsoluteFill>
      )}

      <div style={{position: 'absolute', left: head.x, top: L.portrait ? head.y : head.y - 40, width: head.w}}>
        <Kinetic text={headline} at={t.head} size={head.size} />
      </div>

      <div
        style={{
          position: 'absolute',
          left: L.width / 2,
          top: L.portrait ? L.safe.y + L.safe.h - 90 * u : L.height - 150 * u,
          translate: `-50% ${(1 - toast) * 30}px`,
          opacity: toast,
          display: 'flex',
          alignItems: 'center',
          gap: 14 * u,
          padding: `${16 * u}px ${26 * u}px`,
          borderRadius: 999,
          background: 'rgba(18,19,20,0.94)',
          border: `1px solid ${color.moss3}`,
          fontFamily: font,
          fontWeight: 600,
          fontSize: 26 * u,
          color: color.bone,
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{color: color.lime, fontWeight: 800}}>✓</span> {file} <span style={{color: color.moss}}>exported</span>
      </div>
    </Backdrop>
  );
};

// angle 0 = square side view (camera on +z); positive angles swing toward the car's front (+x).
export const CameraRig: React.FC<{angle: number; dist: number; y: number; look?: [number, number, number]}> = ({
  angle,
  dist,
  y,
  look = [0, 0.55, 0],
}) => {
  const camera = useThree((s) => s.camera);
  camera.position.set(Math.sin(angle) * dist, y, Math.cos(angle) * dist);
  camera.lookAt(...look);
  return null;
};
