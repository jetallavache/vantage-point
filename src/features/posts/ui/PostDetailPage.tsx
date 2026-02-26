import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  Typography,
  Image,
  Space,
  Button,
  Result,
  Spin,
  Avatar,
  Tag,
} from "antd";
import {
  ArrowLeftOutlined,
  TagOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { fetchPostDetailRequest } from "../model/actions";
import {
  selectCurrentPost,
  selectPostsLoading,
  selectPostsError,
} from "../model/selectors";
import {
  useIsMobile,
  SafeAreaWrapper,
  formatPublishDate,
  formatDateTime,
} from "../../../shared";
import { TagItem } from "../model/types";

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

  const handleViewTag = (id: number) => {
    navigate(`/tags/detail/${id}`);
  };

  const handleViewAuthor = (id: number) => {
    navigate(`/authors/detail/${id}`);
  };

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
    <SafeAreaWrapper>
      <div
        style={{
          marginBottom: isMobile ? 16 : 24,
        }}
      >
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          style={{ marginRight: 16 }}
          size={isMobile ? "small" : "middle"}
          type="text"
        >
          Назад
        </Button>
        <Button
          type="primary"
          onClick={() => navigate(`/posts/form/${post.id}`)}
          size={isMobile ? "small" : "middle"}
        >
          Редактировать
        </Button>
      </div>

      <Card title={`Пост #${post.id}`}>
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div>
            <Title
              level={2}
              style={{ margin: 0, fontSize: isMobile ? "20px" : "28px" }}
            >
              {post.title}
            </Title>
            <Text
              type="secondary"
              style={{ fontSize: isMobile ? "14px" : "16px" }}
            >
              {formatPublishDate(post.createdAt)}
            </Text>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "1fr"
                : "minmax(0, 2fr) minmax(300px, 1fr)",
              gap: "24px",
              alignItems: "center",
            }}
          >
            {post.previewPicture && (
              <div
                style={{
                  width: "100%",
                  maxHeight: isMobile ? "50vh" : "31vh",
                  overflow: "hidden",
                  borderRadius: "8px",
                  backgroundColor: "#f5f5f5",
                }}
              >
                <Image
                  src={post.previewPicture.url}
                  alt={post.previewPicture.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  preview={{
                    mask: "Увеличить",
                  }}
                />
              </div>
            )}

            <div
              style={{
                background: "#fafafa",
                padding: "20px",
                borderRadius: "8px",
                height:
                  isMobile || !post.previewPicture ? "auto" : "fit-content",
                minHeight: isMobile || !post.previewPicture ? "auto" : "200px",
              }}
            >
              <Space
                direction="vertical"
                size="middle"
                style={{ width: "100%" }}
              >
                {post.author && (
                  <a>
                    <Text
                      type="secondary"
                      style={{ display: "block", marginBottom: "8px" }}
                    >
                      Автор
                    </Text>
                    <Space>
                      <Avatar
                        src={post.author.avatar?.url}
                        icon={<UserOutlined />}
                        size="small"
                      />
                      <Text onClick={() => handleViewAuthor(post.author.id)}>
                        {post.author.fullName}
                      </Text>
                    </Space>
                  </a>
                )}

                {post.tags && post.tags.length > 0 && (
                  <div>
                    <Text
                      type="secondary"
                      style={{ display: "block", marginBottom: "8px" }}
                    >
                      Теги
                    </Text>
                    <Space size={isMobile ? [4, 0] : [4, 4]} wrap>
                      {post.tags.map((t: TagItem, i) => (
                        <Tag
                          key={i}
                          icon={<TagOutlined />}
                          variant="outlined"
                          onClick={() => handleViewTag(t.id)}
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "clip",
                            textOverflow: "ellipsis",
                            maxWidth: "142px",
                          }}
                        >
                          <a>{t.name}</a>
                        </Tag>
                      ))}
                    </Space>
                  </div>
                )}

                <div>
                  <Text
                    type="secondary"
                    style={{ display: "block", marginBottom: "8px" }}
                  >
                    Код статьи
                  </Text>
                  <Text code style={{ fontSize: "14px" }}>
                    {post.code}
                  </Text>
                </div>
              </Space>
            </div>
          </div>

          {post.text && (
            <div>
              <Paragraph
                style={{
                  fontSize: isMobile ? "16px" : "18px",
                  lineHeight: "1.6",
                  whiteSpace: "pre-wrap",
                }}
              >
                {post.text}
              </Paragraph>
            </div>
          )}

          <div>
            <Text type="secondary" italic>
              Опубликовано {formatDateTime(post.createdAt)}
            </Text>
            <br />
            <Text type="secondary" italic>
              Последнее ред. {formatDateTime(post.updatedAt)}
            </Text>
          </div>
        </div>
      </Card>
    </SafeAreaWrapper>
  );
};

export default PostDetailPage;
