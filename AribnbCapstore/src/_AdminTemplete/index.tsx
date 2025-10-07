import React, { useState } from "react";
import { Button, Layout, Menu, theme } from "antd";
import {
  ChevronsLeft,
  ChevronsRight, 
  Users, 
  House,  
  Calendar,
  Hotel,
  MessageCircle,
} from "lucide-react";
import {
  Booking,
  ReviewManagement,
  Room,
  UsersManagement,
} from "./Content/_index";
import { useNavigate } from "react-router-dom";
import Logo from "../Component/logo";

const { Sider, Content } = Layout;

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [selectedKey, setSelectedKey] = useState("1");
  const navigate = useNavigate();

  const handleMenuClick = (e: any) => {
    setSelectedKey(e.key);
  };

  const handleGoHome = () => {
    navigate("/Home");
  };

  const menuItems = [
    { key: "1", icon: <Users size={20} />, label: "Users Management" },
    { key: "2", icon: <Hotel size={20} />, label: "Room Management" },
    { key: "3", icon: <Calendar size={20} />, label: "Booking Management" },
    { key: "4", icon: <MessageCircle size={20} />, label: "Review Management" },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={280}
        collapsedWidth={80}
        style={{
          background: "linear-gradient(180deg, #001529 0%, #002140 100%)",
          boxShadow: "2px 0 8px rgba(0,0,0,0.15)",
        }}
      >
        {/* Logo Section - Only show when not collapsed */}
        {!collapsed && (
          <div
            style={{
              padding: "24px 20px",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              marginBottom: "16px",
              transition: "all 0.3s",
            }}
          >
            <div className="text-center">
              <Logo />
            </div>
            <div
              style={{
                color: "rgba(255,255,255,0.65)",
                fontSize: "12px",
                textAlign: "center",
                marginTop: "8px",
                fontWeight: 500,
                letterSpacing: "0.5px",
              }}
            >
              ADMIN DASHBOARD
            </div>
          </div>
        )}

        {/* Menu Items */}
        <div style={{ padding: collapsed ? "20px 8px" : "0 12px" }}>
          <Menu
            selectedKeys={[selectedKey]}
            onClick={handleMenuClick}
            theme="dark"
            mode="inline"
            items={menuItems}
            inlineCollapsed={collapsed}
            style={{
              background: "transparent",
              border: "none",
            }}
            className="custom-menu"
          />
        </div>

        {/* Bottom Actions */}
        <div
          style={{
            position: "absolute",
            bottom: "24px",
            width: "100%",
            padding: "0 16px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {/* Divider */}
          <div
            style={{
              height: "1px",
              background: "rgba(255,255,255,0.1)",
              margin: "0 0 12px 0",
            }}
          />

          {/* Collapse Button */}
          <Button
            type="text"
            onClick={() => setCollapsed(!collapsed)}
            style={{
              width: "100%",
              height: "40px",
              color: "rgba(255,255,255,0.85)",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.15)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.08)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
            }}
          >
            {collapsed ? (
              <ChevronsRight size={18} />
            ) : (
              <>
                <ChevronsLeft size={18} />
                <span>Thu gọn</span>
              </>
            )}
          </Button>

          {/* Home Button */}
          <Button
            danger
            type="primary"
            icon={<House size={18} />}
            onClick={handleGoHome}
            style={{
              width: "100%",
              height: "44px",
              borderRadius: "8px",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              boxShadow: "0 2px 8px rgba(255,77,79,0.3)",
            }}
          >
            {!collapsed && "Quay Về Home"}
          </Button>
        </div>
      </Sider>

      <Layout>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {/* Logo hiển thị trong content khi sidebar collapsed */}
          {collapsed && (
            <div style={{ 
              marginBottom: "24px",
              paddingBottom: "16px",
              borderBottom: "1px solid #f0f0f0"
            }}>
              <Logo />
            </div>
          )}
          
          {selectedKey === "1" && <UsersManagement />}
          {selectedKey === "2" && <Room />}
          {selectedKey === "3" && <Booking />}
          {selectedKey === "4" && <ReviewManagement />}
        </Content>
      </Layout>

      {/* Custom CSS */}
      <style>{`
        .custom-menu .ant-menu-item {
          margin: 4px 0 !important;
          border-radius: 8px !important;
          height: 48px !important;
          line-height: 48px !important;
          transition: all 0.3s !important;
          display: flex !important;
          align-items: center !important;
        }

        .custom-menu .ant-menu-item:hover {
          background: rgba(255,255,255,0.1) !important;
        }

        .custom-menu .ant-menu-item-selected {
          background: linear-gradient(90deg, #1890ff 0%, #096dd9 100%) !important;
          box-shadow: 0 2px 8px rgba(24,144,255,0.3) !important;
        }

        .custom-menu .ant-menu-item .ant-menu-item-icon {
          font-size: 20px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }

        .custom-menu .ant-menu-item-selected .ant-menu-item-icon,
        .custom-menu .ant-menu-item-selected span {
          color: #fff !important;
          font-weight: 500 !important;
        }

        /* Collapsed state - Fix icon alignment */
        .ant-layout-sider-collapsed .custom-menu .ant-menu-item {
          padding: 0 calc(50% - 20px / 2) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }

        .ant-layout-sider-collapsed .custom-menu .ant-menu-item .ant-menu-item-icon {
          margin: 0 !important;
        }

        .ant-layout-sider-collapsed .custom-menu .ant-menu-item .ant-menu-title-content {
          display: none !important;
        }
      `}</style>
    </Layout>
  );
};

export default App;