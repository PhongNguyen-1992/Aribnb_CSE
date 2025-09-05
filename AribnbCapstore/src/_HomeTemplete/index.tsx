import React from "react";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import { HomeOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { HandPlatter } from "lucide-react";

const { Header, Content, Footer } = Layout;

const items = [
  {
    key: "1",
    label: (
      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <HomeOutlined /> Nơi Lưu Trú
      </span>
    ),
  },
  {
    key: "2",
    label: (
      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <InfoCircleOutlined /> Trải Nghiệm
      </span>
    ),
  },
  {
    key: "3",
    label: (
      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <HandPlatter size={16} /> Dịch Vụ
      </span>
    ),
  },
];

const App: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#fff",
        }}
      >
        <Menu
          theme="light"
          mode="horizontal"
          defaultSelectedKeys={["1"]}
          items={items}
          style={{ flex: 1, display: "flex", justifyContent: "center" }}
        />
      </Header>

      <Content style={{ padding: "0 48px" }}>
        <Breadcrumb
          style={{ margin: "16px 0" }}
          items={[{ title: "Home" }, { title: "Nơi Lưu Trú" }]}
        />
        <div
          style={{
            padding: 24,
            minHeight: 380,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          Content
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Ant Design ©{new Date().getFullYear()} Created by Ant UED
      </Footer>
    </Layout>
  );
};

export default App;
