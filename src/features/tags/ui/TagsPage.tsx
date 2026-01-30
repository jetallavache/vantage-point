import React, { useEffect } from "react";
import { Table, Button, Space, Popconfirm, Tag, Tooltip } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchTagsRequest, deleteTagRequest } from "../model/actions";
import {
  selectTagsItems,
  selectTagsLoading,
  selectTagsPagination,
} from "../model/selectors";
import { HashTag } from "../../../shared/ui/HashTag";
import { useIsMobile } from "../../../shared/hooks/useIsMobile";

const TagsPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tags = useSelector(selectTagsItems);
  const loading = useSelector(selectTagsLoading);
  const pagination = useSelector(selectTagsPagination);
  const isMobile = useIsMobile();

  useEffect(() => {
    dispatch(fetchTagsRequest({ page: 1 }));
  }, [dispatch]);

  const handleDelete = (id: number) => {
    dispatch(deleteTagRequest(id));
  };

  const handlePageChange = (page: number) => {
    dispatch(fetchTagsRequest({ page }));
  };

  const handleAdd = () => {
    navigate("/tags/add");
  };

  const handleEdit = (tag: any) => {
    navigate(`/tags/edit/${tag.id}`);
  };

  const handleViewDetail = (id: number) => {
    navigate(`/tags/detail/${id}`);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      responsive: ["lg"] as any,
    },
    {
      title: "Код",
      dataIndex: "code",
      key: "code",
      width: 120,
      responsive: ["md"] as any,
    },
    {
      title: "Название",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
      render: (tagName: string) => <HashTag tag={tagName} />,
    },
    {
      title: "Сортировка",
      dataIndex: "sort",
      key: "sort",
      width: 120,
      responsive: ["sm"] as any,
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
                handleEdit(record);
              }}
            />
          </Tooltip>
          <Popconfirm
            title="Удалить тег?"
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
          onClick={handleAdd}
          size={isMobile ? "small" : "middle"}
        >
          Добавить тег
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={tags}
        loading={loading}
        rowKey="id"
        size="small"
        onRow={(record) => ({
          onClick: () => handleViewDetail(record.id),
          style: { cursor: "pointer" },
        })}
        scroll={{ x: 300 }}
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

export default TagsPage;
