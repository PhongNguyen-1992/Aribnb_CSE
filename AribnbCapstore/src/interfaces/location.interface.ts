export interface Location {
    id:        number;
    tenViTri:  string;
    tinhThanh: string;
    quocGia:   string;
    hinhAnh:   string;
}
export interface PaginatedLocation<T> {
  pageIndex: number;
  pageSize: number;
  totalRow: number;
  data: T[];
}