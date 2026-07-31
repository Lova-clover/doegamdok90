const createPinkNoiseBuffer = (context, seconds = 4) => {
  const frameCount = context.sampleRate * seconds;
  const buffer = context.createBuffer(2, frameCount, context.sampleRate);

  for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
    const data = buffer.getChannelData(channel);
    let b0 = 0;
    let b1 = 0;
    let b2 = 0;
    let b3 = 0;
    let b4 = 0;
    let b5 = 0;
    let b6 = 0;

    for (let index = 0; index < frameCount; index += 1) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.969 * b2 + white * 0.153852;
      b3 = 0.8665 * b3 + white * 0.3104856;
      b4 = 0.55 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.016898;
      data[index] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.1;
      b6 = white * 0.115926;
    }
  }

  return buffer;
};

const createMediaAmbience = async () => {
  const audio = new Audio("/assets/stadium-crowd-loop-v1.wav");
  let celebrationTimer = null;
  audio.loop = true;
  audio.preload = "auto";
  audio.volume = 0.24;
  await audio.play();

  return {
    celebrate() {
      if (celebrationTimer) window.clearTimeout(celebrationTimer);
      audio.volume = 0.78;
      celebrationTimer = window.setTimeout(() => {
        audio.volume = 0.24;
        celebrationTimer = null;
      }, 1700);
    },
    stop() {
      if (celebrationTimer) window.clearTimeout(celebrationTimer);
      audio.pause();
      audio.currentTime = 0;
      audio.src = "";
    },
  };
};

const createWebAudioAmbience = async () => {
  const AudioContext = window.AudioContext ?? window.webkitAudioContext;
  if (!AudioContext) return null;

  const context = new AudioContext();
  const source = context.createBufferSource();
  const highpass = context.createBiquadFilter();
  const lowpass = context.createBiquadFilter();
  const master = context.createGain();
  const lfo = context.createOscillator();
  const lfoDepth = context.createGain();

  source.buffer = createPinkNoiseBuffer(context);
  source.loop = true;
  highpass.type = "highpass";
  highpass.frequency.value = 85;
  lowpass.type = "lowpass";
  lowpass.frequency.value = 1450;
  lowpass.Q.value = 0.45;
  master.gain.value = 0.032;
  lfo.type = "sine";
  lfo.frequency.value = 0.08;
  lfoDepth.gain.value = 0.009;

  source.connect(highpass);
  highpass.connect(lowpass);
  lowpass.connect(master);
  lfo.connect(lfoDepth);
  lfoDepth.connect(master.gain);
  master.connect(context.destination);

  await context.resume();
  source.start();
  lfo.start();

  return {
    celebrate() {
      const now = context.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(Math.max(0.001, master.gain.value), now);
      master.gain.exponentialRampToValueAtTime(0.13, now + 0.08);
      master.gain.exponentialRampToValueAtTime(0.032, now + 1.8);
    },
    stop() {
      try {
        source.stop();
        lfo.stop();
      } catch {
        // The audio nodes may already be stopped during React development cleanup.
      }
      void context.close();
    },
  };
};

export async function createCrowdAmbience() {
  try {
    return await createMediaAmbience();
  } catch (mediaError) {
    const ambience = await createWebAudioAmbience();
    if (ambience) return ambience;
    throw mediaError;
  }
}
