import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Form, Input, Button, Upload, Select, Card, Alert, Spin } from "antd";
import { ArrowLeftOutlined, UploadOutlined } from "@ant-design/icons";
import {
  createPostRequest,
  fetchPostDetailRequest,
  updatePostRequest,
} from "../model/actions";
import { fetchTagsRequest } from "../../tags/model/actions";
import { fetchAuthorsRequest } from "../../authors/model/actions";
import {
  selectPostsLoading,
  selectPostsError,
  selectCurrentPost,
} from "../model/selectors";
import { selectTagsItems } from "../../tags/model/selectors";
import { selectAuthorsItems } from "../../authors/model/selectors";
import { useIsMobile, SafeAreaWrapper } from "../../../shared";

const { TextArea } = Input;

const PostFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const loading = useSelector(selectPostsLoading);
  const error = useSelector(selectPostsError);
  const currentPost = useSelector(selectCurrentPost);
  const tags = useSelector(selectTagsItems);
  const authors = useSelector(selectAuthorsItems);

  const [fileList, setFileList] = useState<any[]>([]);
  const [validationErrors, _setValidationErrors] = useState<any>({});
  const isMobile = useIsMobile();

  const isEditing = !!id;

  useEffect(() => {
    dispatch(fetchTagsRequest({ page: 1 }));
    dispatch(fetchAuthorsRequest({ page: 1 }));

    if (isEditing && id) {
      dispatch(fetchPostDetailRequest(Number(id)));
    }
  }, [dispatch, isEditing, id]);

  useEffect(() => {
    if (currentPost && isEditing) {
      form.setFieldsValue({
        code: currentPost.code || "",
        title: currentPost.title || "",
        text: currentPost.text || "",
        authorId: currentPost.authorId || currentPost.author?.id,
        tagIds:
          currentPost.tagIds || currentPost.tags?.map((tag) => tag.id) || [],
      });

      if (currentPost.previewPicture) {
        setFileList([
          {
            uid: "-1",
            name: currentPost.previewPicture.name,
            status: "done",
            url: currentPost.previewPicture.url,
          },
        ]);
      }
    }
  }, [currentPost, isEditing, form]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = (values: any) => {
    const data = {
      code: values.code,
      title: values.title,
      text: values.text,
      authorId: values.authorId,
      tagIds: values.tagIds || [],
      previewPicture: fileList[0]?.originFileObj,
    };

    if (isEditing) {
      dispatch(updatePostRequest({ ...data, id: parseInt(id!, 10) }));
    } else {
      dispatch(createPostRequest(data));
    }
  };

  const uploadProps = {
    beforeUpload: () => false,
    fileList,
    onChange: ({ fileList: newFileList }: any) => setFileList(newFileList),
    maxCount: 1,
    accept: "image/*",
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <SafeAreaWrapper>
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={handleBack}
        style={{ marginBottom: isMobile ? 16 : 24 }}
        size={isMobile ? "small" : "middle"}
      >
        {isMobile ? "Назад" : "Назад к списку"}
      </Button>

      <Card title={isEditing ? "Редактировать пост" : "Добавить пост"}>
        {error && (
          <Alert
            message="Ошибка"
            description={error}
            type="error"
            style={{ marginBottom: 16 }}
          />
        )}

        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="code"
            label="Код"
            rules={[{ required: true, message: "Введите код поста" }]}
            validateStatus={validationErrors.code ? "error" : ""}
            help={validationErrors.code}
          >
            <Input placeholder="Уникальный код поста" />
          </Form.Item>

          <Form.Item
            name="title"
            label="Заголовок"
            rules={[{ required: true, message: "Введите заголовок поста" }]}
            validateStatus={validationErrors.title ? "error" : ""}
            help={validationErrors.title}
          >
            <Input placeholder="Заголовок поста" />
          </Form.Item>

          <Form.Item
            name="authorId"
            label="Автор"
            rules={[{ required: true, message: "Выберите автора" }]}
            validateStatus={validationErrors.authorId ? "error" : ""}
            help={validationErrors.authorId}
          >
            <Select placeholder="Выберите автора">
              {authors.map((author) => (
                <Select.Option key={author.id} value={author.id}>
                  {`${author.lastName} ${author.name} ${author.secondName}`}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="tagIds"
            label="Теги"
            validateStatus={validationErrors.tagIds ? "error" : ""}
            help={validationErrors.tagIds}
          >
            <Select mode="multiple" placeholder="Выберите теги">
              {tags.map((tag) => (
                <Select.Option key={tag.id} value={tag.id}>
                  {tag.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="text"
            label="Текст"
            rules={[{ required: true, message: "Введите текст поста" }]}
            validateStatus={validationErrors.text ? "error" : ""}
            help={validationErrors.text}
          >
            <TextArea rows={6} placeholder="Содержание поста" />
          </Form.Item>

          <Form.Item
            name="previewPicture"
            label="Превью изображение"
            validateStatus={validationErrors.previewPicture ? "error" : ""}
            help={validationErrors.previewPicture}
          >
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>Выбрать файл</Button>
            </Upload>
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

export default PostFormPage;
