import React, { useEffect, useState } from 'react';

interface AudioWaveformProps {
  isActive: boolean;
  mode: 'speaking' | 'listening' | 'idle';
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({ isActive, mode }) => {
  const [bars, setBars] = useState<number[]>(new Array(24).fill(20));

  useEffect(() => {
    if (!isActive) {
      setBars(new Array(24).fill(15));
      return;
    }

    const interval = setInterval(() => {
      setBars(prev => prev.map(() => {
        const minHeight = mode === 'speaking' ? 25 : 15;
        const maxHeight = mode === 'speaking' ? 85 : 65;
        return Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
      }));
    }, 90);

    return () => clearInterval(interval);
  }, [isActive, mode]);

  const getBarColor = () => {
    if (!isActive) return 'bg-slate-300';
    if (mode === 'speaking') return 'bg-emerald-500';
    if (mode === 'listening') return 'bg-amber-500';
    return 'bg-blue-500';
  };

  return (
    <div className="flex items-center justify-center space-x-1.5 h-24 py-2 px-4 bg-surface rounded-xl border border-border" role="img" aria-label="Sóng âm âm thanh tương tác">
      {bars.map((height, idx) => (
        <div
          key={idx}
          className={`w-1.5 rounded-md transition-all duration-100 ease-out ${getBarColor()}`}
          style={{ height: `${height}%` }}
        />
      ))}
    </div>
  );
};
