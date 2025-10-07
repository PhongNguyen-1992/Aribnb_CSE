import { Alert, Flex, Spin } from "antd";
import { lazy, Suspense, type FC, type LazyExoticComponent } from "react";
import { type RouteObject, Navigate } from "react-router-dom";

// ✅ Lazy load các page
const WelcomePage = lazy(() => import("../_HomeTemplete/StayInfoPage/Welcome"));
const HomePage = lazy(() => import("../_HomeTemplete/_index"));
const DichVu = lazy(() => import("../_HomeTemplete/ServicePage"));
const TraiNghiem = lazy(() => import("../_HomeTemplete/ExperiencesPage"));
const NoiLuuTru = lazy(() => import("../_HomeTemplete/_index"));
const AdminPage = lazy(() => import("../_AdminTemplete"));
const AuthLayout = lazy(() => import("../_AuthenTemplete"));
const Login = lazy(() => import("../_AuthenTemplete/Login/index"));
const Register = lazy(() => import("../_AuthenTemplete/Register/index"));
const RoomDetail = lazy(() => import("../_HomeTemplete/StayInfoPage/detailRoom"));
const UserProfile = lazy(() => import("../_HomeTemplete/ProfileUser/index"));

// ✅ Suspense wrapper
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
            message="Chào mừng bạn đến với Lucie Travel"
            description="Đang tải dữ liệu, vui lòng chờ một chút..."
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
  // ✅ Trang chào mừng
  {
    path: "/",
    element: withSuspense(WelcomePage),
  },

  // ✅ Trang chính (home)
  {
    path: "/Home",
    element: withSuspense(HomePage),
    children: [
      { index: true, element: withSuspense(NoiLuuTru) },
      { path: "NoiLuuTru", element: withSuspense(NoiLuuTru) },
      { path: "TraiNghiem", element: withSuspense(TraiNghiem) },
      { path: "DichVu", element: withSuspense(DichVu) },
    ],
  },

  // ✅ Hồ sơ người dùng
  {
    path: "/UserProfile",
    element: withSuspense(UserProfile),
  },

  // ✅ Chi tiết phòng
  {
    path: "/room-detail/:id/:tenViTri",
    element: withSuspense(RoomDetail),
  },

  // ✅ Auth
  {
    path: "/auth",
    element: withSuspense(AuthLayout),
    children: [
      { path: "login", element: withSuspense(Login) },
      { path: "register", element: withSuspense(Register) },
    ],
  },

  // ✅ Admin
  {
    path: "/admin",
    element: withSuspense(AdminPage),
  },

  // ✅ Nếu nhập sai URL → về trang Welcome
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
];
