import React from "react";
import { useDispatch } from "react-redux";
import { Tree, Button, Space, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import type { DataNode } from "antd/es/tree";
import * as actions from "../model/actions";
import { MenuItemTree } from "../model/types";

interface MenuTreeProps {
  data: MenuItemTree[];
  onEdit: (item: any) => void;
  onDelete: (itemId: string) => void;
  onAdd: (parentId?: string) => void;
}

export const MenuTree: React.FC<MenuTreeProps> = ({
  data,
  onEdit,
  onDelete,
  onAdd,
}) => {
  const dispatch = useDispatch();

  const convertToTreeData = (items: MenuItemTree[]): DataNode[] => {
    return items.map((item) => ({
      key: item.id,
      title: (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>{item.name}</span>
          <Space size="small">
            <Button
              type="text"
              size="small"
              icon={<PlusOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                onAdd(item.id);
              }}
            />
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                onEdit(item);
              }}
            />
            <Popconfirm
              title="Удалить пункт меню?"
              description="Это действие нельзя отменить"
              onConfirm={(e) => {
                e?.stopPropagation();
                onDelete(item.id);
              }}
              okText="Да"
              cancelText="Нет"
            >
              <Button
                type="text"
                size="small"
                danger
                icon={<DeleteOutlined />}
                onClick={(e) => e.stopPropagation()}
              />
            </Popconfirm>
          </Space>
        </div>
      ),
      children: item.children ? convertToTreeData(item.children) : undefined,
    }));
  };

  const handleDrop = (info: any) => {
    const { dragNode, node, dropPosition, dropToGap } = info;

    let position: "before" | "after" | "inside";

    if (!dropToGap) {
      position = "inside";
    } else if (dropPosition === -1) {
      position = "before";
    } else {
      position = "after";
    }

    dispatch(
      actions.moveMenuItemRequest({
        dragId: dragNode.key,
        dropId: node.key,
        position,
      })
    );
  };

  return (
    <Tree
      draggable
      blockNode
      onDrop={handleDrop}
      treeData={convertToTreeData(data)}
      defaultExpandAll
    />
  );
};
