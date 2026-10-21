// Renders the hero voiceover lines with ElevenLabs into remotion/public/audio/vo/.
// Reads the key from ELEVENLABS_API_KEY (never commit it). Voice: ELEVENLABS_VOICE_ID.
// Usage: node video/tools/make_vo.mjs
import fs from 'node:fs';
import path from 'node:path';

const key = process.env.ELEVENLABS_API_KEY;
const voice = process.env.ELEVENLABS_VOICE_ID;
if (!key || !voice) throw new Error('Set ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID');

const src = fs.readFileSync(new URL('../remotion/src/vo.ts', import.meta.url), 'utf8');
const cues = [...src.matchAll(/id: '(vo\d+)', at: \d+, text: ['"](.+?)['"], file/g)].map((m) => ({id: m[1], text: m[2]}));
const out = new URL('../remotion/public/audio/vo/', import.meta.url);
fs.mkdirSync(out, {recursive: true});

for (const {id, text} of cues) {
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}?output_format=mp3_44100_192`, {
    method: 'POST',
    headers: {'xi-api-key': key, 'content-type': 'application/json'},
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {stability: 0.55, similarity_boost: 0.8, style: 0.35, use_speaker_boost: true},
    }),
  });
  if (!res.ok) throw new Error(`${id}: ${res.status} ${await res.text()}`);
  fs.writeFileSync(path.join(out.pathname, `${id}.mp3`), Buffer.from(await res.arrayBuffer()));
  console.log('wrote', id);
}
