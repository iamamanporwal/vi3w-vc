import {Easing, staticFile} from 'remotion';
import {loadFont} from '@remotion/fonts';

// Bundled locally (public/fonts, SIL OFL) so renders never depend on a font CDN.
loadFont({family: 'Urbanist', url: staticFile('fonts/Urbanist-VF.ttf'), weight: '100 900'});

export const font = `Urbanist, "Helvetica Neue", Arial, sans-serif`;

// Tokens from brief/vi3w-investor-brief.html. Lime is an accent only.
export const color = {
  ink: '#0B0B0C',
  ink2: '#121314',
  ink3: '#1A1C1B',
  lime: '#D4F77C',
  bone: '#E2E6DA',
  moss: '#8E9686',
  moss2: '#585E54',
  moss3: '#3A3F36',
  olive: '#2E3A12',
  white: '#FFFFFF',
};

export const FPS = 30;
// Music guide is 120 BPM: one beat = 15 frames, one bar = 60 frames.
export const BEAT = 15;
export const BAR = 60;

export const ease = {
  outExpo: Easing.bezier(0.16, 1, 0.3, 1),
  inOutQuint: Easing.bezier(0.83, 0, 0.17, 1),
  outBack: Easing.bezier(0.34, 1.56, 0.64, 1),
  inExpo: Easing.bezier(0.7, 0, 0.84, 0),
  inOutSine: Easing.bezier(0.37, 0, 0.63, 1),
};

export const clamp = {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
} as const;
