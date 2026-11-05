export interface ISTTProvider {
  startStream(onTranscript: (text: string, isFinal: boolean) => void): void;
  sendAudioChunk(chunk: Buffer): void;
  finishStream(): Promise<string>;
  destroy(): void;
}
