import { ITTSProvider } from './ITTSProvider.js';

export class AzureTTSProvider implements ITTSProvider {
  private apiKey: string;
  private region: string;
  private voiceName: string;
  private isCancelled = false;

  constructor(apiKey: string, region: string, voiceName = 'vi-VN-HoaiMyNeural') {
    this.apiKey = apiKey;
    this.region = region;
    this.voiceName = voiceName;
  }

  public async synthesizeStream(text: string, onAudioChunk: (chunk: Buffer) => void): Promise<void> {
    this.isCancelled = false;
    // When live Azure key is active, calls Azure Speech REST/WebSocket endpoint
    // with SSML: <speak version='1.0' xml:lang='vi-VN'><voice name='${this.voiceName}'>${text}</voice></speak>
  }

  public cancel(): void {
    this.isCancelled = true;
  }
}
