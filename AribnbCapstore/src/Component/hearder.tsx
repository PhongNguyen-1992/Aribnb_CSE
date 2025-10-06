import React, { useState, useEffect } from "react";
import { Layout, Button, Dropdown, Avatar, message, Drawer } from "antd";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  Compass,
  Wrench,
  Search,
  User,
  LogOut,
  LogIn, 
  AlignJustify,
  Calendar,
  MapPin,
  Users,
  Star,
  Sparkles,
  Plane,
  Shield,
  UserCircle, 
} from "lucide-react";
import { userAuthStore } from "../store";
import type { LoginApiResponse } from "../interfaces/auth.interface";
import Logo from "./logo";

const { Header } = Layout;

interface MenuItem {
  key: string;
  icon?: React.ReactNode;
  label: React.ReactNode;
  displayIcon?: React.ReactNode;
  to: string; // Add the 'to' property directly to MenuItem
}

interface SearchSection {
  key: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  gradient: string;
}

interface AnimatedSearchBarProps {
  isMobile: boolean;
  onSearch: () => void;
}

// Animated Logo Component inspired by React Bits
const AnimatedLogo: React.FC = () => (
  <div className="flex items-center gap-3 group cursor-pointer">
    <div className="relative">
      <div className="w-12 h-12 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-lg transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
        <Sparkles className="w-6 h-6 text-white animate-pulse" />
      </div>
      {/* Floating particles */}
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-300" />
      <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-500 delay-200" />
    </div>
    <div className="hidden sm:block">
      <h1 className="text-2xl font-bold text-white m-0 tracking-tight bg-gradient-to-r from-white to-blue-100 bg-clip-text transform transition-all duration-300 group-hover:scale-105">
        TravelHub
      </h1>
      <p className="text-xs text-white/90 m-0 font-medium transform transition-all duration-300 group-hover:text-yellow-200 flex items-center gap-1">
        <Plane className="w-3 h-3" />
        Khám phá thế giới
      </p>
    </div>
  </div>
);

// Animated Background Component
const AnimatedBackground: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden">
    {/* Main gradient */}
    <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 via-orange-400 to-yellow-400 animate-gradient-shift" />
    
    {/* Animated mesh gradient */}
    <div 
      className="absolute inset-0 opacity-60"
      style={{
        background: `
          radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.4) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.4) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.4) 0%, transparent 50%)
        `,
        animation: 'meshMove 8s ease-in-out infinite alternate'
      }}
    />
    
    {/* Floating orbs */}
    <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-float" />
    <div className="absolute top-10 right-32 w-20 h-20 bg-yellow-300/20 rounded-full blur-xl animate-float-delay-1" />
    <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-pink-300/20 rounded-full blur-xl animate-float-delay-2" />
    <div className="absolute bottom-32 right-20 w-16 h-16 bg-blue-300/20 rounded-full blur-lg animate-bounce" />
  </div>
);

// Animated Search Bar inspired by React Bits
const AnimatedSearchBar: React.FC<AnimatedSearchBarProps> = ({ isMobile, onSearch }) => {
  const [focused, setFocused] = useState<string | null>(null);
  
  if (isMobile) {
    return (
      <div className="px-4 pb-6">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-5 shadow-2xl border border-white/40 transform transition-all duration-500 hover:scale-[1.02]">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
              <Search className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-lg font-bold text-gray-800 m-0">Tìm kiếm điểm đến</p>
              <p className="text-sm text-gray-600 m-0">Khám phá những nơi tuyệt vời</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-4 border-2 border-transparent hover:border-purple-200 transition-all duration-300 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-600">Bất kỳ tuần nào</span>
              <span className="text-gray-300">•</span>
              <Users className="w-4 h-4 text-purple-500" />
              <span className="text-sm text-gray-600">Thêm khách</span>
            </div>
            <Button
              type="primary"
              shape="circle"
              icon={<Search className="w-5 h-5" />}
              onClick={onSearch}
              size="large"
              className="bg-gradient-to-r from-pink-500 to-red-500 border-0 shadow-xl hover:shadow-2xl transform transition-all duration-300 hover:scale-110 w-14 h-14"
            />
          </div>
        </div>
      </div>
    );
  }

  const searchSections: SearchSection[] = [
    { 
      key: 'location', 
      icon: <MapPin className="w-5 h-5 text-pink-500" />, 
      title: 'Địa điểm', 
      subtitle: 'Tìm kiếm điểm đến',
      gradient: 'from-pink-100 to-rose-100'
    },
    { 
      key: 'checkin', 
      icon: <Calendar className="w-5 h-5 text-blue-500" />, 
      title: 'Nhận phòng', 
      subtitle: 'Thêm ngày',
      gradient: 'from-blue-100 to-sky-100'
    },
    { 
      key: 'checkout', 
      icon: <Calendar className="w-5 h-5 text-green-500" />, 
      title: 'Trả phòng', 
      subtitle: 'Thêm ngày',
      gradient: 'from-green-100 to-emerald-100'
    },
    { 
      key: 'guests', 
      icon: <Users className="w-5 h-5 text-purple-500" />, 
      title: 'Khách', 
      subtitle: 'Thêm khách',
      gradient: 'from-purple-100 to-violet-100'
    }
  ];

  return (
    <div className="flex justify-center pb-8 px-6">
      <div className="bg-white/95 backdrop-blur-2xl rounded-full p-3 flex items-center shadow-2xl border border-white/40 w-full max-w-5xl transform transition-all duration-500 hover:shadow-3xl hover:scale-[1.02]">
        {searchSections.map((section, index) => (
          <div
            key={section.key}
            className={`flex-1 px-6 py-5 cursor-pointer transition-all duration-300 group relative overflow-hidden ${
              index === 0 ? 'rounded-l-full' : index === searchSections.length - 1 ? 'rounded-r-full' : ''
            } ${index < searchSections.length - 1 ? 'border-r border-gray-200' : ''} ${
              focused === section.key ? `bg-gradient-to-br ${section.gradient} transform scale-105 shadow-lg z-10` : 'hover:bg-gray-50/80'
            }`}
            onMouseEnter={() => setFocused(section.key)}
            onMouseLeave={() => setFocused(null)}
          >
            {/* Animated background on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${section.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
              index === 0 ? 'rounded-l-full' : index === searchSections.length - 1 ? 'rounded-r-full' : ''
            }`} />
            
            <div className="relative z-10 flex items-center gap-3">
              <div className="transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                {section.icon}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800 m-0 group-hover:text-gray-900 transition-colors duration-300">
                  {section.title}
                </p>
                <p className="text-sm text-gray-600 m-0 group-hover:text-gray-700 transition-colors duration-300">
                  {section.subtitle}
                </p>
              </div>
            </div>

            {/* Ripple effect */}
            {focused === section.key && (
              <div className="absolute inset-0 animate-ping bg-white/20 rounded-full" />
            )}
          </div>
        ))}
        
        {/* Animated Search Button */}
        <div className="pl-4 pr-2">
          <Button
            type="primary"
            shape="circle"
            size="large"
            icon={<Search className="w-6 h-6" />}
            onClick={onSearch}
            className="bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 border-0 shadow-xl hover:shadow-2xl transform transition-all duration-300 hover:scale-110 hover:rotate-12 w-16 h-16 flex items-center justify-center animate-pulse hover:animate-none"
          />
        </div>
      </div>
    </div>
  );
};

// Main Component
const TravelHubLogo = AnimatedLogo;

const AppHeader: React.FC = () => {
  const location = useLocation();
  const { clearUser } = userAuthStore((state: any) => state);
  const [user, setUser] = useState<LoginApiResponse | null>(null);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);

  // Check mobile and scroll
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    const handleScroll = () => setScrolled(window.scrollY > 50);
    
    checkMobile();
    handleScroll();
    
    window.addEventListener('resize', checkMobile);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
    setDrawerVisible(false);
  };

  const avatarMenu = {
    items: [
      {
        key: "profile",
        label: <NavLink to="/UserProfile">Thông tin cá nhân</NavLink>,
        icon: <UserCircle className="h-4 w-4 text-blue-500" />,
      },
      ...(user?.role === "ADMIN" ? [{
        key: "admin",
        label: <NavLink to="/admin">Quản trị hệ thống</NavLink>,
        icon: <Shield className="h-4 w-4 text-green-500" />,
      }] : []),
      { type: "divider" as const },
      {
        key: "logout",
        label: "Đăng xuất",
        icon: <LogOut className="h-4 w-4 text-red-500" />,
        onClick: handleLogout,
      },
    ]
  };

  // Create separate mobile menu items with proper typing
  const mobileMenuItems = [
    {
      key: "profile",
      label: "Thông tin cá nhân",
      icon: <UserCircle className="h-4 w-4 text-blue-500" />,
      to: "/profile"
    },
    ...(user?.role === "ADMIN" ? [{
      key: "admin",
      label: "Quản trị hệ thống",
      icon: <Shield className="h-4 w-4 text-green-500" />,
      to: "/admin"
    }] : []),
  ];

  const currentKey = location.pathname.split("/")[1] || "NoiLuuTru";

  const menuItems: MenuItem[] = [
    {
      key: "NoiLuuTru",
      icon: <Home size={20} />,
      label: "Nơi Lưu Trú",
      displayIcon: <Home className="w-5 h-5" />,
      to: "/NoiLuuTru"
    },
    {
      key: "TraiNghiem",
      icon: <Compass size={20} />,
      label: "Trải Nghiệm",
      displayIcon: <Compass className="w-5 h-5" />,
      to: "/TraiNghiem"
    },
    {
      key: "DichVu",
      icon: <Wrench size={20} />,
      label: "Dịch Vụ",
      displayIcon: <Wrench className="w-5 h-5" />,
      to: "/DichVu"
    },
  ];

  const handleSearch = (): void => {
    message.info("Tính năng tìm kiếm đang được phát triển!");
  };

  return (
    <>
      <Header 
        className={`relative overflow-hidden transition-all duration-700 ${
          scrolled ? 'backdrop-blur-xl bg-white/10' : ''
        }`} 
        style={{ padding: 0, height: 'auto', position: 'sticky', top: 0, zIndex: 1000 }}
      >
        <AnimatedBackground />

        {/* Main Header Content */}
        <div className="relative z-20">
          {/* Desktop Header */}
          {!isMobile && (
            <>
              <div className="flex items-center justify-between px-4 py-3 container mx-auto">
                <Logo/>

                {/* Animated Navigation */}
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full p-2 border border-white/20">
                  {menuItems.map((item) => (
                    <NavLink key={item.key} to={item.to}>
                      <div className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105 ${
                        currentKey === item.key 
                          ? 'bg-white/25 shadow-lg text-white backdrop-blur-sm' 
                          : 'text-white/90 hover:bg-white/15 hover:text-white'
                      }`}>
                        {item.displayIcon}
                        <span className="font-semibold text-sm">
                          {item.label}
                        </span>
                        {currentKey === item.key && (
                          <Star className="w-4 h-4 text-yellow-300 animate-pulse" />
                        )}
                      </div>
                    </NavLink>
                  ))}
                </div>

                {/* Enhanced Auth Section */}
                <div className="flex items-center gap-4">
                  {user ? (
                    <Dropdown menu={avatarMenu} placement="bottomRight" arrow trigger={["click"]}>
                      <div className="flex items-center gap-3 cursor-pointer hover:bg-white/15 p-4 rounded-2xl transition-all duration-300 backdrop-blur-sm border border-white/20 transform hover:scale-105">
                        <Avatar
                          size={50}
                          src={user.avatar}
                          icon={<User className="h-6 w-6" />}
                          className="bg-gradient-to-br from-blue-500 to-purple-500 border-3 border-white/40 shadow-xl animate-pulse"
                        />
                        <div className="hidden lg:block text-white">
                          <p className="text-sm opacity-90 m-0 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            Xin chào!
                          </p>
                          <p className="text-lg font-bold m-0">{user.name || "User"}</p>
                          {user.role === "ADMIN" && (
                            <span className="text-xs bg-gradient-to-r from-yellow-400 to-orange-400 text-yellow-900 px-3 py-1 rounded-full font-bold shadow-md animate-bounce flex items-center gap-1 w-fit">
                              <Shield className="w-3 h-3" />
                              Admin
                            </span>
                          )}
                        </div>
                      </div>
                    </Dropdown>
                  ) : (
                    <NavLink to="/auth/login">
                      <Button
                        type="primary"
                        icon={<LogIn className="h-5 w-5" />}
                        size="large"
                        className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 border-0 hover:from-blue-600 hover:via-purple-700 hover:to-pink-600 shadow-xl hover:shadow-2xl transition-all duration-300 font-bold rounded-2xl transform hover:scale-110 px-8 py-3 text-lg animate-pulse hover:animate-none"
                      >
                         Đăng Nhập
                      </Button>
                    </NavLink>
                  )}
                </div>
              </div>

              <AnimatedSearchBar isMobile={false} onSearch={handleSearch} />
            </>
          )}

          {/* Mobile Header */}
          {isMobile && (
            <>
              <div className="flex items-center justify-between px-6 py-5">
                <Logo />
                <Button
                  type="text"
                  icon={<AlignJustify className="w-7 h-7 text-white" />}
                  onClick={() => setDrawerVisible(true)}
                  className="text-white hover:bg-white/20 border-0 rounded-2xl transform transition-all duration-300 hover:scale-110 hover:rotate-12 p-3"
                  size="large"
                />
              </div>
              <AnimatedSearchBar isMobile={true} onSearch={handleSearch} />
            </>
          )}
        </div>

        {/* Enhanced CSS Animations */}
        <style>{`
          @keyframes gradient-shift {
            0%, 100% { 
              background: linear-gradient(45deg, #667eea, #764ba2, #f093fb, #f5576c);
            }
            25% { 
              background: linear-gradient(45deg, #764ba2, #f093fb, #f5576c, #667eea);
            }
            50% { 
              background: linear-gradient(45deg, #f093fb, #f5576c, #667eea, #764ba2);
            }
            75% { 
              background: linear-gradient(45deg, #f5576c, #667eea, #764ba2, #f093fb);
            }
          }
          
          @keyframes meshMove {
            0% { transform: translate(0, 0) rotate(0deg); }
            100% { transform: translate(50px, -30px) rotate(180deg); }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px) translateX(0px); }
            25% { transform: translateY(-20px) translateX(10px); }
            50% { transform: translateY(-10px) translateX(-5px); }
            75% { transform: translateY(-15px) translateX(5px); }
          }
          
          @keyframes float-delay-1 {
            0%, 100% { transform: translateY(0px) translateX(0px) scale(1); }
            33% { transform: translateY(-15px) translateX(-10px) scale(1.1); }
            66% { transform: translateY(-25px) translateX(15px) scale(0.9); }
          }
          
          @keyframes float-delay-2 {
            0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
            50% { transform: translateY(-30px) translateX(20px) rotate(180deg); }
          }
          
          .animate-gradient-shift { animation: gradient-shift 6s ease-in-out infinite; }
          .animate-float { animation: float 6s ease-in-out infinite; }
          .animate-float-delay-1 { animation: float-delay-1 8s ease-in-out infinite; }
          .animate-float-delay-2 { animation: float-delay-2 10s ease-in-out infinite; }
        `}</style>
      </Header>

      {/* Enhanced Mobile Drawer */}
      <Drawer
        title={
          <div className="flex items-center gap-4">
            <TravelHubLogo />
          </div>
        }
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        className="mobile-drawer"
        width={320}
        styles={{
          header: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderBottom: 'none',
            padding: '20px'
          },
          body: {
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            padding: 0
          }
        }}
      >
        <div className="p-6 space-y-6">
          {/* Enhanced User Info */}
          {user ? (
            <div className="bg-white/25 backdrop-blur-md rounded-3xl p-6 border border-white/30 shadow-xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <Avatar
                    size={70}
                    src={user.avatar}
                    icon={<User className="h-8 w-8" />}
                    className="bg-gradient-to-br from-blue-500 to-purple-500 border-4 border-white/50 shadow-xl"
                  />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full border-2 border-white animate-pulse" />
                </div>
                <div className="text-white">
                  <p className="text-sm opacity-90 m-0 font-medium flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Xin chào!
                  </p>
                  <p className="text-xl font-bold m-0">{user.name || "User"}</p>
                  {user.role === "ADMIN" && (
                    <span className="inline-block text-xs bg-gradient-to-r from-yellow-400 to-orange-400 text-yellow-900 px-3 py-1 rounded-full font-bold shadow-lg animate-bounce mt-2 flex items-center gap-1 w-fit">
                      <Shield className="w-3 h-3" />
                      Quản trị viên
                    </span>
                  )}
                </div>
              </div>
              
              <div className="space-y-3">
                {mobileMenuItems.map((item) => (
                  <NavLink key={item.key} to={item.to} onClick={() => setDrawerVisible(false)}>
                    <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/20 transition-all duration-300 text-white cursor-pointer transform hover:scale-105">
                      {item.icon}
                      <span className="font-semibold">{item.label}</span>
                    </div>
                  </NavLink>
                ))}
                
                <div 
                  className="flex items-center gap-4 p-4 rounded-2xl hover:bg-red-500/20 transition-all duration-300 text-white cursor-pointer transform hover:scale-105 border-t border-white/20 mt-4 pt-4"
                  onClick={handleLogout}
                >
                  <LogOut className="w-5 h-5 text-red-400" />
                  <span className="font-semibold">Đăng xuất</span>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <NavLink to="/auth/login" onClick={() => setDrawerVisible(false)}>
                <Button
                  type="primary"
                  icon={<LogIn className="h-6 w-6" />}
                  size="large"
                  block
                  className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 border-0 shadow-xl font-bold rounded-3xl h-16 text-lg transform transition-all duration-300 hover:scale-105"
                >
                   Đăng Nhập
                </Button>
              </NavLink>
            </div>
          )}
        </div>
      </Drawer>
    </>
  );
};

export default AppHeader;