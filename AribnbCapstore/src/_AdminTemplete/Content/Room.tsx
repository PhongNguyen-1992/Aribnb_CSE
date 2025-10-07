// src/pages/RoomManager.tsx
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Switch,
  message,
  Popconfirm,
  Spin,
  Tooltip,
} from "antd";
import { Edit2, Trash2, Check, X, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { roomApi } from "../../service/AdminPageAPI/room.api";
import type { Room } from "../../interfaces/room.interface";

export default function RoomManager() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();

  // 🔹 Load danh sách phòng
  const fetchRooms = async () => {
    try {
      setLoading(true);
      const data = await roomApi.getAll();
      setRooms(data);
    } catch (error) {
      message.error("Không thể tải danh sách phòng!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // 🔹 Mở modal sửa phòng
  const handleEdit = (room: Room) => {
    setEditingRoom(room);
    form.setFieldsValue(room);
    setIsEditModalOpen(true);
  };

  // 🔹 Lưu chỉnh sửa
  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      if (!editingRoom) return;
      await roomApi.update(editingRoom.id, values);
      message.success("Cập nhật thành công!");
      setIsEditModalOpen(false);
      fetchRooms();
    } catch (err: any) {
      console.error(err.response?.data || err);
      message.error("Cập nhật thất bại!");
    }
  };

  // 🔹 Xóa phòng
  const handleDelete = async (id: number) => {
    try {
      await roomApi.delete(id);
      message.success("Đã xóa phòng!");
      fetchRooms();
    } catch (err) {
      message.error("Xóa thất bại!");
    }
  };

  // 🔹 Thêm phòng mới
  const handleAddRoom = async () => {
    try {
      const values = await addForm.validateFields();
      await roomApi.create(values);
      message.success("Đã thêm phòng mới!");
      setIsAddModalOpen(false);
      addForm.resetFields();
      fetchRooms();
    } catch (err: any) {
      console.error(err.response?.data || err);
      message.error("Thêm phòng thất bại!");
    }
  };

  // 🔹 Icon hiển thị boolean
  const renderBool = (val: boolean) =>
    val ? <Check className="text-green-500" size={18} /> : <X className="text-red-500" size={18} />;

  // 🔹 Cột hiển thị mô tả rút gọn + hover tooltip
  const renderDescription = (text: string) => {
    const short = text?.length > 50 ? text.slice(0, 50) + "..." : text;
    return (
      <Tooltip title={text} placement="topLeft">
        <div className="max-w-[200px] truncate cursor-pointer text-gray-700 hover:text-blue-600 transition">
          {short || "—"}
        </div>
      </Tooltip>
    );
  };

  const columns = [
    { title: "ID", dataIndex: "id", width: 60 },
    { title: "Tên phòng", dataIndex: "tenPhong", className: "font-medium text-gray-800" },
    { title: "Khách", dataIndex: "khach", width: 80 },
    { title: "Phòng ngủ", dataIndex: "phongNgu", width: 100 },
    { title: "Giường", dataIndex: "giuong", width: 80 },
    { title: "Phòng tắm", dataIndex: "phongTam", width: 100 },
    {
      title: "Giá tiền",
      dataIndex: "giaTien",
      render: (v: number) => v.toLocaleString("vi-VN") + " $",
      width: 120,
    },
    {
      title: "Mô tả",
      dataIndex: "moTa",
      render: renderDescription,
      width: 250,
    },
    {
      title: "Ảnh",
      dataIndex: "hinhAnh",
      render: (url: string) => (
        <img
          src={url}
          alt="room"
          className="w-16 h-16 object-cover rounded-md border shadow-sm"
        />
      ),
      width: 90,
    },
    {
      title: "Tiện ích",
      children: [
        { title: "Máy giặt", dataIndex: "mayGiat", render: renderBool },
        { title: "Bàn là", dataIndex: "banLa", render: renderBool },
        { title: "TV", dataIndex: "tivi", render: renderBool },
        { title: "Điều hòa", dataIndex: "dieuHoa", render: renderBool },
        { title: "WiFi", dataIndex: "wifi", render: renderBool },
        { title: "Bếp", dataIndex: "bep", render: renderBool },
        { title: "Đỗ xe", dataIndex: "doXe", render: renderBool },
        { title: "Hồ bơi", dataIndex: "hoBoi", render: renderBool },
        { title: "Bàn ủi", dataIndex: "banUi", render: renderBool },
      ],
    },
    {
      title: "Hành động",
      key: "actions",
      fixed: "right" as const,
      width: 120,
      render: (_: any, record: Room) => (
        <div className="flex gap-2 justify-center">
          <Button
            icon={<Edit2 size={16} />}
            onClick={() => handleEdit(record)}
            className="border-blue-500 text-blue-500 hover:bg-blue-50 rounded-md"
          />
          <Popconfirm
            title="Xóa phòng này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button danger icon={<Trash2 size={16} />} className="hover:bg-red-50 rounded-md" />
          </Popconfirm>
        </div>
      ),
    },
  ];

  // 🔹 Form tiện nghi (dùng chung)
  const renderAmenities = (_: string) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 border-t pt-3 mt-2">
      {[
        "wifi",
        "dieuHoa",
        "bep",
        "doXe",
        "mayGiat",
        "banLa",
        "tivi",
        "hoBoi",
        "banUi",
      ].map((item) => (
        <Form.Item
          key={item}
          name={item}
          label={item.charAt(0).toUpperCase() + item.slice(1)}
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
      ))}
    </div>
  );

  // 🔹 Form số lượng khách, phòng, giường, tắm
  const renderRoomNumbers = (_: any) => (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <Form.Item name="khach" label="Khách" rules={[{ required: true }]}>
        <InputNumber min={1} style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item name="phongNgu" label="Phòng ngủ" rules={[{ required: true }]}>
        <InputNumber min={1} style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item name="giuong" label="Giường" rules={[{ required: true }]}>
        <InputNumber min={1} style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item name="phongTam" label="Phòng tắm" rules={[{ required: true }]}>
        <InputNumber min={1} style={{ width: "100%" }} />
      </Form.Item>
    </div>
  );

  return (
    <div className="p-3 sm:p-5 bg-white rounded-2xl shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">🏠 Quản lý phòng</h2>
        <Button
          type="primary"
          icon={<Plus size={16} />}
          className="rounded-lg shadow-sm hover:shadow-md transition"
          onClick={() => setIsAddModalOpen(true)}
        >
          Thêm phòng
        </Button>
      </div>

      <Spin spinning={loading}>
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <Table
            rowKey="id"
            columns={columns}
            dataSource={rooms}
            bordered
            pagination={{ pageSize: 5 }}
            scroll={{ x: "max-content" }}
            className="min-w-[900px] sm:min-w-full"
          />
        </div>
      </Spin>

      {/* 🔹 Modal chỉnh sửa */}
      <Modal
        title="Chỉnh sửa phòng"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        onOk={handleUpdate}
        okText="Lưu"
        cancelText="Hủy"
        width={700}
        className="rounded-xl"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="tenPhong" label="Tên phòng" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="giaTien" label="Giá tiền" rules={[{ required: true }]}>
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            />
          </Form.Item>
          <Form.Item name="hinhAnh" label="Ảnh phòng">
            <Input placeholder="Dán URL ảnh..." />
          </Form.Item>
          <Form.Item name="moTa" label="Mô tả">
            <Input.TextArea rows={3} />
          </Form.Item>
          {renderRoomNumbers(form)}
          {renderAmenities("edit")}
        </Form>
      </Modal>

      {/* 🔹 Modal thêm phòng */}
      <Modal
        title="Thêm phòng mới"
        open={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        onOk={handleAddRoom}
        okText="Thêm"
        cancelText="Hủy"
        width={700}
        className="rounded-xl"
      >
        <Form form={addForm} layout="vertical">
          <Form.Item name="tenPhong" label="Tên phòng" rules={[{ required: true }]}>
            <Input placeholder="Nhập tên phòng" />
          </Form.Item>
          <Form.Item name="giaTien" label="Giá tiền" rules={[{ required: true }]}>
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              placeholder="Nhập giá phòng"
            />
          </Form.Item>
          <Form.Item name="hinhAnh" label="Ảnh phòng">
            <Input placeholder="Dán URL ảnh..." />
          </Form.Item>
          <Form.Item name="moTa" label="Mô tả">
            <Input.TextArea rows={3} placeholder="Nhập mô tả chi tiết..." />
          </Form.Item>
          {renderRoomNumbers(addForm)}
          {renderAmenities("add")}
        </Form>
      </Modal>
    </div>
  );
}
