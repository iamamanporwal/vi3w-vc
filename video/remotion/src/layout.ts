import {useVideoConfig} from 'remotion';

export type Format = '16x9' | '9x16' | '4x5' | '5x4';

export const FORMATS: Record<Format, {width: number; height: number}> = {
  '16x9': {width: 1920, height: 1080},
  '9x16': {width: 1080, height: 1920},
  '4x5': {width: 1080, height: 1350},
  '5x4': {width: 1350, height: 1080},
};

export type Layout = {
  format: Format;
  width: number;
  height: number;
  portrait: boolean;
  // Rectangle where critical text/UI may live (platform UI avoided).
  safe: {x: number; y: number; w: number; h: number};
  // Base unit for type sizes: scales with the short side.
  u: number;
};

export const useLayout = (): Layout => {
  const {width, height} = useVideoConfig();
  const format: Format =
    width === 1920 ? '16x9' : height === 1920 ? '9x16' : height === 1350 ? '4x5' : '5x4';
  const safe =
    format === '9x16'
      ? {x: 60, y: 220, w: width - 60 - 120, h: height - 220 - 420}
      : format === '4x5'
        ? {x: 60, y: 60, w: width - 120, h: height - 120}
        : {x: 96, y: 72, w: width - 192, h: height - 144};
  return {
    format,
    width,
    height,
    portrait: height > width,
    safe,
    u: Math.min(width, height) / 1080,
  };
};
