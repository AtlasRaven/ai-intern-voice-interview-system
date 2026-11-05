import React, { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { SessionState } from '../types';
import { AudioWaveform } from '../components/AudioWaveform';
import { AIStateIndicator } from '../components/AIStateIndicator';
import { LiveTranscriptBox, SubtitleMessage } from '../components/LiveTranscriptBox';
import { Mic, MicOff, MessageSquare, Send, PhoneOff, Volume2, AlertCircle, Wifi, WifiOff } from 'lucide-react';

export const InterviewRoomPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const initialTextOnly = searchParams.get('textOnly') === 'true';

  const navigate = useNavigate();

  const [state, setState] = useState<SessionState>('INITIALIZING');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  const [isMicMuted, setIsMicMuted] = useState(false);
  const [textMode, setTextMode] = useState(initialTextOnly);
  const [textAnswer, setTextAnswer] = useState('');

  const [subtitles, setSubtitles] = useState<SubtitleMessage[]>([]);
  const [currentLiveText, setCurrentLiveText] = useState<{ speaker: 'AI' | 'CANDIDATE'; text: string } | undefined>(undefined);

  const [isConnected, setIsConnected] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioWorkletNodeRef = useRef<ScriptProcessorNode | null>(null);

  useEffect(() => {
    connectWebSocket();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && (e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
        e.preventDefault();
        toggleMic();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      cleanupMedia();
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [id, token]);

  const connectWebSocket = () => {
    const wsUrl = `ws://localhost:3000/ws/interview?sessionId=${id}&token=${token}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('[WebSocket] Connected to Voice Gateway');
      setIsConnected(true);
      setReconnecting(false);
      setErrorMessage(null);

      if (!textMode) {
        initMicrophone();
      }
    };

    ws.onmessage = async (event) => {
      try {
        if (typeof event.data === 'string') {
          const parsed = JSON.parse(event.data);
          handleGatewayEvent(parsed);
        }
      } catch (err) {
        console.error('[WebSocket] Message parsing error:', err);
      }
    };

    ws.onclose = (e) => {
      console.log('[WebSocket] Disconnected from Voice Gateway', e.reason);
      setIsConnected(false);
      if (state !== 'COMPLETED') {
        setReconnecting(true);
        // Attempt reconnection after 3 seconds
        setTimeout(() => {
          if (wsRef.current?.readyState === WebSocket.CLOSED) {
            connectWebSocket();
          }
        }, 3000);
      }
    };

    ws.onerror = (err) => {
      console.error('[WebSocket] Error:', err);
      setErrorMessage('Kết nối tới Voice Gateway bị gián đoạn.');
    };
  };

  const handleGatewayEvent = (event: any) => {
    switch (event.event) {
      case 'STATE_CHANGE':
        setState(event.payload.state);
        if (event.payload.currentQuestionIndex !== undefined) {
          setQuestionIndex(event.payload.currentQuestionIndex);
        }
        if (event.payload.totalQuestions !== undefined) {
          setTotalQuestions(event.payload.totalQuestions);
        }
        break;

      case 'AI_SPEAKING_START':
        setCurrentLiveText({ speaker: 'AI', text: event.payload.questionText });
        break;

      case 'AI_SPEAKING_CHUNK':
        playAudioBase64Chunk(event.payload.audioBase64);
        break;

      case 'AI_SPEAKING_END':
        setCurrentLiveText(undefined);
        break;

      case 'SUBTITLE_LIVE':
        if (event.payload.isFinal) {
          const newMsg: SubtitleMessage = {
            id: Date.now().toString(),
            speaker: event.payload.speaker,
            text: event.payload.text,
            isFinal: true,
            timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          };
          setSubtitles((prev) => [...prev, newMsg]);
          setCurrentLiveText(undefined);
        } else {
          setCurrentLiveText({ speaker: event.payload.speaker, text: event.payload.text });
        }
        break;

      case 'STOP_AUDIO_PLAYBACK':
        // Abort audio playback immediately on barge-in
        if (audioContextRef.current) {
          audioContextRef.current.close().catch(() => {});
          audioContextRef.current = null;
        }
        break;

      case 'SESSION_COMPLETED':
        navigate(`/evaluation/${id}`);
        break;

      case 'RECONNECTED_SUCCESS':
        setState(event.payload.state);
        setQuestionIndex(event.payload.currentQuestionIndex);
        setTotalQuestions(event.payload.totalQuestions);
        setReconnecting(false);
        break;

      case 'SESSION_ERROR':
        setErrorMessage(event.payload.message);
        break;
    }
  };

  const initMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const source = audioCtx.createMediaStreamSource(stream);
      const processor = audioCtx.createScriptProcessor(4096, 1, 1);

      processor.onaudioprocess = (e) => {
        if (isMicMuted || textMode || state !== 'LISTENING') return;

        const inputData = e.inputBuffer.getChannelData(0);
        // Convert Float32 to 16-bit PCM
        const pcmBuffer = new ArrayBuffer(inputData.length * 2);
        const pcmView = new DataView(pcmBuffer);
        for (let i = 0; i < inputData.length; i++) {
          const s = Math.max(-1, Math.min(1, inputData[i]));
          pcmView.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
        }

        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(pcmBuffer);
        }
      };

      source.connect(processor);
      processor.connect(audioCtx.destination);
      audioWorkletNodeRef.current = processor;
    } catch (err: any) {
      console.warn('[Microphone] Microphone access denied or not found. Switching to text chat fallback mode.');
      setTextMode(true);
    }
  };

  const cleanupMedia = () => {
    if (audioWorkletNodeRef.current) {
      audioWorkletNodeRef.current.disconnect();
      audioWorkletNodeRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
  };

  const playAudioBase64Chunk = async (base64: string) => {
    try {
      if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const binaryStr = atob(base64);
      const len = binaryStr.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }

      const audioBuffer = await audioContextRef.current.decodeAudioData(bytes.buffer.slice(0));
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      source.start(0);
    } catch (err) {
      // Ignore chunk decode errors for partial stream packets
    }
  };

  const toggleMic = () => {
    setIsMicMuted((prev) => !prev);
  };

  const handleBargeInClick = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ event: 'USER_BARGE_IN' }));
    }
  };

  const handleSendTextAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textAnswer.trim() || !wsRef.current) return;

    wsRef.current.send(JSON.stringify({
      event: 'TEXT_ANSWER',
      payload: { text: textAnswer.trim() },
    }));

    setTextAnswer('');
  };

  const handleEndEarly = () => {
    if (window.confirm('Bạn có chắc chắn muốn kết thúc buổi phỏng vấn sớm không? Hệ thống sẽ đánh giá dựa trên các câu trả lời đã thực hiện.')) {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ event: 'END_SESSION_EARLY' }));
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">
      {/* Top Session Bar */}
      <div className="bg-white rounded-xl border border-border p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5">
            {isConnected ? (
              <span className="flex items-center space-x-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                <span>Trực tuyến</span>
              </span>
            ) : (
              <span className="flex items-center space-x-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                <span>{reconnecting ? 'Đang kết nối lại...' : 'Mất kết nối'}</span>
              </span>
            )}
          </div>

          <div className="text-sm font-bold text-textPrimary">
            Phiên phỏng vấn #{id}
          </div>

          {totalQuestions > 0 && (
            <span className="text-xs text-textMuted bg-surface px-2.5 py-1 rounded-md border border-border">
              Câu {questionIndex + 1} / {totalQuestions}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <AIStateIndicator state={state} />
          <button
            type="button"
            onClick={handleEndEarly}
            className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors flex items-center space-x-1"
          >
            <PhoneOff className="w-3.5 h-3.5" />
            <span>Kết thúc sớm</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="flex items-center space-x-2 text-xs text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Interactive Stage */}
      <div className="bg-white rounded-xl border border-border p-6 shadow-sm space-y-6">
        {/* Waveform Visualizer */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-textMuted">
            <span>Chỉ báo sóng âm thời gian thực:</span>
            <span>Phím tắt: [Space] Bật/Tắt Mic | [Barge-in] Ngắt lời AI</span>
          </div>
          <AudioWaveform
            isActive={state === 'ASKING' || (state === 'LISTENING' && !isMicMuted)}
            mode={state === 'ASKING' ? 'speaking' : state === 'LISTENING' ? 'listening' : 'idle'}
          />
        </div>

        {/* Live Subtitle Transcript */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-textSecondary">Phụ đề đối thoại thời gian thực:</div>
          <LiveTranscriptBox messages={subtitles} currentLiveText={currentLiveText} />
        </div>

        {/* Interactive Controls Bar */}
        <div className="pt-2 border-t border-border flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            {!textMode && (
              <button
                type="button"
                onClick={toggleMic}
                className={`px-4 py-2 text-xs font-semibold rounded-lg border flex items-center space-x-2 transition-colors ${
                  isMicMuted
                    ? 'bg-red-50 border-red-200 text-red-700'
                    : 'bg-surface hover:bg-surfaceSubtle border-border text-textPrimary'
                }`}
              >
                {isMicMuted ? <MicOff className="w-4 h-4 text-red-600" /> : <Mic className="w-4 h-4 text-emerald-600" />}
                <span>{isMicMuted ? 'Micro đang tắt' : 'Micro đang bật (Space)'}</span>
              </button>
            )}

            {state === 'ASKING' && (
              <button
                type="button"
                onClick={handleBargeInClick}
                className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-amber-50 border border-amber-300 text-amber-800 hover:bg-amber-100 transition-colors flex items-center space-x-1.5"
                title="Ngắt lời AI để trả lời ngay"
              >
                <Volume2 className="w-4 h-4 text-amber-600" />
                <span>Ngắt lời AI</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setTextMode(!textMode)}
              className={`px-3.5 py-2 text-xs font-medium rounded-lg border flex items-center space-x-1.5 transition-colors ${
                textMode ? 'bg-blue-50 border-blue-300 text-brand' : 'bg-surface border-border text-textSecondary hover:bg-surfaceSubtle'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>{textMode ? 'Đang dùng Gõ chữ' : 'Chuyển gõ chữ'}</span>
            </button>
          </div>

          <div className="text-xs text-textMuted italic">
            {state === 'LISTENING'
              ? 'Hãy trả lời trực tiếp qua micro hoặc gõ vào ô nhập bên dưới.'
              : state === 'ASKING'
              ? 'AI đang đọc câu hỏi. Bạn có thể nhấn "Ngắt lời AI" nếu muốn trả lời ngay.'
              : 'AI đang phân tích câu trả lời của bạn...'}
          </div>
        </div>

        {/* Text Fallback Input Box */}
        {textMode && (
          <form onSubmit={handleSendTextAnswer} className="flex items-center space-x-2 pt-2 animate-in fade-in">
            <input
              type="text"
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              disabled={state !== 'LISTENING'}
              placeholder={state === 'LISTENING' ? 'Nhập câu trả lời của bạn tại đây rồi nhấn Gửi...' : 'Vui lòng chờ AI đọc xong câu hỏi...'}
              className="flex-1 px-4 py-2.5 text-sm bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand disabled:bg-surface disabled:text-textMuted"
            />
            <button
              type="submit"
              disabled={state !== 'LISTENING' || !textAnswer.trim()}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-brand hover:bg-brand-hover rounded-lg transition-colors flex items-center space-x-1.5 disabled:opacity-50"
            >
              <span>Gửi trả lời</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
