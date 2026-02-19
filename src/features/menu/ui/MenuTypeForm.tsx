import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Modal, Form, Input, Button, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import * as actions from "../model/actions";
import { MenuType } from "../model/types";
import { menuTypeSchema } from "../validation/schemas";
import { useZodRules } from "../../../shared";
import { redirect } from "react-router-dom";

interface MenuTypeFormProps {
  visible: boolean;
  activeType?: MenuType | null;
  onCancel: () => void;
}

export const MenuTypeForm: React.FC<MenuTypeFormProps> = ({
  visible,
  activeType = null /* ссылаемся на то, что при создании нового у нас еще нет никакого MenuType */,
  onCancel,
}) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const rules = useZodRules(menuTypeSchema);

  useEffect(() => {
    if (visible) {
      if (activeType) {
        form.setFieldsValue(activeType);
      } else {
        form.resetFields();
      }
    }
  }, [visible, activeType, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (activeType) {
        dispatch(
          actions.editMenuTypeRequest({
            id: activeType.id,
            ...values,
          })
        );
      } else {
        dispatch(actions.addMenuTypeRequest(values));
      }

      onCancel();
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleDelete = () => {
    if (activeType) {
      dispatch(actions.removeMenuTypeRequest(activeType.id));
      onCancel();
    }
  };

  return (
    <Modal
      title={activeType ? "Редактировать тип меню" : "Добавить тип меню"}
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText={activeType ? "Обновить" : "Создать"}
      cancelText="Отмена"
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
        <Button key="cancel" onClick={onCancel}>
          Отмена
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          {activeType ? "Обновить" : "Создать"}
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="id" label="ID" rules={rules.id}>
          <Input placeholder="Введите ID" disabled={!!activeType} />
        </Form.Item>
        <Form.Item name="name" label="Название" rules={rules.name}>
          <Input placeholder="Введите название" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
