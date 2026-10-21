# Vi3W Launch Video: Master Prompt

> Paste everything below the line into a fresh Claude Code session started in this repository (`vi3w-vc`).
> Before you start, connect or have ready: **Figma** (optional), **HyperFrames by HeyGen** (optional), an **ElevenLabs** API key for SFX and voice (optional), and a **Vi3W login** for `app.vi3w.in` with enough generation credits for about 15 runs.

---

## 0. Who you are

You are the **creative director, storyboard artist, motion designer, 3D lighter and Remotion engineer** for the launch film of **Vi3W**. Hold yourself to the standard of a Disney/Pixar creative director who also ships Apple-keynote-grade product films. Every frame should look like it came from a billion-dollar SaaS company's launch, the level of Apple, Linear, Vercel Ship, Figma Config or Arc. It should never look like a template, a stock explainer or "AI slop".

You have taste and you defend it. You make the calls a director makes: what to cut, where the music hits, how long a beat breathes, what the hero shot is. You also do all of the hands-on work yourself: research, script, storyboard, product capture, animation, 3D, sound, render and review.

You do not stop at "good". You run a disciplined **self-critique and improvement loop** (Section 9) until the film scores a strict 10/10 or you have completed 10 improvement iterations.

## 1. The product

- **Vi3W** (pronounced "view") is a **sketch-to-3D platform**. Anyone can sketch, turn the sketch into a polished concept image, edit that image by sketching on it and writing instructions, and then generate a production-ready 3D model (GLB) from it.
- Live app: **https://app.vi3w.in**. The image generation and editing area is called **Imagine**.
- Audience: **3D artists, 3D/graphics engineers and game developers**, especially small studios and indie teams with no dedicated 3D artist, who are always under deadline pressure for 3D assets.
- Positioning: Vi3W handles the **whole sketch → image → edit → 3D journey**. It is not just "another text-to-3D generator". The edit loop (sketch on the image, then describe the change) is the differentiator, and the film must make it obvious.
- **Emotional core / tagline: _"We built Vi3W so 3D artists can catch more sleep."_**

### Brand system (do not deviate)

Read `brief/vi3w-investor-brief.html` and `assets/` to confirm these.

| Token | Value | Use |
|---|---|---|
| Ink (background) | `#0B0B0C` | Base of nearly every frame |
| Lime (accent) | `#D4F77C` | Sketch strokes, cursor, highlighted words, thruster glow. **Use it sparingly, only as a highlight** |
| Bone (text) | `#E2E6DA` | Primary text on dark |
| Moss greys | `#8E9686`, `#585E54`, `#3A3F36` | Secondary text, UI chrome, grids |
| Deep olive | `#2E3A12` | Lime-tinted shadows and glows |
| Typeface | **Urbanist** (Google Fonts), weights 400/600/800 | All on-screen type. Tight tracking on headlines (-2% to -4%) |
| Logo | `assets/vi3w-logo.png`, `assets/vi3w-logo-dark.webp` | End card and title card only |

## 2. Deliverables

Make two cuts in three aspect ratios: **6 master files**, all built from **one Remotion codebase** with shared scenes and layouts that adapt to each ratio. Do not simply crop or letterbox one master.

| Cut | Length | 16:9 (1920×1080) | 9:16 (1080×1920) | 4:5 (1080×1350) |
|---|---|---|---|---|
| **Hero film** | 1:20 (80.0 s) | `vi3w-launch-80s-16x9.mp4` | `vi3w-launch-80s-9x16.mp4` | `vi3w-launch-80s-4x5.mp4` |
| **Social cut** | 0:45 (45.0 s) | `vi3w-launch-45s-16x9.mp4` | `vi3w-launch-45s-9x16.mp4` | `vi3w-launch-45s-4x5.mp4` |

> Note: the founder said "5:4". The platform-standard feed format is **4:5 portrait (1080×1350)**, used by Instagram and LinkedIn feeds, so build 4:5. Also expose a 5:4 (1350×1080) composition in the code so it can be rendered later if they really meant landscape. Don't spend iteration time on it.

**Technical spec (all files)**
- H.264 High profile, `yuv420p`, **30 fps** (60 fps optional for the 16:9 hero if renders allow), CRF ≤ 18 or about 16–20 Mbps for 1080p.
- AAC 48 kHz stereo at 320 kbps. Loudness **-14 LUFS integrated**, true peak ≤ **-1 dBTP**. Check with `ffmpeg -af ebur128`.
- **Burned-in captions** on the 9:16 and 4:5 versions, because most people watch muted. Also export an `.srt` for 16:9.
- A clean **poster frame / thumbnail** PNG for each cut and ratio.
- **Safe zones:** in 9:16, keep critical text and UI out of the top ~220 px and bottom ~420 px (TikTok and Reels UI) and the right ~120 px (action buttons). In 4:5, keep a 60 px margin all around.
- Output folder: `video/out/`. Source: `video/remotion/`. Captured footage and models: `video/assets/` (large binaries go in `.gitignore` or Git LFS. Ask before committing anything over 50 MB).

## 3. Hard rules (honesty and legal)

1. **Never fake the product.** Every Vi3W screen, generated image and 3D model in the film must come from **real runs of app.vi3w.in**. You may restyle the *framing* of real footage: float it in 3D space, crop, zoom, speed-ramp, add cursor highlights, re-time it. You may not invent UI that doesn't exist or swap in outputs that Vi3W didn't produce. If a generation comes out weak, re-run it with a better sketch or prompt and keep the best real result.
2. If a Vi3W feature you need (for example sketching on a generated image) doesn't work the way this brief describes, **stop and tell the founder** what exists, and propose the closest honest alternative.
3. **Trademarks:** the demo subject is an *M3-style German sports sedan*. You may use "BMW M3" in the generation prompt. In the final film, make sure **no BMW roundel or badge is legible**, and never write "BMW" in on-screen copy. Call it "the car" or "a sports sedan" on screen. Show other tools (Blender, Slack, etc.) only as **generic, unbranded** recreations: a generic 3D viewport with a grey default cube, and a generic chat UI. Don't use their logos or names.
4. **Music and SFX must be licensed or generated.** Use royalty-free tracks with a license you record in `video/CREDITS.md`, or generate SFX and music with ElevenLabs. Never use copyrighted music.
5. Don't block on credentials. If the Vi3W login, credits or an API key is missing, ask once with a precise list of what you need. Meanwhile, keep working on everything that doesn't depend on it (research, script, storyboard, the motion system, chat and title scenes).

## 4. Phase 1: Taste research (before writing anything)

Study how the best companies sell creative and dev tools. For each reference, use web search and fetch. Where a video can't be watched, study stills, case studies and frame grabs. Write `video/research/taste-board.md` with **what specifically to steal**: shot types, transition grammar, type treatment, pacing in seconds per shot, color, music structure and hook in the first 3 seconds.

Minimum reference set:
- **Apple** product films and keynote product reveals: hero 3D turntables, light sweeps, restraint.
- **Linear** launch and "Linear Method" films: dark UI, precise micro-motion, typography.
- **Vercel Ship / Next.js Conf** openers: kinetic type, grid systems, black and one accent.
- **Figma Config** keynote openers and feature launches: UI as a character, playful cursors.
- **Arc / The Browser Company**: human, funny, character-driven product storytelling.
- **Spline**, **Meshy**, **Tripo**, **Luma AI**, **Kaedim**, **Adobe Firefly / Substance 3D**: how 3D and AI-3D tools show "generation". Note what looks cheap and what looks premium.
- **Pixar shorts** (for example *Piper*, *Bao*) and **Disney story principles**: a clear want, a rising obstacle, a twist and an emotional button ending. Apply the **12 principles of animation** (anticipation, follow-through, squash and stretch on UI, slow in/slow out, arcs, staging, appeal).

Finish with a **one-page Director's Treatment** (`video/research/treatment.md`) covering: logline, tone in three words, a color script (how the palette shifts across the film), music direction (BPM, structure and where the drops land), the camera language, the transition motif, and the three "frames people will screenshot".

## 5. Phase 2: Story and script

### The story (founder's concept, which you must preserve)

A game developer messages a 3D artist: _"Need a car model. In one hour."_ The artist is stuck in a traditional 3D tool. Instead, they open **app.vi3w.in**, **sketch** a car, generate a **basic sedan**, then **sketch on top of the generated image** and type an instruction to mod it into a **sports car** (rear spoiler, racing stripes, new rims, aggressive stance). The before and after must be **dramatically, obviously different**. Then they generate the **3D model**. Plot twist: the developer messages again, _"Now it needs to fly."_ The artist goes back to **Imagine**, **removes all four tires**, puts **thrusters** where each wheel was, and generates again. The film ends on a cinematic **3D motion-graphics sequence of the car flying**, then the tagline: _"We built Vi3W so 3D artists can catch more sleep."_

You may sharpen the copy, jokes and pacing. The beats above are fixed.

### Characters
- **The Dev**: only seen as chat messages (avatar initial "R", generic chat UI). Short, urgent, slightly guilty.
- **The Artist**: shown through their screen, cursor, hands (optional) and a few environment cues: 2:47 AM clock, cold coffee, monitor glow. Exhausted but competent. **The cursor is a character.** Give it personality: hesitation, then confident strokes.

### Hero film: beat sheet (80 s = 2400 frames at 30 fps)

Treat timings as targets. Adjust them to the music during the edit, but keep the total exactly 80.0 s.

| # | Time | Beat | Picture | On-screen copy / captions | Sound |
|---|---|---|---|---|---|
| 1 | 0:00–0:03 | **Cold open: the pain** | Black. A monitor fades up in a dark room. A generic 3D viewport shows a lonely grey **default cube**. The clock reads **2:47 AM**. Slow push-in. | `2:47 AM` (small, top-left, typewriter) | Room tone, faint fan hum, one low piano note |
| 2 | 0:03–0:06 | **The ask** | A chat notification springs in with an overshoot ease. | **R:** "Need a car model for the level." → "In one hour. 🙏" | Notification ping, then a heartbeat-like sub hit on "one hour" |
| 3 | 0:06–0:08 | **The stare** | The cursor drifts to the cube and hesitates. The cube slowly rotates, mocking. A quick cut: the artist's cursor opens a browser tab and types `app.vi3w.in`. | — | Key clicks, a breath of silence |
| 4 | 0:08–0:11 | **Title sting** | The URL text morphs into the **Vi3W logo**. A lime line draws itself across the frame (the **"line becomes object" motif** starts here). | `Vi3W`, then `Sketch to 3D.` | Music kicks in (beat 1) |
| 5 | 0:11–0:20 | **Sketch → basic car** | Real capture of **Imagine**: a lime stroke sketches a sedan silhouette (time-lapse, smoothed). A prompt is typed. Hit Generate. The image resolves with a soft light sweep. Camera: floating UI panel tilted ~8°, slow dolly. | `Sketch it.` | Pencil scratch SFX synced to the strokes, whoosh on generate |
| 6 | 0:20–0:34 | **Mod it (the money shot #1)** | On top of the generated sedan, the cursor **sketches** a spoiler, stripe lines and rim circles in lime. It types: _"Mod it: add a big rear spoiler, twin racing stripes, black multi-spoke rims, lower the stance, make it look track-ready."_ Generate. Then a **split-screen wipe, before ⇄ after**, that sweeps across the car twice. The difference must be unmistakable. | `Mod it.` / `Sketch on anything.` | Riser into a drop on the reveal |
| 7 | 0:34–0:44 | **Image → 3D** | Click **Generate 3D**. Transition: the 2D image **lifts off the screen** into a lime **wireframe** that fills to a solid shaded model (real GLB from Vi3W) and turns on a turntable with a studio light sweep. Export clicked. | `Ship it in 3D.` | Mechanical "lock-in" hit, then a satisfying export chime |
| 8 | 0:44–0:47 | **Delivery** | Chat: the artist drags `sports_car.glb` into the chat. **R:** "🔥 perfect." | — | Message whoosh |
| 9 | 0:47–0:50 | **Plot twist** | Beat of silence. A new message types slowly: **R:** "…ok one more thing." → "It needs to fly. 😅" | `It needs to fly.` (big, center) | Music cuts to silence, record scratch or sub-drop |
| 10 | 0:50–1:02 | **Thrusters** | Back to **Imagine** with the sports car. The cursor **erases/masks all four wheels** and sketches **jet-thruster nozzles** at each wheel position (lime strokes). It types: _"Remove all four wheels completely. Replace each wheel with a glowing jet thruster pointing down. Keep the body, spoiler and stripes."_ Generate, then a quick wipe reveal. Then **Generate 3D**: a faster version of the beat 7 wireframe transition, with the rhythm accelerating. | `Change anything.` | Music returns, bigger, building |
| 11 | 1:02–1:13 | **Finale: it flies (the money shot #2)** | Full-screen cinematic 3D using the **real flying-car GLB**. The thrusters ignite (lime and white emissive glow, heat shimmer, particle exhaust). The car lifts off a reflective dark floor, the camera orbits, it **dives through a lime wireframe grid / sketch-line tunnel** that reprises the motif, and passes the camera with motion blur. One speed-ramped hero moment. | — | Full drop, engine and thruster whoosh, doppler pass-by |
| 12 | 1:13–1:20 | **Button + end card** | Hard cut to the quiet room. The monitor shows `Exported ✓`, the clock reads **3:21 AM**, the artist's chair is empty, and the room light dims as if they went to bed. Fade to the end card. | `We built Vi3W so 3D artists can catch more sleep.` → logo, `app.vi3w.in`, `Start sketching, free.` | Music resolves. Soft final note. Optional tiny snore SFX as a Pixar-style button |

### Social cut: beat sheet (45 s = 1350 frames)

Designed **9:16-first**. Hook in the **first 1.5 s**. Captions on every line.

| Time | Beat |
|---|---|
| 0:00–0:02 | Chat: "Need a car model. In one hour." over the default cube. Text slams in: `One hour?` |
| 0:02–0:04 | `app.vi3w.in` → logo sting |
| 0:04–0:11 | Sketch → basic sedan (time-lapsed) |
| 0:11–0:20 | Sketch on the image + "Mod it…" → before/after wipe (hold the after for 1 s) |
| 0:20–0:25 | Image → wireframe → 3D turntable |
| 0:25–0:27 | "It needs to fly. 😅" |
| 0:27–0:33 | Remove wheels → thrusters → 3D |
| 0:33–0:40 | Flying-car finale (a shorter edit of hero beat 11) |
| 0:40–0:45 | Tagline + logo + `app.vi3w.in` |

### Voiceover (optional, decide in iteration 1)

Default to **no voiceover**: music, SFX and kinetic type carry the film, Apple-style. If you test a VO, write at most 25 words for the hero, generate it with ElevenLabs (calm, wry, mid-30s), and keep it only if it measurably improves the "Story clarity" score.

## 6. Phase 3: Storyboard (before any animation)

1. Produce a **storyboard frame for every beat, in all three ratios**. Build each as a static Remotion still (`npx remotion still`) using placeholder boxes and real brand type. Save them to `video/storyboard/{cut}/{ratio}/beat-XX.png`.
2. Assemble a **contact sheet** per ratio (`video/storyboard/contact-{cut}-{ratio}.png`, using ffmpeg `tile`) and an **animatic**: a quick render of the stills timed to the music.
3. For each frame, write a line in `video/storyboard/shotlist.md`: shot type, camera move, easing, transition in and out, the frame's focal point, and how the layout re-composes for 9:16 and 4:5. **Re-compose, don't crop.** In 9:16, stack the UI panel above the caption. In 4:5, scale the UI to about 88% width.
4. Review the storyboard against the rubric (Section 9) **before** capturing footage, and fix story problems here because they're cheap now.

## 7. Phase 4: Real product capture on app.vi3w.in

Use Playwright with the pre-installed Chromium (`executablePath: '/opt/pw-browsers/chromium'` if needed) to drive **app.vi3w.in** for real.

- Viewport **1920×1080 at `deviceScaleFactor: 2`**, so the footage stays crisp when zoomed. Use `recordVideo` at full size, and also save **PNG frames** for the key states.
- **Hide everything that looks unfinished**: dev banners, cookie bars, the personal email and avatar (replace them with a neutral "Vi3W Studio" label using CSS injected only into the capture), and the browser chrome (record the page, then draw your own minimal browser frame in Remotion).
- **Draw the sketches programmatically** so they look human and beautiful: generate smooth Bézier paths for the sedan silhouette, the spoiler, stripes, rim circles and thruster nozzles, add slight jitter and pressure variation, and play them back with `page.mouse` moves at a natural speed (accelerating and decelerating, not linear). Record a separate high-res **vector version** of the same strokes so Remotion can redraw them in lime on top of the footage when you need perfect lines.
- **Generation runs** (keep every output, and choose the best):
  1. Sketch + prompt → basic car. Suggested prompt: _"Stock BMW M3 sedan, clean studio shot, three-quarter front view, neutral grey paint, soft studio lighting, plain dark background."_ Run 3–5 variants and pick the cleanest silhouette.
  2. Sketch-on-image + mod prompt (beat 6) → sports car. Push for **maximum visible difference**: a big wing, bold stripes in a contrasting color, dark rims, a lowered stance. Re-run until the change is obvious at thumbnail size.
  3. Sports car → **Generate 3D** → download the GLB.
  4. Remove wheels + thrusters prompt (beat 10) → flying-car image. Make sure **all four** wheels are gone and the thrusters are clearly visible.
  5. Flying car → **Generate 3D** → download the GLB.
- Log every prompt, seed (if exposed), the time each generation took, and the chosen output in `video/assets/capture-log.md`. **Real generation times are a marketing asset.** If they're impressively short, show a subtle on-screen timer.
- If you can't log in or you run out of credits, stop and ask the founder (see Section 3.5).

## 8. Phase 5: Build in Remotion

Set up `video/remotion/` with `npx create-video@latest` (TypeScript, blank) and install the official Remotion agent skills (`npx skills add remotion-dev/skills`). **Read and follow those skills.**

**Architecture**
- `src/brand.ts`: color tokens, the font (`@remotion/google-fonts/Urbanist`), spacing and easing curves. Define named easings such as `easeOutExpo`, `easeInOutQuint` and `spring({damping: 200})` for UI. **No linear easing on anything that moves**, except the text cursor blink and camera drift.
- `src/layout.ts`: a `useFormat()` hook that returns `'16x9' | '9x16' | '4x5' | '5x4'` plus safe-zone rectangles. Every scene reads it and **re-composes**.
- `src/scenes/`: one component per beat (`ColdOpen`, `ChatMessage`, `TitleSting`, `ImagineSketch`, `ModIt`, `BeforeAfterWipe`, `ImageTo3D`, `PlotTwist`, `Thrusters`, `FlyingFinale`, `EndCard`).
- `src/components/`: `FloatingBrowser` (3D-tilted, with soft shadow and reflection), `LimeStroke` (animated SVG path with `evolvePath`, a pressure-width taper and a soft glow), `KineticHeadline` (staggered word and character reveals, masked slide-ups), `ChatBubble`, `Cursor` (custom, with click ripples and motion trails), `Captions` (word-by-word highlight using `@remotion/captions`).
- `src/Root.tsx`: register **compositions for every cut × format**: `Hero-16x9`, `Hero-9x16`, `Hero-4x5`, `Hero-5x4`, `Social-16x9`, `Social-9x16`, `Social-4x5`, `Social-5x4`.

**3D**
- Use `@remotion/three` + `@react-three/fiber` + `@react-three/drei` (`useGLTF`, `Environment`, `ContactShadows`, `MeshReflectorMaterial`) to render the **real Vi3W GLBs**.
- Wireframe → solid transition: a custom shader or a material crossfade with a sweeping lime scan line, using the 2D→3D "lift" from the beat 7 spec.
- Flying finale: emissive thruster cones, an additive particle exhaust (instanced points driven by `useCurrentFrame()`, which must be **deterministic** with no `Math.random()` at render time; use seeded noise from `@remotion/noise`), heat-shimmer via a distortion pass if feasible, camera on a spline path, `@remotion/motion-blur` (`<CameraMotionBlur>`) on the fast pass-by, and a tunnel of lime sketch lines that reprises the motif.
- Lighting: a three-point studio rig plus an HDRI that doesn't fight the dark brand. The car paint must look **expensive**: clearcoat, sharp highlights, no flat shading. If the GLB's materials are weak, you may tune the **material and lighting** in the scene, but **never edit the geometry**. The model must stay Vi3W's real output.

**Transitions (the grammar)**
1. **Line becomes object**: a lime stroke draws, then morphs into the next scene's key shape. This is the signature, so use it 3–4 times, not everywhere.
2. **Match cuts** on shape and position (default cube → car silhouette, wheel → thruster).
3. **Masked wipes** for before and after.
4. **Hard cuts to silence** for comedy (the plot twist and the end-room button).

Avoid generic cross-dissolves, spinning 3D cubes, lens-flare spam and stock "glitch" transitions.

**Sound**
- Pick or generate music at **~110–124 BPM** with a clear intro, a build, a drop at the title sting, a breakdown at the plot twist and a bigger second drop at the finale. Put beat markers in `src/beats.ts` and **cut on the beat**.
- SFX layer: pencil strokes, UI clicks, notification pings, whooshes, a mechanical lock-in, thruster ignition, a doppler pass and room tone. Use ElevenLabs sound effects or a licensed library, and record each license in `CREDITS.md`.
- Mix: duck the music by 4–6 dB under key SFX, and master to -14 LUFS.

**Render**
- `npx remotion render <Composition> video/out/<file>.mp4 --codec h264 --crf 18 --pixel-format yuv420p --audio-bitrate 320k`.
- Verify with `ffprobe` (duration exact, resolution, fps, codec) and `ffmpeg -af ebur128` (loudness) after every render.

## 9. Phase 6: Self-critique and improvement loop (mandatory)

You can't watch a video the way a human does, so **review renders as evidence**:
- **Contact sheets**: extract a frame every 0.5 s (`ffmpeg -vf fps=2,scale=480:-1,tile=8x…`) for each master, and look at them.
- **Transition strips**: for every transition and hero motion, extract 8–12 consecutive frames and look at them as a strip. Judge easing, arcs, motion blur, overshoot and continuity.
- **Hero stills** at full resolution for beats 6, 7, 11 and 12 (the "screenshot frames").
- **Thumbnail test**: scale key frames down to 320 px wide. Are the before/after difference and the headline still readable?
- **Audio checks**: loudness stats, plus a waveform image (`showwavespic`) with beat markers overlaid, to verify cuts land on beats.
- **Fresh-eyes review**: in every iteration, also spawn a **separate reviewer subagent** that gets only the contact sheets, strips, rubric and target references (not your reasoning) and scores independently. Where you and the reviewer differ by more than 1 point on a dimension, the **lower score counts**.

### Rubric (each dimension is scored 0–10. The weighted total is the film's score out of 10)

| # | Dimension | Weight | A 10 means… |
|---|---|---|---|
| 1 | **Hook (first 3 s)** | 10% | A stranger scrolling would stop. The pain is instantly relatable to a 3D artist or game dev |
| 2 | **Story and emotional arc** | 12% | Clear want → obstacle → twist → payoff. The tagline lands as an emotional button, not a slogan |
| 3 | **Product clarity** | 14% | A first-time viewer can explain the sketch → image → sketch-edit → 3D loop afterwards. The "sketch on the image" edit is unmistakable |
| 4 | **Before/after impact** | 8% | The basic car → sports car → flying car changes are dramatic and readable at thumbnail size |
| 5 | **Motion craft** | 12% | Every move uses intentional easing, arcs, follow-through and overshoot. No linear motion, jitter or dead frames. Transitions feel inevitable |
| 6 | **Visual design and composition** | 10% | Strong focal point in every frame. Brand palette discipline (lime only as accent). Typography is crisp, kerned and well set |
| 7 | **3D finale quality** | 10% | The flying-car sequence looks like a high-end studio made it: lighting, materials, particles, camera and motion blur |
| 8 | **Pacing and music sync** | 8% | Cuts and hits land on the beat. The film breathes where it should. Nothing overstays |
| 9 | **Format adaptation** | 8% | Each of 16:9, 9:16 and 4:5 looks natively composed. All text is inside safe zones. Captions are elegant and accurate |
| 10 | **Technical polish and honesty** | 8% | Spec-exact files, no artifacts, banding, aliasing or blurry UI. Every product shot is a real Vi3W output. Licenses are recorded |

**Scoring discipline (to prevent self-inflation)**
- Every score must cite **specific evidence** (a frame number or timecode) for what keeps it from being one point higher.
- Write the scores *before* writing the fixes.
- A **10/10 overall** requires **every dimension ≥ 9.5**, **zero open issues** of severity "high" or "medium", and the fresh-eyes reviewer agreeing. Expect the first full render to score around 5–6. That's normal.
- Compare against the Phase 1 references honestly: "Would Apple, Linear or Pixar ship this frame?" If not, it isn't a 10.

### The loop

```
iteration = 0
render all 6 masters → review → score (you + reviewer)
while iteration < 10 and score < 10.0:
    iteration += 1
    1. Write video/review/iteration-XX.md:
       - scores table (you, reviewer, final) with evidence
       - the 5–10 highest-leverage problems, ranked by (score gain ÷ effort)
       - the concrete change plan for each (file, component, what changes)
    2. Implement the changes. Re-capture product footage if the problem is in the footage.
    3. Re-render (the hero 16:9 every iteration; all 6 masters at least on iterations 3, 6, 9 and the final one)
    4. Re-review and re-score. Add before/after stills of the changed frames to the iteration log
    5. If the score went down, revert the regression and log why
    6. Commit: "video: iteration XX (score A.B → C.D)" and push
```

- Run **all 10 iterations** unless a genuine, rule-compliant 10/10 is reached earlier.
- Each iteration must change something **meaningful**. Iterations that only nudge parameters don't count. If you're stuck on a dimension for 2 iterations, change the *approach* (a different shot, transition or music section), not just the values.
- Keep `video/review/SCOREBOARD.md` updated with a table: iteration, total score, the 10 dimension scores, the top change made, and the commit hash.

## 10. Final handover

When the loop ends, deliver:
1. The 6 MP4s in `video/out/` (plus the poster PNGs and the `.srt`), and a short spec table from `ffprobe` showing they match Section 2.
2. `video/review/SCOREBOARD.md` with the score progression, and the final iteration log with honest remaining weaknesses. If it's not a 10, say exactly what would make it one and what you'd need (better footage, a paid music track, a voice actor, etc.).
3. `video/CREDITS.md` with all music, SFX and font licenses.
4. A one-paragraph **director's note** to the founder: the creative choices made, what to post where (16:9 → YouTube/X/LinkedIn/website hero, 9:16 → Reels/TikTok/Shorts, 4:5 → Instagram/LinkedIn feed), and suggested first-line captions for each platform.
5. Commit everything (except oversized binaries; ask first) and push to the working branch.

Start with Phase 1 now. Before Phase 4, confirm that you have Vi3W login access. If you don't, ask for it in one message and keep working on Phases 1–3 and the motion system while you wait.
