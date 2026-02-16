import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Menu } from "antd";
import type { MenuProps } from "antd";
import * as actions from "../model/actions";
import * as selectors from "../model/selectors";
import { MenuItemTree } from "../model/types";

interface MenuSiderProps {
  typeId: string;
  onMenuClick?: (key: string, item: MenuItemTree) => void;
}

export const MenuSider: React.FC<MenuSiderProps> = ({
  typeId,
  onMenuClick,
}) => {
  const dispatch = useDispatch();
  const tree = useSelector(selectors.selectMenuTree);

  useEffect(() => {
    if (typeId) {
      dispatch(actions.fetchMenuTreeRequest(typeId));
    }
  }, [dispatch, typeId]);

  const convertToMenuItems = (items: MenuItemTree[]): MenuProps["items"] => {
    return items.map((item) => ({
      key: item.id,
      label: item.name,
      children: item.children ? convertToMenuItems(item.children) : undefined,
      onClick: onMenuClick ? () => onMenuClick(item.id, item) : undefined,
    }));
  };

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (onMenuClick) {
      const findItem = (
        items: MenuItemTree[],
        targetKey: string
      ): MenuItemTree | null => {
        for (const item of items) {
          if (item.id === targetKey) return item;
          if (item.children) {
            const found = findItem(item.children, targetKey);
            if (found) return found;
          }
        }
        return null;
      };

      const item = findItem(tree, key);
      if (item) {
        onMenuClick(key, item);
      }
    }
  };

  return (
    <Menu
      mode="inline"
      items={convertToMenuItems(tree)}
      onClick={handleMenuClick}
    />
  );
};
