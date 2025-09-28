import { Alert, Flex, Spin } from "antd";
import { lazy, Suspense, type FC, type LazyExoticComponent } from "react";
import { type RouteObject, Navigate } from "react-router-dom";

// Lazy load pages
const HomePage = lazy(() => import("../_HomeTemplete/_index"));
const DichVu = lazy(() => import("../_HomeTemplete/dichVu"));
const TraiNghiem = lazy(() => import("../_HomeTemplete/traiNghiem"));
const NoiLuuTru = lazy(() => import("../_HomeTemplete/noiLuuTru"));
const AdminPage = lazy(() => import("../_AdminTemplete"));
const AuthLayout = lazy(() => import("../_AuthenTemplete"));
const Login = lazy(() => import("../_AuthenTemplete/Login/index"));
const Register = lazy(() => import("../_AuthenTemplete/Register/index"));

const withSuspense = (Component: LazyExoticComponent<FC>) => (
  <Suspense
    fallback={
      <div
        style={{
          position: "fixed",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0,0,0,0.85)",
          zIndex: 9999,
        }}
      >
        <Flex vertical align="center" justify="center" gap="large">
          <Spin tip="Loading..." size="large" />
          <Alert
            message="Chào Mừng Bạn Đến Với Aribnb"
            description="Chúng tôi đang tải dữ liệu, vui lòng chờ một chút"
            type="info"
            showIcon
          />
        </Flex>
      </div>
    }
  >
    <Component />
  </Suspense>
);

export const router: RouteObject[] = [
  {
    path: "/",
    element: withSuspense(HomePage),
    children: [
      { index: true, element: <Navigate to="/NoiLuuTru" replace /> }, // mặc định vào NoiLuuTru
      { path: "NoiLuuTru", element: withSuspense(NoiLuuTru) },
      { path: "TraiNghiem", element: withSuspense(TraiNghiem) },
      { path: "DichVu", element: withSuspense(DichVu) },
    ],
  },
  {
    path: "/auth",
    element: withSuspense(AuthLayout),
    children: [
      { path: "login", element: withSuspense(Login) },
      { path: "register", element: withSuspense(Register) },
    ],
  },
  {
    path: "/admin",
    element: withSuspense(AdminPage),
  },
];
