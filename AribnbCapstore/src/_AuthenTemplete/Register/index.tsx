// src/pages/auth/Register.tsx
import React from "react";
import { Form, Input, Button, Typography, Divider, Select, DatePicker, message } from "antd";
import { useNavigate, NavLink } from "react-router-dom";
import { Mail, Lock, User, Phone } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import dayjs from 'dayjs';
import { registerAPI } from "../../service/auth.api";
import Logo from "../../Component/logo";

const { Text, Title } = Typography;
const { Option } = Select;

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  birthday: dayjs.Dayjs;
  gender: boolean;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const { mutate: handleRegister, isPending } = useMutation({
    mutationFn: (data: {
      name: string;
      email: string;
      password: string;
      phone: string;
      birthday: string;
      gender: boolean;
    }) => registerAPI(data),
    onSuccess: (response) => {
      console.log("✅ Register Success:", response);
      message.success("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate("/auth/login");
    },
    onError: (error: any) => {
      console.error("❌ Register Error:", error);
      const errorMessage = error.message || "Đăng ký thất bại! Vui lòng thử lại.";
      message.error(errorMessage);
    },
  });

  const onFinish = (values: RegisterFormData) => {
    const registerData = {
      name: values.name,
      email: values.email,
      password: values.password,
      phone: values.phone,
      birthday: values.birthday.format('DD/MM/YYYY'),
      gender: values.gender,
    };

    console.log("📤 Register Data:", registerData);
    handleRegister(registerData);
  };

  return (
    <>
    <Logo/>
      <Title level={2} style={{ textAlign: "center", marginBottom: 32, color: "white" }}>
        Đăng Ký
      </Title>

      <Form
        form={form}
        name="register"
        layout="vertical"
        onFinish={onFinish}
        scrollToFirstError
        size="large"
      >
        <Form.Item
           label={<span style={{ color: "white" }}>Họ và tên</span>}
          name="name"
          rules={[
            { required: true, message: "Vui lòng nhập họ tên!" },
            { min: 2, message: "Họ tên phải có ít nhất 2 ký tự!" },
          ]}
        >
          <Input 
            placeholder="Nhập họ và tên" 
            prefix={<User size={16} />} 
          />
        </Form.Item>

        <Form.Item
           label={<span style={{ color: "white" }}>Email</span>}
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không hợp lệ!" },
          ]}
        >
          <Input 
            placeholder="Nhập địa chỉ email" 
            prefix={<Mail size={16} />} 
          />
        </Form.Item>

        <Form.Item
           label={<span style={{ color: "white" }}>Số Điện Thoại</span>}
          name="phone"
          rules={[
            { required: true, message: "Vui lòng nhập số điện thoại!" },
            { 
              pattern: /^[0-9]{10,11}$/, 
              message: "Số điện thoại phải có 10-11 chữ số!" 
            },
          ]}
        >
          <Input 
            placeholder="Nhập số điện thoại" 
            prefix={<Phone size={16} />} 
          />
        </Form.Item>

        <Form.Item
           label={<span style={{ color: "white" }}>Ngày Sinh</span>}
          name="birthday"
          rules={[
            { required: true, message: "Vui lòng chọn ngày sinh!" },
          ]}
        >
          <DatePicker
            placeholder="Chọn ngày sinh"
            style={{ width: "100%" }}
            format="DD/MM/YYYY"
            showToday={false}
          />
        </Form.Item>

        <Form.Item
           label={<span style={{ color: "white" }}>Giới Tính</span>}
          name="gender"
          rules={[
            { required: true, message: "Vui lòng chọn giới tính!" },
          ]}
        >
          <Select placeholder="Chọn giới tính">
            <Option value={true}>Nam</Option>
            <Option value={false}>Nữ</Option>
          </Select>
        </Form.Item>

        <Form.Item
           label={<span style={{ color: "white" }}>Mật Khẩu</span>}
          name="password"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu!" },
            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
          ]}
        >
          <Input.Password 
            placeholder="Nhập mật khẩu" 
            prefix={<Lock size={16} />} 
          />
        </Form.Item>      

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            block 
            loading={isPending}
            style={{ height: 48, fontSize: 16 }}
          >
            {isPending ? "Đang đăng ký..." : "Đăng Ký"}
          </Button>
        </Form.Item>
      </Form>

      <Divider style={{ margin: "24px 0", color:"white" }}>Hoặc</Divider>

      <div style={{ textAlign: "center" }}>
        <Text style={{color:"white"}}>Bạn đã có tài khoản? </Text>
        <NavLink
          to="/auth/login"
          style={{
            color: "#1677ff",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Đăng nhập ngay
        </NavLink>
      </div>
    </>
  );
};

export default Register;