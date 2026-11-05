import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Evaluation, Position } from '../types';
import { apiClient } from '../services/api';
import { HREditModal } from '../components/HREditModal';
import { Download, Search, Filter, CheckCircle2, XCircle, Clock, Edit3, Eye, Loader2, AlertCircle } from 'lucide-react';

export const HRDashboardPage: React.FC = () => {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedPositionId, setSelectedPositionId] = useState<string>('');
  const [minScore, setMinScore] = useState<string>('');
  const [searchName, setSearchName] = useState('');

  const [selectedEval, setSelectedEval] = useState<Evaluation | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchPositions();
    fetchEvaluations();
  }, []);

  const fetchPositions = async () => {
    try {
      const res = await apiClient.get<{ data: Position[] }>('/positions');
      setPositions(res.data.data || []);
    } catch (err) {}
  };

  const fetchEvaluations = async () => {
    try {
      setLoading(true);
      setError(null);
      const params: any = {};
      if (selectedPositionId) params.positionId = selectedPositionId;
      if (minScore) params.minScore = minScore;

      const res = await apiClient.get<{ data: Evaluation[] }>('/evaluations', { params });
      setEvaluations(res.data.data || []);
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách đánh giá.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEvaluations();
  };

  const handleEditClick = (evaluation: Evaluation) => {
    setSelectedEval(evaluation);
    setIsEditModalOpen(true);
  };

  const handleUpdateSuccess = (updated: Evaluation) => {
    setEvaluations((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
  };

  const filteredEvaluations = evaluations.filter((e) =>
    searchName ? e.candidateName.toLowerCase().includes(searchName.toLowerCase()) : true
  );

  const exportToCSV = () => {
    if (filteredEvaluations.length === 0) return;

    const headers = ['ID', 'Ứng viên', 'Vị trí', 'Điểm AI', 'Điểm HR', 'Trạng thái', 'Thời gian'];
    const rows = filteredEvaluations.map((e) => [
      e.id,
      `"${e.candidateName}"`,
      `"${e.positionTitle}"`,
      e.overallScore,
      e.hrScoreOverride ?? e.overallScore,
      e.finalStatus,
      `"${e.evaluatedAt}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `danh-sach-ung-vien-intern-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PASSED':
        return (
          <span className="inline-flex items-center text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            Đạt (Pass)
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center text-[11px] font-semibold text-red-800 bg-red-50 px-2 py-0.5 rounded border border-red-300">
            <XCircle className="w-3.5 h-3.5 mr-1 text-red-600" />
            Loại (Fail)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
            <Clock className="w-3.5 h-3.5 mr-1 text-amber-600" />
            Xem xét
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary">HR Dashboard — Quản lý Đánh giá Tuyển dụng</h1>
          <p className="text-sm text-textSecondary">
            Theo dõi, so sánh và chuẩn hóa kết quả phỏng vấn AI của ứng viên thực tập sinh.
          </p>
        </div>

        <button
          type="button"
          onClick={exportToCSV}
          className="px-4 py-2 text-xs font-semibold text-textPrimary bg-white border border-border hover:bg-surface rounded-lg transition-colors flex items-center space-x-2 shadow-sm self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-brand" />
          <span>Xuất Báo cáo CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <form onSubmit={handleFilterSubmit} className="bg-white p-4 rounded-xl border border-border shadow-sm grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-textMuted absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Tìm theo tên ứng viên..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-surface border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>

        <div>
          <select
            value={selectedPositionId}
            onChange={(e) => setSelectedPositionId(e.target.value)}
            className="w-full px-3 py-1.5 text-xs bg-surface border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-brand"
          >
            <option value="">Tất cả vị trí</option>
            {positions.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <input
            type="number"
            step="0.5"
            min="0"
            max="10"
            value={minScore}
            onChange={(e) => setMinScore(e.target.value)}
            placeholder="Điểm tối thiểu >= (VD: 7.0)"
            className="w-full px-3 py-1.5 text-xs bg-surface border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-1.5 text-xs font-semibold text-white bg-brand hover:bg-brand-hover rounded-lg transition-colors flex items-center justify-center space-x-1.5"
        >
          <Filter className="w-3.5 h-3.5" />
          <span>Lọc dữ liệu</span>
        </button>
      </form>

      {error && (
        <div className="flex items-center space-x-2 text-xs text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Evaluations Table */}
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-2 text-textMuted">
            <Loader2 className="w-6 h-6 animate-spin text-brand" />
            <span className="text-xs">Đang tải bảng ứng viên...</span>
          </div>
        ) : filteredEvaluations.length === 0 ? (
          <div className="py-16 text-center text-textMuted text-xs italic">
            Không tìm thấy hồ sơ đánh giá nào khớp với điều kiện lọc.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-surface border-b border-border text-textMuted font-semibold">
                  <th className="py-3 px-4">Ứng viên</th>
                  <th className="py-3 px-4">Vị trí</th>
                  <th className="py-3 px-4">Điểm AI</th>
                  <th className="py-3 px-4">Điểm HR Chốt</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-textPrimary">
                {filteredEvaluations.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-semibold">{item.candidateName}</td>
                    <td className="py-3 px-4 text-textSecondary">{item.positionTitle}</td>
                    <td className="py-3 px-4 font-bold text-brand">{item.overallScore}</td>
                    <td className="py-3 px-4 font-bold text-textPrimary">
                      {item.hrScoreOverride !== undefined && item.hrScoreOverride !== null ? item.hrScoreOverride : '—'}
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(item.finalStatus)}</td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <Link
                        to={`/evaluation/${item.sessionId}`}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 text-[11px] font-medium text-textSecondary bg-white border border-border hover:bg-surface rounded-md transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Xem chi tiết</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleEditClick(item)}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 text-[11px] font-medium text-brand bg-blue-50 border border-blue-200 hover:bg-blue-100 rounded-md transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Chấm / Sửa điểm</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedEval && (
        <HREditModal
          evaluation={selectedEval}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
};
