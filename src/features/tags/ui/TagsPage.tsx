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

const TagsPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tags = useSelector(selectTagsItems);
  const loading = useSelector(selectTagsLoading);
  const pagination = useSelector(selectTagsPagination);

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
    <div>
      <div
        style={{
          marginBottom: 16,
          padding: 6,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Теги</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Добавить тег
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={tags}
        loading={loading}
        rowKey="id"
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
              }
            : false
        }
      />
    </div>
  );
};

export default TagsPage;
