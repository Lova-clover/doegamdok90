from pathlib import Path
from wave import open as wave_open

import numpy as np

SAMPLE_RATE = 48_000
DURATION_SECONDS = 16
SEED = 90


def filtered_noise(rng: np.random.Generator, low: float, high: float) -> np.ndarray:
    sample_count = SAMPLE_RATE * DURATION_SECONDS
    frequencies = np.fft.rfftfreq(sample_count, 1 / SAMPLE_RATE)
    spectrum = np.zeros(frequencies.shape, dtype=np.complex128)
    band = (frequencies >= low) & (frequencies <= high)
    phases = rng.uniform(0, 2 * np.pi, np.count_nonzero(band))
    spectrum[band] = np.exp(1j * phases) / np.sqrt(np.maximum(frequencies[band], 1))
    signal = np.fft.irfft(spectrum, n=sample_count)
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


def build_channel(seed_offset: int) -> np.ndarray:
    rng = np.random.default_rng(SEED + seed_offset)
    time = np.arange(SAMPLE_RATE * DURATION_SECONDS) / SAMPLE_RATE
    rumble = filtered_noise(rng, 70, 520) * slow_modulation(rng, 1.3, 0.22)
    murmur = filtered_noise(rng, 220, 1_350) * slow_modulation(rng, 2.1, 0.3)
    body = (
        np.sin(2 * np.pi * 73 * time + seed_offset * 0.4)
        + 0.55 * np.sin(2 * np.pi * 109 * time + seed_offset * 0.7)
    ) * slow_modulation(rng, 0.7, 0.35)
    signal = rumble * 0.62 + murmur * 0.2 + body * 0.055
    return signal


def main() -> None:
    audio_root = Path(__file__).resolve().parent.parent / "public" / "audio"
    output = audio_root / "stadium-crowd.wav"
    stereo = np.stack([build_channel(0), build_channel(11)], axis=1)
    stereo *= 0.58 / max(np.max(np.abs(stereo)), 1e-9)
    pcm = np.int16(np.clip(stereo, -1, 1) * 32767)
    with wave_open(str(output), "wb") as wav:
        wav.setnchannels(2)
        wav.setsampwidth(2)
        wav.setframerate(SAMPLE_RATE)
        wav.writeframes(pcm.tobytes())
    print(f"generated {output} ({DURATION_SECONDS}s, stereo, {SAMPLE_RATE}Hz)")

    click_time = np.arange(int(SAMPLE_RATE * 0.09)) / SAMPLE_RATE
    click = (
        np.sin(2 * np.pi * 1_350 * click_time)
        + 0.45 * np.sin(2 * np.pi * 2_100 * click_time)
    ) * np.exp(-click_time * 55)
    click *= 0.42 / max(np.max(np.abs(click)), 1e-9)
    click_stereo = np.stack([click, np.roll(click, 28)], axis=1)
    click_pcm = np.int16(np.clip(click_stereo, -1, 1) * 32767)
    click_output = audio_root / "ui-click.wav"
    with wave_open(str(click_output), "wb") as wav:
        wav.setnchannels(2)
        wav.setsampwidth(2)
        wav.setframerate(SAMPLE_RATE)
        wav.writeframes(click_pcm.tobytes())
    print(f"generated {click_output} (clean UI click)")


if __name__ == "__main__":
    main()
