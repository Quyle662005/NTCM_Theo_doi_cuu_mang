import { useState } from 'react';
import { hoanCanhApi } from '../api/hoanCanhApi';
import { useStore } from '../store/useStore';
import { MONTHS } from '../types';

interface Props { onSuccess: () => void; }

/**
 * Modal "Đăng ký cưu mang" cho 1 MTQ đã có sẵn (khác AddMTQModal - modal đó
 * tạo MTQ MỚI, còn modal này đăng ký thêm THÁNG cho 1 MTQ đã tồn tại).
 *
 * Khi submit, mỗi tháng được chọn sẽ gọi updateThang(mtqId, thang, '') -
 * giaTri RỖNG có nghĩa "đã đăng ký, chưa trao tiền thật" (hiển thị tô màu,
 * không có số bên trong). Khi tiền được trao thật, sửa lại giá trị tháng đó
 * qua chỗ khác (không phải modal này) để nhập số tiền cụ thể.
 *
 * Cách mở modal này ở nơi khác: useStore().openRegisterMonths(mtq.id, mtq.ten)
 */
export default function RegisterMonthsModal({ onSuccess }: Props) {
  const { showRegisterMonths, registerMonthsTarget, closeRegisterMonths } = useStore();
  const [selMonths, setSelMonths] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const currentMonth = new Date().getMonth() + 1; // 1..12

  const toggleMonth = (m: string) => {
    const num = parseInt(m.replace('T', ''));
    setSelMonths(prev => {
      const next = new Set(prev);
      if (next.has(num)) next.delete(num); else next.add(num);
      return next;
    });
  };

  const chonToiHetNam = () => {
    const months = new Set<number>();
    for (let m = currentMonth; m <= 12; m++) months.add(m);
    setSelMonths(months);
  };

  const chon3ThangToi = () => {
    const months = new Set<number>();
    // Giới hạn ở tháng 12 - nếu hiện tại là tháng 11/12, không đăng ký sang năm sau
    // (backend hiện chỉ lưu theo năm hiện tại).
    for (let i = 0; i < 3 && currentMonth + i <= 12; i++) months.add(currentMonth + i);
    setSelMonths(months);
  };

  const handleClose = () => {
    setSelMonths(new Set());
    setError('');
    closeRegisterMonths();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerMonthsTarget) return;
    if (selMonths.size === 0) { setError('Vui lòng chọn ít nhất 1 tháng'); return; }

    setError(''); setLoading(true);
    try {
      const { mtqId } = registerMonthsTarget;
      for (const monthNum of selMonths) {
        await hoanCanhApi.updateThang(mtqId, monthNum, '0'); // rỗng = đã đăng ký, chưa trao tiền
      }
      onSuccess();
      setSelMonths(new Set());
      closeRegisterMonths();
    } catch { setError('Có lỗi xảy ra. Vui lòng thử lại.'); }
    finally { setLoading(false); }
  };

  if (!showRegisterMonths || !registerMonthsTarget) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={handleClose} aria-label="Đóng">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <div className="modal-icon-wrap">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
          </svg>
        </div>
        <div className="modal-title">Đăng ký cưu mang</div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Mạnh thường quân</label>
            <input className="form-input" value={registerMonthsTarget.ten} disabled />
          </div>

          <div className="form-group">
            <label className="form-label">Chọn nhanh</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="button" className="btn-cancel" style={{ flex: 1 }} onClick={chonToiHetNam}>
                Tới hết năm
              </button>
              <button type="button" className="btn-cancel" style={{ flex: 1 }} onClick={chon3ThangToi}>
                3 tháng tới
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Tháng đăng ký &nbsp;
              <span style={{ fontWeight: 400, textTransform: 'none', fontSize: '10.5px', color: '#8A8278' }}>
                click để chọn/bỏ chọn từng tháng
              </span>
            </label>
            <div className="month-picker">
              {MONTHS.map(m => {
                const num = parseInt(m.replace('T', ''));
                return (
                  <button key={m} type="button"
                    className={`month-chip ${selMonths.has(num) ? 'selected' : ''}`}
                    onClick={() => toggleMonth(m)}>{m}
                  </button>
                );
              })}
            </div>
          </div>

          {error && <div className="error-msg">{error}</div>}
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={handleClose}>Hủy</button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Đang đăng ký...' : `Đăng ký (${selMonths.size} tháng)`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}