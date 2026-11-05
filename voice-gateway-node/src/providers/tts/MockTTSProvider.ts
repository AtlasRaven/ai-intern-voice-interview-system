import { ITTSProvider } from './ITTSProvider.js';

export class MockTTSProvider implements ITTSProvider {
  private isCancelled = false;

  public async synthesizeStream(text: string, onAudioChunk: (chunk: Buffer) => void): Promise<void> {
    this.isCancelled = false;

    // Generate a valid 16kHz 16-bit Mono WAV header + PCM chunks
    const sampleRate = 16000;
    const durationSec = Math.max(1.5, Math.min(6.0, text.length * 0.05));
    const totalSamples = Math.floor(sampleRate * durationSec);
    const chunkSize = 3200; // 100ms per chunk

    // Send WAV header chunk first
    const wavHeader = this.createWavHeader(sampleRate, totalSamples);
    onAudioChunk(wavHeader);

    for (let i = 0; i < totalSamples; i += (chunkSize / 2)) {
      if (this.isCancelled) {
        break;
      }

      const chunkSamples = Math.min(chunkSize / 2, totalSamples - i);
      const buffer = Buffer.alloc(chunkSamples * 2);

      for (let s = 0; s < chunkSamples; s++) {
        const t = (i + s) / sampleRate;
        // Generate soft simulated speech melody (harmonic sine frequencies 300Hz and 600Hz with amplitude envelope)
        const envelope = Math.sin((Math.PI * (i + s)) / totalSamples);
        const wave = (Math.sin(2 * Math.PI * 320 * t) * 0.6 + Math.sin(2 * Math.PI * 640 * t) * 0.4) * envelope;
        const val = Math.floor(wave * 8000);
        buffer.writeInt16LE(val, s * 2);
      }

      onAudioChunk(buffer);

      // Simulate network streaming cadence (delay between chunks)
      await new Promise((resolve) => setTimeout(resolve, 80));
    }
  }

  public cancel(): void {
    this.isCancelled = true;
  }

  private createWavHeader(sampleRate: number, totalSamples: number): Buffer {
    const header = Buffer.alloc(44);
    const byteRate = sampleRate * 2;
    const dataSize = totalSamples * 2;
    const chunkSize = 36 + dataSize;

    header.write('RIFF', 0);
    header.writeUInt32LE(chunkSize, 4);
    header.write('WAVE', 8);
    header.write('fmt ', 12);
    header.writeUInt32LE(16, 16);          // Subchunk1Size (16 for PCM)
    header.writeUInt16LE(1, 20);           // AudioFormat (1 for PCM)
    header.writeUInt16LE(1, 22);           // NumChannels (1 mono)
    header.writeUInt32LE(sampleRate, 24);  // SampleRate
    header.writeUInt32LE(byteRate, 28);    // ByteRate
    header.writeUInt16LE(2, 32);           // BlockAlign (2 bytes)
    header.writeUInt16LE(16, 34);          // BitsPerSample
    header.write('data', 36);
    header.writeUInt32LE(dataSize, 40);

    return header;
  }
}
