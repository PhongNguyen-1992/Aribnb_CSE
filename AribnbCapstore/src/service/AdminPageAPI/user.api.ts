import type { UserFromServer, PaginatedResponse } from "../../interfaces/admin.interface";
import type { BaseAPIResponse } from "../../interfaces/base.interface";
import api from "../api";

// 🔹 Lấy danh sách user
export const getUsersPaginatedSearchAPI = async (
  pageIndex = 1,
  pageSize = 10,
  keywords?: string
): Promise<PaginatedResponse<UserFromServer>> => {
  const res = await api.get<BaseAPIResponse<PaginatedResponse<UserFromServer>>>(
    "/users/phan-trang-tim-kiem",
    { params: { pageIndex, pageSize, ...(keywords ? { keywords } : {}) } }
  );
  return res.data.content;
};

// 🔹 Tìm kiếm user theo tên
export const searchUserByNameAPI = async (name: string): Promise<UserFromServer[]> => {
  const encoded = encodeURIComponent(name.trim());
  const res = await api.get<BaseAPIResponse<UserFromServer[]>>(`/users/search/${encoded}`);
  return res.data.content;
};

// 🔹 Thêm user
export const addUserAPI = async (data: Partial<UserFromServer>): Promise<UserFromServer> => {
  const res = await api.post<BaseAPIResponse<UserFromServer>>("/users", data);
  return res.data.content;
};

// 🔹 Cập nhật user
export const updateUserAPI = async (id: number, data: Partial<UserFromServer>): Promise<UserFromServer> => {
  const res = await api.put<BaseAPIResponse<UserFromServer>>(`/users/${id}`, data);
  return res.data.content;
};

// 🔹 Xóa user
export const deleteUserAPI = async (id: number): Promise<void> => {
  await api.delete(`/users/${id}`);
};

// 🔹 Upload avatar (KHÔNG yêu cầu quyền admin)
export const uploadAvatarAPI = async (file: File): Promise<string> => {
  const userLocal = localStorage.getItem("user");
  if (!userLocal) throw new Error("Chưa đăng nhập!");

  const userParsed = JSON.parse(userLocal);
  const token = userParsed.accessToken;

  const tokenCybersoft =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA4MyIsIkhldEhhblN0cmluZyI6IjE4LzAxLzIwMjYiLCJIZXRIYW5UaW1lIjoiMTc2ODY5NDQwMDAwMCIsIm5iZiI6MTc0MTg4ODgwMCwiZXhwIjoxNzY4ODQ1NjAwfQ.rosAjjMuXSBmnsEQ7BQi1qmo6eVOf1g8zhTZZg6WSx4";

  const formData = new FormData();
  formData.append("formFile", file);

  const res = await api.post<BaseAPIResponse<{ avatar: string }>>(
    "/users/upload-avatar",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
        tokenCybersoft: tokenCybersoft,
      },
    }
  );

  if (!res.data.content?.avatar) throw new Error(res.data.message || "Không thể upload ảnh");
  return res.data.content.avatar;
};
