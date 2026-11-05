import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Evaluation, TranscriptSegment } from '../types';
import { apiClient } from '../services/api';
import { Award, CheckCircle2, XCircle, Clock, ArrowLeft, MessageSquare, BrainCircuit, Share2, Loader2, AlertCircle } from 'lucide-react';

export const EvaluationResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [transcripts, setTranscripts] = useState<TranscriptSegment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvaluationAndTranscripts();
  }, [id]);

  const fetchEvaluationAndTranscripts = async () => {
    try {
      setLoading(true);
      setError(null);
      const [evalRes, transRes] = await Promise.all([
        apiClient.get<{ data: Evaluation }>(`/evaluations/session/${id}`),
        apiClient.get<{ data: TranscriptSegment[] }>(`/sessions/${id}/transcripts`),
      ]);
      setEvaluation(evalRes.data.data);
      setTranscripts(transRes.data.data || []);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Không thể tải kết quả đánh giá.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PASSED':
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>ĐẠT (PASS)</span>
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-bold bg-red-50 text-red-800 border border-red-300">
            <XCircle className="w-4 h-4 text-red-600" />
            <span>CHƯA ĐẠT (FAIL)</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>ĐANG XEM XÉT</span>
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-3 text-textMuted">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
        <span className="text-sm">Đang tổng hợp báo cáo đánh giá...</span>
      </div>
    );
  }

  if (error || !evaluation) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-4">
        <div className="flex items-center space-x-2 text-sm text-red-600 bg-red-50 p-4 rounded-xl border border-red-200">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error || 'Chưa tìm thấy kết quả đánh giá cho phiên phỏng vấn này.'}</span>
        </div>
        <Link to="/positions" className="inline-flex items-center space-x-1.5 text-xs text-brand font-semibold hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại danh sách vị trí</span>
        </Link>
      </div>
    );
  }

  const effectiveScore = evaluation.hrScoreOverride !== undefined && evaluation.hrScoreOverride !== null
    ? evaluation.hrScoreOverride
    : evaluation.overallScore;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <Link to="/positions" className="inline-flex items-center space-x-1.5 text-xs font-semibold text-textSecondary hover:text-brand transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại các vị trí mở</span>
        </Link>
        <div>{getStatusBadge(evaluation.finalStatus)}</div>
      </div>

      {/* Main Score Card */}
      <div className="bg-white rounded-xl border border-border p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-border gap-4">
          <div>
            <div className="text-xs text-textMuted uppercase tracking-wider font-semibold">Báo cáo đánh giá năng lực</div>
            <h1 className="text-2xl font-bold text-textPrimary mt-1">{evaluation.candidateName}</h1>
            <p className="text-sm text-brand font-medium mt-0.5">{evaluation.positionTitle}</p>
          </div>

          <div className="text-left sm:text-right bg-surface p-4 rounded-xl border border-border">
            <div className="text-xs text-textMuted font-semibold">Điểm tổng kết:</div>
            <div className="text-3xl font-extrabold text-brand mt-0.5">{effectiveScore} <span className="text-sm font-normal text-textMuted">/ 10</span></div>
            {evaluation.hrScoreOverride && (
              <div className="text-[11px] text-amber-700 font-medium mt-1">Đã được HR chuẩn hóa (Điểm gốc: {evaluation.overallScore})</div>
            )}
          </div>
        </div>

        {/* 3 Rubric Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-surface rounded-xl border border-border space-y-2">
            <div className="text-xs text-textMuted font-semibold">1. Kiến thức Kỹ thuật (40%)</div>
            <div className="text-2xl font-bold text-textPrimary">{evaluation.technicalScore} / 10</div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full" style={{ width: `${(evaluation.technicalScore / 10) * 100}%` }} />
            </div>
          </div>

          <div className="p-4 bg-surface rounded-xl border border-border space-y-2">
            <div className="text-xs text-textMuted font-semibold">2. Tư duy Giải quyết vấn đề (30%)</div>
            <div className="text-2xl font-bold text-textPrimary">{evaluation.problemSolvingScore} / 10</div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${(evaluation.problemSolvingScore / 10) * 100}%` }} />
            </div>
          </div>

          <div className="p-4 bg-surface rounded-xl border border-border space-y-2">
            <div className="text-xs text-textMuted font-semibold">3. Kỹ năng Giao tiếp & Trình bày (30%)</div>
            <div className="text-2xl font-bold text-textPrimary">{evaluation.communicationScore} / 10</div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-600 h-full rounded-full" style={{ width: `${(evaluation.communicationScore / 10) * 100}%` }} />
            </div>
          </div>
        </div>

        {/* AI Detailed Feedback */}
        <div className="p-5 bg-blue-50/50 rounded-xl border border-blue-200 space-y-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-brand">
            <BrainCircuit className="w-4 h-4" />
            <span>NHẬN XÉT CHI TIẾT TỪ HỘI ĐỒNG AI:</span>
          </div>
          <p className="text-xs leading-relaxed text-textPrimary whitespace-pre-wrap">{evaluation.aiFeedback}</p>
        </div>

        {/* HR Manual Notes */}
        {evaluation.hrNotes && (
          <div className="p-5 bg-amber-50/50 rounded-xl border border-amber-200 space-y-2">
            <div className="text-xs font-bold text-amber-800">GHI CHÚ BỔ SUNG CỦA CHUYÊN GIA TUYỂN DỤNG (HR):</div>
            <p className="text-xs leading-relaxed text-amber-950 whitespace-pre-wrap">{evaluation.hrNotes}</p>
          </div>
        )}
      </div>

      {/* Full Transcript History */}
      <div className="bg-white rounded-xl border border-border p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-textPrimary flex items-center space-x-2">
          <MessageSquare className="w-5 h-5 text-brand" />
          <span>Toàn văn Transcript phiên phỏng vấn</span>
        </h2>

        {transcripts.length === 0 ? (
          <div className="text-xs text-textMuted italic">Chưa ghi nhận bản ghi phân đoạn nào.</div>
        ) : (
          <div className="space-y-4 divide-y divide-border">
            {transcripts.map((ts, idx) => (
              <div key={ts.id} className="pt-4 first:pt-0 space-y-2">
                <div className="text-xs font-semibold text-textPrimary">
                  <span className="text-brand mr-1.5">Câu hỏi {idx + 1}:</span>
                  {ts.questionText}
                </div>
                <div className="p-3 bg-surface rounded-lg text-xs leading-relaxed text-textSecondary border border-border">
                  <strong className="text-textPrimary mr-1">Trả lời:</strong>
                  {ts.answerText}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
