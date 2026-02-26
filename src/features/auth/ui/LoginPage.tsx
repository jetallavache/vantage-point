import React, { useEffect } from "react";
import { Form, Input, Button, Card, Alert } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginRequest, clearAuthFormErrors } from "../model/actions";
import {
  selectAuthValidationErrors,
  selectAuthFormError,
  selectAuthIsSubmitting,
} from "../model/selectors";
import { loginSchema, LoginFormData } from "../validation/schemas";
import { SafeAreaWrapper } from "../../../shared";

export const LoginPage: React.FC = () => {
  const dispatch = useDispatch();
  const validationErrors = useSelector(selectAuthValidationErrors);
  const formError = useSelector(selectAuthFormError);
  const isSubmitting = useSelector(selectAuthIsSubmitting);

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    return () => {
      dispatch(clearAuthFormErrors());
    };
  }, [dispatch]);

  useEffect(() => {
    if (validationErrors) {
      Object.entries(validationErrors).forEach(([field, msg]) => {
        setError(field as keyof LoginFormData, {
          type: "server",
          message: msg,
        });
      });
    }
  }, [validationErrors, setError]);

  const onSubmit = (values: LoginFormData) => {
    dispatch(clearAuthFormErrors());
    clearErrors();
    dispatch(loginRequest(values));
  };

  return (
    <SafeAreaWrapper
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card
        title="Вход в систему"
        style={{
          width: "100%",
          maxWidth: 400,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        }}
      >
        {formError && (
          <Alert
            description={formError}
            type="error"
            closable
            onClose={() => dispatch(clearAuthFormErrors())}
            style={{ marginBottom: 16 }}
          />
        )}

        <Form layout="vertical" onFinish={handleSubmit(onSubmit)} size="large">
          <Form.Item
            validateStatus={errors.email ? "error" : ""}
            help={errors.email?.message}
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  prefix={<UserOutlined />}
                  placeholder="Email"
                  type="email"
                  onChange={(e) => {
                    field.onChange(e);
                    if (validationErrors?.email) {
                      clearErrors("email");
                      dispatch(clearAuthFormErrors());
                    }
                  }}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            validateStatus={errors.password ? "error" : ""}
            help={errors.password?.message}
          >
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  prefix={<LockOutlined />}
                  placeholder="Пароль"
                  onChange={(e) => {
                    field.onChange(e);
                    if (validationErrors?.password || formError) {
                      clearErrors("password");
                      dispatch(clearAuthFormErrors());
                    }
                  }}
                />
              )}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isSubmitting}
              block
            >
              Войти
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </SafeAreaWrapper>
  );
};
