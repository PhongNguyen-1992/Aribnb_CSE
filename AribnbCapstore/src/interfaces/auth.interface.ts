export interface loginDataRequest {
  taiKhoan: string;
  matKhau: string;
}

export interface Register {
  id: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  birthday: string;
  avatar: string;
  gender: boolean;
  role: string;
}
export interface Users {
  id: number;
  name: string;
  email: string;
  password?: string; // Optional since we don't store it
  phone: string;
  birthday: string;
  avatar: string;
  gender: boolean;
  role: "USER" | "ADMIN";
  accessToken?: string; // Optional for token storage
}

export interface CurrentUser {
  id: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  birthday: string;
  avatar: string;
  gender: boolean;
  role: "USER" | "ADMIN";
}
export interface AuthUser extends Users {
  token: string;
}
export interface LoginApiResponse {
  id?: number;
  name?: string;
  hoTen?: string;
  email?: string;
  phone?: string;
  soDT?: string;
  birthday?: string;
  ngaySinh?: string;
  avatar?: string;
  gender?: boolean;
  gioiTinh?: boolean;
  role?: "USER" | "ADMIN";  
  accessToken?: string;
}

