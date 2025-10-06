// interfaces/location.interface.ts

export interface Location {
  id: number;
  tenViTri: string;
  tinhThanh: string;
  quocGia: string;
  hinhAnh: string;
}

export interface PaginatedLocation<T> {
  items: T[];
  pageIndex: number;
  pageSize: number;
  totalRow: number;
  totalPages: number;
}
