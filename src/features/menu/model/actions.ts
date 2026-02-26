import { createAction } from "@reduxjs/toolkit";
import {
  MenuType,
  MenuItemTree,
  MenuItemFlat,
  CreateMenuTypeRequest,
  UpdateMenuTypeRequest,
  CreateMenuItemRequest,
  UpdateMenuItemRequest,
  SaveMenuStructureRequest,
} from "./types";
import { DomainError } from "../../../shared/api";

/* Menu Types */
export const fetchMenuTypesRequest = createAction("menu/fetchMenuTypesRequest");
export const fetchMenuTypesSuccess = createAction<MenuType[]>(
  "menu/fetchMenuTypesSuccess"
);
export const fetchMenuTypesFailure = createAction<string>(
  "menu/fetchMenuTypesFailure"
);

export const addMenuTypeRequest = createAction<CreateMenuTypeRequest>(
  "menu/addMenuTypeRequest"
);
export const addMenuTypeSuccess = createAction<MenuType>(
  "menu/addMenuTypeSuccess"
);
export const addMenuTypeFailure = createAction<DomainError>(
  "menu/addMenuTypeFailure"
);

export const editMenuTypeRequest = createAction<UpdateMenuTypeRequest>(
  "menu/editMenuTypeRequest"
);
export const editMenuTypeSuccess = createAction<MenuType>(
  "menu/editMenuTypeSuccess"
);
export const editMenuTypeFailure = createAction<DomainError>(
  "menu/editMenuTypeFailure"
);

export const removeMenuTypeRequest = createAction<string>(
  "menu/removeMenuTypeRequest"
);
export const removeMenuTypeSuccess = createAction<string>(
  "menu/removeMenuTypeSuccess"
);
export const removeMenuTypeFailure = createAction<string>(
  "menu/removeMenuTypeFailure"
);

/* Menu Items */
export const fetchMenuTreeRequest = createAction<string>(
  "menu/fetchMenuTreeRequest"
);
export const fetchMenuTreeSuccess = createAction<MenuItemTree[]>(
  "menu/fetchMenuTreeSuccess"
);
export const fetchMenuTreeFailure = createAction<string>(
  "menu/fetchMenuTreeFailure"
);

export const fetchMenuTreeListRequest = createAction<string>(
  "menu/fetchMenuTreeListRequest"
);
export const fetchMenuTreeListSuccess = createAction<MenuItemFlat[]>(
  "menu/fetchMenuTreeListSuccess"
);
export const fetchMenuTreeListFailure = createAction<string>(
  "menu/fetchMenuTreeListFailure"
);

export const addMenuItemRequest = createAction<CreateMenuItemRequest>(
  "menu/addMenuItemRequest"
);
export const addMenuItemSuccess = createAction<MenuItemFlat>(
  "menu/addMenuItemSuccess"
);
export const addMenuItemFailure = createAction<DomainError>(
  "menu/addMenuItemFailure"
);

export const editMenuItemRequest = createAction<UpdateMenuItemRequest>(
  "menu/editMenuItemRequest"
);
export const editMenuItemSuccess = createAction<MenuItemFlat>(
  "menu/editMenuItemSuccess"
);
export const editMenuItemFailure = createAction<DomainError>(
  "menu/editMenuItemFailure"
);

export const removeMenuItemRequest = createAction<string>(
  "menu/removeMenuItemRequest"
);
export const removeMenuItemSuccess = createAction<string>(
  "menu/removeMenuItemSuccess"
);
export const removeMenuItemFailure = createAction<string>(
  "menu/removeMenuItemFailure"
);

/* Drag & Drop */
export const moveMenuItemRequest = createAction<{
  dragId: string;
  dropId: string;
  position: "before" | "after" | "inside";
}>("menu/moveMenuItemRequest");

export const saveMenuStructureRequest = createAction<SaveMenuStructureRequest>(
  "menu/saveMenuStructureRequest"
);
export const saveMenuStructureSuccess = createAction(
  "menu/saveMenuStructureSuccess"
);
export const saveMenuStructureFailure = createAction<string>(
  "menu/saveMenuStructureFailure"
);

/* UI Actions */
export const setActiveMenuType = createAction<string | null>(
  "menu/setActiveMenuType"
);
export const setDirty = createAction<boolean>("menu/setDirty");

export const clearMenuFormErrors = createAction("menu/clearMenuFormErrors");
