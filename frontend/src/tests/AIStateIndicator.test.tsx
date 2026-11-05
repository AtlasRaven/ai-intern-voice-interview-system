import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { AIStateIndicator } from '../components/AIStateIndicator';

describe('AIStateIndicator Component', () => {
  it('renders ASKING state with speaking badge', () => {
    render(<AIStateIndicator state="ASKING" />);
    expect(screen.getByText(/AI đang đọc câu hỏi/i)).toBeDefined();
  });

  it('renders LISTENING state with listening badge', () => {
    render(<AIStateIndicator state="LISTENING" />);
    expect(screen.getByText(/Đang lắng nghe câu trả lời/i)).toBeDefined();
  });

  it('renders THINKING state with thinking badge', () => {
    render(<AIStateIndicator state="THINKING" />);
    expect(screen.getByText(/AI đang phân tích câu trả lời/i)).toBeDefined();
  });

  it('renders EVALUATING state with analysis badge', () => {
    render(<AIStateIndicator state="EVALUATING" />);
    expect(screen.getByText(/AI đang phân tích câu trả lời/i)).toBeDefined();
  });

  it('renders COMPLETED state with completion badge', () => {
    render(<AIStateIndicator state="COMPLETED" />);
    expect(screen.getByText(/Buổi phỏng vấn đã hoàn thành/i)).toBeDefined();
  });

  it('renders DISCONNECTED state with default connecting badge', () => {
    render(<AIStateIndicator state="DISCONNECTED" />);
    expect(screen.getByText(/Đang kết nối phiên/i)).toBeDefined();
  });
});
