import React, { useEffect } from "react";
import { Table, Button, Space, Popconfirm, Image, Tooltip } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchPostsRequest, deletePostRequest } from "../model/actions";
import { HashTag, useIsMobile } from "../../../shared";
import {
  selectPostsItems,
  selectPostsLoading,
  selectPostsPagination,
} from "../model/selectors";

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
  };

  const handlePageChange = (page: number) => {
    dispatch(fetchPostsRequest({ page }));
  };

  const handleViewDetail = (id: number) => {
    navigate(`/posts/detail/${id}`);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 50,
      responsive: ["lg"] as any,
    },
    {
      title: "Превью",
      dataIndex: "previewPicture",
      key: "previewPicture",
      width: 100,
      responsive: ["lg"] as any,
      render: (previewPicture: any) => (
        <Image
          width={60}
          height={40}
          src={previewPicture?.url}
          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
          style={{ objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Код",
      dataIndex: "code",
      key: "code",
      width: 50,
    },
    {
      title: "Заголовок",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
    },
    {
      title: "Автор",
      dataIndex: "authorName",
      key: "authorName",
      width: 150,
      responsive: ["md"] as any,
    },
    {
      title: "Теги",
      dataIndex: "tagNames",
      key: "tagNames",
      width: 200,
      responsive: ["lg"] as any,
      render: (tags: any[]) => (
        <Space size={[0, 4]} wrap>
          {tags?.slice(0, 2).map((tag, i) => (
            <HashTag
              key={tag.id || i}
              tag={tag.name || tag}
              id={tag.id}
              index={i}
            />
          ))}
          {tags?.length > 2 && (
            <span
              style={{
                background: "#f0f0f0",
                padding: "2px 8px",
                borderRadius: "12px",
                fontSize: "12px",
                color: "#9b9b9bff",
              }}
            >
              +{tags.length - 2}
            </span>
          )}
        </Space>
      ),
    },
    {
      title: "Дата",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      responsive: ["sm"] as any,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Действия",
      key: "actions",
      width: 80,
      fixed: "right" as any,
      render: (_: any, record: any) => (
        <Space onClick={(e) => e.stopPropagation()}>
          <Tooltip title="Изменить">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/posts/form/${record.id}`);
              }}
            />
          </Tooltip>
          <Popconfirm
            title="Удалить пост?"
            onConfirm={() => handleDelete(record.id)}
            okText="Да"
            cancelText="Нет"
          >
            <Tooltip title="Удалить">
              <Button
                type="text"
                danger
                size="small"
                icon={<DeleteOutlined />}
                onClick={(e) => e.stopPropagation()}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const showPagination = pagination.total > pagination.pageSize;

  return (
    <div style={{ padding: isMobile ? "8px" : "0" }}>
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

      <Table
        columns={columns}
        dataSource={posts}
        loading={loading}
        rowKey="id"
        size="small"
        onRow={(record) => ({
          onClick: () => handleViewDetail(record.id),
          style: { cursor: "pointer" },
        })}
        pagination={
          showPagination
            ? {
                current: pagination.current,
                total: pagination.total,
                pageSize: pagination.pageSize,
                onChange: handlePageChange,
                showSizeChanger: false,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} из ${total}`,
                size: "small",
              }
            : false
        }
        style={{
          fontSize: "14px",
        }}
      />
    </div>
  );
};

export default PostsPage;
