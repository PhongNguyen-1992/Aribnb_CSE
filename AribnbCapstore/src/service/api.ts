import axios, { type AxiosInstance, type AxiosError } from "axios";

// ✅ Tạo instance axios mặc định
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Interceptor: tự động gắn token vào mọi request
api.interceptors.request.use(
  (config) => {
    try {
      // Lấy thông tin user trong localStorage
      const userLocal = localStorage.getItem("user");
      const userParsed = userLocal ? JSON.parse(userLocal) : null;
      const token = userParsed?.accessToken;

      // ✅ Gắn 2 token header đúng theo yêu cầu backend
      ( config.headers as any ) = {
        ...config.headers,
        token: token || "", // token người dùng đang đăng nhập
        tokenCybersoft:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA4MyIsIkhldEhhblN0cmluZyI6IjE4LzAxLzIwMjYiLCJIZXRIYW5UaW1lIjoiMTc2ODY5NDQwMDAwMCIsIm5iZiI6MTc0MTg4ODgwMCwiZXhwIjoxNzY4ODQ1NjAwfQ.rosAjjMuXSBmnsEQ7BQi1qmo6eVOf1g8zhTZZg6WSx4",
      };

      console.log("✅ Gắn token:", token ? "Có token user" : "Không có token user");
      return config;
    } catch (error) {
      console.error("❌ Lỗi interceptor request:", error);
      localStorage.removeItem("user");
      return config;
    }
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// ✅ Interceptor: xử lý lỗi response
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error("❌ API Error:", {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    });

    // Token hết hạn hoặc sai
    if (error.response?.status === 401) {
      console.warn("🚨 Token hết hạn hoặc không hợp lệ");
      localStorage.removeItem("user");
      // window.location.href = "/login";
    }

    // Không đủ quyền (403)
    if (error.response?.status === 403) {
      console.warn("🚫 Không có quyền admin hoặc token sai");
    }

    // Lỗi kết nối mạng
    if (error.code === "NETWORK_ERROR" || !error.response) {
      console.error("🌐 Lỗi mạng hoặc server không phản hồi");
    }

    return Promise.reject(error);
  }
);

export default api;
