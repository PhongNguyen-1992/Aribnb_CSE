export interface Location {
  id: number;
  tenViTri: string;
  tinhThanh: string;
  quocGia: string;
  hinhAnh: string;
}

export interface PaginatedLocationResponse {
  pageIndex: number;
  pageSize: number;
  totalRow: number;
  data: Location[];
}