import { useState, useEffect } from 'react';
import { hoanCanhApi } from '../api/hoanCanhApi';
import { useStore } from '../store/useStore';

interface Props { onSuccess: () => void; }

export default function AddThanhVienModal({ onSuccess }: Props) {
  const { showAddTV,addTVTargetHcId, closeAddTV } = useStore();
  const [ten, setTen] = useState('');
  const [loai, setLoai] = useState('HO_TRO');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (addTVTargetHcId) {
      setTen('');
      setLoai('HO_TRO');
      setError('');
    }
  }, [addTVTargetHcId]);

  const handleClose = () => {
    setError('');
    closeAddTV();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addTVTargetHcId) return;
    if (!ten.trim()) { setError('Vui lòng nhập tên'); return; }

    setError(''); setLoading(true);
    try {
      await hoanCanhApi.addThanhVien(addTVTargetHcId, { ten: ten.trim(), loai });
      onSuccess();
      closeAddTV();
    } catch { setError('Có lỗi xảy ra. Vui lòng thử lại.'); }
    finally { setLoading(false); }
  };

  if (!showAddTV || !addTVTargetHcId) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={handleClose} aria-label="Đóng">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <div className="modal-icon-wrap">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <div className="modal-title">Thêm thành viên</div>

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
            <label className="form-label">Loại</label>
            <select className="form-select" value={loai} onChange={e => setLoai(e.target.value)}>
              <option value="HO_TRO">Hỗ trợ</option>
              <option value="TRUNG_CHUYEN">Trung Chuyển</option>
            </select>
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