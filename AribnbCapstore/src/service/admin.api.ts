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

// 🔍 Tìm kiếm user theo tên (API backend thật)
export const searchUserByNameAPI = async (
  tenNguoiDung: string
): Promise<UserFromServer[]> => {
  // Encode URI component để xử lý dấu tiếng Việt và khoảng trắng
  const encodedName = encodeURIComponent(tenNguoiDung.trim());
  
  const response = await api.get<BaseAPIResponse<UserFromServer[]>>(
    `/users/search/${encodedName}`
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
// 🧠 Upload avatar

// export const uploadAvatarAPI = async (file: File): Promise<string> => {
//   const token = localStorage.getItem("token");
//   const formData = new FormData();
//   formData.append("file", file);

//   const response = await api.post("/users/upload-avatar", formData, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   // API trả về { content: { avatar: "url..." } }
//   return response.data.content?.avatar;
// };

// 📁 src/service/user.api.ts
export const uploadAvatarAPI = async (file: File, token: string) => {
  const formData = new FormData();
  formData.append("formFile", file);

  const response = await fetch("https://airbnbnew.cybersoft.edu.vn/api/users/upload-avatar", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      TokenCybersoft:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA4MyIsIkhldEhhblN0cmluZyI6IjE4LzAxLzIwMjYiLCJIZXRIYW5UaW1lIjoiMTc2ODY5NDQwMDAwMCIsIm5iZiI6MTc0MTg4ODgwMCwiZXhwIjoxNzY4ODQ1NjAwfQ.rosAjjMuXSBmnsEQ7BQi1qmo6eVOf1g8zhTZZg6WSx4",
    },
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Không thể tải lên ảnh!");

  // ✅ Trả về link avatar mới
  return data.content?.avatar || data.content;
};

