import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Form,
  Input,
  Button,
  Upload,
  Select,
  Card,
  Spin,
  Typography,
  message,
} from "antd";
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
import { useIsMobile, SafeAreaWrapper, useZodRules } from "../../../shared";
import { PostFormData, postSchema } from "../validation/schemas";

const { TextArea } = Input;
const { Title, Text } = Typography;

const PostFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm<PostFormData>();
  const rules = useZodRules(postSchema);

  const loading = useSelector(selectPostsLoading);
  const error = useSelector(selectPostsError);
  const currentPost = useSelector(selectCurrentPost);
  const tags = useSelector(selectTagsItems);
  const authors = useSelector(selectAuthorsItems);

  const [fileList, setFileList] = useState<any[]>([]);
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

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = (values: PostFormData) => {
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

    message.success(
      isEditing ? "Статья успешно обновлена" : "Статья успешно создана"
    );
  };

  const uploadProps = {
    beforeUpload: () => false,
    fileList,
    onChange: ({ fileList: newFileList }: any) => setFileList(newFileList),
    maxCount: 1,
    accept: "image/*",
  };

  const title = (isEditing: boolean, name: string | null) => {
    return (
      <span>
        {isEditing ? (
          <Text type="secondary" italic>
            (ред.)
          </Text>
        ) : (
          <Text type="warning" italic>
            (new)
          </Text>
        )}{" "}
        {name && (
          <span
            style={{
              maxWidth: "auto",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {name}
          </span>
        )}
      </span>
    );
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

      <Card
        title={title(
          isEditing,
          isEditing && currentPost ? currentPost?.title : "Новая статья"
        )}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="code" label="Код статьи" rules={rules.code}>
            <Input placeholder="99880" />
          </Form.Item>

          <Form.Item name="title" label="Заголовок" rules={rules.title}>
            <Input placeholder="Очень страшное кино..." />
          </Form.Item>

          <Form.Item name="authorId" label="Автор" rules={rules.authorId}>
            <Select placeholder="Олег Константинович Малявский">
              {authors.map((author) => (
                <Select.Option key={author.id} value={author.id}>
                  {`${author.lastName} ${author.name} ${author.secondName}`}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="tagIds" label="Теги" rules={rules.tagIds}>
            <Select mode="multiple" placeholder="#кино #рецензия">
              {tags.map((tag) => (
                <Select.Option key={tag.id} value={tag.id}>
                  {tag.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="text" label="Содержание" rules={rules.text}>
            <TextArea
              rows={6}
              placeholder="Тут должен быть текст вашей статьи. Напишите подробно что хотели рассказать!"
            />
          </Form.Item>

          <Form.Item
            name="previewPicture"
            label="Обложка"
            rules={rules.previewPicture}
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
