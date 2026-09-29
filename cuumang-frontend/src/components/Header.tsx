import { useEffect, useRef, useState } from 'react';
import { useStore } from '../store/useStore';
import LoginModal from './LoginModal';
import type { Region } from '../types';
import { STATUS_OPTIONS, STATUS_DISPLAY } from '../constants';
const TRACKING_YEAR = 2026;
const SEARCH_DEBOUNCE_MS = 300;

interface Props {
  regions: Region[];
  hcCount: number;
  mtqCount: number;
  onRefresh: () => void;
}

export default function Header({ regions, hcCount, mtqCount, onRefresh }: Props) {
  const { token, username, logout, selectedRegion, setSelectedRegion, selectedStatus, setSelectedStatus,
    searchQ, setSearchQ } = useStore();
  const [showLogin, setShowLogin] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Local, immediately-responsive copy of the search text. The store's
  // searchQ (which actually triggers filtering) is only updated after a
  // short pause in typing, so a long case list doesn't re-filter on every
  // keystroke.
  const [searchInput, setSearchInput] = useState(searchQ);
  useEffect(() => {
    const t = setTimeout(() => setSearchQ(searchInput), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput, setSearchQ]);

  // Đồng bộ ngược từ Store về Local Input (nếu searchQ bị đổi từ bên ngoài)
  useEffect(() => {
    if (searchQ !== searchInput) {
      setSearchInput(searchQ);
    }
  }, [searchQ]); // Bỏ searchInput khỏi dependency để tránh loop

  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!showMenu) return;
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [showMenu]);

  // Dropdown lọc trạng thái — dùng position:fixed để không bị overflow cắt
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const statusBtnRef = useRef<HTMLButtonElement>(null);
  const statusPanelRef = useRef<HTMLDivElement>(null);
  const [dropPos, setDropPos] = useState({ top: 0, right: 0 });

  const openStatusFilter = () => {
    if (statusBtnRef.current) {
      const r = statusBtnRef.current.getBoundingClientRect();
      setDropPos({ top: r.bottom + 6, right: window.innerWidth - r.right });
    }
    setShowStatusFilter(true);
  };

  useEffect(() => {
    if (!showStatusFilter) return;
    function onClickOutside(e: MouseEvent) {
      if (
        statusBtnRef.current && !statusBtnRef.current.contains(e.target as Node) &&
        statusPanelRef.current && !statusPanelRef.current.contains(e.target as Node)
      ) {
        setShowStatusFilter(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [showStatusFilter]);

  const STATUS_COLOR_HEX: Record<string, string> = {
    'Dang ho tro': '#43A047',
    'Mong ket noi': '#D32F2F',
    'Ngung CMTX':  '#E8A200',
  };

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <div className="header-logo">
            <img src="/images/logo_NTCM.png" alt="Logo" className="logo-img" />
            <div>
              <div className="header-title">Theo Dõi Cưu Mang {TRACKING_YEAR}</div>
              <div className="header-sub">
                Con số: Tiền đã trao &nbsp;|&nbsp;
                <span className="check-mark" aria-hidden="true"> ✓ </span> Nhu yếu phẩm đã trao
                <br />O xanh: Tháng được hỗ trợ &nbsp;|&nbsp; DVT: Nghìn đồng
              </div>
            </div>
          </div>

          <div className="header-stats">
            <div className="h-stat stat-hc">
              <span className="h-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </span>
              <span className="h-text">
                <span className="h-val">{hcCount}</span>
                <span className="h-lbl">Hoàn cảnh</span>
              </span>
            </div>
            <div className="h-stat stat-mtq">
              <span className="h-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </span>
              <span className="h-text">
                <span className="h-val">{mtqCount}</span>
                <span className="h-lbl">Lượt hỗ trợ</span>
              </span>
            </div>
          </div>

          <div className="header-actions">
            <button className="refresh-btn-sm" onClick={onRefresh} title="Làm mới" aria-label="Làm mới dữ liệu">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 4v6h-6" /><path d="M1 20v-6h6" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
            </button>
            {!token ? (
              <button className="login-btn" onClick={() => setShowLogin(true)}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Đăng nhập
              </button>
            ) : (
              <div className="admin-badge" ref={menuRef}>
                <button className="admin-badge-btn" onClick={() => setShowMenu(m => !m)}>
                  <span className="admin-dot" />
                  {username}
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {showMenu && (
                  <div className="admin-menu">
                    <div className="admin-menu-item" style={{ opacity: .55, fontSize: '11.5px', cursor: 'default' }}>
                      Đang hoạt động
                    </div>
                    <div className="admin-menu-sep" />
                    <div className="admin-menu-item danger" onClick={() => { logout(); setShowMenu(false); }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      Đăng xuất
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="filter-bar">
          <div className="filter-bar-inner">
            <div className="filter-bar-row">
              <div className="filter-group search-grow">
               <label>Tìm Kiếm</label>
                <div className="search-wrapper">
                  <span className="search-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </span>
                  <input
                    className="search-input"
                    placeholder="Tìm hoàn cảnh, mã số,MTQ..."
                    value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}
                  />
                </div>
              </div>

              <div className="filter-group">
                <label>Khu vực</label>
                <select
                  className="region-select"
                  value={selectedRegion ?? ''}
                  onChange={(e) => setSelectedRegion(e.target.value ? Number(e.target.value) : null)}
                >
                  <option value="">Tất cả khu vực</option>
                  {regions.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>

              {/* Nút lọc trạng thái — dropdown fixed, không bị overflow cắt */}
              <div className="filter-group" style={{ justifyContent: 'flex-end' }}>
                <label>Trạng thái</label>
                <button
                  ref={statusBtnRef}
                  className={`status-filter-icon-btn ${selectedStatus ? 'has-filter' : ''}`}
                  onClick={() =>
                    showStatusFilter
                      ? setShowStatusFilter(false)
                      : openStatusFilter()
                  }
                  title="Lọc theo trạng thái"
                  aria-expanded={showStatusFilter}
                >
                  {!selectedStatus && (
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                    </svg>
                  )}

                  <span className="status-filter-label">
                    {selectedStatus
                      ? (STATUS_DISPLAY[selectedStatus] ?? selectedStatus)
                      : 'Lọc'}
                  </span>

                  {selectedStatus && (
                    <span
                      className="status-dot-badge"
                      style={{ background: STATUS_COLOR_HEX[selectedStatus] }}
                    />
                  )}
                </button>

                {showStatusFilter && (
                  <div
                    ref={statusPanelRef}
                    className="status-dropdown"
                    style={{ position: 'fixed', top: dropPos.top, right: dropPos.right, left: 'auto' }}
                  >
                    <div className="status-dropdown-title">Lọc theo trạng thái</div>
                    <button
                      className={`status-dd-item ${!selectedStatus ? 'active' : ''}`}
                      onClick={() => { setSelectedStatus(null); setShowStatusFilter(false); }}
                    >
                      <span className="status-dd-dot" style={{ background: '#9E9E9E' }} />
                      Tất cả
                    </button>
                    {STATUS_OPTIONS.map((s) => (
                      <button
                        key={s}
                        className={`status-dd-item ${selectedStatus === s ? 'active' : ''}`}
                        onClick={() => { setSelectedStatus(selectedStatus === s ? null : s); setShowStatusFilter(false); }}
                      >
                        <span className="status-dd-dot" style={{ background: STATUS_COLOR_HEX[s] }} />
                        {STATUS_DISPLAY[s] ?? s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </header>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
}