import { Modal, Form, Input, Row, Col, Select } from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { UserPlus } from "lucide-react";
import type { FC } from "react";

interface ModalAddUserProps {
  open: boolean;
  loading: boolean;
  form: any;
  onCancel: () => void;
  onOk: () => void;
}

const ModalAddUser: FC<ModalAddUserProps> = ({
  open,
  loading,
  form,
  onCancel,
  onOk,
}) => {
  return (
    <Modal
      title={
        <div className="flex items-center gap-2 text-lg font-semibold">
          <UserPlus className="w-5 h-5 text-blue-500" />
          Thêm Người Dùng Mới
        </div>
      }
      open={open}
      onCancel={onCancel}
      onOk={onOk}
      okText="Lưu"
      cancelText="Hủy"
      width={600}
      className="rounded-lg"
      confirmLoading={loading}
    >
      <div className="py-4">
        <Form form={form} layout="vertical" requiredMark="optional">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="taiKhoan"
                label="Tài khoản"
                rules={[
                  { required: true, message: "Vui lòng nhập tài khoản!" },
                  { min: 3, message: "Tài khoản phải có ít nhất 3 ký tự!" },
                ]}
              >
                <Input
                  placeholder="Nhập tài khoản..."
                  prefix={<UserOutlined className="text-gray-400" />}
                  className="rounded-lg"
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="matKhau"
                label="Mật khẩu"
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu!" },
                  { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
                ]}
              >
                <Input.Password
                  placeholder="Nhập mật khẩu..."
                  className="rounded-lg"
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="hoTen"
            label="Họ và tên"
            rules={[
              { required: true, message: "Vui lòng nhập họ tên!" },
              { min: 2, message: "Họ tên phải có ít nhất 2 ký tự!" },
            ]}
          >
            <Input
              placeholder="Nhập họ và tên đầy đủ..."
              prefix={<UserOutlined className="text-gray-400" />}
              className="rounded-lg"
              size="large"
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: "email", message: "Email không hợp lệ!" },
                ]}
              >
                <Input
                  placeholder="example@email.com"
                  prefix={<MailOutlined className="text-gray-400" />}
                  className="rounded-lg"
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="soDT"
                label="Số điện thoại"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập số điện thoại!",
                  },
                  {
                    pattern: /^[0-9]{10,11}$/,
                    message: "Số điện thoại phải có 10-11 chữ số!",
                  },
                ]}
              >
                <Input
                  placeholder="0123456789"
                  prefix={<PhoneOutlined className="text-gray-400" />}
                  className="rounded-lg"
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="maLoaiNguoiDung"
            label="Loại người dùng"
            rules={[
              { required: true, message: "Vui lòng chọn loại người dùng!" },
            ]}
          >
            <Select
              placeholder="Chọn loại người dùng..."
              size="large"
              className="rounded-lg"
              options={[
                {
                  value: "KhachHang",
                  label: (
                    <div className="flex items-center gap-2">
                      <UserOutlined className="text-blue-500" />
                      Khách Hàng
                    </div>
                  ),
                },
                {
                  value: "QuanTri",
                  label: (
                    <div className="flex items-center gap-2">
                      <UsergroupAddOutlined className="text-red-500" />
                      Quản Trị
                    </div>
                  ),
                },
              ]}
            />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default ModalAddUser;
