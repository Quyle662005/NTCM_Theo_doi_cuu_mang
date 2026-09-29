import { useState, useEffect } from 'react';
import { hoanCanhApi } from '../api/hoanCanhApi';
import { useStore } from '../store/useStore';
import { STATUS_OPTIONS, STATUS_DISPLAY } from '../constants';
import type { Region } from '../types';

const NGAN_HANG_LIST = [
  'Vietcombank', 'VietinBank', 'BIDV', 'Agribank', 'Techcombank',
  'MB Bank', 'ACB', 'VPBank', 'Sacombank', 'TPBank',
  'SHB', 'HDBank', 'Eximbank', 'MSB', 'OCB', 'SeABank', 'VIB',
  'Khác',
];

interface Props { regions: Region[]; onSuccess: () => void; }

export default function EditHCModal({ regions, onSuccess }: Props) {
  const { showEditHC, editHCTarget, closeEditHC } = useStore();
  const [form, setForm] = useState({
    regionId: '', ma: '', ten: '', khuVuc: '', trangThai: 'Đang ho trợ',
    mucDeXuat: '', ghiChu: '', link: '', thongTinLienHe: '', viTri: '', thongTinChuyenKhoan: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // ── Bank picker state ────────────────────────────────────────────────────────
  const [showBankFields, setShowBankFields] = useState(false);
  const [nganHang, setNganHang] = useState('');
  const [nganHangKhac, setNganHangKhac] = useState('');
  const [soTaiKhoan, setSoTaiKhoan] = useState('');
  const [tenChuTaiKhoan, setTenChuTaiKhoan] = useState('');

  const tenNganHangCuoi = nganHang === 'Khác' ? nganHangKhac.trim() : nganHang;
  const bankSummary = [tenNganHangCuoi, soTaiKhoan, tenChuTaiKhoan]
    .filter(Boolean).join(' · ');

  useEffect(() => {
    if (!editHCTarget) return;
    setForm({
      regionId: String(editHCTarget.regionId ?? ''),
      ma: editHCTarget.ma ?? '',
      ten: editHCTarget.ten ?? '',
      khuVuc: editHCTarget.khuVuc ?? '',
      trangThai: editHCTarget.trangThai ?? 'Dang ho tro',
      mucDeXuat: editHCTarget.mucDeXuat ? String(editHCTarget.mucDeXuat) : '',
      ghiChu: editHCTarget.ghiChu ?? '',
      link: editHCTarget.link ?? '',
      thongTinLienHe: editHCTarget.thongTinLienHe ?? '',
      viTri: editHCTarget.viTri ?? '',
      thongTinChuyenKhoan: editHCTarget.thongTinChuyenKhoan ?? '',
    });
    setError('');

    // Parse thongTinChuyenKhoan: "BIDV - 123456789 - Nguyễn Văn A" → 3 trường
    const raw = editHCTarget.thongTinChuyenKhoan ?? '';
    if (raw) {
      const parts = raw.split(' - ');
      const parsedBank = parts[0] ?? '';
      const parsedAccount = parts[1] ?? '';
      const parsedHolder = parts.slice(2).join(' - ');  // name có thể chứa " - "

      if (NGAN_HANG_LIST.includes(parsedBank)) {
        setNganHang(parsedBank);
        setNganHangKhac('');
      } else if (parsedBank) {
        setNganHang('Khác');
        setNganHangKhac(parsedBank);
      } else {
        setNganHang('');
        setNganHangKhac('');
      }
      setSoTaiKhoan(parsedAccount);
      setTenChuTaiKhoan(parsedHolder);
    } else {
      setNganHang(''); setNganHangKhac('');
      setSoTaiKhoan(''); setTenChuTaiKhoan('');
    }
  }, [editHCTarget]);

  const upd = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleClose = () => { setError(''); closeEditHC(); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editHCTarget) return;
    if (!form.ten.trim()) { setError('Vui lòng nhập tên hoàn cảnh'); return; }
    if (!form.regionId) { setError('Vui lòng chọn vùng'); return; }

    const thongTinChuyenKhoan = [tenNganHangCuoi, soTaiKhoan, tenChuTaiKhoan.trim()]
      .filter(Boolean).join(' - ');

    setError(''); setLoading(true);
    try {
      await hoanCanhApi.update(editHCTarget.id, {
        regionId: parseInt(form.regionId),
        ma: form.ma.trim(), ten: form.ten.trim(),
        khuVuc: form.khuVuc.trim(), trangThai: form.trangThai,
        mucDeXuat: form.mucDeXuat ? parseInt(form.mucDeXuat) : 0,
        ghiChu: form.ghiChu.trim(), link: form.link.trim(),
        thongTinLienHe: form.thongTinLienHe.trim(),
        viTri: form.viTri.trim(),
        thongTinChuyenKhoan,
      });
      onSuccess();
      closeEditHC();
    } catch { setError('Có lỗi xảy ra. Vui lòng thử lại.'); }
    finally { setLoading(false); }
  };

  if (!showEditHC || !editHCTarget) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-box wide" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={handleClose} aria-label="Đóng">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <div className="modal-icon-wrap">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </div>
        <div className="modal-title">Sửa hoàn cảnh</div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Vùng <span className="req">*</span></label>
              <select className="form-select" value={form.regionId} onChange={e => upd('regionId', e.target.value)}>
                {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Mã HC</label>
              <input className="form-input" value={form.ma} onChange={e => upd('ma', e.target.value)} placeholder="001" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Tên hoàn cảnh <span className="req">*</span></label>
            <input className="form-input" value={form.ten} onChange={e => upd('ten', e.target.value)} autoFocus />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Khu vực</label>
              <input className="form-input" value={form.khuVuc} onChange={e => upd('khuVuc', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Trạng thái</label>
              <select className="form-select" value={form.trangThai} onChange={e => upd('trangThai', e.target.value)}>
                {STATUS_OPTIONS.map(o => <option key={o} value={o}>{STATUS_DISPLAY[o] ?? o}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Mức đề xuất (nghìn đồng)</label>
              <input className="form-input" type="number" min="0" value={form.mucDeXuat} onChange={e => upd('mucDeXuat', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Ghi chú</label>
              <input className="form-input" value={form.ghiChu} onChange={e => upd('ghiChu', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Link (nếu có)</label>
            <input className="form-input" value={form.link} onChange={e => upd('link', e.target.value)} placeholder="https://..." />
          </div>

          <div className="form-section-label">Thông tin liên hệ & vị trí</div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Thông tin liên hệ</label>
              <input className="form-input" value={form.thongTinLienHe} onChange={e => upd('thongTinLienHe', e.target.value)} placeholder="SDT, Zalo..." />
            </div>
            <div className="form-group">
              <label className="form-label">Vị trí (Google Maps)</label>
              <input className="form-input" value={form.viTri} onChange={e => upd('viTri', e.target.value)} placeholder="https://maps.google.com/..." />
            </div>
          </div>

          {/* THÔNG TIN CHUYỂN KHOẢN — bank picker giống AddHCModal */}
          <div className="form-group">
            <label className="form-label">Thông tin chuyển khoản</label>
            <button
              type="button"
              className="bank-picker-trigger"
              onClick={() => setShowBankFields(s => !s)}
            >
              <span className="bank-picker-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
                </svg>
              </span>
              <span className={`bank-picker-text ${bankSummary ? '' : 'placeholder'}`}>
                {bankSummary || 'Chọn ngân hàng và nhập số tài khoản'}
              </span>
              <svg
                className={`bank-picker-chevron ${showBankFields ? 'open' : ''}`}
                width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {showBankFields && (
              <div className="bank-picker-fields">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Tên ngân hàng</label>
                    <select className="form-select" value={nganHang} onChange={e => setNganHang(e.target.value)}>
                      <option value="">-- Chọn ngân hàng --</option>
                      {NGAN_HANG_LIST.map(nh => <option key={nh} value={nh}>{nh}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Số tài khoản</label>
                    <input
                      className="form-input"
                      value={soTaiKhoan}
                      onChange={e => setSoTaiKhoan(e.target.value.replace(/\D/g, ''))}
                      placeholder="0123456789"
                      inputMode="numeric"
                    />
                  </div>
                </div>
                {nganHang === 'Khác' && (
                  <div className="form-group">
                    <label className="form-label">Tên ngân hàng khác</label>
                    <input
                      className="form-input"
                      value={nganHangKhac}
                      onChange={e => setNganHangKhac(e.target.value)}
                      placeholder="Nhập tên ngân hàng..."
                    />
                  </div>
                )}
                <div className="form-group">
                  <label className="form-label">Tên chủ tài khoản</label>
                  <input
                    className="form-input"
                    value={tenChuTaiKhoan}
                    onChange={e => setTenChuTaiKhoan(e.target.value)}
                    placeholder="Nguyễn Văn A..."
                  />
                </div>
              </div>
            )}
          </div>

          {error && <div className="error-msg">{error}</div>}
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={handleClose}>Hủy</button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
