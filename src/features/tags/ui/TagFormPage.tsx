import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  InputNumber,
  Card,
  message,
  Typography,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  createTagRequest,
  updateTagRequest,
  fetchTagsRequest,
} from "../model/actions";
import {
  selectTagsItems,
  selectTagsLoading,
  selectTagsError,
} from "../model/selectors";
import { CreateTagRequest, UpdateTagRequest } from "../model/types";
import { tagSchema, TagFormData } from "../validation/schemas";
import { useIsMobile, SafeAreaWrapper, useZodRules } from "../../../shared";
import { capitalize } from "../lib/capitalize";

const { Text } = Typography;

const TagFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const tags = useSelector(selectTagsItems);
  const loading = useSelector(selectTagsLoading);
  const error = useSelector(selectTagsError);
  const [form] = Form.useForm<TagFormData>();
  const rules = useZodRules(tagSchema);
  const isMobile = useIsMobile();

  const isEditing = !!id;
  const tag = isEditing ? tags.find((t: any) => t.id === Number(id)) : null;

  useEffect(() => {
    if (isEditing && !tag) {
      dispatch(fetchTagsRequest({ page: 1 }));
    }
  }, [dispatch, isEditing, tag]);

  useEffect(() => {
    if (tag) {
      form.setFieldsValue({
        code: tag.code,
        name: tag.name,
        sort: tag.sort,
      });
    }
  }, [tag, form]);

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  const handleSubmit = (values: TagFormData) => {
    const data = {
      code: values.code,
      name: capitalize(values.name),
      sort: values.sort,
    };

    if (isEditing && tag) {
      dispatch(updateTagRequest({ ...data, id: tag.id } as UpdateTagRequest));
    } else {
      dispatch(createTagRequest(data as CreateTagRequest));
    }

    navigate(-1);
    message.success(isEditing ? "Тег успешно обновлен" : "Тег успешно создан");
  };

  const title = (isEditing: boolean, name: string | null) => {
    return (
      <span>
        {isEditing ? (
          <Text type="secondary" italic>
            (ред.)
          </Text>
        ) : (
          <Text type="warning">(New)</Text>
        )}{" "}
        {name && (
          <Text
            style={{
              maxWidth: "auto",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {name}
          </Text>
        )}
      </span>
    );
  };

  return (
    <SafeAreaWrapper>
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: isMobile ? 16 : 24 }}
        size={isMobile ? "small" : "middle"}
      >
        Назад
      </Button>

      <Card title={title(isEditing, isEditing && tag ? tag?.name : "")}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ maxWidth: 600 }}
        >
          <Form.Item name="code" label="Код" rules={rules.code}>
            <Input placeholder="Код тега" />
          </Form.Item>

          <Form.Item name="name" label="Название" rules={rules.name}>
            <Input placeholder="Название тега" />
          </Form.Item>

          <Form.Item name="sort" label="Сортировка" rules={rules.sort}>
            <InputNumber
              placeholder="Порядок сортировки"
              min={0}
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size={isMobile ? "small" : "middle"}
            >
              {isEditing ? "Сохранить" : "Создать"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </SafeAreaWrapper>
  );
};

export default TagFormPage;
