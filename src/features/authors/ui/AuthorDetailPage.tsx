import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  Button,
  Typography,
  Space,
  Result,
  Spin,
  Avatar,
  Divider,
} from "antd";
import { ArrowLeftOutlined, UserOutlined } from "@ant-design/icons";
import { fetchAuthorDetailRequest } from "../model/actions";
import {
  selectCurrentAuthor,
  selectAuthorsLoading,
  selectAuthorsError,
} from "../model/selectors";
import { useIsMobile, SafeAreaWrapper, formatDateTime } from "../../../shared";

const { Title, Text, Paragraph } = Typography;

const AuthorDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const author = useSelector(selectCurrentAuthor);
  const loading = useSelector(selectAuthorsLoading);
  const error = useSelector(selectAuthorsError);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (id) {
      dispatch(fetchAuthorDetailRequest(Number(id)));
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
          <Button type="primary" onClick={() => navigate("/authors")}>
            Вернуться к списку
          </Button>
        }
      />
    );
  }

  if (!author) {
    return (
      <Result
        status="404"
        title="Автор не найден"
        extra={
          <Button type="primary" onClick={() => navigate("/authors")}>
            Вернуться к списку
          </Button>
        }
      />
    );
  }

  const fullName =
    `${author.lastName} ${author.name} ${author.secondName || ""}`.trim();

  return (
    <SafeAreaWrapper>
      <div style={{ marginBottom: isMobile ? 16 : 24 }}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          style={{ marginRight: 16 }}
          size={isMobile ? "small" : "middle"}
        >
          Назад
        </Button>
        <Button
          type="primary"
          onClick={() => navigate(`/authors/edit/${author.id}`)}
          size={isMobile ? "small" : "middle"}
        >
          Редактировать
        </Button>
      </div>

      <Card>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 24,
            marginBottom: isMobile ? "16px" : "24px",
          }}
        >
          <Avatar src={author.avatar?.url} icon={<UserOutlined />} size={120} />
          <div style={{ flex: 1 }}>
            <Title level={2}>{fullName}</Title>
          </div>
        </div>

        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          {author.shortDescription && (
            <div>
              <Text strong>Краткое описание: </Text>
              <Paragraph>{author.shortDescription}</Paragraph>
            </div>
          )}

          {author.description && (
            <div>
              <Text strong>Полное описание: </Text>
              <Paragraph>{author.description}</Paragraph>
            </div>
          )}
        </Space>

        <Divider />

        <div>
          <Text type="secondary" italic>
            Добавлен {formatDateTime(author.createdAt)}
          </Text>
          <br />
          <Text type="secondary" italic>
            Последнее ред. {formatDateTime(author.updatedAt)}
          </Text>
        </div>
      </Card>
    </SafeAreaWrapper>
  );
};

export default AuthorDetailPage;
