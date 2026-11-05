import React, { useEffect, useState } from 'react';
import { Question, Position } from '../types';
import { apiClient } from '../services/api';
import { Plus, Trash2, Filter, AlertCircle, Loader2, BookOpen } from 'lucide-react';

export const QuestionBankPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedPositionId, setSelectedPositionId] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [newDifficulty, setNewDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('EASY');
  const [newSampleAnswer, setNewSampleAnswer] = useState('');
  const [newRubric, setNewRubric] = useState('');
  const [newPositionId, setNewPositionId] = useState<number>(1);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchPositions();
    fetchQuestions();
  }, []);

  const fetchPositions = async () => {
    try {
      const res = await apiClient.get<{ data: Position[] }>('/positions');
      setPositions(res.data.data || []);
      if (res.data.data && res.data.data.length > 0) {
        setNewPositionId(res.data.data[0].id);
      }
    } catch (err) {}
  };

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const params: any = {};
      if (selectedPositionId) params.positionId = selectedPositionId;
      if (selectedDifficulty) params.difficulty = selectedDifficulty;

      const res = await apiClient.get<{ data: Question[] }>('/questions', { params });
      setQuestions(res.data.data || []);
    } catch (err: any) {
      setError(err.message || 'Không thể tải ngân hàng câu hỏi.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCreating(true);
      const res = await apiClient.post<{ data: Question }>('/questions', {
        positionId: newPositionId,
        content: newContent,
        difficulty: newDifficulty,
        sampleAnswer: newSampleAnswer,
        evaluationRubric: newRubric,
      });
      setQuestions((prev) => [res.data.data, ...prev]);
      setIsCreateOpen(false);
      setNewContent('');
      setNewSampleAnswer('');
      setNewRubric('');
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Thêm câu hỏi thất bại.');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa câu hỏi này khỏi ngân hàng không?')) return;
    try {
      await apiClient.delete(`/questions/${id}`);
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    } catch (err: any) {
      alert('Xóa câu hỏi thất bại.');
    }
  };

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'EASY':
        return <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">DỄ</span>;
      case 'MEDIUM':
        return <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 rounded">VỪA</span>;
      case 'HARD':
        return <span className="px-2 py-0.5 text-[10px] font-semibold bg-red-50 text-red-700 border border-red-200 rounded">KHÓ</span>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary">Quản lý Ngân hàng Câu hỏi Phỏng vấn</h1>
          <p className="text-sm text-textSecondary">
            Thiết lập câu hỏi kỹ thuật, câu trả lời mẫu và tiêu chí chấm điểm rubric cho AI Interviewer.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-brand hover:bg-brand-hover rounded-lg transition-colors flex items-center space-x-1.5 shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm câu hỏi mới</span>
        </button>
      </div>

      {/* Filter bar */}
      <div className="bg-white p-4 rounded-xl border border-border shadow-sm flex flex-wrap items-center gap-3">
        <select
          value={selectedPositionId}
          onChange={(e) => setSelectedPositionId(e.target.value)}
          className="px-3 py-1.5 text-xs bg-surface border border-border rounded-lg"
        >
          <option value="">Tất cả vị trí</option>
          {positions.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>

        <select
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
          className="px-3 py-1.5 text-xs bg-surface border border-border rounded-lg"
        >
          <option value="">Tất cả độ khó</option>
          <option value="EASY">Dễ (Easy)</option>
          <option value="MEDIUM">Vừa (Medium)</option>
          <option value="HARD">Khó (Hard)</option>
        </select>

        <button
          type="button"
          onClick={fetchQuestions}
          className="px-3.5 py-1.5 text-xs font-semibold text-textPrimary bg-surface hover:bg-surfaceSubtle border border-border rounded-lg transition-colors flex items-center space-x-1"
        >
          <Filter className="w-3.5 h-3.5 text-textMuted" />
          <span>Lọc</span>
        </button>
      </div>

      {error && (
        <div className="flex items-center space-x-2 text-xs text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Questions List */}
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-2 text-textMuted">
            <Loader2 className="w-6 h-6 animate-spin text-brand" />
            <span className="text-xs">Đang tải ngân hàng câu hỏi...</span>
          </div>
        ) : questions.length === 0 ? (
          <div className="py-16 text-center text-textMuted text-xs italic">
            Chưa có câu hỏi nào trong danh mục này.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {questions.map((q) => (
              <div key={q.id} className="p-4 hover:bg-slate-50 transition-colors flex items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center space-x-2">
                    {getDifficultyBadge(q.difficulty)}
                    <span className="text-xs font-semibold text-brand">{q.positionTitle || 'Vị trí'}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-textPrimary">{q.content}</h3>
                  <p className="text-xs text-textSecondary line-clamp-2">
                    <strong className="text-textMuted mr-1">Đáp án mẫu:</strong>
                    {q.sampleAnswer}
                  </p>
                  <p className="text-[11px] text-textMuted">
                    <strong>Rubric:</strong> {q.evaluationRubric}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(q.id)}
                  className="p-1.5 text-textMuted hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  title="Xóa câu hỏi"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-xl border border-border max-w-lg w-full p-6 shadow-xl space-y-4 animate-in fade-in duration-150">
            <h3 className="text-lg font-bold text-textPrimary">Thêm câu hỏi mới vào ngân hàng</h3>
            <form onSubmit={handleCreateSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-textSecondary mb-1">Vị trí thực tập:</label>
                <select
                  value={newPositionId}
                  onChange={(e) => setNewPositionId(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs bg-surface border border-border rounded-lg"
                >
                  {positions.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-textSecondary mb-1">Độ khó:</label>
                <select
                  value={newDifficulty}
                  onChange={(e) => setNewDifficulty(e.target.value as any)}
                  className="w-full px-3 py-1.5 text-xs bg-surface border border-border rounded-lg"
                >
                  <option value="EASY">Dễ (Easy)</option>
                  <option value="MEDIUM">Vừa (Medium)</option>
                  <option value="HARD">Khó (Hard)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-textSecondary mb-1">Nội dung câu hỏi:</label>
                <textarea
                  rows={2}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  required
                  placeholder="Ví dụ: Bạn hãy phân biệt giữa Synchronous và Asynchronous trong Node.js?"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-textSecondary mb-1">Câu trả lời mẫu mong đợi:</label>
                <textarea
                  rows={2}
                  value={newSampleAnswer}
                  onChange={(e) => setNewSampleAnswer(e.target.value)}
                  required
                  placeholder="Các ý cốt lõi ứng viên cần nêu được..."
                  className="w-full px-3 py-1.5 text-xs bg-white border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-textSecondary mb-1">Tiêu chí chấm điểm (Rubric):</label>
                <input
                  type="text"
                  value={newRubric}
                  onChange={(e) => setNewRubric(e.target.value)}
                  required
                  placeholder="Ví dụ: Nêu đúng khái niệm (5đ), cho ví dụ đúng (5đ)."
                  className="w-full px-3 py-1.5 text-xs bg-white border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-medium text-textSecondary hover:bg-surface rounded-lg border border-border"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-1.5 text-xs font-medium text-white bg-brand hover:bg-brand-hover rounded-lg"
                >
                  {creating ? 'Đang lưu...' : 'Lưu câu hỏi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
