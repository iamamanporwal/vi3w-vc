# Vi3W launch films

The brief is in `LAUNCH_VIDEO_PROMPT.md`. The Remotion source is in `remotion/`.

```bash
cd video/remotion
npm ci
npx remotion skills add                              # optional: Remotion agent skills
python3 -I ../tools/guide_score.py /tmp/raw.wav && \
  ffmpeg -y -i /tmp/raw.wav -af loudnorm=I=-14:TP=-1.5 public/audio/guide.wav   # temp guide track
npx remotion studio                                  # preview
npx remotion render Hero-16x9 ../out/vi3w-launch-80s-16x9.mp4 --codec h264 --crf 18
```

Compositions: `Hero-16x9`, `Hero-9x16`, `Hero-4x5` and `Hero-5x4` (80 s). The 45 s `Social-*` cut is next.

## Swapping in real footage
- Put stills and clips from app.vi3w.in in `remotion/public/capture/`. List them in `remotion/src/captures.ts` (`imagine-empty`, `sedan-image`, `sport-image`, `fly-image`).
- Put the GLBs exported from Vi3W in `remotion/public/models/` and list them in `captures.ts` under `models`. The proxy car is for look-dev only and must not ship.
- The sketch strokes are in `remotion/src/sketches.ts`. The capture script draws these same paths in Imagine so the lime overlay lines up with the footage.

## Review loop
The iteration logs are `review/iteration-XX.md` and the contact sheets are in `storyboard/`.
