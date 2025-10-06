import React, { useEffect, useState } from "react";
import { Button, Input, Pagination, Spin, Modal, message, Form, Select } from "antd";
import { Edit2, Trash2, Eye, EyeOff, Search, Plus, UserPlus } from "lucide-react";
import type { UserFromServer } from "../../interfaces/admin.interface";
import { 
  getUsersPaginatedSearchAPI, 
  searchUserByNameAPI,
  updateUserAPI, 
  deleteUserAPI,
  addUserAPI 
} from "../../service/admin.api";

// 🧱 Component: Xem / Ẩn mật khẩu
const PasswordCell: React.FC<{ password: string }> = ({ password }) => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-sm">
        {visible ? password : "•".repeat(Math.min(password.length || 6, 10))}
      </span>
      <button
        onClick={() => setVisible((v) => !v)}
        className="text-gray-400 hover:text-indigo-600 transition-colors"
        title={visible ? "Ẩn mật khẩu" : "Xem mật khẩu"}
      >
        {visible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
};

// 🧩 Component chính
const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserFromServer[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRow, setTotalRow] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searching, setSearching] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false); // Chế độ search
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserFromServer | null>(null);
  const [form] = Form.useForm();

  // 🚀 Load danh sách user (dùng cho pagination)
  const loadUsers = async (search?: boolean) => {
    if (search) {
      setSearching(true);
    } else {
      setLoading(true);
    }
    
    try {
      const response = await getUsersPaginatedSearchAPI(
        pageIndex,
        pageSize,
        searchKeyword.trim() || undefined
      );
      setUsers(response.data);
      setTotalRow(response.totalRow);
      
      if (search && response.data.length === 0) {
        message.info("Không tìm thấy kết quả phù hợp");
      }
    } catch (error) {
      console.error("❌ Error loading users:", error);
      message.error("Không thể tải danh sách người dùng!");
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  useEffect(() => {
    if (!isSearchMode) {
      loadUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, pageSize, isSearchMode]);

  // 🔍 Tìm kiếm theo tên (API backend thật)
  const handleSearch = async () => {
    const keyword = searchKeyword.trim();
    
    if (!keyword) {
      message.warning("Vui lòng nhập tên người dùng cần tìm!");
      return;
    }

    setSearching(true);
    setIsSearchMode(true);
    
    try {
      console.log("🔍 Searching for:", keyword);
      const response = await searchUserByNameAPI(keyword);
      console.log("✅ Search response:", response);
      
      setUsers(response);
      setTotalRow(response.length);
      
      if (response.length === 0) {
        message.info(`Không tìm thấy người dùng với tên: "${keyword}"`);
      } else {
        message.success(`Tìm thấy ${response.length} kết quả`);
      }
    } catch (error: any) {
      console.error("❌ Error searching users:", error);
      console.error("Error details:", {
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status
      });
      
      const errorMsg = error?.response?.data?.content || 
                       error?.response?.data?.message || 
                       "Không thể tìm kiếm người dùng!";
      message.error(errorMsg);
      setUsers([]);
      setTotalRow(0);
    } finally {
      setSearching(false);
    }
  };

  // 🔄 Reset về danh sách đầy đủ
  const handleResetSearch = () => {
    setSearchKeyword("");
    setIsSearchMode(false);
    setPageIndex(1);
    loadUsers();
  };

  // ✏️ Mở modal thêm/sửa
  const handleOpenModal = (user?: UserFromServer) => {
    setEditingUser(user || null);
    if (user) {
      form.setFieldsValue(user);
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  // 💾 Lưu user (thêm hoặc sửa)
  const handleSaveUser = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingUser) {
        // Cập nhật
        await updateUserAPI(editingUser.id, values);
        message.success("Cập nhật người dùng thành công!");
      } else {
        // Thêm mới
        await addUserAPI(values);
        message.success("Thêm người dùng thành công!");
      }
      
      setIsModalOpen(false);
      form.resetFields();
      
      if (isSearchMode) {
        // Nếu đang search, search lại
        handleSearch();
      } else {
        // Load lại danh sách
        loadUsers();
      }
    } catch (error: any) {
      console.error("❌ Error saving user:", error);
      if (error.errorFields) {
        message.error("Vui lòng kiểm tra lại thông tin!");
      } else {
        message.error("Không thể lưu người dùng!");
      }
    }
  };

  // 🗑️ Xóa user
  const handleDeleteUser = (user: UserFromServer) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: (
        <div>
          <p>Bạn có chắc muốn xóa người dùng này không?</p>
          <p className="mt-2 font-semibold text-gray-700">{user.name}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      ),
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      async onOk() {
        try {
          await deleteUserAPI(user.id);
          message.success(`Đã xóa người dùng: ${user.name}`);
          
          // Nếu xóa hết user ở trang hiện tại và không phải trang 1, quay về trang trước
          if (users.length === 1 && pageIndex > 1) {
            setPageIndex(pageIndex - 1);
          } else if (isSearchMode) {
            // Nếu đang ở chế độ search, search lại
            handleSearch();
          } else {
            // Reload danh sách bình thường
            loadUsers();
          }
        } catch (error: any) {
          console.error("❌ Error deleting user:", error);
          const errorMsg = error?.response?.data?.message || "Không thể xóa người dùng!";
          message.error(errorMsg);
        }
      },
    });
  };

  const handlePageChange = (page: number, size?: number) => {
    if (size && size !== pageSize) {
      setPageSize(size);
      setPageIndex(1);
    } else {
      setPageIndex(page);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 🎨 Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <span className="bg-indigo-100 text-indigo-600 p-2 rounded-lg">
                  <UserPlus size={24} />
                </span>
                Quản lý người dùng
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Tổng số: <span className="font-semibold text-indigo-600">{totalRow}</span> người dùng
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="Nhập tên người dùng..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onPressEnter={handleSearch}
                prefix={<Search size={16} className="text-gray-400" />}
                allowClear
                onClear={handleResetSearch}
                className="w-full sm:w-64"
              />
              <Button
                type="primary"
                icon={<Search size={16} />}
                loading={searching}
                onClick={handleSearch}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                Tìm kiếm
              </Button>
              {isSearchMode && (
                <Button
                  onClick={handleResetSearch}
                  className="border-gray-300"
                >
                  Xem tất cả
                </Button>
              )}
              <Button
                type="primary"
                icon={<Plus size={16} />}
                onClick={() => handleOpenModal()}
                className="bg-green-600 hover:bg-green-700"
              >
                Thêm mới
              </Button>
            </div>
          </div>
        </div>

        {/* 📊 Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  {["ID", "Người dùng", "Email", "Số điện thoại", "Giới tính", "Vai trò", "Mật khẩu", "Thao tác"].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12">
                      <Spin size="large" />
                      <p className="text-gray-500 mt-3">Đang tải dữ liệu...</p>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 rounded-full p-4 mb-3">
                          <Search size={32} className="text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-medium">Không tìm thấy người dùng</p>
                        <p className="text-gray-400 text-sm">Thử thay đổi từ khóa tìm kiếm</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  users.map((user, _) => (
                    <tr
                      key={user.id}
                      className="hover:bg-indigo-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {user.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative flex-shrink-0">
                            <img
                              src={user.avatar || "/default-avatar.png"}
                              alt={user.name}
                              className="h-10 w-10 rounded-full object-cover ring-2 ring-indigo-100"
                              onError={(e) => {
                                const target = e.currentTarget;
                                target.onerror = null;
                                target.src = "/default-avatar.png";
                              }}
                              loading="lazy"
                            />
                            <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-400 rounded-full border-2 border-white"></div>
                          </div>
                          <span className="font-medium text-gray-900">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{user.phone}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          user.gender 
                            ? "bg-blue-100 text-blue-700" 
                            : "bg-pink-100 text-pink-700"
                        }`}>
                          {user.gender ? "Nam" : "Nữ"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          user.role === "ADMIN"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-green-100 text-green-700"
                        }`}>
                          {user.role === "ADMIN" ? "Quản trị" : "Khách hàng"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <PasswordCell password={user.password ?? ""} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenModal(user)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Chỉnh sửa"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Xóa"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* 📄 Pagination - Chỉ hiển thị khi KHÔNG ở chế độ search */}
          {totalRow > 0 && !isSearchMode && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <Pagination
                current={pageIndex}
                total={totalRow}
                pageSize={pageSize}
                onChange={handlePageChange}
                showSizeChanger
                showQuickJumper
                showTotal={(total, range) => (
                  <span className="text-sm text-gray-600">
                    Hiển thị <span className="font-semibold">{range[0]}-{range[1]}</span> trong tổng số <span className="font-semibold">{total}</span>
                  </span>
                )}
                pageSizeOptions={["5", "10", "20", "50"]}
                className="flex justify-center"
              />
            </div>
          )}

          {/* 📊 Kết quả search */}
          {isSearchMode && totalRow > 0 && (
            <div className="bg-indigo-50 px-6 py-4 border-t border-indigo-200">
              <p className="text-sm text-indigo-700 text-center">
                🔍 Tìm thấy <span className="font-semibold">{totalRow}</span> kết quả cho "<span className="font-semibold">{searchKeyword}</span>"
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 🎨 Modal thêm/sửa */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-lg font-semibold">
            <span className={`${editingUser ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"} p-2 rounded-lg`}>
              {editingUser ? <Edit2 size={20} /> : <Plus size={20} />}
            </span>
            {editingUser ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
          </div>
        }
        open={isModalOpen}
        onOk={handleSaveUser}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        okText={editingUser ? "Cập nhật" : "Thêm mới"}
        cancelText="Hủy"
        width={600}
        okButtonProps={{ className: "bg-indigo-600 hover:bg-indigo-700" }}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="name"
            label="Họ và tên"
            rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
          >
            <Input placeholder="Nguyễn Văn A" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" }
            ]}
          >
            <Input placeholder="example@email.com" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[{ required: true, message: "Vui lòng nhập SĐT!" }]}
            >
              <Input placeholder="0123456789" />
            </Form.Item>

            <Form.Item
              name="gender"
              label="Giới tính"
              rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
            >
              <Select placeholder="Chọn giới tính">
                <Select.Option value={true}>Nam</Select.Option>
                <Select.Option value={false}>Nữ</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="role"
              label="Vai trò"
              rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
            >
              <Select placeholder="Chọn vai trò">
                <Select.Option value="ADMIN">Quản trị</Select.Option>
                <Select.Option value="USER">Khách hàng</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[
                { required: !editingUser, message: "Vui lòng nhập mật khẩu!" },
                { min: 6, message: "Mật khẩu tối thiểu 6 ký tự!" }
              ]}
            >
              <Input.Password placeholder={editingUser ? "Để trống nếu không đổi" : "••••••"} />
            </Form.Item>
          </div>

          <Form.Item name="avatar" label="Avatar URL">
            <Input placeholder="https://example.com/avatar.jpg" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;