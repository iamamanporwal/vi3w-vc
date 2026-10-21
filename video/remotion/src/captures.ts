// Real footage and stills recorded from app.vi3w.in (see video/assets/capture-log.md).
// null = not captured yet; the film shows a labelled placeholder in its place.
export const captures = {
  'imagine-empty': null as string | null, // Imagine canvas before sketching
  'sedan-image': null as string | null, // generated basic M3-style sedan
  'sport-image': null as string | null, // sketch-edit result: sports car
  'fly-image': null as string | null, // sketch-edit result: thrusters instead of wheels
};

export type CaptureId = keyof typeof captures;

// Real GLBs exported from Vi3W, in public/models. null = use the clearly-labelled proxy car.
export const models = {
  sport: null as string | null,
  fly: null as string | null,
};
