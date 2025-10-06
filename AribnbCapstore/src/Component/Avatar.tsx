import { useState } from "react";
import { Upload, Button, message, Avatar, Spin } from "antd";
import { UploadOutlined, SaveOutlined } from "@ant-design/icons";
import type { UploadChangeParam } from "antd/es/upload";
import { userAuthStore } from "../store";
import api from "../service/api";


export default function AvatarUpload() {
  const { user, setUser } = userAuthStore();
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (info: UploadChangeParam) => {
    const file = info.file.originFileObj as File;
    if (file) {
      setFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!file) return message.warning("Vui lòng chọn ảnh trước!");

    const formData = new FormData();
    formData.append("avatar", file);

    setLoading(true);
    try {
      const res = await api.post("/users/upload-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newAvatar = res.data.avatar;
      const updatedUser = { ...user!, avatar: newAvatar };

      setUser(updatedUser);
      message.success("🎉 Cập nhật avatar thành công!");
      setFile(null);
    } catch (error) {
      console.error(error);
      message.error("❌ Lỗi khi tải lên avatar!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <Avatar
        size={120}
        src={preview || user?.avatar}
        alt="avatar"
        className="shadow-lg"
      />

      <Upload
        showUploadList={false}
        beforeUpload={() => false}
        onChange={handleChange}
        accept="image/*"
      >
        <Button icon={<UploadOutlined />}>Chọn ảnh mới</Button>
      </Upload>

      {file && (
        <Button
          type="primary"
          icon={<SaveOutlined />}
          loading={loading}
          onClick={handleUpload}
        >
          Lưu avatar
        </Button>
      )}

      {loading && <Spin />}
    </div>
  );
}
