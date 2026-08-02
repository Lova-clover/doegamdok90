from pathlib import Path
from wave import open as wave_open

import numpy as np


SAMPLE_RATE = 48_000
DURATION_SECONDS = 16
SEED = 90


def write_wav(path: Path, signal: np.ndarray) -> None:
    signal = np.asarray(signal)
    if signal.ndim == 1:
        signal = np.stack([signal, signal], axis=1)
    peak = max(np.max(np.abs(signal)), 1e-9)
    pcm = np.int16(np.clip(signal / peak * 0.58, -1, 1) * 32767)
    with wave_open(str(path), "wb") as wav:
        wav.setnchannels(2)
        wav.setsampwidth(2)
        wav.setframerate(SAMPLE_RATE)
        wav.writeframes(pcm.tobytes())


def periodic_noise(rng: np.random.Generator, seconds: float, low: float, high: float) -> np.ndarray:
    count = int(SAMPLE_RATE * seconds)
    frequencies = np.fft.rfftfreq(count, 1 / SAMPLE_RATE)
    spectrum = np.zeros(frequencies.shape, dtype=np.complex128)
    band = (frequencies >= low) & (frequencies <= high)
    phases = rng.uniform(0, 2 * np.pi, np.count_nonzero(band))
    spectrum[band] = np.exp(1j * phases) / np.sqrt(np.maximum(frequencies[band], 1))
    signal = np.fft.irfft(spectrum, n=count)
    return signal / max(np.max(np.abs(signal)), 1e-9)


def slow_modulation(rng: np.random.Generator, rate: float, depth: float) -> np.ndarray:
    time = np.arange(SAMPLE_RATE * DURATION_SECONDS) / SAMPLE_RATE
    phase = 2 * np.pi * time / DURATION_SECONDS
    cycles = max(1, round(DURATION_SECONDS * rate))
    offsets = rng.uniform(0, 2 * np.pi, 3)
    shape = (
        0.55 * np.sin(cycles * phase + offsets[0])
        + 0.3 * np.sin((cycles + 2) * phase + offsets[1])
        + 0.15 * np.sin((cycles + 5) * phase + offsets[2])
    )
    return 1 + depth * shape


def build_crowd_channel(seed_offset: int) -> np.ndarray:
    rng = np.random.default_rng(SEED + seed_offset)
    time = np.arange(SAMPLE_RATE * DURATION_SECONDS) / SAMPLE_RATE
    rumble = periodic_noise(rng, DURATION_SECONDS, 70, 520) * slow_modulation(rng, 1.3, 0.22)
    murmur = periodic_noise(rng, DURATION_SECONDS, 220, 1_350) * slow_modulation(rng, 2.1, 0.28)
    body = (
        np.sin(2 * np.pi * 73 * time + seed_offset * 0.4)
        + 0.55 * np.sin(2 * np.pi * 109 * time + seed_offset * 0.7)
    ) * slow_modulation(rng, 0.7, 0.32)
    return rumble * 0.62 + murmur * 0.19 + body * 0.052


def add_burst(track: np.ndarray, start: int, burst: np.ndarray) -> None:
    end = min(start + len(burst), len(track))
    if end > start:
        track[start:end] += burst[: end - start]


def build_stadium_rhythm() -> np.ndarray:
    count = SAMPLE_RATE * DURATION_SECONDS
    time = np.arange(count) / SAMPLE_RATE
    left = np.zeros(count)
    right = np.zeros(count)
    beat_seconds = 0.5

    kick_length = int(SAMPLE_RATE * 0.19)
    kick_time = np.arange(kick_length) / SAMPLE_RATE
    kick = (
        np.sin(2 * np.pi * (62 - 19 * kick_time) * kick_time)
        + 0.28 * np.sin(2 * np.pi * 118 * kick_time)
    ) * np.exp(-kick_time * 22)

    clap_length = int(SAMPLE_RATE * 0.12)
    clap_time = np.arange(clap_length) / SAMPLE_RATE
    clap = (
        np.sin(2 * np.pi * 620 * clap_time)
        + 0.55 * np.sin(2 * np.pi * 930 * clap_time)
        + 0.25 * np.sin(2 * np.pi * 1_240 * clap_time)
    ) * np.exp(-clap_time * 36)

    for beat in range(int(DURATION_SECONDS / beat_seconds)):
        start = int(beat * beat_seconds * SAMPLE_RATE)
        add_burst(left, start, kick * (0.34 if beat % 4 == 0 else 0.19))
        add_burst(right, start + 80, kick * (0.31 if beat % 4 == 0 else 0.17))
        if beat % 2 == 1:
            add_burst(left, start, clap * 0.17)
            add_burst(right, start + 150, clap * 0.2)

    chant_phase = 2 * np.pi * time / DURATION_SECONDS
    phrase = np.maximum(0, np.sin(8 * chant_phase)) ** 1.7
    chant_left = (np.sin(2 * np.pi * 165 * time) + 0.42 * np.sin(2 * np.pi * 220 * time)) * phrase
    chant_right = (np.sin(2 * np.pi * 168 * time + 0.4) + 0.4 * np.sin(2 * np.pi * 224 * time)) * phrase
    left += chant_left * 0.055
    right += chant_right * 0.055
    return np.stack([left, right], axis=1)


def build_transition_hit() -> np.ndarray:
    duration = 0.42
    time = np.arange(int(SAMPLE_RATE * duration)) / SAMPLE_RATE
    sweep = np.sin(2 * np.pi * (210 + 620 * time) * time) * np.exp(-time * 9)
    thump = np.sin(2 * np.pi * 74 * time) * np.exp(-time * 17)
    signal = sweep * 0.24 + thump * 0.7
    return np.stack([signal, np.roll(signal, 90)], axis=1)


def build_whistle() -> np.ndarray:
    duration = 0.72
    time = np.arange(int(SAMPLE_RATE * duration)) / SAMPLE_RATE
    envelope = np.sin(np.pi * np.clip(time / duration, 0, 1)) ** 1.4
    vibrato = 32 * np.sin(2 * np.pi * 8.5 * time)
    signal = (
        np.sin(2 * np.pi * (2_480 + vibrato) * time)
        + 0.38 * np.sin(2 * np.pi * (2_930 + vibrato) * time)
    ) * envelope
    return np.stack([signal, np.roll(signal, 18)], axis=1)


def build_goal_roar() -> np.ndarray:
    duration = 3.3
    rng = np.random.default_rng(SEED + 900)
    time = np.arange(int(SAMPLE_RATE * duration)) / SAMPLE_RATE
    noise_left = periodic_noise(rng, duration, 90, 1_650)
    noise_right = periodic_noise(rng, duration, 100, 1_720)
    envelope = np.clip(time / 0.24, 0, 1) * np.exp(-time * 0.34)
    pulse = 0.84 + 0.16 * np.sin(2 * np.pi * 3.1 * time)
    harmonic_left = np.sin(2 * np.pi * 176 * time) + 0.45 * np.sin(2 * np.pi * 232 * time)
    harmonic_right = np.sin(2 * np.pi * 181 * time + 0.3) + 0.42 * np.sin(2 * np.pi * 238 * time)
    left = (noise_left * 0.7 + harmonic_left * 0.12) * envelope * pulse
    right = (noise_right * 0.7 + harmonic_right * 0.12) * envelope * pulse
    return np.stack([left, right], axis=1)


def build_click() -> np.ndarray:
    time = np.arange(int(SAMPLE_RATE * 0.09)) / SAMPLE_RATE
    click = (
        np.sin(2 * np.pi * 1_350 * time)
        + 0.45 * np.sin(2 * np.pi * 2_100 * time)
    ) * np.exp(-time * 55)
    return np.stack([click, np.roll(click, 28)], axis=1)


def main() -> None:
    audio_root = Path(__file__).resolve().parent.parent / "public" / "audio"
    audio_root.mkdir(parents=True, exist_ok=True)

    crowd = np.stack([build_crowd_channel(0), build_crowd_channel(11)], axis=1)
    assets = {
        "stadium-crowd.wav": crowd,
        "stadium-rhythm.wav": build_stadium_rhythm(),
        "transition-hit.wav": build_transition_hit(),
        "referee-whistle.wav": build_whistle(),
        "goal-roar.wav": build_goal_roar(),
        "ui-click.wav": build_click(),
    }
    for filename, signal in assets.items():
        output = audio_root / filename
        write_wav(output, signal)
        print(f"generated {output.name}: {len(signal) / SAMPLE_RATE:.2f}s, stereo, {SAMPLE_RATE}Hz")


if __name__ == "__main__":
    main()
