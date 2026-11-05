import { ISTTProvider } from './ISTTProvider.js';

export class MockSTTProvider implements ISTTProvider {
  private onTranscriptCallback: ((text: string, isFinal: boolean) => void) | null = null;
  private accumulatedBytes = 0;
  private sampleAnswer = 'Dạ thưa anh, em xin trả lời: kiến thức này bao gồm các nguyên lý hướng đối tượng, cơ chế quản lý bộ nhớ và tối ưu truy vấn cơ sở dữ liệu.';

  constructor(customAnswer?: string) {
    if (customAnswer) {
      this.sampleAnswer = customAnswer;
    }
  }

  public setSampleAnswer(answer: string): void {
    this.sampleAnswer = answer;
  }

  public startStream(onTranscript: (text: string, isFinal: boolean) => void): void {
    this.onTranscriptCallback = onTranscript;
    this.accumulatedBytes = 0;
  }

  public sendAudioChunk(chunk: Buffer): void {
    this.accumulatedBytes += chunk.length;

    // Simulate incremental speech recognition as audio is received
    if (this.onTranscriptCallback && this.accumulatedBytes > 3200) {
      const words = this.sampleAnswer.split(' ');
      const progressRatio = Math.min(1.0, this.accumulatedBytes / 16000);
      const wordsToShow = Math.max(1, Math.floor(words.length * progressRatio));
      const partial = words.slice(0, wordsToShow).join(' ');
      this.onTranscriptCallback(partial, false);
    }
  }

  public async finishStream(): Promise<string> {
    if (this.onTranscriptCallback) {
      this.onTranscriptCallback(this.sampleAnswer, true);
    }
    return this.sampleAnswer;
  }

  public destroy(): void {
    this.onTranscriptCallback = null;
    this.accumulatedBytes = 0;
  }
}
