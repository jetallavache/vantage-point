import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Form, Input, Button, Popconfirm, Alert } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as actions from "../model/actions";
import { MenuType } from "../model/types";
import { menuTypeSchema, MenuTypeFormData } from "../validation/schemas";
import {
  selectMenuValidationErrors,
  selectMenuFormError,
  selectMenuIsSubmitting,
} from "../model/selectors";
import { FormTitle } from "../../../shared";

interface MenuTypeFormProps {
  visible: boolean;
  activeType?: MenuType | null;
  onCancel: () => void;
}

export const MenuTypeForm: React.FC<MenuTypeFormProps> = ({
  visible,
  activeType = null,
  onCancel,
}) => {
  const dispatch = useDispatch();
  const validationErrors = useSelector(selectMenuValidationErrors);
  const formError = useSelector(selectMenuFormError);
  const isSubmitting = useSelector(selectMenuIsSubmitting);

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<MenuTypeFormData>({
    resolver: zodResolver(menuTypeSchema),
  });

  useEffect(() => {
    if (visible) {
      if (activeType) {
        reset({ id: activeType.id, name: activeType.name });
      } else {
        reset({ id: "", name: "" });
      }
      dispatch(actions.clearMenuFormErrors());
    }
  }, [visible, activeType, reset, dispatch]);

  useEffect(() => {
    if (validationErrors) {
      Object.entries(validationErrors).forEach(([field, msg]) => {
        setError(field as keyof MenuTypeFormData, {
          type: "server",
          message: msg,
        });
      });
    }
  }, [validationErrors, setError]);

  const onSubmit = (values: MenuTypeFormData) => {
    dispatch(actions.clearMenuFormErrors());
    clearErrors();

    if (activeType) {
      dispatch(actions.editMenuTypeRequest(values));
    } else {
      dispatch(actions.addMenuTypeRequest(values));
    }

    onCancel();
  };

  const handleDelete = () => {
    if (activeType) {
      dispatch(actions.removeMenuTypeRequest(activeType.id));
      onCancel();
    }
  };

  const handleCancel = () => {
    dispatch(actions.clearMenuFormErrors());
    onCancel();
  };

  return (
    <Modal
      title={
        <FormTitle
          isEditing={!!activeType}
          name={activeType?.name || "Тип меню"}
        />
      }
      open={visible}
      onOk={handleSubmit(onSubmit)}
      onCancel={handleCancel}
      okText={activeType ? "Обновить" : "Создать"}
      cancelText="Отмена"
      confirmLoading={isSubmitting}
      footer={[
        activeType && (
          <Popconfirm
            key="delete"
            title="Удалить тип меню?"
            description="Это действие нельзя отменить"
            onConfirm={handleDelete}
            okText="Да"
            cancelText="Нет"
          >
            <Button danger icon={<DeleteOutlined />}>
              Удалить
            </Button>
          </Popconfirm>
        ),
        <Button key="cancel" onClick={handleCancel}>
          Отмена
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit(onSubmit)}
          loading={isSubmitting}
        >
          {activeType ? "Обновить" : "Создать"}
        </Button>,
      ]}
    >
      {formError && (
        <Alert
          description={formError}
          type="error"
          closable={{ onClose: () => dispatch(actions.clearMenuFormErrors()) }}
          style={{ marginBottom: 16 }}
        />
      )}
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Form.Item
          label="ID"
          validateStatus={errors.id ? "error" : ""}
          help={errors.id?.message}
        >
          <Controller
            name="id"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Введите ID"
                disabled={!!activeType}
                onChange={(e) => {
                  field.onChange(e);
                  if (validationErrors?.id) {
                    clearErrors("id");
                    dispatch(actions.clearMenuFormErrors());
                  }
                }}
              />
            )}
          />
        </Form.Item>
        <Form.Item
          label="Название"
          validateStatus={errors.name ? "error" : ""}
          help={errors.name?.message}
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Введите название"
                onChange={(e) => {
                  field.onChange(e);
                  if (validationErrors?.name) {
                    clearErrors("name");
                    dispatch(actions.clearMenuFormErrors());
                  }
                }}
              />
            )}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
