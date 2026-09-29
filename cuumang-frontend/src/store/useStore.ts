import { create } from 'zustand';
import type { HoanCanh, Region } from '../types';

interface RegisterMonthsTarget {
  mtqId: number;
  ten: string;
}
interface EditTVTarget{
  id: number;
  ten: string;
  loai: string;
}
interface EditMTQTarget{
  id: number;
  ten: string;
  muc: number;
}
interface EditHCTarget {
  id: number;
  regionId: number;
  ma: string;
  ten: string;
  khuVuc: string;
  trangThai: string;
  mucDeXuat: number;
  ghiChu: string;
  link: string;
  thongTinLienHe: string;
  viTri: string;
  thongTinChuyenKhoan: string;
}
interface AppState {
  token: string | null;
  username: string | null;
  setAuth: (token: string, username: string) => void;
  logout: () => void;
  hoanCanhList: HoanCanh[];
  regions: Region[];
  loading: boolean;
  setHoanCanhList: (list: HoanCanh[]) => void;
  setRegions: (r: Region[]) => void;
  setLoading: (v: boolean) => void;
  /** Thay thế 1 HC trong list bằng object mới (dùng sau refreshHC) */
  updateHC: (hcId: number, updated: HoanCanh) => void;
  /** Cập nhật 1 phần của 1 HC (dùng cho optimistic UI) */
  patchHC: (hcId: number, patch: Partial<HoanCanh>) => void;
  searchQ: string;
  selectedRegion: number | null;
  selectedStatus: string | null;
  setSelectedStatus: (s: string | null) => void;
  setSearchQ: (q: string) => void;
  setSelectedRegion: (id: number | null) => void;
  activeMonth: string | null;
  setActiveMonth: (m: string | null) => void;
  showAddHC: boolean;
  showAddMTQ: boolean;
  showAddTV: boolean;
  addTVTargetHcId: number | null;
  addMTQTargetHcId: number | null;
  setShowAddHC: (v: boolean) => void;
  openAddMTQ: (hcId: number) => void;
  closeAddMTQ: () => void;
  openAddTV: (hcId: number) => void;
  closeAddTV: () => void;
  showRegisterMonths: boolean;
  registerMonthsTarget: RegisterMonthsTarget | null;
  openRegisterMonths: (mtqId: number, ten: string) => void;
  closeRegisterMonths: () => void;
  showEditTV: boolean;
  editTVTarget: EditTVTarget | null;
  openEditTV: (id: number, ten: string, loai: string) => void;
  closeEditTV: () => void;
  showEditMTQ: boolean;
  editMTQTarget: EditMTQTarget | null;
  openEditMTQ: (id: number, ten: string, muc: number) => void;
  closeEditMTQ: () => void;
   showEditHC: boolean;
  editHCTarget: EditHCTarget | null;
  openEditHC: (hc: EditHCTarget) => void;
  closeEditHC: () => void;
}

export const useStore = create<AppState>((set) => ({
  token: localStorage.getItem('token'),
  username: localStorage.getItem('username'),
  setAuth: (token, username) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    set({ token, username });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    set({ token: null, username: null });
  },
  hoanCanhList: [],
  regions: [],
  loading: false,
  setHoanCanhList: (list) => set({ hoanCanhList: list }),
  setRegions: (r) => set({ regions: r }),
  setLoading: (v) => set({ loading: v }),
  updateHC: (hcId, updated) => set(state => ({
    hoanCanhList: state.hoanCanhList.map(h => h.id === hcId ? updated : h),
  })),
  patchHC: (hcId, patch) => set(state => ({
    hoanCanhList: state.hoanCanhList.map(h => h.id === hcId ? { ...h, ...patch } : h),
  })),
  searchQ: '',
  selectedRegion: null,
  setSearchQ: (q) => set({ searchQ: q }),
  setSelectedRegion: (id) => set({ selectedRegion: id }),
  selectedStatus: null,
  setSelectedStatus: (s: string | null) => set({ selectedStatus: s }),
  activeMonth: null,
  setActiveMonth: (m) => set({ activeMonth: m }),
  showAddHC: false,
  showAddMTQ: false,
  showAddTV: false,
  openAddTV: (hcId) => set({ showAddTV: true, addTVTargetHcId: hcId }),
  closeAddTV: () => set({ showAddTV: false, addTVTargetHcId: null }),
  addMTQTargetHcId: null,
  addTVTargetHcId: null,
  setShowAddHC: (v) => set({ showAddHC: v }),
  openAddMTQ: (hcId) => set({ showAddMTQ: true, addMTQTargetHcId: hcId }),
  closeAddMTQ: () => set({ showAddMTQ: false, addMTQTargetHcId: null }),
  showRegisterMonths: false,
  registerMonthsTarget: null,
  openRegisterMonths: (mtqId, ten) => set({ showRegisterMonths: true, registerMonthsTarget: { mtqId, ten } }),
  closeRegisterMonths: () => set({ showRegisterMonths: false, registerMonthsTarget: null }),
  showEditTV: false,
  editTVTarget: null,
  openEditTV: (id, ten, loai) => set({ showEditTV: true, editTVTarget: { id, ten, loai } }),
  closeEditTV: () => set({ showEditTV: false, editTVTarget: null }),
  showEditMTQ: false,
  editMTQTarget: null,
  openEditMTQ: (id, ten, muc) => set({ showEditMTQ: true, editMTQTarget: { id, ten, muc } }),
  closeEditMTQ: () => set({ showEditMTQ: false, editMTQTarget: null }),
  showEditHC: false,
  editHCTarget: null,
  openEditHC: (hc) => set({ showEditHC: true, editHCTarget: hc }),
  closeEditHC: () => set({ showEditHC: false, editHCTarget: null }),
}));