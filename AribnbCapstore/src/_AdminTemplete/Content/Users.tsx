import React, { useEffect, useState } from "react";
import { Button, Pagination, Spin } from "antd";
import { Edit2, Trash2, Eye, EyeOff } from "lucide-react";
import type { UserFromServer } from "../../interfaces/admin.interface";
import { getUsersPaginatedSearchAPI } from "../../service/admin.api";


// 🧩 Component con: Hiển thị/ẩn mật khẩu
const PasswordCell: React.FC<{ password: string }> = ({ password }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <span className="font-mono">
        {visible ? password : "•".repeat(Math.min(password.length || 6, 10))}
      </span>
      <button
        onClick={() => setVisible((prev) => !prev)}
        className="text-gray-500 hover:text-gray-700 transition"
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
  const [pageSize, setPageSize] = useState(5);
  const [totalRow, setTotalRow] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");

  // 🚀 Gọi API
  const loadUsers = async () => {
    setLoading(true);
    try {
      const response: any = await getUsersPaginatedSearchAPI(
        pageIndex,
        pageSize,
        searchKeyword
      );
      setUsers(response.data);
      setTotalRow(response.totalRow);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [pageIndex, pageSize, searchKeyword]);

  // 📄 Xử lý phân trang
  const handlePageChange = (page: number, size?: number) => {
    setPageIndex(page);
    if (size) setPageSize(size);
  };

  // 📄 Tổng số dòng
  const handleShowTotal = (total: number, range: [number, number]) =>
    `${range[0]}-${range[1]} trên ${total} người dùng`;

  // 🧩 Xử lý sửa / xóa (chưa nối API xóa/sửa thật)
  const handleEditClick = (user: UserFromServer) => {
    console.log("Edit:", user);
  };

  const handleDeleteUser = (user: UserFromServer) => {
    console.log("Delete:", user);
  };

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700">Quản lý người dùng</h2>
        <input
          type="text"
          placeholder="Tìm kiếm theo tên/email..."
          className="border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Người dùng</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số điện thoại</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giới tính</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vai trò</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mật khẩu</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Thao tác</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-6 text-gray-500">
                  <Spin /> Đang tải...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-6 text-gray-500">
                  Không tìm thấy người dùng
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">{user.id}</td>

                  <td className="px-6 py-4 flex items-center gap-3">
                    <img
                      src={user.avatar || "/default-avatar.png"}
                      alt={user.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    {user.name}
                  </td>

                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.phone}</td>
                  <td className="px-6 py-4">{user.gender ? "Nam" : "Nữ"}</td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        user.role === "ADMIN"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.role === "ADMIN" ? "Quản trị" : "Khách hàng"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <PasswordCell password={user.password ?? ""} />
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleEditClick(user)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 📄 Phân trang */}
      <div className="flex justify-center mt-6">
        <Pagination
          current={pageIndex}
          total={totalRow}
          pageSize={pageSize}
          onChange={handlePageChange}
          onShowSizeChange={(current, size) => handlePageChange(current, size)}
          showSizeChanger
          showQuickJumper
          showTotal={handleShowTotal}
          pageSizeOptions={["5", "10", "20", "50"]}
          itemRender={(_, type, originalElement) => {
            if (type === "prev") {
              return (
                <Button size="small" type="text" disabled={pageIndex === 1}>
                  ‹ Trước
                </Button>
              );
            }
            if (type === "next") {
              return (
                <Button size="small" type="text">
                  Sau ›
                </Button>
              );
            }
            return originalElement;
          }}
        />
      </div>
    </div>
  );
};

export default UserManagement;
