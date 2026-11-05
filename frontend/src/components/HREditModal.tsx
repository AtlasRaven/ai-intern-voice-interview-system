import React, { useState } from 'react';
import { Evaluation } from '../types';
import { apiClient } from '../services/api';
import { CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';

interface HREditModalProps {
  evaluation: Evaluation;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updated: Evaluation) => void;
}

export const HREditModal: React.FC<HREditModalProps> = ({ evaluation, isOpen, onClose, onSuccess }) => {
  const [scoreOverride, setScoreOverride] = useState<string>(
    evaluation.hrScoreOverride !== undefined && evaluation.hrScoreOverride !== null
      ? evaluation.hrScoreOverride.toString()
      : evaluation.overallScore.toString()
  );
  const [status, setStatus] = useState<'PASSED' | 'FAILED' | 'UNDER_REVIEW'>(evaluation.finalStatus);
  const [notes, setNotes] = useState<string>(evaluation.hrNotes || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numScore = parseFloat(scoreOverride);
    if (isNaN(numScore) || numScore < 0 || numScore > 10) {
      setError('Điểm số phải là số từ 0.0 đến 10.0');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.put<{ data: Evaluation }>(`/evaluations/${evaluation.id}`, {
        hrScoreOverride: numScore,
        finalStatus: status,
        hrNotes: notes,
      });
      onSuccess(res.data.data);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Cập nhật đánh giá thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
      <div className="bg-white rounded-xl border border-border max-w-lg w-full p-6 shadow-xl space-y-5 animate-in fade-in duration-150">
        <div>
          <h3 className="text-lg font-bold text-textPrimary">Hiệu chỉnh đánh giá của HR</h3>
          <p className="text-xs text-textMuted">Ứng viên: {evaluation.candidateName} — {evaluation.positionTitle}</p>
        </div>

        {error && (
          <div className="flex items-center space-x-2 text-xs text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4 p-3 bg-surface rounded-lg border border-border text-xs">
            <div>
              <span className="text-textMuted">Điểm AI gợi ý:</span>
              <div className="font-bold text-base text-textPrimary">{evaluation.overallScore} / 10</div>
            </div>
            <div>
              <span className="text-textMuted">Điểm kỹ thuật:</span>
              <div className="font-semibold text-textPrimary">{evaluation.technicalScore} / 10</div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-textSecondary mb-1.5">
              Điểm HR chốt lại (Thang 10):
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              value={scoreOverride}
              onChange={(e) => setScoreOverride(e.target.value)}
              required
              className="w-full px-3.5 py-2 text-sm bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-textSecondary mb-1.5">
              Quyết định tuyển dụng:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setStatus('PASSED')}
                className={`py-2 px-3 text-xs font-semibold rounded-lg border flex items-center justify-center space-x-1.5 transition-colors ${
                  status === 'PASSED'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : 'bg-white border-border text-textSecondary hover:bg-surface'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>ĐẠT (Pass)</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('FAILED')}
                className={`py-2 px-3 text-xs font-semibold rounded-lg border flex items-center justify-center space-x-1.5 transition-colors ${
                  status === 'FAILED'
                    ? 'bg-red-50 border-red-300 text-red-800'
                    : 'bg-white border-border text-textSecondary hover:bg-surface'
                }`}
              >
                <XCircle className="w-4 h-4 text-red-600" />
                <span>LOẠI (Fail)</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('UNDER_REVIEW')}
                className={`py-2 px-3 text-xs font-semibold rounded-lg border flex items-center justify-center space-x-1.5 transition-colors ${
                  status === 'UNDER_REVIEW'
                    ? 'bg-amber-50 border-amber-300 text-amber-800'
                    : 'bg-white border-border text-textSecondary hover:bg-surface'
                }`}
              >
                <Clock className="w-4 h-4 text-amber-600" />
                <span>XEM XÉT</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-textSecondary mb-1.5">
              Ghi chú & Nhận xét của Chuyên gia phỏng vấn / HR:
            </label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Nhập nhận xét chi tiết về tác phong, tư duy logic hoặc lý do điều chỉnh điểm..."
              className="w-full px-3.5 py-2 text-sm bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-textSecondary hover:bg-surface rounded-lg transition-colors border border-border"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-sm font-medium text-white bg-brand hover:bg-brand-hover rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              <span>Lưu đánh giá chính thức</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
