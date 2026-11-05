export interface ITTSProvider {
  synthesizeStream(text: string, onAudioChunk: (chunk: Buffer) => void): Promise<void>;
  cancel(): void;
}
