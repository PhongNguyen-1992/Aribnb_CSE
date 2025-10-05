import type { ProfileAdmin } from "@/interfaces/admin.interface";
import { EditOutlined } from "@ant-design/icons";
import { Button, Space, Tooltip } from "antd";
import type { FC } from "react";
import DeleteUserButton from "./DeleteUser";

const ActionCell: FC<{
  record: ProfileAdmin;
  canEdit: (r: ProfileAdmin) => boolean;
  canDelete: (r: ProfileAdmin) => boolean;
  onEdit: (r: ProfileAdmin) => void;
  onDelete: (taiKhoan: string) => void;
  deleteLoading: string | null;
}> = ({ record, canEdit, canDelete, onEdit, onDelete, deleteLoading }) => (
  <Space size="small">
    <Tooltip title={canEdit(record) ? "Sửa thông tin" : "Bạn không có quyền sửa"}>
      <Button
        type="primary"
        ghost
        size="small"
        icon={<EditOutlined />}
        onClick={() => onEdit(record)}
        disabled={!canEdit(record)}
      />
    </Tooltip>
    <DeleteUserButton
      taiKhoan={record.taiKhoan}
      canDelete={canDelete(record)}
      loading={deleteLoading === record.taiKhoan}
      onDelete={onDelete}
    />
  </Space>
);
export default ActionCell;