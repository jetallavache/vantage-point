import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Card, Button, Typography, Space, Result, Spin, Divider } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { fetchTagDetailRequest } from "../model/actions";
import {
  selectCurrentTag,
  selectTagsLoading,
  selectTagsError,
} from "../model/selectors";
import { HashTag, useIsMobile, SafeAreaWrapper } from "../../../shared";

const { Title, Text, Paragraph } = Typography;

const TagDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tag = useSelector(selectCurrentTag);
  const loading = useSelector(selectTagsLoading);
  const error = useSelector(selectTagsError);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (id) {
      dispatch(fetchTagDetailRequest(Number(id)));
    }
  }, [dispatch, id]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Result
        status="error"
        title="Ошибка загрузки"
        subTitle={error}
        extra={
          <Button type="primary" onClick={() => navigate("/tags")}>
            Вернуться к списку
          </Button>
        }
      />
    );
  }

  if (!tag) {
    return (
      <Result
        status="404"
        title="Тег не найден"
        extra={
          <Button type="primary" onClick={() => navigate("/tags")}>
            Вернуться к списку
          </Button>
        }
      />
    );
  }

  return (
    <SafeAreaWrapper>
      <div
        style={{
          marginBottom: isMobile ? 16 : 24,
        }}
      >
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          style={{ marginRight: 16 }}
          size={isMobile ? "small" : "middle"}
        >
          {isMobile ? "Назад" : "Назад к списку"}
        </Button>
        <Button
          type="primary"
          onClick={() => navigate(`/tags/edit/${tag.id}`)}
          size={isMobile ? "small" : "middle"}
        >
          Редактировать
        </Button>
      </div>

      <Card title={<HashTag tag={tag.name} />}>
        <Space
          direction="vertical"
          size={isMobile ? "small" : "middle"}
          style={{ width: "100%" }}
        >
          <div>
            <Text strong>Код: </Text>
            <Text>{tag.code}</Text>
            <br />
            <Text strong>Сортировка: </Text>
            <Text>{tag.sort}</Text>
          </div>

          <div style={{ color: "#666", fontSize: isMobile ? "14px" : "16px" }}>
            <Text type="secondary">
              Создано: {new Date(tag.createdAt).toLocaleString()}
            </Text>
            <br />
            <Text type="secondary">
              Обновлено: {new Date(tag.updatedAt).toLocaleString()}
            </Text>
          </div>
        </Space>
      </Card>
    </SafeAreaWrapper>
  );
};

export default TagDetailPage;
