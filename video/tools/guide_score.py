"""Temp guide score + SFX for the Vi3W hero film (120 BPM, 80 s).

This is a timing guide for the animatic only. It must be replaced by a licensed or
ElevenLabs-generated track before release (see video/CREDITS.md).

Usage: python3 -I video/tools/guide_score.py <out.wav>
"""
import sys
import wave

import numpy as np

SR = 48000
FPS = 30
DUR = 80.0
BPM = 120
BEAT = 60 / BPM
N = int(SR * DUR)
rng = np.random.default_rng(7)


def f2s(frame):
    return int(frame / FPS * SR)


def env(n, a=0.005, d=0.3):
    t = np.arange(n) / SR
    e = np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / d)
    return e


def band(x, lo, hi):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    X[(f < lo) | (f > hi)] = 0
    return np.fft.irfft(X, len(x))


def add(buf, sig, at, gain=1.0):
    s = f2s(at) if isinstance(at, (int, np.integer)) else int(at * SR)
    e = min(len(buf), s + len(sig))
    if s < len(buf):
        buf[s:e] += sig[: e - s] * gain


def kick():
    n = int(0.45 * SR)
    t = np.arange(n) / SR
    f = 45 + 110 * np.exp(-t * 28)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.001, 0.18)


def hat():
    n = int(0.08 * SR)
    return band(rng.standard_normal(n), 7000, 16000) * env(n, 0.0005, 0.02)


def note(freq, length, a=0.01, d=0.5, saw=False):
    n = int(length * SR)
    t = np.arange(n) / SR
    if saw:
        sig = sum(np.sin(2 * np.pi * freq * k * t) / k for k in range(1, 9))
    else:
        sig = np.sin(2 * np.pi * freq * t) + 0.3 * np.sin(2 * np.pi * freq * 2.001 * t)
    return sig * env(n, a, d)


def pad(freqs, length):
    n = int(length * SR)
    t = np.arange(n) / SR
    sig = sum(np.sin(2 * np.pi * f * t) + np.sin(2 * np.pi * f * 1.004 * t) for f in freqs) / len(freqs)
    fade = np.minimum(1, np.minimum(t / 0.6, (length - t) / 0.6))
    return sig * fade


def whoosh(length=0.7, rise=True):
    n = int(length * SR)
    x = band(rng.standard_normal(n), 300, 6000)
    t = np.linspace(0, 1, n)
    shape = np.sin(np.pi * (t if rise else 1 - t) ** 0.7) ** 2
    return x * shape


def ping():
    return (note(1318.5, 0.6, 0.001, 0.12) + 0.6 * note(1975.5, 0.6, 0.001, 0.08)) * 0.5


def click():
    n = int(0.03 * SR)
    return band(rng.standard_normal(n), 2000, 9000) * env(n, 0.0002, 0.006)


def sub_hit():
    n = int(1.2 * SR)
    t = np.arange(n) / SR
    return np.sin(2 * np.pi * (38 + 30 * np.exp(-t * 6)) * t) * env(n, 0.002, 0.5)


music = np.zeros(N)
sfx = np.zeros(N)

# Chords (A minor): Am F C G, one per bar.
CH = [[220, 261.6, 329.6], [174.6, 220, 261.6], [196, 261.6, 329.6], [196, 246.9, 293.7]]
BASS = [55, 43.65, 65.4, 49]

sections = [
    # (start_frame, end_frame, level, drums)
    (0, 240, 0.35, False),  # night: pad only
    (240, 1410, 1.0, True),  # main groove
    (1500, 1860, 0.8, True),  # thrusters build
    (1860, 2190, 1.25, True),  # finale drop
    (2190, 2400, 0.4, False),  # resolve
]
bar = 4 * BEAT
for s, e, lvl, drums in sections:
    t0, t1 = s / FPS, e / FPS
    b = 0
    t = t0
    while t < t1 - 0.01:
        L = min(bar, t1 - t)
        i = int(round(t / bar)) % 4
        add(music, pad([f / 2 for f in CH[i]] + CH[i], L) * 0.16 * lvl, t)
        if drums:
            for k in range(4):
                bt = t + k * BEAT
                if bt >= t1:
                    break
                add(music, kick() * 0.9 * lvl, bt)
                add(music, hat() * 0.25 * lvl, bt + BEAT / 2)
                add(music, note(BASS[i], BEAT * 0.9, 0.005, 0.25, saw=True) * 0.22 * lvl, bt + BEAT / 2)
        b += 1
        t += bar

# Low piano note at the very top.
add(music, note(110, 3, 0.002, 1.2) * 0.4, 0)

# SFX cues (global frames).
for f in (104, 134):
    add(sfx, ping(), f, 0.5)
add(sfx, sub_hit(), 150, 0.9)
for f in range(212, 234, 2):
    add(sfx, click(), f, 0.35)
add(sfx, click(), 236, 0.6)
add(sfx, whoosh(0.5), 236, 0.35)
add(sfx, whoosh(0.6), 330 + 204, 0.3)  # generate
add(sfx, whoosh(0.8), 600 + 262, 0.35)  # mod reveal
add(sfx, whoosh(0.9), 1020 + 26, 0.4)  # lift to 3D
add(sfx, ping(), 1020 + 228, 0.45)  # export chime
add(sfx, ping(), 1320 + 4, 0.4)
add(sfx, ping(), 1320 + 40, 0.4)
add(sfx, ping(), 1410 + 26, 0.4)
add(sfx, sub_hit(), 1410 + 50, 1.0)
add(sfx, whoosh(0.8), 1500 + 220, 0.35)
add(sfx, whoosh(1.4, rise=True), 1860 + 4, 0.5)  # ignition
add(sfx, whoosh(0.9, rise=False), 1860 + 262, 0.6)  # pass-by

mix = music * 0.8 + sfx
mix /= np.max(np.abs(mix)) + 1e-9
mix *= 0.89
fade = np.ones(N)
fade[-SR:] = np.linspace(1, 0, SR)
mix *= fade
stereo = np.stack([mix, mix], axis=1)
pcm = (stereo * 32767).astype(np.int16)
with wave.open(sys.argv[1], "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print("wrote", sys.argv[1])
