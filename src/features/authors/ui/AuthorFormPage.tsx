import React, { useEffect, useState } from "react";
import { Form, Input, Button, Upload, Card, message, Checkbox } from "antd";
import { UploadOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createAuthorRequest,
  updateAuthorRequest,
  fetchAuthorDetailRequest,
  clearCurrentAuthor,
  clearAuthorFormErrors,
} from "../model/actions";
import {
  selectCurrentAuthor,
  selectAuthorsError,
  selectAuthorValidationErrors,
  selectAuthorFormError,
  selectAuthorIsSubmitting,
} from "../model/selectors";
import { CreateAuthorRequest, UpdateAuthorRequest } from "../model/types";
import { authorSchema, AuthorFormData } from "../validation/schemas";
import { useIsMobile, SafeAreaWrapper } from "../../../shared";

const { TextArea } = Input;

const AuthorFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const author = useSelector(selectCurrentAuthor);
  const error = useSelector(selectAuthorsError);
  const validationErrors = useSelector(selectAuthorValidationErrors);
  const formError = useSelector(selectAuthorFormError);
  const isSubmitting = useSelector(selectAuthorIsSubmitting);
  const [fileList, setFileList] = useState<any[]>([]);
  const [avatarError, setAvatarError] = useState<string>("");

  const isEditing = Boolean(id);
  const isMobile = useIsMobile();

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<AuthorFormData>({
    resolver: zodResolver(authorSchema),
  });

  useEffect(() => {
    if (isEditing && id) {
      dispatch(fetchAuthorDetailRequest(Number(id)));
    }

    return () => {
      if (isEditing) {
        dispatch(clearCurrentAuthor());
      }
      dispatch(clearAuthorFormErrors());
    };
  }, [dispatch, isEditing, id]);

  useEffect(() => {
    if (author) {
      reset({
        name: author.name || "",
        lastName: author.lastName || "",
        secondName: author.secondName || "",
        shortDescription: author.shortDescription || "",
        description: author.description || "",
      });
    }
  }, [author, reset]);

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (validationErrors) {
      Object.entries(validationErrors).forEach(([field, msg]) => {
        if (field === "avatar") {
          setAvatarError(msg);
        } else {
          setError(field as keyof AuthorFormData, {
            type: "server",
            message: msg,
          });
        }
      });
    }
  }, [validationErrors, setError]);

  const [wasSubmitting, setWasSubmitting] = React.useState(false);

  useEffect(() => {
    if (
      wasSubmitting &&
      !isSubmitting &&
      !validationErrors &&
      !formError &&
      !avatarError
    ) {
      navigate(-1);
      message.success(
        isEditing ? "Автор успешно обновлен" : "Автор успешно создан"
      );
    }
    setWasSubmitting(isSubmitting);
  }, [
    isSubmitting,
    wasSubmitting,
    validationErrors,
    formError,
    avatarError,
    navigate,
    isEditing,
  ]);

  const onSubmit = (values: AuthorFormData) => {
    dispatch(clearAuthorFormErrors());
    clearErrors();
    setAvatarError("");

    const data: any = {
      name: values.name,
      lastName: values.lastName,
      secondName: values.secondName,
      shortDescription: values.shortDescription,
      description: values.description,
      avatar: fileList[0]?.originFileObj,
      removeAvatar: values.removeAvatar ? 1 : 0,
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
  };

  const uploadProps = {
    beforeUpload: () => false,
    fileList,
    onChange: ({ fileList: newFileList }: any) => {
      setFileList(newFileList);
      if (avatarError) {
        setAvatarError("");
        dispatch(clearAuthorFormErrors());
      }
    },
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
        Назад
      </Button>

      <Card title={isEditing ? "Редактировать автора" : "Добавить автора"}>
        <Form
          layout="vertical"
          onFinish={handleSubmit(onSubmit)}
          style={{ maxWidth: 600 }}
        >
          <Form.Item
            label="Имя"
            validateStatus={errors.name ? "error" : ""}
            help={errors.name?.message}
          >
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Имя автора"
                  onChange={(e) => {
                    field.onChange(e);
                    if (validationErrors?.name) {
                      clearErrors("name");
                      dispatch(clearAuthorFormErrors());
                    }
                  }}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Отчество"
            validateStatus={errors.secondName ? "error" : ""}
            help={errors.secondName?.message}
          >
            <Controller
              name="secondName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Отчество автора"
                  onChange={(e) => {
                    field.onChange(e);
                    if (validationErrors?.secondName) {
                      clearErrors("secondName");
                      dispatch(clearAuthorFormErrors());
                    }
                  }}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Фамилия"
            validateStatus={errors.lastName ? "error" : ""}
            help={errors.lastName?.message}
          >
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Фамилия автора"
                  onChange={(e) => {
                    field.onChange(e);
                    if (validationErrors?.lastName) {
                      clearErrors("lastName");
                      dispatch(clearAuthorFormErrors());
                    }
                  }}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Краткое описание"
            validateStatus={errors.shortDescription ? "error" : ""}
            help={errors.shortDescription?.message}
          >
            <Controller
              name="shortDescription"
              control={control}
              render={({ field }) => (
                <TextArea
                  {...field}
                  placeholder="Краткое описание автора"
                  rows={3}
                  maxLength={255}
                  showCount
                  onChange={(e) => {
                    field.onChange(e);
                    if (validationErrors?.shortDescription) {
                      clearErrors("shortDescription");
                      dispatch(clearAuthorFormErrors());
                    }
                  }}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Полное описание"
            validateStatus={errors.description ? "error" : ""}
            help={errors.description?.message}
          >
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextArea
                  {...field}
                  placeholder="Полное описание автора"
                  rows={5}
                  maxLength={1000}
                  showCount
                  onChange={(e) => {
                    field.onChange(e);
                    if (validationErrors?.description) {
                      clearErrors("description");
                      dispatch(clearAuthorFormErrors());
                    }
                  }}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Аватар"
            validateStatus={avatarError ? "error" : ""}
            help={avatarError}
          >
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>Выбрать файл</Button>
            </Upload>
          </Form.Item>

          {isEditing && author?.avatar && (
            <Form.Item>
              <Controller
                name="removeAvatar"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  >
                    Удалить текущий аватар
                  </Checkbox>
                )}
              />
            </Form.Item>
          )}

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

export default AuthorFormPage;
