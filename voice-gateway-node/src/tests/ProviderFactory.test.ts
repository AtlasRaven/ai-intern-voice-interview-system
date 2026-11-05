import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProviderFactory } from '../providers/ProviderFactory.js';
import { MockSTTProvider } from '../providers/stt/MockSTTProvider.js';
import { MockTTSProvider } from '../providers/tts/MockTTSProvider.js';
import { MockLLMProvider } from '../providers/llm/MockLLMProvider.js';

describe('ProviderFactory Test Suite', () => {
  it('should default to MockSTTProvider when provider is mock or key is empty', () => {
    const stt = ProviderFactory.createSTTProvider();
    expect(stt).toBeInstanceOf(MockSTTProvider);
  });

  it('should default to MockTTSProvider when provider is mock or key is empty', () => {
    const tts = ProviderFactory.createTTSProvider();
    expect(tts).toBeInstanceOf(MockTTSProvider);
  });

  it('should default to MockLLMProvider when provider is mock or key is empty', () => {
    const llm = ProviderFactory.createLLMProvider();
    expect(llm).toBeInstanceOf(MockLLMProvider);
  });
});
