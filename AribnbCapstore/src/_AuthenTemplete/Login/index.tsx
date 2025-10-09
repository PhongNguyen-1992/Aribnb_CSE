import React, { useState } from "react";
import { Form, Input, Button, Typography, Divider, message } from "antd";
import { Mail, Lock } from "lucide-react";
import { useNavigate, NavLink } from "react-router-dom";
import { loginAPI } from "../../service/auth.api";
import Logo from "../../Component/logo";

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string>("");

  const onFinish = async (values: { email: string; password: string }) => {
    setErrorMsg(""); // reset lỗi cũ
    try {
      const user = await loginAPI(values);
      message.success(`Xin chào ${user.name || user.email}!`);
      navigate("/Home");
    } catch (error: any) {
      // 👇 Lấy lỗi trả về từ backend
      const msg =
        error?.response?.data?.content || // lỗi thực từ backend
        error?.response?.data?.message || // fallback
        error?.message || // fallback cuối
        "Đăng nhập thất bại, vui lòng thử lại!";

      // Nếu là lỗi sai thông tin đăng nhập
      if (
        msg.includes("Email") ||
        msg.includes("mật khẩu") ||
        msg.toLowerCase().includes("login") ||
        msg.toLowerCase().includes("unauthorized")
      ) {
        setErrorMsg("Email hoặc mật khẩu không đúng!");
      } else {
        setErrorMsg(msg);
      }
    }
  };

  return (
    <>
      <Logo />
      <Title
        level={2}
        style={{ textAlign: "center", marginBottom: 24, color: "white" }}
      >
        Đăng Nhập
      </Title>

      <Form name="login" layout="vertical" onFinish={onFinish}>
        <Form.Item
          label={<span style={{ color: "white" }}>Email</span>}
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
          label={<span style={{ color: "white" }}>Mật khẩu</span>}
          name="password"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
        >
          <Input.Password
            size="large"
            placeholder="Nhập mật khẩu"
            prefix={<Lock size={16} />}
          />
        </Form.Item>

        {/* ⚠️ Thông báo lỗi nhỏ hiển thị ở đây */}
        {errorMsg && (
          <Text type="danger" style={{ color: "#ff4d4f", display: "block", marginBottom: 8 }}>
            {errorMsg}
          </Text>
        )}

        <Form.Item>
          <Button type="primary" htmlType="submit" block size="large">
            Đăng Nhập
          </Button>
        </Form.Item>
      </Form>

      <Divider style={{ margin: "24px 0", color: "white" }}>Hoặc</Divider>

      <div style={{ textAlign: "center" }}>
        <Text style={{ color: "white" }}>Bạn chưa có tài khoản? </Text>
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
    </>
  );
};

export default Login;
