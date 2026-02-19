import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Typography,
  message,
} from "antd";
import * as actions from "../model/actions";
import * as selectors from "../model/selectors";
import { MenuItemFlat, MenuType } from "../model/types";
import { menuItemSchema } from "../validation/schemas";
import { useZodRules } from "../../../shared";

const { Title, Text } = Typography;

interface MenuItemFormProps {
  visible: boolean;
  activeItem: MenuItemFlat | null;
  activeType: MenuType | null;
  onCancel: () => void;
}

const title = (isEdit: boolean, name: string | null) => {
  return (
    <Title level={3}>
      <span>{name}</span>
      {"  "}
      {isEdit ? (
        <Text type="secondary" italic>
          Ред.
        </Text>
      ) : (
        <Text type="warning" italic>
          New
        </Text>
      )}
    </Title>
  );
};

export const MenuItemForm: React.FC<MenuItemFormProps> = ({
  visible,
  activeItem = null,
  activeType,
  onCancel,
}) => {
  const dispatch = useDispatch();
  const treeList = useSelector(selectors.selectMenuTreeList);
  const [form] = Form.useForm();
  const rules = useZodRules(menuItemSchema);

  useEffect(() => {
    if (visible) {
      if (activeType) {
        if (activeItem) {
          form.setFieldsValue(activeItem);
        } else {
          form.resetFields();
          form.setFieldsValue({
            typeId: activeType.id,
            sort: treeList.length,
            parentId: null,
          });
        }
      } else {
        onCancel();
        message.error("Меню не выбрано");
      }
    }
  }, [visible, activeItem, form, treeList]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      values.typeId = activeType?.id || "";

      if (activeItem) {
        dispatch(
          actions.editMenuItemRequest({
            ...values,
            id: activeItem.id,
          })
        );
      } else {
        dispatch(actions.addMenuItemRequest(values));
      }

      onCancel();
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const parentOptions = [
    { label: "Корневой уровень (null)", value: null },
    ...treeList
      .filter((item) => item.id !== activeItem?.id)
      .map((item) => ({
        label: item.name,
        value: item.id,
      })),
  ];

  return (
    <Modal
      title={title(!!activeItem, activeType?.name!)}
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText={activeItem ? "Обновить" : "Создать"}
      cancelText="Отмена"
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Название" rules={rules.name}>
          <Input placeholder="Введите название" />
        </Form.Item>

        <Form.Item name="parentId" label="Родительский элемент">
          <Select
            placeholder="Выберите родительский элемент"
            options={parentOptions}
            allowClear
          />
        </Form.Item>

        <Form.Item name="url" label="Внешняя ссылка" rules={rules.url}>
          <Input placeholder="https://example.com" />
        </Form.Item>

        <Form.Item name="sort" label="Порядок сортировки" rules={rules.sort}>
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
