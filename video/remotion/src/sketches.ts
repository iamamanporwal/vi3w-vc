// Vector strokes for every sketch in the film, in a 1000x500 canvas, car side view facing right.
// The capture script draws these same paths in app.vi3w.in, so the lime overlay redraw lines up with the real footage.

const circle = (cx: number, cy: number, r: number) =>
  `M ${cx - r} ${cy} a ${r} ${r} 0 1 0 ${2 * r} 0 a ${r} ${r} 0 1 0 ${-2 * r} 0`;

export const WHEELS = [
  {cx: 250, cy: 340},
  {cx: 760, cy: 340},
];

export const sedanStrokes = [
  // Body: rear bumper, deck, roofline, windshield, hood, nose, sills and wheel arches.
  'M 90 330 L 90 285 C 95 260 120 245 160 240 L 300 232 C 340 180 380 150 450 145 L 610 145 C 660 150 700 185 740 225 L 870 240 C 905 245 925 265 930 295 L 930 335 L 830 340 A 70 70 0 0 0 690 340 L 320 340 A 70 70 0 0 0 180 340 L 90 330',
  // Glasshouse and B-pillar.
  'M 330 232 C 370 182 400 165 455 162 L 600 162 C 640 166 670 190 700 222 L 330 232',
  'M 520 163 L 514 228',
  // Shoulder line.
  'M 140 268 L 905 262',
  ...WHEELS.map(({cx, cy}) => circle(cx, cy, 56)),
];

const spokes = (cx: number, cy: number) =>
  Array.from({length: 5}, (_, i) => {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
    return `M ${cx + Math.cos(a) * 16} ${cy + Math.sin(a) * 16} L ${cx + Math.cos(a) * 46} ${cy + Math.sin(a) * 46}`;
  }).join(' ');

export const modStrokes = {
  spoiler: [
    'M 96 196 L 236 190',
    'M 96 182 L 96 212',
    'M 148 196 L 160 238',
    'M 204 193 L 214 234',
  ],
  stripes: ['M 118 298 L 924 290', 'M 118 312 L 924 304'],
  rims: WHEELS.flatMap(({cx, cy}) => [circle(cx, cy, 16), spokes(cx, cy)]),
  splitter: ['M 830 350 L 948 344'],
};

// Scribble that "erases" each wheel before the thrusters are drawn.
export const eraseStrokes = WHEELS.map(
  ({cx, cy}) =>
    `M ${cx - 55} ${cy - 40} L ${cx + 40} ${cy - 55} L ${cx - 60} ${cy - 15} L ${cx + 55} ${cy - 30} L ${cx - 58} ${cy + 12} L ${cx + 58} ${cy - 2} L ${cx - 50} ${cy + 40} L ${cx + 52} ${cy + 28} L ${cx - 30} ${cy + 58} L ${cx + 40} ${cy + 52}`,
);

export const thrusterStrokes = WHEELS.flatMap(({cx, cy}) => [
  `M ${cx - 48} ${cy - 28} L ${cx + 48} ${cy - 28} L ${cx + 32} ${cy + 22} L ${cx - 32} ${cy + 22} Z`,
  `M ${cx - 40} ${cy - 12} L ${cx + 40} ${cy - 12}`,
  `M ${cx - 16} ${cy + 34} L ${cx - 22} ${cy + 92}`,
  `M ${cx} ${cy + 34} L ${cx} ${cy + 110}`,
  `M ${cx + 16} ${cy + 34} L ${cx + 22} ${cy + 92}`,
]);
