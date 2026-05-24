// Web Audio API engine for Keyboard Kiddies Lessons
class KidsAudioEngine {
  constructor() {
    this.ctx = null;
    this.instruments = {
      piano: 'triangle',
      synth: 'sine',
    };
  }

  // Audio Context must be initialized on user gesture
  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Basic Note Player
  playNote(frequency, duration = 0.5, volume = 0.5) {
    this.init();
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    // Create a warm toy-piano sound using a triangle wave (mellow) and a sine wave (pure)
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);

    // Dynamic compression
    const compressor = this.ctx.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-50, this.ctx.currentTime);
    compressor.knee.setValueAtTime(40, this.ctx.currentTime);
    compressor.ratio.setValueAtTime(12, this.ctx.currentTime);
    compressor.attack.setValueAtTime(0, this.ctx.currentTime);
    compressor.release.setValueAtTime(0.25, this.ctx.currentTime);

    // Tone Envelope: quick attack, smooth decay
    gainNode.gain.setValueAtTime(0, this.ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, this.ctx.currentTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

    // Second oscillator for richness (one octave higher, low volume)
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(frequency * 2, this.ctx.currentTime);
    subGain.gain.setValueAtTime(0, this.ctx.currentTime);
    subGain.gain.linearRampToValueAtTime(volume * 0.25, this.ctx.currentTime + 0.02);
    subGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

    // Connections
    osc.connect(gainNode);
    subOsc.connect(subGain);
    
    gainNode.connect(compressor);
    subGain.connect(compressor);
    
    compressor.connect(this.ctx.destination);

    osc.start();
    subOsc.start();
    osc.stop(this.ctx.currentTime + duration);
    subOsc.stop(this.ctx.currentTime + duration);
  }

  // Play a reward success chime
  playSuccess() {
    this.init();
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (Arpeggio)
    notes.forEach((freq, index) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + index * 0.1);
      
      gain.gain.setValueAtTime(0, now + index * 0.1);
      gain.gain.linearRampToValueAtTime(0.3, now + index * 0.1 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.1 + 0.3);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(now + index * 0.1);
      osc.stop(now + index * 0.1 + 0.32);
    });
  }

  // Play a mistake sound
  playMistake() {
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now); // A3
    osc.frequency.linearRampToValueAtTime(110, now + 0.4); // Slide down
    
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.4);
  }

  // Synthesize Leo the Lion's roar (Dynamics Game)
  // Low frequency rumble. Loud has higher gain and frequency modulation.
  playLeoRoar(isLoud = true) {
    this.init();
    const now = this.ctx.currentTime;
    
    // Low frequency rumble (modulating a sawtooth and bandpass filter)
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(isLoud ? 95 : 65, now);
    // Pitch modulation to simulate growl
    osc.frequency.linearRampToValueAtTime(isLoud ? 60 : 45, now + 0.8);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(isLoud ? 350 : 200, now);
    filter.Q.setValueAtTime(3.0, now);
    
    const volume = isLoud ? 0.8 : 0.15;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(volume, now + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
    
    // Add noise for texture
    const bufferSize = this.ctx.sampleRate * 0.8;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    
    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(isLoud ? 500 : 250, now);
    
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0, now);
    noiseGain.gain.linearRampToValueAtTime(isLoud ? 0.4 : 0.08, now + 0.1);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
    
    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.ctx.destination);
    
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.82);
    noise.start(now);
    noise.stop(now + 0.82);
  }

  // Synthesize Monkey's swings (Pitch Game)
  playMonkeyChirp(isHigh = true) {
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    const startFreq = isHigh ? 1100 : 350;
    const endFreq = isHigh ? 1600 : 450;
    
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.25);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.26);
  }

  // Synthesize Hippo's Beat (Rhythm Game)
  // Clean drum woodblock / deep bass sound
  playHippoBeat(isCowbell = false) {
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    if (isCowbell) {
      // Woodblock / high tap
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, now);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    } else {
      // Deep heavy hippo stamp
      osc.type = 'sine';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.25);
      gain.gain.setValueAtTime(0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    }
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.26);
  }

  // Play celebratory fan-fare on level completion
  playLevelComplete() {
    this.init();
    const now = this.ctx.currentTime;
    // C Major Arpeggio: C4, E4, G4, C5, E5, G5, C6 (super fast) then long chord
    const melody = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
    melody.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      gain.gain.setValueAtTime(0, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.25, now + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.4);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.42);
    });

    // Final triumphant chord: C4, E4, G4, C5
    setTimeout(() => {
      const chord = [261.63, 329.63, 392.00, 523.25];
      chord.forEach(freq => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 1.2);
      });
    }, 600);
  }

  // Play polyphonic C Major (happy) or C Minor (sad) chord
  playChord(isMajor = true) {
    this.init();
    const now = this.ctx.currentTime;
    const root = 261.63; // C4
    const third = isMajor ? 329.63 : 311.13; // E4 or Eb4
    const fifth = 392.00; // G4
    const frequencies = [root, third, fifth];
    
    frequencies.forEach(freq => {
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      
      // Smooth attack and decay envelope
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.18, now + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      
      osc.connect(gainNode);
      gainNode.connect(this.ctx.destination);
      
      osc.start(now);
      osc.stop(now + 1.25);
    });
  }
}

window.kidsAudioEngine = new KidsAudioEngine();
