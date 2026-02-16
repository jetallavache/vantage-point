import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Popconfirm,
  Tooltip,
  Modal,
  message,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchTagsRequest,
  deleteTagRequest,
  deleteBulkTagsRequest,
} from "../model/actions";
import { selectTagsItems, selectTagsLoading } from "../model/selectors";
import {
  HashTag,
  useIsMobile,
  MultipleRemoveItem,
  SafeAreaWrapper,
} from "../../../shared";
import { TableRowSelection } from "antd/es/table/interface";
import { Tag } from "../model/types";

const TagsPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tags = useSelector(selectTagsItems);
  const loading = useSelector(selectTagsLoading);
  const isMobile = useIsMobile();
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);

  const rowSelection: TableRowSelection<Tag> = {
    selectedRowKeys,
    onChange: (keys) => {
      setSelectedRowKeys(keys as number[]);
    },
  };

  const handleBulkDelete = () => {
    Modal.confirm({
      title: "Удалить выбранные теги?",
      content: `Будет удалено тегов: ${selectedRowKeys.length}`,
      okText: "Удалить",
      cancelText: "Отмена",
      okButtonProps: { danger: true },
      onOk: () => {
        dispatch(deleteBulkTagsRequest(selectedRowKeys));
        setSelectedRowKeys([]);
        message.success(`Теги: ${selectedRowKeys.toLocaleString()} удалены`);
      },
    });
  };

  useEffect(() => {
    dispatch(fetchTagsRequest({ page: 1 }));
  }, [dispatch]);

  const handleDelete = (id: number) => {
    dispatch(deleteTagRequest(id));
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
      width: 85,
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
        <MultipleRemoveItem
          selectedCount={selectedRowKeys.length}
          onBulkDelete={handleBulkDelete}
        />
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
        rowKey="id"
        rowSelection={rowSelection}
        columns={columns}
        dataSource={tags}
        loading={loading}
        size="small"
        onRow={(record) => ({
          onClick: () => handleViewDetail(record.id),
          style: { cursor: "pointer" },
        })}
        scroll={{ x: 300 }}
        style={{
          fontSize: "14px",
        }}
      />
    </SafeAreaWrapper>
  );
};

export default TagsPage;
