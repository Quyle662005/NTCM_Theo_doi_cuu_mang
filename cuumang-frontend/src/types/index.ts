// Types for Theo Doi Cuu Mang Frontend

export interface Region {
  id: number;
  name: string;
  mucTb: number;
}

export interface ThangHoTro {
  id: number;
  thang: number;
  giaTri: string;
}

export interface ManhThuongQuan {
  id: number;
  ten: string;
  muc: number;
  thangList: ThangHoTro[];
}

export interface ThanhVien {
  id: number;
  ten: string;
  loai: 'TRUNG_CHUYEN' | 'HO_TRO';
}

export interface HoanCanh {
  id: number;
  region: Region;
  ma: string;
  ten: string;
  link?: string;
  khuVuc?: string;
  ghiChu?: string;
  mucDeXuat: number;
  mucBinhQuan?: number;
  trangThai: string;
  viTri?: string;
  thongTinLienHe?: string;
  thongTinChuyenKhoan?: string;
  mtqList: ManhThuongQuan[];
  thanhVienList: ThanhVien[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const MONTHS = ['T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12'] as const;
export const TRANG_THAI_OPTIONS = ['Dang ho tro', 'Mong ket noi', 'Ngung CMTX'] as const;
