import React from "react";
import { Form, Input, Button, Card, Alert } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { loginRequest } from "../model/actions";
import { selectAuthLoading, selectAuthError } from "../model/selectors";
import { loginSchema, LoginFormData } from "../validation/schemas";
import { useIsMobile } from "../../../shared/hooks/useIsMobile";

export const LoginPage: React.FC = () => {
  const dispatch = useDispatch();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const isMobile = useIsMobile();

  const onFinish = (values: LoginFormData) => {
    const result = loginSchema.safeParse(values);
    if (result.success) {
      dispatch(loginRequest(result.data));
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        minHeight: isMobile ? "-webkit-fill-available" : "100vh",
        padding: "16px",
        paddingBottom: "calc(20px + env(safe-area-inset-bottom))",
        background: "var(--ant-color-bg-layout)",
      }}
    >
      <Card
        title="Вход в систему"
        style={{
          width: "100%",
          maxWidth: 400,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        }}
        styles={{
          header: {
            textAlign: "center",
            fontSize: "18px",
            fontWeight: 600,
          },
        }}
      >
        {error && (
          <Alert
            message={error}
            type="error"
            style={{ marginBottom: 16 }}
            showIcon
          />
        )}

        <Form name="login" onFinish={onFinish} autoComplete="off" size="large">
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Введите email" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" type="email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Введите пароль" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Пароль" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Войти
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
