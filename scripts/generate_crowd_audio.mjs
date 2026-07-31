import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const sampleRate = 22_050;
const durationSeconds = 16;
const sampleCount = sampleRate * durationSeconds;
const pcm = new Int16Array(sampleCount);
let seed = 0x5f3759df;
let body = 0;
let rumble = 0;

const random = () => {
  seed = (Math.imul(seed, 1_664_525) + 1_013_904_223) >>> 0;
  return seed / 0x1_0000_0000;
};

for (let index = 0; index < sampleCount; index += 1) {
  const time = index / sampleRate;
  const white = random() * 2 - 1;
  body = body * 0.82 + white * 0.18;
  rumble = rumble * 0.985 + white * 0.015;

  const standWave =
    Math.sin(time * Math.PI * 2 * 0.071) * 0.16 +
    Math.sin(time * Math.PI * 2 * 0.113 + 1.7) * 0.11;
  const chantPulse = 0.74 + Math.sin(time * Math.PI * 2 * 0.19) * 0.12 + standWave;
  const edgeSeconds = Math.min(time, durationSeconds - time);
  const edgeFade = Math.min(1, Math.max(0, edgeSeconds / 0.35));
  const sample = (body * 0.48 + rumble * 0.62) * chantPulse * edgeFade;

  pcm[index] = Math.max(-32_767, Math.min(32_767, Math.round(sample * 6_200)));
}

const dataBytes = pcm.byteLength;
const wav = Buffer.alloc(44 + dataBytes);
wav.write("RIFF", 0);
wav.writeUInt32LE(36 + dataBytes, 4);
wav.write("WAVE", 8);
wav.write("fmt ", 12);
wav.writeUInt32LE(16, 16);
wav.writeUInt16LE(1, 20);
wav.writeUInt16LE(1, 22);
wav.writeUInt32LE(sampleRate, 24);
wav.writeUInt32LE(sampleRate * 2, 28);
wav.writeUInt16LE(2, 32);
wav.writeUInt16LE(16, 34);
wav.write("data", 36);
wav.writeUInt32LE(dataBytes, 40);

for (let index = 0; index < pcm.length; index += 1) {
  wav.writeInt16LE(pcm[index], 44 + index * 2);
}

const outputPath = resolve("app/public/assets/stadium-crowd-loop-v1.wav");
await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, wav);
console.log(`Generated ${outputPath} (${wav.length} bytes)`);
