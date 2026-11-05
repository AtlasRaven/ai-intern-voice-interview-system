import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { LiveTranscriptBox, SubtitleMessage } from '../components/LiveTranscriptBox';

describe('LiveTranscriptBox Component', () => {
  it('renders placeholder when no messages or live text are present', () => {
    render(<LiveTranscriptBox messages={[]} />);
    expect(screen.getByText(/Phụ đề đối thoại thời gian thực sẽ hiển thị tại đây/i)).toBeDefined();
  });

  it('renders messages correctly with speaker names', () => {
    const messages: SubtitleMessage[] = [
      {
        id: '1',
        speaker: 'AI',
        text: 'Xin chào bạn ứng viên!',
        isFinal: true,
        timestamp: '10:00:00',
      },
      {
        id: '2',
        speaker: 'CANDIDATE',
        text: 'Dạ em chào anh AI!',
        isFinal: true,
        timestamp: '10:00:05',
      },
    ];

    render(<LiveTranscriptBox messages={messages} />);
    expect(screen.getByText(/Xin chào bạn ứng viên!/i)).toBeDefined();
    expect(screen.getByText(/Dạ em chào anh AI!/i)).toBeDefined();
    expect(screen.getByText(/AI Interviewer/i)).toBeDefined();
    expect(screen.getByText(/Bạn \(Ứng viên\)/i)).toBeDefined();
  });

  it('renders in-progress streaming live text indicator', () => {
    render(
      <LiveTranscriptBox
        messages={[]}
        currentLiveText={{ speaker: 'CANDIDATE', text: 'Em đang nói dở câu...' }}
      />
    );
    expect(screen.getByText(/Đang nhận dạng giọng nói.../i)).toBeDefined();
    expect(screen.getByText(/Em đang nói dở câu.../i)).toBeDefined();
  });
});
