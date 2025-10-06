import React, { useState } from "react";
import { Button, Layout, Menu, theme } from "antd";
import {
  ChevronsLeft,
  ChevronsRight, 
  Users, 
  House,  
  Calendar,
  Hotel,
} from "lucide-react";
import {
  Booking,
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
          <Logo/>
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
         <Menu
          selectedKeys={[selectedKey]}
          onClick={handleMenuClick}
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["2"]}
          items={[           
            { key: "2", icon: <Hotel />, label: "Room Management" },
          
          ]}
        />
          <Menu
          selectedKeys={[selectedKey]}
          onClick={handleMenuClick}
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["3"]}
          items={[           
            { key: "3", icon: <Calendar />, label: "Booking Management" },
          
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
    {selectedKey === "2" && <Room />}
    {selectedKey === "3" && <Booking />}
  </Content>
</Layout>

    </Layout>
  );
};

export default App;
