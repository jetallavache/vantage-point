import React, { useEffect } from "react";
import { Form, Input, Button, InputNumber, Card, message } from "antd";
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

const TagFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const tags = useSelector(selectTagsItems);
  const loading = useSelector(selectTagsLoading);
  const error = useSelector(selectTagsError);
  const [form] = Form.useForm();

  const isEditing = Boolean(id);
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
    try {
      tagSchema.parse(values);

      const data = {
        code: values.code,
        name: values.name,
        sort: values.sort,
      };

      if (isEditing && tag) {
        dispatch(updateTagRequest({ ...data, id: tag.id } as UpdateTagRequest));
      } else {
        dispatch(createTagRequest(data as CreateTagRequest));
      }

      message.success(
        isEditing ? "Тег успешно обновлен" : "Тег успешно создан"
      );
      navigate("/tags");
    } catch (error) {
      message.error("Проверьте правильность заполнения формы");
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/tags")}
          style={{ marginRight: 16 }}
        >
          Назад
        </Button>
        <h1 style={{ display: "inline" }}>
          {isEditing ? "Редактировать тег" : "Добавить тег"}
        </h1>
      </div>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ maxWidth: 600 }}
        >
          <Form.Item
            name="code"
            label="Код"
            rules={[{ required: true, message: "Введите код тега" }]}
          >
            <Input placeholder="Код тега" />
          </Form.Item>

          <Form.Item
            name="name"
            label="Название"
            rules={[{ required: true, message: "Введите название тега" }]}
          >
            <Input placeholder="Название тега" />
          </Form.Item>

          <Form.Item
            name="sort"
            label="Сортировка"
            rules={[{ required: true, message: "Введите порядок сортировки" }]}
          >
            <InputNumber
              placeholder="Порядок сортировки"
              min={0}
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {isEditing ? "Сохранить" : "Создать"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default TagFormPage;
