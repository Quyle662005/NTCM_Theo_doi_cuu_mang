// src/constants.ts
export const STATUS_OPTIONS = ['Dang ho tro', 'Mong ket noi', 'Ngung CMTX'] as const;

// Hiển thị có dấu tương ứng với từng giá trị backend
export const STATUS_DISPLAY: Record<string, string> = {
  'Dang ho tro': 'Đang hỗ trợ',
  'Mong ket noi': 'Mong kết nối',
  'Ngung CMTX':  'Ngừng CMTX',
};

export const STATUS_CLASS: Record<string, string> = {
  'Dang ho tro': 'status-green',
  'Mong ket noi': 'status-red',
  'Ngung CMTX':  'status-orange',
};