import { useState, useRef } from 'react';
import type { HoanCanh, ManhThuongQuan } from '../types';
import { MONTHS } from '../types';
import { hoanCanhApi } from '../api/hoanCanhApi';
import { useStore } from '../store/useStore';

interface Props { hc: HoanCanh; onDataChange: () => void; }

const fmtMoney = (v: string | number) => {
  const n = typeof v === 'string' ? parseFloat(v) : v;
  return (!n || isNaN(n)) ? '' : n.toLocaleString('vi-VN');
};

interface EditCell { mtqId: number; thang: string; val: string; }

export default function MTQTable({ hc, onDataChange }: Props) {
  const token = useStore(s => s.token);
  const activeMonth = useStore(s => s.activeMonth);
  const openRegisterMonths = useStore(s => s.openRegisterMonths);
  const isAdmin = !!token;
  const [editCell, setEditCell] = useState<EditCell | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const openEditMtq = useStore(s => s.openEditMTQ);

  const visibleMonths = activeMonth ? [activeMonth] : MONTHS;

  const getThangVal = (mtq: ManhThuongQuan, t: string) => {
    const monthNum = parseInt(t.replace('T', ''));
    return mtq.thangList.find(th => th.thang === monthNum);
  };

  const openEdit = (mtqId: number, t: string, currentVal: string) => {
    if (!isAdmin) return;
    setEditCell({ mtqId, thang: t, val: currentVal });
    setTimeout(() => inputRef.current?.focus(), 30);
  };

  const handleSave = async () => {
    if (!editCell || saving) return;
    setSaving(true);
    try {
      const monthNum = parseInt(editCell.thang.replace('T', ''));
      if (!editCell.val.trim()) {
        await hoanCanhApi.deleteThang(editCell.mtqId, monthNum);
      } else {
        await hoanCanhApi.updateThang(editCell.mtqId, monthNum, editCell.val.trim());
      }
      setEditCell(null);
      onDataChange();
    } finally { setSaving(false); }
  };

  const handleDeleteMtq = async (mtqId: number) => {
    await hoanCanhApi.deleteMtq(mtqId);
    setConfirmDeleteId(null);
    onDataChange();
  };

  if (!hc.mtqList?.length && !isAdmin) return null;

  return (
    <div className="mtq-section">
      {/* <div className="mtq-header">
        <div className="mtq-title">Mạnh thường quân</div>
      </div> */}
      {hc.mtqList?.length === 0 ? (
        <div className="mtq-empty">Chưa có MTQ nào</div>
      ) : (
        <div className="scroll-hint">
          <table className="mtq-table">
            <thead>
              <tr>
                <th>Mạnh thường quân</th>
                <th>Mức hỗ trợ</th>
                {visibleMonths.map(t => <th key={t}>{t}</th>)}
                {isAdmin && <th style={{ width: '36px' }}></th>}
              </tr>
            </thead>
            <tbody>
              {hc.mtqList.map(mtq => (
                <tr key={mtq.id}>
                  <td>
                    <span
                      className="mtq-name"
                      onClick={() => isAdmin && openEditMtq(mtq.id, mtq.ten, mtq.muc)}
                      style={{ cursor: isAdmin ? 'pointer' : 'default' }}
                    >
                      {mtq.ten}
                    </span>
                    {isAdmin && (
                      <div
                        className="mtq-register-link"
                        onClick={() => openRegisterMonths(mtq.id, mtq.ten)}
                      >
                        Đăng ký cưu mang
                      </div>
                    )}
                  </td>
                  <td>
                    {mtq.muc > 0
                      ? <span className="muc-val">{fmtMoney(mtq.muc)}</span>
                      : <span className="cell-empty">-</span>}
                  </td>
                  {visibleMonths.map(t => {
                    const entry = getThangVal(mtq, t);
                    const val = entry?.giaTri ?? '';
                    const isNum = val && !isNaN(parseFloat(val)) && parseFloat(val) > 0;
                    const isOk = val?.toLowerCase() === 'ok';
                    const isEditing = editCell?.mtqId === mtq.id && editCell?.thang === t;
                    return (
                      <td key={t}
                        className={`${isAdmin ? 'editable-cell' : ''} ${entry ? 'cell-active' : ''}`}
                        onClick={() => !isEditing && openEdit(mtq.id, t, val)}
                      >
                        {isEditing ? (
                          <div className="cell-edit-wrap" onClick={e => e.stopPropagation()}>
                            <input
                              ref={inputRef}
                              className="cell-edit-input"
                              value={editCell.val}
                              onChange={e => setEditCell({ ...editCell, val: e.target.value })}
                              onKeyDown={e => {
                                if (e.key === 'Enter') handleSave();
                                if (e.key === 'Escape') setEditCell(null);
                              }}
                              placeholder="Số/ok/trống=xóa"
                            />
                            <button className="cell-save-btn" onClick={handleSave} disabled={saving}>
                              {saving ? '...' : 'OK'}
                            </button>
                          </div>
                        ) : (
                          <>
                            {entry ? (
                              isNum ? (
                                <span className="cell-supported">
                                  <span className="amt">{fmtMoney(val)}</span>
                                </span>
                              ) : isOk ? (
                                <span className="cell-ok" title="Đã trao nhu yếu phẩm">
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                  </svg>
                                </span>
                              ) : (
                                <span className="cell-dot" title={val} />
                              )
                            ) : (
                              <span className="cell-empty">·</span>
                            )}
                            {isAdmin && <span className="cell-edit-hint">edit</span>}
                          </>
                        )}
                      </td>
                    );
                  })}
                  {isAdmin && (
                    <td>
                      {confirmDeleteId === mtq.id ? (
                        <div className="del-mtq-confirm">
                          <button className="del-confirm-yes" onClick={() => handleDeleteMtq(mtq.id)} title="Xác nhận xóa">✓</button>
                          <button className="del-confirm-no"  onClick={() => setConfirmDeleteId(null)} title="Hủy">✕</button>
                        </div>
                      ) : (
                        <button className="del-mtq-btn" onClick={() => setConfirmDeleteId(mtq.id)} title="Xóa MTQ">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                          </svg>
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}