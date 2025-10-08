import React, { useState } from "react";
import { Modal, DatePicker, InputNumber, message, Spin } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { bookingApi } from "../../service/bookRoom.api";
import { motion } from "framer-motion";
import { ArrowRight, LogIn, UserPlus, X } from "lucide-react";
import Logo from "../../Component/logo";
import { useNavigate } from "react-router";

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
  const [loginPrompt, setLoginPrompt] = useState<boolean>(false);  
  const navigate = useNavigate();
  const handleBooking = async () => {
    try {
      const userLocal = localStorage.getItem("user");
      const user = userLocal ? JSON.parse(userLocal) : null;
      const userId = user?.id || user?.user?.id;
      const userName = user?.name || user?.user?.name || "Khách hàng";    

      // ✅ Nếu chưa đăng nhập → mở modal hỏi đăng nhập
      if (!userId) {
        setLoginPrompt(true);
        return;
      }

      // ✅ Kiểm tra ngày hợp lệ
      if (!dates || !dates[0] || !dates[1]) {
        message.warning("Vui lòng chọn ngày đến và ngày đi!");
        return;
      }

      const totalDays = dates[1].diff(dates[0], "day");
      if (totalDays <= 0) {
        message.warning("Ngày đi phải sau ngày đến!");
        return;
      }

      const totalPrice = totalDays * roomPrice;
      const payload = {
        maPhong: roomId,
        ngayDen: dates[0].toISOString(),
        ngayDi: dates[1].toISOString(),
        soLuongKhach: guestCount,
        maNguoiDung: userId,
      };

      setLoading(true);
      await bookingApi.createBooking(payload);

      onClose();

      setTimeout(() => {
        alert(
          `🎉 Đặt phòng thành công!\n\n` +
            `Khách hàng: ${userName}\n` +
            `Phòng: ${roomName}\n` +
            `Ngày đến: ${dates[0].format("DD/MM/YYYY")}\n` +
            `Ngày đi: ${dates[1].format("DD/MM/YYYY")}\n` +
            `Số khách: ${guestCount}\n` +
            `Thành tiền: $${totalPrice.toLocaleString()}\n\n` +
            `❤️ Cảm ơn anh/chị đã đặt phòng!\n` +
            `Kiểm tra thông tin tại "Quản lý đặt phòng".`
        );
      }, 300);
    } catch (err) {
      console.error("❌ Booking error:", err);
      message.error("Không thể đặt phòng. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const totalDays = dates ? dates[1]?.diff(dates[0], "day") || 0 : 0;
  const totalPrice = totalDays * roomPrice;

  return (
    <>
      {/* 🔹 Modal chính */}
      <Modal
        title={`🛏️ Đặt phòng: ${roomName}`}
        open={visible}
        onCancel={onClose}
        footer={null}
        centered
        destroyOnClose
        maskClosable={false}
      >
        <Spin spinning={loading}>
          <div className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">Chọn ngày</label>
              <RangePicker
                className="w-full"
                format="DD/MM/YYYY"
                onChange={(values) => setDates(values as [Dayjs, Dayjs])}
                disabledDate={(current) =>
                  current && current < dayjs().startOf("day")
                }
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
              <div className="text-gray-700 bg-gray-50 p-3 rounded-md">
                <div>
                  Tổng số đêm: <strong>{totalDays}</strong>
                </div>
                <div>
                  Đơn giá: <strong>${roomPrice}</strong> / đêm
                </div>
                <div>
                  Thành tiền:{" "}
                  <strong className="text-pink-600">
                    ${totalPrice.toLocaleString()}
                  </strong>
                </div>
              </div>
            )}         
            <div className="flex justify-end gap-3 mt-6">
              {/* Nút Hủy */}
              <button
                onClick={onClose}
                className="relative group px-5 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-medium 
               overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
              >
                <span className="relative z-10 group-hover:text-gray-900 transition-colors duration-300">
                  Hủy
                </span>
                <div
                  className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 opacity-0 
                    group-hover:opacity-100 transition-opacity duration-300"
                ></div>
              </button>

              {/* Nút Thanh toán */}
              <button
                onClick={handleBooking}
                disabled={loading}
                className="relative group px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500
               text-white font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 
               transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                      </svg>
                      <span>Đang xử lý...</span>
                    </>
                  ) : (
                    <>
                      <div className="text-white font-semibold flex items-center gap-1">
                        <span>Thanh toán</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-white" />
                    </>
                  )}
                </span>

                {/* Hiệu ứng glow khi hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300 
                    bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500"
                ></div>
              </button>
            </div>
          </div>
        </Spin>
      </Modal>

      {/* 🔹 Modal thông báo yêu cầu đăng nhập */}

      <Modal
        open={loginPrompt}
        footer={null}
        centered
        onCancel={() => setLoginPrompt(false)}
        closeIcon={false}
        className="rounded-2xl overflow-hidden"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6 text-center shadow-[0_8px_32px_rgba(31,38,135,0.37)]"
        >
          <div className="flex justify-center">
            <Logo />
          </div>

          <h2 className="text-xl font-bold text-black mb-2">
            Yêu cầu đăng nhập
          </h2>
          <p className="text-red-500 text-sm mb-6">
            Bạn cần đăng nhập để đặt phòng và trải nghiệm các tiện ích AirBbn.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setLoginPrompt(false);
                onClose();
                navigate("/auth/register");
              }}
              className="flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md hover:shadow-lg transition-all"
            >
              <UserPlus size={18} className="text-white" />
              <div className="text-white font-bold"> Đăng Ký </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setLoginPrompt(false);
                onClose();
                navigate("/auth/login");
              }}
              className="flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md hover:shadow-lg transition-all"
            >
              <LogIn size={18} className="text-white" />
              <div className="text-white font-bold"> Đăng Nhập </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setLoginPrompt(false)}
              className="flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-gray-200/20 border border-white/30 text-gray-200 hover:bg-gray-300/30 transition-all"
            >
              <X size={18} />
              Hủy
            </motion.button>
          </div>
        </motion.div>
      </Modal>
    </>
  );
};

export default BookingModal;
