import { apiClient } from "../../../shared";
import {
  CreateMenuTypeRequest,
  UpdateMenuTypeRequest,
  CreateMenuItemRequest,
  UpdateMenuItemRequest,
  MenuItemFlat,
} from "../model/types";
import { mockMenuStorage } from "../lib/mockStorage";

export const menuApi = {
  // Menu Types
  fetchMenuTypes: () => {
    return apiClient.get("/manage/menu/types");
  },

  addMenuType: (data: CreateMenuTypeRequest) => {
    const formData = new FormData();
    formData.append("id", data.id);
    formData.append("name", data.name);
    return apiClient.post("/manage/menu/types/add", formData);
  },

  editMenuType: (data: UpdateMenuTypeRequest) => {
    const formData = new FormData();
    formData.append("name", data.name);
    return apiClient.post(`/manage/menu/types/edit?id=${data.id}`, formData);
  },

  removeMenuType: (id: string) => {
    return apiClient.delete(`/manage/menu/types/remove?id=${id}`);
  },

  // Menu Items
  fetchMenuTree: (typeId: string) => {
    return apiClient.get(`/manage/menu/items/tree?typeId=${typeId}`);
  },

  fetchMenuTreeList: async (typeId: string) => {
    const mockItems = mockMenuStorage.getItems(typeId);
    return { data: mockItems };
  },

  addMenuItem: async (
    data: CreateMenuItemRequest
  ): Promise<{ data: MenuItemFlat }> => {
    const newItem: MenuItemFlat = {
      id: `mock_${Date.now()}`,
      name: data.name,
      parentId: data.parentId || null,
      customUrl: data.url || undefined,
      sort: data.sort,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockMenuStorage.addItem(data.typeId, newItem);
    return { data: newItem };
  },

  editMenuItem: async (
    data: UpdateMenuItemRequest
  ): Promise<{ data: MenuItemFlat }> => {
    const items = mockMenuStorage.getItems(data.typeId);
    const existingItem = items.find((item) => item.id === data.id);

    if (!existingItem) {
      throw new Error("Item not found");
    }

    const updatedItem: MenuItemFlat = {
      ...existingItem,
      name: data.name,
      parentId: data.parentId || null,
      customUrl: data.url || undefined,
      sort: data.sort,
      updatedAt: new Date().toISOString(),
    };

    mockMenuStorage.updateItem(data.typeId, updatedItem);
    return { data: updatedItem };
  },

  removeMenuItem: async (typeId: string, id: string): Promise<void> => {
    mockMenuStorage.removeItem(typeId, id);
  },
};
