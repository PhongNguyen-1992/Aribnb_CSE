import api from "./api";

const BASE_URL = "/dat-phong";

export const bookingApi = {
  /**
   * 🏠 Lấy danh sách đặt phòng (dành cho admin)
   */
  getAll: async () => {
    const res = await api.get(BASE_URL);
    return res.data.content;
  },

  /**
   * 🧾 Lấy thông tin 1 đơn đặt phòng theo id
   */
  getById: async (id: number) => {
    const res = await api.get(`${BASE_URL}/${id}`);
    return res.data.content;
  },

  /**
   * 💳 Tạo đơn đặt phòng mới
   * @param data
   * {
   *   maPhong: number,
   *   ngayDen: string,
   *   ngayDi: string,
   *   soLuongKhach: number,
   *   maNguoiDung: number
   * }
   */
  createBooking: async (data: any) => {
    try {   
      const res = await api.post(BASE_URL, data);
         return res.data.content;
    } catch (err: any) {
      console.error("❌ Lỗi khi đặt phòng:", err.response?.data || err);
      throw err;
    }
  },

  /**
   * ❌ Xoá đặt phòng
   */
  delete: async (id: number) => {
    const res = await api.delete(`${BASE_URL}/${id}`);
    return res.data.content;
  },

  /**
   * ✏️ Cập nhật đặt phòng
   */
  update: async (id: number, data: any) => {
    const res = await api.put(`${BASE_URL}/${id}`, data);
    return res.data.content;
  },
};
