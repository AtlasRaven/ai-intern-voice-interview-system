import { describe, it, expect, vi } from 'vitest';
import { MockSTTProvider } from '../providers/stt/MockSTTProvider.js';
import { MockTTSProvider } from '../providers/tts/MockTTSProvider.js';
import { MockLLMProvider } from '../providers/llm/MockLLMProvider.js';

describe('Mock Providers Test Suite', () => {
  it('MockSTTProvider should handle stream callbacks and finish', async () => {
    const stt = new MockSTTProvider();
    const onTranscription = vi.fn();

    stt.startStream(onTranscription);
    stt.sendAudioChunk(Buffer.from([0, 1, 2, 3]));

    // wait for mock timeout
    await new Promise((resolve) => setTimeout(resolve, 150));
    const result = await stt.finishStream();
    expect(result).toBeDefined();
    expect(typeof result).toBe('string');
  });

  it('MockTTSProvider should synthesize audio stream and support cancellation', async () => {
    const tts = new MockTTSProvider();
    const chunks: Buffer[] = [];

    const streamPromise = tts.synthesizeStream('Xin chào', (chunk) => {
      chunks.push(chunk);
    });

    // Cancel after slight delay
    setTimeout(() => {
      tts.cancel();
    }, 90);

    await streamPromise;
    expect(chunks.length).toBeGreaterThan(0);
  });

  it('MockLLMProvider should generate follow-up and evaluate rubric', async () => {
    const llm = new MockLLMProvider();
    const followUp = await llm.generateFollowUp('Java Intern', 'OOP là gì?', 'Gồm 4 tính chất OOP');
    expect(followUp).toBeDefined();
    expect(typeof followUp).toBe('string');

    const evalResult = await llm.evaluateRubric(
      'Java Intern',
      [{ question: 'Java OOP là gì?', answer: 'Gồm 4 tính chất: Đóng gói, Kế thừa, Đa hình, Trừu tượng.' }]
    );

    expect(evalResult.technicalScore).toBeGreaterThanOrEqual(0);
    expect(evalResult.technicalScore).toBeLessThanOrEqual(10);
    expect(evalResult.overallScore).toBeGreaterThanOrEqual(0);
    expect(evalResult.overallScore).toBeLessThanOrEqual(10);
    expect(evalResult.aiFeedback).toContain('JAVA INTERN');
  });
});
