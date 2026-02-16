import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Popconfirm,
  Avatar,
  Tooltip,
  Tag,
  Modal,
  message,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchAuthorsRequest,
  deleteAuthorRequest,
  deleteBulkAuthorsRequest,
} from "../model/actions";
import {
  selectAuthorsItems,
  selectAuthorsLoading,
  selectAuthorsPagination,
} from "../model/selectors";
import {
  MultipleRemoveItem,
  SafeAreaWrapper,
  useIsMobile,
} from "../../../shared";
import { TableRowSelection } from "antd/lib/table/interface";
import { Author } from "../model/types";

const AuthorsPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authors = useSelector(selectAuthorsItems);
  const loading = useSelector(selectAuthorsLoading);
  const pagination = useSelector(selectAuthorsPagination);
  const isMobile = useIsMobile();
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);

  const rowSelection: TableRowSelection<Author> = {
    selectedRowKeys,
    onChange: (keys) => {
      setSelectedRowKeys(keys as number[]);
    },
  };

  const handleBulkDelete = () => {
    Modal.confirm({
      title: "Удалить выбранных авторов?",
      content: `Будет удалено авторов: ${selectedRowKeys.length}`,
      okText: "Удалить",
      cancelText: "Отмена",
      okButtonProps: { danger: true },
      onOk: () => {
        dispatch(deleteBulkAuthorsRequest(selectedRowKeys));
        setSelectedRowKeys([]);
        message.success(`Авторы: ${selectedRowKeys.toLocaleString()} удалены`);
      },
    });
  };

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
          Добавить автора
        </Button>
      </div>

      <Table
        rowKey="id"
        rowSelection={rowSelection}
        columns={columns}
        dataSource={authors}
        loading={loading}
        size="small"
        onRow={(record) => ({
          onClick: () => handleViewDetail(record.id),
          style: { cursor: "pointer" },
        })}
        // pagination={
        //   showPagination
        //     ? {
        //         current: pagination.current,
        //         total: pagination.total,
        //         pageSize: pagination.pageSize,
        //         onChange: handlePageChange,
        //         showSizeChanger: false,
        //         showQuickJumper: true,
        //         showTotal: (total, range) =>
        //           `${range[0]}-${range[1]} из ${total}`,
        //         size: "small",
        //       }
        //     : false
        // }
        style={{
          fontSize: "14px",
        }}
      />
    </SafeAreaWrapper>
  );
};

export default AuthorsPage;
