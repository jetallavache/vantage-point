import React, { useState, useEffect } from "react";
import {
  Layout,
  Menu,
  Button,
  Drawer,
  Typography,
  Badge,
  Space,
  Modal,
  Descriptions,
  Tag,
} from "antd";
import {
  FileTextOutlined,
  UserOutlined,
  TagOutlined,
  LogoutOutlined,
  MenuOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, fetchProfileRequest } from "../../features/auth/model/actions";
import { selectPostsTotal } from "../../features/posts/model/selectors";
import { selectUserProfile } from "../../features/auth/model/selectors";
import { useIsMobile } from "../hooks/useIsMobile";

const { Header, Sider, Content } = Layout;
const { Title, Text, Link } = Typography;

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const isMobile = useIsMobile();
  const postsTotal = useSelector(selectPostsTotal);
  const profile = useSelector(selectUserProfile);

  useEffect(() => {
    dispatch(fetchProfileRequest());
  }, [dispatch]);

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
    {
      key: "/menu",
      icon: <AppstoreOutlined />,
      label: "Меню",
    },
  ].map((item) =>
    item.key === "/posts"
      ? {
          ...item,
          label: (
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {item.label}
              <Badge
                count={postsTotal}
                overflowCount={999}
                style={{ backgroundColor: "#52c41a" }}
              />
            </span>
          ),
        }
      : item
  );

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
      style={
        isMobile
          ? {
              fontSize: "16px",
              color: "rgba(0, 0, 0, 0.88)",
            }
          : {
              fontSize: "16px",
              fontWeight: 500,
            }
      }
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
          <Space size="middle">
            {profile && (
              <Link
                onClick={() => setProfileModalVisible(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: "14px",
                }}
              >
                <UserOutlined />
                {!isMobile && (
                  <span>
                    {profile.name} {profile.lastName}
                  </span>
                )}
              </Link>
            )}
            <Button
              type="text"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              size="large"
              style={{ fontSize: "16px" }}
            >
              {!isMobile && "Выйти"}
            </Button>
          </Space>
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
          size={210}
        >
          {renderMenu()}
        </Drawer>
      )}

      {profile && (
        <Modal
          title={
            <Space>
              <UserOutlined />
              <span>Профиль пользователя</span>
            </Space>
          }
          open={profileModalVisible}
          onCancel={() => setProfileModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setProfileModalVisible(false)}>
              Закрыть
            </Button>,
          ]}
          width={600}
        >
          <Descriptions column={1} bordered>
            <Descriptions.Item label="ID">{profile.id}</Descriptions.Item>
            <Descriptions.Item label="Имя">{profile.name}</Descriptions.Item>
            <Descriptions.Item label="Фамилия">
              {profile.lastName}
            </Descriptions.Item>
            <Descriptions.Item label="Отчество">
              {profile.secondName || "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Email">{profile.email}</Descriptions.Item>
            <Descriptions.Item label="Телефон">
              {profile.phone || "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Статус">
              <Tag color={profile.isActive ? "green" : "red"}>
                {profile.isActive ? "Активен" : "Неактивен"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Создан">
              {new Date(profile.createdAt).toLocaleString("ru-RU")}
            </Descriptions.Item>
            <Descriptions.Item label="Обновлен">
              {new Date(profile.updatedAt).toLocaleString("ru-RU")}
            </Descriptions.Item>
          </Descriptions>
        </Modal>
      )}
    </Layout>
  );
};
