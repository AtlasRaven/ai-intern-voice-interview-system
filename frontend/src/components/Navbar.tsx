import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mic, User as UserIcon, LogOut, Briefcase, FileText, CheckCircle2 } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isHR, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2 text-brand font-bold text-lg">
              <div className="w-9 h-9 rounded-lg bg-brand text-white flex items-center justify-center">
                <Mic className="w-5 h-5" />
              </div>
              <span className="text-textPrimary">InternVoice <span className="text-brand">AI</span></span>
            </Link>

            {isAuthenticated && (
              <div className="hidden md:flex items-center space-x-1 pl-6">
                <Link
                  to="/positions"
                  className="px-3 py-2 text-sm font-medium text-textSecondary hover:text-brand hover:bg-surface rounded-md transition-colors flex items-center space-x-1.5"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Vị trí tuyển dụng</span>
                </Link>

                {isHR && (
                  <>
                    <Link
                      to="/hr/dashboard"
                      className="px-3 py-2 text-sm font-medium text-textSecondary hover:text-brand hover:bg-surface rounded-md transition-colors flex items-center space-x-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>HR Dashboard</span>
                    </Link>
                    <Link
                      to="/hr/questions"
                      className="px-3 py-2 text-sm font-medium text-textSecondary hover:text-brand hover:bg-surface rounded-md transition-colors flex items-center space-x-1.5"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Ngân hàng câu hỏi</span>
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-semibold text-textPrimary">{user?.fullName}</div>
                  <div className="text-xs text-textMuted">
                    {user?.role === 'ROLE_ADMIN' ? 'Quản trị viên' : user?.role === 'ROLE_INTERVIEWER' ? 'Tuyển dụng / HR' : 'Ứng viên Intern'}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-textSecondary hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Đăng xuất"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-textSecondary hover:text-brand hover:bg-surface rounded-lg transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-brand hover:bg-brand-hover rounded-lg transition-colors shadow-sm"
                >
                  Đăng ký ứng viên
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
