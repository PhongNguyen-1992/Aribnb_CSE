// ProfileModal.tsx
import React, { useState } from "react";
import { Modal, Avatar, Descriptions, Tag, Button } from "antd";
import { UserCircle } from "lucide-react";
import type { Users } from "../interfaces/auth.interface";



const ProfileModal: React.FC<{ user: Users }> = ({ user }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 cursor-pointer hover:text-blue-500 transition"
      >
        <UserCircle className="h-4 w-4 text-blue-500" />
        <span>Thông tin cá nhân</span>
      </div>

      <Modal
        title="Thông tin cá nhân"
        open={open}
        onCancel={() => setOpen(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setOpen(false)}>
            Đóng
          </Button>,
        ]}
        centered
      >
        <div className="flex flex-col items-center gap-4">
          <Avatar size={100} src={user.avatar}>
            {user.name?.[0]}
          </Avatar>

          <Descriptions bordered column={1} className="w-full mt-4">
            <Descriptions.Item label="Tên">{user.name}</Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">
              {user.phone || "Chưa cập nhật"}
            </Descriptions.Item>
            <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
            <Descriptions.Item label="Ngày sinh">
              {user.birthday || "Chưa cập nhật"}
            </Descriptions.Item>
            <Descriptions.Item label="Giới tính">
              {user.gender || "Chưa cập nhật"}
            </Descriptions.Item>
            <Descriptions.Item label="Vai trò">
              {user.role === "ADMIN" ? (
                <Tag color="red">Quản trị</Tag>
              ) : (
                <Tag color="blue">Thành viên</Tag>
              )}
            </Descriptions.Item>
          </Descriptions>
        </div>
      </Modal>
    </>
  );
};

export default ProfileModal;
