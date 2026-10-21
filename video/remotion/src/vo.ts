// Voiceover cues for the hero film (global frames at 30 fps). Strong, low, unhurried trailer read.
// `file` is the ElevenLabs render in public/audio/vo/; null until generated.
export type VoCue = {id: string; at: number; text: string; file: string | null};

export const HERO_VO: VoCue[] = [
  {id: 'vo01', at: 8, text: "It's two forty-seven A.M.", file: null},
  {id: 'vo02', at: 160, text: 'One hour. For a car that doesn’t exist yet.', file: null},
  {id: 'vo03', at: 250, text: 'So skip the blank cube.', file: null},
  {id: 'vo04', at: 345, text: 'Sketch it. Vi3W turns your lines into a real concept.', file: null},
  {id: 'vo05', at: 615, text: 'Then draw on it. Tell it what to change.', file: null},
  {id: 'vo06', at: 1050, text: 'One click, and it’s a real 3D model.', file: null},
  {id: 'vo07', at: 1515, text: 'Plans change. So change anything.', file: null},
  {id: 'vo08', at: 2085, text: 'From a sketch… to something that flies.', file: null},
  {id: 'vo09', at: 2240, text: 'Vi3W. So 3D artists can finally catch some sleep.', file: null},
];
