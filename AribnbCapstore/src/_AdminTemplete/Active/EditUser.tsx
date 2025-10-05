import { Modal, Form, Input, Row, Col, Select, Button } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined, UsergroupAddOutlined, EditOutlined } from "@ant-design/icons";
import type { FC } from "react";

interface ModalEditUserProps {
  open: boolean;
  loading: boolean;
  form: any;
  isAdmin: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}

const { Option } = Select;

const ModalEditUser: FC<ModalEditUserProps> = ({
  open,
  loading,
  form,
  isAdmin,
  onCancel,
  onSubmit,
}) => {
  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <EditOutlined className="text-blue-500" />
          <span>Chỉnh sửa thông tin người dùng</span>
        </div>
      }
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={onSubmit}>
          Cập nhật
        </Button>,
      ]}
      width={600}
      destroyOnClose
    >
      <Form form={form} layout="vertical" className="mt-4" autoComplete="off">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="taiKhoan"
              label="Tài khoản"
              rules={[{ required: true, message: "Vui lòng nhập tài khoản!" }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Nhập tài khoản"
                disabled // không cho sửa
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
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="hoTen"
          label="Họ và tên"
          rules={[
            { required: true, message: "Vui lòng nhập họ và tên!" },
            { min: 2, message: "Họ tên phải có ít nhất 2 ký tự!" },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="Nhập họ và tên" />
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
              <Input prefix={<MailOutlined />} placeholder="Nhập email" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="soDt"
              label="Số điện thoại"
              rules={[
                {
                  pattern: /^[0-9+()\-\s]*$/,
                  message: "Số điện thoại không hợp lệ!",
                },
              ]}
            >
              <Input
                prefix={<PhoneOutlined />}
                placeholder="Nhập số điện thoại"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="maLoaiNguoiDung"
          label="Loại người dùng"
          rules={[{ required: true, message: "Vui lòng chọn loại người dùng!" }]}
        >
          <Select
            placeholder="Chọn loại người dùng"
            size="large"
            disabled={!isAdmin}
          >
            <Option value="KhachHang">
              <div className="flex items-center gap-2">
                <UserOutlined />
                Khách hàng
              </div>
            </Option>
            <Option value="QuanTri">
              <div className="flex items-center gap-2">
                <UsergroupAddOutlined />
                Quản trị
              </div>
            </Option>
          </Select>
        </Form.Item>

        <Form.Item name="maNhom" hidden initialValue="GP00">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalEditUser;
