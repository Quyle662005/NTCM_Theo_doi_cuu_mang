import { useEffect, useMemo, useCallback } from 'react';
import { hoanCanhApi, regionApi } from '../api/hoanCanhApi';
import { useStore } from '../store/useStore';
import Header from '../components/Header';
import HCCard from '../components/HCCard';
import AddHCModal from '../modal/AddHCModal';
import AddMTQModal from '../modal/AddMTQModal';
import RegisterMonthsModal from '../modal/RegisterMonthsModal';
import EditMtqModal from '../modal/EditMtqModal';
import EditThanhVienModal from '../modal/EditThanhVienModal';
import EditHCModal from '../modal/EditHCModal';
import AddTVModal from '../modal/AddTVModal';

export default function HomePage() {
  const {
    hoanCanhList, setHoanCanhList,
    regions, setRegions,
    loading, setLoading,
    searchQ, selectedRegion, activeMonth, selectedStatus,
    token, showAddHC, setShowAddHC,
    showAddMTQ, closeAddMTQ, addMTQTargetHcId,
    showAddTV, addTVTargetHcId,
    showRegisterMonths, registerMonthsTarget,
    showEditMTQ, editMTQTarget,
    showEditTV, editTVTarget,
    showEditHC, editHCTarget,
    updateHC,
  } = useStore();

  // ─── LOAD TOÀN BỘ (lần đầu / nút refresh thủ công) ─────────────────────────
  const loadData = async () => {
    setLoading(true);
    try {
      const [hcRes, regRes] = await Promise.all([
        hoanCanhApi.getAll(),
        regionApi.getAll(),
      ]);
      setHoanCanhList(hcRes.data.data ?? []);
      setRegions(regRes.data.data ?? []);
    } catch (e) {
      console.error('Load data error:', e);
    } finally {
      setLoading(false);
    }
  };

  // ─── REFRESH IM LẶNG (không spinner, không fetch regions) ───────────────────
  const refreshData = useCallback(async () => {
    try {
      const hcRes = await hoanCanhApi.getAll();
      setHoanCanhList(hcRes.data.data ?? []);
    } catch (e) {
      console.error('Refresh error:', e);
    }
  }, [setHoanCanhList]);

  // ─── REFRESH 1 HC CỤ THỂ ─────────────────────────────────────────────────────
  const refreshHC = useCallback(async (hcId: number) => {
    try {
      const res = await hoanCanhApi.getById(hcId);
      updateHC(hcId, res.data.data);
    } catch (e) {
      console.error('RefreshHC error:', e);
    }
  }, [updateHC]);

  // ─── Helper: tìm hcId chứa mtqId (dùng cho RegisterMonths, EditMTQ) ─────────
  const findHcIdByMtqId = useCallback((mtqId: number): number | null =>
    hoanCanhList.find(hc => hc.mtqList?.some(m => m.id === mtqId))?.id ?? null,
  [hoanCanhList]);

  // ─── Helper: tìm hcId chứa tvId (dùng cho EditTV) ───────────────────────────
  const findHcIdByTvId = useCallback((tvId: number): number | null =>
    hoanCanhList.find(hc => hc.thanhVienList?.some(tv => tv.id === tvId))?.id ?? null,
  [hoanCanhList]);

  useEffect(() => { loadData(); }, []);

  const filtered = useMemo(() => {
    let list = hoanCanhList;
    if (selectedRegion) list = list.filter(hc => hc.region?.id === selectedRegion);
    if (selectedStatus) list = list.filter(hc => hc.trangThai === selectedStatus);
    if (searchQ.trim()) {
      const q = searchQ.toLowerCase();
      list = list.filter(hc =>
        hc.ten?.toLowerCase().includes(q) ||
        hc.ma?.toLowerCase().includes(q) ||
        hc.khuVuc?.toLowerCase().includes(q) ||
        hc.mtqList?.some(mtq =>
          mtq.ten?.toLowerCase().includes(q)
        )
      );
    }
    if (activeMonth) {
      const monthNum = parseInt(activeMonth.replace('T', ''));
      list = list.filter(hc =>
        hc.mtqList?.some(m => m.thangList?.some(t => t.thang === monthNum))
      );
    }
    return list;
  }, [hoanCanhList, selectedRegion, selectedStatus, searchQ, activeMonth]);

  const mtqCount = useMemo(() =>
    hoanCanhList.reduce((sum, hc) => sum + (hc.mtqList?.length || 0), 0),
    [hoanCanhList]
  );

  return (
    <div>
      <Header regions={regions} hcCount={hoanCanhList.length} mtqCount={mtqCount} onRefresh={loadData} />

      <main className="main-content">
        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : hoanCanhList.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <p>Chưa có dữ liệu. Hãy thêm hoàn cảnh đầu tiên!</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <p>Không tìm thấy hoàn cảnh nào.</p>
          </div>
        ) : (
          <>
            <div className="result-bar">
              Hiển thị <strong>{filtered.length}</strong> / {hoanCanhList.length} hoàn cảnh
            </div>
            <div className="hc-grid">
              {filtered.map((hc, i) => (
                <HCCard
                  key={hc.id}
                  hc={hc}
                  onDataChange={() => refreshHC(hc.id)}
                  index={i}
                />
              ))}
            </div>
          </>
        )}
      </main>

      {token && (
        <button className="fab" title="Thêm hoàn cảnh mới" onClick={() => setShowAddHC(true)}>
          +
        </button>
      )}

      {/* Thêm HC mới → refreshData (chưa biết id mới là gì) */}
      {showAddHC && (
        <AddHCModal
          regions={regions}
          onClose={() => setShowAddHC(false)}
          onSuccess={refreshData}
        />
      )}

      {/* Thêm MTQ → refreshHC của HC đang mở */}
      {showAddMTQ && addMTQTargetHcId && (
        <AddMTQModal
          onClose={closeAddMTQ}
          onSuccess={() => refreshHC(addMTQTargetHcId)}
        />
      )}

      {/* Thêm TV → refreshHC của HC đang mở */}
      {showAddTV && addTVTargetHcId && (
        <AddTVModal onSuccess={() => refreshHC(addTVTargetHcId)} />
      )}

      {/* Đăng ký tháng → tìm HC chứa MTQ đó rồi refresh */}
      {showRegisterMonths && registerMonthsTarget && (
        <RegisterMonthsModal
          onSuccess={() => {
            const hcId = findHcIdByMtqId(registerMonthsTarget.mtqId);
            if (hcId) refreshHC(hcId); else refreshData();
          }}
        />
      )}

      {/* Sửa MTQ → tìm HC chứa MTQ đó rồi refresh */}
      {showEditMTQ && editMTQTarget && (
        <EditMtqModal
          onSuccess={() => {
            const hcId = findHcIdByMtqId(editMTQTarget.id);
            if (hcId) refreshHC(hcId); else refreshData();
          }}
        />
      )}

      {/* Sửa TV → tìm HC chứa TV đó rồi refresh */}
      {showEditTV && editTVTarget && (
        <EditThanhVienModal
          onSuccess={() => {
            const hcId = findHcIdByTvId(editTVTarget.id);
            if (hcId) refreshHC(hcId); else refreshData();
          }}
        />
      )}

      {/* Sửa HC → biết chính xác hcId */}
      {showEditHC && editHCTarget && (
        <EditHCModal
          regions={regions}
          onSuccess={() => refreshHC(editHCTarget.id)}
        />
      )}
    </div>
  );
}
