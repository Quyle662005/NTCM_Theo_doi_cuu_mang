import client from './client';
import type { HoanCanh, ManhThuongQuan, ThanhVien, Region } from '../types';

export const hoanCanhApi = {
  getAll: (regionId?: number, q?: string) =>
    client.get<{ data: HoanCanh[] }>('/api/hoan-canh', { params: { regionId, q } }),

  getById: (id: number) =>
    client.get<{ data: HoanCanh }>(`/api/hoan-canh/${id}`),

  create: (data: Partial<HoanCanh> & { regionId: number }) =>
    client.post<{ data: HoanCanh }>('/api/hoan-canh', data),

  update: (id: number, data: Partial<HoanCanh> & { regionId?: number }) =>
    client.put<{ data: HoanCanh }>(`/api/hoan-canh/${id}`, data),

  delete: (id: number) =>
    client.delete(`/api/hoan-canh/${id}`),

  addMtq: (hcId: number, data: { ten: string; muc?: number }) =>
    client.post<{ data: ManhThuongQuan }>(`/api/hoan-canh/${hcId}/mtq`, data),

  deleteMtq: (mtqId: number) =>
    client.delete(`/api/hoan-canh/mtq/${mtqId}`),

  updateThang: (mtqId: number, thang: number, giaTri: string) =>
    client.put(`/api/hoan-canh/mtq/${mtqId}/thang/${thang}`, { giaTri }),

  deleteThang: (mtqId: number, thang: number) =>
    client.delete(`/api/hoan-canh/mtq/${mtqId}/thang/${thang}`),

  addThanhVien: (hcId: number, data: { ten: string; loai: string }) =>
    client.post<{ data: ThanhVien }>(`/api/hoan-canh/${hcId}/thanh-vien`, data),

  deleteThanhVien: (tvId: number) =>
    client.delete(`/api/hoan-canh/thanh-vien/${tvId}`),

  updateThanhVien: (tvId: number, data: { ten: string; loai: string }) =>
    client.put<{ data: ThanhVien }>(`/api/hoan-canh/thanh-vien/${tvId}`, data),

  updateMtq: (mtqId: number, data: { ten: string; muc?: number }) =>
    client.put<{ data: ManhThuongQuan }>(`/api/hoan-canh/mtq/${mtqId}`, data),

};

export const regionApi = {
  getAll: () => client.get<{ data: Region[] }>('/api/regions'),
  create: (data: { name: string; mucTb?: number }) =>
    client.post<{ data: Region }>('/api/regions', data),
};

export const authApi = {
  login: (username: string, password: string) =>
    client.post<{ data: { token: string; username: string } }>('/api/auth/login', { username, password }),
};

export interface MtqSuggestion {
  id: number;
  ten: string;
}

export const mangThuongQuanApi = {
  search: (q: string) =>
    client.get<{ data: MtqSuggestion[] }>('/api/mang-thuong-quan', { params: { q } }),
};