import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Select, Button, Space, Spin, Empty, Popconfirm, Row, Col } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  OrderedListOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import * as actions from "../model/actions";
import * as selectors from "../model/selectors";
import { MenuTree } from "./MenuTree";
import { MenuTypeForm } from "./MenuTypeForm";
import { MenuItemAddForm } from "./MenuItemAddForm";
import { MenuItemEditForm } from "./MenuItemEditForm";
import { buildTree } from "../lib/utils";
import { MenuItemFlat, MenuType } from "../model/types";
import { SafeAreaWrapper, useIsMobile } from "../../../shared";

export const MenuManagePage: React.FC = () => {
  const dispatch = useDispatch();
  const menuTypes = useSelector(selectors.selectMenuTypes);
  const activeTypeId = useSelector(selectors.selectActiveTypeId);
  const treeList = useSelector(selectors.selectMenuTreeList);
  const loading = useSelector(selectors.selectMenuLoading);
  const isSubmitting = useSelector(selectors.selectMenuIsSubmitting);
  const validationErrors = useSelector(selectors.selectMenuValidationErrors);
  const formError = useSelector(selectors.selectMenuFormError);

  const [typeFormVisible, setTypeFormVisible] = useState(false);
  const [editFormVisible, setEditFormVisible] = useState(false);
  const [wasSubmitting, setWasSubmitting] = useState(false);

  const [activeType, setActiveType] = useState<MenuType | null>(null);
  const [activeItem, setActiveItem] = useState<MenuItemFlat | null>(null);

  const isMobile = useIsMobile();

  useEffect(() => {
    dispatch(actions.fetchMenuTypesRequest());
  }, [dispatch]);

  useEffect(() => {
    if (activeTypeId) {
      dispatch(actions.fetchMenuTreeListRequest(activeTypeId));
      const menuType = menuTypes.find((item) => item.id === activeTypeId);
      if (menuType) {
        setActiveType(menuType);
      }
    }
  }, [dispatch, activeTypeId, menuTypes]);

  useEffect(() => {
    if (wasSubmitting && !isSubmitting && !validationErrors && !formError) {
      setTypeFormVisible(false);
      setEditFormVisible(false);
    }
    setWasSubmitting(isSubmitting);
  }, [isSubmitting, wasSubmitting, validationErrors, formError]);

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

  const handleDeleteType = () => {
    if (activeType) {
      dispatch(actions.removeMenuTypeRequest(activeType.id));
    }
  };

  /* Menu Item */
  const handleEditItem = (item: MenuItemFlat) => {
    setActiveItem(item);
    setEditFormVisible(true);
  };

  const handleDeleteItem = (itemId: string) => {
    dispatch(actions.removeMenuItemRequest(itemId));
  };

  const tree = buildTree(treeList);

  return (
    <SafeAreaWrapper
      style={{
        maxHeight: "70%",
      }}
    >
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
            style={{
              width: isMobile ? (activeTypeId ? "54%" : "86%") : 200,
            }}
            size={isMobile ? "small" : "middle"}
            value={activeTypeId}
            onChange={handleTypeChange}
            options={menuTypes
              .filter((type) => type?.name && type?.id)
              .map((type) => ({
                label: type.name,
                value: type.id,
              }))}
          />
          {activeTypeId && (
            <Button
              variant="solid"
              color="blue"
              icon={<EditOutlined />}
              onClick={handleEditType}
              size={isMobile ? "small" : "middle"}
              style={{ width: isMobile ? "16%" : 60 }}
            ></Button>
          )}
          {activeTypeId && (
            <Popconfirm
              key="delete"
              title="Удалить тип меню?"
              description="Это действие нельзя отменить"
              onConfirm={handleDeleteType}
              okText="Да"
              cancelText="Нет"
            >
              <Button
                variant="solid"
                color="red"
                danger
                icon={<DeleteOutlined />}
                size={isMobile ? "small" : "middle"}
                style={{ width: isMobile ? "16%" : 60 }}
              ></Button>
            </Popconfirm>
          )}
          <Button
            variant="solid"
            color="green"
            icon={<PlusOutlined />}
            size={isMobile ? "small" : "middle"}
            onClick={handleAddType}
            style={{ width: isMobile ? "16%" : 60 }}
          ></Button>
        </Space.Compact>
      </div>

      {loading && <Spin size="large" />}

      {activeTypeId && !loading && (
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={16}>
            <div
              style={
                isMobile
                  ? {
                      overflowY: "auto",
                      maxHeight: "calc(100vh - 350px)",
                    }
                  : {
                      maxHeight: "calc(100vh - 200px)",
                      overflowY: "auto",
                    }
              }
            >
              {tree.length === 0 ? (
                <Empty
                  description="Нет элементов меню"
                  style={{ marginTop: 80 }}
                />
              ) : (
                tree.length > 0 && (
                  <MenuTree
                    data={tree}
                    onEdit={handleEditItem}
                    onDelete={handleDeleteItem}
                  />
                )
              )}
            </div>
          </Col>
          <Col xs={24} lg={8}>
            <MenuItemAddForm activeType={activeType} />
          </Col>
        </Row>
      )}

      <MenuTypeForm
        visible={typeFormVisible}
        activeType={activeType}
        onCancel={() => setTypeFormVisible(false)}
      />

      <MenuItemEditForm
        visible={editFormVisible}
        activeItem={activeItem}
        activeType={activeType}
        onCancel={() => setEditFormVisible(false)}
      />
    </SafeAreaWrapper>
  );
};
