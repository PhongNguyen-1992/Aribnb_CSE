// src/service/comment.api.ts
import type { BinhLuan } from "../interfaces/room.interface";
import api from "./api"; // ✅ Dùng axios instance có interceptor

export const commentApi = {
  // 🔹 Lấy tất cả bình luận
  async getAllComments(): Promise<BinhLuan[]> {
    try {
      const res = await api.get("/binh-luan");
      return res.data.content || [];
    } catch (error) {
      console.error("❌ Lỗi khi lấy danh sách bình luận:", error);
      throw error;
    }
  },

  // 🔹 Lấy bình luận theo ID phòng (nếu cần)
  async getCommentsByRoomId(roomId: number): Promise<BinhLuan[]> {
    try {
      const res = await api.get(`/binh-luan/lay-binh-luan-theo-phong/${roomId}`);
      return res.data.content || [];
    } catch (error) {
      console.error("❌ Lỗi khi lấy bình luận theo phòng:", error);
      throw error;
    }
  },

  // 🔹 Cập nhật bình luận
  async updateComment(id: number, data: Partial<BinhLuan>) {
    try {
      const res = await api.put(`/binh-luan/${id}`, data);
      return res.data;
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật bình luận:", error);
      throw error;
    }
  },

  // 🔹 Xóa bình luận
  async deleteComment(id: number) {
    try {
      const res = await api.delete(`/binh-luan/${id}`);
      return res.data;
    } catch (error) {
      console.error("❌ Lỗi khi xóa bình luận:", error);
      throw error;
    }
  },
};
