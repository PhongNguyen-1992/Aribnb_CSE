import { Button, Popconfirm, Tooltip } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import type { FC } from "react";

interface DeleteUserButtonProps {
  taiKhoan: string;
  canDelete: boolean;
  loading: boolean;
  onDelete: (taiKhoan: string) => void;
}

const DeleteUserButton: FC<DeleteUserButtonProps> = ({
  taiKhoan,
  canDelete,
  loading,
  onDelete,
}) => {
  return (
    <Tooltip
      title={canDelete ? "Xóa người dùng" : "Bạn không có quyền xóa"}
    >
      <Popconfirm
        title="Xác nhận xóa"
        description={`Bạn có chắc chắn muốn xóa người dùng "${taiKhoan}"?`}
        onConfirm={() => onDelete(taiKhoan)}
        okText="Xóa"
        cancelText="Hủy"
        okType="danger"
        disabled={!canDelete}
      >
        <Button
          danger
          size="small"
          icon={<DeleteOutlined />}
          loading={loading}
          disabled={!canDelete}
        />
      </Popconfirm>
    </Tooltip>
  );
};

export default DeleteUserButton;
