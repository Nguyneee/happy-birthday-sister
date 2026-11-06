/**
 * Birthday Music Box & Sound Effects Synthesizer using Web Audio API
 * 100% self-contained, no external audio file dependencies needed!
 */

class BirthdayAudio {
    constructor() {
        this.ctx = null;
        this.isPlaying = false;
        this.isMuted = false;
        this.melodyTimeout = null;
        this.currentNoteIndex = 0;
        this.gainNode = null;

        // Note frequencies in Hz
        this.notes = {
            'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23,
            'G4': 392.00, 'A4': 440.00, 'Bb4': 466.16, 'B4': 493.88,
            'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46,
            'G5': 783.99, 'A5': 880.00, 'Bb5': 932.33, 'C6': 1046.50
        };

        // "Happy Birthday" melody with duration in beats (1 beat ~ 0.5s)
        this.melody = [
            // "Happy Birthday to you"
            { note: 'C4', dur: 0.75, chord: ['F4', 'A4'] },
            { note: 'C4', dur: 0.25 },
            { note: 'D4', dur: 1.0 },
            { note: 'C4', dur: 1.0 },
            { note: 'F4', dur: 1.0, chord: ['A4', 'C5'] },
            { note: 'E4', dur: 2.0 },

            // "Happy Birthday to you"
            { note: 'C4', dur: 0.75, chord: ['C4', 'G4'] },
            { note: 'C4', dur: 0.25 },
            { note: 'D4', dur: 1.0 },
            { note: 'C4', dur: 1.0 },
            { note: 'G4', dur: 1.0, chord: ['B4', 'D5'] },
            { note: 'F4', dur: 2.0 },

            // "Happy Birthday dear sister"
            { note: 'C4', dur: 0.75, chord: ['F4', 'C5'] },
            { note: 'C4', dur: 0.25 },
            { note: 'C5', dur: 1.0 },
            { note: 'A4', dur: 1.0, chord: ['D4', 'F4'] },
            { note: 'F4', dur: 1.0 },
            { note: 'E4', dur: 1.0 },
            { note: 'D4', dur: 2.0, chord: ['Bb4', 'D5'] },

            // "Happy Birthday to you"
            { note: 'Bb4', dur: 0.75, chord: ['G4', 'C5'] },
            { note: 'Bb4', dur: 0.25 },
            { note: 'A4', dur: 1.0, chord: ['F4', 'C5'] },
            { note: 'F4', dur: 1.0 },
            { note: 'G4', dur: 1.0, chord: ['C4', 'E4'] },
            { note: 'F4', dur: 2.5, chord: ['F4', 'A4', 'C5'] }
        ];
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
            this.gainNode = this.ctx.createGain();
            this.gainNode.gain.value = 0.35;
            this.gainNode.connect(this.ctx.destination);
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    // Play a single bell/music box chime note
    playChimeNote(freq, startTime, duration = 1.2, volume = 0.3) {
        if (!this.ctx || this.isMuted) return;

        const osc = this.ctx.createOscillator();
        const oscHarmonic = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();

        // Music box / Celeste tone: Sine + Triangle harmonic
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        oscHarmonic.type = 'triangle';
        oscHarmonic.frequency.setValueAtTime(freq * 2.01, startTime); // Slight detune for shimmer

        // Envelope: instant soft attack, gentle exponential decay
        noteGain.gain.setValueAtTime(0.0001, startTime);
        noteGain.gain.linearRampToValueAtTime(volume, startTime + 0.02);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        osc.connect(noteGain);
        oscHarmonic.connect(noteGain);
        noteGain.connect(this.gainNode);

        osc.start(startTime);
        oscHarmonic.start(startTime);
        osc.stop(startTime + duration);
        oscHarmonic.stop(startTime + duration);
    }

    // Play the full looping melody
    startMelody() {
        this.init();
        this.isPlaying = true;
        this.currentNoteIndex = 0;
        this.playNextNote();
    }

    playNextNote() {
        if (!this.isPlaying || !this.ctx) return;

        const item = this.melody[this.currentNoteIndex];
        const tempo = 480; // ms per beat
        const now = this.ctx.currentTime;
        const durationSec = (item.dur * tempo) / 1000;

        // Play melody note
        const freq = this.notes[item.note];
        if (freq) {
            this.playChimeNote(freq, now, durationSec * 1.5, 0.32);
        }

        // Play gentle chord backing if present
        if (item.chord && !this.isMuted) {
            item.chord.forEach((chordNote, idx) => {
                const chordFreq = this.notes[chordNote];
                if (chordFreq) {
                    this.playChimeNote(chordFreq, now + 0.03 * (idx + 1), durationSec * 1.8, 0.12);
                }
            });
        }

        this.currentNoteIndex = (this.currentNoteIndex + 1) % this.melody.length;

        // Schedule next note
        const pauseBetweenLoops = (this.currentNoteIndex === 0) ? 2200 : 0;
        this.melodyTimeout = setTimeout(() => {
            if (this.isPlaying) {
                this.playNextNote();
            }
        }, item.dur * tempo + pauseBetweenLoops);
    }

    stopMelody() {
        this.isPlaying = false;
        if (this.melodyTimeout) {
            clearTimeout(this.melodyTimeout);
            this.melodyTimeout = null;
        }
    }

    togglePlay() {
        if (this.isPlaying) {
            this.stopMelody();
            return false;
        } else {
            this.startMelody();
            return true;
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.gainNode) {
            this.gainNode.gain.value = this.isMuted ? 0 : 0.35;
        }
        return this.isMuted;
    }

    // Celebratory fanfare sound when candles are blown out!
    playFanfare() {
        this.init();
        if (this.isMuted) return;

        const now = this.ctx.currentTime;
        const fanfareNotes = [
            { f: 523.25, t: 0.00, d: 0.3 }, // C5
            { f: 659.25, t: 0.12, d: 0.3 }, // E5
            { f: 783.99, t: 0.24, d: 0.3 }, // G5
            { f: 1046.50, t: 0.36, d: 0.9 }, // C6
            { f: 880.00, t: 0.52, d: 0.5 }, // A5
            { f: 1046.50, t: 0.70, d: 1.5 }, // C6
            { f: 1318.51, t: 0.70, d: 1.8 }  // E6 shimmer
        ];

        fanfareNotes.forEach(n => {
            this.playChimeNote(n.f, now + n.t, n.d, 0.38);
        });
    }

    // Interactive soft click/pop sound
    playPop() {
        this.init();
        if (this.isMuted) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.08);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        osc.connect(gain);
        gain.connect(this.gainNode);
        osc.start(now);
        osc.stop(now + 0.08);
    }
}

window.birthdayAudio = new BirthdayAudio();
