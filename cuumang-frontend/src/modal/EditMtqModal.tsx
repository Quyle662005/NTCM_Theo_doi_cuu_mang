import { useState, useEffect } from 'react';
import { hoanCanhApi } from '../api/hoanCanhApi';
import { useStore } from '../store/useStore';

interface Props { onSuccess: () => void; }

export default function EditMtqModal({ onSuccess }: Props) {
  const { showEditMTQ, editMTQTarget, closeEditMTQ } = useStore();
  const [ten, setTen] = useState('');
  const [muc, setMuc] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editMTQTarget) {
      setTen(editMTQTarget.ten);
      setMuc(editMTQTarget.muc ? String(editMTQTarget.muc) : '');
      setError('');
    }
  }, [editMTQTarget]);

  const handleClose = () => {
    setError('');
    closeEditMTQ();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editMTQTarget) return;
    if (!ten.trim()) { setError('Vui lòng nhập tên'); return; }

    setError(''); setLoading(true);
    try {
      await hoanCanhApi.updateMtq(editMTQTarget.id, {
        ten: ten.trim(),
        muc: muc.trim() ? parseFloat(muc.trim()) : undefined,
      });
      onSuccess();
      closeEditMTQ();
    } catch { setError('Có lỗi xảy ra. Vui lòng thử lại.'); }
    finally { setLoading(false); }
  };

  if (!showEditMTQ || !editMTQTarget) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={handleClose} aria-label="Đóng">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <div className="modal-icon-wrap">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </div>
        <div className="modal-title">Sửa mạnh thường quân</div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Tên<span className="req">*</span></label>
            <input
              className="form-input"
              value={ten}
              onChange={e => setTen(e.target.value)}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mức/tháng</label>
            <input
              className="form-input"
              type="number"
              value={muc}
              onChange={e => setMuc(e.target.value)}
              placeholder="Để trống nếu không có"
            />
          </div>

          {error && <div className="error-msg">{error}</div>}
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={handleClose}>Hủy</button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Đang lưu...' : 'Lưu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}