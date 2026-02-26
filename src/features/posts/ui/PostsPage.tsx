import React, { useEffect } from "react";
import {
  Card,
  Button,
  Space,
  Popconfirm,
  Pagination,
  Row,
  Col,
  Typography,
  Tag,
} from "antd";
import { PlusOutlined, TagOutlined, ScheduleOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchPostsRequest, deletePostRequest } from "../model/actions";
import {
  formatPublishDate,
  SafeAreaWrapper,
  useIsMobile,
} from "../../../shared";
import {
  selectPostsItems,
  selectPostsLoading,
  selectPostsPagination,
} from "../model/selectors";

const { Text } = Typography;

const PostsPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const posts = useSelector(selectPostsItems);
  const loading = useSelector(selectPostsLoading);
  const pagination = useSelector(selectPostsPagination);
  const isMobile = useIsMobile();

  useEffect(() => {
    dispatch(fetchPostsRequest({ page: 1 }));
  }, [dispatch]);

  const handleDelete = (id: number) => {
    dispatch(deletePostRequest(id));
    // navigate(-1);
  };

  const handlePageChange = (page: number) => {
    dispatch(fetchPostsRequest({ page }));
  };

  const handleViewDetail = (id: number) => {
    navigate(`/posts/detail/${id}`);
  };

  return (
    <SafeAreaWrapper>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/posts/form")}
          size={isMobile ? "small" : "middle"}
        >
          Добавить пост
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        {posts.map((post) => {
          return (
            <Col xs={24} sm={24} md={12} lg={8} key={post.id}>
              <Card
                loading={loading}
                styles={{
                  header: {
                    minHeight: "32px",
                    backgroundColor: "var(--ant-color-bg-layout)",
                    /* borderBottom: 'unset', */
                  },
                }}
                key={post.id}
                hoverable
                title={<Text type="secondary">№{post.code}</Text>}
                extra={[
                  <ScheduleOutlined
                    key="icon"
                    style={{ fontSize: "16px", paddingRight: "8px" }}
                  />,
                  <Text key="date">{formatPublishDate(post.createdAt)}</Text>,
                ]}
                onClick={() => handleViewDetail(post.id)}
                style={{ cursor: "pointer" }}
              >
                <Card.Meta
                  title={post.title}
                  description={
                    <Space
                      orientation="horizontal"
                      style={{
                        display: "flex",
                        justifyContent: "space-around",
                        paddingBottom: isMobile ? "8px" : "",
                        borderTop: "1px dashed var(--ant-color-border)",
                        paddingTop: "8px",
                      }}
                    >
                      <Space
                        orientation="vertical"
                        size="small"
                        style={{
                          display: "flex",
                          borderRight: "1px dashed var(--ant-color-border)",
                          paddingRight: "8px",
                        }}
                      >
                        <Text type="secondary" style={{ fontSize: 14 }}>
                          Автор: {post.authorName}
                        </Text>
                        {post.tagNames && post.tagNames.length > 0 && (
                          <Space size={isMobile ? [4, 0] : [4, 4]} wrap>
                            {post.tagNames.slice(0, 3).map((tag) => (
                              <Tag
                                key={tag}
                                icon={<TagOutlined />}
                                variant="outlined"
                                style={{
                                  whiteSpace: "nowrap",
                                  overflow: "clip",
                                  textOverflow: "ellipsis",
                                  maxWidth: "96px",
                                }}
                              >
                                {tag}
                              </Tag>
                            ))}
                            {post.tagNames.length > 3 && (
                              <Tag
                                variant="outlined"
                                style={{
                                  whiteSpace: "nowrap",
                                  overflow: "clip",
                                  textOverflow: "ellipsis",
                                  maxWidth: "36px",
                                }}
                              >
                                +{post.tagNames.length - 3}
                              </Tag>
                            )}
                          </Space>
                        )}
                      </Space>
                      <Space
                        orientation="vertical"
                        size="small"
                        style={{ display: "flex" }}
                      >
                        <Button
                          key="edit"
                          size="small"
                          color="default"
                          variant="outlined"
                          style={{ minWidth: "86px" }}
                          /* icon={<EditOutlined />} */
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/posts/form/${post.id}`);
                          }}
                        >
                          Изменить
                        </Button>
                        <Popconfirm
                          key="delete"
                          title="Удалить пост?"
                          onConfirm={() => handleDelete(post.id)}
                          okText="Да"
                          cancelText="Нет"
                          onPopupClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            key="delete"
                            variant="outlined"
                            size="small"
                            danger
                            style={{ minWidth: "86px" }}
                            /* icon={<DeleteOutlined />} */
                            onClick={(e) => e.stopPropagation()}
                          >
                            Удалить
                          </Button>
                        </Popconfirm>
                      </Space>
                    </Space>
                  }
                />
              </Card>
            </Col>
          );
        })}
      </Row>

      <div style={{ marginTop: 24, textAlign: "center" }}>
        <Pagination
          current={pagination.current}
          total={pagination.total}
          pageSize={pagination.pageSize}
          onChange={handlePageChange}
          showSizeChanger={false}
          showQuickJumper={!isMobile}
          showTotal={(total, range) => `${range[0]}-${range[1]} из ${total}`}
        />
      </div>
    </SafeAreaWrapper>
  );
};

export default PostsPage;

{
  /* actions={[
  <Button
    key="edit"
    type="text"
    icon={<EditOutlined />}
    onClick={(e) => {
      e.stopPropagation();
      navigate(`/posts/form/${post.id}`);
    }}
  >
  </Button>,
  <Popconfirm
    key="delete"
    title="Удалить пост?"
    onConfirm={() => handleDelete(post.id)}
    okText="Да"
    cancelText="Нет"
  >
    <Button
      type="text"
      danger
      icon={<DeleteOutlined />}
      onClick={(e) => e.stopPropagation()}
    >
    </Button>
  </Popconfirm>,
]}*/
}
