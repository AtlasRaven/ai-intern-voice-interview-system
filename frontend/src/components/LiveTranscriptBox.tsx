import React, { useEffect, useRef } from 'react';
import { Bot, User as UserIcon } from 'lucide-react';

export interface SubtitleMessage {
  id: string;
  speaker: 'AI' | 'CANDIDATE';
  text: string;
  isFinal: boolean;
  timestamp: string;
}

interface LiveTranscriptBoxProps {
  messages: SubtitleMessage[];
  currentLiveText?: { speaker: 'AI' | 'CANDIDATE'; text: string };
}

export const LiveTranscriptBox: React.FC<LiveTranscriptBoxProps> = ({ messages, currentLiveText }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, currentLiveText]);

  return (
    <div
      ref={scrollRef}
      className="h-64 overflow-y-auto p-4 bg-surface rounded-xl border border-border space-y-3.5 scroll-smooth"
      aria-live="polite"
      role="log"
    >
      {messages.length === 0 && !currentLiveText && (
        <div className="h-full flex items-center justify-center text-textMuted text-sm italic">
          Phụ đề đối thoại thời gian thực sẽ hiển thị tại đây...
        </div>
      )}

      {messages.map((msg) => (
        <div key={msg.id} className={`flex items-start space-x-2.5 ${msg.speaker === 'CANDIDATE' ? 'flex-row-reverse space-x-reverse' : ''}`}>
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${msg.speaker === 'AI' ? 'bg-blue-100 text-brand' : 'bg-slate-200 text-slate-700'}`}>
            {msg.speaker === 'AI' ? <Bot className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
          </div>
          <div className={`max-w-[80%] rounded-lg px-3.5 py-2 text-sm leading-relaxed ${msg.speaker === 'AI' ? 'bg-white border border-border text-textPrimary' : 'bg-brand text-white'}`}>
            <div className="flex items-center justify-between space-x-2 mb-1 text-[11px] opacity-75">
              <span>{msg.speaker === 'AI' ? 'AI Interviewer' : 'Bạn (Ứng viên)'}</span>
              <span>{msg.timestamp}</span>
            </div>
            <p className="whitespace-pre-wrap">{msg.text}</p>
          </div>
        </div>
      ))}

      {currentLiveText && currentLiveText.text && (
        <div className={`flex items-start space-x-2.5 ${currentLiveText.speaker === 'CANDIDATE' ? 'flex-row-reverse space-x-reverse' : ''}`}>
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${currentLiveText.speaker === 'AI' ? 'bg-blue-100 text-brand' : 'bg-slate-200 text-slate-700'}`}>
            {currentLiveText.speaker === 'AI' ? <Bot className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
          </div>
          <div className={`max-w-[80%] rounded-lg px-3.5 py-2 text-sm leading-relaxed border border-dashed ${currentLiveText.speaker === 'AI' ? 'bg-blue-50/50 border-blue-300 text-textPrimary' : 'bg-amber-50 border-amber-300 text-amber-900'}`}>
            <div className="text-[11px] opacity-75 mb-1 font-medium">
              {currentLiveText.speaker === 'AI' ? 'AI đang nói...' : 'Đang nhận dạng giọng nói...'}
            </div>
            <p className="whitespace-pre-wrap">{currentLiveText.text}</p>
          </div>
        </div>
      )}
    </div>
  );
};
