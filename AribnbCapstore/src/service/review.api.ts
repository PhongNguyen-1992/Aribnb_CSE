// src/service/comment.api.ts
import axios from "axios";
import type { BinhLuan } from "../interfaces/room.interface";


const BASE_URL = "https://airbnbnew.cybersoft.edu.vn/api/binh-luan";

export const commentApi = {
  async getCommentsByRoomId(roomId: number): Promise<BinhLuan[]> {
    try {
      const res = await axios.get(
        `${BASE_URL}/lay-binh-luan-theo-phong/${roomId}`,
        {
          headers: {
            tokenCybersoft:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA4MyIsIkhldEhhblN0cmluZyI6IjE4LzAxLzIwMjYiLCJIZXRIYW5UaW1lIjoiMTc2ODY5NDQwMDAwMCIsIm5iZiI6MTc0MTg4ODgwMCwiZXhwIjoxNzY4ODQ1NjAwfQ.rosAjjMuXSBmnsEQ7BQi1qmo6eVOf1g8zhTZZg6WSx4",
          },
        }
      );
      return res.data.content || [];
    } catch (err) {
      console.error("❌ Lỗi lấy bình luận:", err);
      return [];
    }
  },
};
