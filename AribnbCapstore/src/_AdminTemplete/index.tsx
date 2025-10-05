import React, { useState } from "react";
import { Button, Layout, Menu, theme } from "antd";
import {
  ChevronsLeft,
  ChevronsRight, 
  Users, 
  House,
} from "lucide-react";
import {
  UsersManagement,
} from "./Content/_index";
import { useNavigate } from "react-router-dom";

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
    // Thoát về home luôn, không popup nữa
    navigate("/");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={260}
        collapsedWidth={120}
      >
        <div className="text-center font-bold uppercase leading-tight">
          <div className="text-xl bg-gradient-to-r from-[#ff9a9e] via-[#fbc2eb] to-[#c2e9fb] bg-clip-text text-transparent drop-shadow-md p-4">
            AIR{" "}
            <span className="text-xl bg-gradient-to-r from-[#ff512f] via-[#dd2476] to-[#ff512f] bg-clip-text text-transparent drop-shadow">
              BNB
            </span>
          </div>
        </div>

        <Menu
          selectedKeys={[selectedKey]}
          onClick={handleMenuClick}
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[           
            { key: "1", icon: <Users />, label: "Users Management" },
          
          ]}
        />

        <div
          style={{
            position: "absolute",
            bottom: "100px",
            width: "100%",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: "12px", // khoảng cách giữa 2 nút
            alignItems: "center",
          }}
        >
          <Button
            type="primary"
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: "12px", width: "80%" }}
          >
            {collapsed ? <ChevronsRight /> : <ChevronsLeft />}
          </Button>

          <Button
            danger
            type="primary"
            icon={<House />}
            onClick={handleGoHome}
            style={{ width: "80%" }}
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
          {selectedKey === "1" && <UsersManagement />}
         
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
