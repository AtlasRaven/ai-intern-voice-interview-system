import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { ConsentModal } from '../components/ConsentModal';

describe('ConsentModal Component', () => {
  const mockPosition = {
    id: 1,
    code: 'JAVA_BE',
    title: 'Java Backend Intern',
    description: 'Thực tập sinh Java',
    department: 'Backend Engineering',
    active: true,
  };

  it('does not render when isOpen is false', () => {
    const { container } = render(
      <ConsentModal position={mockPosition} isOpen={false} onClose={vi.fn()} onConfirm={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders modal content when isOpen is true', () => {
    render(
      <ConsentModal position={mockPosition} isOpen={true} onClose={vi.fn()} onConfirm={vi.fn()} />
    );
    expect(screen.getByText(/Xác nhận quyền ghi âm giọng nói/i)).toBeDefined();
    expect(screen.getByText(/Java Backend Intern/i)).toBeDefined();
  });

  it('shows error message if submitting without checking consent', async () => {
    render(
      <ConsentModal position={mockPosition} isOpen={true} onClose={vi.fn()} onConfirm={vi.fn()} />
    );
    const submitBtn = screen.getByRole('button', { name: /Vào phòng phỏng vấn/i });
    await act(async () => {
      fireEvent.click(submitBtn);
    });

    expect(screen.getByText(/Bạn cần đồng ý với điều khoản ghi âm hoặc chọn chế độ gõ chữ dự phòng/i)).toBeDefined();
  });

  it('calls onConfirm when consent checkbox is checked and submitted', async () => {
    const onConfirmMock = vi.fn().mockResolvedValue(undefined);
    render(
      <ConsentModal position={mockPosition} isOpen={true} onClose={vi.fn()} onConfirm={onConfirmMock} />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    await act(async () => {
      fireEvent.click(checkboxes[0]); // Check audio consent
    });

    const submitBtn = screen.getByRole('button', { name: /Vào phòng phỏng vấn/i });
    await act(async () => {
      fireEvent.click(submitBtn);
    });

    expect(onConfirmMock).toHaveBeenCalledWith(false);
  });
});
