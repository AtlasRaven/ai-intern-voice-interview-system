import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, Phone, AlertCircle, ArrowRight } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await register({
        fullName,
        email,
        phone,
        password,
        role: 'ROLE_CANDIDATE',
      });
      navigate('/positions');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Đăng ký tài khoản thất bại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-surface">
      <div className="bg-white rounded-xl border border-border max-w-md w-full p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-brand text-white flex items-center justify-center mx-auto shadow-sm">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-textPrimary">Đăng ký ứng viên Intern</h1>
          <p className="text-xs text-textMuted">Tạo hồ sơ và tham gia phỏng vấn giọng nói AI tức thì</p>
        </div>

        {error && (
          <div className="flex items-center space-x-2 text-xs text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-textSecondary mb-1.5">Họ và tên sinh viên:</label>
            <div className="relative">
              <User className="w-4 h-4 text-textMuted absolute left-3.5 top-3" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nguyễn Văn An"
                required
                className="w-full pl-10 pr-3.5 py-2 text-sm bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-textSecondary mb-1.5">Địa chỉ Email:</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-textMuted absolute left-3.5 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nguyenvanan@intern.vn"
                required
                className="w-full pl-10 pr-3.5 py-2 text-sm bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-textSecondary mb-1.5">Số điện thoại liên hệ:</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-textMuted absolute left-3.5 top-3" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0912345678"
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
                placeholder="Tối thiểu 6 ký tự"
                minLength={6}
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
            <span>Đăng ký hồ sơ ứng viên</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-textMuted border-t border-border pt-4">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-brand font-semibold hover:underline">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
};
