import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Pagination,
  Modal,
  message,
  Form,
  Select,
  Spin,
} from "antd";
import { Edit2, Trash2, Eye, EyeOff, Search, Plus } from "lucide-react";
import type { UserFromServer } from "../../interfaces/admin.interface";
import {
  addUserAPI,
  deleteUserAPI,
  getUsersPaginatedSearchAPI,  
  updateUserAPI,
  uploadAvatarAPI,
} from "../../service/AdminPageAPI/user.api";

const { Option } = Select;

// 🔹 Component hiển thị mật khẩu
const PasswordCell: React.FC<{ password: string }> = ({ password }) => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-sm">
        {visible ? password : "•".repeat(Math.min(password.length || 6, 10))}
      </span>
      <button
        onClick={() => setVisible((v) => !v)}
        title={visible ? "Ẩn mật khẩu" : "Xem mật khẩu"}
        className="text-gray-400 hover:text-indigo-600"
      >
        {visible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
};

// 🔹 Component chính
const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserFromServer[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRow, setTotalRow] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searching, setSearching] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserFromServer | null>(null);
  const [form] = Form.useForm();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [_, setAvatarPreview] = useState("");

  // 🔹 Load danh sách user
  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await getUsersPaginatedSearchAPI(
        pageIndex,
        pageSize,
        searchKeyword.trim() || undefined
      );
      setUsers(res.data);
      setTotalRow(res.totalRow);
    } catch (err) {
      message.error("Không thể tải danh sách người dùng!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [pageIndex, pageSize]);

  // 🔹 Search
  // 🔹 Search
  const handleSearch = async () => {
    const keyword = searchKeyword.trim().toLowerCase();
    if (!keyword) return message.warning("Vui lòng nhập từ khóa để tìm kiếm!");
    setSearching(true);
    try {
      const res = await getUsersPaginatedSearchAPI(1, 9999); // Lấy nhiều dữ liệu hơn để lọc frontend
      const filtered = res.data.filter(
        (u: UserFromServer) =>
          u.id.toString().includes(keyword) ||
          u.name?.toLowerCase().includes(keyword) ||
          u.email?.toLowerCase().includes(keyword)
      );
      setUsers(filtered);
      setTotalRow(filtered.length);
    } catch (err) {
      message.error("Không thể tìm kiếm!");
    } finally {
      setSearching(false);
    }
  };

  const handleResetSearch = () => {
    setSearchKeyword("");
    setPageIndex(1);
    loadUsers();
  };

  // 🔹 Mở modal thêm/sửa
  const handleOpenModal = (user?: UserFromServer) => {
    setEditingUser(user || null);
    if (user) {
      form.setFieldsValue(user);
      setAvatarPreview(user.avatar || "");
    } else {
      form.resetFields();
      setAvatarPreview("");
      setAvatarFile(null);
    }
    setIsModalOpen(true);
  };

  // 🔹 Lưu user (add/update)
  const handleSaveUser = async () => {
    try {
      const values = await form.validateFields();

      // Upload avatar nếu có file
      if (avatarFile) {
        values.avatar = await uploadAvatarAPI(avatarFile);
      }

      if (editingUser) {
        await updateUserAPI(editingUser.id, values);
        message.success("Cập nhật người dùng thành công!");
      } else {
        await addUserAPI(values);
        message.success("Thêm người dùng thành công!");
      }

      setIsModalOpen(false);
      setAvatarFile(null);
      setAvatarPreview("");
      loadUsers();
    } catch (err: any) {
      message.error(err.message || "Không thể lưu người dùng!");
    }
  };

  // 🔹 Xóa user - FIXED
  const handleDeleteUser = async (user: UserFromServer) => {
    Modal.confirm({
      title: "🗑️ Xác nhận xóa người dùng",
      centered: true,
      width: 420,
      content: (
        <div className="space-y-2">
          <p>Bạn có chắc chắn muốn xóa người dùng này không?</p>
          <p className="font-semibold text-red-600">{user.name}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      ),
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",
      okButtonProps: {
        className:
          "bg-red-500 hover:bg-red-600 text-white rounded-md transition-all duration-200",
      },
      cancelButtonProps: {
        className:
          "bg-gray-200 hover:bg-gray-300 rounded-md transition-all duration-200",
      },

      async onOk() {
        try {
          console.log("🧩 Gửi request xóa:", `/users/${user.id}`);

          // Gọi API xóa
          await deleteUserAPI(user.id);

          // Hiển thị thông báo thành công
          message.success(`✅ Đã xóa người dùng: ${user.name}`);

          // Reload danh sách sau khi xóa
          await loadUsers();
        } catch (err: any) {
          console.error("❌ Lỗi xóa:", err);
          message.error(
            err?.response?.data?.message || "Không thể xóa người dùng!"
          );
        }
      },
    });
  };

  const columns = [
    { title: "ID", dataIndex: "id" },
    { title: "Tên", dataIndex: "name" },
    { title: "Email", dataIndex: "email" },
    { title: "Phone", dataIndex: "phone" },
    {
      title: "Vai trò",
      dataIndex: "role",
      render: (role: string) => (
        <span
          className={`px-2 py-1 rounded-full text-white ${
            role === "ADMIN" ? "bg-purple-600" : "bg-green-600"
          }`}
        >
          {role}
        </span>
      ),
    },
    {
      title: "Mật khẩu",
      dataIndex: "password",
      render: (_: string, row: UserFromServer) => (
        <PasswordCell password={row.password || ""} />
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_: any, row: UserFromServer) => (
        <div className="flex gap-2">
          <Button icon={<Edit2 />} onClick={() => handleOpenModal(row)}>
            Chỉnh sửa
          </Button>
          <Button
            icon={<Trash2 />}
            danger
            onClick={() => handleDeleteUser(row)}
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Tìm kiếm theo ID, mail, tên..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onPressEnter={handleSearch}
        />
        <Button type="primary" onClick={handleSearch} loading={searching}>
          <Search />
        </Button>
        <Button onClick={handleResetSearch}>Xem tất cả</Button>
        <Button type="primary" onClick={() => handleOpenModal()}>
          <Plus /> Thêm mới
        </Button>
      </div>

      <Spin spinning={loading}>
        <Table
          dataSource={users}
          columns={columns}
          rowKey="id"
          pagination={false}
        />
      </Spin>

      <Pagination
        current={pageIndex}
        total={totalRow}
        pageSize={pageSize}
        onChange={(page, size) => {
          setPageIndex(page);
          setPageSize(size || 10);
        }}
        showSizeChanger
        showQuickJumper
      />

      {/* Modal Thêm/Sửa */}
      <Modal
        title={editingUser ? "Chỉnh sửa người dùng" : "Thêm người dùng"}
        open={isModalOpen}
        onOk={handleSaveUser}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true }, { type: "email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="role" label="Vai trò" rules={[{ required: true }]}>
            <Select>
              <Option value="ADMIN">ADMIN</Option>
              <Option value="USER">USER</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: !editingUser }]}
          >
            <Input.Password
              placeholder={editingUser ? "Để trống nếu không đổi" : ""}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
