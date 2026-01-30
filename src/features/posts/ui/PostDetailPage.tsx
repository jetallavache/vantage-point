import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  Typography,
  Image,
  Tag,
  Space,
  Button,
  Result,
  Spin,
  Avatar,
  Divider,
} from "antd";
import { ArrowLeftOutlined, UserOutlined } from "@ant-design/icons";
import { fetchPostDetailRequest } from "../model/actions";
import {
  selectCurrentPost,
  selectPostsLoading,
  selectPostsError,
} from "../model/selectors";
import { HashTag } from "../../../shared/ui/HashTag";
import { useIsMobile } from "../../../shared/hooks/useIsMobile";

const { Title, Paragraph, Text } = Typography;

const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const post = useSelector(selectCurrentPost);
  const loading = useSelector(selectPostsLoading);
  const error = useSelector(selectPostsError);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (id) {
      dispatch(fetchPostDetailRequest(Number(id)));
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
          <Button type="primary" onClick={() => navigate("/posts")}>
            Вернуться к списку
          </Button>
        }
      />
    );
  }

  if (!post) {
    return (
      <Result
        status="404"
        title="Пост не найден"
        extra={
          <Button type="primary" onClick={() => navigate("/posts")}>
            Вернуться к списку
          </Button>
        }
      />
    );
  }

  return (
    <div style={{ padding: isMobile ? "8px" : "24px" }}>
      <div style={{ marginBottom: isMobile ? 16 : 24 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          style={{ marginRight: 16 }}
          size={isMobile ? "small" : "middle"}
        >
          {isMobile ? "Назад" : "Назад к списку"}
        </Button>
        <Button
          type="primary"
          onClick={() => navigate(`/posts/form/${post.id}`)}
          size={isMobile ? "small" : "middle"}
        >
          Редактировать
        </Button>
      </div>

      <Card>
        <div
          style={{
            display: "flex",
            gap: isMobile ? "16px" : "24px",
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <div style={{ flex: 1 }}>
            <Title
              level={2}
              style={{
                fontSize: isMobile ? "20px" : "24px",
                marginBottom: "16px",
              }}
            >
              {post.title}
            </Title>

            <div style={{ marginBottom: "16px" }}>
              <Text strong>Код: </Text>
              <Text code>{post.code}</Text>
            </div>

            {post.author && (
              <div style={{ marginBottom: "16px" }}>
                <Text strong>Автор: </Text>
                <Space>
                  <Avatar
                    src={post.author.avatar?.url}
                    icon={<UserOutlined />}
                    size="small"
                  />
                  <Text>{post.author.fullName}</Text>
                </Space>
              </div>
            )}

            {post.tags && post.tags.length > 0 && (
              <div style={{ marginBottom: "16px" }}>
                <Text strong>Теги: </Text>
                <Space size={[0, 8]} wrap>
                  {post.tags.map((tag: any, i: number) => (
                    <HashTag
                      key={tag.id || i}
                      tag={tag.name || tag}
                      id={tag.id}
                      index={i}
                    />
                  ))}
                </Space>
              </div>
            )}

            <div style={{ marginBottom: "16px" }}>
              <Text strong>Создан: </Text>
              <Text type="secondary">
                {new Date(post.createdAt).toLocaleString()}
              </Text>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <Text strong>Обновлен: </Text>
              <Text type="secondary">
                {new Date(post.updatedAt).toLocaleString()}
              </Text>
            </div>
          </div>

          {post.previewPicture && (
            <div
              style={{
                width: isMobile ? "100%" : "200px",
                maxWidth: isMobile ? "300px" : "200px",
                margin: isMobile ? "0 auto" : "0",
                flexShrink: 0,
              }}
            >
              <Image
                src={post.previewPicture.url}
                alt={post.previewPicture.name}
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "8px",
                  margin: isMobile ? "0" : "24px 0",
                }}
              />
            </div>
          )}
        </div>

        {post.text && (
          <div
            style={{
              marginTop: isMobile ? "8px" : "16px",
              borderTop: "1px solid #f0f0f0",
              paddingTop: isMobile ? "8px" : "16px",
            }}
          >
            <div
              style={{
                background: "#fafafa",
                padding: isMobile ? "12px" : "16px",
                borderRadius: "6px",
                whiteSpace: "pre-wrap",
                fontSize: isMobile ? "14px" : "16px",
                lineHeight: "1.6",
                wordBreak: "break-word",
              }}
            >
              {post.text}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default PostDetailPage;
