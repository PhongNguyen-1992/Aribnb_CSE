import type { Room } from "../../interfaces/room.interface";
import api from "../api";

/**
 * 🏠 roomApi — Quản lý dữ liệu phòng thuê
 * Gồm các chức năng: lấy danh sách, xem chi tiết, thêm, sửa, xóa.
 * Mọi request đều sử dụng endpoint `/phong-thue`.
 */

export const roomApi = {
  /**
   * 🔹 Lấy danh sách tất cả phòng thuê
   * @returns Promise<Room[]>
   */
  getAll: async (): Promise<Room[]> => {
    const res = await api.get("/phong-thue");
    return res.data.content;
  },

  /**
   * 🔹 Lấy thông tin chi tiết của 1 phòng theo ID
   * @param id Mã phòng
   * @returns Promise<Room>
   */
  getById: async (id: number): Promise<Room> => {
    const res = await api.get(`/phong-thue/${id}`);
    return res.data.content;
  },

  /**
   * 🔹 Thêm phòng mới
   * @param data Thông tin phòng (Partial<Room>)
   * @returns Promise<Room>
   */
  create: async (data: Partial<Room>): Promise<Room> => {
    const res = await api.post("/phong-thue", data);
    return res.data.content;
  },

  /**
   * 🔹 Cập nhật thông tin phòng theo ID
   * @param id Mã phòng
   * @param data Dữ liệu cần cập nhật
   * @returns Promise<Room>
   */
  update: async (id: number, data: Partial<Room>): Promise<Room> => {
    const res = await api.put(`/phong-thue/${id}`, data);
    return res.data.content;
  },

  /**
   * 🔹 Xóa phòng theo ID
   * @param id Mã phòng
   */
  delete: async (id: number): Promise<void> => {
    await api.delete(`/phong-thue/${id}`);
  },
};
