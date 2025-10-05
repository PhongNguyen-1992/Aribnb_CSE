import React, { useState, useEffect } from "react";
import { Layout, Button, Dropdown, Avatar, message } from "antd";
import { NavLink, useLocation } from "react-router-dom";
import {
  Search,
  User,
  LogOut,
  AlignJustify,
  Globe,
  UserCircle,
  Shield,
} from "lucide-react";
import { userAuthStore } from "../store";
import type { LoginApiResponse } from "../interfaces/auth.interface";
import Logo from "./logo";

const { Header } = Layout;

const AppHeaderInto: React.FC = () => {
  const location = useLocation();
  const { clearUser } = userAuthStore((state: any) => state);
  const [user, setUser] = useState<LoginApiResponse | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const parsedUser: LoginApiResponse = JSON.parse(userStr);
        setUser(parsedUser);
      } catch {
        setUser(null);
      }
    }
  }, []);

  const handleLogout = (): void => {
    clearUser();
    localStorage.removeItem("user");
    setUser(null);
    message.success("Đăng xuất thành công!");
  };

  const avatarMenu = {
    items: [
      {
        key: "profile",
        label: <NavLink to="/profile">Thông tin cá nhân</NavLink>,
        icon: <UserCircle className="h-4 w-4" />,
      },
      ...(user?.role === "ADMIN"
        ? [
            {
              key: "admin",
              label: <NavLink to="/admin">Quản trị hệ thống</NavLink>,
              icon: <Shield className="h-4 w-4" />,
            },
          ]
        : []),
      { type: "divider" as const },
      {
        key: "logout",
        label: "Đăng xuất",
        icon: <LogOut className="h-4 w-4" />,
        onClick: handleLogout,
      },
    ],
  };

  return (
    <Header
      className="!bg-white shadow-md"
      style={{
        padding: 0,
        height: "80px",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <div className="flex items-center justify-between px-6 h-full max-w-screen-2xl mx-auto">
        {/* Logo */}
        <NavLink to="/" className="flex items-center">
          <Logo />
        </NavLink>

        {/* Search Bar - White Background */}
        <div className="hidden md:flex items-center bg-white rounded-full shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-gray-200">
          <div className="px-6 py-3 border-r border-gray-200 hover:bg-gray-50 rounded-l-full transition-colors cursor-pointer group">
            <div className="text-sm font-medium text-gray-800 group-hover:text-gray-900">Địa điểm</div>
          </div>
          <div className="px-6 py-3 border-r border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer group">
            <div className="text-sm font-medium text-gray-800 group-hover:text-gray-900">Nhận phòng</div>
          </div>
          <div className="px-6 py-3 flex items-center gap-3 hover:bg-gray-50 rounded-r-full transition-colors cursor-pointer group">
            <div className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Thêm khách</div>
            <div className="bg-gradient-to-r from-[#FF385C] to-[#E31C5F] p-2.5 rounded-full hover:scale-110 hover:shadow-lg transition-all duration-300 cursor-pointer">
              <Search className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        {/* Right Menu - White Background */}
        <div className="flex items-center gap-3">
          <Button
            type="text"
            className="hidden md:block text-sm font-medium text-white hover:bg-white/20 hover:scale-105 rounded-full px-4 py-2 transition-all duration-300"
          >
            Trở thành host
          </Button>

          <div className="p-2 hover:bg-white/20 rounded-full transition-all duration-300 cursor-pointer hover:scale-110">
            <Globe className="w-5 h-5 text-white" />
          </div>

          {user ? (
            <Dropdown menu={avatarMenu} placement="bottomRight" trigger={["click"]}>
              <div className="flex items-center gap-3 bg-white rounded-full py-2 px-4 hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-gray-300 hover:scale-105">
                <AlignJustify className="w-4 h-4 text-gray-700 hover:text-gray-900 transition-colors" />
                <Avatar
                  size={36}
                  src={user.avatar}
                  icon={<User className="h-5 w-5" />}
                  className="bg-gradient-to-br from-[#FF385C] to-[#E31C5F] border-2 border-white shadow-md"
                />
                <div className="hidden lg:flex flex-col pr-2">
                  <span className="text-sm font-semibold text-gray-900">
                    {user.name || "User"}
                  </span>
                  {user.role === "ADMIN" && (
                    <span className="text-xs text-[#FF385C] font-medium flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      Admin
                    </span>
                  )}
                </div>
              </div>
            </Dropdown>
          ) : (
            <NavLink to="/auth/login">
              <div className="flex items-center gap-2 bg-white rounded-full py-2 px-3 hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-gray-300 hover:scale-105">
                <AlignJustify className="w-4 h-4 text-gray-700" />
                <Avatar
                  size={36}
                  icon={<User className="h-5 w-5" />}
                  className="bg-gradient-to-br from-gray-400 to-gray-600 shadow-md"
                />
              </div>
            </NavLink>
          )}
        </div>
      </div>
    </Header>
  );
};

export default AppHeaderInto;