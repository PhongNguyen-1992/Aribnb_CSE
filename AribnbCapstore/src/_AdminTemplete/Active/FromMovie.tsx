import  { useState, type FC } from "react";
import { Form, Input, DatePicker, Checkbox, Upload, Button, Space, message, Divider} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

interface AddMovieFormProps {
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean; 
}

const AddMovieForm: FC<AddMovieFormProps> = ({ onSubmit, onCancel, }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleFinish = async (values: any) => {
    try {
      setLoading(true);

      // Validate ảnh
      if (!values.hinhAnh || values.hinhAnh.length === 0 || !values.hinhAnh[0]?.originFileObj) {
        message.error("Vui lòng chọn hình ảnh cho phim!");
        return;
      }

      // Prepare FormData
      const status = {
        dangChieu: dayjs(values.ngayKhoiChieu).isBefore(dayjs(), "day"),
        sapChieu: dayjs(values.ngayKhoiChieu).isAfter(dayjs(), "day"),
      };

      const formData = new FormData();
      formData.append("tenPhim", values.tenPhim.trim());
      formData.append("biDanh", values.tenPhim.trim());
      formData.append("trailer", values.trailer.trim());
      formData.append("moTa", values.moTa.trim());
      formData.append("maNhom", "GP01");
      formData.append("ngayKhoiChieu", values.ngayKhoiChieu.format("DD/MM/YYYY"));
      formData.append("dangChieu", status.dangChieu ? "true" : "false");
      formData.append("sapChieu", status.sapChieu ? "true" : "false");
      formData.append("hot", values.hot ? "true" : "false");
      formData.append("danhGia", values.danhGia.toString());
      formData.append("File", values.hinhAnh[0].originFileObj);

      await onSubmit(formData);
      form.resetFields();
    } catch (err: any) {
      console.error(err);
      message.error(err.message || "Thêm phim thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form layout="vertical" form={form} onFinish={handleFinish}>
      <Divider>📽️ Thông tin phim</Divider>
      <Form.Item name="tenPhim" label="Tên phim" rules={[{ required: true }]}>
        <Input placeholder="Nhập tên phim..." />
      </Form.Item>

      <Form.Item name="trailer" label="Trailer (URL)" rules={[{ required: true }]}>
        <Input placeholder="https://youtube.com/watch?v=..." />
      </Form.Item>

      <Form.Item name="moTa" label="Mô tả" rules={[{ required: true }]}>
        <Input.TextArea rows={4} />
      </Form.Item>

      <Form.Item name="ngayKhoiChieu" label="Ngày khởi chiếu" rules={[{ required: true }]}>
        <DatePicker format="DD/MM/YYYY" className="w-full" />
      </Form.Item>

      <Form.Item name="danhGia" label="Đánh giá (0-10)" rules={[{ required: true }]}>
        <Input type="number" min={0} max={10} />
      </Form.Item>

      <Divider>🎭 Trạng thái phim</Divider>
      <Form.Item name="hot" valuePropName="checked">
        <Checkbox>🔥 Phim HOT</Checkbox>
      </Form.Item>

      <Divider>🖼️ Hình ảnh poster</Divider>
      <Form.Item
        name="hinhAnh"
        valuePropName="fileList"
        getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
        rules={[{ required: true, message: "Vui lòng chọn hình ảnh!" }]}
      >
        <Upload
          beforeUpload={() => false}
          maxCount={1}
          listType="picture-card"
          accept="image/*"
        >
          <div>
            <UploadOutlined />
            <div>📤 Tải ảnh poster</div>
          </div>
        </Upload>
      </Form.Item>

      <Form.Item className="text-center">
        <Space>
          <Button type="primary" htmlType="submit" loading={loading}>
            💾 Lưu phim
          </Button>
          <Button onClick={onCancel}>↩️ Quay lại</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default AddMovieForm;
