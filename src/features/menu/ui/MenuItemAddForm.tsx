import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Alert,
  Row,
  Col,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as actions from "../model/actions";
import * as selectors from "../model/selectors";
import { MenuType } from "../model/types";
import { menuItemFormSchema, MenuItemFormData } from "../validation/schemas";
import { useIsMobile } from "../../../shared/hooks";

interface MenuItemAddFormProps {
  activeType: MenuType | null;
}

export const MenuItemAddForm: React.FC<MenuItemAddFormProps> = ({
  activeType,
}) => {
  const dispatch = useDispatch();
  const treeList = useSelector(selectors.selectMenuTreeList);
  const validationErrors = useSelector(selectors.selectMenuValidationErrors);
  const formError = useSelector(selectors.selectMenuFormError);
  const isSubmitting = useSelector(selectors.selectMenuIsSubmitting);
  const isMobile = useIsMobile();

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<MenuItemFormData>({
    resolver: zodResolver(menuItemFormSchema),
    defaultValues: {
      name: "",
      parentId: null,
      url: "",
      sort: 0,
    },
  });

  useEffect(() => {
    if (activeType) {
      reset({
        name: "",
        parentId: null,
        url: "",
        sort: treeList.length,
      });
    }
  }, [activeType, treeList.length, reset]);

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
    if (!activeType?.id) return;

    dispatch(actions.clearMenuFormErrors());
    clearErrors();

    dispatch(
      actions.addMenuItemRequest({
        ...values,
        typeId: activeType.id,
      })
    );

    reset({
      name: "",
      parentId: null,
      url: "",
      sort: treeList.length + 1,
    });
  };

  if (!activeType) return null;

  const parentOptions = [
    { label: "Корневой уровень", value: null },
    ...treeList.map((item) => ({
      label: item.name,
      value: item.id,
    })),
  ];

  return (
    <div
      style={
        isMobile
          ? {
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 100,
              backgroundColor: "#fafafa",
              padding: "16px 16px 0 16px",
              maxHeight: "50vh",
              overflowY: "auto",
            }
          : {
              backgroundColor: "#fafafa",
              padding: "16px",
              height: "100%",
            }
      }
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
        <Row gutter={8}>
          <Col xs={12} lg={24}>
            <Form.Item
              label="Название"
              validateStatus={errors.name ? "error" : ""}
              help={errors.name?.message}
              style={{ textAlign: "left" }}
            >
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    size={isMobile ? "small" : "middle"}
                    placeholder="Введите название"
                    style={{ fontSize: "16px" }}
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
          </Col>

          <Col xs={12} lg={24}>
            <Form.Item
              label="Родительский элемент"
              style={{ textAlign: "left" }}
            >
              <Controller
                name="parentId"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    size={isMobile ? "small" : "middle"}
                    placeholder="Выберите родительский элемент"
                    options={parentOptions}
                    allowClear
                  />
                )}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={8}>
          <Col xs={12} lg={24}>
            <Form.Item
              label="Внешняя ссылка"
              validateStatus={errors.url ? "error" : ""}
              help={errors.url?.message}
              style={{ textAlign: "left" }}
            >
              <Controller
                name="url"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    size={isMobile ? "small" : "middle"}
                    value={field.value || ""}
                    placeholder="https://example.com"
                    style={{ fontSize: "16px" }}
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
          </Col>

          <Col xs={12} lg={24}>
            <Form.Item
              label="Порядок сортировки"
              validateStatus={errors.sort ? "error" : ""}
              help={errors.sort?.message}
              style={{ textAlign: "left" }}
            >
              <Controller
                name="sort"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    size={isMobile ? "small" : "middle"}
                    min={0}
                    style={{ width: "100%", fontSize: "16px" }}
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
          </Col>
        </Row>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            icon={<PlusOutlined />}
            loading={isSubmitting}
            block
          >
            Добавить
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
