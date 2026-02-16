import React, { useEffect, useState } from "react";
import { Form, Input, Button, Upload, Card, message, Checkbox } from "antd";
import { UploadOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  createAuthorRequest,
  updateAuthorRequest,
  fetchAuthorDetailRequest,
  clearCurrentAuthor,
} from "../model/actions";
import {
  selectCurrentAuthor,
  selectAuthorsLoading,
  selectAuthorsError,
} from "../model/selectors";
import { CreateAuthorRequest, UpdateAuthorRequest } from "../model/types";
import { authorSchema, AuthorFormData } from "../validation/schemas";
import { useIsMobile, SafeAreaWrapper, useZodRules } from "../../../shared";

const { TextArea } = Input;

const AuthorFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const author = useSelector(selectCurrentAuthor);
  const loading = useSelector(selectAuthorsLoading);
  const error = useSelector(selectAuthorsError);
  const [form] = Form.useForm<AuthorFormData>();
  const rules = useZodRules(authorSchema);
  const [fileList, setFileList] = useState<any[]>([]);

  const isEditing = Boolean(id);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isEditing && id) {
      dispatch(fetchAuthorDetailRequest(Number(id)));
    }

    return () => {
      if (isEditing) {
        dispatch(clearCurrentAuthor());
      }
    };
  }, [dispatch, isEditing, id]);

  useEffect(() => {
    if (author) {
      form.setFieldsValue({
        name: author.name || "",
        lastName: author.lastName || "",
        secondName: author.secondName || "",
        shortDescription: author.shortDescription || "",
        description: author.description || "",
      });
    }
  }, [author, form]);

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  const handleSubmit = (values: any) => {
    try {
      authorSchema.parse(values);

      const data = {
        name: values.name,
        lastName: values.lastName,
        secondName: values.secondName,
        shortDescription: values.shortDescription,
        description: values.description,
        avatar: fileList[0]?.originFileObj,
        removeAvatar: values.removeAvatar,
      };

      if (isEditing && author) {
        dispatch(
          updateAuthorRequest({
            ...data,
            id: author.id,
          } as UpdateAuthorRequest)
        );
      } else {
        dispatch(createAuthorRequest(data as CreateAuthorRequest));
      }

      message.success(
        isEditing ? "Автор успешно обновлен" : "Автор успешно создан"
      );
      navigate("/authors");
    } catch (error) {
      message.error("Проверьте правильность заполнения формы");
    }
  };

  const uploadProps = {
    beforeUpload: () => false,
    fileList,
    onChange: ({ fileList: newFileList }: any) => setFileList(newFileList),
    maxCount: 1,
    accept: "image/*",
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
        {isMobile ? "Назад" : "Назад к списку"}
      </Button>

      <Card title={isEditing ? "Редактировать автора" : "Добавить автора"}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ maxWidth: 600 }}
        >
          <Form.Item name="name" label="Имя" rules={rules.name}>
            <Input placeholder="Имя автора" />
          </Form.Item>

          <Form.Item
            name="secondName"
            label="Отчество"
            rules={rules.secondName}
          >
            <Input placeholder="Отчество автора" />
          </Form.Item>

          <Form.Item name="lastName" label="Фамилия" rules={rules.lastName}>
            <Input placeholder="Фамилия автора" />
          </Form.Item>

          <Form.Item
            name="shortDescription"
            label="Краткое описание"
            rules={rules.shortDescription}
          >
            <TextArea
              placeholder="Краткое описание автора"
              rows={3}
              maxLength={200}
              showCount
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="Полное описание"
            rules={rules.description}
          >
            <TextArea
              placeholder="Полное описание автора"
              rows={5}
              maxLength={1000}
              showCount
            />
          </Form.Item>

          <Form.Item name="avatar" label="Аватар">
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>Выбрать файл</Button>
            </Upload>
          </Form.Item>

          {isEditing && author?.avatar && (
            <Form.Item name="removeAvatar" valuePropName="checked">
              <Checkbox>Удалить текущий аватар</Checkbox>
            </Form.Item>
          )}

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

export default AuthorFormPage;
