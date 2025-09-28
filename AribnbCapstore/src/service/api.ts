import axios, { type AxiosInstance, type AxiosError } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor để gắn token vào mọi request
api.interceptors.request.use(
  (config) => {
    try {
      const userLocal = localStorage.getItem("user");
      const userParsed = userLocal ? JSON.parse(userLocal) : null;
      const token = userParsed?.accessToken;
      config.headers = {
        ...config.headers,
        // TokenCybersoft luôn được gắn
        TokenCybersoft:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA4MyIsIkhldEhhblN0cmluZyI6IjE4LzAxLzIwMjYiLCJIZXRIYW5UaW1lIjoiMTc2ODY5NDQwMDAwMCIsIm5iZiI6MTc0MTg4ODgwMCwiZXhwIjoxNzY4ODQ1NjAwfQ.rosAjjMuXSBmnsEQ7BQi1qmo6eVOf1g8zhTZZg6WSx4",
        // Authorization chỉ gắn khi có token
        ...(token && { Authorization: `Bearer ${token}` }),
      };     

      return config;
    } catch (error) {
      console.error("❌ Error in request interceptor:", error);
      // Nếu có lỗi parse JSON, xóa localStorage và tiếp tục request
      localStorage.removeItem("user");
      return config;
    }
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor để xử lý lỗi
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    console.error("❌ API Error:", {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    });

    // Xử lý lỗi 401 - Token hết hạn hoặc không hợp lệ
    if (error.response?.status === 401) {
      console.warn("🚨 Token expired or invalid, clearing localStorage");
      localStorage.removeItem("user");

      // Có thể redirect về trang login nếu cần
      // window.location.href = '/login';

      // Hoặc show notification
      // message.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    }

    // Xử lý lỗi 403 - Không có quyền
    if (error.response?.status === 403) {
      console.warn("🚫 Access forbidden");
      // message.error('Bạn không có quyền thực hiện hành động này.');
    }

    // Xử lý lỗi network
    if (error.code === "NETWORK_ERROR" || !error.response) {
      console.error("🌐 Network error or server unreachable");
      // message.error('Lỗi kết nối mạng. Vui lòng thử lại.');
    }

    return Promise.reject(error);
  }
);

export default api;
