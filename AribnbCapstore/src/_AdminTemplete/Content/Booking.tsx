import React, { useEffect, useState, useMemo } from "react";
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
import {
  Eye,
  Trash2,
  RefreshCcw,
  Search,
  Calendar,
} from "lucide-react";
import { bookingApi } from "../../service/bookRoom.api";
import { roomApi } from "../../service/AdminPageAPI/room.api";
import dayjs, { Dayjs } from "dayjs";
import debounce from "lodash.debounce";

const { RangePicker } = DatePicker;
const { Option } = Select;

interface Booking {
  id: number;
  maPhong: number;
  ngayDen: string;
  ngayDi: string;
  soLuongKhach: number;
  maNguoiDung: number;
  tenPhong?: string;
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

      const updated = await Promise.all(
        data.map(async (b: Booking) => {
          const cachedName = roomCache[b.maPhong];
          if (cachedName) return { ...b, tenPhong: cachedName };
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
      console.error(err);
      message.error("Không thể tải danh sách đặt phòng!");
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
    return Math.max(days, 0);
  };

  // 🔍 Bộ lọc dữ liệu có debounce để mượt hơn
  const handleFilter = useMemo(
    () =>
      debounce(() => {
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
            return (
              ngayDen.isAfter(dateRange[0]) && ngayDen.isBefore(dateRange[1])
            );
          });
        }
        setFilteredBookings(filtered);
      }, 300),
    [searchUser, selectedMonth, selectedYear, dateRange, bookings]
  );

  useEffect(() => {
    handleFilter();
    return () => handleFilter.cancel();
  }, [handleFilter]);

  // 🗑️ Xóa đặt phòng
  const handleDelete = async (id: number) => {
    try {
      await bookingApi.delete(id);
      message.success("Đã xóa đơn đặt phòng!");
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch {
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
      title: "Phòng",
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
      title: "Lưu trú",
      key: "stayDays",
      render: (_: any, record: Booking) => {
        const days = calcStayDays(record.ngayDen, record.ngayDi);
        return (
          <Tag color={days >= 5 ? "purple" : "green"}>{days} ngày</Tag>
        );
      },
    },
    {
      title: "Khách",
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
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
            🗓️ Quản lý đặt phòng
          </h2>
          <div className="flex flex-wrap justify-center sm:justify-end gap-2 sm:gap-3 w-full sm:w-auto">
            <Input
              prefix={<Search size={16} />}
              placeholder="Tìm mã người dùng..."
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              className="w-full sm:w-48"
            />
            <Select
              placeholder="Tháng"
              value={selectedMonth}
              onChange={(v) => setSelectedMonth(v)}
              allowClear
              className="w-full sm:w-24"
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
              className="w-full sm:w-24"
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
              className="w-full sm:w-64"
            />
            <Button
              icon={<RefreshCcw size={16} />}
              onClick={fetchBookings}
              loading={loading}
              className="w-full sm:w-auto"
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
            <Descriptions.Item label="Lưu trú">
              {calcStayDays(
                selectedBooking.ngayDen,
                selectedBooking.ngayDi
              )}{" "}
              ngày
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
