import dotenv from 'dotenv';
dotenv.config();

export interface AppConfig {
  port: number;
  springBackendUrl: string;
  internalServiceKey: string;
  sttProvider: 'real' | 'mock';
  ttsProvider: 'real' | 'mock';
  llmProvider: 'real' | 'mock';
  anthropicApiKey?: string;
  deepgramApiKey?: string;
  azureSpeechKey?: string;
  azureSpeechRegion?: string;
}

function resolveProvider(providerName: 'stt' | 'tts' | 'llm', envVal: string | undefined, apiKey: string | undefined): 'real' | 'mock' {
  const chosen = (envVal || 'mock').toLowerCase().trim();
  if (chosen === 'real') {
    if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_') || apiKey.includes('xxx')) {
      console.warn(`[PROVIDER_FALLBACK] Missing or invalid API key for ${providerName.toUpperCase()}. Automatically falling back to MockProvider.`);
      return 'mock';
    }
    return 'real';
  }
  return 'mock';
}

const rawStt = process.env.STT_PROVIDER;
const rawTts = process.env.TTS_PROVIDER;
const rawLlm = process.env.LLM_PROVIDER;

const deepgramKey = process.env.DEEPGRAM_API_KEY;
const azureKey = process.env.AZURE_SPEECH_KEY;
const anthropicKey = process.env.ANTHROPIC_API_KEY;

export const config: AppConfig = {
  port: parseInt(process.env.PORT || '3000', 10),
  springBackendUrl: process.env.SPRING_BACKEND_URL || 'http://localhost:8080',
  internalServiceKey: process.env.INTERNAL_SERVICE_KEY || 'intern-voice-gateway-internal-secret-token-key-2026',
  sttProvider: resolveProvider('stt', rawStt, deepgramKey),
  ttsProvider: resolveProvider('tts', rawTts, azureKey),
  llmProvider: resolveProvider('llm', rawLlm, anthropicKey),
  anthropicApiKey: anthropicKey,
  deepgramApiKey: deepgramKey,
  azureSpeechKey: azureKey,
  azureSpeechRegion: process.env.AZURE_SPEECH_REGION || 'southeastasia',
};
