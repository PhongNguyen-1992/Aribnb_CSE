import React, { useState } from "react";
import { Form, Input, Button, DatePicker, Select, message, Modal } from "antd";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { registerAPI } from "../../service/auth.api";
import Logo from "../../Component/logo";

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const registerData = {
        name: values.name,
        email: values.email,
        password: values.password,
        phone: values.phone,
        birthday: values.birthday.format("YYYY-MM-DD"),
        gender: values.gender === "male" ? true : false,
      };

      const data = await registerAPI(registerData);

      message.success("Đăng ký thành công!");
      setUserInfo(data); // lưu thông tin để hiển thị trong modal
      setIsModalOpen(true); // mở modal
    } catch (error: any) {
      message.error(error.message || "Đăng ký thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-white">
      <Logo />
      <h2 className="text-2xl font-bold text-center mb-6">Đăng Ký</h2>
      <Form
        layout="vertical"
        onFinish={onFinish}
        className="space-y-4"
        autoComplete="off"
      >
        <Form.Item
          label={<span style={{ color: "white" }}>Họ và Tên</span>}
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
        >
          <Input placeholder="Nguyễn Văn A" />
        </Form.Item>

        <Form.Item
          label={<span style={{ color: "white" }}>Email</span>}
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không hợp lệ!" },
          ]}
        >
          <Input placeholder="example@gmail.com" />
        </Form.Item>

        <Form.Item
          label={<span style={{ color: "white" }}>Mật Khẩu</span>}
          name="password"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
        >
          <Input.Password placeholder="••••••••" />
        </Form.Item>

        <Form.Item
         label={<span style={{ color: "white" }}>Số Điện Thoại</span>}
          name="phone"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
        >
          <Input placeholder="0123456789" />
        </Form.Item>

        <Form.Item
          label={<span style={{ color: "white" }}>Ngày Sinh</span>}
          name="birthday"
          rules={[{ required: true, message: "Vui lòng chọn ngày sinh!" }]}
        >
          <DatePicker
            format="DD/MM/YYYY"
            style={{ width: "100%" }}
            disabledDate={(current) =>
              current && current > dayjs().endOf("day")
            }
          />
        </Form.Item>

        <Form.Item          
          label={<span style={{ color: "white" }}>Giới Tính</span>}
          name="gender"
          rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
        >
          <Select
            placeholder="Chọn giới tính"
            options={[
              { label: "Nam", value: "male" },
              { label: "Nữ", value: "female" },
            ]}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full"
            loading={loading}
          >
            Đăng ký
          </Button>
        </Form.Item>
      </Form>

      {/* ✅ Modal xác nhận thông tin sau khi đăng ký */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        centered
      >
        <div className="text-center">
          <h2 className="text-xl font-bold mb-3 text-purple-600">
            🎉 Đăng ký thành công!
          </h2>
          <p className="text-gray-700">Thông tin tài khoản của bạn:</p>

          <div className="text-left mt-4 space-y-1">
            <p>
              <strong>ID:</strong> {userInfo?.id}
            </p>
            <p>
              <strong>Họ tên:</strong> {userInfo?.name}
            </p>
            <p>
              <strong>Email:</strong> {userInfo?.email}
            </p>
            <p>
              <strong>SĐT:</strong> {userInfo?.phone}
            </p>
            <p>
              <strong>Ngày sinh:</strong> {userInfo?.birthday}
            </p>
          </div>

          <Button
            type="primary"
            className="mt-5"
            onClick={() => {
              setIsModalOpen(false);
              navigate("/auth/login");
            }}
          >
            Đăng nhập ngay
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Register;
