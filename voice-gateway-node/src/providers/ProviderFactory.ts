import { config } from '../config/env.js';
import { ISTTProvider } from './stt/ISTTProvider.js';
import { MockSTTProvider } from './stt/MockSTTProvider.js';
import { DeepgramSTTProvider } from './stt/DeepgramSTTProvider.js';

import { ITTSProvider } from './tts/ITTSProvider.js';
import { MockTTSProvider } from './tts/MockTTSProvider.js';
import { AzureTTSProvider } from './tts/AzureTTSProvider.js';

import { ILLMProvider } from './llm/ILLMProvider.js';
import { MockLLMProvider } from './llm/MockLLMProvider.js';
import { ClaudeLLMProvider } from './llm/ClaudeLLMProvider.js';

export class ProviderFactory {
  public static createSTTProvider(): ISTTProvider {
    if (config.sttProvider === 'real' && config.deepgramApiKey) {
      return new DeepgramSTTProvider(config.deepgramApiKey);
    }
    return new MockSTTProvider();
  }

  public static createTTSProvider(): ITTSProvider {
    if (config.ttsProvider === 'real' && config.azureSpeechKey && config.azureSpeechRegion) {
      return new AzureTTSProvider(config.azureSpeechKey, config.azureSpeechRegion);
    }
    return new MockTTSProvider();
  }

  public static createLLMProvider(): ILLMProvider {
    if (config.llmProvider === 'real' && config.anthropicApiKey) {
      return new ClaudeLLMProvider(config.anthropicApiKey);
    }
    return new MockLLMProvider();
  }
}
