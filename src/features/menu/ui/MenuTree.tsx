import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tree, Button, Space, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { DataNode } from "antd/es/tree";
import * as actions from "../model/actions";
import * as selectors from "../model/selectors";
import { MenuItemTree, MenuItemFlat } from "../model/types";
import { useIsMobile, useTouchDrag } from "../../../shared/hooks";

interface MenuTreeProps {
  data: MenuItemTree[];
  onEdit: (item: MenuItemFlat) => void;
  onDelete: (itemId: string) => void;
}

export const MenuTree: React.FC<MenuTreeProps> = ({
  data,
  onEdit,
  onDelete,
}) => {
  const dispatch = useDispatch();
  const treeList = useSelector(selectors.selectMenuTreeList);
  const isMobile = useIsMobile();

  const findFlatItem = (id: string): MenuItemFlat | undefined => {
    return treeList.find((item) => item.id === id);
  };

  const handleMove = useCallback(
    (
      dragId: string,
      dropId: string,
      position: "before" | "after" | "inside"
    ) => {
      dispatch(actions.moveMenuItemRequest({ dragId, dropId, position }));
    },
    [dispatch]
  );

  useTouchDrag(isMobile, {
    onDrop: handleMove,
  });

  const convertToTreeData = (items: MenuItemTree[]): DataNode[] => {
    return items.map((item) => ({
      key: item.id,
      title: (
        <div
          data-node-key={item.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>
            {item.name} <span style={{ color: "grey" }}>~{item.customUrl}</span>
          </span>
          <Space size="small">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                const flatItem = findFlatItem(item.id);
                if (flatItem) onEdit(flatItem);
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

    handleMove(dragNode.key, node.key, position);
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
