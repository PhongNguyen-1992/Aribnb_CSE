import React, { useEffect, useState, useMemo } from "react";
import {
  Table,
  Modal,
  Form,
  Input,
  InputNumber,
  Button,
  Popconfirm,
  message,
  Select,
  Space,
} from "antd";
import { Pencil, Trash2, MessageSquare, Search } from "lucide-react";
import type { BinhLuan } from "../../interfaces/room.interface";
import { commentApi } from "../../service/review.api";

const { Option } = Select;

const ReviewManagement: React.FC = () => {
  const [comments, setComments] = useState<BinhLuan[]>([]);
  const [filtered, setFiltered] = useState<BinhLuan[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<BinhLuan | null>(null);
  const [form] = Form.useForm();

  // 🔍 Bộ lọc
  const [searchId, setSearchId] = useState("");
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  // 🧭 Lấy tất cả bình luận
  const fetchComments = async () => {
    setLoading(true);
    try {
      const data = await commentApi.getAllComments();
      setComments(data);
      setFiltered(data);
    } catch {
      message.error("Không thể tải danh sách bình luận!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  // 🎯 Lọc dữ liệu theo ID / Ngày / Tháng / Năm
  useEffect(() => {
    let result = [...comments];

    // Lọc theo ID người dùng
    if (searchId.trim() !== "") {
      result = result.filter((item) =>
        item.id.toString().includes(searchId.trim())
      );
    }

    // Lọc theo Ngày / Tháng / Năm
    if (selectedDay || selectedMonth || selectedYear) {
      result = result.filter((item) => {
        const date = new Date(item.ngayBinhLuan);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        return (
          (!selectedDay || day === selectedDay) &&
          (!selectedMonth || month === selectedMonth) &&
          (!selectedYear || year === selectedYear)
        );
      });
    }

    setFiltered(result);
  }, [searchId, selectedDay, selectedMonth, selectedYear, comments]);

  // 🧹 Xóa bình luận
  const handleDelete = async (id: number) => {
    try {
      await commentApi.deleteComment(id);
      message.success("Đã xóa bình luận!");
      fetchComments();
    } catch {
      message.error("Không thể xóa bình luận!");
    }
  };

  // ✏️ Sửa bình luận
  const handleEdit = (record: BinhLuan) => {
    setEditing(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleUpdate = async (values: Partial<BinhLuan>) => {
    if (!editing) return;
    try {
      await commentApi.updateComment(editing.id, values);
      message.success("Cập nhật bình luận thành công!");
      setIsModalOpen(false);
      fetchComments();
    } catch {
      message.error("Không thể cập nhật bình luận!");
    }
  };

  // 📋 Cột bảng
  const columns = [
    { title: "ID", dataIndex: "id", width: 80 },
    {
      title: "Người bình luận",
      dataIndex: "tenNguoiBinhLuan",
      render: (text: string) => (
        <span className="font-medium text-gray-800">{text}</span>
      ),
    },
    { title: "Nội dung", dataIndex: "noiDung", ellipsis: true },
    {
      title: "Sao",
      dataIndex: "saoBinhLuan",
      width: 80,
      render: (star: number) => <span>{star} ⭐</span>,
    },
    {
      title: "Ngày bình luận",
      dataIndex: "ngayBinhLuan",
      render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Hành động",
      width: 160,
      render: (record: BinhLuan) => (
        <div className="flex gap-2">
          <Button
            icon={<Pencil size={16} />}
            onClick={() => handleEdit(record)}
            className="bg-blue-500 text-white hover:bg-blue-600"
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa bình luận này?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button
              danger
              icon={<Trash2 size={16} />}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Xóa
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  // Tạo danh sách năm để lọc
  const uniqueYears = useMemo(() => {
    const years = comments.map((c) => new Date(c.ngayBinhLuan).getFullYear());
    return Array.from(new Set(years)).sort((a, b) => b - a);
  }, [comments]);

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="text-blue-500" />
        <h2 className="text-2xl font-semibold">Quản lý bình luận</h2>
      </div>

      {/* Bộ lọc */}
      <div className="flex flex-wrap gap-3 mb-5">
        <Input
          placeholder="🔍 Tìm theo ID bình luận..."
          prefix={<Search size={16} />}
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="w-60"
        />

        <Space>
          <Select
            placeholder="Ngày"
            allowClear
            className="w-24"
            value={selectedDay ?? undefined}
            onChange={(v) => setSelectedDay(v || null)}
          >
            {Array.from({ length: 31 }, (_, i) => (
              <Option key={i + 1} value={i + 1}>
                {i + 1}
              </Option>
            ))}
          </Select>

          <Select
            placeholder="Tháng"
            allowClear
            className="w-28"
            value={selectedMonth ?? undefined}
            onChange={(v) => setSelectedMonth(v || null)}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <Option key={i + 1} value={i + 1}>
                Tháng {i + 1}
              </Option>
            ))}
          </Select>

          <Select
            placeholder="Năm"
            allowClear
            className="w-28"
            value={selectedYear ?? undefined}
            onChange={(v) => setSelectedYear(v || null)}
          >
            {uniqueYears.map((y) => (
              <Option key={y} value={y}>
                {y}
              </Option>
            ))}
          </Select>

          <Button
            onClick={() => {
              setSearchId("");
              setSelectedDay(null);
              setSelectedMonth(null);
              setSelectedYear(null);
              setFiltered(comments);
            }}
          >
            Xóa lọc
          </Button>
        </Space>
      </div>

      {/* Bảng bình luận */}
      <Table
        columns={columns}
        dataSource={filtered}
        rowKey="id"
        loading={loading}
        bordered
        className="rounded-lg"
      />

      {/* Modal chỉnh sửa */}
      <Modal
        title="Chỉnh sửa bình luận"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" onFinish={handleUpdate}>
          <Form.Item
            label="Nội dung"
            name="noiDung"
            rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            label="Số sao"
            name="saoBinhLuan"
            rules={[{ required: true, message: "Vui lòng nhập số sao!" }]}
          >
            <InputNumber min={1} max={5} className="w-full" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ReviewManagement;
