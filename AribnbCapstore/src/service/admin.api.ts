import type { PaginatedResponse, UserFromServer } from "../interfaces/admin.interface";
import type { BaseAPIResponse } from "../interfaces/base.interface";
import api from "./api";



// 🧠 Lấy danh sách user có phân trang + tìm kiếm
export const getUsersPaginatedSearchAPI = async (
  pageIndex = 1,
  pageSize = 5,
  keywords?: string
): Promise<PaginatedResponse<UserFromServer>> => {
  const response = await api.get<BaseAPIResponse<PaginatedResponse<UserFromServer>>>(
    `/users/phan-trang-tim-kiem`,
    { params: { pageIndex, pageSize, ...(keywords ? { keywords } : {}) } }
  );
  return response.data.content;
};

// 🧠 Cập nhật user
export const updateUserAPI = async (
  id: number,
  data: Partial<UserFromServer>
): Promise<UserFromServer> => {
  const response = await api.put<BaseAPIResponse<UserFromServer>>(`/users/${id}`, data);
  return response.data.content;
};

// 🧠 Xóa user
export const deleteUserAPI = async (id: number): Promise<void> => {
  await api.delete(`/users/${id}`);
};

// 🧠 Thêm user
export const addUserAPI = async (data: Partial<UserFromServer>): Promise<UserFromServer> => {
  const response = await api.post<BaseAPIResponse<UserFromServer>>(`/users`, data);
  return response.data.content;
};
