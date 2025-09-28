// src/pages/auth/Login.tsx
import React from "react";
import { Form, Input, Button, Typography, Divider, message } from "antd";
import { Mail, Lock } from "lucide-react";
import { useNavigate, NavLink } from "react-router-dom";
import { loginAPI } from "../../service/auth.api";

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      console.log("🚀 Login form submitted:", values);
      const user = await loginAPI(values);

      message.success(`Xin chào ${user.name || user.email}!`);
      navigate("/"); // ✅ Sau khi login thành công chuyển về home
    } catch (error: any) {
      console.error("❌ Login error:", error);
      message.error(error.message || "Đăng nhập thất bại!");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #74ABE2, #5563DE)",
        padding: 20,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 400,
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 12px 32px rgba(0,0,0,0.15)",
          padding: "40px 30px",
        }}
      >
        <Title level={2} style={{ textAlign: "center", marginBottom: 24 }}>
          Đăng Nhập
        </Title>

        <Form name="login" layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input
              size="large"
              placeholder="Nhập email"
              prefix={<Mail size={16} />}
            />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password
              size="large"
              placeholder="Nhập mật khẩu"
              prefix={<Lock size={16} />}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Đăng Nhập
            </Button>
          </Form.Item>
        </Form>

        <Divider style={{ margin: "24px 0" }}>Hoặc</Divider>

        <div style={{ textAlign: "center" }}>
          <Text>Bạn chưa có tài khoản? </Text>
          <NavLink
            to="/auth/register"
            style={{
              color: "#1677ff",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Đăng ký ngay
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Login;
