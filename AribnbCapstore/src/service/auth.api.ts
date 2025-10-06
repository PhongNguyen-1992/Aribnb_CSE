// src/service/auth.api.ts
import type { BaseAPIResponse } from "../interfaces/base.interface";
import type { LoginApiResponse, Register, Users } from "../interfaces/auth.interface";
import api from "./api";



// Transform function để convert API response thành User interface
const transformUserData = (apiResponse: LoginApiResponse): Users => {
  return {
    id: apiResponse.id || 0,
    name: apiResponse.name || apiResponse.hoTen || "Unknown User",
    email: apiResponse.email || "",
    password: "", // Never store password
    phone: apiResponse.phone || apiResponse.soDT || "",
    birthday: apiResponse.birthday || apiResponse.ngaySinh || "",
    avatar: apiResponse.avatar || "",
    gender: apiResponse.gender ?? apiResponse.gioiTinh ?? true,
    role: apiResponse.role || 
          (apiResponse.role === "QuanTri" ? "ADMIN" : "USER")
  };
};

/**
 * API đăng nhập
 */

export const loginAPI = async (credentials: {
  email: string;
  password: string;
}): Promise<Users & { accessToken?: string }> => {
  try {
    console.log("🚀 Logging in with:", credentials);

    const loginData = {
      email: credentials.email,
      password: credentials.password,
    };

    const response = await api.post<BaseAPIResponse<any>>(
      "/auth/signin",
      loginData
    );

    console.log("📥 Raw API Response:", response.data);

    const user = response.data.content.user;
    const token = response.data.content.token;

    const userWithToken = {
      ...user,
      accessToken: token,
    };

    localStorage.setItem("user", JSON.stringify(userWithToken));

    console.log("✅ Login success, saved user:", userWithToken);
    return userWithToken;
  } catch (error: any) {
    console.error("❌ Login failed:", error?.response || error);
    throw new Error(
      error.response?.data?.message || "Đăng nhập thất bại, vui lòng thử lại"
    );
  }
};

/**
 * API đăng ký
 */
export const registerAPI = async (registerData: {
  name: string;
  email: string;
  password: string;
  phone: string;
  birthday: string;
  gender: boolean;
}): Promise<Register> => {
  try {
    console.log("🚀 Registering with:", registerData);

    const response = await api.post<BaseAPIResponse<Register>>(
      "/auth/signup",
      registerData
    );

    console.log("✅ Register success:", response.data);
    return response.data.content;
  } catch (error: any) {
    console.error("❌ Register failed:", error?.response || error);
    
    if (error.response?.status === 400) {
      const errorMsg = error.response?.data?.content || "Dữ liệu không hợp lệ";
      throw new Error(errorMsg);
    }
    
    if (error.response?.status === 409) {
      throw new Error("Email đã được sử dụng!");
    }
    
    throw new Error("Đăng ký thất bại! Vui lòng thử lại.");
  }
};

/**
 * API thêm người dùng mới (Admin function)
 */
export const addUserAPI = async (data: Users): Promise<Register> => {
  try { 
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      throw new Error("Vui lòng đăng nhập để thực hiện chức năng này");
    }

    const user = JSON.parse(userStr);
    if (!user.accessToken) {
      throw new Error("Token không hợp lệ. Vui lòng đăng nhập lại");
    }

    const response = await api.post<BaseAPIResponse<Register>>(
      "/users",
      data
    );

    console.log("✅ User added successfully:", response.data);
    return response.data.content;
  } catch (error: any) {
    console.error("❌ Add user failed:", error?.response || error);

    if (error.response?.status === 401) {
      localStorage.removeItem("user");
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại");
    }

    if (error.response?.status === 400) {
      const errorMsg =
        error.response?.data?.content ||
        error.response?.data?.message ||
        "Dữ liệu không hợp lệ";
      throw new Error(errorMsg);
    }

    if (error.response?.status === 409) {
      throw new Error("Tài khoản hoặc email đã tồn tại trong hệ thống");
    }

    if (error.response?.status === 403) {
      throw new Error("Bạn không có quyền thực hiện chức năng này");
    }

    throw new Error("Có lỗi xảy ra khi thêm người dùng. Vui lòng thử lại");
  }
};

/**
 * Utility function: kiểm tra login
 */
export const isLoggedIn = (): boolean => {
  try {
    const userStr = localStorage.getItem("user");
    if (!userStr) return false;

    const user = JSON.parse(userStr);
    return !!(user && user.accessToken);
  } catch {
    localStorage.removeItem("user");
    return false;
  }
};

/**
 * Utility function: lấy thông tin user hiện tại
 */
export const getCurrentUser = (): (Users & { accessToken?: string }) | null => {
  try {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;

    const user = JSON.parse(userStr);
    return user && user.accessToken ? user : null;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

/**
 * Utility function: refresh user data
 */
export const refreshUserData = async (): Promise<Users | null> => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) return null;

    // Call API để lấy user data mới nhất
    const response = await api.get<BaseAPIResponse<LoginApiResponse>>("/auth/profile");
    const freshUserData = transformUserData(response.data.content);
    
    const userWithToken = {
      ...freshUserData,
      accessToken: currentUser.accessToken
    };
    
    localStorage.setItem("user", JSON.stringify(userWithToken));
    return userWithToken;
  } catch (error) {
    console.error("❌ Failed to refresh user data:", error);
    return null;
  }
};