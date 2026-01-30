import React, { useState } from "react";
import { Layout, Menu, Button, Drawer, Typography } from "antd";
import {
  FileTextOutlined,
  UserOutlined,
  TagOutlined,
  LogoutOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../features/auth/model/actions";
import { useIsMobile } from "../hooks/useIsMobile";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const isMobile = useIsMobile();

  const menuItems = [
    {
      key: "/posts",
      icon: <FileTextOutlined />,
      label: "Посты",
    },
    {
      key: "/authors",
      icon: <UserOutlined />,
      label: "Авторы",
    },
    {
      key: "/tags",
      icon: <TagOutlined />,
      label: "Теги",
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
    if (isMobile) {
      setDrawerVisible(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const renderMenu = () => (
    <Menu
      theme={isMobile ? "light" : "dark"}
      mode="inline"
      selectedKeys={[location.pathname]}
      items={menuItems}
      onClick={handleMenuClick}
      style={{
        fontSize: "16px",
        fontWeight: 500,
      }}
    />
  );

  return (
    <Layout style={{ height: "100vh", overflow: "hidden" }}>
      {!isMobile && (
        <Sider theme="dark" width={200}>
          <div
            style={{
              height: 64,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "20px",
              fontWeight: "bold",
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            Vantage Point
          </div>
          {renderMenu()}
        </Sider>
      )}

      <Layout
        style={{ height: "100vh", display: "flex", flexDirection: "column" }}
      >
        <Header
          style={{
            background: "#fff",
            padding: "0 16px",
            display: "flex",
            justifyContent: isMobile ? "space-between" : "flex-end",
            alignItems: "center",
            borderBottom: "1px solid #f0f0f0",
            flexShrink: 0,
          }}
        >
          {isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={() => setDrawerVisible(true)}
                size="large"
              />
              <Title level={4} style={{ margin: 0, fontSize: "18px" }}>
                Vantage Point
              </Title>
            </div>
          )}
          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            size="large"
            style={{ fontSize: "16px" }}
          >
            Выйти
          </Button>
        </Header>

        <Content
          style={{
            margin: isMobile ? "2px" : "16px",
            padding: isMobile ? "4px" : "24px",
            background: "#fff",
            borderRadius: "8px",
            overflow: "auto",
            flex: 1,
          }}
        >
          {children}
        </Content>
      </Layout>

      {isMobile && (
        <Drawer
          title={
            <Title level={4} style={{ margin: 0, fontSize: "18px" }}>
              Vantage Point
            </Title>
          }
          placement="left"
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          styles={{ body: { padding: 0 } }}
        >
          {renderMenu()}
        </Drawer>
      )}
    </Layout>
  );
};
