import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, Input, Button, Upload, Select, Card, Spin, message } from "antd";
import { ArrowLeftOutlined, UploadOutlined } from "@ant-design/icons";
import {
  createPostRequest,
  fetchPostDetailRequest,
  updatePostRequest,
  clearPostFormErrors,
} from "../model/actions";
import { fetchTagsRequest } from "../../tags/model/actions";
import { fetchAuthorsRequest } from "../../authors/model/actions";
import {
  selectPostsLoading,
  selectCurrentPost,
  selectPostValidationErrors,
  selectPostFormError,
  selectPostIsSubmitting,
} from "../model/selectors";
import { selectTagsItems } from "../../tags/model/selectors";
import { selectAuthorsItems } from "../../authors/model/selectors";
import { useIsMobile, SafeAreaWrapper, FormTitle } from "../../../shared";
import { PostFormData, postSchema } from "../validation/schemas";

const { TextArea } = Input;

const PostFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loading = useSelector(selectPostsLoading);
  const currentPost = useSelector(selectCurrentPost);
  const tags = useSelector(selectTagsItems);
  const authors = useSelector(selectAuthorsItems);
  const validationErrors = useSelector(selectPostValidationErrors);
  const formError = useSelector(selectPostFormError);
  const isSubmitting = useSelector(selectPostIsSubmitting);

  const [fileList, setFileList] = useState<any[]>([]);
  const [previewPictureError, setPreviewPictureError] = useState<string>("");
  const isMobile = useIsMobile();
  const isEditing = !!id;

  const {
    control,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
  });

  useEffect(() => {
    dispatch(fetchTagsRequest({ page: 1 }));
    dispatch(fetchAuthorsRequest({ page: 1 }));

    if (isEditing && id) {
      dispatch(fetchPostDetailRequest(Number(id)));
    }

    return () => {
      dispatch(clearPostFormErrors());
    };
  }, [dispatch, isEditing, id]);

  useEffect(() => {
    if (currentPost && isEditing) {
      reset({
        code: currentPost.code || "",
        title: currentPost.title || "",
        text: currentPost.text || "",
        authorId: currentPost.author?.id,
        tagIds: currentPost.tags?.map((tag) => tag.id) || [],
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
  }, [currentPost, isEditing, reset]);

  useEffect(() => {
    if (validationErrors) {
      Object.entries(validationErrors).forEach(([field, msg]) => {
        if (field === "previewPicture") {
          setPreviewPictureError(msg);
        } else {
          setError(field as keyof PostFormData, {
            type: "server",
            message: msg,
          });
        }
      });
    }
  }, [validationErrors, setError]);

  useEffect(() => {
    if (formError) {
      /* Выводим общую ошибку под поле text */
      setError("text", {
        type: "server",
        message: formError,
      });
    }
  }, [formError, setError]);

  const [wasSubmitting, setWasSubmitting] = React.useState(false);

  useEffect(() => {
    if (
      wasSubmitting &&
      !isSubmitting &&
      !validationErrors &&
      !formError &&
      !previewPictureError
    ) {
      navigate(-1);
      message.success(
        isEditing ? "Статья успешно обновлена" : "Статья успешно создана"
      );
    }
    setWasSubmitting(isSubmitting);
  }, [
    isSubmitting,
    wasSubmitting,
    validationErrors,
    formError,
    previewPictureError,
    navigate,
    isEditing,
  ]);

  const handleBack = () => {
    navigate(-1);
  };

  const onSubmit = (values: PostFormData) => {
    dispatch(clearPostFormErrors());
    clearErrors();
    setPreviewPictureError("");

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
    onChange: ({ fileList: newFileList }: any) => {
      setFileList(newFileList);
      if (previewPictureError) {
        setPreviewPictureError("");
        dispatch(clearPostFormErrors());
      }
    },
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
        Назад
      </Button>

      <Card
        title={
          <FormTitle
            isEditing={isEditing}
            name={
              isEditing && currentPost ? currentPost?.title : "Новая статья"
            }
          />
        }
      >
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Form.Item
            label="Код статьи"
            validateStatus={errors.code ? "error" : ""}
            help={errors.code?.message}
          >
            <Controller
              name="code"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="99880"
                  onChange={(e) => {
                    field.onChange(e);
                    if (validationErrors?.code) {
                      clearErrors("code");
                      dispatch(clearPostFormErrors());
                    }
                  }}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Заголовок"
            validateStatus={errors.title ? "error" : ""}
            help={errors.title?.message}
          >
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Очень страшное кино..."
                  onChange={(e) => {
                    field.onChange(e);
                    if (validationErrors?.title) {
                      clearErrors("title");
                      dispatch(clearPostFormErrors());
                    }
                  }}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Автор"
            validateStatus={errors.authorId ? "error" : ""}
            help={errors.authorId?.message}
          >
            <Controller
              name="authorId"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder="Олег Константинович Малявский"
                  options={authors.map((author) => ({
                    key: author.id,
                    value: author.id,
                    label: `${author.lastName} ${author.name} ${author.secondName}`,
                  }))}
                  onChange={(value) => {
                    field.onChange(value);
                    if (validationErrors?.authorId) {
                      clearErrors("authorId");
                      dispatch(clearPostFormErrors());
                    }
                  }}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Теги"
            validateStatus={errors.tagIds ? "error" : ""}
            help={errors.tagIds?.message}
          >
            <Controller
              name="tagIds"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  mode="multiple"
                  placeholder="#кино #рецензия"
                  options={tags.map((tag) => ({
                    key: tag.id,
                    value: tag.id,
                    label: tag.name,
                  }))}
                  onChange={(value) => {
                    field.onChange(value);
                    if (validationErrors?.tagIds) {
                      clearErrors("tagIds");
                      dispatch(clearPostFormErrors());
                    }
                  }}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Содержание"
            validateStatus={errors.text ? "error" : ""}
            help={errors.text?.message}
          >
            <Controller
              name="text"
              control={control}
              render={({ field }) => (
                <TextArea
                  {...field}
                  rows={6}
                  placeholder="Тут должен быть текст вашей статьи. Напишите подробно что хотели рассказать!"
                  onChange={(e) => {
                    field.onChange(e);
                    if (validationErrors?.text) {
                      clearErrors("text");
                      dispatch(clearPostFormErrors());
                    }
                  }}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Обложка"
            validateStatus={previewPictureError ? "error" : ""}
            help={previewPictureError}
          >
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>Выбрать файл</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isSubmitting}
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
