export interface MenuType {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface MenuItemTree {
  id: string;
  name: string;
  route?: string;
  customUrl?: string;
  sort: number;
  children?: MenuItemTree[];
}

/* Плоский список */
export interface MenuItemFlat {
  id: string;
  name: string;
  parentId: string | null;
  isParent?: number;
  customUrl?: string;
  route?: string;
  routeParams?: string;
  leftTree?: number;
  rightTree?: number;
  lvlTree?: number;
  sort: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface MenuState {
  menuTypes: MenuType[];
  activeTypeId: string | null;
  tree: MenuItemTree[];
  treeList: MenuItemFlat[];
  loading: boolean;
  dirty: boolean;
  error: string | null;
  validationErrors?: Record<string, string>;
  formError?: string;
  isSubmitting: boolean;
}

export interface CreateMenuTypeRequest {
  id: string;
  name: string;
}

export interface UpdateMenuTypeRequest {
  id: string;
  name: string;
}

export interface CreateMenuItemRequest {
  typeId: string;
  parentId?: string | null;
  name: string;
  url?: string | null;
  sort: number;
}

export interface UpdateMenuItemRequest extends CreateMenuItemRequest {
  id: string;
}

export interface SaveMenuStructureRequest {
  items: Array<{
    id: string;
    parentId: string | null;
    sort: number;
  }>;
}
