import React, { useState, useRef, useEffect } from "react";
import { Card, Button, Form, Input, Select, message, Modal, Spin } from "antd";
import {
  Edit2,
  Camera,
  Save,
  X,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { userAuthStore } from "../../store";
import { updateUserAPI, uploadAvatarAPI } from "../../service/admin.api";
import AppHeaderInto from "../../Component/hearderinto";
import Footer from "../../Component/footer";

const UserProfile: React.FC = () => {
  const { user, setUser } = userAuthStore();
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ✅ Đồng bộ user giữa Zustand và localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (storedUser && (!user || storedUser.id !== user.id)) {
      setUser(storedUser);
      form.setFieldsValue(storedUser);
    } else if (user) {
      form.setFieldsValue(user);
    }
  }, [user, form, setUser]);

  // 📸 Click chọn file ảnh
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  // 🖼️ Khi chọn ảnh mới
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      message.error("Vui lòng chọn đúng định dạng ảnh!");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      message.error("Kích thước ảnh không vượt quá 5MB!");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setPreviewAvatar(previewUrl);

    Modal.confirm({
      title: "Xác nhận thay đổi ảnh đại diện",
      content: "Bạn có chắc chắn muốn cập nhật ảnh đại diện mới này không?",
      okText: "Đồng ý",
      cancelText: "Hủy",
      onOk: async () => {
        await handleUploadAvatar(file);
      },
      onCancel: () => {
        setPreviewAvatar(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      },
    });
  };

  // ☁️ Upload avatar bằng API riêng
  const handleUploadAvatar = async (file: File) => {
    if (!user) return;
    setIsUploading(true);
    try {
      const tokenData = JSON.parse(localStorage.getItem("user") || "{}");
      const token = tokenData?.accessToken;
      if (!token) {
        message.error("Bạn cần đăng nhập để cập nhật ảnh đại diện!");
        return;
      }

      const newAvatar = await uploadAvatarAPI(file, token); // ✅ Dùng API riêng

      const updatedUser = { ...user, avatar: newAvatar };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      message.success("✅ Cập nhật ảnh đại diện thành công!");
      setPreviewAvatar(null);
    } catch (err: any) {
      console.error("❌ Lỗi upload avatar:", err);
      message.error(err.message || "Không thể tải lên avatar!");
    } finally {
      setIsUploading(false);
    }
  };

  // ✏️ Chỉnh sửa thông tin
  const handleEdit = () => {
    setIsEditing(true);
    form.setFieldsValue(user || {});
  };

  // ❌ Hủy chỉnh sửa
  const handleCancel = () => {
    setIsEditing(false);
    form.resetFields();
  };

  // 💾 Lưu thông tin user
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (!user) return;
      const updated = await updateUserAPI(user.id, values);
      const newUser = { ...user, ...updated };
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      message.success("Cập nhật thông tin thành công!");
      setIsEditing(false);
    } catch (err: any) {
      console.error("❌ Update error:", err);
      message.error("Không thể cập nhật thông tin!");
    }
  };

  if (!user)
    return <div className="text-center py-10">Không có thông tin người dùng!</div>;

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div style={{ marginBottom: "24px" }}>
          <AppHeaderInto />
        </div>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <span className="bg-indigo-100 text-indigo-600 p-3 rounded-xl">
              <User size={28} />
            </span>
            Hồ sơ cá nhân
          </h1>
          <p className="text-gray-500 mt-2">Quản lý thông tin tài khoản của bạn</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Avatar */}
          <Card className="shadow-lg border-0 flex flex-col items-center">
            <div className="relative group">
              <img
                src={previewAvatar || user.avatar || "/default-avatar.png"}
                alt={user.name}
                className="w-40 h-40 rounded-full object-cover ring-4 ring-indigo-100 shadow-lg"
              />
              {isUploading && (
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-full">
                  <Spin />
                </div>
              )}
              <button
                onClick={handleAvatarClick}
                disabled={isUploading}
                className="absolute bottom-2 right-2 bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg transition-all"
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

            <h2 className="text-xl font-bold mt-4">{user.name}</h2>
            <p className="text-gray-500 text-sm">{user.email}</p>
            <div className="mt-3">
              <span
                className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                  user.role === "ADMIN"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {user.role === "ADMIN" ? "👑 Quản trị viên" : "👤 Người dùng"}
              </span>
            </div>
          </Card>

          {/* Thông tin chi tiết */}
          <Card
            className="lg:col-span-2 shadow-lg border-0"
            title={
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-800 text-lg">
                  Thông tin chi tiết
                </span>
                {!isEditing ? (
                  <Button
                    type="primary"
                    icon={<Edit2 size={16} />}
                    onClick={handleEdit}
                    className="bg-indigo-600"
                  >
                    Chỉnh sửa
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button icon={<X size={16} />} onClick={handleCancel}>
                      Hủy
                    </Button>
                    <Button
                      type="primary"
                      icon={<Save size={16} />}
                      onClick={handleSave}
                      className="bg-green-600"
                    >
                      Lưu
                    </Button>
                  </div>
                )}
              </div>
            }
          >
            <Form form={form} layout="vertical" disabled={!isEditing}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  name="name"
                  label="Họ và tên"
                  rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
                >
                  <Input prefix={<User size={16} />} />
                </Form.Item>
                <Form.Item name="email" label="Email">
                  <Input prefix={<Mail size={16} />} disabled />
                </Form.Item>
                <Form.Item name="phone" label="Số điện thoại">
                  <Input prefix={<Phone size={16} />} />
                </Form.Item>
                <Form.Item name="gender" label="Giới tính">
                  <Select>
                    <Select.Option value={true}>Nam</Select.Option>
                    <Select.Option value={false}>Nữ</Select.Option>
                  </Select>
                </Form.Item>
              </div>

              <Form.Item name="password" label="Mật khẩu">
                <Input
                  type={showPassword ? "text" : "password"}
                  prefix={<Lock size={16} />}
                  suffix={
                    <Button
                      type="text"
                      icon={showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  }
                  disabled
                />
              </Form.Item>
            </Form>
          </Card>
        </div>

        <div style={{ marginTop: "24px" }}>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
