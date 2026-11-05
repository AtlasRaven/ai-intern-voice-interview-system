import React from 'react';
import { SessionState } from '../types';
import { Volume2, Mic, BrainCircuit, Loader2, CheckCircle2 } from 'lucide-react';

interface AIStateIndicatorProps {
  state: SessionState;
}

export const AIStateIndicator: React.FC<AIStateIndicatorProps> = ({ state }) => {
  switch (state) {
    case 'ASKING':
    case 'GREETING':
      return (
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <Volume2 className="w-4 h-4 text-emerald-600" />
          <span>AI đang đọc câu hỏi...</span>
        </div>
      );

    case 'LISTENING':
      return (
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
          <Mic className="w-4 h-4 text-amber-600" />
          <span>Đang lắng nghe câu trả lời của bạn...</span>
        </div>
      );

    case 'THINKING':
    case 'EVALUATING':
      return (
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-sm font-medium">
          <BrainCircuit className="w-4 h-4 text-blue-600 animate-spin" />
          <span>AI đang phân tích câu trả lời...</span>
        </div>
      );

    case 'COMPLETED':
      return (
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-300 text-slate-800 text-sm font-medium">
          <CheckCircle2 className="w-4 h-4 text-slate-600" />
          <span>Buổi phỏng vấn đã hoàn thành</span>
        </div>
      );

    default:
      return (
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-surface border border-border text-textSecondary text-sm font-medium">
          <Loader2 className="w-4 h-4 text-slate-500 animate-spin" />
          <span>Đang kết nối phiên...</span>
        </div>
      );
  }
};
