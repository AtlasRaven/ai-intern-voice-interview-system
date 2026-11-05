import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Position } from '../types';
import { apiClient } from '../services/api';
import { ConsentModal } from '../components/ConsentModal';
import { Briefcase, ArrowRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export const PositionsPage: React.FC = () => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [isConsentOpen, setIsConsentOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.get<{ data: Position[] }>('/positions');
      setPositions(res.data.data || []);
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách vị trí tuyển dụng.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartClick = (pos: Position) => {
    setSelectedPosition(pos);
    setIsConsentOpen(true);
  };

  const handleConfirmConsent = async (useTextFallback: boolean) => {
    if (!selectedPosition) return;

    // 1. Record consent
    await apiClient.post('/consents', {
      consentType: 'AUDIO_RECORDING',
      agreed: true,
      policyVersion: 'v1.0',
    });

    // 2. Create Interview Session
    const res = await apiClient.post('/sessions', {
      positionId: selectedPosition.id,
    });

    const sessionData = res.data?.data;
    setIsConsentOpen(false);

    // 3. Navigate to Interview Room
    navigate(`/interview/${sessionData.sessionId}?token=${sessionData.sessionToken}&textOnly=${useTextFallback}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-textPrimary">Vị trí Thực tập sinh đang mở tuyển</h1>
        <p className="text-sm text-textSecondary">
          Chọn chuyên ngành phù hợp với định hướng của bạn để bắt đầu phiên phỏng vấn thoại trực tiếp với AI Interviewer.
        </p>
      </div>

      {error && (
        <div className="flex items-center space-x-2 text-sm text-red-600 bg-red-50 p-4 rounded-xl border border-red-200">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3 text-textMuted">
          <Loader2 className="w-8 h-8 animate-spin text-brand" />
          <span className="text-sm">Đang tải danh sách vị trí tuyển dụng...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {positions.map((pos) => (
            <div
              key={pos.id}
              className="bg-white rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-50 text-brand border border-blue-200">
                    {pos.code}
                  </span>
                  <span className="inline-flex items-center text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    Đang tuyển
                  </span>
                </div>

                <h3 className="text-lg font-bold text-textPrimary">{pos.title}</h3>
                <p className="text-xs text-textSecondary line-clamp-3 leading-relaxed">{pos.description}</p>

                <div className="pt-2 border-t border-border space-y-2">
                  <div className="text-xs font-semibold text-textMuted">Kỹ năng yêu cầu:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {pos.skills && pos.skills.length > 0 ? (
                      pos.skills.map((skill, idx) => (
                        <span key={idx} className="text-[11px] px-2 py-0.5 bg-surface text-textSecondary rounded-md border border-border">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] text-textMuted italic">OOP, SQL, Git</span>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleStartClick(pos)}
                className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-brand hover:bg-brand-hover rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-sm"
              >
                <span>Bắt đầu phỏng vấn</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedPosition && (
        <ConsentModal
          position={selectedPosition}
          isOpen={isConsentOpen}
          onClose={() => setIsConsentOpen(false)}
          onConfirm={handleConfirmConsent}
        />
      )}
    </div>
  );
};
