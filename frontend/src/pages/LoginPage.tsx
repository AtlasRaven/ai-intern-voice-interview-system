import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mic, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await login(email, password);
      navigate('/positions');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Email hoặc mật khẩu không chính xác.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoCandidate = async () => {
    setEmail('candidate@intern.vn');
    setPassword('password');
    try {
      setLoading(true);
      setError(null);
      await login('candidate@intern.vn', 'password');
      navigate('/positions');
    } catch (err: any) {
      setError('Đăng nhập demo candidate thất bại.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoHR = async () => {
    setEmail('hr@intern.vn');
    setPassword('password');
    try {
      setLoading(true);
      setError(null);
      await login('hr@intern.vn', 'password');
      navigate('/hr/dashboard');
    } catch (err: any) {
      setError('Đăng nhập demo HR thất bại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-surface">
      <div className="bg-white rounded-xl border border-border max-w-md w-full p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-brand text-white flex items-center justify-center mx-auto shadow-sm">
            <Mic className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-textPrimary">Đăng nhập hệ thống</h1>
          <p className="text-xs text-textMuted">Phỏng vấn tuyển dụng thực tập sinh IT bằng giọng nói AI</p>
        </div>

        {error && (
          <div className="flex items-center space-x-2 text-xs text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-textSecondary mb-1.5">Địa chỉ Email:</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-textMuted absolute left-3.5 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="candidate@intern.vn"
                required
                className="w-full pl-10 pr-3.5 py-2 text-sm bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-textSecondary mb-1.5">Mật khẩu:</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-textMuted absolute left-3.5 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-3.5 py-2 text-sm bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 text-sm font-semibold text-white bg-brand hover:bg-brand-hover rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-sm disabled:opacity-50"
          >
            {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            <span>Đăng nhập vào hệ thống</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 border-t border-border space-y-3">
          <div className="text-xs text-textMuted text-center font-medium">Hoặc đăng nhập nhanh bằng tài khoản thử nghiệm:</div>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={handleDemoCandidate}
              className="py-2 px-3 text-xs font-medium text-textSecondary bg-surface hover:bg-surfaceSubtle border border-border rounded-lg transition-colors"
            >
              Candidate Demo
            </button>
            <button
              type="button"
              onClick={handleDemoHR}
              className="py-2 px-3 text-xs font-medium text-brand bg-blue-50 hover:bg-blue-100 border border-brand-border rounded-lg transition-colors"
            >
              HR / Tuyển dụng
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-textMuted">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-brand font-semibold hover:underline">
            Đăng ký ứng viên
          </Link>
        </div>
      </div>
    </div>
  );
};
