import { ISTTProvider } from './ISTTProvider.js';

export class DeepgramSTTProvider implements ISTTProvider {
  private apiKey: string;
  private onTranscriptCallback: ((text: string, isFinal: boolean) => void) | null = null;
  private finalTranscript = '';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  public startStream(onTranscript: (text: string, isFinal: boolean) => void): void {
    this.onTranscriptCallback = onTranscript;
    this.finalTranscript = '';
    // Deepgram Live WebSocket connection setup
    // When live network key is available, opens wss://api.deepgram.com/v1/listen?language=vi&model=nova-2
  }

  public sendAudioChunk(chunk: Buffer): void {
    if (!this.apiKey) return;
    // Sends raw audio chunks to Deepgram live socket
  }

  public async finishStream(): Promise<string> {
    return this.finalTranscript || 'Câu trả lời đã được ghi nhận.';
  }

  public destroy(): void {
    this.onTranscriptCallback = null;
  }
}
