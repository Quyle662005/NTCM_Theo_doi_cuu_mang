import { useState } from 'react';
import type { HoanCanh } from '../types';
import MTQTable from './MTQTable';
import { useStore } from '../store/useStore';
import { hoanCanhApi } from '../api/hoanCanhApi';
import { STATUS_CLASS, STATUS_OPTIONS, STATUS_DISPLAY } from '../constants';


interface Props { hc: HoanCanh; onDataChange: () => void; index: number; }

const fmtMoney = (v: number) => (v && v > 0) ? v.toLocaleString('vi-VN') : '';

// Tính trung bình tiền đã trao thực tế:
// chỉ tính các ô tháng hiển thị SỐ (> 0), bỏ qua 'ok' (nhu yếu phẩm) và ô trống
const tinhTBDaTrao = (hc: HoanCanh): number => {
    const soTien: number[] = hc.mtqList.flatMap(mtq =>
        mtq.thangList
            .map(th => parseFloat(th.giaTri))
            .filter(v => !isNaN(v) && v > 0)
    );
    if (soTien.length === 0) return 0;
    return soTien.reduce((s, v) => s + v, 0) / soTien.length;
};

export default function HCCard({ hc, onDataChange, index }: Props) {
    const { token, openAddMTQ, openEditTV, openEditHC, openAddTV, patchHC } = useStore();
    const isAdmin = !!token;
    const [deletingTvId, setDeletingTvId] = useState<number | null>(null);
    const [showContact, setShowContact] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [copied, setCopied] = useState(false);
    const [editingBQ, setEditingBQ] = useState(false);
    const [bqInput, setBqInput] = useState('');

    // Optimistic UI: cập nhật trạng thái local ngay lập tức, rollback nếu API lỗi
    const handleStatusChange = async (newStatus: string) => {
        if (newStatus === hc.trangThai) return;
        const oldStatus = hc.trangThai;
        patchHC(hc.id, { trangThai: newStatus });   // cập nhật ngay
        setUpdatingStatus(true);
        try {
            await hoanCanhApi.update(hc.id, { trangThai: newStatus });
        } catch {
            alert('Có lỗi xảy ra!');
            patchHC(hc.id, { trangThai: oldStatus }); // rollback
        } finally {
            setUpdatingStatus(false);
        }
    }

    // Inline edit mức bình quân — optimistic + rollback
    const handleSaveBinhQuan = async () => {
        const newVal = bqInput.trim() ? parseInt(bqInput.trim()) : 0;
        const oldVal = hc.mucBinhQuan;
        setEditingBQ(false);
        patchHC(hc.id, { mucBinhQuan: newVal });
        try {
            await hoanCanhApi.update(hc.id, { mucBinhQuan: newVal });
        } catch {
            alert('Có lỗi xảy ra!');
            patchHC(hc.id, { mucBinhQuan: oldVal });
        }
    };

    const toMapUrl = (viTri: string) => {
        if (!viTri) return viTri;
        const trimmed = viTri.trim();
        // Đã là URL (Google Maps link, hoặc bất kỳ link nào) -> dùng luôn,
        // tự thêm https:// nếu thiếu
        if (/^https?:\/\//i.test(trimmed)) return trimmed;
        if (/^(www\.|maps\.|goo\.gl)/i.test(trimmed)) return `https://${trimmed}`;
        // Ngược lại coi là địa chỉ/tên địa điểm dạng chữ -> tạo link tìm kiếm
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trimmed)}`;
    };

    const handleCopyBank = async () => {
        if (!hc.thongTinChuyenKhoan) return;
        try {
            await navigator.clipboard.writeText(hc.thongTinChuyenKhoan);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            // Clipboard API có thể bị chặn (http không an toàn, quyền trình duyệt...) — bỏ qua lặng lẽ
        }
    };

    const handleDeleteTV = async (tvId: number) => {
        setDeletingTvId(tvId);
        try { await hoanCanhApi.deleteThanhVien(tvId); onDataChange(); }
        catch { alert('Có lỗi xảy ra!'); }
        finally { setDeletingTvId(null); }
    };

    const animDelay = `${Math.min(index * 40, 400)}ms`;


    return (
        <div className="hc-card" style={{ animationDelay: animDelay }}>
            {/* HEAD */}
            <div className="hc-head">
                {isAdmin && (
                    <button
                        className={`hc-contact-toggle ${showContact ? 'active' : ''}`}
                        onClick={() => setShowContact(v => !v)}
                        title={showContact ? 'Ẩn thông tin liên hệ' : 'Hiện thông tin liên hệ'}
                    >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            {showContact ? (
                                <>
                                    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                    <line x1="1" y1="1" x2="23" y2="23" />
                                </>
                            ) : (
                                <>
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                    <circle cx="12" cy="12" r="3" />
                                </>
                            )}
                        </svg>
                        <span className="contact-toggle-label">
                            {showContact ? 'Ẩn liên hệ' : 'Liên hệ'}
                        </span>
                    </button>
                )}

                <div className="hc-info">
                    {/* Mã HC + trạng thái nằm trên cùng, phía trên tên hoàn cảnh */}
                    <div className="hc-top-row">
                        <span className="hc-ma">#{hc.ma || '---'}</span>
                        {isAdmin ? (
                            <select
                                className={`hc-status hc-status-select ${STATUS_CLASS[hc.trangThai] ?? 'status-gray'}`}
                                value={hc.trangThai ?? ''}
                                disabled={updatingStatus}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                            >
                                {!hc.trangThai && <option value="">--</option>}
                                {STATUS_OPTIONS.map(s => (
                                    <option key={s} value={s}>{STATUS_DISPLAY[s] ?? s}</option>
                                ))}
                            </select>
                        ) : (
                            hc.trangThai && (
                                <span className={`hc-status ${STATUS_CLASS[hc.trangThai] ?? 'status-gray'}`}>
                                    {STATUS_DISPLAY[hc.trangThai] ?? hc.trangThai}
                                </span>
                            )
                        )}
                    </div>
                    <div className="hc-ten-wrapper">
                        <div className="hc-ten">
                            {hc.link
                                ? <a href={hc.link} target="_blank" rel="noopener noreferrer">{hc.ten} <span className="link-ico">↗</span></a>
                                : hc.ten}
                        </div>
                    </div>
                    <div className="hc-meta">
                        {hc.khuVuc && (
                            <span className="hc-tag">
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                                </svg>
                                {hc.khuVuc}
                            </span>
                        )}
                        <span className="hc-tag">
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                                <line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" />
                            </svg>
                            {hc.region?.name}
                        </span>
                    </div>


                </div>
            </div>
                    
            
            {/* THÔNG TIN CHUYỂN KHOẢN — chỉ hiển thị khi đăng nhập */}
            {isAdmin && hc.thongTinChuyenKhoan && (
                <div className="hc-bank-public">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
                    </svg>
                    <span className="hc-bank-public-text">{hc.thongTinChuyenKhoan}</span>
                    <button
                        type="button"
                        className="hc-contact-copy-btn"
                        onClick={handleCopyBank}
                        title="Sao chép thông tin chuyển khoản"
                    >
                        {copied ? 'Đã chép ✓' : 'Sao chép'}
                    </button>
                </div>
            )}

            {/* THONG TIN LIEN HE + VI TRI (chỉ admin, có toggle) */}
            {isAdmin && showContact && (
                <div className="hc-contact-panel">
                    {hc.thongTinLienHe && (
                        <div className="hc-contact-item">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                            </svg>
                            <span>{hc.thongTinLienHe}</span>
                        </div>
                    )}
                    {hc.viTri && (
                        <a href={toMapUrl(hc.viTri)} target="_blank" rel="noopener noreferrer" className="hc-contact-item hc-contact-link">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                            </svg>
                            <span>Xem vị trí trên bản đồ ↗</span>
                        </a>
                    )}
                    {!hc.thongTinLienHe && !hc.viTri && (
                        <div className="hc-contact-empty">Chưa có thông tin liên hệ / vị trí</div>
                    )}
                    <button
                        className="hc-contact-edit-btn"
                        onClick={() => openEditHC({
                            id: hc.id,
                            regionId: hc.region?.id ?? 0,
                            ma: hc.ma ?? '',
                            ten: hc.ten ?? '',
                            khuVuc: hc.khuVuc ?? '',
                            trangThai: hc.trangThai ?? 'Dang ho tro',
                            mucDeXuat: hc.mucDeXuat ?? 0,
                            ghiChu: hc.ghiChu ?? '',
                            link: hc.link ?? '',
                            thongTinLienHe: hc.thongTinLienHe ?? '',
                            viTri: hc.viTri ?? '',
                            thongTinChuyenKhoan: hc.thongTinChuyenKhoan ?? '',
                        })}
                    >
                        Sửa thông tin
                    </button>
                </div>
            )}
            {/* MUC DE XUAT + TB */}
            {(() => {
                const tbDaTrao = tinhTBDaTrao(hc);
                const hienThi = isAdmin || hc.mucDeXuat > 0 || (hc.region?.mucTb ?? 0) > 0 || tbDaTrao > 0;
                if (!hienThi) return null;
                return (
                    <div className="muc-info-row">
                        {/* Mức đề xuất — chỉ hiển thị, không inline edit */}
                        {hc.mucDeXuat > 0 && (
                            <span className="muc-de-xuat">Mức CMTX Đề Xuất: <b>{fmtMoney(hc.mucDeXuat)}</b></span>
                        )}

                        {(hc.region?.mucTb ?? 0) > 0 && <span className="muc-tb-badge">TB vùng: <b>{fmtMoney(hc.region.mucTb)}</b></span>}
                        {(() => {
                            const autoVal = tbDaTrao > 0 ? Math.round(tbDaTrao) : 0;
                            const manualVal = hc.mucBinhQuan && hc.mucBinhQuan > 0 ? hc.mucBinhQuan : 0;
                            const displayVal = manualVal || autoVal;
                            const isManual = manualVal > 0;
                            if (!isAdmin && displayVal === 0) return null;
                            return editingBQ ? (
                                <span className="muc-edit-wrap" onClick={e => e.stopPropagation()}>
                                    <span style={{ fontSize: '11px', color: '#666', marginRight: 4 }}>Mức CMTX Bình Quân:</span>
                                    <input
                                        className="muc-edit-input"
                                        type="number"
                                        min="0"
                                        value={bqInput}
                                        onChange={e => setBqInput(e.target.value)}
                                        onKeyDown={e => {
                                            if (e.key === 'Enter') handleSaveBinhQuan();
                                            if (e.key === 'Escape') setEditingBQ(false);
                                        }}
                                        onBlur={handleSaveBinhQuan}
                                        autoFocus
                                        placeholder="0"
                                    />
                                    <span style={{ fontSize: '11px', color: '#888' }}>k</span>
                                </span>
                            ) : (
                                <span
                                    className={`muc-tb-badge muc-tb-trao${isAdmin ? ' muc-editable' : ''}`}
                                    title={isAdmin ? (isManual ? 'Đã chỉnh tay — Click để sửa' : 'Tự tính từ dữ liệu — Click để ghi đè') : 'Trung bình tháng đã trao'}
                                    onClick={() => { if (!isAdmin) return; setBqInput(displayVal > 0 ? String(displayVal) : ''); setEditingBQ(true); }}
                                >
                                    Mức CMTX Bình Quân/Tháng:{' '}
                                    {displayVal > 0
                                        ? <><b>{fmtMoney(displayVal)}</b>{isManual && <span style={{ fontSize: '9px', opacity: 0.55, marginLeft: 3 }}>✎</span>}</>
                                        : <span style={{ fontStyle: 'italic', opacity: 0.5 }}>chưa có</span>
                                    }
                                    {isAdmin && <span className="muc-edit-icon">✎</span>}
                                </span>
                            );
                        })()}
                    </div>
                );
            })()}

            {/* MTQ TABLE */}
            <MTQTable hc={hc} onDataChange={onDataChange} />

            {/* THANH VIEN */}
            {(hc.thanhVienList?.length ?? 0) > 0 && (
                <div className="tv-section">
                    {(['TRUNG_CHUYEN', 'HO_TRO'] as const).map(loai => {
                        const list = hc.thanhVienList?.filter(tv => tv.loai === loai) ?? [];
                        if (!list.length) return null;
                        return (
                            <div key={loai} className="tv-group">
                                <span className="tv-label">
                                    {loai === 'TRUNG_CHUYEN' ? 'Trung Chuyển' : 'Hỗ trợ'}:
                                </span>
                                {list.map(tv => (
                                    <span key={tv.id} className="tv-chip">
                                        <span
                                            className="tv-chip-name"
                                            onClick={() => isAdmin && openEditTV(tv.id, tv.ten, tv.loai)}
                                            style={{ cursor: isAdmin ? 'pointer' : 'default' }}
                                        >
                                            {tv.ten}
                                        </span>
                                        {isAdmin && (
                                            <button className="tv-del-btn" onClick={() => handleDeleteTV(tv.id)} disabled={deletingTvId === tv.id}>
                                                {deletingTvId === tv.id ? '...' : 'x'}
                                            </button>
                                        )}
                                    </span>
                                ))}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* GHI CHU */}
            {hc.ghiChu && (
                <div className="hc-ghi-chu">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="2" x2="22" y2="6" /><path d="M7.5 20.5L19 9l-4-4L3.5 16.5 2 22z" />
                    </svg>
                    {hc.ghiChu}
                </div>
            )}

            {/* ADMIN ROW */}
            {isAdmin && (
                <div className="admin-row">
                    <button className="admin-action-btn add" onClick={() => openAddMTQ(hc.id)}>+ MTQ</button>
                    <button className="admin-action-btn add" onClick={() => openAddTV(hc.id)}>+ Thành viên</button>
                </div>
            )}
        </div>
    );
}