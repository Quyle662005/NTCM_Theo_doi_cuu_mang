import { useState } from 'react';
import { hoanCanhApi } from '../api/hoanCanhApi';
import type { Region } from '../types';
import { STATUS_OPTIONS, STATUS_DISPLAY } from '../constants';

// Danh sách ngân hàng phổ biến ở VN — thêm/bớt tuỳ ý
const NGAN_HANG_LIST = [
  'Vietcombank', 'VietinBank', 'BIDV', 'Agribank', 'Techcombank',
  'MB Bank', 'ACB', 'VPBank', 'Sacombank', 'TPBank',
  'SHB', 'HDBank', 'Eximbank', 'MSB', 'OCB', 'SeABank', 'VIB',
  'Khác',
];

interface Props { regions: Region[]; onClose: () => void; onSuccess: () => void; }

export default function AddHCModal({ regions, onClose, onSuccess }: Props) {
  const [form, setForm] = useState({
    regionId: '',
    ma: '', ten: '', khuVuc: '', trangThai: 'Dang ho tro',
    mucDeXuat: '', ghiChu: '', link: '', mtqTen: '', mtqMuc: '', thongTinLienHe: '', viTri: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // --- Thông tin chuyển khoản kiểu app ngân hàng: click để mở ra
  // 2 ô (chọn ngân hàng + số tài khoản) thay vì 1 ô text tự do ---
  const [showBankFields, setShowBankFields] = useState(false);
  const [nganHang, setNganHang] = useState('');
  const [nganHangKhac, setNganHangKhac] = useState('');
  const [soTaiKhoan, setSoTaiKhoan] = useState('');
  const [tenChuTaiKhoan, setTenChuTaiKhoan] = useState('');

  const tenNganHangCuoi = nganHang === 'Khác' ? nganHangKhac.trim() : nganHang;

  // Hiển thị tóm tắt trên trigger button — ghép các trường đã điền
  const bankSummary = [tenNganHangCuoi, soTaiKhoan, tenChuTaiKhoan]
    .filter(Boolean).join(' · ');

  const upd = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  // Khi dán link, tự động trích số topic làm mã HC
  // VD: https://nguoitoicuumang.com/index.php?topic=87050.0  →  mã: 87050
  const handleLinkChange = (v: string) => {
    upd('link', v);
    try {
      const url = new URL(v.trim());
      const topic = url.searchParams.get('topic');
      if (topic) {
        const ma = topic.split('.')[0]; // lấy phần trước dấu chấm
        upd('ma', ma);
      }
    } catch { /* URL chưa hợp lệ, bỏ qua */ }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.ten.trim()) { setError('Vui lòng nhập tên hoàn cảnh'); return; }
    if (!form.regionId) { setError('Vui lòng chọn vùng'); return; }
    setError(''); setLoading(true);
    try {
      // Ghép 3 trường ngân hàng + số tài khoản + tên chủ tài khoản thành 1 chuỗi
      const thongTinChuyenKhoan = [tenNganHangCuoi, soTaiKhoan, tenChuTaiKhoan.trim()]
        .filter(Boolean).join(' - ');

      const res = await hoanCanhApi.create({
        regionId: parseInt(form.regionId),
        ma: form.ma.trim(), ten: form.ten.trim(),
        khuVuc: form.khuVuc.trim(), trangThai: form.trangThai,
        mucDeXuat: form.mucDeXuat ? parseInt(form.mucDeXuat) : 0,
        ghiChu: form.ghiChu.trim(), link: form.link.trim(),
        viTri: form.viTri.trim(), thongTinLienHe: form.thongTinLienHe.trim(),
        thongTinChuyenKhoan,
      });
      if (form.mtqTen.trim()) {
        await hoanCanhApi.addMtq(res.data.data.id, {
          ten: form.mtqTen.trim(),
          muc: form.mtqMuc ? parseInt(form.mtqMuc) : 0,
        });
      }
      onSuccess(); onClose();
    } catch { setError('Có lỗi xảy ra. Vui lòng thử lại.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box wide" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Đóng">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <div className="modal-icon-wrap">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
        <div className="modal-title">Thêm Hoàn Cảnh Mới</div>
        <form onSubmit={handleSubmit}>
          {/* Link + Mã HC cùng hàng đầu tiên — dán link → mã tự điền */}
          <div className="form-row" style={{ alignItems: 'flex-end' }}>
            <div className="form-group" style={{ flex: 2 }}>
              <label className="form-label">
                Link hoàn cảnh
                <span style={{ fontWeight: 400, fontSize: '10.5px', color: '#8A8278', marginLeft: 6 }}>
                </span>
              </label>
              <input
                className="form-input"
                value={form.link}
                onChange={e => handleLinkChange(e.target.value)}
                placeholder="https://nguoitoicuumang.com/index.php?topic=..."
                autoFocus
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Mã HC</label>
              <input
                className="form-input"
                value={form.ma}
                readOnly
                style={{ background: '#F5F5F2', color: '#888', cursor: 'default' }}
                placeholder="Tự điền từ link hoàn cảnh "
                title="Mã HC được tự động lấy từ link"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Khu vực <span className="req">*</span></label>
              <select className="form-select" value={form.regionId} onChange={e => upd('regionId', e.target.value)}>
                <option value="">-- Chọn khu vực --</option>
                {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Tỉnh</label>
              <input className="form-input" value={form.khuVuc} onChange={e => upd('khuVuc', e.target.value)} placeholder="" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Tên hoàn cảnh <span className="req">*</span></label>
            <input className="form-input" value={form.ten} onChange={e => upd('ten', e.target.value)} placeholder="Nguyễn Thị A..." />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Trạng thái</label>
              <select className="form-select" value={form.trangThai} onChange={e => upd('trangThai', e.target.value)}>
                {STATUS_OPTIONS.map(o => <option key={o} value={o}>{STATUS_DISPLAY[o] ?? o}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Mức đề xuất (nghìn đồng)</label>
              <input className="form-input" type="number" min="0" value={form.mucDeXuat} onChange={e => upd('mucDeXuat', e.target.value)} placeholder="0" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Ghi chú</label>
            <input className="form-input" value={form.ghiChu} onChange={e => upd('ghiChu', e.target.value)} placeholder="..." />
          </div>
          <div className="form-group">
            <label className="form-label">Vị trí</label>
            <input className="form-input" value={form.viTri} onChange={e => upd('viTri', e.target.value)} placeholder="Địa chỉ..." />
          </div>

          <div className="form-group">
            <label className="form-label">Thông tin liên hệ</label>
            <input className="form-input" value={form.thongTinLienHe} onChange={e => upd('thongTinLienHe', e.target.value)} placeholder="Số điện thoại..." />
          </div>

          {/* THÔNG TIN CHUYỂN KHOẢN — kiểu app ngân hàng: bấm vào để
              mở ra 2 ô (chọn ngân hàng + số tài khoản) */}
          <div className="form-group">
            <label className="form-label">Thông tin chuyển khoản</label>
            <button
              type="button"
              className="bank-picker-trigger"
              onClick={() => setShowBankFields(s => !s)}
            >
              <span className="bank-picker-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
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

          <div className="form-section-label">Mạnh thường quân đầu tiên</div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Tên MTQ</label>
              <input className="form-input" value={form.mtqTen} onChange={e => upd('mtqTen', e.target.value)} placeholder="Trần Văn B..." />
            </div>
            <div className="form-group">
              <label className="form-label">Mức/tháng (nghìn đồng)</label>
              <input className="form-input" type="number" min="0" value={form.mtqMuc} onChange={e => upd('mtqMuc', e.target.value)} placeholder="500" />
            </div>
          </div>
          {error && <div className="error-msg">{error}</div>}
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Hủy</button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Đang thêm...' : '+ Thêm hoàn cảnh'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}