import { apiClient } from "../../../shared";
import {
  CreateMenuTypeRequest,
  UpdateMenuTypeRequest,
  CreateMenuItemRequest,
  UpdateMenuItemRequest,
  SaveMenuStructureRequest,
} from "../model/types";

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

  fetchMenuTreeList: (typeId: string) => {
    return apiClient.get(`/manage/menu/items/tree-list?typeId=${typeId}`);
  },

  addMenuItem: (data: CreateMenuItemRequest) => {
    const formData = new FormData();
    formData.append("typeId", data.typeId);
    if (data.parentId) formData.append("parentId", data.parentId);
    formData.append("name", data.name);
    if (data.url) formData.append("customUrl", data.url);
    formData.append("sort", data.sort.toString());
    return apiClient.post("/manage/menu/items/add", formData);
  },

  editMenuItem: (data: UpdateMenuItemRequest) => {
    const formData = new FormData();
    formData.append("typeId", data.typeId);
    if (data.parentId) formData.append("parentId", data.parentId);
    formData.append("name", data.name);
    if (data.url) formData.append("customUrl", data.url);
    formData.append("sort", data.sort.toString());
    return apiClient.post(`/manage/menu/items/edit?id=${data.id}`, formData);
  },

  removeMenuItem: (id: string) => {
    return apiClient.delete(`/manage/menu/items/remove?id=${id}`);
  },

  // saveMenuStructure: (data: SaveMenuStructureRequest) => {
  //   return apiClient.post("/manage/menu/items/save-structure", data);
  // },
};
