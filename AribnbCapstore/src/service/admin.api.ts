import api from "./api";
import type { UserFromServer, Content } from "../interfaces/admin.interface";
import type { BaseAPIResponse } from "../interfaces/base.interface";

// Lấy danh sách user phân trang với tìm kiếm
export const getUsersPaginatedSearchAPI = async (
  pageIndex: number = 1,
  pageSize: number = 5,
  keywords?: string
): Promise<Content> => {
  const response = await api.get<BaseAPIResponse<Content>>(
    `/users/phan-trang-tim-kiem`,
    {
      params: {
        pageIndex,
        pageSize,
        ...(keywords && { keywords }),
      },
    }
  );
  return response.data.content;
};

// Thêm người dùng mới
export const addUserAPI = async (userData:UserFromServer): Promise<any> => {
  const response = await api.post<BaseAPIResponse<any>>(
    `/users`,
    userData
  );
  return response.data.content;
};

// Cập nhật người dùng
export const updateUserAPI = async (
  userId: number,
  userData: {
    name: string;
    email: string;
    phone: string;
    birthday: string;
    gender: boolean;
    role: string;
  }
): Promise<any> => {
  const response = await api.put<BaseAPIResponse<any>>(
    `/users/${userId}`,
    userData
  );
  return response.data.content;
};

// Xóa người dùng
export const deleteUserAPI = async (userId: number): Promise<any> => {
  const response = await api.delete<BaseAPIResponse<any>>(
    `/users`,
    {
      params: { id: userId }
    }
  );
  return response.data.content;
};