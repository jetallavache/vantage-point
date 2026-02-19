import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Select, Button, Space, Spin, Empty } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  OrderedListOutlined,
} from "@ant-design/icons";
import * as actions from "../model/actions";
import * as selectors from "../model/selectors";
import { MenuTree } from "./MenuTree";
import { MenuTypeForm } from "./MenuTypeForm";
import { MenuItemForm } from "./MenuItemForm";
import { buildTree, flattenTree } from "../lib/utils";
import { MenuItemFlat, MenuType } from "../model/types";
import { SafeAreaWrapper, useIsMobile } from "../../../shared";

export const MenuManagePage: React.FC = () => {
  const dispatch = useDispatch();
  const menuTypes = useSelector(selectors.selectMenuTypes);
  const activeTypeId = useSelector(selectors.selectActiveTypeId);
  const treeList = useSelector(selectors.selectMenuTreeList);
  const loading = useSelector(selectors.selectMenuLoading);

  const [typeFormVisible, setTypeFormVisible] = useState(false);
  const [itemFormVisible, setItemFormVisible] = useState(false);

  const [activeType, setActiveType] = useState<MenuType | null>(null);

  const [activeItem, setActiveItem] = useState<MenuItemFlat | null>(null);

  const isMobile = useIsMobile();

  useEffect(() => {
    dispatch(actions.fetchMenuTypesRequest());
  }, [dispatch]);

  useEffect(() => {
    if (activeTypeId) {
      dispatch(actions.fetchMenuTreeListRequest(activeTypeId));
    }
  }, [dispatch, activeTypeId]);

  /* Menu Type */
  const handleTypeChange = (typeId: string) => {
    dispatch(actions.setActiveMenuType(typeId));

    const menuType = menuTypes.find((item) => item.id === typeId);
    if (menuType) {
      setActiveType(menuType);
    }
  };

  const handleAddType = () => {
    setActiveType(null);
    setTypeFormVisible(true);
  };

  const handleEditType = () => {
    setTypeFormVisible(true);
  };

  /* Menu Item */
  const handleAddItem = (parentId?: string) => {
    setActiveItem(null);
    setItemFormVisible(true);
  };

  const handleEditItem = (item: MenuItemFlat) => {
    setActiveItem(item);
    setItemFormVisible(true);
  };

  const handleDeleteItem = (itemId: string) => {
    dispatch(actions.removeMenuItemRequest(itemId));
  };

  const tree = buildTree(treeList);

  return (
    <SafeAreaWrapper>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          gap: "1em",
        }}
      >
        <Space.Compact>
          <Space.Addon>
            <OrderedListOutlined />
          </Space.Addon>
          <Select
            placeholder="Выберите тип меню"
            style={{ width: 200 }}
            size={isMobile ? "small" : "middle"}
            value={activeTypeId}
            onChange={handleTypeChange}
            options={menuTypes.map((type) => ({
              label: type.name,
              value: type.id,
            }))}
          />
          {activeTypeId && (
            <Button
              variant="outlined"
              icon={<EditOutlined />}
              onClick={handleEditType}
              size={isMobile ? "small" : "middle"}
            >
              Ред.
            </Button>
          )}
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size={isMobile ? "small" : "middle"}
            onClick={handleAddType}
          >
            Новое меню
          </Button>
        </Space.Compact>
      </div>

      {loading && <Spin size="large" />}

      {activeTypeId && !loading && tree.length === 0 && (
        <Empty description="Нет элементов меню" style={{ marginTop: 40 }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleAddItem()}
          >
            Создать первый пункт
          </Button>
        </Empty>
      )}

      {activeTypeId && !loading && tree.length > 0 && (
        <MenuTree
          data={tree}
          onEdit={handleEditItem}
          onDelete={handleDeleteItem}
          onAdd={handleAddItem}
        />
      )}

      <MenuTypeForm
        visible={typeFormVisible}
        activeType={activeType}
        onCancel={() => setTypeFormVisible(false)}
      />

      <MenuItemForm
        visible={itemFormVisible}
        activeItem={activeItem}
        activeType={activeType}
        onCancel={() => setItemFormVisible(false)}
      />
    </SafeAreaWrapper>
  );
};
