export interface UserFromServer {
  id: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  birthday: string;
  avatar: string;
  gender: boolean;
  role: "ADMIN" | "USER";
}

export interface PaginatedResponse<T> {
  pageIndex: number;
  pageSize: number;
  totalRow: number;
  data: T[];}

