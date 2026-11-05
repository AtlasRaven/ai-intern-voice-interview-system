import React, { useState } from 'react';
import { Position } from '../types';
import { ShieldCheck, Mic, AlertCircle } from 'lucide-react';

interface ConsentModalProps {
  position: Position;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (useTextFallback: boolean) => Promise<void>;
}

export const ConsentModal: React.FC<ConsentModalProps> = ({ position, isOpen, onClose, onConfirm }) => {
  const [agreed, setAgreed] = useState(false);
  const [useTextFallback, setUseTextFallback] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!agreed && !useTextFallback) {
      setError('Bạn cần đồng ý với điều khoản ghi âm hoặc chọn chế độ gõ chữ dự phòng.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onConfirm(useTextFallback);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Đã xảy ra lỗi khởi tạo phiên.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
      <div className="bg-white rounded-xl border border-border max-w-lg w-full p-6 shadow-xl space-y-5 animate-in fade-in duration-150">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-brand flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-textPrimary">Xác nhận quyền ghi âm giọng nói</h3>
            <p className="text-xs text-textMuted">Chính sách bảo mật dữ liệu âm thanh phiên bản v1.0</p>
          </div>
        </div>

        <div className="text-sm text-textSecondary space-y-3 bg-surface p-4 rounded-lg border border-border">
          <p>
            Bạn đang bắt đầu phỏng vấn vị trí: <strong className="text-textPrimary">{position.title}</strong>.
          </p>
          <p className="text-xs leading-relaxed text-textMuted">
            Để AI có thể phỏng vấn hai chiều và chấm điểm rubric tự động, trình duyệt sẽ yêu cầu quyền truy cập microphone của bạn. Toàn bộ dữ liệu thoại được bảo mật và chỉ phục vụ việc đánh giá năng lực thực tập sinh.
          </p>
        </div>

        {error && (
          <div className="flex items-center space-x-2 text-xs text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-3">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => {
                setAgreed(e.target.checked);
                if (e.target.checked) setUseTextFallback(false);
              }}
              className="mt-1 h-4 w-4 rounded border-border text-brand focus:ring-brand"
            />
            <span className="text-sm text-textPrimary">
              Tôi đồng ý cho phép hệ thống ghi âm giọng nói và trích xuất phụ đề phục vụ đánh giá năng lực phỏng vấn.
            </span>
          </label>

          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={useTextFallback}
              onChange={(e) => {
                setUseTextFallback(e.target.checked);
                if (e.target.checked) setAgreed(true);
              }}
              className="mt-1 h-4 w-4 rounded border-border text-brand focus:ring-brand"
            />
            <span className="text-sm text-textSecondary">
              Thiết bị của tôi không có microphone, tôi muốn sử dụng chế độ <strong>Gõ văn bản dự phòng (Text Chat Fallback)</strong>.
            </span>
          </label>
        </div>

        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-textSecondary hover:bg-surface rounded-lg transition-colors border border-border"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 text-sm font-medium text-white bg-brand hover:bg-brand-hover rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            <span>Vào phòng phỏng vấn</span>
          </button>
        </div>
      </div>
    </div>
  );
};
