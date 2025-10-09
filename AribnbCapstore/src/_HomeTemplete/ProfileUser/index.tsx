import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  Button,
  Form,
  Input,
  Select,
  message,
  Modal,
  Spin,
  Table,
  Popconfirm,
  Badge,
  Tag,
} from "antd";
import {
  Edit2,
  Camera,
  Save,
  X,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  User,
  Calendar,
  Trash2,
  RefreshCw,
  Award,
  Shield,
  Clock,
} from "lucide-react";
import { updateUserAPI, uploadAvatarAPI } from "../../service/AdminPageAPI/user.api";
import { bookingApi } from "../../service/bookRoom.api";
import Footer from "../../Component/footer";
import dayjs from "dayjs";
import type { Users } from "../../interfaces/auth.interface";
import { create } from "zustand";
import AppHeader from "../../Component/hearder";
import FloatingContact from "../../Component/FloatingContact";

// ===== STORE =====
const getUserFromStorage = (): Users | null => {
  try {
    const userLocal = localStorage.getItem("user");
    if (!userLocal) return null;
    return JSON.parse(userLocal);
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

type AuthStore = {
  user: Users | null;
  isAuthenticated: boolean;
  setUser: (user: Users) => void;
  clearUser: () => void;
};

export const userAuthStore = create<AuthStore>((set) => ({
  user: getUserFromStorage(),
  isAuthenticated: !!getUserFromStorage(),
  setUser: (user: Users) => {
    set({ user, isAuthenticated: true });
    localStorage.setItem("user", JSON.stringify(user));
  },
  clearUser: () => {
    set({ user: null, isAuthenticated: false });
    localStorage.removeItem("user");
  },
}));

// ===== MAIN COMPONENT =====
const UserProfile: React.FC = () => {
  const { user, setUser } = userAuthStore();
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [pendingAvatar, setPendingAvatar] = useState<File | null>(null);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [bookings, setBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  useEffect(() => {
    const storedUser = getUserFromStorage();
    if (storedUser) {
      setUser(storedUser);
      form.setFieldsValue(storedUser);
      loadBookings(storedUser.id);
    }
  }, [form, setUser]);

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      message.error("Vui lòng chọn đúng định dạng ảnh!");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      message.error("Ảnh không được vượt quá 5MB!");
      return;
    }

    setPendingAvatar(file);

    Modal.confirm({
      title: "Xác nhận thay đổi ảnh đại diện",
      content: "Bạn có chắc chắn muốn cập nhật ảnh đại diện mới này không?",
      okText: "Đồng ý",
      cancelText: "Hủy",
      onOk: () => setPreviewAvatar(URL.createObjectURL(file)),
      onCancel: () => {
        setPendingAvatar(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      },
    });
  };

  const handleSaveAvatar = async () => {
    if (!pendingAvatar || !user) {
      message.warning("Vui lòng chọn ảnh trước!");
      return;
    }

    setIsUploading(true);
    try {
      const newAvatar = await uploadAvatarAPI(pendingAvatar);
      const updatedUser = { ...user, avatar: newAvatar };

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      message.success("✅ Cập nhật ảnh đại diện thành công!");
      setPendingAvatar(null);
      setPreviewAvatar(null);
    } catch (err: any) {
      console.error("❌ Lỗi upload avatar:", err);
      message.error(err.message || "Không thể tải lên avatar!");
    } finally {
      setIsUploading(false);
    }
  };

  const loadBookings = async (userId?: number) => {
    const uid = userId || user?.id;
    if (!uid) return;

    setLoadingBookings(true);
    try {
      const data = await bookingApi.getAll();
      const userBookings = data.filter((b: any) => b.maNguoiDung === uid);
      setBookings(userBookings);
    } catch (err) {
      console.error("❌ Lỗi khi tải lịch sử đặt phòng:", err);
      message.error("Không thể tải lịch sử đặt phòng!");
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleDeleteBooking = async (id: number) => {
    try {
      await bookingApi.delete(id);
      message.success("🗑️ Đã xoá đơn đặt phòng!");
      loadBookings();
    } catch {
      message.error("Không thể xoá đơn này!");
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    form.setFieldsValue(user || {});
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.resetFields();
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (!user) return;

      const updatedData = { ...values, role: user.role };
      const updated = await updateUserAPI(user.id, updatedData);
      const newUser = { ...user, ...updated };

      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));

      message.success("✅ Cập nhật thông tin thành công!");
      setIsEditing(false);
    } catch (err: any) {
      console.error("❌ Update error:", err);
      message.error("Không thể cập nhật thông tin!");
    }
  };

  if (!user)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-center">
          <User className="mx-auto mb-4 text-gray-400" size={64} />
          <p className="text-gray-600 text-lg">Không có thông tin người dùng!</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg shadow-sm border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AppHeader />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-4 mb-3">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-2xl shadow-lg">
              <User size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Hồ sơ cá nhân
              </h1>
              <p className="text-gray-600 mt-1">Quản lý thông tin tài khoản của bạn</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Avatar Card */}
          <div className="lg:col-span-1">
            <Card 
              className="shadow-xl border-0 rounded-3xl overflow-hidden bg-gradient-to-br from-white to-purple-50 hover:shadow-2xl transition-all duration-300"
              bodyStyle={{ padding: '2rem' }}
            >
              <div className="flex flex-col items-center">
                {/* Avatar */}
                <div className="relative group mb-6">
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full opacity-75 group-hover:opacity-100 blur transition duration-300 animate-pulse"></div>
                  <div className="relative">
                    <img
                      src={previewAvatar || user.avatar || "/default-avatar.png"}
                      alt={user.name}
                      className="w-44 h-44 rounded-full object-cover ring-4 ring-white shadow-2xl"
                    />
                    {isUploading && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full backdrop-blur-sm">
                        <Spin size="large" />
                      </div>
                    )}
                    <button
                      onClick={handleAvatarClick}
                      disabled={isUploading}
                      className="absolute bottom-2 right-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white p-3 rounded-full shadow-lg transform hover:scale-110 transition-all duration-200 disabled:opacity-50"
                    >
                      <Camera size={20} />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                  </div>
                </div>

                {/* User Info */}
                <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
                  {user.name}
                </h2>
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                  <Award size={16} className="text-indigo-500" />
                  <span>ID: <span className="font-semibold text-gray-700">#{user.id}</span></span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                  <Mail size={16} className="text-purple-500" />
                  <span className="text-xs">{user.email}</span>
                </div>

                {/* Role Badge */}
                <div className="mb-6">
                  {user.role === "ADMIN" ? (
                    <Badge.Ribbon text="VIP" color="gold">
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-2xl shadow-lg flex items-center gap-2">
                        <Shield size={20} />
                        <span className="font-bold">Quản trị viên</span>
                      </div>
                    </Badge.Ribbon>
                  ) : (
                    <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-6 py-3 rounded-2xl shadow-lg flex items-center gap-2">
                      <User size={20} />
                      <span className="font-bold">Người dùng</span>
                    </div>
                  )}
                </div>

                {/* Save Avatar Button */}
                {pendingAvatar && (
                  <div className="flex gap-2 w-full animate-fade-in">
                    <Button
                      type="primary"
                      icon={<Save size={16} />}
                      onClick={handleSaveAvatar}
                      loading={isUploading}
                      className="flex-1 h-11 bg-gradient-to-r from-green-500 to-emerald-600 border-0 hover:from-green-600 hover:to-emerald-700 rounded-xl font-semibold shadow-lg"
                    >
                      Lưu ảnh
                    </Button>
                    <Button
                      icon={<X size={16} />}
                      onClick={() => {
                        setPendingAvatar(null);
                        setPreviewAvatar(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      className="h-11 rounded-xl font-semibold hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                    >
                      Hủy
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Info Card */}
          <div className="lg:col-span-2">
            <Card
              className="shadow-xl border-0 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300"
              title={
                <div className="flex justify-between items-center py-2">
                  <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
                    <User size={22} />
                    Thông tin chi tiết
                  </span>
                  {!isEditing ? (
                    <Button
                      type="primary"
                      icon={<Edit2 size={18} />}
                      onClick={handleEdit}
                      className="h-11 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 border-0 hover:from-indigo-700 hover:to-purple-700 rounded-xl font-semibold shadow-lg"
                    >
                      Chỉnh sửa
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        icon={<X size={18} />}
                        onClick={handleCancel}
                        className="h-11 px-6 rounded-xl font-semibold hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                      >
                        Hủy
                      </Button>
                      <Button
                        type="primary"
                        icon={<Save size={18} />}
                        onClick={handleSave}
                        className="h-11 px-6 bg-gradient-to-r from-green-500 to-emerald-600 border-0 hover:from-green-600 hover:to-emerald-700 rounded-xl font-semibold shadow-lg"
                      >
                        Lưu thay đổi
                      </Button>
                    </div>
                  )}
                </div>
              }
            >
              <Form form={form} layout="vertical" disabled={!isEditing}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Form.Item label={<span className="font-semibold text-gray-700">Mã người dùng</span>}>
                    <Input 
                      value={user.id} 
                      disabled 
                      className="h-12 rounded-xl bg-gray-50"
                    />
                  </Form.Item>

                  <Form.Item
                    name="name"
                    label={<span className="font-semibold text-gray-700">Họ và tên</span>}
                    rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
                  >
                    <Input 
                      prefix={<User size={18} className="text-indigo-400" />} 
                      className="h-12 rounded-xl hover:border-indigo-400 focus:border-indigo-500"
                    />
                  </Form.Item>

                  <Form.Item 
                    name="email" 
                    label={<span className="font-semibold text-gray-700">Email</span>}
                  >
                    <Input 
                      prefix={<Mail size={18} className="text-purple-400" />} 
                      disabled 
                      className="h-12 rounded-xl bg-gray-50"
                    />
                  </Form.Item>

                  <Form.Item 
                    name="phone" 
                    label={<span className="font-semibold text-gray-700">Số điện thoại</span>}
                  >
                    <Input 
                      prefix={<Phone size={18} className="text-green-400" />} 
                      className="h-12 rounded-xl hover:border-indigo-400 focus:border-indigo-500"
                    />
                  </Form.Item>

                  <Form.Item 
                    name="gender" 
                    label={<span className="font-semibold text-gray-700">Giới tính</span>}
                  >
                    <Select className="h-12 rounded-xl">
                      <Select.Option value={true}>Nam</Select.Option>
                      <Select.Option value={false}>Nữ</Select.Option>
                    </Select>
                  </Form.Item>

                  <Form.Item 
                    name="birthday" 
                    label={<span className="font-semibold text-gray-700">Ngày sinh</span>}
                  >
                    <Input 
                      prefix={<Calendar size={18} className="text-pink-400" />} 
                      type="date"
                      className="h-12 rounded-xl hover:border-indigo-400 focus:border-indigo-500"
                    />
                  </Form.Item>
                </div>

                <Form.Item 
                  name="password" 
                  label={<span className="font-semibold text-gray-700">Mật khẩu</span>}
                >
                  <Input
                    type={showPassword ? "text" : "password"}
                    prefix={<Lock size={18} className="text-red-400" />}
                    suffix={
                      <Button
                        type="text"
                        icon={
                          showPassword ? <EyeOff size={18} className="text-gray-400" /> : <Eye size={18} className="text-gray-400" />
                        }
                        onClick={() => setShowPassword(!showPassword)}
                        className="hover:bg-gray-100 rounded-lg"
                      />
                    }
                    disabled
                    className="h-12 rounded-xl bg-gray-50"
                  />
                </Form.Item>
              </Form>
            </Card>
          </div>
        </div>

        {/* Booking History */}
        <Card
          className="shadow-xl border-0 rounded-3xl overflow-hidden mt-6 hover:shadow-2xl transition-all duration-300"
          title={
            <div className="flex justify-between items-center py-2">
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
                <Calendar size={22} />
                Lịch sử đặt phòng
              </span>
              <Button
                icon={<RefreshCw size={18} />}
                onClick={() => loadBookings()}
                loading={loadingBookings}
                className="h-11 px-6 rounded-xl font-semibold hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300"
              >
                Làm mới
              </Button>
            </div>
          }
        >
          <Spin spinning={loadingBookings}>
            {bookings.length === 0 ? (
              <div className="text-center py-16">
                <Calendar size={64} className="mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 text-lg">Bạn chưa có đơn đặt phòng nào.</p>
              </div>
            ) : (
            <Table
  dataSource={bookings.map((b, i) => ({ key: i, ...b }))}
  pagination={{ pageSize: 5 }}
  className="custom-table"
  columns={[
    {
      title: <span className="font-semibold text-white">Mã đơn</span>,
      dataIndex: "id",
      render: (id) => (
        <Tag color="blue" className="font-semibold px-3 py-1 rounded-lg">
          #{id}
        </Tag>
      ),
    },
    {
      title: <span className="font-semibold text-white">Mã phòng</span>,
      dataIndex: "maPhong",
      render: (room) => (
        <span className="font-semibold text-indigo-600">{room}</span>
      ),
    },
    {
      title: <span className="font-semibold text-white">Ngày đến</span>,
      dataIndex: "ngayDen",
      render: (d) => (
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-green-500" />
          <span>{dayjs(d).format("DD/MM/YYYY")}</span>
        </div>
      ),
    },
    {
      title: <span className="font-semibold text-white">Ngày đi</span>,
      dataIndex: "ngayDi",
      render: (d) => (
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-red-500" />
          <span>{dayjs(d).format("DD/MM/YYYY")}</span>
        </div>
      ),
    },
    {
      title: <span className="font-semibold text-white">Số khách</span>,
      dataIndex: "soLuongKhach",
      render: (count) => (
        <Tag color="purple" className="font-semibold px-3 py-1 rounded-lg">
          {count} người
        </Tag>
      ),
    },
    // 👉 Chỉ hiển thị cột Thao tác nếu role != USER
    ...(user?.role !== "USER"
      ? [
          {
            title: (
              <span className="font-semibold text-white">Thao tác</span>
            ),
            key: "actions",
            render: (_: any, record: any) => (
              <Popconfirm
                title="Xoá đơn đặt phòng"
                description="Bạn có chắc muốn xoá đơn này không?"
                okText="Xoá"
                cancelText="Hủy"
                onConfirm={() => handleDeleteBooking(record.id)}
                okButtonProps={{
                  className: "bg-red-500 hover:bg-red-600",
                }}
              >
                <Button
                  danger
                  icon={<Trash2 size={16} />}
                  className="rounded-xl hover:shadow-lg transition-all duration-200"
                >
                  Xoá
                </Button>
              </Popconfirm>
            ),
          },
        ]
      : []),
  ]}
/>

            )}
          </Spin>
        </Card>
<FloatingContact/>
        <div className="mt-8">
          <Footer />
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .custom-table .ant-table-thead > tr > th {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          font-weight: 600;
          border: none;
        }

        .custom-table .ant-table-tbody > tr:hover > td {
          background: #f5f3ff !important;
        }

        .ant-select-selector {
          height: 48px !important;
          border-radius: 12px !important;
          align-items: center !important;
        }

        .ant-card-head {
          border-bottom: 2px solid #e9d5ff;
        }
      `}</style>
    </div>
  );
};

export default UserProfile;