import React, { useState } from "react";
import { Modal, DatePicker, InputNumber, message, Spin } from "antd";
import _, { Dayjs } from "dayjs";
import { bookingApi } from "../../service/bookRoom.api";


const { RangePicker } = DatePicker;

interface BookingModalProps {
  visible: boolean;
  onClose: () => void;
  roomId: number;
  roomName: string;
  roomPrice: number; 
}

const BookingModal: React.FC<BookingModalProps> = ({
  visible,
  onClose,
  roomId,
  roomName,
  roomPrice,
}) => {
  const [dates, setDates] = useState<[Dayjs, Dayjs] | null>(null);
  const [guestCount, setGuestCount] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  const handleBooking = async () => {
    try {
      const userLocal = localStorage.getItem("user");
      const user = userLocal ? JSON.parse(userLocal) : null;
      const userId = user?.id || user?.user?.id; // 🔧 fix undefined id

      console.log("👤 User:", user);

      if (!userId) {
        message.error("Vui lòng đăng nhập trước khi đặt phòng");
        return;
      }

      if (!dates || !dates[0] || !dates[1]) {
        message.warning("Vui lòng chọn ngày đến và ngày đi");
        return;
      }

      const totalDays = dates[1].diff(dates[0], "day");
      if (totalDays <= 0) {
        message.warning("Ngày đi phải sau ngày đến");
        return;
      }

      const payload = {
        maPhong: roomId,
        ngayDen: dates[0].toISOString(),
        ngayDi: dates[1].toISOString(),
        soLuongKhach: guestCount,
        maNguoiDung: userId,
      };

      console.log("📦 Booking payload:", payload);

      setLoading(true);
      await bookingApi.createBooking(payload);

      message.success("🎉 Đặt phòng thành công!");
      onClose();
    } catch (err: any) {
      console.error("❌ Booking error:", err);
      message.error("Không thể đặt phòng. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const totalDays = dates ? dates[1]?.diff(dates[0], "day") || 0 : 0;
  const totalPrice = totalDays * roomPrice;

  return (
    <Modal
      title={`Đặt phòng: ${roomName}`}
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
    >
      <Spin spinning={loading}>
        <div className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Chọn ngày</label>
            <RangePicker
              className="w-full"
              format="DD/MM/YYYY"
              onChange={(values) => setDates(values as [Dayjs, Dayjs])}
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Số lượng khách</label>
            <InputNumber
              min={1}
              max={10}
              value={guestCount}
              onChange={(value) => setGuestCount(value || 1)}
              className="w-full"
            />
          </div>

          {dates && (
            <div className="text-gray-700">
              <div>Tổng số đêm: <strong>{totalDays}</strong></div>
              <div>Thành tiền: <strong>${totalPrice.toLocaleString()}</strong></div>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <button
              className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 transition"
              onClick={onClose}
            >
              Hủy
            </button>
            <button
              className="px-4 py-2 rounded-md bg-pink-500 text-white hover:bg-pink-600 transition"
              onClick={handleBooking}
              disabled={loading}
            >
              Thanh toán
            </button>
          </div>
        </div>
      </Spin>
    </Modal>
  );
};

export default BookingModal;
