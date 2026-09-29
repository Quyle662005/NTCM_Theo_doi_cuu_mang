import { useState } from 'react';
import { authApi } from '../api/hoanCanhApi';
import { useStore } from '../store/useStore';

interface Props { onClose: () => void; }

export default function LoginModal({ onClose }: Props) {
  const setAuth = useStore(s => s.setAuth);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) { setError('Vui lòng nhập đầy đủ thông tin'); return; }
    setError(''); setLoading(true);
    try {
      const res = await authApi.login(username, password);
      setAuth(res.data.data.token, res.data.data.username);
      onClose();
    } catch {
      setError('Sai tên đăng nhập hoặc mật khẩu');
      const box = document.getElementById('login-modal-box');
      box?.classList.add('shake');
      setTimeout(() => box?.classList.remove('shake'), 400);
    } finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div id="login-modal-box" className="modal-box" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Đóng">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <div className="modal-icon-wrap">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
        <div className="modal-title">Đăng nhập Admin</div>
        <div className="modal-sub">Chỉ admin mới có thể chỉnh sửa dữ liệu</div>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Tên đăng nhập</label>
            <input className="form-input" value={username} onChange={e => setUsername(e.target.value)} placeholder="admin" autoFocus />
          </div>
          <div className="form-group">
            <label className="form-label">Mật khẩu</label>
            <div className="pw-wrap">
              <input className="form-input" type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="..." style={{ paddingRight: '44px' }} />
              <button type="button" className="pw-toggle" onClick={() => setShowPw(!showPw)}>
                {showPw ? '🙈' : '👁'}
              </button>
            </div>
          </div>
          {error && <div className="error-msg">{error}</div>}
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Hủy</button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
