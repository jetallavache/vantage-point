import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Form, Input, InputNumber, Select, Alert } from "antd";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as actions from "../model/actions";
import * as selectors from "../model/selectors";
import { MenuItemFlat, MenuType } from "../model/types";
import { menuItemFormSchema, MenuItemFormData } from "../validation/schemas";
import { FormTitle } from "../../../shared";

interface MenuItemEditFormProps {
  visible: boolean;
  activeItem: MenuItemFlat | null;
  activeType: MenuType | null;
  onCancel: () => void;
}

export const MenuItemEditForm: React.FC<MenuItemEditFormProps> = ({
  visible,
  activeItem,
  activeType,
  onCancel,
}) => {
  const dispatch = useDispatch();
  const treeList = useSelector(selectors.selectMenuTreeList);
  const validationErrors = useSelector(selectors.selectMenuValidationErrors);
  const formError = useSelector(selectors.selectMenuFormError);
  const isSubmitting = useSelector(selectors.selectMenuIsSubmitting);

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<MenuItemFormData>({
    resolver: zodResolver(menuItemFormSchema),
  });

  useEffect(() => {
    if (visible && activeItem) {
      reset({
        name: activeItem.name,
        parentId: activeItem.parentId,
        url: activeItem.customUrl,
        sort: activeItem.sort,
      });
      dispatch(actions.clearMenuFormErrors());
    }
  }, [visible, activeItem, reset, dispatch]);

  useEffect(() => {
    if (validationErrors) {
      Object.entries(validationErrors).forEach(([field, msg]) => {
        setError(field as keyof MenuItemFormData, {
          type: "server",
          message: msg,
        });
      });
    }
  }, [validationErrors, setError]);

  const onSubmit = (values: MenuItemFormData) => {
    if (!activeType?.id || !activeItem) return;

    dispatch(actions.clearMenuFormErrors());
    clearErrors();

    dispatch(
      actions.editMenuItemRequest({
        ...values,
        typeId: activeType.id,
        id: activeItem.id,
      })
    );
    onCancel();
  };

  const handleCancel = () => {
    dispatch(actions.clearMenuFormErrors());
    onCancel();
  };

  const parentOptions = [
    { label: "Корневой уровень", value: null },
    ...treeList
      .filter((item) => item.id !== activeItem?.id)
      .map((item) => ({
        label: item.name,
        value: item.id,
      })),
  ];

  return (
    <Modal
      title={<FormTitle isEditing={true} name={activeType?.name || "Меню"} />}
      open={visible}
      onOk={handleSubmit(onSubmit)}
      onCancel={handleCancel}
      okText="Обновить"
      cancelText="Отмена"
      confirmLoading={isSubmitting}
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

        <Form.Item label="Родительский элемент">
          <Controller
            name="parentId"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                placeholder="Выберите родительский элемент"
                options={parentOptions}
                allowClear
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Внешняя ссылка"
          validateStatus={errors.url ? "error" : ""}
          help={errors.url?.message}
        >
          <Controller
            name="url"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                value={field.value || ""}
                placeholder="https://example.com"
                onChange={(e) => {
                  field.onChange(e);
                  if (validationErrors?.url) {
                    clearErrors("url");
                    dispatch(actions.clearMenuFormErrors());
                  }
                }}
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Порядок сортировки"
          validateStatus={errors.sort ? "error" : ""}
          help={errors.sort?.message}
        >
          <Controller
            name="sort"
            control={control}
            render={({ field }) => (
              <InputNumber
                {...field}
                min={0}
                style={{ width: "100%" }}
                onChange={(value) => {
                  field.onChange(value);
                  if (validationErrors?.sort) {
                    clearErrors("sort");
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
