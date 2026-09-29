import { useState, useEffect, useRef } from 'react';
import { hoanCanhApi, mangThuongQuanApi } from '../api/hoanCanhApi';
import type { MtqSuggestion } from '../api/hoanCanhApi';
import { useStore } from '../store/useStore';
import { MONTHS } from '../types';

interface Props { onClose: () => void; onSuccess: () => void; }

export default function AddMTQModal({ onClose, onSuccess }: Props) {
  const { addMTQTargetHcId } = useStore();
  const [ten, setTen] = useState('');
  const [muc, setMuc] = useState('');
  const [selMonths, setSelMonths] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ==== Autocomplete gợi ý MTQ đã có sẵn ====
  const [suggestions, setSuggestions] = useState<MtqSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!ten.trim()) {
      setSuggestions([]);
      return;
    }

    // Debounce 300ms - tránh gọi API mỗi lần gõ 1 ký tự
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await mangThuongQuanApi.search(ten.trim());
        setSuggestions(res.data.data);
      } catch {
        setSuggestions([]);
      }
    }, 300);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [ten]);

  const chonGoiY = (s: MtqSuggestion) => {
    setTen(s.ten);
    setShowSuggestions(false);
  };

  const toggleMonth = (m: string) => {
    const num = parseInt(m.replace('T', ''));
    setSelMonths(prev => {
      const next = new Set(prev);
      if (next.has(num)) next.delete(num); else next.add(num);
      return next;
    });
  };

  const [nhuYeuPham, setNhuYeuPham] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ten.trim()) { setError('Vui lòng nhập tên MTQ'); return; }
    if (!muc.trim() && !nhuYeuPham) {
      setError('Vui lòng nhập mức hỗ trợ hoặc tích nhu yếu phẩm'); return;
    }
    if (!addMTQTargetHcId) return;
    setError(''); setLoading(true);
    try {
      const res = await hoanCanhApi.addMtq(addMTQTargetHcId, {
        ten: ten.trim(),
        muc: muc ? parseInt(muc) : 0,
      });
      const mtqId = res.data.data.id;
      // Nếu có mức tiền → dùng số; chỉ nhu yếu phẩm → dùng 'ok'
      const giaTri = muc.trim() ? muc.trim() : 'ok';
      for (const monthNum of selMonths) {
        await hoanCanhApi.updateThang(mtqId, monthNum, giaTri);
      }
      onSuccess(); onClose();
    } catch { setError('Có lỗi xảy ra. Vui lòng thử lại.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Đóng">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <div className="modal-icon-wrap">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <div className="modal-title">Thêm Mạnh Thường Quân</div>
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ position: 'relative' }}>
            <label className="form-label">Tên MTQ <span className="req">*</span></label>
            <input
              className="form-input"
              value={ten}
              onChange={e => setTen(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)} // delay để kịp click chọn gợi ý
              placeholder="Nguyễn Văn A..."
              autoFocus
              autoComplete="off"
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="mtq-suggestions">
                {suggestions.map(s => (
                  <div
                    key={s.id}
                    className="mtq-suggestion-item"
                    onMouseDown={() => chonGoiY(s)} // onMouseDown chạy trước onBlur
                  >
                    {s.ten}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="form-group">
            <label className="form-label">
              Mức hỗ trợ / tháng (nghìn đồng)
              <span className="req"> *</span>
              <span style={{ fontWeight: 400, fontSize: '10.5px', color: '#8A8278', marginLeft: 4 }}>
                (ít nhất 1 trong 2)
              </span>
            </label>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <input
                className="form-input"
                type="number"
                min="0"
                value={muc}
                onChange={e => setMuc(e.target.value)}
                placeholder="VD: 500"
                style={{ flex: 1 }}
              />
              <label className="nyp-checkbox-label">
                <input
                  type="checkbox"
                  checked={nhuYeuPham}
                  onChange={e => setNhuYeuPham(e.target.checked)}
                  className="nyp-checkbox"
                />
                <span className="nyp-checkbox-box" aria-hidden="true">
                  {nhuYeuPham && (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </span>
                Nhu yếu phẩm
              </label>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">
              Tháng hỗ trợ &nbsp;
              <span style={{ fontWeight: 400, textTransform: 'none', fontSize: '10.5px', color: '#8A8278' }}>
                click để chọn (mặc định: nhu yếu phẩm)
              </span>
            </label>
            <div className="month-picker">
              {MONTHS.map(m => {
                const num = parseInt(m.replace('T', ''));
                const selected = selMonths.has(num);
                return (
                  <button key={m} type="button"
                    className={`month-chip ${selected ? 'selected' : ''}`}
                    onClick={() => toggleMonth(m)}
                  >
                    {m}
                    {selected && <span className="month-chip-dot" />}
                  </button>
                );
              })}
            </div>
          </div>
          {error && <div className="error-msg">{error}</div>}
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Hủy</button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Đang thêm...' : '+ Thêm MTQ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}