import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Select, Button, Space, Spin } from "antd";
import { PlusOutlined, SaveOutlined, EditOutlined } from "@ant-design/icons";
import * as actions from "../model/actions";
import * as selectors from "../model/selectors";
import { MenuTree } from "./MenuTree";
import { MenuTypeForm } from "./MenuTypeForm";
import { MenuItemForm } from "./MenuItemForm";
import { buildTree, flattenTree } from "../lib/utils";
import { CreateMenuItemRequest, MenuItemFlat, MenuType } from "../model/types";
import { SafeAreaWrapper, useIsMobile } from "../../../shared";

export const MenuManagePage: React.FC = () => {
  const dispatch = useDispatch();
  const menuTypes = useSelector(selectors.selectMenuTypes);
  const activeTypeId = useSelector(selectors.selectActiveTypeId);

  const treeList = useSelector(selectors.selectMenuTreeList);

  const loading = useSelector(selectors.selectMenuLoading);
  const dirty = useSelector(selectors.selectMenuDirty);
  // const error = useSelector(selectors.selectMenuError);

  const [typeFormVisible, setTypeFormVisible] = useState(false);
  const [itemFormVisible, setItemFormVisible] = useState(false);

  const [activeType, setActiveType] = useState<MenuType | null>(null);

  const [activeItem, setActiveItem] = useState<MenuItemFlat | null>(null); // ! еще нет элемента, он пока не создан

  const isMobile = useIsMobile();

  useEffect(() => {
    dispatch(actions.fetchMenuTypesRequest());
  }, [dispatch]);

  useEffect(() => {
    if (activeTypeId) {
      dispatch(actions.fetchMenuTreeListRequest(activeTypeId)); // ! получаем плоский список
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

  const handleDeleteType = () => {};

  /* Menu Item */

  const handleAddItem = () => {
    setActiveItem(null);
    setItemFormVisible(true);
  };

  const handleEditItem = (/* */) => {
    // const menuItem = treeList.find(item => item.id === activeTypeId);
    // if (menuItem) {
    //   setActiveItem(menuItem);
    //   setItemFormVisible(true);
    // }
  };

  const handleDeleteItem = (itemId: string) => {
    dispatch(actions.removeMenuItemRequest(itemId));
  };

  const handleSaveStructure = () => {
    const tree = buildTree(treeList);
    const flattenedItems = flattenTree(tree);

    dispatch(actions.saveMenuStructureRequest({ items: flattenedItems }));
  };

  const tree = buildTree(treeList);

  useEffect(() => {
    console.log("Tree build: ", tree);
  }, [dispatch]);

  return (
    <SafeAreaWrapper>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          // alignItems: "center",
          gap: "1em",
        }}
      >
        <Space.Compact>
          <Space.Addon>$</Space.Addon>
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
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size={isMobile ? "small" : "middle"}
            onClick={handleAddType}
          >
            New
          </Button>
          {activeTypeId && (
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={handleEditType}
              size={isMobile ? "small" : "middle"}
            >
              Ред.
            </Button>
          )}
        </Space.Compact>
        <Space.Compact>
          <Space.Addon>$</Space.Addon>
          {activeTypeId && (
            <Button
              icon={<PlusOutlined />}
              size={isMobile ? "small" : "middle"}
              onClick={() => handleAddItem()}
            >
              Добавить пункт
            </Button>
          )}
          <Button
            type="primary"
            icon={<SaveOutlined />}
            disabled={!dirty}
            size={isMobile ? "small" : "middle"}
            onClick={handleSaveStructure}
          >
            Сохранить структуру
          </Button>
        </Space.Compact>
      </div>

      {loading && <Spin size="large" />}

      {activeTypeId && !loading && (
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
