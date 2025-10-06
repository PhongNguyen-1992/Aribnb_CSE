import React, { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Space,
  Button,
  Popconfirm,
  message,
  Spin,
  Modal,
  Descriptions,
  Input,
  DatePicker,
  Select,
} from "antd";
import { Eye, Trash2, RefreshCcw, Search, Calendar } from "lucide-react";
import { bookingApi } from "../../service/bookRoom.api";
import dayjs, { Dayjs } from "dayjs";
import { roomApi } from "../../service/AdminPageAPI/room.api";

const { RangePicker } = DatePicker;
const { Option } = Select;

interface Booking {
  id: number;
  maPhong: number;
  ngayDen: string;
  ngayDi: string;
  soLuongKhach: number;
  maNguoiDung: number;
  tenPhong?: string; // ✅ Thêm tên phòng
}

const BookingManagement: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [searchUser, setSearchUser] = useState("");
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([
    null,
    null,
  ]);

  const [roomCache, setRoomCache] = useState<Record<number, string>>({});

  // 🧭 Lấy danh sách đặt phòng + tên phòng
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingApi.getAll();

      // 🔁 Lấy danh sách phòng (cache)
      const updated = await Promise.all(
        data.map(async (b: Booking) => {
          if (roomCache[b.maPhong]) {
            return { ...b, tenPhong: roomCache[b.maPhong] };
          }
          try {
            const room = await roomApi.getById(b.maPhong);
            const name = room?.tenPhong || `Phòng #${b.maPhong}`;
            setRoomCache((prev) => ({ ...prev, [b.maPhong]: name }));
            return { ...b, tenPhong: name };
          } catch {
            return { ...b, tenPhong: `Phòng #${b.maPhong}` };
          }
        })
      );

      setBookings(updated);
      setFilteredBookings(updated);
    } catch (err) {
      message.error("Không thể tải danh sách đặt phòng!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // 📅 Tính số ngày lưu trú
  const calcStayDays = (checkIn: string, checkOut: string) => {
    const start = dayjs(checkIn);
    const end = dayjs(checkOut);
    const days = end.diff(start, "day");
    return days > 0 ? days : 0;
  };

  // 🔍 Bộ lọc dữ liệu
  useEffect(() => {
    let filtered = [...bookings];
    if (searchUser.trim()) {
      filtered = filtered.filter((b) =>
        b.maNguoiDung.toString().includes(searchUser.trim())
      );
    }
    if (selectedMonth) {
      filtered = filtered.filter(
        (b) => dayjs(b.ngayDen).month() + 1 === selectedMonth
      );
    }
    if (selectedYear) {
      filtered = filtered.filter(
        (b) => dayjs(b.ngayDen).year() === selectedYear
      );
    }
    if (dateRange[0] && dateRange[1]) {
      filtered = filtered.filter((b) => {
        const ngayDen = dayjs(b.ngayDen);
        return ngayDen.isAfter(dateRange[0]) && ngayDen.isBefore(dateRange[1]);
      });
    }
    setFilteredBookings(filtered);
  }, [searchUser, selectedMonth, selectedYear, dateRange, bookings]);

  // 🗑️ Xóa đặt phòng
  const handleDelete = async (id: number) => {
    try {
      await bookingApi.delete(id);
      message.success("Đã xóa đơn đặt phòng!");
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      message.error("Lỗi khi xóa đặt phòng!");
    }
  };

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "id",
      key: "id",
      width: 80,
      sorter: (a: Booking, b: Booking) => a.id - b.id,
    },
    {
      title: "Mã phòng",
      dataIndex: "maPhong",
      key: "maPhong",
      width: 90,
    },
    {
      title: "Tên phòng",
      dataIndex: "tenPhong",
      key: "tenPhong",
      render: (value: string) => (
        <Tag color="geekblue">{value || "Đang tải..."}</Tag>
      ),
    },
    {
      title: "Người dùng",
      dataIndex: "maNguoiDung",
      key: "maNguoiDung",
      render: (value: number) => <Tag color="blue">#{value}</Tag>,
    },
    {
      title: "Ngày đến",
      dataIndex: "ngayDen",
      key: "ngayDen",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Ngày đi",
      dataIndex: "ngayDi",
      key: "ngayDi",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Số ngày lưu trú",
      key: "stayDays",
      render: (_: any, record: Booking) => {
        const days = calcStayDays(record.ngayDen, record.ngayDi);
        return (
          <Tag color={days >= 5 ? "purple" : "green"}>
            {days} ngày
          </Tag>
        );
      },
    },
    {
      title: "Số khách",
      dataIndex: "soLuongKhach",
      key: "soLuongKhach",
      render: (value: number) => (
        <Tag color={value > 4 ? "orange" : "cyan"}>{value}</Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      fixed: "right" as const,
      render: (_: any, record: Booking) => (
        <Space>
          <Button
            icon={<Eye size={16} />}
            onClick={() => {
              setSelectedBooking(record);
              setOpenModal(true);
            }}
          />
          <Popconfirm
            title="Xóa đặt phòng?"
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger icon={<Trash2 size={16} />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const years = Array.from({ length: 7 }, (_, i) => 2020 + i);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
          <h2 className="text-2xl font-semibold text-gray-800">
            🗓️ Quản lý đặt phòng
          </h2>
          <div className="flex flex-wrap gap-3 items-center">
            <Input
              prefix={<Search size={16} />}
              placeholder="Tìm mã người dùng..."
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              className="w-48"
            />
            <Select
              placeholder="Tháng"
              value={selectedMonth}
              onChange={(v) => setSelectedMonth(v)}
              allowClear
              className="w-24"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <Option key={i + 1} value={i + 1}>
                  Tháng {i + 1}
                </Option>
              ))}
            </Select>
            <Select
              placeholder="Năm"
              value={selectedYear}
              onChange={(v) => setSelectedYear(v)}
              allowClear
              className="w-24"
            >
              {years.map((y) => (
                <Option key={y} value={y}>
                  {y}
                </Option>
              ))}
            </Select>
            <RangePicker
              format="DD/MM/YYYY"
              onChange={(values) =>
                setDateRange([values?.[0] || null, values?.[1] || null])
              }
              placeholder={["Từ ngày", "Đến ngày"]}
              suffixIcon={<Calendar size={16} />}
              className="w-64"
            />
            <Button
              icon={<RefreshCcw size={16} />}
              onClick={fetchBookings}
              loading={loading}
            >
              Làm mới
            </Button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            dataSource={filteredBookings}
            columns={columns}
            rowKey="id"
            bordered
            pagination={{
              pageSize: 8,
              showSizeChanger: true,
              pageSizeOptions: [5, 8, 10, 20],
            }}
            scroll={{ x: true }}
          />
        )}
      </div>

      {/* Modal chi tiết */}
      <Modal
        title="Chi tiết đặt phòng"
        open={openModal}
        footer={null}
        onCancel={() => setOpenModal(false)}
      >
        {selectedBooking && (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Mã đơn">
              {selectedBooking.id}
            </Descriptions.Item>
            <Descriptions.Item label="Phòng">
              {selectedBooking.tenPhong || `#${selectedBooking.maPhong}`}
            </Descriptions.Item>
            <Descriptions.Item label="Người dùng">
              #{selectedBooking.maNguoiDung}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày đến">
              {dayjs(selectedBooking.ngayDen).format("DD/MM/YYYY")}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày đi">
              {dayjs(selectedBooking.ngayDi).format("DD/MM/YYYY")}
            </Descriptions.Item>
            <Descriptions.Item label="Số ngày lưu trú">
              {calcStayDays(selectedBooking.ngayDen, selectedBooking.ngayDi)} ngày
            </Descriptions.Item>
            <Descriptions.Item label="Số lượng khách">
              {selectedBooking.soLuongKhach}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default BookingManagement;
