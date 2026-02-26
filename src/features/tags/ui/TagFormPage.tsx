import React, { useEffect } from "react";
import { Form, Input, Button, InputNumber, Card, message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createTagRequest,
  updateTagRequest,
  fetchTagsRequest,
  clearTagFormErrors,
} from "../model/actions";
import {
  selectTagsItems,
  selectTagValidationErrors,
  selectTagFormError,
  selectTagIsSubmitting,
} from "../model/selectors";
import { CreateTagRequest, UpdateTagRequest } from "../model/types";
import { tagSchema, TagFormData } from "../validation/schemas";
import { useIsMobile, SafeAreaWrapper, FormTitle } from "../../../shared";
import { capitalize } from "../lib/capitalize";

const TagFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const tags = useSelector(selectTagsItems);
  const validationErrors = useSelector(selectTagValidationErrors);
  const formError = useSelector(selectTagFormError);
  const isSubmitting = useSelector(selectTagIsSubmitting);
  const isMobile = useIsMobile();

  const isEditing = !!id;
  const tag = isEditing ? tags.find((t: any) => t.id === Number(id)) : null;

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<TagFormData>({
    resolver: zodResolver(tagSchema),
  });

  useEffect(() => {
    if (isEditing && !tag) {
      dispatch(fetchTagsRequest({ page: 1 }));
    }
  }, [dispatch, isEditing, tag]);

  useEffect(() => {
    if (tag) {
      reset({
        code: tag.code,
        name: tag.name,
        sort: tag.sort,
      });
    }
  }, [tag, reset]);

  useEffect(() => {
    return () => {
      dispatch(clearTagFormErrors());
    };
  }, [dispatch]);

  useEffect(() => {
    if (validationErrors) {
      Object.entries(validationErrors).forEach(([field, msg]) => {
        setError(field as keyof TagFormData, {
          type: "server",
          message: msg,
        });
      });
    }
  }, [validationErrors, setError]);

  useEffect(() => {
    if (formError) {
      /* Выводим общую ошибку под поле sort */
      setError("sort", {
        type: "server",
        message: formError,
      });
    }
  }, [formError, setError]);

  const [wasSubmitting, setWasSubmitting] = React.useState(false);

  useEffect(() => {
    if (wasSubmitting && !isSubmitting && !validationErrors && !formError) {
      navigate(-1);
      message.success(
        isEditing ? "Тег успешно обновлен" : "Тег успешно создан"
      );
    }
    setWasSubmitting(isSubmitting);
  }, [
    isSubmitting,
    wasSubmitting,
    validationErrors,
    formError,
    navigate,
    isEditing,
  ]);

  const onSubmit = (values: TagFormData) => {
    dispatch(clearTagFormErrors());
    clearErrors();

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

      <Card
        title={
          <FormTitle
            isEditing={isEditing}
            name={isEditing && tag ? tag?.name : ""}
          />
        }
      >
        <Form
          layout="vertical"
          onFinish={handleSubmit(onSubmit)}
          style={{ maxWidth: 600 }}
        >
          <Form.Item
            label="Код"
            validateStatus={errors.code ? "error" : ""}
            help={errors.code?.message}
          >
            <Controller
              name="code"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Код тега"
                  onChange={(e) => {
                    field.onChange(e);
                    if (validationErrors?.code) {
                      clearErrors("code");
                      dispatch(clearTagFormErrors());
                    }
                  }}
                />
              )}
            />
          </Form.Item>

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
                  placeholder="Название тега"
                  onChange={(e) => {
                    field.onChange(e);
                    if (validationErrors?.name) {
                      clearErrors("name");
                      dispatch(clearTagFormErrors());
                    }
                  }}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Сортировка"
            validateStatus={errors.sort ? "error" : ""}
            help={errors.sort?.message}
          >
            <Controller
              name="sort"
              control={control}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  placeholder="Порядок сортировки"
                  min={0}
                  style={{ width: "100%" }}
                  onChange={(value) => {
                    field.onChange(value);
                    if (validationErrors?.sort) {
                      clearErrors("sort");
                      dispatch(clearTagFormErrors());
                    }
                  }}
                />
              )}
            />
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

export default TagFormPage;
