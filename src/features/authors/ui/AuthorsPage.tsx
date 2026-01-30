import React, { useEffect } from "react";
import { Table, Button, Space, Popconfirm, Avatar, Tooltip } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAuthorsRequest, deleteAuthorRequest } from "../model/actions";
import {
  selectAuthorsItems,
  selectAuthorsLoading,
  selectAuthorsPagination,
} from "../model/selectors";
import { useIsMobile } from "../../../shared/hooks/useIsMobile";

const AuthorsPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authors = useSelector(selectAuthorsItems);
  const loading = useSelector(selectAuthorsLoading);
  const pagination = useSelector(selectAuthorsPagination);
  const isMobile = useIsMobile();

  useEffect(() => {
    dispatch(fetchAuthorsRequest({ page: 1 }));
  }, [dispatch]);

  const handleDelete = (id: number) => {
    dispatch(deleteAuthorRequest(id));
  };

  const handlePageChange = (page: number) => {
    dispatch(fetchAuthorsRequest({ page }));
  };

  const handleViewDetail = (id: number) => {
    navigate(`/authors/detail/${id}`);
  };

  const handleAdd = () => {
    navigate("/authors/add");
  };

  const handleEdit = (author: any) => {
    navigate(`/authors/edit/${author.id}`);
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
      title: "Аватар",
      dataIndex: "avatar",
      key: "avatar",
      width: 80,
      responsive: ["sm"] as any,
      render: (avatar: any) => (
        <Avatar src={avatar?.url} icon={<UserOutlined />} size="large" />
      ),
    },
    {
      title: "ФИО",
      key: "fullName",
      ellipsis: true,
      render: (_: any, record: any) =>
        `${record.lastName} ${record.name} ${record.secondName || ""}`.trim(),
    },
    {
      title: "Действия",
      key: "actions",
      width: 100,
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
                handleEdit(record);
              }}
            />
          </Tooltip>
          <Popconfirm
            title="Удалить автора?"
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
    <div>
      <div
        style={{
          marginBottom: 16,
          padding: 6,
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          size={isMobile ? "small" : "middle"}
        >
          Добавить автора
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={authors}
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

export default AuthorsPage;
